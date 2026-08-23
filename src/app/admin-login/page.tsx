// app/admin-login/page.tsx  →  /admin-login
//
// Passcode entry for the admin area. middleware.ts redirects any
// unauthenticated request to /admin-dashboard here, with the original
// path preserved as ?from= so we can send them back after a correct
// passcode.

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyAdminPasscode } from "./actions";

function AdminLoginForm() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(false);

    const success = await verifyAdminPasscode(passcode);

    if (success) {
      const from = searchParams.get("from") || "/admin-dashboard";
      router.push(from);
      router.refresh();
    } else {
      setError(true);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">Admin area</p>
      <h1 className="mt-2 font-display text-2xl text-fg">Enter passcode</h1>
      <p className="mt-2 text-sm text-subtle">
        This area is restricted to the Tutorly team.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          autoFocus
          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest"
        />

        {error && (
          <p className="mt-2 text-sm text-[#B3261E]">That passcode isn&apos;t correct.</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || passcode.length === 0}
          className="mt-4 w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}