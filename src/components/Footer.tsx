// components/Footer.tsx
//
// Site-wide footer, mounted once in app/layout.tsx below {children} —
// same pattern as Navbar being mounted above it. Per the Figma bottom
// section: logo, a short nav, and credits with an Admin link into the
// (admin) route group's real entry point.

import Link from "next/link";

const footerLinks = [
  { label: "Browse tutors", href: "/browse" },
  { label: "Career quiz", href: "/quiz" },
  { label: "Become a tutor", href: "/become-tutor" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-8">
        <Link href="/" className="font-display text-lg font-semibold text-forest">
          tutorly
          <span className="text-amber">.</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-6 text-sm text-body">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-forest">
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-center text-xs text-subtle sm:text-right">
          Built by Mohammad Moemen Ghazzawi, Nafez &amp; Jana Tahish{" "}
          <Link href="/admin-dashboard" className="underline underline-offset-2 hover:text-forest">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}