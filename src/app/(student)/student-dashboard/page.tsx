// app/(student)/student-dashboard/page.tsx  →  /student-dashboard
//
// Was an empty (0-byte) file in the original project, which broke the
// build outright. Now wired to real mock data — studentBookings and
// tutors from lib/mock-data — instead of a placeholder box.

import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { studentDashboardStats, studentBookings, tutors, type SubjectKey } from "@/lib/mock-data";

const subjectLabel: Record<SubjectKey, string> = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  "computer-science": "Computer Science",
};

export default function StudentDashboardPage() {
  const upcoming = studentBookings.filter((b) => b.status === "upcoming");
  const past = studentBookings.filter((b) => b.status === "completed");

  return (
    <div>
      <PageHeader eyebrow="Student" title="Your dashboard" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {studentDashboardStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
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
              {upcoming.map((booking) => {
                const tutor = tutors.find((t) => t.id === booking.tutorId);
                return (
                  <Link
                    key={booking.id}
                    href={`/tutors/${booking.tutorId}`}
                    className="block rounded-xl border border-border p-3 text-sm transition-colors hover:border-forest"
                  >
                    <p className="font-medium text-fg">
                      {subjectLabel[booking.subject]} with {tutor?.name ?? "a tutor"}
                    </p>
                    <p className="text-subtle">
                      {booking.dateLabel} · {booking.timeLabel}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="mb-4 font-display text-lg text-fg">Past sessions</h2>
          {past.length === 0 ? (
            <p className="text-sm text-subtle">No completed sessions yet.</p>
          ) : (
            <div className="space-y-3">
              {past.map((booking) => {
                const tutor = tutors.find((t) => t.id === booking.tutorId);
                return (
                  <div key={booking.id} className="rounded-xl border border-border p-3 text-sm">
                    <p className="font-medium text-fg">
                      {subjectLabel[booking.subject]} with {tutor?.name ?? "a tutor"}
                    </p>
                    <p className="text-subtle">{booking.dateLabel}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
