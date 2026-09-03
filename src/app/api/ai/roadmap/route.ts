import { NextRequest } from 'next/server'
import { z } from 'zod'
import { structuredCompletion } from '@/lib/ai/structuredCompletion'
import { ok, fail } from '@/lib/apiResponse'

const requestSchema = z.object({
  goal: z.string().min(1),
  currentLevel: z.string().min(1),
  // Subject name -> self-rated skill, e.g. { "Mathematics": "comfortable" }
  skillRatings: z.record(z.string(), z.enum(['beginner', 'comfortable', 'confident'])),
})

const courseSchema = z.object({
  title: z.string().min(1),
  status: z.enum(['completed', 'in-progress', 'upcoming']),
})
const responseSchema = z.object({
  title: z.string().min(1),
  courses: z.array(courseSchema).min(3).max(8),
})

// POST /api/ai/roadmap — generates a course roadmap toward a student's
// stated goal, informed by their self-rated skill levels. Single action
// endpoint, same shape as /api/chat and /api/ai/career-recommendation.
export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  const { goal, currentLevel, skillRatings } = parsed.data
  const ratingsText = Object.entries(skillRatings)
    .map(([subject, level]) => `${subject}: ${level}`)
    .join(', ');

  try {
    const result = await structuredCompletion({
      // Kept short and imperative on purpose — see the note in
      // structuredCompletion.ts: a long explanatory system prompt measurably
      // lowered how often llama3.2:3b actually used the required tool call
      // instead of answering in plain text. Domain detail lives in the
      // tool/param descriptions below instead.
      system: `Call return_roadmap with a 3-8 course learning roadmap toward this student's goal, using their self-rated skills to mark early relevant courses "completed", the next one "in-progress", and the rest "upcoming".`,
      user: `Goal: ${goal}\nCurrent level: ${currentLevel}\nSelf-rated skills: ${ratingsText}`,
      toolName: 'return_roadmap',
      toolDescription:
        'Return an ordered course roadmap (3-8 courses) for a Grade 12 / early-university student working toward their stated goal. Order: completed, then in-progress, then upcoming.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'A short title for this roadmap, e.g. "Path to Computer Engineering".' },
          courses: {
            type: 'array',
            minItems: 3,
            maxItems: 8,
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                status: { type: 'string', enum: ['completed', 'in-progress', 'upcoming'] },
              },
              required: ['title', 'status'],
            },
          },
        },
        required: ['title', 'courses'],
      },
      schema: responseSchema,
    })

    return ok(result)
  } catch (error) {
    console.error('POST /api/ai/roadmap failed:', error)
    return fail(
      502,
      error instanceof Error ? error.message : "Couldn't generate your roadmap. Please try again.",
    )
  }
}
