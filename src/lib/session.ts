// lib/session.ts
//
// Per the professor's guidance (see components/LoginForm.tsx for the
// full context): this is a frontend SIMULATION of authentication, not
// real auth. No NextAuth, no backend API, no database, no OAuth, no
// refresh tokens — explicitly told not to build any of that right
// now. Just: static username/password credentials, mapped to a role,
// stored in a cookie so /dashboard can read it and show the right
// content. Real backend auth is next sprint's work, and when it
// lands, this file is what gets replaced — nothing else should need
// to change.

export type UserRole = "student" | "tutor" | "admin";

export const ROLE_COOKIE = "tutorly_role";
export const USERNAME_COOKIE = "tutorly_username";

// Static credentials, exactly as the professor's example showed:
// admin/1234 → role admin, tutor/1234 → role tutor, student/1234 →
// role student. Real credential checking is backend work for later.
export const STATIC_CREDENTIALS: { username: string; password: string; role: UserRole }[] = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "tutor", password: "1234", role: "tutor" },
  { username: "student", password: "1234", role: "student" },
];

export function checkCredentials(username: string, password: string): UserRole | null {
  const match = STATIC_CREDENTIALS.find(
    (c) => c.username === username.trim().toLowerCase() && c.password === password
  );
  return match ? match.role : null;
}

const isValidRole = (value: string | undefined): value is UserRole =>
  value === "student" || value === "tutor" || value === "admin";

// ---- Client-side (components, "use client") ----

export function getUserRole(): UserRole | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${ROLE_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : undefined;
  return isValidRole(value) ? value : null;
}

export function getUsername(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${USERNAME_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function saveSession(username: string, role: UserRole) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 8; // 8 hours
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${maxAge}; samesite=lax`;
  document.cookie = `${USERNAME_COOKIE}=${encodeURIComponent(username)}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function clearSession() {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${USERNAME_COOKIE}=; path=/; max-age=0`;
}

// ---- Server-side (middleware, server components) ----
// Takes a plain cookie string value rather than importing next/headers
// directly, so this file has no framework dependency and stays testable.

export function parseRoleCookie(cookieValue: string | undefined): UserRole | null {
  return isValidRole(cookieValue) ? cookieValue : null;
}