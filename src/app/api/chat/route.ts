import { NextRequest } from 'next/server'
import { z } from 'zod'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { ai, AI_MODEL } from '@/lib/ai/client'
import { toolDefinitions, executeTool } from '@/lib/ai/tools'
import { ok, fail } from '@/lib/apiResponse'

// Not a CRUD resource, so no schema.ts / [id] route here — this is a
// single action endpoint, same shape POST /api/ai/career-recommendation
// and POST /api/ai/roadmap will have.
const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1),
      }),
    )
    .min(1),
})

const SYSTEM_PROMPT = `You are Tutorly's assistant, helping students and parents find tutors, subjects, and practice questions.

Rules:
- Only state facts that came back from a tool call (tutor names, prices, subjects, ratings, availability). Never invent or guess any of these.
- If a tool returns no results, say so plainly — don't make something up instead.
- If a question has nothing to do with Tutorly (tutors, subjects, bookings, practice questions), say you can only help with those topics.
- Keep answers short and conversational.`

// A tool-calling conversation can go several rounds (model asks for a
// tool, gets the result, asks for another...) — capped so a confused model
// can't loop forever on one request.
const MAX_TOOL_ROUNDS = 4

// POST /api/chat — one turn of the chatbot conversation. The client sends
// the full message history each time (no server-side conversation storage
// — see the ChatWidget component for why that's a deliberate, documented
// limitation for now) and gets back the assistant's next reply.
export async function POST(request: NextRequest) {
  const body = await request.json()

  const parsed = chatRequestSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...parsed.data.messages,
  ]

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await ai.chat.completions.create({
        model: AI_MODEL,
        messages,
        tools: toolDefinitions,
      })

      const message = response.choices[0]?.message
      if (!message) {
        return fail(502, "The AI didn't return a response. Please try again.")
      }

      const toolCalls = message.tool_calls?.filter((call) => call.type === 'function') ?? []

      if (toolCalls.length === 0) {
        // No more tools requested — this is the final answer.
        return ok({ role: 'assistant' as const, content: message.content ?? '' })
      }

      // The assistant's tool-call request has to go back into the
      // conversation before its results do, or the next call is malformed.
      messages.push(message)

      for (const call of toolCalls) {
        let result: unknown
        try {
          const args = call.function.arguments ? JSON.parse(call.function.arguments) : {}
          result = await executeTool(call.function.name, args)
        } catch (error) {
          result = { error: error instanceof Error ? error.message : 'Tool call failed.' }
        }
        messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) })
      }
    }

    return fail(502, "The AI couldn't finish answering that in time. Please try again.")
  } catch (error) {
    // Most likely cause here: Ollama isn't running, or the model isn't pulled.
    console.error('POST /api/chat failed:', error)
    return fail(502, "Couldn't reach the AI service. Is Ollama running?")
  }
}
