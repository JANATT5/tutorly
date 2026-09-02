// app/practice/page.tsx  →  /practice
//
// Wired to the real /api/practice-questions endpoint. Two shape changes
// from the old mock-data version, both driven by the real PracticeQuestion
// model (prisma/schema.prisma):
//   - "level" (a grade, e.g. "Grade 12 (Lebanese Bac)") doesn't exist on
//     the real model — it has `difficulty` (free text, e.g. "Easy") instead.
//     The level picker became a difficulty picker.
//   - `correctAnswer` is stored as the answer TEXT, not an option index —
//     so answers are compared as strings here instead of by index.
// The question bank itself is small and real (seeded by
// prisma/seed-practice-questions.mjs) rather than the old mock's ~105
// illustrative ones — see that file's own comment for why.

"use client";

import { useMemo, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { useSubjects } from "@/hooks/useSubjects";
import { usePracticeQuestions } from "@/hooks/usePracticeQuestions";

const difficulties = ["Easy", "Medium", "Hard"] as const;
type Difficulty = (typeof difficulties)[number];
type Mode = "setup" | "test" | "results";

export default function PracticePage() {
  const { data: subjects = [] } = useSubjects();
  const [mode, setMode] = useState<Mode>("setup");
  const [subjectId, setSubjectId] = useState<string>("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");

  // Default to the first loaded subject once subjects arrive.
  const activeSubjectId = subjectId || subjects[0]?.id || "";
  const subject = subjects.find((s) => s.id === activeSubjectId);

  const { data: matchingQuestions = [], isLoading } = usePracticeQuestions(
    { subjectId: activeSubjectId, difficulty },
    { enabled: Boolean(activeSubjectId) },
  );

  // Test-taking state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [selectedThisQuestion, setSelectedThisQuestion] = useState<string | null>(null);

  const questionCount = matchingQuestions.length;
  const hasQuestions = questionCount > 0;

  function handleStartTest() {
    if (!hasQuestions) return;
    setCurrentIndex(0);
    setSelectedAnswers(new Array(matchingQuestions.length).fill(null));
    setSelectedThisQuestion(null);
    setMode("test");
  }

  function handleSelectOption(option: string) {
    setSelectedThisQuestion(option);
  }

  function handleNextQuestion() {
    const updated = [...selectedAnswers];
    updated[currentIndex] = selectedThisQuestion;
    setSelectedAnswers(updated);

    if (currentIndex + 1 < matchingQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedThisQuestion(updated[currentIndex + 1] ?? null);
    } else {
      setMode("results");
    }
  }

  function handleRetake() {
    setMode("setup");
  }

  const score = useMemo(() => {
    return selectedAnswers.reduce<number>((total, answer, index) => {
      return answer === matchingQuestions[index]?.correctAnswer ? total + 1 : total;
    }, 0);
  }, [selectedAnswers, matchingQuestions]);

  // -----------------------------------------------------------------
  // Test-taking screen
  // -----------------------------------------------------------------
  if (mode === "test") {
    const question = matchingQuestions[currentIndex];

    return (
      <>
        <PageHero
          eyebrow={`Practice · ${subject?.name ?? ""}`}
          title={`Question ${currentIndex + 1} of ${matchingQuestions.length}`}
        />

        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-forest transition-all"
              style={{
                width: `${((currentIndex + 1) / matchingQuestions.length) * 100}%`,
              }}
            />
          </div>

          <p className="mt-8 whitespace-pre-line font-display text-xl text-fg">
            {question.question}
          </p>

          <div className="mt-6 space-y-3">
            {question.options.map((option) => {
              const isSelected = selectedThisQuestion === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  aria-pressed={isSelected}
                  className={`block w-full rounded-xl border p-4 text-left text-sm transition-colors ${
                    isSelected
                      ? "border-forest bg-secondary text-fg"
                      : "border-border bg-white text-fg hover:border-forest"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNextQuestion}
            disabled={selectedThisQuestion === null}
            className="mt-8 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {currentIndex + 1 < matchingQuestions.length ? "Next question →" : "See results →"}
          </button>
        </div>
      </>
    );
  }

  // -----------------------------------------------------------------
  // Results screen
  // -----------------------------------------------------------------
  if (mode === "results") {
    return (
      <>
        <PageHero eyebrow="Practice results" title={`You scored ${score} / ${matchingQuestions.length}`} />

        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <div className="space-y-4">
            {matchingQuestions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              return (
                <div key={question.id} className="rounded-xl border border-border bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="whitespace-pre-line text-sm font-medium text-fg">
                      {question.question}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isCorrect ? "bg-forest/10 text-forest" : "bg-[#FBE9E7] text-[#B3261E]"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-subtle">
                    Correct answer: {question.correctAnswer}
                  </p>
                  {!isCorrect && userAnswer !== null && (
                    <p className="mt-1 text-sm text-[#B3261E]">Your answer: {userAnswer}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStartTest}
              className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
            >
              Retake this test
            </button>
            <button
              type="button"
              onClick={handleRetake}
              className="rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-forest"
            >
              Choose a different subject
            </button>
          </div>
        </div>
      </>
    );
  }

  // -----------------------------------------------------------------
  // Setup screen
  // -----------------------------------------------------------------
  return (
    <>
      <PageHero eyebrow="Practice" title="Sharpen your skills before the test" />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Subject cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {subjects.map((s) => {
            const isActive = s.id === activeSubjectId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSubjectId(s.id)}
                aria-pressed={isActive}
                className={`rounded-xl border bg-white p-6 text-left transition-colors ${
                  isActive ? "border-forest ring-1 ring-forest" : "border-border hover:border-forest"
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  📘
                </span>
                <p className="mt-3 font-display text-lg font-semibold text-fg">{s.name}</p>
              </button>
            );
          })}
        </div>

        {/* Difficulty selector */}
        <p className="mb-3 mt-10 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
          Difficulty
        </p>
        <div className="flex flex-wrap gap-3">
          {difficulties.map((d) => {
            const isActive = d === difficulty;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                aria-pressed={isActive}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-forest text-white"
                    : "border border-border bg-white text-fg hover:border-forest"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-10 grid grid-cols-2 gap-6 rounded-xl border border-border bg-white p-6 sm:grid-cols-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">Questions</p>
            <p className="mt-1 font-display text-lg font-semibold text-fg">
              {isLoading ? "…" : questionCount}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">Format</p>
            <p className="mt-1 font-display text-lg font-semibold text-fg">Multiple choice</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">Subject</p>
            <p className="mt-1 font-display text-lg font-semibold text-fg">{subject?.name ?? "—"}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">Difficulty</p>
            <p className="mt-1 font-display text-lg font-semibold text-fg">{difficulty}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl bg-forest p-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-2xl text-white">
              {hasQuestions ? "Ready to test yourself?" : "No questions yet for this combo"}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-white/70">
              <span aria-hidden="true">⚡</span>
              {hasQuestions
                ? `${questionCount} question${questionCount === 1 ? "" : "s"} · No time limit`
                : "Try a different subject or difficulty, or check back soon."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartTest}
            disabled={!hasQuestions}
            className="rounded-full bg-amber px-7 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-amber-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start test →
          </button>
        </div>
      </div>
    </>
  );
}
