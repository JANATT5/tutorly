// components/Footer.tsx
//
// Site-wide footer, mounted once in app/layout.tsx below {children} —
// same pattern as Navbar being mounted above it. Dark green background
// matching Navbar/the promo bar, forming a consistent bookend with the
// header rather than a light cream footer.

import Link from "next/link";

const footerLinks = [
  { label: "Browse tutors", href: "/browse" },
  { label: "Career quiz", href: "/quiz" },
  { label: "Become a tutor", href: "/become-tutor" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-forest">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-8">
        <Link href="/" className="font-display text-lg font-semibold text-white">
          tutorly
          <span className="text-amber">.</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-6 text-sm text-white/80">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-center text-xs text-white/60 sm:text-right">
          Built by Mohammad Moemen Ghazzawi, Shaima Kaddour &amp; Jana Tahish{" "}
          <Link href="/login" className="underline underline-offset-2 hover:text-white">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}