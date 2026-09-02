// app/dashboard/page.tsx  →  /dashboard
//
// Reads the role cookie client-side and redirects to /login if missing,
// then renders the one dashboard component for that role. All the actual
// tab content now lives in src/components/dashboard/*DashboardContent.tsx
// — this file used to inline all three (Admin/Tutor/Student) directly,
// duplicating what those (previously unused) components already had. That
// duplication is gone now that the components are wired to real data.

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_COOKIE, parseRoleCookie, type UserRole } from "@/lib/session";
import AdminDashboardContent from "@/components/dashboard/AdminDashboardContent";
import TutorDashboardContent from "@/components/dashboard/TutorDashboardContent";
import StudentDashboardContent from "@/components/dashboard/StudentDashboardContent";

function readRoleCookieClient(): UserRole | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${ROLE_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : undefined;
  return parseRoleCookie(value);
}

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null | "loading">("loading");

  useEffect(() => {
    const currentRole = readRoleCookieClient();
    if (currentRole === null) {
      router.push("/login");
    } else {
      setRole(currentRole);
    }
  }, [router]);

  if (role === "loading" || role === null) {
    return null;
  }

  if (role === "admin") return <AdminDashboardContent />;
  if (role === "tutor") return <TutorDashboardContent />;
  return <StudentDashboardContent />;
}
