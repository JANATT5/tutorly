// prisma/seed-content.mjs
//
// Fills out everything that was still thin after seed-demo-accounts.mjs,
// seed-tutors.mjs, and seed-practice-questions.mjs: more students, real
// bookings spanning all 3 statuses (so all 3 dashboards have something to
// show), two tutors mid-application (so the admin Verification tab has a
// real approve/reject case instead of an empty state), career-quiz
// questions, and one sample quiz result + Planr roadmap for the demo
// student.
//
// Writes straight through Prisma (like the other seed scripts) since it
// needs to set fields — verified, status, dates in the past — that the
// public API intentionally doesn't accept from a client.
//
// Safe to re-run — every section checks for existing rows first.
//
// Run with: node prisma/seed-content.mjs

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function ensureStudent({ username, fullName, curriculum, grade }) {
  let user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    user = await prisma.user.create({ data: { username, password: 'tutorly-demo', role: 'STUDENT' } })
  }
  let profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } })
  if (!profile) {
    profile = await prisma.studentProfile.create({
      data: { userId: user.id, fullName, curriculum, grade },
    })
    console.log(`+ created student ${fullName} (${profile.id})`)
  } else {
    console.log(`- student ${fullName} already exists (${profile.id})`)
  }
  return profile
}

async function ensureUnverifiedTutorWithApplication({ username, fullName, bio, curriculum, hourlyRate, subjectName, aiScore, documents }) {
  let user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    user = await prisma.user.create({ data: { username, password: 'tutorly-demo', role: 'TUTOR' } })
  }
  let profile = await prisma.tutorProfile.findUnique({ where: { userId: user.id } })
  if (!profile) {
    profile = await prisma.tutorProfile.create({
      data: { userId: user.id, fullName, bio, curriculum, hourlyRate, verified: false },
    })
    const subject = await prisma.subject.findUnique({ where: { name: subjectName } })
    if (subject) {
      await prisma.tutorSubject.create({ data: { tutorId: profile.id, subjectId: subject.id } })
    }
    console.log(`+ created unverified tutor ${fullName} (${profile.id})`)
  } else {
    console.log(`- tutor ${fullName} already exists (${profile.id})`)
  }

  const existingApp = await prisma.tutorApplication.findUnique({ where: { tutorId: profile.id } })
  if (!existingApp) {
    await prisma.tutorApplication.create({
      data: { tutorId: profile.id, status: 'PENDING', documents, aiScore },
    })
    console.log(`  + pending application for ${fullName}`)
  }
  return profile
}

async function ensureBooking({ studentId, tutorId, subject, status, date }) {
  const existing = await prisma.booking.findFirst({ where: { studentId, tutorId, subject, date } })
  if (existing) {
    console.log(`- booking already exists: ${subject} (${status})`)
    return existing
  }
  const booking = await prisma.booking.create({ data: { studentId, tutorId, subject, status, date } })
  console.log(`+ booking: ${subject} — ${status}`)
  return booking
}

function daysFromNow(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

async function main() {
  // ---- Students ----
  const test = await prisma.studentProfile.findFirst({ where: { user: { username: 'test' } } })
  const sara = await ensureStudent({ username: 'sara.moukalled', fullName: 'Sara Moukalled', curriculum: 'FRENCH', grade: 'Grade 12' })
  const ali = await ensureStudent({ username: 'ali.nasser', fullName: 'Ali Nasser', curriculum: 'AMERICAN', grade: 'Grade 11' })
  const mona = await ensureStudent({ username: 'mona.rahal', fullName: 'Mona Rahal', curriculum: 'LEBANESE', grade: 'Grade 12' })

  // ---- Tutors already seeded (looked up by fullName) ----
  const byName = async (fullName) => prisma.tutorProfile.findFirst({ where: { fullName } })
  const layla = await byName('Layla Haddad')
  const karim = await byName('Karim Fares')
  const elias = await byName('Elias Sarkis')
  const youssef = await byName('Youssef Antoun')
  const nour = await byName('Nour Saleh')
  const demoTutor = await byName('Demo Tutor')

  // ---- Bookings — spread across PENDING / CONFIRMED / COMPLETED ----
  if (test && layla) {
    await ensureBooking({ studentId: test.id, tutorId: layla.id, subject: 'Mathematics', status: 'COMPLETED', date: daysFromNow(-14) })
    await ensureBooking({ studentId: test.id, tutorId: layla.id, subject: 'Mathematics', status: 'PENDING', date: daysFromNow(5) })
  }
  if (test && karim) {
    await ensureBooking({ studentId: test.id, tutorId: karim.id, subject: 'Computer Science', status: 'CONFIRMED', date: daysFromNow(3) })
  }
  if (test && demoTutor) {
    await ensureBooking({ studentId: test.id, tutorId: demoTutor.id, subject: 'Mathematics', status: 'COMPLETED', date: daysFromNow(-30) })
  }
  if (sara && elias) {
    await ensureBooking({ studentId: sara.id, tutorId: elias.id, subject: 'Physics', status: 'PENDING', date: daysFromNow(7) })
  }
  if (ali && youssef) {
    await ensureBooking({ studentId: ali.id, tutorId: youssef.id, subject: 'Computer Science', status: 'COMPLETED', date: daysFromNow(-10) })
  }
  if (ali && layla) {
    await ensureBooking({ studentId: ali.id, tutorId: layla.id, subject: 'Mathematics', status: 'PENDING', date: daysFromNow(9) })
  }
  if (mona && nour) {
    await ensureBooking({ studentId: mona.id, tutorId: nour.id, subject: 'Chemistry', status: 'CONFIRMED', date: daysFromNow(4) })
  }

  // ---- Two tutors mid-application, for a real admin Verification demo ----
  await ensureUnverifiedTutorWithApplication({
    username: 'dana.fakhoury',
    fullName: 'Dana Fakhoury',
    bio: 'Math graduate applying to tutor Grade 12 students — three years of private tutoring experience so far.',
    curriculum: 'LEBANESE',
    hourlyRate: 20,
    subjectName: 'Mathematics',
    aiScore: 82,
    documents: ['cv.pdf', 'certificate.pdf'],
  })
  await ensureUnverifiedTutorWithApplication({
    username: 'omar.chidiac',
    fullName: 'Omar Chidiac',
    bio: 'Physics teaching assistant at university, looking to tutor part-time.',
    curriculum: 'AMERICAN',
    hourlyRate: 24,
    subjectName: 'Physics',
    aiScore: 75,
    documents: ['cv.pdf'],
  })

  // ---- Career quiz question bank (content only — quiz/page.tsx's
  // tag-based scoring stays client-side, see docs/API_GUIDE.md) ----
  const quizQuestions = [
    { prompt: 'What kind of problems do you enjoy solving most?', options: ['Logical puzzles and numbers', 'Creative and artistic challenges', 'Helping other people', 'Building and fixing things'] },
    { prompt: 'Which school subject do you look forward to most?', options: ['Math or Physics', 'Art or Literature', 'Biology or Chemistry', 'Computer Science'] },
    { prompt: 'How do you prefer to work?', options: ['Independently, deep focus', 'In a team, brainstorming', 'Helping or mentoring others', 'Hands-on, practical tasks'] },
  ]
  for (const q of quizQuestions) {
    const existing = await prisma.quizQuestion.findFirst({ where: { prompt: q.prompt } })
    if (existing) continue
    await prisma.quizQuestion.create({ data: q })
    console.log(`+ quiz question: "${q.prompt}"`)
  }

  // ---- Sample quiz result + Planr roadmap for the demo student ----
  if (test) {
    const existingResult = await prisma.quizResult.findFirst({ where: { studentId: test.id } })
    if (!existingResult) {
      await prisma.quizResult.create({
        data: {
          studentId: test.id,
          resultLabel: 'Engineering & Technology',
          answers: { q1: 'Logical puzzles and numbers', q2: 'Math or Physics', q3: 'Independently, deep focus' },
        },
      })
      console.log('+ sample quiz result for test')
    }

    const existingPath = await prisma.planrPath.findFirst({ where: { studentId: test.id } })
    if (!existingPath) {
      await prisma.planrPath.create({
        data: {
          studentId: test.id,
          goal: 'Get into a Computer Engineering program',
          steps: [
            { title: 'Calculus I', status: 'completed' },
            { title: 'Physics I', status: 'completed' },
            { title: 'Intro to Programming', status: 'in-progress' },
            { title: 'Data Structures', status: 'upcoming' },
            { title: 'Linear Algebra', status: 'upcoming' },
          ],
        },
      })
      console.log('+ sample Planr path for test')
    }
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
