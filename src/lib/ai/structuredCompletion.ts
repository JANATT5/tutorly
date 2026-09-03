import type { z } from 'zod'
import type { ChatCompletionTool } from 'openai/resources/chat/completions'
import { ai, AI_MODEL } from './client'

/**
 * Asks the model for a specific JSON shape back, instead of open-ended
 * chat text — used by the career-quiz recommendation and Planr roadmap
 * features, which both need a real object back, not a paragraph.
 *
 * How: a single tool is offered whose *parameters* schema IS the shape we
 * want, and `tool_choice: "required"` forces the model to always respond
 * by calling it. This is more reliable with a small local model than
 * trusting `response_format: json_object` to always produce valid JSON.
 *
 * Note: `tool_choice: "required"` hung against qwen3:4b on this project's
 * local Ollama setup — tested directly, confirmed model-specific (not an
 * Ollama-wide limitation). The default model, llama3.2:3b, handles it
 * fine (~5s, tested directly). If the model is ever switched back to
 * qwen3:4b via OPENAI_MODEL, this will need `tool_choice: "auto"` plus
 * explicit prompt instructions again instead — this is a real fallback
 * error, not a crash, either way if the model responds with plain text.
 *
 * Observed quirk (tested directly against llama3.2:3b): for a schema with
 * a nested array-of-objects property (e.g. `courses: [...]`), the model
 * reliably calls the tool correctly but sometimes serializes that one
 * property as a JSON *string* instead of a native JSON array/object —
 * i.e. `{"courses": "[{...}]"}` instead of `{"courses": [{...}]}`. Real
 * model behavior, not a parsing bug on this end, so `repairNestedJson`
 * below walks the parsed arguments and JSON-parses any string value that
 * looks like a JSON array/object before validating — recovers the common
 * case; a genuinely malformed generation still falls through to the error
 * below.
 */
function repairNestedJson(value: unknown): unknown {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    const looksLikeJson =
      (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
      (trimmed.startsWith('{') && trimmed.endsWith('}'))
    if (!looksLikeJson) return value
    try {
      return repairNestedJson(JSON.parse(trimmed))
    } catch {
      return value
    }
  }
  if (Array.isArray(value)) return value.map(repairNestedJson)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [key, repairNestedJson(v)]),
    )
  }
  return value
}
async function attemptStructuredCompletion<T>(options: {
  system: string
  user: string
  toolName: string
  toolDescription: string
  parameters: Record<string, unknown>
  schema: z.ZodType<T>
}): Promise<T> {
  const tool: ChatCompletionTool = {
    type: 'function',
    function: {
      name: options.toolName,
      description: options.toolDescription,
      parameters: options.parameters,
    },
  }

  const response = await ai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: 'system', content: options.system },
      { role: 'user', content: options.user },
    ],
    tools: [tool],
    tool_choice: 'required',
  })

  const toolCall = response.choices[0]?.message.tool_calls?.find(
    (call) => call.type === 'function' && call.function.name === options.toolName,
  )
  if (!toolCall || toolCall.type !== 'function') {
    throw new Error('The AI did not return a structured result. Please try again.')
  }

  let rawArgs: unknown
  try {
    rawArgs = repairNestedJson(JSON.parse(toolCall.function.arguments))
  } catch {
    throw new Error('The AI returned an invalid response. Please try again.')
  }

  const parsed = options.schema.safeParse(rawArgs)
  if (!parsed.success) {
    throw new Error('The AI response did not match the expected shape. Please try again.')
  }

  return parsed.data
}

const MAX_ATTEMPTS = 3

/**
 * Up to 2 retries (3 attempts total) on top of `attemptStructuredCompletion`
 * — measured directly against llama3.2:3b, even the short imperative
 * prompt style above doesn't honor `tool_choice: "required"` (or produce a
 * schema-matching result) 100% of the time; measured per-attempt success
 * ranged ~65-95% depending on how deeply nested the requested shape is.
 * 3 independent attempts pushes the effective success rate well above any
 * single attempt without meaningfully hurting latency in practice — each
 * attempt is ~15-45s, so even a worst-case triple failure stays well under
 * 2-3 minutes. A third consecutive failure still surfaces the honest
 * "please try again" error instead of retrying forever.
 */
export async function structuredCompletion<T>(options: {
  system: string
  user: string
  toolName: string
  toolDescription: string
  /** JSON Schema for the tool's parameters — this IS the shape being asked for. */
  parameters: Record<string, unknown>
  /** Validates the model's parsed arguments against that same shape. */
  schema: z.ZodType<T>
}): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await attemptStructuredCompletion(options)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}
