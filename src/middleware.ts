// src/middleware.ts
//
// Gates /admin-dashboard behind the passcode set in
// app/admin-login/actions.ts. This runs server-side before any admin
// page renders, so it can't be bypassed by just knowing the URL the
// way a client-side-only check could be.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_AUTH_COOKIE = "tutorly_admin_auth";

export function middleware(request: NextRequest) {
  const isAuthed = request.cookies.get(ADMIN_AUTH_COOKIE)?.value === "1";

  if (!isAuthed) {
    const loginUrl = new URL("/admin-login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-dashboard/:path*"],
};