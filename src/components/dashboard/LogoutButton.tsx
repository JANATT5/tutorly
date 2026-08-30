// components/dashboards/LogoutButton.tsx
//
// Shared between Tutor, Student, and Admin dashboard content — clears
// the role cookie and sends the user back to /login.

"use client";

import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/session";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-border bg-white px-4 py-2 text-sm text-body transition-colors hover:border-forest hover:text-forest"
    >
      Log out
    </button>
  );
}