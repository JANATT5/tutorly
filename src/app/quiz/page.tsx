// app/quiz/page.tsx  →  /quiz
//
// Mirrors the original Quiz.tsx contract: QuizIntro / QuizQuestions /
// QuizResults as one local step-state flow rather than separate routes
// (matches the "Nav Data Gotcha" doc — quiz-intro/questions/results
// share `current` + `answers` local state, not URL params).
//
// The question bank stays local (8 fixed prompts — there's no reason to
// move these into the database; they're not user-generated content). What
// USED to be client-side tag-matching against a hardcoded careerPaths
// dictionary is now a real call to POST /api/ai/career-recommendation
// (src/lib/ai — local Ollama model, tool-grounded so subjectsToStrengthen
// can only ever be real subject names). Once a logged-in student finishes,
// the AI-generated result is saved via POST /api/quiz-results.

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCreateQuizResult } from "@/hooks/useQuizResults";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { axiosPost, ApiError } from "@/lib/axios";

type Step = "intro" | "questions" | "results";

type QuizQuestion = { id: string; prompt: string; options: string[] };

const careerQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which activity sounds most satisfying to spend a weekend on?",
    options: [
      "Building or fixing something with your hands",
      "Solving a tricky logic or math puzzle",
      "Reading about how the human body works",
      "Writing, designing, or telling a story",
    ],
  },
  {
    id: "q2",
    prompt: "In group projects, you're usually the one who...",
    options: [
      "Plans the structure and keeps things organized",
      "Digs into the technical details no one else wants to touch",
      "Cares about how it looks and feels to use",
      "Explains the idea clearly to everyone else",
    ],
  },
  {
    id: "q3",
    prompt: "Which school subject do you look forward to most?",
    options: ["Physics", "Biology", "Computer Science", "Art or Literature"],
  },
  {
    id: "q4",
    prompt: "What kind of impact matters most to you?",
    options: [
      "Building things that improve daily life",
      "Directly helping people's health",
      "Creating software people use every day",
      "Shaping how people see or understand something",
    ],
  },
  {
    id: "q5",
    prompt: "Pick a problem you'd enjoy working on:",
    options: [
      "Designing a bridge that can handle an earthquake",
      "Diagnosing what's wrong from a set of symptoms",
      "Optimizing an app so it loads faster",
      "Redesigning a brand's entire visual identity",
    ],
  },
  {
    id: "q6",
    prompt: "Which work environment appeals to you more?",
    options: ["A lab or hospital", "A studio or agency", "A tech company building products", "A construction or industrial site"],
  },
  {
    id: "q7",
    prompt: "How do you prefer to learn something new?",
    options: [
      "Take it apart and see how it works",
      "Read case studies and real examples",
      "Sketch or prototype it first",
      "Practice problems until it clicks",
    ],
  },
  {
    id: "q8",
    prompt: "Ten years from now, you'd be proudest to say you...",
    options: [
      "Built infrastructure people rely on",
      "Treated or saved patients",
      "Shipped a product millions of people use",
      "Created something people find beautiful or moving",
    ],
  },
];

type RecommendedPath = { title: string; description: string };

export default function QuizPage() {
  const [step, setStep] = useState<Step>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]); // the chosen option TEXT per question

  const totalQuestions = careerQuizQuestions.length;

  const [topPaths, setTopPaths] = useState<RecommendedPath[]>([]);
  // Subjects to strengthen apply to the whole result, not per-path — the AI
  // route returns it flattened already (also a reliability fix: see the
  // comment in api/ai/career-recommendation/route.ts).
  const [subjectsToStrengthen, setSubjectsToStrengthen] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const { studentProfile } = useCurrentUser();
  const createQuizResult = useCreateQuizResult();
  // A ref, not state — flipping it doesn't need a re-render, it just needs
  // to survive across renders so this effect runs exactly once per
  // finished attempt instead of every render where step === "results".
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    if (step !== "results" || hasGeneratedRef.current) return;
    hasGeneratedRef.current = true;

    async function generate() {
      setIsGenerating(true);
      setGenerationError(null);
      try {
        const response = await axiosPost<
          { answers: { prompt: string; answer: string }[] },
          { paths: RecommendedPath[]; subjectsToStrengthen: string[] }
        >("ai/career-recommendation", {
          answers: careerQuizQuestions.map((q, i) => ({ prompt: q.prompt, answer: answers[i] })),
        });
        const paths = response.data?.paths ?? [];
        setTopPaths(paths);
        setSubjectsToStrengthen(response.data?.subjectsToStrengthen ?? []);

        if (studentProfile && paths.length > 0) {
          createQuizResult.mutate({
            studentId: studentProfile.id,
            resultLabel: paths[0].title,
            answers,
          });
        }
      } catch (error) {
        setGenerationError(
          error instanceof ApiError
            ? error.message
            : "Couldn't generate your results. Please try again.",
        );
      } finally {
        setIsGenerating(false);
      }
    }

    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- answers/studentProfile/createQuizResult are all read once per finished attempt, guarded by hasGeneratedRef above, not meant to re-run if they change mid-flight.
  }, [step]);

  function selectOption(optionText: string) {
    const next = [...answers];
    next[current] = optionText;
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
    setTopPaths([]);
    setSubjectsToStrengthen([]);
    setGenerationError(null);
    hasGeneratedRef.current = false;
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
          Answer 8 quick questions about your interests, strengths, and goals — our AI will
          suggest personalised career paths plus the subjects to strengthen before university.
        </p>

        <p className="mb-8 font-mono text-xs text-subtle">
          Takes about 2 minutes to answer · results take up to a minute to generate
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
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => selectOption(option)}
              className="rounded-xl border border-border bg-white px-5 py-4 text-left text-[15px] text-fg transition-colors hover:border-amber hover:bg-secondary"
            >
              {option}
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
  if (isGenerating) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-forest" />
        <p className="font-display text-xl text-fg">Thinking about your answers…</p>
        <p className="mt-2 text-sm text-subtle">
          This runs on a local AI model and can take up to a minute.
        </p>
      </div>
    );
  }

  if (generationError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-xl text-fg">Something went wrong</p>
        <p className="mt-2 text-sm text-subtle">{generationError}</p>
        <button
          onClick={() => {
            hasGeneratedRef.current = false;
            setStep("results"); // re-trigger the effect
          }}
          className="mt-6 rounded-lg bg-forest px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-forest-dark"
        >
          Try again
        </button>
      </div>
    );
  }

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
          {subjectsToStrengthen.map((s) => (
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
