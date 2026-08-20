// app/browse/page.tsx  →  /browse
"use client";

import { useMemo, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import Button from "@/components/ui/Button";
import TutorCard from "@/components/tutors/TutorCard";
import { tutors, subjects, type SubjectKey } from "@/lib/mock-data";

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState<SubjectKey | "all">("all");

  const filtered = useMemo(() => {
    return tutors.filter((tutor) => {
      const matchesSubject =
        activeSubject === "all" || tutor.subjects.includes(activeSubject);

      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        tutor.name.toLowerCase().includes(q) ||
        tutor.subjects.some((s) => s.replace("-", " ").includes(q));

      return matchesSubject && matchesQuery;
    });
  }, [query, activeSubject]);

  return (
    <>
      <PageHero eyebrow="Browse tutors" title="Find the right match">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, subject, or topic…"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-amber"
        />
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Subject filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            active={activeSubject === "all"}
            onClick={() => setActiveSubject("all")}
          >
            All
          </Button>
          {subjects.map((s) => (
            <Button
              key={s.key}
              variant="outline"
              active={activeSubject === s.key}
              onClick={() => setActiveSubject(s.key)}
            >
              {s.label}
            </Button>
          ))}
        </div>

        {/* Secondary filters — static for now, wire up when the schema lands */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {["Curriculum", "Language", "Rating", "Price"].map((label) => (
              <button
                key={label}
                className="flex items-center gap-1 rounded-full border border-border bg-white px-3.5 py-1.5 text-sm text-body transition-colors hover:border-amber"
              >
                {label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1 text-sm text-subtle hover:text-fg">
            Sort: <span className="font-medium text-fg">Top rated</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <p className="mt-6 mb-4 text-sm text-subtle">
          {filtered.length} {filtered.length === 1 ? "tutor" : "tutors"} found
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white py-16 text-center text-sm text-subtle">
            No tutors match that search. Try a different subject or keyword.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}