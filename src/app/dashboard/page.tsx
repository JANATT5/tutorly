// app/dashboard/page.tsx  →  /dashboard
//
// FULLY SELF-CONTAINED — no imports from @/components/dashboards/* at
// all anymore. That subfolder specifically failed to resolve across
// multiple separate files (AdminDashboardContent, then LogoutButton)
// and multiple resend attempts on one machine, while everything else
// in the project resolved fine. Rather than keep chasing whatever's
// wrong with that one folder, every dashboard's content — Admin,
// Tutor, Student — and the shared LogoutButton now live directly in
// this single file. Nothing left to fail to find.
//
// Reads the role cookie client-side and redirects to /login if
// missing (see readRoleCookieClient below). Picks content from
// lib/mock-data's `dashboardData` array by role — static dummy data
// now, a real API later.

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";
import StatCard from "@/components/StatCard";
import DashboardTabs, { type DashboardTab } from "@/components/DashboardTabs";
import { ROLE_COOKIE, parseRoleCookie, clearSession, type UserRole } from "@/lib/session";
import {
  dashboardData,
  studentDashboardStats,
  studentBookings,
  tutors,
  type SubjectKey,
} from "@/lib/mock-data";

function readRoleCookieClient(): UserRole | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${ROLE_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : undefined;
  return parseRoleCookie(value);
}

// ---- Shared logout, inlined ----

function LogoutButton() {
  const router = useRouter();
  function handleLogout() {
    clearSession();
    router.push("/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-border bg-white px-4 py-2 text-sm text-body transition-colors hover:border-forest hover:text-forest"
    >
      Log out
    </button>
  );
}

// ---- Admin content, inlined ----

const initialBookings = [
  { id: "b-1", pair: "Maya Hassan → Ahmad Khalil", detail: "Data Structures · Tomorrow · 4:00 PM" },
];
const courses = ["Computer Science", "Programming", "Mathematics", "Data Structures"];
const users = [
  { name: "Ahmad Khalil", role: "Tutor", status: "Active" },
  { name: "Maya Hassan", role: "Student", status: "Active" },
];
const initialVerifications = [
  { id: "v-1", name: "Ahmad Khalil", detail: "Computer Science Tutor" },
];

function AdminDashboardInline({ data }: { data?: Record<string, string | number> }) {
  const [verifications, setVerifications] = useState(initialVerifications);
  function approveVerification(id: string) {
    setVerifications((prev) => prev.filter((v) => v.id !== id));
  }

  const tabs: DashboardTab[] = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Users" value={String(data?.totalUsers ?? "248")} />
            <StatCard label="Tutors" value={String(data?.totalTutors ?? "46")} />
            <StatCard label="Pending verification" value={String(verifications.length)} />
            <StatCard label="Bookings" value={String(data?.bookingsThisWeek ?? "132")} />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-2 font-display text-lg text-fg">Platform activity</h2>
              <p className="text-sm text-subtle">Platform activity will appear here.</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-2 font-display text-lg text-fg">Needs attention</h2>
              <p className="text-sm text-subtle">
                {verifications.length} tutor{verifications.length === 1 ? "" : "s"} pending
                verification.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "users",
      label: "Users",
      content: (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="grid grid-cols-3 bg-secondary p-4 text-sm font-semibold text-fg">
            <span>Name</span>
            <span>Role</span>
            <span>Status</span>
          </div>
          {users.map((user) => (
            <div key={user.name} className="grid grid-cols-3 border-t border-border p-4 text-sm">
              <span className="text-fg">{user.name}</span>
              <span className="text-body">{user.role}</span>
              <span className="font-medium text-forest">{user.status}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "verification",
      label: "Verification",
      content: (
        <div className="rounded-2xl border border-border bg-white p-6">
          {verifications.length === 0 ? (
            <p className="text-sm text-subtle">No pending tutor verifications.</p>
          ) : (
            <div className="space-y-4">
              {verifications.map((v) => (
                <div key={v.id} className="rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-fg">{v.name}</h3>
                  <p className="mt-1 text-sm text-subtle">{v.detail}</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => approveVerification(v.id)}
                      className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-forest"
                    >
                      Review
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
      id: "bookings",
      label: "Bookings",
      content: (
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="space-y-4">
            {initialBookings.map((b) => (
              <div key={b.id} className="rounded-xl border border-border p-5">
                <p className="font-semibold text-fg">{b.pair}</p>
                <p className="mt-1 text-sm text-subtle">{b.detail}</p>
                <span className="mt-3 inline-block rounded-full bg-amber/15 px-3 py-1 text-xs font-medium text-amber-hover">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "courses",
      label: "Courses",
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <div key={course} className="rounded-xl border border-border bg-white p-5">
              <h3 className="font-semibold text-fg">{course}</h3>
              <p className="mt-1 text-sm text-subtle">Active course</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "reports",
      label: "Reports",
      content: (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm text-subtle">Total sessions</p>
            <p className="mt-2 text-2xl font-bold text-fg">132</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm text-subtle">Active tutors</p>
            <p className="mt-2 text-2xl font-bold text-fg">46</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm text-subtle">Completion rate</p>
            <p className="mt-2 text-2xl font-bold text-fg">92%</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader eyebrow="Admin" title="Platform dashboard" />
        <LogoutButton />
      </div>
      <DashboardTabs tabs={tabs} />
    </div>
  );
}

// ---- Tutor content, inlined ----

const initialBookingRequests = [
  { id: "req-1", student: "Maya Hassan", detail: "Data Structures · Tomorrow 4:00 PM" },
  { id: "req-2", student: "Karim Ali", detail: "Algorithms · Fri 5:00 PM" },
  { id: "req-3", student: "Nour Ahmad", detail: "Web Development · Sat 2:00 PM" },
];
const upcomingSessionsList = [
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

function TutorDashboardInline({ data }: { data?: Record<string, string | number> }) {
  const [bookingRequests, setBookingRequests] = useState(initialBookingRequests);
  function respondToRequest(id: string) {
    setBookingRequests((prev) => prev.filter((r) => r.id !== id));
  }

  const [availableDays, setAvailableDays] = useState<string[]>(weekdays);
  function toggleDay(day: string) {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "Computer Science",
    "Programming",
  ]);
  function toggleSubject(subject: string) {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }

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
            <StatCard
              label="Upcoming sessions"
              value={String(data?.upcomingSessions ?? upcomingSessionsList.length)}
            />
            <StatCard
              label="This month"
              value={data?.earningsThisMonth ? `$${data.earningsThisMonth}` : "$240"}
            />
            <StatCard label="Rating" value={String(data?.rating ?? "4.9")} />
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
              {upcomingSessionsList.length === 0 ? (
                <p className="text-sm text-subtle">Nothing scheduled today.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingSessionsList.map((s) => (
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
          {upcomingSessionsList.length === 0 ? (
            <p className="text-sm text-subtle">No upcoming sessions.</p>
          ) : (
            <div className="space-y-4">
              {upcomingSessionsList.map((s) => (
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader eyebrow="Tutor" title="Your dashboard" />
        <LogoutButton />
      </div>
      <DashboardTabs tabs={tabs} />
    </div>
  );
}

// ---- Student content, inlined ----

const subjectLabel: Record<SubjectKey, string> = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  "computer-science": "Computer Science",
};

function StudentDashboardInline({ data }: { data?: Record<string, string | number> }) {
  const upcoming = studentBookings.filter((b) => b.status === "upcoming");
  const past = studentBookings.filter((b) => b.status === "completed");

  const stats = [
    { label: "Upcoming sessions", value: String(data?.upcomingSessions ?? studentDashboardStats[0]?.value ?? "2") },
    { label: "Sessions completed", value: String(data?.completedCourses ?? studentDashboardStats[1]?.value ?? "14") },
    { label: "Practice avg. score", value: String(data?.practiceAvgScore ?? "76%") },
    { label: "Planr progress", value: String(data?.planrProgress ?? "30%") },
  ];

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

// ---- The actual page ----

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null | "loading">("loading");

  useEffect(() => {
    const currentRole = readRoleCookieClient();
    if (currentRole === null) {
      router.push("/login");
    } else {
      setRole(currentRole);
    }
  }, [router]);

  if (role === "loading" || role === null) {
    return null;
  }

  const currentRoleData = dashboardData.find((d) => d.role === role)?.data;

  if (role === "admin") {
    return <AdminDashboardInline data={currentRoleData} />;
  }

  if (role === "tutor") {
    return <TutorDashboardInline data={currentRoleData} />;
  }

  return <StudentDashboardInline data={currentRoleData} />;
}