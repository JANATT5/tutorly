// app/(student)/student-dashboard/page.tsx  →  /student-dashboard
//
// This file was empty in the original project (0 bytes), which breaks
// the TypeScript build outright — every .tsx file must be a module.
// No Figma reference exists yet for the student dashboard, so this is
// a minimal, honest stub rather than an invented design. Swap the
// PlaceholderBlock for real content once that screen is designed.

import PageHeader from "@/components/layout/PageHeader";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";
import { studentDashboardStats } from "@/lib/mock-data";

export default function StudentDashboardPage() {
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

      <div className="mt-8">
        <PlaceholderBlock label="Upcoming bookings + practice history" height="h-56" />
      </div>
    </div>
  );
}
