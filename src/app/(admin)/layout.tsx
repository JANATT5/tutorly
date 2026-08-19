import Link from "next/link";

export default function AdminLayout({
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
            <Link href="/admin/dashboard">
              Overview
            </Link>

            <Link href="/admin/dashboard/users">
              Users
            </Link>

            <Link href="/admin/dashboard/verification">
              Verification
            </Link>

            <Link href="/admin/dashboard/bookings">
              Bookings
            </Link>

            <Link href="/admin/dashboard/reports">
              Reports
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