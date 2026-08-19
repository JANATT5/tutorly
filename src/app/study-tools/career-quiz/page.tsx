"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SectionCard";

const options = [
  "Building websites and applications",
  "Analyzing data",
  "Protecting systems",
  "Designing AI solutions",
];

export default function CareerQuizPage() {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <AppShell
      title="Career Quiz"
      subtitle="Discover which CS paths may fit your interests."
    >
      <div className="mx-auto max-w-2xl">
        <SectionCard title="Question 1 of 6">
          <p className="text-lg font-semibold">
            Which activity sounds most interesting?
          </p>

          <div className="mt-5 grid gap-3">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`rounded-xl border p-4 text-left ${
                  selected === option
                    ? "border-indigo-500 bg-indigo-50"
                    : "hover:border-indigo-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSubmitted(true)}
            disabled={!selected}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white disabled:opacity-40"
          >
            Next Question
          </button>

          {submitted && (
            <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">
              Great choice! Your answer has been recorded.
            </div>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}