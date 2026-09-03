import OpenAI from 'openai'

/**
 * Shared LLM client for every AI feature (chatbot, career-quiz
 * recommendation, Planr roadmap generation).
 *
 * With no env vars set, this points at a local Ollama server
 * (http://localhost:11434) — free, no API key, no signup. Ollama
 * implements the same OpenAI Chat Completions API shape, so this SDK
 * works against it unmodified — only `baseURL` changes.
 *
 * Default model is llama3.2:3b, not qwen3:4b — both were confirmed
 * working (including tool/function calling) on this machine, but qwen3:4b
 * reasons step-by-step by default even for trivial prompts, which measured
 * 1-6 tokens/sec here (1-4 minutes per response). llama3.2:3b doesn't do
 * that verbose chain-of-thought and is meaningfully faster for the same
 * hardware. If quality ever matters more than speed, qwen3:4b is still
 * pulled locally — just set OPENAI_MODEL=qwen3:4b.
 *
 * To switch to real OpenAI later: set OPENAI_API_KEY in .env to a real key
 * and leave OPENAI_BASE_URL unset. No code changes needed either way — see
 * the comment block in .env.
 */
export const ai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL ?? 'http://localhost:11434/v1',
  // Ollama ignores this value entirely, but the SDK requires *some*
  // non-empty string to be passed.
  apiKey: process.env.OPENAI_API_KEY ?? 'ollama',
})

export const AI_MODEL = process.env.OPENAI_MODEL ?? 'llama3.2:3b'
