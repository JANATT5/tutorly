// components/layout/PageBanner.tsx
//
// The dark-green header band used by "Banner pattern" secondary pages
// (Browse/Tutors, Practice, Become-a-tutor per Figma). NOT the same thing
// as PageHeader — PageHeader sits on the cream body background with dark
// text; this sits on its own full-width dark green strip with white text,
// and always includes a "Back to home" link. Don't reuse this for pages
// that follow the "plain centered" (Career quiz) or "full immersive"
// (Planr) patterns — those need their own treatment.

import { ReactNode } from "react";
import Link from "next/link";

type PageBannerProps = {
  eyebrow: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  /** Optional extra content inside the banner, below the title/description — e.g. Browse's search input. Omit for pages that don't need it. */
  children?: ReactNode;
};

export default function PageBanner({
  eyebrow,
  title,
  description,
  backHref = "/",
  backLabel = "Back to home",
  children,
}: PageBannerProps) {
  return (
    <div className="bg-[#1B4D3E]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 md:py-14">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {backLabel}
        </Link>

        <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-[#D47A2A]">
          {eyebrow}
        </p>
        <h1 className="font-serif text-3xl text-white md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/70">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}