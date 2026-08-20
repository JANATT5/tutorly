// app/page.tsx  →  /

import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";
import SubjectPill from "@/components/SubjectPill";

const subjects = [
  { icon: "Σ", label: "Mathematics", href: "/tutors?subject=mathematics" },
  { icon: "⚡", label: "Physics", href: "/tutors?subject=physics" },
  { icon: "⚗️", label: "Chemistry", href: "/tutors?subject=chemistry" },
  { icon: "🧬", label: "Biology", href: "/tutors?subject=biology" },
  { icon: "</>", label: "Computer Science", href: "/tutors?subject=computer-science" },
];

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

          <h1 className="font-serif text-5xl leading-[1.05] text-[#1B4D3E] md:text-6xl">
            Learn
            <br />
            <span className="italic">smarter,</span>
            <br />
            match faster.
          </h1>

          <p className="text-base text-[#3D3A37]">
            Pick a subject and meet your tutor today.
          </p>

          <div className="mt-2 flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#7C9473]">
              Pick a subject to start
            </p>
            <div className="flex flex-wrap gap-3">
              {subjects.map((subject) => (
                <Link key={subject.href} href={subject.href}>
                  <SubjectPill icon={subject.icon} label={subject.label} />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-5">
            <Link
              href="/tutors"
              className="rounded-full bg-[#1B4D3E] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#245C4B]"
            >
              Browse all tutors
            </Link>
            <Link
              href="/quiz"
              className="text-sm font-medium text-[#3D3A37] underline underline-offset-4 hover:text-[#1B4D3E]"
            >
              Not sure what to study? Take the quiz →
            </Link>
          </div>

          <div className="mt-2 grid w-full grid-cols-2 gap-6 border-t border-[#DDD8CF] pt-8 sm:grid-cols-4">
            <div>
              <p className="font-serif text-3xl text-[#1B4D3E]">6+</p>
              <p className="text-sm text-[#6B6560]">Vetted tutors</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-[#1B4D3E]">750+</p>
              <p className="text-sm text-[#6B6560]">Sessions completed</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-[#1B4D3E]">3</p>
              <p className="text-sm text-[#6B6560]">Curricula covered</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-[#1B4D3E]">Free</p>
              <p className="text-sm text-[#6B6560]">To browse</p>
            </div>
          </div>
        </div>

        {/* Right: Planr card */}
        <div className="rounded-2xl border border-[#DDD8CF] bg-white p-6 shadow-sm md:p-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-[#7C9473]">
            AI course advisor · Planr
          </p>
          <h2 className="mb-6 text-xl font-bold text-[#1A1714]">
            Always know how close you are to your goal
          </h2>

          <div className="rounded-xl bg-[#F0EBE3] p-5">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-[#6B6560]">
              Example roadmap
            </p>
            <div className="mb-4 flex items-start gap-3">
              <span className="text-lg">💻</span>
              <div>
                <p className="text-sm font-semibold text-[#1A1714]">
                  Path to Computer Engineering
                </p>
                <p className="text-xs text-[#6B6560]">5 courses · Updated recently</p>
              </div>
            </div>
            <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-[#DDD8CF]">
              <div className="h-full w-[30%] rounded-full bg-[#1B4D3E]" />
            </div>
            <p className="text-sm font-medium text-[#1A1714]">
              30% complete — on your way to your goal 🎯
            </p>
          </div>

          <Link
            href="/planr"
            className="mt-6 block rounded-full bg-[#1B4D3E] px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#245C4B]"
          >
            Build your roadmap →
          </Link>
        </div>
      </section>

      {/* Real component later: featured/top-matched tutors carousel */}
      <section className="py-8">
        <h2 className="mb-4 font-serif text-xl text-[#1A1714]">Featured tutors</h2>
        <PlaceholderBlock label="TutorCard grid (3–4 featured tutors)" height="h-48" />
      </section>

      {/* Real component later: the 3 study tools as cards linking into /study-tools/* */}
      <section className="py-8">
        <h2 className="mb-4 font-serif text-xl text-[#1A1714]">Study tools</h2>
        <PlaceholderBlock label="Career Quiz · Practice Questions · Planr — 3-up card row" height="h-40" />
      </section>
    </PageContainer>
  );
}