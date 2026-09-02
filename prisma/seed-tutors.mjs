// prisma/seed-tutors.mjs
//
// Adds a real, varied set of tutor profiles (beyond the single "tutor1"
// demo account) so /browse, the home page, and tutor detail pages have
// actual content to show. Writes straight through Prisma rather than the
// API — that's deliberate here, the same way prisma/seed-demo-accounts.mjs
// does it — because it needs to set `verified`/`rating` directly, which
// the public createTutorSchema intentionally leaves out of what a POST can
// set (see src/app/api/tutors/schema.ts).
//
// Safe to re-run — skips a tutor if a User with that username already
// exists.
//
// Run with: node prisma/seed-tutors.mjs

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const subjectNames = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science']

const tutors = [
  {
    username: 'layla.haddad',
    fullName: 'Layla Haddad',
    bio: 'Math teacher for 5 years, focused on making Grade 12 Bac calculus and statistics actually click — lots of worked examples, no rushing.',
    curriculum: 'LEBANESE',
    hourlyRate: 22,
    location: 'Beirut',
    experienceYears: 5,
    languages: ['Arabic', 'English'],
    rating: 4.8,
    subjects: ['Mathematics', 'Physics'],
    avatarSeed: 'layla-haddad',
  },
  {
    username: 'karim.fares',
    fullName: 'Karim Fares',
    bio: 'Software engineer turned tutor. I teach Computer Science and Math the way I wish someone had taught me — through building small projects, not just theory.',
    curriculum: 'AMERICAN',
    hourlyRate: 30,
    location: 'Beirut',
    experienceYears: 4,
    languages: ['English', 'French'],
    rating: 4.9,
    subjects: ['Computer Science', 'Mathematics'],
    avatarSeed: 'karim-fares',
  },
  {
    username: 'nour.saleh',
    fullName: 'Nour Saleh',
    bio: 'Chemistry and Biology tutor with a background in pharmacy. I specialize in helping students who feel behind catch up before exams.',
    curriculum: 'LEBANESE',
    hourlyRate: 18,
    location: 'Tripoli',
    experienceYears: 3,
    languages: ['Arabic', 'English'],
    rating: 4.6,
    subjects: ['Chemistry', 'Biology'],
    avatarSeed: 'nour-saleh',
  },
  {
    username: 'elias.sarkis',
    fullName: 'Elias Sarkis',
    bio: "Physics tutor for the French Bac, six years in. I lean heavily on diagrams and real experiments over rote formula memorisation.",
    curriculum: 'FRENCH',
    hourlyRate: 25,
    location: 'Jounieh',
    experienceYears: 6,
    languages: ['French', 'Arabic'],
    rating: 4.7,
    subjects: ['Physics', 'Mathematics'],
    avatarSeed: 'elias-sarkis',
  },
  {
    username: 'rania.khalil',
    fullName: 'Rania Khalil',
    bio: 'Recent Biology grad, now tutoring Grade 12 students prepping for university entrance exams. Patient, and big on practice questions.',
    curriculum: 'AMERICAN',
    hourlyRate: 20,
    location: 'Sidon',
    experienceYears: 2,
    languages: ['English', 'Arabic'],
    rating: null,
    subjects: ['Biology', 'Chemistry'],
    avatarSeed: 'rania-khalil',
  },
  {
    username: 'youssef.antoun',
    fullName: 'Youssef Antoun',
    bio: 'Full-stack developer and long-time CS tutor. Comfortable teaching absolute beginners through to AP Computer Science level.',
    curriculum: 'LEBANESE',
    hourlyRate: 28,
    location: 'Beirut',
    experienceYears: 7,
    languages: ['Arabic', 'English', 'French'],
    rating: 5,
    subjects: ['Computer Science'],
    avatarSeed: 'youssef-antoun',
  },
]

// A couple of reviews for the two most-established tutors, so their
// profile pages have something real in the Reviews section too.
const reviews = [
  { username: 'layla.haddad', rating: 5, comment: 'Explained integrals better in one session than my whole semester.' },
  { username: 'layla.haddad', rating: 5, comment: 'Very patient, great at breaking down word problems.' },
  { username: 'karim.fares', rating: 5, comment: 'Helped me actually understand recursion instead of memorizing it.' },
  { username: 'youssef.antoun', rating: 4, comment: 'Solid teacher, sessions run a little over time but worth it.' },
]

async function ensureSubject(name) {
  const existing = await prisma.subject.findUnique({ where: { name } })
  if (existing) return existing
  const created = await prisma.subject.create({ data: { name } })
  console.log(`+ created subject ${name} (${created.id})`)
  return created
}

async function main() {
  const subjectByName = new Map()
  for (const name of subjectNames) {
    subjectByName.set(name, await ensureSubject(name))
  }

  const tutorProfileByUsername = new Map()

  for (const t of tutors) {
    const existingUser = await prisma.user.findUnique({ where: { username: t.username } })
    if (existingUser) {
      const existingProfile = await prisma.tutorProfile.findUnique({ where: { userId: existingUser.id } })
      if (existingProfile) {
        console.log(`- ${t.fullName} already exists (${existingProfile.id})`)
        tutorProfileByUsername.set(t.username, existingProfile)
        continue
      }
    }

    const user =
      existingUser ??
      (await prisma.user.create({
        data: { username: t.username, password: 'tutorly-demo', role: 'TUTOR' },
      }))

    const profile = await prisma.tutorProfile.create({
      data: {
        userId: user.id,
        fullName: t.fullName,
        bio: t.bio,
        curriculum: t.curriculum,
        hourlyRate: t.hourlyRate,
        verified: true,
        rating: t.rating,
        avatar: `https://i.pravatar.cc/150?u=${t.avatarSeed}`,
        languages: t.languages,
        location: t.location,
        experienceYears: t.experienceYears,
      },
    })

    await prisma.tutorSubject.createMany({
      data: t.subjects.map((name) => ({
        tutorId: profile.id,
        subjectId: subjectByName.get(name).id,
      })),
    })

    console.log(`+ created ${t.fullName} (${profile.id}) — ${t.subjects.join(', ')}`)
    tutorProfileByUsername.set(t.username, profile)
  }

  for (const r of reviews) {
    const profile = tutorProfileByUsername.get(r.username)
    if (!profile) continue
    const existing = await prisma.review.findFirst({
      where: { tutorId: profile.id, comment: r.comment },
    })
    if (existing) continue
    await prisma.review.create({
      data: { tutorId: profile.id, rating: r.rating, comment: r.comment },
    })
    console.log(`+ review for ${r.username}: "${r.comment}"`)
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
