import type { ChatCompletionTool } from 'openai/resources/chat/completions'
import { prisma } from '@/lib/prisma'

/**
 * Every "fact" tool the AI features can call, plus their JSON-schema
 * declarations for the model. Each function here talks to Prisma directly
 * (same as every API route handler) — no HTTP round-trip to our own API,
 * since this already runs server-side.
 *
 * Why tools instead of just describing the data in the prompt: the model
 * (qwen3:4b, a small local one) is much more prone to inventing plausible-
 * sounding tutor names or prices than a frontier model would be. Forcing it
 * to call these functions for anything data-shaped means every fact in its
 * answer traces back to a real row, not a guess.
 */

export async function searchTutors(args: {
  subject?: string
  curriculum?: 'LEBANESE' | 'FRENCH' | 'AMERICAN'
  maxHourlyRate?: number
}) {
  const tutors = await prisma.tutorProfile.findMany({
    where: {
      verified: true,
      ...(args.subject ? { subjects: { some: { subject: { name: args.subject } } } } : {}),
      ...(args.curriculum ? { curriculum: args.curriculum } : {}),
      ...(args.maxHourlyRate ? { hourlyRate: { lte: args.maxHourlyRate } } : {}),
    },
    include: { subjects: { include: { subject: true } } },
    take: 10,
  })

  // Trimmed down to just what's useful to answer with — no need to hand
  // the model internal ids, review arrays, etc.
  return tutors.map((t) => ({
    id: t.id,
    fullName: t.fullName,
    subjects: t.subjects.map((ts) => ts.subject.name),
    curriculum: t.curriculum,
    hourlyRate: t.hourlyRate,
    rating: t.rating,
    location: t.location,
    languages: t.languages,
  }))
}

export async function listSubjects() {
  const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })
  return subjects.map((s) => s.name)
}

export async function getTutorDetails(args: { tutorId: string }) {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: args.tutorId },
    include: { subjects: { include: { subject: true } }, reviews: true },
  })
  if (!tutor) return { error: 'No tutor found with that id.' }

  return {
    fullName: tutor.fullName,
    bio: tutor.bio,
    subjects: tutor.subjects.map((ts) => ts.subject.name),
    curriculum: tutor.curriculum,
    hourlyRate: tutor.hourlyRate,
    rating: tutor.rating,
    location: tutor.location,
    experienceYears: tutor.experienceYears,
    languages: tutor.languages,
    reviewCount: tutor.reviews.length,
  }
}

export async function searchPracticeQuestions(args: { subjectId?: string; difficulty?: string }) {
  const questions = await prisma.practiceQuestion.findMany({
    where: {
      ...(args.subjectId ? { subjectId: args.subjectId } : {}),
      ...(args.difficulty ? { difficulty: args.difficulty } : {}),
    },
    take: 10,
  })
  return questions.map((q) => ({ question: q.question, difficulty: q.difficulty }))
}

// ---- Tool registry: what the chatbot's tool-calling loop actually uses ----

type ToolExecutor = (args: never) => Promise<unknown>

const registry: Record<string, ToolExecutor> = {
  search_tutors: searchTutors as ToolExecutor,
  list_subjects: listSubjects as ToolExecutor,
  get_tutor_details: getTutorDetails as ToolExecutor,
  search_practice_questions: searchPracticeQuestions as ToolExecutor,
}

export const toolDefinitions: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_tutors',
      description: 'Search for verified tutors, optionally filtered by subject, curriculum, or a maximum hourly rate.',
      parameters: {
        type: 'object',
        properties: {
          subject: { type: 'string', description: 'A subject name, e.g. "Mathematics".' },
          curriculum: { type: 'string', enum: ['LEBANESE', 'FRENCH', 'AMERICAN'] },
          maxHourlyRate: { type: 'number', description: 'Maximum price per hour in USD.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_subjects',
      description: 'List every subject Tutorly offers tutoring in.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_tutor_details',
      description: "Get one tutor's full profile by id (use after search_tutors to learn more about a specific result).",
      parameters: {
        type: 'object',
        properties: { tutorId: { type: 'string' } },
        required: ['tutorId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_practice_questions',
      description: 'Search the practice-question bank, optionally by subject id or difficulty.',
      parameters: {
        type: 'object',
        properties: {
          subjectId: { type: 'string' },
          difficulty: { type: 'string', description: 'e.g. "Easy", "Medium", "Hard".' },
        },
      },
    },
  },
]

/** Runs one tool call by name with its (already-parsed) arguments. Throws
 * if the model asked for a tool that doesn't exist — the chat route's loop
 * catches this and reports it back to the model as a tool error instead of
 * crashing the request. */
export async function executeTool(name: string, args: unknown): Promise<unknown> {
  const executor = registry[name]
  if (!executor) throw new Error(`Unknown tool: ${name}`)
  return executor(args as never)
}
