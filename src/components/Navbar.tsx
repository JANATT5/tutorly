"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";

const navLinks = [
  { label: "Find a tutor", href: "/browse" },
  { label: "Student", href: "/dashboard" },
  { label: "Career quiz", href: "/quiz" },
  { label: "Planr", href: "/planr" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#1B4D3E] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link
          href="/"
          className="font-display text-xl font-semibold text-white tracking-tight shrink-0"
        >
          tutorly
          <span className="text-[#D47A2A] text-2xl leading-none">.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-5 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                pathname === link.href
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link href="/become-tutor">
            <Button variant="primary">Become a tutor</Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-white p-2"
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
        <div className="sm:hidden flex flex-col gap-1 px-4 pb-4 bg-[#1B4D3E] border-t border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`py-2.5 text-sm font-medium ${
                pathname === link.href ? "text-white" : "text-white/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/become-tutor" onClick={() => setMobileOpen(false)}>
            <Button variant="primary">Become a tutor</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}