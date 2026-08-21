// components/Navbar.tsx
//
// The single site-wide nav, mounted once in app/layout.tsx above
// {children}. This replaces the old AppShell.tsx (now deleted) — the
// two had drifted into different link sets, so this is the merged,
// canonical version matching the Figma nav exactly: Find a tutor,
// Practice, Career quiz, a Planr pill (outline button, filled when
// active), and a solid Become a tutor CTA.

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";

type NavItem = {
  label: string;
  href: string;
};

const navLinks: NavItem[] = [
  { label: "Find a tutor", href: "/browse" },
  { label: "Practice", href: "/practice" },
  { label: "Career quiz", href: "/quiz" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-forest">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="shrink-0 font-display text-xl font-semibold text-white">
          tutorly
          <span className="text-2xl leading-none text-amber">.</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                pathname === item.href ? "text-white" : "text-white/70 hover:text-white"
              }`}
              aria-current={pathname === item.href ? "page" : undefined}
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
          aria-expanded={mobileOpen}
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
        <div className="flex flex-col gap-1 border-t border-white/10 bg-forest px-4 pb-4 sm:hidden">
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
          <Link href="/planr" onClick={() => setMobileOpen(false)} className="py-2">
            <Button variant="outline" icon="+" active={pathname === "/planr"}>
              Planr
            </Button>
          </Link>
          <Link href="/become-tutor" onClick={() => setMobileOpen(false)} className="py-2">
            <Button variant="primary">Become a tutor</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
