// app/admin-login/actions.ts
//
// The static admin passcode, per the project's own documented plan
// (see the "Open architectural decisions" note about an admin
// passcode gate as a middleware.ts candidate). This is a shared,
// non-cryptographic passcode by design — appropriate for gating the
// demo admin area, not a substitute for real per-user auth once
// Jana's LoginForm work is merged.

"use server";

import { cookies } from "next/headers";

const ADMIN_PASSCODE = "tutorly-admin";
const ADMIN_AUTH_COOKIE = "tutorly_admin_auth";

export async function verifyAdminPasscode(passcode: string): Promise<boolean> {
  if (passcode !== ADMIN_PASSCODE) return false;

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_AUTH_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return true;
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_AUTH_COOKIE);
}