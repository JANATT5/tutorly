// components/layout/PageHero.tsx
//
// Shared hero band for interior pages (Browse, Practice, Career Quiz,
// Planr, Become a Tutor) — the dark green header with a "Back to home"
// link, an amber eyebrow label, a serif title, and optional subtitle
// or extra content (e.g. Browse's search input).

import Link from "next/link";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <div className="bg-forest">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to home
        </Link>

        {eyebrow && <p className="label mb-2">{eyebrow}</p>}

        <h1 className="max-w-2xl font-display text-3xl text-white md:text-4xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/70">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}