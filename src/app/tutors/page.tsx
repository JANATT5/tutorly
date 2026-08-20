// app/tutors/page.tsx  →  /tutors
//
// NOTE on scope: the subject pills below are wired to actually filter
// (client-side state), but the "Curriculum / Language / Rating / Price"
// dropdown buttons and the "Sort" control are VISUAL ONLY right now —
// Figma shows them as dropdowns but doesn't specify their option lists,
// so building working dropdown logic here would mean guessing at data
// that doesn't exist yet. Flagging clearly rather than shipping fake
// interactivity. Six of the nine tutors from the Figma screenshot are
// seeded below; the remaining three weren't visible in the reference
// image, so they're not fabricated here — add them once you have the
// real data.

"use client";

import { useState } from "react";
import PageBanner from "@/components/PageBanner";
import TutorCard from "@/components/TutorCard";

const subjectFilters = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"];

const tutors = [
  {
    name: "Lara Khoury",
    languages: ["Arabic", "English", "French"],
    rating: 4.9,
    sessions: 143,
    pricePerHour: 25,
    tags: ["Physics", "Mathematics", "Lebanese Bac", "IG/AS-Level"],
    bio: "Physics graduate from AUB with 4 years tutoring experience. I break down complex mechanics into simple, visual steps.",
    subjects: ["Physics", "Mathematics"],
  },
  {
    name: "Nour Abou Zeid",
    languages: ["Arabic", "English", "French"],
    rating: 4.9,
    sessions: 312,
    pricePerHour: 28,
    tags: ["Physics", "Chemistry", "Lebanese Bac", "IG/AS-Level", "IB"],
    bio: "Physics teacher at a private school in Beirut with 6 years of classroom and private tutoring experience.",
    subjects: ["Physics", "Chemistry"],
  },
  {
    name: "Omar Zreik",
    languages: ["Arabic", "English"],
    rating: 4.9,
    sessions: 76,
    pricePerHour: 32,
    tags: ["Computer Science", "Mathematics", "Lebanese Bac", "University prep"],
    bio: "AI researcher at AUB with a strong teaching background. I connect university-level CS concepts to real projects.",
    subjects: ["Computer Science", "Mathematics"],
  },
  {
    name: "Kamal Nassar",
    languages: ["Arabic", "English"],
    rating: 4.8,
    sessions: 89,
    pricePerHour: 30,
    tags: ["Mathematics"],
    bio: "Dedicated math tutor focused on building strong fundamentals before tackling exam-style problems.",
    subjects: ["Mathematics"],
  },
  {
    name: "Dani Abi Nader",
    languages: ["Arabic", "English"],
    rating: 4.8,
    sessions: 178,
    pricePerHour: 35,
    tags: ["Chemistry"],
    bio: "Chemistry tutor with a focus on Lebanese Bac exam prep and lab-based learning.",
    subjects: ["Chemistry"],
  },
  {
    name: "Hana Mansour",
    languages: ["Arabic", "French", "English"],
    rating: 4.7,
    sessions: 54,
    pricePerHour: 18,
    tags: ["Biology"],
    bio: "Biology tutor for Grade 12 students, specializing in clear explanations of genetics and cell biology.",
    subjects: ["Biology"],
  },
];

export default function TutorsPage() {
  const [activeSubject, setActiveSubject] = useState("All");

  const filteredTutors =
    activeSubject === "All"
      ? tutors
      : tutors.filter((tutor) => tutor.subjects.includes(activeSubject));

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <PageBanner eyebrow="Browse tutors" title="Find the right match">
        <input
          type="text"
          placeholder="Search by name, subject, or topic..."
          className="w-full max-w-xl rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none"
        />
      </PageBanner>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        {/* Subject filter pills */}
        <div className="mb-4 flex flex-wrap gap-2">
          {subjectFilters.map((subject) => (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeSubject === subject
                  ? "bg-[#1B4D3E] text-white"
                  : "border border-[#DDD8CF] bg-white text-[#3D3A37] hover:border-[#1B4D3E]"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Secondary filters — visual only, see note at top of file */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {["Curriculum", "Language", "Rating", "Price"].map((label) => (
              <button
                key={label}
                className="flex items-center gap-1 rounded-full border border-[#DDD8CF] bg-white px-3.5 py-1.5 text-sm text-[#3D3A37]"
              >
                {label} <span className="text-xs text-[#6B6560]">▾</span>
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1 rounded-full border border-[#DDD8CF] bg-white px-3.5 py-1.5 text-sm text-[#3D3A37]">
            Sort: <span className="font-semibold">Top rated</span>{" "}
            <span className="text-xs text-[#6B6560]">▾</span>
          </button>
        </div>

        <p className="mb-5 text-sm text-[#6B6560]">
          {filteredTutors.length} tutor{filteredTutors.length !== 1 ? "s" : ""} found
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTutors.map((tutor) => (
            <TutorCard
              key={tutor.name}
              name={tutor.name}
              languages={tutor.languages}
              rating={tutor.rating}
              sessions={tutor.sessions}
              pricePerHour={tutor.pricePerHour}
              tags={tutor.tags}
              bio={tutor.bio}
              href={`/tutors/${tutor.name.toLowerCase().replace(/\s+/g, "-")}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}