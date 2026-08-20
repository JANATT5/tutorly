// components/layout/AppShell.tsx
//
// The site-wide chrome. Mounted ONCE in app/layout.tsx, above {children}.
// It only knows about navigation — it has no idea what page it's on and
// doesn't wrap page content, so it stays out of PageContainer/PageHeader's
// way entirely. If you're looking for the "hero title on this page" logic,
// that lives in PageHeader instead.

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";

type NavItem = {
  label: string;
  href: string;
};

// Hardcoded here rather than passed as a prop — since AppShell now mounts
// once at the root layout (not per-page), there's no caller left to pass
// a custom nav array in. If a route group (e.g. tutor dashboard) needs a
// *different* set of links later, that's what RoleSideNav is for — it
// already handles per-role nav inside each dashboard layout.
const navLinks: NavItem[] = [
  { label: "Find a tutor", href: "/tutors" },
  { label: "Practice", href: "/practice" },
  { label: "Career quiz", href: "/quiz" },
];

export default function AppShell() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1B4D3E]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold text-white"
        >
          tutorly
          <span className="text-2xl leading-none text-[#D47A2A]">.</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                pathname === item.href
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/planr">
            <Button variant="outline" icon="+" active={pathname === "/planr"}>
              Planr
            </Button>
          </Link>
          <Link href="/become-tutor">
            <Button variant="primary">Become a tutor</Button>
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="p-2 text-white sm:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="flex flex-col gap-1 border-t border-white/10 bg-[#1B4D3E] px-4 pb-4 sm:hidden">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`py-2.5 text-sm font-medium ${
                pathname === item.href ? "text-white" : "text-white/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/planr" onClick={() => setMobileOpen(false)}>
            <Button variant="outline" icon="+" active={pathname === "/planr"}>
              Planr
            </Button>
          </Link>
          <Link href="/become-tutor" onClick={() => setMobileOpen(false)}>
            <Button variant="primary">Become a tutor</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
