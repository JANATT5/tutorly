// src/middleware.ts
//
// Gates /dashboard behind having ANY valid role cookie (set by
// LoginForm on successful login — see lib/session.ts). This is a
// frontend simulation of authentication, per the professor's explicit
// instruction — not real auth, and deliberately no separate/stronger
// gate for the admin role specifically (that would be building more
// than what was asked for). Runs server-side before the page renders,
// so it can't be bypassed by just knowing the URL.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_COOKIE, parseRoleCookie } from "@/lib/session";

export function middleware(request: NextRequest) {
  const role = parseRoleCookie(request.cookies.get(ROLE_COOKIE)?.value);

  if (role === null) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};