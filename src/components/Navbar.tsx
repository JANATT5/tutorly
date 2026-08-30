// components/Navbar.tsx
//
// The single site-wide nav, mounted once in app/layout.tsx above
// {children}. Matches the Figma nav: Find a tutor, Practice, Career
// quiz, a Planr pill, and a solid Become a tutor CTA — plus a
// Log in / Dashboard+Log out link that reflects actual session state
// (via lib/session.ts), previously missing entirely.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import { getUserRole, clearSession, type UserRole } from "@/lib/session";

type NavItem = {
  label: string;
  href: string;
};

const navLinks: NavItem[] = [
  { label: "Find a tutor", href: "/browse" },
  { label: "Practice", href: "/practice" },
  { label: "Career quiz", href: "/quiz" },
];

type NavbarProps = {
  // Read server-side (see app/layout.tsx) so the very first HTML
  // already reflects real auth state — a client-only document.cookie
  // read would always render logged-out on the server, since
  // `document` doesn't exist there, causing a hydration mismatch.
  initialRole: UserRole | null;
};

export default function Navbar({ initialRole }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<UserRole | null>(initialRole);

  // Re-sync from the cookie on every client-side navigation, so
  // logging in/out (which both navigate afterward) is reflected
  // without needing a full page reload.
  useEffect(() => {
    setRole(getUserRole());
  }, [pathname]);

  function handleLogout() {
    clearSession();
    setRole(null);
    router.push("/login");
    router.refresh();
  }

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
            <Button variant="outline" icon="+" active={pathname === "/planr"} onDark>
              Planr
            </Button>
          </Link>

          <Link href="/become-tutor">
            <Button variant="primary">Become a tutor</Button>
          </Link>

          {role ? (
            <div className="flex items-center gap-4 border-l border-white/20 pl-6">
              <Link
                href="/dashboard"
                className={`transition-colors ${
                  pathname === "/dashboard" ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-white/70 transition-colors hover:text-white"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="border-l border-white/20 pl-6 text-white/70 transition-colors hover:text-white"
            >
              Log in
            </Link>
          )}
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
            <Button variant="outline" icon="+" active={pathname === "/planr"} onDark>
              Planr
            </Button>
          </Link>
          <Link href="/become-tutor" onClick={() => setMobileOpen(false)} className="py-2">
            <Button variant="primary">Become a tutor</Button>
          </Link>

          {role ? (
            <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm font-medium text-white/70"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="py-2.5 text-left text-sm font-medium text-white/70"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 border-t border-white/10 py-2.5 pt-4 text-sm font-medium text-white/70"
            >
              Log in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}