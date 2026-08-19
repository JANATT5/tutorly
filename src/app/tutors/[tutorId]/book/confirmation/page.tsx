import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function ConfirmationPage() {
  return (
    <AppShell
      title="Request Sent"
      subtitle="Your tutoring request has been submitted successfully."
    >
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-10 text-center shadow-sm">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
          ✓
        </div>

        {/* Message */}
        <h2 className="mt-6 text-2xl font-bold text-slate-900">
          You&apos;re all set!
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          Your session request has been sent to the tutor.
          They will review your request and contact you using
          the information you provided.
        </p>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/tutors"
            className="rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Find Another Tutor
          </Link>

          <Link
            href="/"
            className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Back Home
          </Link>
        </div>
      </div>
    </AppShell>
  );
}