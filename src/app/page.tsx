// app/page.tsx  →  /
//
// Server component — fetches through the same axiosGet + IResponse
// convention as the tutor detail page (see src/lib/axios.ts), not a
// react-query hook, since hooks only work in Client Components and this
// is the highest-traffic page in the app (worth keeping server-rendered).
// Wrapped in try/catch: a database hiccup shouldn't 500 the homepage —
// it just renders with fewer featured tutors/subjects that request.

import Link from "next/link";
import SubjectPill from "@/components/SubjectPill";
import FeaturedTutorCard from "@/components/tutors/FeaturedTutorCard";
import { axiosGet } from "@/lib/axios";
import type { Tutor } from "@/hooks/useTutors";
import type { Subject } from "@/hooks/useSubjects";

const steps = [
  {
    number: "01",
    title: "Browse & filter",
    description: "Search by subject, price, curriculum, or language. No account needed.",
  },
  {
    number: "02",
    title: "Request a session",
    description: "Pick a slot that works and send a short note. The tutor is notified by email.",
  },
  {
    number: "03",
    title: "Learn and grow",
    description: "Your tutor confirms and you meet. Simple as that.",
  },
];

async function getHomeData() {
  try {
    const [tutorsRes, subjectsRes] = await Promise.all([
      axiosGet<Tutor[]>("tutors"),
      axiosGet<Subject[]>("subjects"),
    ]);
    return { tutors: tutorsRes.data ?? [], subjects: subjectsRes.data ?? [] };
  } catch {
    return { tutors: [], subjects: [] };
  }
}

export default async function HomePage() {
  const { tutors, subjects } = await getHomeData();

  // Verified tutors first — "featured" means "we'd vouch for them," not a
  // join-date claim the schema can't back (TutorProfile has no createdAt).
  const featuredTutors = [...tutors]
    .sort((a, b) => Number(b.verified) - Number(a.verified))
    .slice(0, 3);

  return (
    <div className="bg-cream">
      {/* Hero + Planr card */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid items-center gap-12 py-10 md:grid-cols-2 md:py-16">
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
                  <Link key={subject.id} href="/browse">
                    <SubjectPill icon="📘" label={subject.name} />
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
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-6 border-t border-border py-8 sm:grid-cols-4">
          <div>
            <p className="font-display text-3xl text-forest">6+</p>
            <p className="text-sm text-subtle">Vetted tutors</p>
          </div>
          <div>
            <p className="font-display text-3xl text-forest">750+</p>
            <p className="text-sm text-subtle">Sessions completed</p>
          </div>
          <div>
            <p className="font-display text-3xl text-forest">3</p>
            <p className="text-sm text-subtle">Curricula covered</p>
          </div>
          <div>
            <p className="font-display text-3xl text-forest">Free</p>
            <p className="text-sm text-subtle">To browse</p>
          </div>
        </div>
      </section>

      {/* AI features promo bar — full-bleed dark band */}
      <section className="bg-forest">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-8">
          <p className="flex items-center gap-2 text-sm text-white">
            <span aria-hidden="true">✦</span>
            Two AI features: Smart tutor matching &amp; Practice question generator
          </p>
          <Link
            href="/practice"
            className="rounded-full border border-white/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
          >
            Try practice →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#7C9473]">
          How it works
        </p>
        <h2 className="mt-2 font-display text-3xl text-forest md:text-4xl">
          Three steps to your first session
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="border-l-2 border-[#7C9473] pl-5">
              <p className="font-mono text-sm text-[#7C9473]">{step.number}</p>
              <p className="mt-2 font-display text-lg font-semibold text-fg">{step.title}</p>
              <p className="mt-2 text-sm text-body">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured tutors */}
      {featuredTutors.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#7C9473]">
                Featured tutors
              </p>
              <h2 className="mt-2 font-display text-3xl text-forest md:text-4xl">
                Meet a few of our tutors
              </h2>
            </div>
            <Link
              href="/browse"
              className="text-sm font-medium text-body underline underline-offset-4 hover:text-forest"
            >
              See all →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featuredTutors.map((tutor) => (
              <FeaturedTutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </section>
      )}

      {/* Career quiz CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-forest px-8 py-14 sm:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5"
          />

          <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/80">
            Grade 12 · Career guidance
          </p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-white md:text-4xl">
            Not sure what to study after graduation?
          </h2>
          <p className="mt-4 max-w-lg text-white/70">
            Answer 8 quick questions and get 2–3 personalised career path suggestions —
            plus which subjects to strengthen before university.
          </p>

          <Link
            href="/quiz"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-fg transition-colors hover:bg-white/90"
          >
            Take the 2-minute quiz
          </Link>
        </div>
      </section>
    </div>
  );
}
