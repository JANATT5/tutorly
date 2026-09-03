// app/planr/create-project/page.tsx  →  /planr/create-project
//
// Fixes the "Create a new project" 404 — this route didn't exist at
// all before, despite the button on /planr linking to it. Implements
// the 3-step process shown on /planr's empty state ("Set your goal",
// "Rate your skills", "Get your roadmap"). Step 3 now calls
// POST /api/ai/roadmap (src/lib/ai — local Ollama model) to generate a
// real, goal-specific course roadmap instead of always showing the same
// static example. A logged-in student's generated roadmap is saved via
// POST /api/planr-paths (see useCreatePlanrPath).

"use client";

import { useState } from "react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { useSubjects } from "@/hooks/useSubjects";
import { getSubjectIcon } from "@/lib/subjectIcon";
import { useCreatePlanrPath } from "@/hooks/usePlanrPaths";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { axiosPost, ApiError } from "@/lib/axios";

type Step = 1 | 2 | 3;
type SkillLevel = "beginner" | "comfortable" | "confident";
type CourseStatus = "completed" | "in-progress" | "upcoming";
type Roadmap = { title: string; courses: { title: string; status: CourseStatus }[] };

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

type GenerationState = "idle" | "generating" | "ready" | "error";

export default function CreateProjectPage() {
  const { data: subjects = [] } = useSubjects();
  const [step, setStep] = useState<Step>(1);

  // Step 1 — goal
  const [goal, setGoal] = useState("");
  const [currentLevel, setCurrentLevel] = useState<string>("");

  // Step 2 — skill ratings, keyed by subject id (need the id for the pill
  // toggle to work per-subject) but sent to the AI keyed by subject NAME,
  // since that's what's actually meaningful outside this component.
  const [skillRatings, setSkillRatings] = useState<Record<string, SkillLevel>>({});

  // Step 3 — generation
  const [generationState, setGenerationState] = useState<GenerationState>("idle");
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  const isStep1Valid = goal.trim().length > 0 && currentLevel.length > 0;
  const isStep2Valid = subjects.length > 0 && subjects.every((s) => skillRatings[s.id]);

  const { studentProfile } = useCurrentUser();
  const createPlanrPath = useCreatePlanrPath();

  async function handleGenerate() {
    setGenerationState("generating");
    setGenerationError(null);

    const skillRatingsByName: Record<string, SkillLevel> = {};
    subjects.forEach((s) => {
      const rating = skillRatings[s.id];
      if (rating) skillRatingsByName[s.name] = rating;
    });

    try {
      const response = await axiosPost<
        { goal: string; currentLevel: string; skillRatings: Record<string, SkillLevel> },
        Roadmap
      >("ai/roadmap", { goal, currentLevel, skillRatings: skillRatingsByName });

      if (!response.data) throw new Error("The AI didn't return a roadmap.");
      setRoadmap(response.data);
      setGenerationState("ready");

      if (studentProfile) {
        createPlanrPath.mutate({
          studentId: studentProfile.id,
          goal,
          steps: response.data.courses,
        });
      }
    } catch (error) {
      setGenerationError(
        error instanceof ApiError
          ? error.message
          : "Couldn't generate your roadmap. Please try again.",
      );
      setGenerationState("error");
    }
  }

  const completedCount = roadmap?.courses.filter((c) => c.status === "completed").length ?? 0;
  const progressPercent = roadmap
    ? Math.round((completedCount / roadmap.courses.length) * 100)
    : 0;

  return (
    <>
      <PageHero eyebrow={`Planr · Step ${step} of 3`} title="Build your roadmap" />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {step > 1 && generationState === "idle" && (
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

        {step === 3 && generationState === "idle" && (
          <div className="rounded-xl border border-border bg-white p-8 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">03</p>
            <h2 className="mt-2 font-display text-2xl text-fg">Get your roadmap</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-body">
              We&apos;ll turn your goal and skill levels into an ordered set of courses to work
              through.
            </p>
            <p className="mx-auto mt-2 max-w-sm text-xs text-subtle">
              Runs on a local AI model — can take up to a minute.
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

        {step === 3 && generationState === "generating" && (
          <div className="rounded-xl border border-border bg-white p-8 text-center">
            <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-forest" />
            <p className="font-display text-xl text-fg">Building your roadmap…</p>
            <p className="mt-2 text-sm text-subtle">
              This runs on a local AI model and can take up to a minute.
            </p>
          </div>
        )}

        {step === 3 && generationState === "error" && (
          <div className="rounded-xl border border-border bg-white p-8 text-center">
            <p className="font-display text-xl text-fg">Something went wrong</p>
            <p className="mt-2 text-sm text-subtle">{generationError}</p>
            <button
              type="button"
              onClick={handleGenerate}
              className="mt-6 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-forest-dark"
            >
              Try again
            </button>
          </div>
        )}

        {step === 3 && generationState === "ready" && roadmap && (
          <div className="rounded-xl border border-border bg-white p-8">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber">
              AI-generated roadmap
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

            <h2 className="mt-4 font-display text-2xl text-fg">{roadmap.title}</h2>
            <p className="mt-1 text-sm text-subtle">
              {roadmap.courses.length} courses · Generated just now
            </p>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-forest"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            <ol className="mt-6 space-y-3">
              {roadmap.courses.map((course, index) => (
                <li key={`${course.title}-${index}`} className="flex items-center gap-3 text-sm">
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
                  <span className={course.status === "upcoming" ? "text-subtle" : "text-fg"}>
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
