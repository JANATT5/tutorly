// prisma/seed-practice-questions.mjs
//
// A real practice-question bank — 8 genuinely correct questions per
// subject (Easy/Medium/Hard), not the old mock-data.ts version's ~105
// illustrative ones. Enough per subject/difficulty combination to actually
// exercise /practice properly.
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
  // ---- Mathematics ----
  { subjectName: 'Mathematics', difficulty: 'Easy', question: 'What is the value of x if 2x + 3 = 11?', options: ['2', '4', '6', '8'], correctAnswer: '4' },
  { subjectName: 'Mathematics', difficulty: 'Easy', question: 'What is the derivative of x²?', options: ['x', '2x', 'x²', '2'], correctAnswer: '2x' },
  { subjectName: 'Mathematics', difficulty: 'Easy', question: 'What is 7 × 8?', options: ['54', '56', '58', '64'], correctAnswer: '56' },
  { subjectName: 'Mathematics', difficulty: 'Medium', question: 'What is the integral of 2x dx?', options: ['x² + C', '2x² + C', 'x + C', '2 + C'], correctAnswer: 'x² + C' },
  { subjectName: 'Mathematics', difficulty: 'Medium', question: 'What is the slope of the line y = 3x + 5?', options: ['3', '5', '8', '1/3'], correctAnswer: '3' },
  { subjectName: 'Mathematics', difficulty: 'Medium', question: 'What are the solutions to x² - 9 = 0?', options: ['x = 3 or x = -3', 'x = 9', 'x = -9', 'x = 0'], correctAnswer: 'x = 3 or x = -3' },
  { subjectName: 'Mathematics', difficulty: 'Hard', question: 'What is the derivative of sin(x)?', options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correctAnswer: 'cos(x)' },
  { subjectName: 'Mathematics', difficulty: 'Hard', question: 'What is the limit of (1 + 1/n)^n as n approaches infinity?', options: ['e', '1', 'infinity', '0'], correctAnswer: 'e' },

  // ---- Physics ----
  { subjectName: 'Physics', difficulty: 'Easy', question: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correctAnswer: 'Newton' },
  { subjectName: 'Physics', difficulty: 'Easy', question: 'What is the approximate acceleration due to gravity on Earth?', options: ['9.8 m/s²', '4.9 m/s²', '1 m/s²', '20 m/s²'], correctAnswer: '9.8 m/s²' },
  { subjectName: 'Physics', difficulty: 'Easy', question: 'What is the SI unit of energy?', options: ['Joule', 'Newton', 'Watt', 'Volt'], correctAnswer: 'Joule' },
  { subjectName: 'Physics', difficulty: 'Medium', question: "According to Newton's second law, force equals:", options: ['mass / acceleration', 'mass + acceleration', 'mass × acceleration', 'acceleration / mass'], correctAnswer: 'mass × acceleration' },
  { subjectName: 'Physics', difficulty: 'Medium', question: 'What is the formula for kinetic energy?', options: ['1/2 mv²', 'mv', 'mgh', 'ma'], correctAnswer: '1/2 mv²' },
  { subjectName: 'Physics', difficulty: 'Medium', question: 'What is the speed of light in a vacuum, approximately?', options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10⁵ m/s', '3 × 10¹⁰ m/s'], correctAnswer: '3 × 10⁸ m/s' },
  { subjectName: 'Physics', difficulty: 'Hard', question: "Which equation correctly states Ohm's Law?", options: ['V = IR', 'V = I/R', 'V = I + R', 'V = IR²'], correctAnswer: 'V = IR' },
  { subjectName: 'Physics', difficulty: 'Hard', question: 'What type of lens converges light rays to a focal point?', options: ['Convex lens', 'Concave lens', 'Cylindrical lens', 'Plane lens'], correctAnswer: 'Convex lens' },

  // ---- Chemistry ----
  { subjectName: 'Chemistry', difficulty: 'Easy', question: 'What is the chemical formula for water?', options: ['H2O', 'CO2', 'O2', 'H2'], correctAnswer: 'H2O' },
  { subjectName: 'Chemistry', difficulty: 'Easy', question: 'What is the atomic number of Hydrogen?', options: ['1', '2', '6', '8'], correctAnswer: '1' },
  { subjectName: 'Chemistry', difficulty: 'Easy', question: 'What gas do plants absorb from the atmosphere for photosynthesis?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], correctAnswer: 'Carbon dioxide' },
  { subjectName: 'Chemistry', difficulty: 'Medium', question: 'What is the pH of a neutral solution?', options: ['7', '0', '14', '1'], correctAnswer: '7' },
  { subjectName: 'Chemistry', difficulty: 'Medium', question: 'What type of bond involves the sharing of electron pairs?', options: ['Covalent bond', 'Ionic bond', 'Metallic bond', 'Hydrogen bond'], correctAnswer: 'Covalent bond' },
  { subjectName: 'Chemistry', difficulty: 'Medium', question: 'What is the chemical formula for table salt?', options: ['NaCl', 'KCl', 'CaCl2', 'NaOH'], correctAnswer: 'NaCl' },
  { subjectName: 'Chemistry', difficulty: 'Hard', question: "What is Avogadro's number, approximately?", options: ['6.02 × 10²³', '3.14 × 10²³', '1.6 × 10⁻¹⁹', '9.8 × 10²³'], correctAnswer: '6.02 × 10²³' },
  { subjectName: 'Chemistry', difficulty: 'Hard', question: 'Which of the following is an example of an exothermic reaction?', options: ['Combustion', 'Photosynthesis', 'Melting ice', 'Evaporation'], correctAnswer: 'Combustion' },

  // ---- Biology ----
  { subjectName: 'Biology', difficulty: 'Easy', question: 'What is the basic unit of life?', options: ['Cell', 'Atom', 'Tissue', 'Organ'], correctAnswer: 'Cell' },
  { subjectName: 'Biology', difficulty: 'Easy', question: 'What organelle is known as the powerhouse of the cell?', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi apparatus'], correctAnswer: 'Mitochondria' },
  { subjectName: 'Biology', difficulty: 'Easy', question: 'How many chambers does the human heart have?', options: ['4', '2', '3', '5'], correctAnswer: '4' },
  { subjectName: 'Biology', difficulty: 'Medium', question: 'What is the process by which plants make their own food called?', options: ['Photosynthesis', 'Respiration', 'Digestion', 'Transpiration'], correctAnswer: 'Photosynthesis' },
  { subjectName: 'Biology', difficulty: 'Medium', question: 'What molecule carries genetic information in most living organisms?', options: ['DNA', 'RNA', 'Protein', 'Lipid'], correctAnswer: 'DNA' },
  { subjectName: 'Biology', difficulty: 'Medium', question: 'What is the main function of red blood cells?', options: ['Carry oxygen', 'Fight infection', 'Clot blood', 'Produce hormones'], correctAnswer: 'Carry oxygen' },
  { subjectName: 'Biology', difficulty: 'Hard', question: 'What process describes a cell dividing into two genetically identical daughter cells?', options: ['Mitosis', 'Meiosis', 'Fertilization', 'Fission'], correctAnswer: 'Mitosis' },
  { subjectName: 'Biology', difficulty: 'Hard', question: 'Which enzyme breaks down starch into sugars?', options: ['Amylase', 'Lipase', 'Pepsin', 'Trypsin'], correctAnswer: 'Amylase' },

  // ---- Computer Science ----
  { subjectName: 'Computer Science', difficulty: 'Easy', question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Control Processing Unit'], correctAnswer: 'Central Processing Unit' },
  { subjectName: 'Computer Science', difficulty: 'Easy', question: 'Which of these is a programming language?', options: ['Python', 'HTML tag', 'HTTP', 'USB'], correctAnswer: 'Python' },
  { subjectName: 'Computer Science', difficulty: 'Easy', question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High-Tech Modern Language', 'Hyperlink Text Markup Language', 'Home Tool Markup Language'], correctAnswer: 'HyperText Markup Language' },
  { subjectName: 'Computer Science', difficulty: 'Medium', question: 'What data structure uses LIFO (Last In, First Out)?', options: ['Stack', 'Queue', 'Array', 'Tree'], correctAnswer: 'Stack' },
  { subjectName: 'Computer Science', difficulty: 'Medium', question: 'What is the time complexity of binary search on a sorted array?', options: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'], correctAnswer: 'O(log n)' },
  { subjectName: 'Computer Science', difficulty: 'Medium', question: 'Which of these is NOT a valid variable name in most programming languages?', options: ['2ndValue', 'secondValue', 'second_value', '_secondValue'], correctAnswer: '2ndValue' },
  { subjectName: 'Computer Science', difficulty: 'Hard', question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Logic', 'Sequential Query Language', 'Structured Question Language'], correctAnswer: 'Structured Query Language' },
  { subjectName: 'Computer Science', difficulty: 'Hard', question: 'In object-oriented programming, what is it called when a class inherits properties from another class?', options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction'], correctAnswer: 'Inheritance' },
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
  let created = 0
  let skipped = 0

  for (const item of bank) {
    if (!subjectCache.has(item.subjectName)) {
      subjectCache.set(item.subjectName, await ensureSubject(item.subjectName))
    }
    const subject = subjectCache.get(item.subjectName)

    const existing = await prisma.practiceQuestion.findFirst({
      where: { subjectId: subject.id, question: item.question },
    })
    if (existing) {
      skipped++
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
    created++
    console.log(`+ [${item.subjectName}/${item.difficulty}] ${item.question}`)
  }

  console.log(`\nDone: ${created} created, ${skipped} already existed.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
