// components/LoginForm.tsx
//
// Restructured to follow Type → Initial State → Validation → Handling,
// instead of scattered per-field useState calls with no real
// validation step. Per the professor's guidance this is still a
// FRONTEND SIMULATION of authentication — static credentials, no
// NextAuth, no real backend — see lib/session.ts.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkCredentials, saveSession } from "@/lib/session";

// ---- Type ----
type LoginFormData = {
  username: string;
  password: string;
};

type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

// ---- Initialization ----
const initialLoginFormData: LoginFormData = {
  username: "",
  password: "",
};

// ---- Validation ----
function validateLoginForm(data: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {};
  if (!data.username.trim()) errors.username = "Username is required.";
  if (!data.password) errors.password = "Password is required.";
  return errors;
}

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>(initialLoginFormData);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [authError, setAuthError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange<K extends keyof LoginFormData>(field: K, value: LoginFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear that field's error as soon as the person starts fixing it,
    // rather than leaving a stale error message on screen.
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  // ---- Handling ----
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setAuthError(false);

    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    const role = checkCredentials(formData.username, formData.password);

    if (role === null) {
      setAuthError(true);
      setIsSubmitting(false);
      return;
    }

    saveSession(formData.username.trim().toLowerCase(), role);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-sm" noValidate>
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">Log in</p>
      <h1 className="mt-2 font-display text-2xl text-fg">Welcome back</h1>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
            Username
          </span>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="e.g. student"
            autoComplete="username"
            aria-invalid={Boolean(errors.username)}
            className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-3 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-[#B3261E]">{errors.username}</p>
          )}
        </label>

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
            Password
          </span>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="••••"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-3 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-[#B3261E]">{errors.password}</p>
          )}
        </label>

        {authError && (
          <p className="text-sm text-[#B3261E]">
            Incorrect username or password. Try one of the demo accounts below.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Checking…" : "Log in"}
        </button>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-4 text-xs text-subtle">
        <p className="font-mono uppercase tracking-[0.1em] text-subtle">Demo accounts</p>
        <p className="mt-2">
          <code className="rounded bg-white px-1.5 py-0.5">test / 1234</code> ·{" "}
          <code className="rounded bg-white px-1.5 py-0.5">tutor1 / 1234</code> ·{" "}
          <code className="rounded bg-white px-1.5 py-0.5">admin / tutorly-admin</code>
        </p>
      </div>
    </form>
  );
}