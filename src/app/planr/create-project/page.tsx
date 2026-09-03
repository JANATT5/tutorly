// app/planr/create-project/page.tsx  →  /planr/create-project
//
// Fixes the "Create a new project" 404 — this route didn't exist at
// all before, despite the button on /planr linking to it. Implements
// the 3-step process shown on /planr's empty state ("Set your goal",
// "Rate your skills", "Get your roadmap"). There's no real AI/roadmap
// generation backend yet, so step 3 surfaces the one seeded project
// in lib/mock-data as an illustrative result rather than pretending
// to generate something live — same honesty convention as Practice's
// "no questions yet" state. The GENERATION stays illustrative; what's
// real is that a logged-in student's roadmap is now actually saved via
// POST /api/planr-paths (see useCreatePlanrPath) instead of vanishing
// the moment they navigate away.

"use client";

import { useState } from "react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { useSubjects } from "@/hooks/useSubjects";
import { getSubjectIcon } from "@/lib/subjectIcon";
import { useCreatePlanrPath } from "@/hooks/usePlanrPaths";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type Step = 1 | 2 | 3;
type SkillLevel = "beginner" | "comfortable" | "confident";

// A grade/level picklist, not a database table — same category as the
// day/time-of-day options on the become-tutor form.
const levels = [
  "Grade 10",
  "Grade 11",
  "Grade 12 (Lebanese Bac)",
  "AS-Level",
  "University entry prep",
] as const;

const skillLevelOptions: { value: SkillLevel; label: string }[] = [
  { value: "beginner", label: "Just starting" },
  { value: "comfortable", label: "Comfortable" },
  { value: "confident", label: "Confident" },
];

// TODO(AI roadmap generation): this is still the one illustrative example
// the old lib/mock-data.ts shipped, just relocated here so the page keeps
// compiling now that that file is gone — NOT yet the real OpenAI-generated
// roadmap. Swap this out once that's wired up.
const illustrativeRoadmap = {
  title: "Path to Computer Engineering",
  courseCount: 5,
  updatedLabel: "Updated recently",
  progressPercent: 30,
  courses: [
    { id: "c1", title: "Algebra II fundamentals", status: "completed" as const },
    { id: "c2", title: "Intro to Programming (Python)", status: "in-progress" as const },
    { id: "c3", title: "Physics: Mechanics & Circuits", status: "upcoming" as const },
    { id: "c4", title: "Discrete Mathematics", status: "upcoming" as const },
    { id: "c5", title: "Data Structures & Algorithms", status: "upcoming" as const },
  ],
};

export default function CreateProjectPage() {
  const { data: subjects = [] } = useSubjects();
  const [step, setStep] = useState<Step>(1);

  // Step 1 — goal
  const [goal, setGoal] = useState("");
  const [currentLevel, setCurrentLevel] = useState<string>("");

  // Step 2 — skill ratings
  const [skillRatings, setSkillRatings] = useState<Record<string, SkillLevel>>({});

  // Step 3 result
  const [generated, setGenerated] = useState(false);

  const isStep1Valid = goal.trim().length > 0 && currentLevel.length > 0;
  const isStep2Valid = subjects.length > 0 && subjects.every((s) => skillRatings[s.id]);

  const result = illustrativeRoadmap;

  const { studentProfile } = useCurrentUser();
  const createPlanrPath = useCreatePlanrPath();

  function handleGenerate() {
    setGenerated(true);
    // The roadmap content itself is still illustrative (see the note
    // above) — but if a real student is logged in, save it for real so
    // it doesn't just vanish when they navigate away.
    if (studentProfile) {
      createPlanrPath.mutate({
        studentId: studentProfile.id,
        goal,
        steps: result.courses.map((c) => ({ title: c.title, status: c.status })),
      });
    }
  }

  return (
    <>
      <PageHero eyebrow={`Planr · Step ${step} of 3`} title="Build your roadmap" />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {step > 1 && !generated && (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="mb-6 flex items-center gap-1.5 text-sm text-subtle hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
        )}

        {step === 1 && (
          <div className="rounded-xl border border-border bg-white p-8">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">01</p>
            <h2 className="mt-2 font-display text-2xl text-fg">Set your goal</h2>
            <p className="mt-2 text-sm text-body">
              What are you working toward? Be as specific as you can.
            </p>

            <div className="mt-6">
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                  Your goal <span className="text-amber">*</span>
                </span>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Get into a Computer Engineering program"
                  className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-3 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </label>
            </div>

            <div className="mt-6">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                Current level <span className="text-amber">*</span>
              </span>
              <div className="mt-3 flex flex-wrap gap-3">
                {levels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setCurrentLevel(level)}
                    aria-pressed={currentLevel === level}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      currentLevel === level
                        ? "bg-forest text-white"
                        : "border border-border bg-white text-fg hover:border-forest"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => isStep1Valid && setStep(2)}
              disabled={!isStep1Valid}
              className="mt-8 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue: rate your skills →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-xl border border-border bg-white p-8">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">02</p>
            <h2 className="mt-2 font-display text-2xl text-fg">Rate your skills</h2>
            <p className="mt-2 text-sm text-body">
              Your roadmap skips what you already know and focuses time where it matters.
            </p>

            <div className="mt-6 space-y-5">
              {subjects.map((subject) => (
                <div key={subject.id}>
                  <p className="flex items-center gap-2 text-sm font-medium text-fg">
                    <span aria-hidden="true">{getSubjectIcon(subject.name)}</span>
                    {subject.name}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {skillLevelOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setSkillRatings((prev) => ({ ...prev, [subject.id]: option.value }))
                        }
                        aria-pressed={skillRatings[subject.id] === option.value}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                          skillRatings[subject.id] === option.value
                            ? "bg-forest text-white"
                            : "border border-border bg-white text-fg hover:border-forest"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => isStep2Valid && setStep(3)}
              disabled={!isStep2Valid}
              className="mt-8 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue: get your roadmap →
            </button>
          </div>
        )}

        {step === 3 && !generated && (
          <div className="rounded-xl border border-border bg-white p-8 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">03</p>
            <h2 className="mt-2 font-display text-2xl text-fg">Get your roadmap</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-body">
              We&apos;ll turn your goal and skill levels into an ordered set of courses to work
              through.
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              className="mt-6 rounded-full bg-amber px-7 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-amber-hover"
            >
              Generate my roadmap →
            </button>
          </div>
        )}

        {step === 3 && generated && (
          <div className="rounded-xl border border-border bg-white p-8">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber">
              Example roadmap
            </p>
            <p className="mt-1 text-xs text-subtle">
              Illustrative — real roadmap generation isn&apos;t wired up to a backend yet.
            </p>
            {studentProfile ? (
              <p className="mt-1 text-xs text-forest">
                {createPlanrPath.isSuccess
                  ? "Saved to your account."
                  : createPlanrPath.isPending
                    ? "Saving…"
                    : ""}
              </p>
            ) : (
              <p className="mt-1 text-xs text-subtle">
                <Link href="/login" className="underline underline-offset-2">
                  Log in
                </Link>{" "}
                to save this roadmap to your account.
              </p>
            )}

            <h2 className="mt-4 font-display text-2xl text-fg">{result.title}</h2>
            <p className="mt-1 text-sm text-subtle">
              {result.courseCount} courses · {result.updatedLabel}
            </p>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-forest"
                style={{ width: `${result.progressPercent}%` }}
                role="progressbar"
                aria-valuenow={result.progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            <ol className="mt-6 space-y-3">
              {result.courses.map((course, index) => (
                <li key={course.id} className="flex items-center gap-3 text-sm">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      course.status === "completed"
                        ? "bg-forest text-white"
                        : course.status === "in-progress"
                          ? "bg-amber text-fg"
                          : "bg-secondary text-subtle"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={course.status === "upcoming" ? "text-subtle" : "text-fg"}
                  >
                    {course.title}
                  </span>
                </li>
              ))}
            </ol>

            <Link
              href="/planr"
              className="mt-8 block rounded-full bg-forest px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
            >
              Done
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
