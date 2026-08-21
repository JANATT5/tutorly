// app/page.tsx  →  /

import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";
import SubjectPill from "@/components/SubjectPill";
import { subjects } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <PageContainer width="wide">
      {/* Hero + Planr card */}
      <section className="grid items-center gap-12 py-10 md:grid-cols-2 md:py-16">
        {/* Left: hero */}
        <div className="flex flex-col items-start gap-6">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#7C9473]">
            Academic tutoring for Grade 12 &amp; university · Lebanon
          </p>

          <h1 className="font-display text-5xl leading-[1.05] text-forest md:text-6xl">
            Learn
            <br />
            <span className="italic">smarter,</span>
            <br />
            match faster.
          </h1>

          <p className="text-base text-body">Pick a subject and meet your tutor today.</p>

          <div className="mt-2 flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#7C9473]">
              Pick a subject to start
            </p>
            <div className="flex flex-wrap gap-3">
              {subjects.map((subject) => (
                <Link key={subject.key} href={`/browse?subject=${subject.key}`}>
                  <SubjectPill icon={subject.icon} label={subject.label} />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-5">
            <Link
              href="/browse"
              className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
            >
              Browse all tutors
            </Link>
            <Link
              href="/quiz"
              className="text-sm font-medium text-body underline underline-offset-4 hover:text-forest"
            >
              Not sure what to study? Take the quiz →
            </Link>
          </div>
        </div>

        {/* Right: Planr card */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-[#7C9473]">
            AI course advisor · Planr
          </p>
          <h2 className="mb-6 text-xl font-bold text-fg">
            Always know how close you are to your goal
          </h2>

          <div className="rounded-xl bg-secondary p-5">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
              Example roadmap
            </p>
            <div className="mb-4 flex items-start gap-3">
              <span className="text-lg" aria-hidden="true">
                💻
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">
                  Path to Computer Engineering
                </p>
                <p className="text-xs text-subtle">5 courses · Updated recently</p>
              </div>
            </div>
            <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full w-[30%] rounded-full bg-forest"
                role="progressbar"
                aria-valuenow={30}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-sm font-medium text-fg">
              30% complete — on your way to your goal 🎯
            </p>
          </div>

          <Link
            href="/planr"
            className="mt-6 block rounded-full bg-forest px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            Build your roadmap →
          </Link>
        </div>
      </section>

      {/* Real component later: featured/top-matched tutors carousel */}
      <section className="py-8">
        <h2 className="mb-4 font-display text-xl text-fg">Featured tutors</h2>
        <PlaceholderBlock label="TutorCard grid (3–4 featured tutors)" height="h-48" />
      </section>

      {/* Real component later: the 3 study tools as cards linking into
          /practice, /quiz, /planr */}
      <section className="py-8">
        <h2 className="mb-4 font-display text-xl text-fg">Study tools</h2>
        <PlaceholderBlock label="Career Quiz · Practice Questions · Planr — 3-up card row" height="h-40" />
      </section>
    </PageContainer>
  );
}
