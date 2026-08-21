// app/planr/page.tsx  →  /planr
//
// "Full immersive" pattern per the project's own component comments
// (see components/layout/PageHero.tsx) — this does NOT reuse PageHero;
// it's a full-bleed dark section of its own, matching the Figma empty
// state exactly. lib/mock-data's `planrProjects` already has a seeded
// project (used for the illustrative "EXAMPLE ROADMAP" preview on the
// home page), but the Figma reference for THIS route is specifically
// the first-time/empty state, so it isn't branched on here.

import Link from "next/link";

const steps = [
  { number: "01", title: "Set your goal" },
  { number: "02", title: "Rate your skills" },
  { number: "03", title: "Get your roadmap" },
];

const features = [
  {
    icon: "🎯",
    title: "Goal-first thinking",
    description:
      "Start with where you want to end up, not a course catalog. Planr works backwards from your goal.",
  },
  {
    icon: "⚡",
    title: "Personalised to you",
    description:
      "Your current skill level shapes the roadmap. No wasted time on things you already know.",
  },
  {
    icon: "🗺️",
    title: "Ordered, not overwhelming",
    description:
      "Prerequisites are handled automatically. The path is clear, step by step, from day one.",
  },
];

export default function PlanrPage() {
  return (
    <>
      <section className="bg-forest px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/planr/new"
            className="inline-block rounded-full bg-amber px-7 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-amber-hover"
          >
            Create a new project
          </Link>

          <div className="mt-16 border-t border-white/10 pt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number}>
                  <p className="font-mono text-sm text-amber">{step.number}</p>
                  <p className="mt-2 font-display text-xl text-white">{step.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center font-mono text-xs uppercase tracking-[0.14em] text-subtle">
            Why Planr
          </p>

          <div className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title}>
                <span className="text-3xl" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3 className="mt-4 font-display text-xl text-forest">{feature.title}</h3>
                <p className="mt-3 text-body">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
