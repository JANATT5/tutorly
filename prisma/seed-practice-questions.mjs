// prisma/seed-practice-questions.mjs
//
// A small, real starter bank of practice questions so /practice has
// something genuine to show once it's wired to the real API — the old
// mock-data.ts version had ~105 illustrative questions, but writing that
// many by hand here would just be a different flavor of fake content.
// This seeds a handful of real, correct questions per subject/difficulty
// instead — enough to prove the mechanism (GET /api/practice-questions
// filtered by subject + difficulty) genuinely works end to end. Growing
// the bank from here is a content task, not a wiring one.
//
// Safe to re-run — skips a question if one with the same `question` text
// already exists for that subject.
//
// Run with: node prisma/seed-practice-questions.mjs

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const bank = [
  {
    subjectName: 'Mathematics',
    difficulty: 'Easy',
    question: 'What is the value of x if 2x + 3 = 11?',
    options: ['2', '4', '6', '8'],
    correctAnswer: '4',
  },
  {
    subjectName: 'Mathematics',
    difficulty: 'Easy',
    question: 'What is the derivative of x²?',
    options: ['x', '2x', 'x²', '2'],
    correctAnswer: '2x',
  },
  {
    subjectName: 'Mathematics',
    difficulty: 'Medium',
    question: 'What is the integral of 2x dx?',
    options: ['x² + C', '2x² + C', 'x + C', '2 + C'],
    correctAnswer: 'x² + C',
  },
  {
    subjectName: 'Physics',
    difficulty: 'Easy',
    question: 'What is the SI unit of force?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correctAnswer: 'Newton',
  },
  {
    subjectName: 'Physics',
    difficulty: 'Easy',
    question: 'What is the approximate acceleration due to gravity on Earth?',
    options: ['9.8 m/s²', '4.9 m/s²', '1 m/s²', '20 m/s²'],
    correctAnswer: '9.8 m/s²',
  },
  {
    subjectName: 'Physics',
    difficulty: 'Medium',
    question: "According to Newton's second law, force equals:",
    options: ['mass / acceleration', 'mass + acceleration', 'mass × acceleration', 'acceleration / mass'],
    correctAnswer: 'mass × acceleration',
  },
]

async function ensureSubject(name) {
  const existing = await prisma.subject.findUnique({ where: { name } })
  if (existing) return existing
  const created = await prisma.subject.create({ data: { name } })
  console.log(`+ created subject ${name} (${created.id})`)
  return created
}

async function main() {
  const subjectCache = new Map()

  for (const item of bank) {
    if (!subjectCache.has(item.subjectName)) {
      subjectCache.set(item.subjectName, await ensureSubject(item.subjectName))
    }
    const subject = subjectCache.get(item.subjectName)

    const existing = await prisma.practiceQuestion.findFirst({
      where: { subjectId: subject.id, question: item.question },
    })
    if (existing) {
      console.log(`- already exists: "${item.question}"`)
      continue
    }

    await prisma.practiceQuestion.create({
      data: {
        subjectId: subject.id,
        question: item.question,
        options: item.options,
        correctAnswer: item.correctAnswer,
        difficulty: item.difficulty,
      },
    })
    console.log(`+ created: "${item.question}"`)
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
