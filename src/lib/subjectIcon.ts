// lib/subjectIcon.ts
//
// Subjects used to be a fixed 5-value union (SubjectKey) in lib/mock-data.ts,
// each hardcoded to its own icon. Now that Subject is a real, open-ended
// database table (an admin can add any subject name), there's no fixed set
// of keys to hang icons off anymore — so this matches by name instead,
// case-insensitively, and falls back to a generic icon for anything not
// in the list below. The 5 seeded subjects keep the exact icons the
// original mock design used.

const iconByName: Record<string, string> = {
  mathematics: "Σ",
  physics: "⚡",
  chemistry: "🧪",
  biology: "🧬",
  "computer science": "</>",
  english: "📖",
  arabic: "🗣️",
  french: "🇫🇷",
  history: "🏛️",
  geography: "🌍",
  economics: "📈",
  art: "🎨",
  music: "🎵",
};

const fallbackIcon = "📘";

export function getSubjectIcon(name: string): string {
  return iconByName[name.trim().toLowerCase()] ?? fallbackIcon;
}
