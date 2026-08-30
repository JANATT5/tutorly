// app/practice/page.tsx  →  /practice
//
// Banner pattern (matches Browse / Become-a-tutor). Previously "Start
// test" had no onClick handler at all — it rendered as a button but
// did nothing, because only the setup screen (subject/level pickers +
// summary) was ever built. This adds the actual test-taking flow:
// setup → test (one question at a time) → results (score + review).
// Same local step-state pattern as the Career Quiz, since nothing here
// needs its own URL.

"use client";

import { useMemo, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { subjects, levels, practiceQuestions, type SubjectKey } from "@/lib/mock-data";

type Level = (typeof levels)[number];
type Mode = "setup" | "test" | "results";

export default function PracticePage() {
  const [mode, setMode] = useState<Mode>("setup");
  const [subjectKey, setSubjectKey] = useState<SubjectKey>("physics");
  const [level, setLevel] = useState<Level>("Grade 12 (Lebanese Bac)");

  // Test-taking state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [selectedThisQuestion, setSelectedThisQuestion] = useState<number | null>(null);

  const subject = subjects.find((s) => s.key === subjectKey)!;

  const matchingQuestions = useMemo(
    () => practiceQuestions.filter((q) => q.subject === subjectKey && q.level === level),
    [subjectKey, level]
  );

  const questionCount = matchingQuestions.length;
  const hasQuestions = questionCount > 0;

  function handleStartTest() {
    if (!hasQuestions) return;
    setCurrentIndex(0);
    setSelectedAnswers(new Array(matchingQuestions.length).fill(null));
    setSelectedThisQuestion(null);
    setMode("test");
  }

  function handleSelectOption(optionIndex: number) {
    setSelectedThisQuestion(optionIndex);
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
      return answer === matchingQuestions[index]?.correctIndex ? total + 1 : total;
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
          eyebrow={`Practice · ${subject.label}`}
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
            {question.prompt}
          </p>

          <div className="mt-6 space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedThisQuestion === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectOption(index)}
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
              const isCorrect = userAnswer === question.correctIndex;
              return (
                <div key={question.id} className="rounded-xl border border-border bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="whitespace-pre-line text-sm font-medium text-fg">
                      {question.prompt}
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
                    Correct answer: {question.options[question.correctIndex]}
                  </p>
                  {!isCorrect && userAnswer !== null && (
                    <p className="mt-1 text-sm text-[#B3261E]">
                      Your answer: {question.options[userAnswer]}
                    </p>
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
            const isActive = s.key === subjectKey;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSubjectKey(s.key)}
                aria-pressed={isActive}
                className={`rounded-xl border bg-white p-6 text-left transition-colors ${
                  isActive ? "border-forest ring-1 ring-forest" : "border-border hover:border-forest"
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {s.icon}
                </span>
                <p className="mt-3 font-display text-lg font-semibold text-fg">{s.label}</p>
              </button>
            );
          })}
        </div>

        {/* Level selector */}
        <p className="mb-3 mt-10 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
          Your level
        </p>
        <div className="flex flex-wrap gap-3">
          {levels.map((l) => {
            const isActive = l === level;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                aria-pressed={isActive}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-forest text-white"
                    : "border border-border bg-white text-fg hover:border-forest"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-10 grid grid-cols-2 gap-6 rounded-xl border border-border bg-white p-6 sm:grid-cols-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">Questions</p>
            <p className="mt-1 font-display text-lg font-semibold text-fg">{questionCount}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">Format</p>
            <p className="mt-1 font-display text-lg font-semibold text-fg">Multiple choice</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">Subject</p>
            <p className="mt-1 font-display text-lg font-semibold text-fg">{subject.label}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">Report</p>
            <p className="mt-1 font-display text-lg font-semibold text-fg">Personalised</p>
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
                ? `${questionCount} ${subject.label} question${questionCount === 1 ? "" : "s"} · No time limit`
                : "Try a different subject or level, or check back soon."}
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