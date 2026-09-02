// components/dashboard/AdminDashboardContent.tsx
//
// Wired to real data. Two tabs — Courses and parts of Reports — have no
// backing model in prisma/schema.prisma at all (no Course table, no
// analytics/aggregation anywhere), so rather than invent fake numbers
// they stay an honest "not built yet" placeholder. Everything else here
// (Users, Verification, Bookings, and the real counts in Overview/Reports)
// is live data.

"use client";

import PageHeader from "@/components/layout/PageHeader";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";
import StatCard from "@/components/StatCard";
import DashboardTabs, { type DashboardTab } from "@/components/DashboardTabs";
import LogoutButton from "@/components/dashboard/LogoutButton";
import { useUsers } from "@/hooks/useUsers";
import { useApplications, usePatchApplication } from "@/hooks/useApplications";
import { useBookings } from "@/hooks/useBookings";

export default function AdminDashboardContent() {
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: pendingApplications = [] } = useApplications({ status: "PENDING" });
  const { data: bookings = [] } = useBookings();
  const patchApplication = usePatchApplication();

  const tutorCount = users.filter((u) => u.role === "TUTOR").length;
  const studentCount = users.filter((u) => u.role === "STUDENT").length;

  function decideApplication(id: string, status: "APPROVED" | "REJECTED") {
    patchApplication.mutate({ id, dto: { status } });
  }

  const tabs: DashboardTab[] = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Users" value={usersLoading ? "…" : String(users.length)} />
            <StatCard label="Tutors" value={String(tutorCount)} />
            <StatCard label="Pending verification" value={String(pendingApplications.length)} />
            <StatCard label="Bookings" value={String(bookings.length)} />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-2 font-display text-lg text-fg">Platform activity</h2>
              {/* No activity-log model exists yet — flagged in docs/API_GUIDE.md */}
              <p className="text-sm text-subtle">Platform activity will appear here.</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-2 font-display text-lg text-fg">Needs attention</h2>
              <p className="text-sm text-subtle">
                {pendingApplications.length} tutor{pendingApplications.length === 1 ? "" : "s"}{" "}
                pending verification.
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
            <span>Username</span>
            <span>Role</span>
            <span>Joined</span>
          </div>
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-3 border-t border-border p-4 text-sm">
              <span className="text-fg">{user.username}</span>
              <span className="text-body">{user.role}</span>
              <span className="text-subtle">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
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
          {pendingApplications.length === 0 ? (
            <p className="text-sm text-subtle">No pending tutor verifications.</p>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map((app) => (
                <div key={app.id} className="rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-fg">{app.tutor.fullName}</h3>
                  <p className="mt-1 text-sm text-subtle">
                    Submitted {new Date(app.submittedAt).toLocaleDateString()}
                    {app.aiScore != null && ` · AI score ${app.aiScore}`}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => decideApplication(app.id, "APPROVED")}
                      disabled={patchApplication.isPending}
                      className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => decideApplication(app.id, "REJECTED")}
                      disabled={patchApplication.isPending}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-forest disabled:opacity-50"
                    >
                      Reject
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
          {bookings.length === 0 ? (
            <p className="text-sm text-subtle">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="rounded-xl border border-border p-5">
                  <p className="font-semibold text-fg">
                    {b.student.fullName} → {b.tutor.fullName}
                  </p>
                  <p className="mt-1 text-sm text-subtle">
                    {b.subject} · {new Date(b.date).toLocaleString()}
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-amber/15 px-3 py-1 text-xs font-medium text-amber-hover">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "courses",
      label: "Courses",
      content: (
        <PlaceholderBlock
          label="No Course model exists yet in the database — this tab has nothing to load."
          height="h-56"
        />
      ),
    },
    {
      id: "reports",
      label: "Reports",
      content: (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm text-subtle">Total bookings</p>
            <p className="mt-2 text-2xl font-bold text-fg">{bookings.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm text-subtle">Active tutors</p>
            <p className="mt-2 text-2xl font-bold text-fg">{tutorCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm text-subtle">Students</p>
            <p className="mt-2 text-2xl font-bold text-fg">{studentCount}</p>
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
