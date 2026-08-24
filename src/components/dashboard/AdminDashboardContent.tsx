// components/dashboards/AdminDashboardContent.tsx
//
// Extracted from what was app/(admin)/admin-dashboard/page.tsx — that
// route (and its separate passcode gate) is gone now. Per the
// professor's explicit instruction, there's only ONE /dashboard route;
// admin content renders inline there like tutor/student, selected by
// role the same way. A static passcode gate on top of that was extra
// complexity beyond what was asked, so it's been removed along with
// the separate route — this component now uses the same LogoutButton
// as the other two roles instead of the old passcode-specific one.

"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/StatCard";
import DashboardTabs, { type DashboardTab } from "@/components/DashboardTabs";
import LogoutButton from "@/components/dashboards/LogoutButton";

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

type AdminDashboardContentProps = {
  data?: Record<string, string | number>;
};

export default function AdminDashboardContent({ data }: AdminDashboardContentProps) {
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
            <div
              key={user.name}
              className="grid grid-cols-3 border-t border-border p-4 text-sm"
            >
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