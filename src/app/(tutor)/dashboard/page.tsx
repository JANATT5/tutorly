// app/(tutor)/dashboard/page.tsx  →  /dashboard
//
// Consolidates what used to be 8 separate routes (dashboard, /availability,
// /booking_request, /courses, /history, /profile, /sessions, /subjects)
// into one page with tabs. Also restyled off the old indigo/slate palette
// onto the project's actual design tokens — the old pages predated the
// brand system landing on the rest of the app.

"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";
import StatCard from "@/components/StatCard";
import DashboardTabs, { type DashboardTab } from "@/components/DashboardTabs";

const initialBookingRequests = [
  { id: "req-1", student: "Maya Hassan", detail: "Data Structures · Tomorrow 4:00 PM" },
  { id: "req-2", student: "Karim Ali", detail: "Algorithms · Fri 5:00 PM" },
  { id: "req-3", student: "Nour Ahmad", detail: "Web Development · Sat 2:00 PM" },
];

const upcomingSessions = [
  { id: "s-1", title: "Data Structures", student: "Maya Hassan", when: "Tomorrow · 4:00 PM" },
];

const sessionHistory = [
  { id: "h-1", title: "Programming · Maya Hassan", when: "Completed · August 2026" },
  { id: "h-2", title: "Algorithms · Karim Ali", when: "Completed · August 2026" },
  { id: "h-3", title: "Web Development · Nour Ahmad", when: "Completed · August 2026" },
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const availableSubjects = [
  "Computer Science",
  "Programming",
  "Mathematics",
  "Algorithms",
  "Web Development",
];

export default function TutorDashboardPage() {
  // Booking requests — accept/decline actually removes them from the list
  const [bookingRequests, setBookingRequests] = useState(initialBookingRequests);

  function respondToRequest(id: string) {
    setBookingRequests((prev) => prev.filter((r) => r.id !== id));
  }

  // Availability — toggle days on/off
  const [availableDays, setAvailableDays] = useState<string[]>(weekdays);
  function toggleDay(day: string) {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  // Subjects — toggle selected
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "Computer Science",
    "Programming",
  ]);
  function toggleSubject(subject: string) {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }

  // Profile form
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileRate, setProfileRate] = useState("");

  const inputClasses =
    "w-full rounded-lg border border-border bg-white px-4 py-3 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest";

  const tabs: DashboardTab[] = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Pending requests" value={String(bookingRequests.length)} />
            <StatCard label="Upcoming sessions" value={String(upcomingSessions.length)} />
            <StatCard label="This month" value="$240" />
            <StatCard label="Rating" value="4.9" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-4 font-display text-lg text-fg">Booking requests</h2>
              {bookingRequests.length === 0 ? (
                <p className="text-sm text-subtle">No pending requests right now.</p>
              ) : (
                <div className="space-y-3">
                  {bookingRequests.slice(0, 3).map((req) => (
                    <div key={req.id} className="rounded-xl border border-border p-3 text-sm">
                      <p className="font-medium text-fg">{req.student}</p>
                      <p className="text-subtle">{req.detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-4 font-display text-lg text-fg">Today&apos;s sessions</h2>
              {upcomingSessions.length === 0 ? (
                <p className="text-sm text-subtle">Nothing scheduled today.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.map((s) => (
                    <div key={s.id} className="rounded-xl border border-border p-3 text-sm">
                      <p className="font-medium text-fg">{s.title}</p>
                      <p className="text-subtle">
                        {s.student} · {s.when}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "requests",
      label: "Booking requests",
      content: (
        <div className="rounded-2xl border border-border bg-white p-6">
          {bookingRequests.length === 0 ? (
            <p className="text-sm text-subtle">No pending requests right now.</p>
          ) : (
            <div className="space-y-4">
              {bookingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
                >
                  <div>
                    <h3 className="font-semibold text-fg">{req.student}</h3>
                    <p className="text-sm text-subtle">{req.detail}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => respondToRequest(req.id)}
                      className="rounded-lg bg-forest px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => respondToRequest(req.id)}
                      className="rounded-lg border border-border px-3 py-2 text-sm text-fg transition-colors hover:border-forest"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "sessions",
      label: "Sessions",
      content: (
        <div className="rounded-2xl border border-border bg-white p-6">
          {upcomingSessions.length === 0 ? (
            <p className="text-sm text-subtle">No upcoming sessions.</p>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map((s) => (
                <div key={s.id} className="rounded-xl border border-border p-4">
                  <h3 className="font-semibold text-fg">{s.title}</h3>
                  <p className="mt-1 text-sm text-subtle">Student: {s.student}</p>
                  <p className="mt-1 text-sm text-subtle">{s.when}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "history",
      label: "History",
      content: (
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="space-y-4">
            {sessionHistory.map((h) => (
              <div key={h.id} className="rounded-xl border border-border p-4">
                <p className="font-medium text-fg">{h.title}</p>
                <p className="mt-1 text-sm text-subtle">{h.when}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "availability",
      label: "Availability",
      content: (
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="space-y-3">
            {weekdays.map((day) => {
              const isAvailable = availableDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-left transition-colors hover:border-forest"
                >
                  <span className="font-medium text-fg">{day}</span>
                  <span
                    className={`text-sm font-medium ${
                      isAvailable ? "text-forest" : "text-subtle"
                    }`}
                  >
                    {isAvailable ? "Available" : "Unavailable"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      id: "subjects",
      label: "Subjects",
      content: (
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="flex flex-wrap gap-3">
            {availableSubjects.map((subject) => {
              const isSelected = selectedSubjects.includes(subject);
              return (
                <button
                  key={subject}
                  type="button"
                  onClick={() => toggleSubject(subject)}
                  aria-pressed={isSelected}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-forest text-white"
                      : "border border-border bg-white text-fg hover:border-forest"
                  }`}
                >
                  {subject}
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      id: "courses",
      label: "Courses",
      content: <PlaceholderBlock label="Courses you teach + subject/topic management" height="h-56" />,
    },
    {
      id: "profile",
      label: "Profile",
      content: (
        <div className="max-w-xl rounded-2xl border border-border bg-white p-6">
          <div className="space-y-4">
            <input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className={inputClasses}
              placeholder="Full name"
            />
            <textarea
              value={profileBio}
              onChange={(e) => setProfileBio(e.target.value)}
              className={`${inputClasses} min-h-32 resize-none`}
              placeholder="Tell students about yourself…"
            />
            <input
              value={profileRate}
              onChange={(e) => setProfileRate(e.target.value)}
              className={inputClasses}
              placeholder="Hourly rate"
            />
            <button
              type="button"
              className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
            >
              Save changes
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader eyebrow="Tutor" title="Your dashboard" />
      <DashboardTabs tabs={tabs} />
    </div>
  );
}
