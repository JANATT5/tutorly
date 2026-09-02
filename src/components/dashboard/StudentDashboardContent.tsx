// components/dashboard/StudentDashboardContent.tsx
//
// Wired to real bookings via useCurrentUser() + useBookings(). "Practice
// avg. score" and "Planr progress" stat cards from the old mock version
// are dropped rather than faked — computing them for real means averaging
// QuizResult/PlanrPath rows, which nothing does yet (flagged in
// docs/API_GUIDE.md as a follow-up, not built here).

"use client";

import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import LogoutButton from "@/components/dashboard/LogoutButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useBookings } from "@/hooks/useBookings";

export default function StudentDashboardContent() {
  const { studentProfile, isLoading: userLoading } = useCurrentUser();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings(
    studentProfile ? { studentId: studentProfile.id } : undefined,
    { enabled: Boolean(studentProfile) },
  );

  // COMPLETED is the only "past" status; everything else (PENDING,
  // CONFIRMED) is still upcoming. CANCELLED bookings are left out of both
  // lists — they're neither upcoming nor a completed session.
  const upcoming = bookings.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED");
  const past = bookings.filter((b) => b.status === "COMPLETED");

  const stats = [
    { label: "Upcoming sessions", value: bookingsLoading ? "…" : String(upcoming.length) },
    { label: "Sessions completed", value: bookingsLoading ? "…" : String(past.length) },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader eyebrow="Student" title="Your dashboard" />
        <LogoutButton />
      </div>

      {userLoading ? (
        <p className="mt-6 text-sm text-subtle">Loading…</p>
      ) : !studentProfile ? (
        <p className="mt-6 text-sm text-subtle">No student profile found for this account.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-subtle">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-fg">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-4 font-display text-lg text-fg">Upcoming sessions</h2>
              {upcoming.length === 0 ? (
                <p className="text-sm text-subtle">No upcoming sessions booked.</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/tutors/${booking.tutorId}`}
                      className="block rounded-xl border border-border p-3 text-sm transition-colors hover:border-forest"
                    >
                      <p className="font-medium text-fg">
                        {booking.subject} with {booking.tutor.fullName}
                      </p>
                      <p className="text-subtle">{new Date(booking.date).toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-4 font-display text-lg text-fg">Past sessions</h2>
              {past.length === 0 ? (
                <p className="text-sm text-subtle">No completed sessions yet.</p>
              ) : (
                <div className="space-y-3">
                  {past.map((booking) => (
                    <div key={booking.id} className="rounded-xl border border-border p-3 text-sm">
                      <p className="font-medium text-fg">
                        {booking.subject} with {booking.tutor.fullName}
                      </p>
                      <p className="text-subtle">{new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
