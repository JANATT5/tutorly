// app/quiz/page.tsx  →  /quiz
//
// Mirrors the original Quiz.tsx contract: QuizIntro / QuizQuestions /
// QuizResults as one local step-state flow rather than separate routes
// (matches the "Nav Data Gotcha" doc — quiz-intro/questions/results
// share `current` + `answers` local state, not URL params).
//
// TODO(AI career recommendation): the question bank + tag-based
// path-matching below is the exact content lib/mock-data.ts used to hold,
// just relocated inline now that that file is gone — NOT yet the real
// OpenAI-powered recommendation. The real QuizQuestion model is just
// { prompt, options: string[] }, with no field for tags, so there's
// nowhere else for this to live until the AI version replaces it.
// What IS already real: once a logged-in student finishes, their result
// is saved via POST /api/quiz-results (see useCreateQuizResult).
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useCreateQuizResult } from "@/hooks/useQuizResults";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type Step = "intro" | "questions" | "results";

type QuizQuestion = {
  id: string;
  prompt: string;
  options: { text: string; tags: string[] }[];
};

const careerQuizQuestions: QuizQuestion[] = [
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

// Every tag that appears above must have an entry here — a missing key
// means careerPaths[tag] is undefined for anyone whose top answer lands
// on that tag, which crashes the results screen.
const careerPaths: Record<
  string,
  { title: string; description: string; subjectsToStrengthen: string[] }
> = {
  engineering: {
    title: "Mechanical / Civil Engineering",
    description:
      "You think in systems and like seeing ideas become physical things. Engineering programs will lean hard on physics and math.",
    subjectsToStrengthen: ["Physics", "Mathematics"],
  },
  cs: {
    title: "Computer Science",
    description:
      "You enjoy logic, structure, and building things that run. A CS degree rewards strong math fundamentals and early programming practice.",
    subjectsToStrengthen: ["Mathematics", "Computer Science"],
  },
  medicine: {
    title: "Medicine / Pre-Med",
    description:
      "You're drawn to directly helping people's health. Pre-med tracks are heavy on biology and chemistry from day one.",
    subjectsToStrengthen: ["Biology", "Chemistry"],
  },
  biology: {
    title: "Biology / Life Sciences",
    description:
      "You're pulled toward how living systems work, not just clinical practice. Research and lab-based biology programs build on strong biology and chemistry.",
    subjectsToStrengthen: ["Biology", "Chemistry"],
  },
  design: {
    title: "Design / Architecture",
    description:
      "You care about how things look, feel, and communicate. Strong portfolios matter more than any single subject, but math still shows up in architecture.",
    subjectsToStrengthen: ["Mathematics"],
  },
  humanities: {
    title: "Humanities / Social Sciences",
    description:
      "You think in ideas, arguments, and how people understand each other. These programs reward strong reading, writing, and critical thinking over any one STEM subject.",
    subjectsToStrengthen: ["Mathematics"],
  },
  management: {
    title: "Business / Management",
    description:
      "You like organizing people and keeping complex plans on track. Business programs lean on math for the analytical side and reward clear communication.",
    subjectsToStrengthen: ["Mathematics"],
  },
  math: {
    title: "Mathematics / Data Science",
    description:
      "You think best in numbers and patterns, and enjoy problems that reward patient, methodical practice. Math-heavy programs build directly on strong math fundamentals.",
    subjectsToStrengthen: ["Mathematics", "Computer Science"],
  },
};

export default function QuizPage() {
  const [step, setStep] = useState<Step>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]); // tags picked per question

  const totalQuestions = careerQuizQuestions.length;

  // Rank every tag the user's answers touched, then take the top 2–3 as
  // suggested paths (previously this took only the single top tag, and
  // any tag missing from careerPaths would crash the results screen —
  // see the comment above careerPaths in lib/mock-data.ts).
  const topPaths = useMemo(() => {
    const tally: Record<string, number> = {};
    answers.flat().forEach((tag) => {
      tally[tag] = (tally[tag] ?? 0) + 1;
    });
    const rankedTags = Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .filter((tag) => tag in careerPaths);

    return rankedTags.slice(0, 3).map((tag) => careerPaths[tag]);
  }, [answers]);

  const combinedSubjectsToStrengthen = useMemo(() => {
    const seen = new Set<string>();
    const combined: (typeof topPaths)[number]["subjectsToStrengthen"] = [];
    topPaths.forEach((path) => {
      path.subjectsToStrengthen.forEach((subject) => {
        if (!seen.has(subject)) {
          seen.add(subject);
          combined.push(subject);
        }
      });
    });
    return combined;
  }, [topPaths]);

  const { studentProfile } = useCurrentUser();
  const createQuizResult = useCreateQuizResult();
  // A ref, not state — flipping it doesn't need to trigger a re-render, it
  // just needs to survive across renders so this effect fires exactly once
  // per finished attempt instead of on every render where step === "results".
  const resultSavedRef = useRef(false);

  useEffect(() => {
    if (step !== "results" || resultSavedRef.current || !studentProfile) return;
    resultSavedRef.current = true;
    createQuizResult.mutate({
      studentId: studentProfile.id,
      resultLabel: topPaths[0]?.title ?? "Explorer",
      answers,
    });
  }, [step, studentProfile, topPaths, answers, createQuizResult]);

  function selectOption(tags: string[]) {
    const next = [...answers];
    next[current] = tags;
    setAnswers(next);

    if (current < totalQuestions - 1) {
      setCurrent(current + 1);
    } else {
      setStep("results");
    }
  }

  function restart() {
    setStep("intro");
    setCurrent(0);
    setAnswers([]);
    resultSavedRef.current = false;
  }

  // -------------------------------------------------------------
  // Intro screen — cream background, centered, matches screenshot
  // -------------------------------------------------------------
  if (step === "intro") {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center sm:px-6">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-1.5 self-start rounded-lg px-3 py-1.5 text-sm text-subtle transition-colors hover:bg-secondary hover:text-fg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to home
        </Link>

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber text-3xl">
          🎯
        </div>

        <p className="label mb-3">Grade 12 · Career guidance</p>

        <h1 className="mb-4 font-display text-3xl text-fg md:text-4xl">
          Not sure what to study after graduation?
        </h1>

        <p className="mb-2 max-w-md text-[15px] leading-relaxed text-body">
          Answer 8 quick questions about your interests, strengths, and goals
          — and we&apos;ll suggest personalised career paths plus the
          subjects to strengthen before university.
        </p>

        <p className="mb-8 font-mono text-xs text-subtle">
          Takes about 2 minutes · No personal data saved
        </p>

        <button
          onClick={() => setStep("questions")}
          className="rounded-lg bg-forest px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-forest-dark"
        >
          Start the quiz →
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Question screen
  // -------------------------------------------------------------
  if (step === "questions") {
    const question = careerQuizQuestions[current];
    const progressPercent = Math.round(((current + 1) / totalQuestions) * 100);

    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="mb-2 flex items-center justify-between text-xs font-mono text-subtle">
          <span>Question {current + 1} of {totalQuestions}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="mb-10 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-amber transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <h2 className="mb-8 font-display text-2xl text-fg md:text-3xl">
          {question.prompt}
        </h2>

        <div className="flex flex-col gap-3">
          {question.options.map((opt) => (
            <button
              key={opt.text}
              onClick={() => selectOption(opt.tags)}
              className="rounded-xl border border-border bg-white px-5 py-4 text-left text-[15px] text-fg transition-colors hover:border-amber hover:bg-secondary"
            >
              {opt.text}
            </button>
          ))}
        </div>

        {current > 0 && (
          <button
            onClick={() => setCurrent(current - 1)}
            className="mt-6 text-sm text-subtle hover:text-fg"
          >
            ← Back
          </button>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // Results screen
  // -------------------------------------------------------------
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <p className="label mb-3">Your recommended paths</p>

      <h1 className="mb-4 font-display text-3xl text-fg md:text-4xl">
        {topPaths.length > 1 ? "A few directions worth exploring" : topPaths[0]?.title}
      </h1>

      {studentProfile ? (
        <p className="mb-6 text-xs text-forest">
          {createQuizResult.isSuccess ? "Saved to your account." : ""}
        </p>
      ) : (
        <p className="mb-6 text-xs text-subtle">
          <Link href="/login" className="underline underline-offset-2">
            Log in
          </Link>{" "}
          to save this result to your account.
        </p>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
        {topPaths.map((path) => (
          <div key={path.title} className="rounded-2xl border border-border bg-white p-5">
            <p className="font-display text-lg text-fg">{path.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-body">{path.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-border bg-white p-6 text-left">
        <p className="label mb-3">Subjects to strengthen</p>
        <div className="flex flex-wrap gap-2">
          {combinedSubjectsToStrengthen.map((s) => (
            <span
              key={s}
              className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-forest"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/browse"
          className="rounded-lg bg-forest px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-forest-dark"
        >
          Find a matching tutor
        </Link>
        <button
          onClick={restart}
          className="rounded-lg border border-border bg-white px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-amber"
        >
          Retake the quiz
        </button>
      </div>
    </div>
  );
}