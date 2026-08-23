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
  experienceYears: number;
  // ISO date string. Drives the Home page's "Recently joined" ordering —
  // sort tutors by this field descending and take the first few, rather
  // than hardcoding which three tutors are "featured".
  joinedAt: string;
};

export const tutors: Tutor[] = [
  {
    id: "lara-khoury",
    avatar: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663829205152/YNXgfbfSBDEVExdw.png",
    name: "Lara Khoury",
    languages: ["Arabic", "English", "French"],
    rating: 4.9,
    sessions: 143,
    pricePerHour: 25,
    subjects: ["physics", "mathematics"],
    curriculum: "Lebanese Bac",
    bio: "Physics graduate from AUB with 4 years tutoring experience. I break down complex mechanics problems into simple, intuitive steps.",
    location: "Beirut",
    experienceYears: 4,
    joinedAt: "2026-08-18",
  },
  {
    id: "nour-abou-zeid",
    avatar: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663829205152/kUTsWPhxxkQBxEET.png",
    name: "Nour Abou Zeid",
    languages: ["Arabic", "English", "French"],
    rating: 4.9,
    sessions: 312,
    pricePerHour: 28,
    subjects: ["physics", "chemistry"],
    curriculum: "Lebanese Bac",
    bio: "Former Lebanese Bac top-10 finisher, now tutoring full time. Specializes in exam technique for the official baccalaureate.",
    location: "Jounieh",
    experienceYears: 6,
    joinedAt: "2025-11-02",
  },
  {
    id: "omar-zreik",
    avatar: "https://i.pravatar.cc/150?img=14",
    name: "Omar Zreik",
    languages: ["Arabic", "English"],
    rating: 4.9,
    sessions: 76,
    pricePerHour: 32,
    subjects: ["computer-science", "mathematics"],
    curriculum: "University",
    bio: "Software engineer at a Beirut fintech, teaches CS fundamentals and intro programming to university freshmen on weekends.",
    location: "Beirut",
    experienceYears: 3,
    joinedAt: "2025-09-14",
  },
  {
    id: "yasmine-fakhoury",
    avatar: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663829205152/WeWvYpaVxvjseXDy.png",
    name: "Yasmine Fakhoury",
    languages: ["Arabic", "English"],
    rating: 4.8,
    sessions: 98,
    pricePerHour: 22,
    subjects: ["biology", "chemistry"],
    curriculum: "Lebanese Bac",
    bio: "Pre-med student who tutors Grade 12 biology and chemistry around her own class schedule. Big on practice questions over rote memorizing.",
    location: "Zahle",
    experienceYears: 2,
    joinedAt: "2025-10-05",
  },
  {
    id: "karim-haddad",
    avatar: "https://i.pravatar.cc/150?img=51",
    name: "Karim Haddad",
    languages: ["Arabic", "English", "French"],
    rating: 4.7,
    sessions: 61,
    pricePerHour: 20,
    subjects: ["mathematics"],
    curriculum: "Grade 10-11",
    bio: "Math teacher's assistant covering algebra and pre-calc foundations for students building up to the Bac.",
    location: "Tripoli",
    experienceYears: 5,
    joinedAt: "2025-06-20",
  },
  {
    id: "sarah-matta",
    avatar: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663829205152/xeqYSnuZkSLePUst.png",
    name: "Sarah Matta",
    languages: ["Arabic", "English"],
    rating: 4.9,
    sessions: 204,
    pricePerHour: 30,
    subjects: ["chemistry", "biology"],
    curriculum: "AS-Level",
    bio: "AS/A-Level chemistry specialist, previously taught at a British-curriculum school in Beirut for four years.",
    location: "Beirut",
    experienceYears: 4,
    joinedAt: "2025-07-18",
  },
  {
    id: "elias-nassar",
    avatar: "https://i.pravatar.cc/150?img=60",
    name: "Elias Nassar",
    languages: ["Arabic", "English"],
    rating: 4.6,
    sessions: 45,
    pricePerHour: 18,
    subjects: ["computer-science"],
    curriculum: "University",
    bio: "CS sophomore at LAU, tutors intro programming (Python/Java) and data structures for first- and second-year students.",
    location: "Byblos",
    experienceYears: 2,
    joinedAt: "2025-05-03",
  },
  {
    id: "maya-saleh",
    avatar: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663829205152/lBzuntybaBzVUCKt.png",
    name: "Maya Saleh",
    languages: ["Arabic", "English", "French"],
    rating: 4.8,
    sessions: 167,
    pricePerHour: 27,
    subjects: ["physics", "mathematics"],
    curriculum: "Lebanese Bac",
    bio: "Engineering student who scored 19/20 on the Bac physics exam. Explains problems the way she wishes they'd been explained to her.",
    location: "Saida",
    experienceYears: 3,
    joinedAt: "2025-08-27",
  },
  {
    id: "tarek-abdallah",
    avatar: "https://i.pravatar.cc/150?img=53",
    name: "Tarek Abdallah",
    languages: ["Arabic", "English"],
    rating: 4.5,
    sessions: 33,
    pricePerHour: 19,
    subjects: ["biology"],
    curriculum: "Grade 10-11",
    bio: "Biology major, patient with beginners, mostly works with students who are just starting to build lab and exam habits.",
    location: "Nabatieh",
    experienceYears: 1,
    joinedAt: "2025-04-11",
  },
  {
    id: "kamal-nassar",
    avatar: "https://i.pravatar.cc/150?img=18",
    name: "Kamal Nassar",
    languages: ["Arabic", "English"],
    rating: 4.8,
    sessions: 89,
    pricePerHour: 30,
    subjects: ["computer-science", "mathematics"],
    curriculum: "University",
    bio: "CS student at LAU specialising in algorithms. I've coached 12 students through the Lebanese Bac computer science exam.",
    location: "Beirut",
    experienceYears: 3,
    joinedAt: "2026-08-15",
  },
  {
    id: "rami-hamdan",
    avatar: "https://i.pravatar.cc/150?img=25",
    name: "Rami Hamdan",
    languages: ["Arabic", "English"],
    rating: 4.6,
    sessions: 54,
    pricePerHour: 22,
    subjects: ["mathematics", "computer-science"],
    curriculum: "University",
    bio: "Second-year CE student at USEK. I explain things the way I wish someone had explained them to me.",
    location: "Jounieh",
    experienceYears: 2,
    joinedAt: "2026-08-12",
  },
];

// Home page's "Recently joined" section — the 3 most recently joined
// tutors, computed here rather than duplicated as sort logic in the page.
export const featuredTutors: Tutor[] = [...tutors]
  .sort((a, b) => (a.joinedAt < b.joinedAt ? 1 : -1))
  .slice(0, 3);

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
  "kamal-nassar": ["Algorithms", "Data Structures", "Competitive Programming"],
  "rami-hamdan": ["Web Development", "Calculus I", "Intro Programming"],
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
  "kamal-nassar": ["Tue · 7:00 PM", "Thu · 5:00 PM"],
  "rami-hamdan": ["Wed · 6:30 PM", "Sat · 1:00 PM"],
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

  // Physics — additional levels
  {
    id: "phy-003",
    subject: "physics",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "In a series circuit, if the total resistance is 10Ω and the current is 2A, what is the total voltage?",
    options: ["5 V", "12 V", "20 V", "0.2 V"],
    correctIndex: 2,
  },
  {
    id: "phy-004",
    subject: "physics",
    level: "Grade 11",
    prompt: "According to Newton's Second Law, force equals mass times what?",
    options: ["Velocity", "Acceleration", "Momentum", "Displacement"],
    correctIndex: 1,
  },
  {
    id: "phy-005",
    subject: "physics",
    level: "Grade 10",
    prompt: "A car travels 150 km in 3 hours. What is its average speed?",
    options: ["30 km/h", "50 km/h", "450 km/h", "100 km/h"],
    correctIndex: 1,
  },
  {
    id: "phy-006",
    subject: "physics",
    level: "AS-Level",
    prompt: "What happens to the wavelength of a wave as its frequency increases, assuming constant wave speed?",
    options: ["It increases", "It decreases", "It stays the same", "It becomes zero"],
    correctIndex: 1,
  },
  {
    id: "phy-007",
    subject: "physics",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "A 2 kg object is lifted 5 m against gravity (g = 10 m/s²). How much work is done against gravity?",
    options: ["10 J", "50 J", "100 J", "20 J"],
    correctIndex: 2,
  },

  // Mathematics — additional levels
  {
    id: "math-002",
    subject: "mathematics",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "What is ∫2x dx?",
    options: ["x² + C", "2x² + C", "x + C", "2 + C"],
    correctIndex: 0,
  },
  {
    id: "math-003",
    subject: "mathematics",
    level: "Grade 11",
    prompt: "What are the roots of x² − 5x + 6 = 0?",
    options: ["x = 2, x = 3", "x = 1, x = 6", "x = −2, x = −3", "x = 5, x = 6"],
    correctIndex: 0,
  },
  {
    id: "math-004",
    subject: "mathematics",
    level: "Grade 10",
    prompt: "Solve for x: 3x + 7 = 22",
    options: ["x = 5", "x = 3", "x = 15", "x = 29/3"],
    correctIndex: 0,
  },
  {
    id: "math-005",
    subject: "mathematics",
    level: "AS-Level",
    prompt: "What is lim(x→2) of (x² − 4) / (x − 2)?",
    options: ["0", "2", "4", "Undefined"],
    correctIndex: 2,
  },
  {
    id: "math-006",
    subject: "mathematics",
    level: "University entry prep",
    prompt: "What is the determinant of the matrix [[2, 3], [1, 4]]?",
    options: ["5", "8", "11", "−5"],
    correctIndex: 0,
  },

  // Computer Science — additional levels
  {
    id: "cs-002",
    subject: "computer-science",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "What does the following Python code print?\nprint(2 + 3 * 2)",
    options: ["10", "8", "7", "12"],
    correctIndex: 1,
  },
  {
    id: "cs-003",
    subject: "computer-science",
    level: "University entry prep",
    prompt: "Which data structure uses LIFO (Last In, First Out) ordering?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctIndex: 1,
  },
  {
    id: "cs-004",
    subject: "computer-science",
    level: "Grade 11",
    prompt: "What is the result of the boolean expression: True AND False OR True?",
    options: ["True", "False", "Error", "Undefined"],
    correctIndex: 0,
  },
  {
    id: "cs-005",
    subject: "computer-science",
    level: "AS-Level",
    prompt: "In a recursive function, what is essential to prevent infinite recursion?",
    options: ["A loop", "A base case", "A return statement", "A global variable"],
    correctIndex: 1,
  },

  // Chemistry — additional levels
  {
    id: "chem-002",
    subject: "chemistry",
    level: "Grade 11",
    prompt: "Which trend is observed as you move left to right across a period in the periodic table?",
    options: [
      "Atomic radius increases",
      "Electronegativity increases",
      "Ionization energy decreases",
      "Metallic character increases",
    ],
    correctIndex: 1,
  },
  {
    id: "chem-003",
    subject: "chemistry",
    level: "Grade 10",
    prompt: "What subatomic particle has a negative charge?",
    options: ["Proton", "Neutron", "Electron", "Nucleus"],
    correctIndex: 2,
  },
  {
    id: "chem-004",
    subject: "chemistry",
    level: "AS-Level",
    prompt: "How many moles are in 44 g of CO₂? (Molar mass of CO₂ = 44 g/mol)",
    options: ["0.5 mol", "1 mol", "2 mol", "44 mol"],
    correctIndex: 1,
  },
  {
    id: "chem-005",
    subject: "chemistry",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "A solution with pH 3 is considered:",
    options: ["Strongly basic", "Neutral", "Weakly basic", "Acidic"],
    correctIndex: 3,
  },

  // Biology — additional levels
  {
    id: "bio-002",
    subject: "biology",
    level: "Grade 11",
    prompt: "What is the primary product of the light-dependent reactions of photosynthesis?",
    options: ["Glucose", "Oxygen and ATP", "Carbon dioxide", "Water"],
    correctIndex: 1,
  },
  {
    id: "bio-003",
    subject: "biology",
    level: "Grade 10",
    prompt: "Which organelle is responsible for producing energy (ATP) in a cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
    correctIndex: 2,
  },
  {
    id: "bio-004",
    subject: "biology",
    level: "AS-Level",
    prompt: "During DNA replication, which enzyme is responsible for unwinding the double helix?",
    options: ["DNA polymerase", "Helicase", "Ligase", "RNA polymerase"],
    correctIndex: 1,
  },
  {
    id: "bio-005",
    subject: "biology",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "Natural selection acts on which of the following?",
    options: [
      "An individual's genotype only",
      "Heritable variation within a population",
      "Random mutations exclusively",
      "Species as a whole, uniformly",
    ],
    correctIndex: 1,
  },

  {
    id: "phy-008",
    subject: "physics",
    level: "Grade 10",
    prompt: "What is the SI unit of force?",
    options: ["Joule", "Newton", "Watt", "Pascal"],
    correctIndex: 1,
  },
  {
    id: "phy-009",
    subject: "physics",
    level: "Grade 10",
    prompt: "An object at rest will remain at rest unless acted upon by a(n):",
    options: ["unbalanced force", "balanced force", "friction force", "gravitational force"],
    correctIndex: 0,
  },
  {
    id: "phy-010",
    subject: "physics",
    level: "Grade 10",
    prompt: "Which of these is a vector quantity?",
    options: ["Mass", "Speed", "Velocity", "Temperature"],
    correctIndex: 2,
  },
  {
    id: "phy-011",
    subject: "physics",
    level: "Grade 11",
    prompt: "What is the unit of momentum?",
    options: ["kg·m/s", "N·m", "J·s", "W"],
    correctIndex: 0,
  },
  {
    id: "phy-012",
    subject: "physics",
    level: "Grade 11",
    prompt: "The law of conservation of energy states that energy:",
    options: ["can be created but not destroyed", "can be destroyed but not created", "cannot be created or destroyed, only transformed", "is always constant in every system"],
    correctIndex: 2,
  },
  {
    id: "phy-013",
    subject: "physics",
    level: "Grade 11",
    prompt: "A projectile launched horizontally will have:",
    options: ["constant horizontal and vertical velocity", "constant horizontal velocity, changing vertical velocity", "changing horizontal velocity, constant vertical velocity", "zero velocity at the top"],
    correctIndex: 1,
  },
  {
    id: "phy-014",
    subject: "physics",
    level: "AS-Level",
    prompt: "In simple harmonic motion, the restoring force is:",
    options: ["constant", "proportional to displacement and opposite in direction", "independent of displacement", "proportional to velocity"],
    correctIndex: 1,
  },
  {
    id: "phy-015",
    subject: "physics",
    level: "AS-Level",
    prompt: "The refractive index of a medium is defined as the ratio of:",
    options: ["speed of light in vacuum to speed of light in the medium", "speed of light in the medium to speed of light in vacuum", "wavelength in vacuum to wavelength in medium", "frequency in vacuum to frequency in medium"],
    correctIndex: 0,
  },
  {
    id: "phy-016",
    subject: "physics",
    level: "AS-Level",
    prompt: "Which quantity is conserved in an elastic collision?",
    options: ["Only momentum", "Only kinetic energy", "Both momentum and kinetic energy", "Neither"],
    correctIndex: 2,
  },
  {
    id: "phy-017",
    subject: "physics",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "A capacitor with capacitance 2F charged to 10V stores how much energy? (E = ½CV²)",
    options: ["10 J", "20 J", "100 J", "200 J"],
    correctIndex: 2,
  },
  {
    id: "phy-018",
    subject: "physics",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "In an AC circuit, the power factor is the cosine of the phase angle between:",
    options: ["voltage and resistance", "current and voltage", "current and frequency", "resistance and impedance"],
    correctIndex: 1,
  },
  {
    id: "phy-019",
    subject: "physics",
    level: "University entry prep",
    prompt: "What does Gauss's Law relate?",
    options: ["Electric flux through a closed surface to enclosed charge", "Magnetic flux to current", "Force between two charges", "Energy stored in a capacitor"],
    correctIndex: 0,
  },
  {
    id: "phy-020",
    subject: "physics",
    level: "University entry prep",
    prompt: "The de Broglie wavelength of a particle is inversely proportional to its:",
    options: ["mass", "momentum", "charge", "energy"],
    correctIndex: 1,
  },
  {
    id: "phy-021",
    subject: "physics",
    level: "University entry prep",
    prompt: "Which of these best describes Heisenberg's Uncertainty Principle?",
    options: ["Position and momentum cannot both be measured with arbitrary precision simultaneously", "Energy is always conserved", "Light behaves only as a wave", "Time is absolute"],
    correctIndex: 0,
  },
  {
    id: "phy-022",
    subject: "physics",
    level: "University entry prep",
    prompt: "In special relativity, as an object's speed approaches the speed of light, its relativistic mass:",
    options: ["decreases", "stays constant", "increases without bound", "becomes negative"],
    correctIndex: 2,
  },
  {
    id: "math-007",
    subject: "mathematics",
    level: "Grade 10",
    prompt: "What is the slope of the line y = 3x + 5?",
    options: ["3", "5", "1/3", "-3"],
    correctIndex: 0,
  },
  {
    id: "math-008",
    subject: "mathematics",
    level: "Grade 10",
    prompt: "Simplify: (x²)(x³)",
    options: ["x⁵", "x⁶", "x¹", "2x⁵"],
    correctIndex: 0,
  },
  {
    id: "math-009",
    subject: "mathematics",
    level: "Grade 10",
    prompt: "What is the area of a triangle with base 8 and height 5?",
    options: ["13", "20", "40", "4.5"],
    correctIndex: 1,
  },
  {
    id: "math-010",
    subject: "mathematics",
    level: "Grade 11",
    prompt: "What is the sum of the interior angles of a hexagon?",
    options: ["360°", "540°", "720°", "900°"],
    correctIndex: 2,
  },
  {
    id: "math-011",
    subject: "mathematics",
    level: "Grade 11",
    prompt: "If sin(θ) = 0.5, what is θ in the range 0°–90°?",
    options: ["15°", "30°", "45°", "60°"],
    correctIndex: 1,
  },
  {
    id: "math-012",
    subject: "mathematics",
    level: "Grade 11",
    prompt: "What is the value of log₂(8)?",
    options: ["2", "3", "4", "8"],
    correctIndex: 1,
  },
  {
    id: "math-013",
    subject: "mathematics",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "What is the derivative of sin(x)?",
    options: ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"],
    correctIndex: 0,
  },
  {
    id: "math-014",
    subject: "mathematics",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "What is ∫₀¹ x dx?",
    options: ["0", "1/2", "1", "2"],
    correctIndex: 1,
  },
  {
    id: "math-015",
    subject: "mathematics",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "The discriminant of x² + 4x + 4 = 0 is:",
    options: ["0", "4", "16", "-4"],
    correctIndex: 0,
  },
  {
    id: "math-016",
    subject: "mathematics",
    level: "AS-Level",
    prompt: "What is the derivative of e^x?",
    options: ["e^x", "xe^(x-1)", "ln(x)", "1/x"],
    correctIndex: 0,
  },
  {
    id: "math-017",
    subject: "mathematics",
    level: "AS-Level",
    prompt: "What is the value of ∫(1/x) dx?",
    options: ["x + C", "ln|x| + C", "1/x² + C", "e^x + C"],
    correctIndex: 1,
  },
  {
    id: "math-018",
    subject: "mathematics",
    level: "AS-Level",
    prompt: "A sequence is defined by aₙ = 2aₙ₋₁ + 1, a₁ = 1. What is a₃?",
    options: ["3", "5", "7", "9"],
    correctIndex: 2,
  },
  {
    id: "math-019",
    subject: "mathematics",
    level: "University entry prep",
    prompt: "What is the rank of a 3×3 identity matrix?",
    options: ["0", "1", "2", "3"],
    correctIndex: 3,
  },
  {
    id: "math-020",
    subject: "mathematics",
    level: "University entry prep",
    prompt: "The eigenvalues of a diagonal matrix are:",
    options: ["always zero", "the diagonal entries themselves", "always equal to 1", "undefined"],
    correctIndex: 1,
  },
  {
    id: "math-021",
    subject: "mathematics",
    level: "University entry prep",
    prompt: "What is the dot product of vectors (1, 2) and (3, 4)?",
    options: ["7", "10", "11", "14"],
    correctIndex: 2,
  },
  {
    id: "chem-006",
    subject: "chemistry",
    level: "Grade 10",
    prompt: "What is the chemical symbol for Sodium?",
    options: ["So", "Sd", "Na", "N"],
    correctIndex: 2,
  },
  {
    id: "chem-007",
    subject: "chemistry",
    level: "Grade 10",
    prompt: "How many protons does a neutral Carbon atom have?",
    options: ["4", "6", "8", "12"],
    correctIndex: 1,
  },
  {
    id: "chem-008",
    subject: "chemistry",
    level: "Grade 10",
    prompt: "Which state of matter has a definite volume but no definite shape?",
    options: ["Solid", "Liquid", "Gas", "Plasma"],
    correctIndex: 1,
  },
  {
    id: "chem-009",
    subject: "chemistry",
    level: "Grade 11",
    prompt: "What type of bond forms between a metal and a nonmetal?",
    options: ["Covalent", "Ionic", "Metallic", "Hydrogen"],
    correctIndex: 1,
  },
  {
    id: "chem-010",
    subject: "chemistry",
    level: "Grade 11",
    prompt: "What is the pH of a neutral solution at 25°C?",
    options: ["0", "7", "14", "1"],
    correctIndex: 1,
  },
  {
    id: "chem-011",
    subject: "chemistry",
    level: "Grade 11",
    prompt: "Which gas is released when an acid reacts with a metal?",
    options: ["Oxygen", "Carbon dioxide", "Hydrogen", "Nitrogen"],
    correctIndex: 2,
  },
  {
    id: "chem-012",
    subject: "chemistry",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "What is the molarity of a solution containing 2 moles of solute in 4 liters of solution?",
    options: ["0.5 M", "2 M", "4 M", "8 M"],
    correctIndex: 0,
  },
  {
    id: "chem-013",
    subject: "chemistry",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "In a redox reaction, oxidation involves:",
    options: ["Gain of electrons", "Loss of electrons", "Gain of protons", "Loss of protons"],
    correctIndex: 1,
  },
  {
    id: "chem-014",
    subject: "chemistry",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "Which of the following is an example of an exothermic reaction?",
    options: ["Photosynthesis", "Combustion", "Melting ice", "Evaporation"],
    correctIndex: 1,
  },
  {
    id: "chem-015",
    subject: "chemistry",
    level: "AS-Level",
    prompt: "What is the empirical formula of a compound with 40% C, 6.7% H, 53.3% O by mass?",
    options: ["CH2O", "C2H4O2", "C3H6O3", "CHO"],
    correctIndex: 0,
  },
  {
    id: "chem-016",
    subject: "chemistry",
    level: "AS-Level",
    prompt: "According to Le Chatelier's Principle, increasing pressure on a gaseous equilibrium shifts it toward:",
    options: ["the side with more moles of gas", "the side with fewer moles of gas", "no change", "always the reactants"],
    correctIndex: 1,
  },
  {
    id: "chem-017",
    subject: "chemistry",
    level: "AS-Level",
    prompt: "What is the hybridization of carbon in methane (CH₄)?",
    options: ["sp", "sp²", "sp³", "sp³d"],
    correctIndex: 2,
  },
  {
    id: "chem-018",
    subject: "chemistry",
    level: "University entry prep",
    prompt: "What is the rate law order for a reaction where rate = k[A]²[B]?",
    options: ["First order", "Second order", "Third order", "Zero order"],
    correctIndex: 2,
  },
  {
    id: "chem-019",
    subject: "chemistry",
    level: "University entry prep",
    prompt: "Which quantum number describes the shape of an orbital?",
    options: ["Principal (n)", "Azimuthal (l)", "Magnetic (mₗ)", "Spin (mₛ)"],
    correctIndex: 1,
  },
  {
    id: "chem-020",
    subject: "chemistry",
    level: "University entry prep",
    prompt: "The Gibbs free energy equation is:",
    options: ["ΔG = ΔH - TΔS", "ΔG = ΔH + TΔS", "ΔG = TΔS - ΔH", "ΔG = ΔH × TΔS"],
    correctIndex: 0,
  },
  {
    id: "chem-021",
    subject: "chemistry",
    level: "University entry prep",
    prompt: "Which of the following best describes a buffer solution?",
    options: ["A solution that resists changes in temperature", "A solution that resists changes in pH", "A solution with a pH of exactly 7", "A solution that is always acidic"],
    correctIndex: 1,
  },
  {
    id: "bio-006",
    subject: "biology",
    level: "Grade 10",
    prompt: "What is the basic unit of life?",
    options: ["Atom", "Molecule", "Cell", "Tissue"],
    correctIndex: 2,
  },
  {
    id: "bio-007",
    subject: "biology",
    level: "Grade 10",
    prompt: "Which biomolecule stores genetic information?",
    options: ["Protein", "Carbohydrate", "Lipid", "DNA"],
    correctIndex: 3,
  },
  {
    id: "bio-008",
    subject: "biology",
    level: "Grade 10",
    prompt: "What is the process by which plants make food using sunlight?",
    options: ["Respiration", "Photosynthesis", "Fermentation", "Digestion"],
    correctIndex: 1,
  },
  {
    id: "bio-009",
    subject: "biology",
    level: "Grade 11",
    prompt: "What is the function of red blood cells?",
    options: ["Fight infection", "Carry oxygen", "Clot blood", "Produce antibodies"],
    correctIndex: 1,
  },
  {
    id: "bio-010",
    subject: "biology",
    level: "Grade 11",
    prompt: "Which organ is primarily responsible for filtering blood in the human body?",
    options: ["Liver", "Kidney", "Lung", "Heart"],
    correctIndex: 1,
  },
  {
    id: "bio-011",
    subject: "biology",
    level: "Grade 11",
    prompt: "What is the term for an organism's genetic makeup?",
    options: ["Phenotype", "Genotype", "Karyotype", "Ecotype"],
    correctIndex: 1,
  },
  {
    id: "bio-012",
    subject: "biology",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "During meiosis, when does crossing over typically occur?",
    options: ["Prophase I", "Metaphase II", "Anaphase I", "Telophase II"],
    correctIndex: 0,
  },
  {
    id: "bio-013",
    subject: "biology",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "What is the role of enzymes in biological reactions?",
    options: ["They are consumed in the reaction", "They increase activation energy", "They act as catalysts, lowering activation energy", "They only work at high temperatures"],
    correctIndex: 2,
  },
  {
    id: "bio-014",
    subject: "biology",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "In a dihybrid cross between two heterozygous parents (AaBb × AaBb), what fraction of offspring show both dominant traits?",
    options: ["1/4", "3/8", "9/16", "1/16"],
    correctIndex: 2,
  },
  {
    id: "bio-015",
    subject: "biology",
    level: "AS-Level",
    prompt: "What is the role of tRNA in protein synthesis?",
    options: ["Carries amino acids to the ribosome", "Stores genetic code", "Catalyzes DNA replication", "Forms the cell membrane"],
    correctIndex: 0,
  },
  {
    id: "bio-016",
    subject: "biology",
    level: "AS-Level",
    prompt: "Which process describes programmed cell death?",
    options: ["Mitosis", "Apoptosis", "Meiosis", "Necrosis"],
    correctIndex: 1,
  },
  {
    id: "bio-017",
    subject: "biology",
    level: "AS-Level",
    prompt: "In the Hardy-Weinberg equilibrium, p² + 2pq + q² = 1 represents:",
    options: ["Allele frequencies", "Genotype frequencies", "Phenotype ratios", "Mutation rates"],
    correctIndex: 1,
  },
  {
    id: "bio-018",
    subject: "biology",
    level: "University entry prep",
    prompt: "Which technique is commonly used to amplify DNA segments?",
    options: ["Gel electrophoresis", "PCR (Polymerase Chain Reaction)", "Chromatography", "Centrifugation"],
    correctIndex: 1,
  },
  {
    id: "bio-019",
    subject: "biology",
    level: "University entry prep",
    prompt: "What is the primary function of the Golgi apparatus?",
    options: ["Energy production", "Protein modification and packaging", "Photosynthesis", "DNA replication"],
    correctIndex: 1,
  },
  {
    id: "bio-020",
    subject: "biology",
    level: "University entry prep",
    prompt: "Which of the following best describes homeostasis?",
    options: ["The process of cell division", "The maintenance of a stable internal environment", "The breakdown of glucose", "The synthesis of proteins"],
    correctIndex: 1,
  },
  {
    id: "bio-021",
    subject: "biology",
    level: "University entry prep",
    prompt: "In population ecology, carrying capacity refers to:",
    options: ["The maximum birth rate of a species", "The maximum population size an environment can sustain", "The rate of predation", "The genetic diversity of a population"],
    correctIndex: 1,
  },
  {
    id: "cs-006",
    subject: "computer-science",
    level: "Grade 10",
    prompt: "What does CPU stand for?",
    options: ["Central Process Unit", "Central Processing Unit", "Computer Processing Unit", "Central Processor Utility"],
    correctIndex: 1,
  },
  {
    id: "cs-007",
    subject: "computer-science",
    level: "Grade 10",
    prompt: "Which of these is an example of an input device?",
    options: ["Monitor", "Keyboard", "Printer", "Speaker"],
    correctIndex: 1,
  },
  {
    id: "cs-008",
    subject: "computer-science",
    level: "Grade 10",
    prompt: "What is a variable in programming?",
    options: ["A fixed value that never changes", "A named storage location that can hold data", "A type of loop", "A programming language"],
    correctIndex: 1,
  },
  {
    id: "cs-009",
    subject: "computer-science",
    level: "Grade 10",
    prompt: "Which symbol is commonly used for a single-line comment in Python?",
    options: ["//", "#", "<!--", "/*"],
    correctIndex: 1,
  },
  {
    id: "cs-010",
    subject: "computer-science",
    level: "Grade 11",
    prompt: "What is the output of: for i in range(3): print(i)",
    options: ["0 1 2", "1 2 3", "0 1 2 3", "1 2"],
    correctIndex: 0,
  },
  {
    id: "cs-011",
    subject: "computer-science",
    level: "Grade 11",
    prompt: "Which data type would you use to store True/False values?",
    options: ["Integer", "String", "Boolean", "Float"],
    correctIndex: 2,
  },
  {
    id: "cs-012",
    subject: "computer-science",
    level: "Grade 11",
    prompt: "What does 'debugging' mean in programming?",
    options: ["Writing new code", "Finding and fixing errors in code", "Deleting a program", "Compiling code"],
    correctIndex: 1,
  },
  {
    id: "cs-013",
    subject: "computer-science",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "What is the time complexity of binary search on a sorted array?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 1,
  },
  {
    id: "cs-014",
    subject: "computer-science",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "Which of these is a linear data structure?",
    options: ["Tree", "Graph", "Array", "Hash table"],
    correctIndex: 2,
  },
  {
    id: "cs-015",
    subject: "computer-science",
    level: "Grade 12 (Lebanese Bac)",
    prompt: "What does SQL stand for?",
    options: ["Structured Query Language", "Simple Query Language", "Sequential Query Logic", "Structured Question Language"],
    correctIndex: 0,
  },
  {
    id: "cs-016",
    subject: "computer-science",
    level: "AS-Level",
    prompt: "What is encapsulation in object-oriented programming?",
    options: ["Inheriting properties from a parent class", "Bundling data and methods that operate on that data within a class", "Creating multiple instances of a class", "Overriding a method"],
    correctIndex: 1,
  },
  {
    id: "cs-017",
    subject: "computer-science",
    level: "AS-Level",
    prompt: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble sort O(n²)", "Quick sort O(n log n)", "Selection sort O(n²)", "Insertion sort O(n²)"],
    correctIndex: 1,
  },
  {
    id: "cs-018",
    subject: "computer-science",
    level: "University entry prep",
    prompt: "What is the space complexity of an algorithm that uses a fixed amount of extra memory regardless of input size?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctIndex: 0,
  },
  {
    id: "cs-019",
    subject: "computer-science",
    level: "University entry prep",
    prompt: "In a hash table, what is a 'collision'?",
    options: ["When two keys hash to the same index", "When the table is full", "When a key is deleted", "When the hash function fails"],
    correctIndex: 0,
  },
  {
    id: "cs-020",
    subject: "computer-science",
    level: "University entry prep",
    prompt: "What does 'Big-O' notation describe?",
    options: ["The exact runtime of an algorithm", "The upper bound growth rate of an algorithm's time or space complexity", "The programming language used", "The number of lines of code"],
    correctIndex: 1,
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

// Every possible tag that appears across the 8 questions' options must
// have an entry here — a missing key means `careerPaths[tag]` is
// `undefined` for anyone whose top answer lands on that tag, which
// crashes the results screen. (This was previously missing entries
// for "biology", "humanities", "management", and "math" — a real bug,
// not just an incomplete-data issue.)
export const careerPaths: Record<
  string,
  { title: string; description: string; subjectsToStrengthen: SubjectKey[] }
> = {
  engineering: {
    title: "Mechanical / Civil Engineering",
    description:
      "You think in systems and like seeing ideas become physical things. Engineering programs will lean hard on physics and math.",
    subjectsToStrengthen: ["physics", "mathematics"],
  },
  cs: {
    title: "Computer Science",
    description:
      "You enjoy logic, structure, and building things that run. A CS degree rewards strong math fundamentals and early programming practice.",
    subjectsToStrengthen: ["mathematics", "computer-science"],
  },
  medicine: {
    title: "Medicine / Pre-Med",
    description:
      "You're drawn to directly helping people's health. Pre-med tracks are heavy on biology and chemistry from day one.",
    subjectsToStrengthen: ["biology", "chemistry"],
  },
  biology: {
    title: "Biology / Life Sciences",
    description:
      "You're pulled toward how living systems work, not just clinical practice. Research and lab-based biology programs build on strong biology and chemistry.",
    subjectsToStrengthen: ["biology", "chemistry"],
  },
  design: {
    title: "Design / Architecture",
    description:
      "You care about how things look, feel, and communicate. Strong portfolios matter more than any single subject, but math still shows up in architecture.",
    subjectsToStrengthen: ["mathematics"],
  },
  humanities: {
    title: "Humanities / Social Sciences",
    description:
      "You think in ideas, arguments, and how people understand each other. These programs reward strong reading, writing, and critical thinking over any one STEM subject.",
    subjectsToStrengthen: ["mathematics"],
  },
  management: {
    title: "Business / Management",
    description:
      "You like organizing people and keeping complex plans on track. Business programs lean on math for the analytical side and reward clear communication.",
    subjectsToStrengthen: ["mathematics"],
  },
  math: {
    title: "Mathematics / Data Science",
    description:
      "You think best in numbers and patterns, and enjoy problems that reward patient, methodical practice. Math-heavy programs build directly on strong math fundamentals.",
    subjectsToStrengthen: ["mathematics", "computer-science"],
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