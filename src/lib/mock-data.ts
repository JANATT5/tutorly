// lib/mock-data.ts
//
// Single source of realistic mock data shared across Home, Browse,
// Practice, Career Quiz, Planr, and the student/tutor/admin dashboards.
// Swap this for real Prisma/Supabase queries once the schema lands —
// the shapes here are meant to map cleanly onto the eventual DB models
// (Tutor, Subject, Booking, PracticeSet, CareerQuiz, LearningPath).

// ---------------------------------------------------------------------------
// Subjects
// ---------------------------------------------------------------------------

export type SubjectKey =
  | "mathematics"
  | "physics"
  | "chemistry"
  | "biology"
  | "computer-science";

// Icons are literal glyphs (not keywords) so every page can render
// `{subject.icon}` directly with no lookup table to keep in sync.
export const subjects: { key: SubjectKey; label: string; icon: string }[] = [
  { key: "mathematics", label: "Mathematics", icon: "\u03A3" },
  { key: "physics", label: "Physics", icon: "\u26A1" },
  { key: "chemistry", label: "Chemistry", icon: "\uD83E\uDDEA" },
  { key: "biology", label: "Biology", icon: "\uD83E\uDDEC" },
  { key: "computer-science", label: "Computer Science", icon: "</>" },
];

export const levels = [
  "Grade 10",
  "Grade 11",
  "Grade 12 (Lebanese Bac)",
  "AS-Level",
  "University entry prep",
] as const;

// Shared filter/form option lists — used by Browse's curriculum/language
// filters (currently visual-only, see app/browse/page.tsx) and by the
// Become-a-tutor "What you teach" step. Centralized here rather than
// duplicated per page, per the file's own stated single-source-of-truth
// goal above.
export const curricula = [
  "Lebanese Bac",
  "IG/AS-Level",
  "IB",
  "SAT",
  "University prep",
] as const;

export const languages = ["Arabic", "English", "French"] as const;

// ---------------------------------------------------------------------------
// Tutors  (Browse page, Featured tutors on Home, tutor-detail)
// ---------------------------------------------------------------------------

export type Tutor = {
  id: string;
  name: string;
  avatar: string;
  languages: string[];
  rating: number;
  sessions: number;
  pricePerHour: number;
  subjects: SubjectKey[];
  curriculum: string;
  bio: string;
  location: string;
};

export const tutors: Tutor[] = [
  {
    id: "lara-khoury",
    name: "Lara Khoury",
    avatar: "https://i.pravatar.cc/150?img=47",
    languages: ["Arabic", "English", "French"],
    rating: 4.9,
    sessions: 143,
    pricePerHour: 25,
    subjects: ["physics", "mathematics"],
    curriculum: "Lebanese Bac",
    bio: "Physics grad student at AUB. Focuses on building intuition before formulas — most students say mechanics finally clicked after one session.",
    location: "Beirut",
  },
  {
    id: "nour-abou-zeid",
    name: "Nour Abou Zeid",
    avatar: "https://i.pravatar.cc/150?img=32",
    languages: ["Arabic", "English", "French"],
    rating: 4.9,
    sessions: 312,
    pricePerHour: 28,
    subjects: ["physics", "chemistry"],
    curriculum: "Lebanese Bac",
    bio: "Former Lebanese Bac top-10 finisher, now tutoring full time. Specializes in exam technique for the official baccalaureate.",
    location: "Jounieh",
  },
  {
    id: "omar-zreik",
    name: "Omar Zreik",
    avatar: "https://i.pravatar.cc/150?img=14",
    languages: ["Arabic", "English"],
    rating: 4.9,
    sessions: 76,
    pricePerHour: 32,
    subjects: ["computer-science", "mathematics"],
    curriculum: "University",
    bio: "Software engineer at a Beirut fintech, teaches CS fundamentals and intro programming to university freshmen on weekends.",
    location: "Beirut",
  },
  {
    id: "yasmine-fakhoury",
    name: "Yasmine Fakhoury",
    avatar: "https://i.pravatar.cc/150?img=45",
    languages: ["Arabic", "English"],
    rating: 4.8,
    sessions: 98,
    pricePerHour: 22,
    subjects: ["biology", "chemistry"],
    curriculum: "Lebanese Bac",
    bio: "Pre-med student who tutors Grade 12 biology and chemistry around her own class schedule. Big on practice questions over rote memorizing.",
    location: "Zahle",
  },
  {
    id: "karim-haddad",
    name: "Karim Haddad",
    avatar: "https://i.pravatar.cc/150?img=51",
    languages: ["Arabic", "English", "French"],
    rating: 4.7,
    sessions: 61,
    pricePerHour: 20,
    subjects: ["mathematics"],
    curriculum: "Grade 10-11",
    bio: "Math teacher's assistant covering algebra and pre-calc foundations for students building up to the Bac.",
    location: "Tripoli",
  },
  {
    id: "sarah-matta",
    name: "Sarah Matta",
    avatar: "https://i.pravatar.cc/150?img=26",
    languages: ["Arabic", "English"],
    rating: 4.9,
    sessions: 204,
    pricePerHour: 30,
    subjects: ["chemistry", "biology"],
    curriculum: "AS-Level",
    bio: "AS/A-Level chemistry specialist, previously taught at a British-curriculum school in Beirut for four years.",
    location: "Beirut",
  },
  {
    id: "elias-nassar",
    name: "Elias Nassar",
    avatar: "https://i.pravatar.cc/150?img=60",
    languages: ["Arabic", "English"],
    rating: 4.6,
    sessions: 45,
    pricePerHour: 18,
    subjects: ["computer-science"],
    curriculum: "University",
    bio: "CS sophomore at LAU, tutors intro programming (Python/Java) and data structures for first- and second-year students.",
    location: "Byblos",
  },
  {
    id: "maya-saleh",
    name: "Maya Saleh",
    avatar: "https://i.pravatar.cc/150?img=39",
    languages: ["Arabic", "English", "French"],
    rating: 4.8,
    sessions: 167,
    pricePerHour: 27,
    subjects: ["physics", "mathematics"],
    curriculum: "Lebanese Bac",
    bio: "Engineering student who scored 19/20 on the Bac physics exam. Explains problems the way she wishes they'd been explained to her.",
    location: "Saida",
  },
  {
    id: "tarek-abdallah",
    name: "Tarek Abdallah",
    avatar: "https://i.pravatar.cc/150?img=53",
    languages: ["Arabic", "English"],
    rating: 4.5,
    sessions: 33,
    pricePerHour: 19,
    subjects: ["biology"],
    curriculum: "Grade 10-11",
    bio: "Biology major, patient with beginners, mostly works with students who are just starting to build lab and exam habits.",
    location: "Nabatieh",
  },
];

// Sub-topics and availability, keyed by tutor id — split out from the Tutor
// type above instead of bloating every object literal. Used by the Tutor
// Detail page (topics grid + the two request-a-slot rows).

export const tutorTopics: Record<string, string[]> = {
  "lara-khoury": ["Mechanics", "Waves & Optics", "Algebra II", "Trigonometry"],
  "nour-abou-zeid": ["Electromagnetism", "Thermodynamics", "Organic Chemistry"],
  "omar-zreik": ["Python", "Data Structures", "Discrete Math"],
  "yasmine-fakhoury": ["Cell Biology", "Genetics", "Stoichiometry"],
  "karim-haddad": ["Algebra I", "Pre-Calculus", "Word Problems"],
  "sarah-matta": ["Organic Chemistry", "Acids & Bases", "Cell Biology"],
  "elias-nassar": ["Python", "Java", "Intro Algorithms"],
  "maya-saleh": ["Mechanics", "Calculus I", "Vectors"],
  "tarek-abdallah": ["Intro Biology", "Ecology", "Lab Skills"],
};

export const tutorAvailability: Record<string, string[]> = {
  "lara-khoury": ["Mon · 4:00 PM", "Wed · 6:00 PM"],
  "nour-abou-zeid": ["Tue · 5:00 PM", "Thu · 3:30 PM"],
  "omar-zreik": ["Sat · 11:00 AM", "Sun · 2:00 PM"],
  "yasmine-fakhoury": ["Mon · 5:30 PM", "Fri · 4:00 PM"],
  "karim-haddad": ["Tue · 6:00 PM", "Sat · 10:00 AM"],
  "sarah-matta": ["Wed · 4:30 PM", "Sun · 1:00 PM"],
  "elias-nassar": ["Thu · 6:30 PM", "Sat · 3:00 PM"],
  "maya-saleh": ["Mon · 6:00 PM", "Wed · 5:00 PM"],
  "tarek-abdallah": ["Fri · 5:00 PM", "Sun · 11:00 AM"],
};

// ---------------------------------------------------------------------------
// Practice questions  (Practice page + student dashboard performance)
// ---------------------------------------------------------------------------

export type PracticeQuestion = {
  id: string;
  subject: SubjectKey;
  level: (typeof levels)[number];
  prompt: string;
  options: string[];
  correctIndex: number;
};

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: "phy-001",
    subject: "physics",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "A ball is thrown vertically upward at 20 m/s. Ignoring air resistance, how long until it returns to its starting height? (g = 10 m/s²)",
    options: ["1 s", "2 s", "4 s", "20 s"],
    correctIndex: 2,
  },
  {
    id: "phy-002",
    subject: "physics",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "Which quantity remains constant for a satellite in a stable circular orbit?",
    options: ["Velocity direction", "Speed", "Acceleration direction", "Kinetic energy"],
    correctIndex: 1,
  },
  {
    id: "math-001",
    subject: "mathematics",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "What is the derivative of f(x) = 3x² − 5x + 2?",
    options: ["6x − 5", "3x − 5", "6x + 2", "x² − 5"],
    correctIndex: 0,
  },
  {
    id: "cs-001",
    subject: "computer-science",
    level: "AS-Level",
    prompt: "What is the time complexity of binary search on a sorted array of n elements?",
    options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
    correctIndex: 2,
  },
  {
    id: "chem-001",
    subject: "chemistry",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "Which of the following best describes an exothermic reaction?",
    options: [
      "Absorbs heat from surroundings",
      "Releases heat to surroundings",
      "Occurs only at high pressure",
      "Never reaches equilibrium",
    ],
    correctIndex: 1,
  },
  {
    id: "bio-001",
    subject: "biology",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "During mitosis, sister chromatids separate during which phase?",
    options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
    correctIndex: 2,
  },
];

// Recent practice results, for the student dashboard performance chart
export const practiceHistory = [
  { date: "2026-08-04", subject: "physics" as SubjectKey, score: 6, total: 10 },
  { date: "2026-08-08", subject: "mathematics" as SubjectKey, score: 8, total: 10 },
  { date: "2026-08-12", subject: "physics" as SubjectKey, score: 7, total: 10 },
  { date: "2026-08-17", subject: "chemistry" as SubjectKey, score: 9, total: 10 },
];

// ---------------------------------------------------------------------------
// Career quiz
// ---------------------------------------------------------------------------

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: { text: string; tags: string[] }[]; // tags feed into result matching
};

export const careerQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which activity sounds most satisfying to spend a weekend on?",
    options: [
      { text: "Building or fixing something with your hands", tags: ["engineering"] },
      { text: "Solving a tricky logic or math puzzle", tags: ["cs", "math"] },
      { text: "Reading about how the human body works", tags: ["medicine", "biology"] },
      { text: "Writing, designing, or telling a story", tags: ["design", "humanities"] },
    ],
  },
  {
    id: "q2",
    prompt: "In group projects, you're usually the one who...",
    options: [
      { text: "Plans the structure and keeps things organized", tags: ["management", "engineering"] },
      { text: "Digs into the technical details no one else wants to touch", tags: ["cs", "engineering"] },
      { text: "Cares about how it looks and feels to use", tags: ["design"] },
      { text: "Explains the idea clearly to everyone else", tags: ["humanities", "medicine"] },
    ],
  },
  {
    id: "q3",
    prompt: "Which school subject do you look forward to most?",
    options: [
      { text: "Physics", tags: ["engineering", "cs"] },
      { text: "Biology", tags: ["medicine", "biology"] },
      { text: "Computer Science", tags: ["cs"] },
      { text: "Art or Literature", tags: ["design", "humanities"] },
    ],
  },
  {
    id: "q4",
    prompt: "What kind of impact matters most to you?",
    options: [
      { text: "Building things that improve daily life", tags: ["engineering"] },
      { text: "Directly helping people's health", tags: ["medicine"] },
      { text: "Creating software people use every day", tags: ["cs"] },
      { text: "Shaping how people see or understand something", tags: ["design", "humanities"] },
    ],
  },
  {
    id: "q5",
    prompt: "Pick a problem you'd enjoy working on:",
    options: [
      { text: "Designing a bridge that can handle an earthquake", tags: ["engineering"] },
      { text: "Diagnosing what's wrong from a set of symptoms", tags: ["medicine", "biology"] },
      { text: "Optimizing an app so it loads faster", tags: ["cs"] },
      { text: "Redesigning a brand's entire visual identity", tags: ["design"] },
    ],
  },
  {
    id: "q6",
    prompt: "Which work environment appeals to you more?",
    options: [
      { text: "A lab or hospital", tags: ["medicine", "biology"] },
      { text: "A studio or agency", tags: ["design"] },
      { text: "A tech company building products", tags: ["cs"] },
      { text: "A construction or industrial site", tags: ["engineering"] },
    ],
  },
  {
    id: "q7",
    prompt: "How do you prefer to learn something new?",
    options: [
      { text: "Take it apart and see how it works", tags: ["engineering", "cs"] },
      { text: "Read case studies and real examples", tags: ["medicine", "humanities"] },
      { text: "Sketch or prototype it first", tags: ["design"] },
      { text: "Practice problems until it clicks", tags: ["math", "cs"] },
    ],
  },
  {
    id: "q8",
    prompt: "Ten years from now, you'd be proudest to say you...",
    options: [
      { text: "Built infrastructure people rely on", tags: ["engineering"] },
      { text: "Treated or saved patients", tags: ["medicine"] },
      { text: "Shipped a product millions of people use", tags: ["cs"] },
      { text: "Created something people find beautiful or moving", tags: ["design", "humanities"] },
    ],
  },
];

export const careerQuizResults: Record<
  string,
  { major: string; description: string; subjectsToStrengthen: SubjectKey[] }
> = {
  engineering: {
    major: "Mechanical / Civil Engineering",
    description: "You think in systems and like seeing ideas become physical things. Engineering programs will lean hard on physics and math.",
    subjectsToStrengthen: ["physics", "mathematics"],
  },
  cs: {
    major: "Computer Science",
    description: "You enjoy logic, structure, and building things that run. A CS degree rewards strong math fundamentals and early programming practice.",
    subjectsToStrengthen: ["mathematics", "computer-science"],
  },
  medicine: {
    major: "Medicine / Pre-Med",
    description: "You're drawn to biology and helping people directly. Pre-med tracks are heavy on biology and chemistry from day one.",
    subjectsToStrengthen: ["biology", "chemistry"],
  },
  design: {
    major: "Design / Architecture",
    description: "You care about how things look, feel, and communicate. Strong portfolios matter more than any single subject, but math still shows up in architecture.",
    subjectsToStrengthen: ["mathematics"],
  },
};

// ---------------------------------------------------------------------------
// Planr  (AI course advisor / learning path)
// ---------------------------------------------------------------------------

export type PlanrCourse = {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "upcoming";
};

export type PlanrProject = {
  id: string;
  title: string;
  goal: string;
  courseCount: number;
  updatedLabel: string;
  progressPercent: number;
  courses: PlanrCourse[];
};

export const planrProjects: PlanrProject[] = [
  {
    id: "computer-engineering",
    title: "Path to Computer Engineering",
    goal: "Prepare for a Computer Engineering major",
    courseCount: 5,
    updatedLabel: "Updated recently",
    progressPercent: 30,
    courses: [
      { id: "c1", title: "Algebra II fundamentals", status: "completed" },
      { id: "c2", title: "Intro to Programming (Python)", status: "in-progress" },
      { id: "c3", title: "Physics: Mechanics & Circuits", status: "upcoming" },
      { id: "c4", title: "Discrete Mathematics", status: "upcoming" },
      { id: "c5", title: "Data Structures & Algorithms", status: "upcoming" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Bookings  (student & tutor dashboards)
// ---------------------------------------------------------------------------

export type Booking = {
  id: string;
  tutorId: string;
  subject: SubjectKey;
  dateLabel: string;
  timeLabel: string;
  status: "upcoming" | "completed" | "cancelled";
};

export const studentBookings: Booking[] = [
  { id: "bk-001", tutorId: "lara-khoury", subject: "physics", dateLabel: "Fri, Aug 21", timeLabel: "5:00 PM", status: "upcoming" },
  { id: "bk-002", tutorId: "omar-zreik", subject: "computer-science", dateLabel: "Sun, Aug 23", timeLabel: "2:30 PM", status: "upcoming" },
  { id: "bk-003", tutorId: "nour-abou-zeid", subject: "chemistry", dateLabel: "Aug 10", timeLabel: "4:00 PM", status: "completed" },
  { id: "bk-004", tutorId: "maya-saleh", subject: "mathematics", dateLabel: "Aug 3", timeLabel: "6:00 PM", status: "completed" },
];

export const tutorSchedule: Booking[] = [
  { id: "bk-101", tutorId: "lara-khoury", subject: "physics", dateLabel: "Fri, Aug 21", timeLabel: "5:00 PM", status: "upcoming" },
  { id: "bk-102", tutorId: "lara-khoury", subject: "mathematics", dateLabel: "Sat, Aug 22", timeLabel: "11:00 AM", status: "upcoming" },
  { id: "bk-103", tutorId: "lara-khoury", subject: "physics", dateLabel: "Aug 14", timeLabel: "5:00 PM", status: "completed" },
];

// ---------------------------------------------------------------------------
// Dashboard stats  (StatCard rows)
// ---------------------------------------------------------------------------

export const studentDashboardStats = [
  { label: "Upcoming sessions", value: "2" },
  { label: "Sessions completed", value: "14" },
  { label: "Practice avg. score", value: "76%" },
  { label: "Planr progress", value: "30%" },
];

export const tutorDashboardStats = [
  { label: "This week's sessions", value: "6" },
  { label: "Total students", value: "23" },
  { label: "Rating", value: "4.9 ★" },
  { label: "Earnings this month", value: "$410" },
];

export const adminDashboardStats = [
  { label: "Pending applications", value: "5" },
  { label: "Active tutors", value: "9" },
  { label: "Bookings this week", value: "31" },
  { label: "Avg. tutor rating", value: "4.8 ★" },
];

// ---------------------------------------------------------------------------
// Tutor applications  (admin review queue)
// ---------------------------------------------------------------------------

export type TutorApplication = {
  id: string;
  name: string;
  subjects: SubjectKey[];
  submittedLabel: string;
  status: "pending" | "approved" | "rejected";
};

export const tutorApplications: TutorApplication[] = [
  { id: "app-01", name: "Rana Kassem", subjects: ["mathematics", "physics"], submittedLabel: "Aug 18", status: "pending" },
  { id: "app-02", name: "Fadi Chidiac", subjects: ["computer-science"], submittedLabel: "Aug 17", status: "pending" },
  { id: "app-03", name: "Layla Osman", subjects: ["biology", "chemistry"], submittedLabel: "Aug 15", status: "pending" },
  { id: "app-04", name: "Georges Abi Nader", subjects: ["mathematics"], submittedLabel: "Aug 12", status: "approved" },
  { id: "app-05", name: "Hiba Younes", subjects: ["chemistry"], submittedLabel: "Aug 9", status: "rejected" },
];