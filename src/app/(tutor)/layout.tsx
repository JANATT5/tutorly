import Link from "next/link";

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-indigo-600"
          >
            Tutorly
          </Link>

          <nav className="flex gap-5 text-sm">
            <Link href="/tutor/dashboard">
              Overview
            </Link>

            <Link href="/tutor/dashboard/booking-requests">
              Requests
            </Link>

            <Link href="/tutor/dashboard/sessions">
              Sessions
            </Link>

            <Link href="/tutor/dashboard/profile">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}