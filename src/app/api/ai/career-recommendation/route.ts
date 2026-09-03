import { NextRequest } from 'next/server'
import { z } from 'zod'
import { structuredCompletion } from '@/lib/ai/structuredCompletion'
import { listSubjects } from '@/lib/ai/tools'
import { ok, fail } from '@/lib/apiResponse'

const requestSchema = z.object({
  // One entry per quiz question: what was asked, and what the student
  // picked. Sent as prompt+answer pairs (not just bare answer text) so the
  // model has real context instead of a list of disconnected phrases.
  answers: z.array(z.object({ prompt: z.string(), answer: z.string() })).min(1),
})

const pathSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
})
// subjectsToStrengthen lives at the top level, not per-path — it's really a
// whole-quiz-result concept ("here's what to work on"), not something that
// differs path-by-path, and the UI already unioned it across paths anyway.
// Also a reliability fix: tested directly against llama3.2:3b, a string
// array nested inside each array item (paths[].subjectsToStrengthen[]) was
// the least reliable shape it could return via tool-calling — flattening
// to one array-of-objects plus one flat array measurably improved it.
const responseSchema = z.object({
  paths: z.array(pathSchema).min(1).max(3),
  subjectsToStrengthen: z.array(z.string()),
})

// POST /api/ai/career-recommendation — takes a completed career quiz's
// answers, returns 1–3 suggested paths. Not a CRUD resource (single
// action, like /api/chat), so no schema.ts / [id] route here.
export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  const realSubjects = await listSubjects()

  const transcript = parsed.data.answers
    .map((a, i) => `Q${i + 1}: ${a.prompt}\nAnswer: ${a.answer}`)
    .join('\n\n')

  try {
    const result = await structuredCompletion({
      // Kept short and imperative on purpose — tested directly against the
      // local model (llama3.2:3b): a long explanatory system prompt made it
      // far more likely to answer in plain text instead of using the
      // required tool call. Domain detail lives in the tool/param
      // descriptions below instead, which doesn't hurt reliability the
      // same way.
      system: `Call return_recommendations with 1-3 career/university-major paths that fit this Grade 12 student's quiz answers. subjectsToStrengthen may only use names from this exact list: ${realSubjects.join(', ')}.`,
      user: transcript,
      toolName: 'return_recommendations',
      toolDescription:
        'Return 1 to 3 realistic career or university-major path recommendations for a Grade 12 student in Lebanon, based on their quiz answers.',
      parameters: {
        type: 'object',
        properties: {
          paths: {
            type: 'array',
            minItems: 1,
            maxItems: 3,
            items: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'e.g. "Computer Science", "Medicine"' },
                description: { type: 'string', description: 'One or two sentences on why this fits their answers.' },
              },
              required: ['title', 'description'],
            },
          },
          subjectsToStrengthen: {
            type: 'array',
            items: { type: 'string' },
            description: `Real subject names to focus on before university, only from: ${realSubjects.join(', ')}.`,
          },
        },
        required: ['paths', 'subjectsToStrengthen'],
      },
      schema: responseSchema,
    })

    // Small local models sometimes ignore the "only real subjects"
    // instruction — filter rather than trust it, so a hallucinated subject
    // name can never reach the UI.
    const realSubjectsLower = new Set(realSubjects.map((s) => s.toLowerCase()));
    const grounded = {
      paths: result.paths,
      subjectsToStrengthen: result.subjectsToStrengthen.filter((s) =>
        realSubjectsLower.has(s.toLowerCase()),
      ),
    }

    return ok(grounded)
  } catch (error) {
    console.error('POST /api/ai/career-recommendation failed:', error)
    return fail(
      502,
      error instanceof Error ? error.message : "Couldn't generate your results. Please try again.",
    )
  }
}
