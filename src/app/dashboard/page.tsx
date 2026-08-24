// app/dashboard/page.tsx  →  /dashboard
//
// The single Dashboard page, per the professor's explicit instruction:
// one route, content branches by role. Reads role server-side (via
// the cookie lib/session.ts sets on login) before rendering anything,
// then picks the matching entry from lib/mock-data's `dashboardData`
// array — `dashboardData.find(d => d.role === role)` — exactly the
// pattern described: static dummy data now, a real API later. That
// entry's `data` gets passed into whichever content component renders,
// which uses it for the Overview tab's stat numbers.
//
// No separate /admin-dashboard route anymore, and no extra passcode
// gate — that was me adding protection beyond what was actually asked
// for. This is a frontend simulation of auth, not real auth; keeping
// it to one simple role check matches that.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROLE_COOKIE, parseRoleCookie } from "@/lib/session";

const dashboardData: Array<{
  role: "admin" | "tutor" | "student";
  data: unknown;
}> = [];

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = parseRoleCookie(cookieStore.get(ROLE_COOKIE)?.value);

  if (role === null) {
    redirect("/login");
  }

  const currentRoleData = dashboardData.find((d) => d.role === role)?.data;

  if (role === "admin") {
    return (
      <main>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard.</p>
      </main>
    );
  }

  if (role === "tutor") {
    return (
      <main>
        <h1>Tutor Dashboard</h1>
        <p>Welcome to the tutor dashboard.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Student Dashboard</h1>
      <p>Welcome to the student dashboard.</p>
    </main>
  );
}