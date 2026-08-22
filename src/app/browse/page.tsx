// app/browse/page.tsx  →  /browse

"use client";

import { useMemo, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import Button from "@/components/Button";
import TutorCard from "@/components/tutors/TutorCard";
import Dropdown from "@/components/Dropdown";
import { tutors, subjects, curricula, languages, type SubjectKey } from "@/lib/mock-data";

type RatingFilter = "any" | "4.5" | "4.0" | "3.5";
type PriceFilter = "any" | "under20" | "20to30" | "over30";
type SortOption = "rating" | "sessions" | "price-asc" | "price-desc";

const ratingOptions: { value: RatingFilter; label: string }[] = [
  { value: "any", label: "Any rating" },
  { value: "4.5", label: "4.5 and up" },
  { value: "4.0", label: "4.0 and up" },
  { value: "3.5", label: "3.5 and up" },
];

const priceOptions: { value: PriceFilter; label: string }[] = [
  { value: "any", label: "Any price" },
  { value: "under20", label: "Under $20/hr" },
  { value: "20to30", label: "$20–$30/hr" },
  { value: "over30", label: "$30+/hr" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "rating", label: "Top rated" },
  { value: "sessions", label: "Most sessions" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState<SubjectKey | "all">("all");
  const [curriculumFilter, setCurriculumFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("any");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("any");
  const [sortBy, setSortBy] = useState<SortOption>("rating");

  const filtered = useMemo(() => {
    const results = tutors.filter((tutor) => {
      const matchesSubject =
        activeSubject === "all" || tutor.subjects.includes(activeSubject);

      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        tutor.name.toLowerCase().includes(q) ||
        tutor.subjects.some((s) => s.replace("-", " ").includes(q));

      const matchesCurriculum =
        curriculumFilter === "all" || tutor.curriculum === curriculumFilter;

      const matchesLanguage =
        languageFilter === "all" || tutor.languages.includes(languageFilter);

      const matchesRating =
        ratingFilter === "any" || tutor.rating >= parseFloat(ratingFilter);

      const matchesPrice =
        priceFilter === "any" ||
        (priceFilter === "under20" && tutor.pricePerHour < 20) ||
        (priceFilter === "20to30" && tutor.pricePerHour >= 20 && tutor.pricePerHour <= 30) ||
        (priceFilter === "over30" && tutor.pricePerHour > 30);

      return (
        matchesSubject &&
        matchesQuery &&
        matchesCurriculum &&
        matchesLanguage &&
        matchesRating &&
        matchesPrice
      );
    });

    const sorted = [...results];
    switch (sortBy) {
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "sessions":
        sorted.sort((a, b) => b.sessions - a.sessions);
        break;
      case "price-asc":
        sorted.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
    }
    return sorted;
  }, [query, activeSubject, curriculumFilter, languageFilter, ratingFilter, priceFilter, sortBy]);

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

        {/* Secondary filters + sort — fully wired now */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Dropdown
              label="Curriculum"
              showSelectedInline
              selected={curriculumFilter}
              onSelect={setCurriculumFilter}
              options={[
                { value: "all", label: "All curricula" },
                ...curricula.map((c) => ({ value: c, label: c })),
              ]}
            />
            <Dropdown
              label="Language"
              showSelectedInline
              selected={languageFilter}
              onSelect={setLanguageFilter}
              options={[
                { value: "all", label: "All languages" },
                ...languages.map((l) => ({ value: l, label: l })),
              ]}
            />
            <Dropdown
              label="Rating"
              showSelectedInline
              selected={ratingFilter}
              onSelect={setRatingFilter}
              options={ratingOptions}
            />
            <Dropdown
              label="Price"
              showSelectedInline
              selected={priceFilter}
              onSelect={setPriceFilter}
              options={priceOptions}
            />
          </div>

          <Dropdown
            label="Sort"
            showSelectedInline
            selected={sortBy}
            onSelect={setSortBy}
            options={sortOptions}
          />
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
