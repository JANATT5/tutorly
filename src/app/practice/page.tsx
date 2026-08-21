// app/practice/page.tsx  →  /practice
//
// Banner pattern (matches Browse / Become-a-tutor). Subject + level
// selection are local state; the summary panel reads the real question
// count from lib/mock-data instead of hardcoding "10" the way the Figma
// copy does — when a subject/level combo has no seeded questions yet,
// "Start test" disables rather than promising a test that doesn't exist.
// Same philosophy as the note in app/browse/page.tsx: flag missing data
// clearly instead of faking interactivity.

"use client";

import { useMemo, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { subjects, levels, practiceQuestions, type SubjectKey } from "@/lib/mock-data";

type Level = (typeof levels)[number];

export default function PracticePage() {
  const [subjectKey, setSubjectKey] = useState<SubjectKey>("physics");
  const [level, setLevel] = useState<Level>("Grade 12 (Lebanese Bac)");

  const subject = subjects.find((s) => s.key === subjectKey)!;

  const matchingQuestions = useMemo(
    () =>
      practiceQuestions.filter((q) => q.subject === subjectKey && q.level === level),
    [subjectKey, level]
  );

  const questionCount = matchingQuestions.length;
  const hasQuestions = questionCount > 0;

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
