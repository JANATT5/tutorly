// components/dashboards/StudentDashboardContent.tsx
//
// Extracted from what was app/(student)/student-dashboard/page.tsx.
// Content/behavior unchanged.

import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import LogoutButton from "@/components/dashboards/LogoutButton";
import { studentBookings, tutors, type SubjectKey } from "@/lib/mock-data";

const subjectLabel: Record<SubjectKey, string> = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  "computer-science": "Computer Science",
};

type StudentDashboardContentProps = {
  data?: Record<string, string | number>;
};

export default function StudentDashboardContent({ data }: StudentDashboardContentProps) {
  const stats = [
    { label: "Upcoming sessions", value: String(data?.upcomingSessions ?? "2") },
    { label: "Sessions completed", value: String(data?.completedCourses ?? "14") },
    { label: "Practice avg. score", value: String(data?.practiceAvgScore ?? "76%") },
    { label: "Planr progress", value: String(data?.planrProgress ?? "30%") },
  ];

  const upcoming = studentBookings.filter((b) => b.status === "upcoming");
  const past = studentBookings.filter((b) => b.status === "completed");

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader eyebrow="Student" title="Your dashboard" />
        <LogoutButton />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
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