// app/quiz/page.tsx  →  /quiz
//
// Mirrors the original Quiz.tsx contract: QuizIntro / QuizQuestions /
// QuizResults as one local step-state flow rather than separate routes
// (matches the "Nav Data Gotcha" doc — quiz-intro/questions/results
// share `current` + `answers` local state, not URL params).
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  careerQuizQuestions,
  careerPaths,
} from "@/lib/mock-data";

type Step = "intro" | "questions" | "results";

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
              {s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
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