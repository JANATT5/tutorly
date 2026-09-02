// prisma/seed-demo-accounts.mjs
//
// Makes the 3 static demo logins in src/lib/session.ts (test/1234,
// tutor1/1234, admin/tutorly-admin) correspond to REAL rows in the
// database, instead of being pure fiction the fake login just recognizes.
//
// WHY THIS EXISTS: the fake login only ever stores a role + username in a
// cookie (see src/lib/session.ts's own comment on why — real auth is
// explicitly out of scope for now). But bookings, applications, and the
// dashboard all need a real database id for "the current user." Rather
// than build real sign-up to get that id, this script seeds one User (+
// StudentProfile/TutorProfile where relevant) per demo account, and
// src/hooks/useCurrentUser.ts looks them up by username at runtime. The
// login mechanism itself is completely untouched by this.
//
// Safe to re-run — it checks for each username before creating it, so it
// never creates duplicates.
//
// Run with: node prisma/seed-demo-accounts.mjs

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function ensureUser({ username, role }) {
  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    console.log(`- ${username} already exists (${existing.id})`)
    return existing
  }

  // NOTE: matches the demo password exactly (see STATIC_CREDENTIALS in
  // src/lib/session.ts) stored as plain text — this API doesn't hash
  // passwords yet (a deliberate, flagged gap; see docs/API_GUIDE.md). Fine
  // for seeded demo data, not fine if this ever became a real account.
  const password = { test: '1234', tutor1: '1234', admin: 'tutorly-admin' }[username]

  const user = await prisma.user.create({ data: { username, password, role } })
  console.log(`+ created ${username} (${user.id})`)
  return user
}

async function main() {
  const student = await ensureUser({ username: 'test', role: 'STUDENT' })
  const tutor = await ensureUser({ username: 'tutor1', role: 'TUTOR' })
  await ensureUser({ username: 'admin', role: 'ADMIN' })

  const existingStudentProfile = await prisma.studentProfile.findUnique({
    where: { userId: student.id },
  })
  if (!existingStudentProfile) {
    const profile = await prisma.studentProfile.create({
      data: {
        userId: student.id,
        fullName: 'Demo Student',
        curriculum: 'LEBANESE',
        grade: 'Grade 11',
      },
    })
    console.log(`+ created StudentProfile for test (${profile.id})`)
  } else {
    console.log(`- StudentProfile for test already exists (${existingStudentProfile.id})`)
  }

  const existingTutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: tutor.id },
  })
  if (!existingTutorProfile) {
    const profile = await prisma.tutorProfile.create({
      data: {
        userId: tutor.id,
        fullName: 'Demo Tutor',
        bio: 'Demo tutor account, seeded for local development.',
        curriculum: 'LEBANESE',
        hourlyRate: 25,
        verified: true,
      },
    })
    console.log(`+ created TutorProfile for tutor1 (${profile.id})`)
  } else {
    console.log(`- TutorProfile for tutor1 already exists (${existingTutorProfile.id})`)
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
