// components/dashboard/TutorDashboardContent.tsx
//
// Wired to real data via useCurrentUser() + the tutor/booking hooks.
// "Booking requests" / "Sessions" / "History" are all just this tutor's
// real Bookings, split by status (PENDING = request, CONFIRMED = upcoming
// session, COMPLETED = history) — there's no separate "request" concept
// in the schema, a request IS a PENDING booking. Subjects and Profile
// both persist for real (PATCH /api/tutors/:id and
// PATCH /api/tutors/:id/subjects). Availability has no backing model at
// all (no Availability table in prisma/schema.prisma), so — like the
// tutor detail page's Availability tab — it's an honest placeholder
// instead of a toggle UI that silently doesn't save.

"use client";

import PageHeader from "@/components/layout/PageHeader";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";
import StatCard from "@/components/StatCard";
import DashboardTabs, { type DashboardTab } from "@/components/DashboardTabs";
import LogoutButton from "@/components/dashboard/LogoutButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useBookings, usePatchBooking } from "@/hooks/useBookings";
import { useSubjects } from "@/hooks/useSubjects";
import { usePatchTutor, useReplaceTutorSubjects } from "@/hooks/useTutors";

const inputClasses =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest";

export default function TutorDashboardContent() {
  const { tutorProfile, isLoading: userLoading } = useCurrentUser();
  const { data: bookings = [] } = useBookings(
    tutorProfile ? { tutorId: tutorProfile.id } : undefined,
    { enabled: Boolean(tutorProfile) },
  );
  const patchBooking = usePatchBooking();

  const { data: allSubjects = [] } = useSubjects();
  const replaceSubjects = useReplaceTutorSubjects();

  const patchTutor = usePatchTutor();

  if (userLoading) {
    return <p className="text-sm text-subtle">Loading…</p>;
  }

  if (!tutorProfile) {
    return (
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <PageHeader eyebrow="Tutor" title="Your dashboard" />
          <LogoutButton />
        </div>
        <p className="mt-6 text-sm text-subtle">No tutor profile found for this account.</p>
      </div>
    );
  }

  // A fresh const, narrowed to non-undefined right here — unlike
  // `tutorProfile` itself, TypeScript keeps that narrowing inside the
  // closures below (control-flow narrowing doesn't reliably cross into
  // nested function declarations for the original variable).
  const tutor = tutorProfile;

  const requests = bookings.filter((b) => b.status === "PENDING");
  const upcomingSessions = bookings.filter((b) => b.status === "CONFIRMED");
  const history = bookings.filter((b) => b.status === "COMPLETED");
  const mySubjectIds = new Set(tutor.subjects.map((ts) => ts.subjectId));

  function respondToRequest(id: string, accept: boolean) {
    patchBooking.mutate({ id, dto: { status: accept ? "CONFIRMED" : "CANCELLED" } });
  }

  function toggleSubject(subjectId: string) {
    const next = mySubjectIds.has(subjectId)
      ? [...mySubjectIds].filter((id) => id !== subjectId)
      : [...mySubjectIds, subjectId];
    replaceSubjects.mutate({ tutorId: tutor.id, subjectIds: next });
  }

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    patchTutor.mutate({
      id: tutor.id,
      dto: {
        fullName: String(formData.get("fullName")),
        bio: String(formData.get("bio")),
        hourlyRate: Number(formData.get("hourlyRate")),
      },
    });
  }

  const tabs: DashboardTab[] = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Pending requests" value={String(requests.length)} />
            <StatCard label="Upcoming sessions" value={String(upcomingSessions.length)} />
            <StatCard label="Hourly rate" value={`$${tutorProfile.hourlyRate}`} />
            <StatCard label="Rating" value={tutorProfile.rating != null ? String(tutorProfile.rating) : "New"} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-4 font-display text-lg text-fg">Booking requests</h2>
              {requests.length === 0 ? (
                <p className="text-sm text-subtle">No pending requests right now.</p>
              ) : (
                <div className="space-y-3">
                  {requests.slice(0, 3).map((req) => (
                    <div key={req.id} className="rounded-xl border border-border p-3 text-sm">
                      <p className="font-medium text-fg">{req.student.fullName}</p>
                      <p className="text-subtle">
                        {req.subject} · {new Date(req.date).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-4 font-display text-lg text-fg">Upcoming sessions</h2>
              {upcomingSessions.length === 0 ? (
                <p className="text-sm text-subtle">Nothing confirmed yet.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.map((s) => (
                    <div key={s.id} className="rounded-xl border border-border p-3 text-sm">
                      <p className="font-medium text-fg">{s.subject}</p>
                      <p className="text-subtle">
                        {s.student.fullName} · {new Date(s.date).toLocaleString()}
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
          {requests.length === 0 ? (
            <p className="text-sm text-subtle">No pending requests right now.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
                >
                  <div>
                    <h3 className="font-semibold text-fg">{req.student.fullName}</h3>
                    <p className="text-sm text-subtle">
                      {req.subject} · {new Date(req.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => respondToRequest(req.id, true)}
                      disabled={patchBooking.isPending}
                      className="rounded-lg bg-forest px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => respondToRequest(req.id, false)}
                      disabled={patchBooking.isPending}
                      className="rounded-lg border border-border px-3 py-2 text-sm text-fg transition-colors hover:border-forest disabled:opacity-50"
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
                  <h3 className="font-semibold text-fg">{s.subject}</h3>
                  <p className="mt-1 text-sm text-subtle">Student: {s.student.fullName}</p>
                  <p className="mt-1 text-sm text-subtle">{new Date(s.date).toLocaleString()}</p>
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
          {history.length === 0 ? (
            <p className="text-sm text-subtle">No completed sessions yet.</p>
          ) : (
            <div className="space-y-4">
              {history.map((h) => (
                <div key={h.id} className="rounded-xl border border-border p-4">
                  <p className="font-medium text-fg">
                    {h.subject} · {h.student.fullName}
                  </p>
                  <p className="mt-1 text-sm text-subtle">
                    Completed · {new Date(h.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "availability",
      label: "Availability",
      content: (
        <PlaceholderBlock
          label="No Availability model exists yet in the database — this tab has nothing to save to."
          height="h-56"
        />
      ),
    },
    {
      id: "subjects",
      label: "Subjects",
      content: (
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="flex flex-wrap gap-3">
            {allSubjects.map((subject) => {
              const isSelected = mySubjectIds.has(subject.id);
              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => toggleSubject(subject.id)}
                  disabled={replaceSubjects.isPending}
                  aria-pressed={isSelected}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                    isSelected
                      ? "bg-forest text-white"
                      : "border border-border bg-white text-fg hover:border-forest"
                  }`}
                >
                  {subject.name}
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
      content: (
        <PlaceholderBlock
          label="No Course model exists yet in the database — this tab has nothing to load."
          height="h-56"
        />
      ),
    },
    {
      id: "profile",
      label: "Profile",
      content: (
        // Uncontrolled form (defaultValue + FormData on submit) rather than
        // controlled inputs kept in sync with `tutor` via useState/useEffect
        // — there's no local state to seed from an async value this way, so
        // there's nothing to keep synchronized in the first place.
        <form
          onSubmit={saveProfile}
          className="max-w-xl rounded-2xl border border-border bg-white p-6"
        >
          <div className="space-y-4">
            <input
              name="fullName"
              defaultValue={tutor.fullName}
              className={inputClasses}
              placeholder="Full name"
            />
            <textarea
              name="bio"
              defaultValue={tutor.bio}
              className={`${inputClasses} min-h-32 resize-none`}
              placeholder="Tell students about yourself…"
            />
            <input
              name="hourlyRate"
              defaultValue={tutor.hourlyRate}
              type="number"
              min={0}
              className={inputClasses}
              placeholder="Hourly rate"
            />
            <button
              type="submit"
              disabled={patchTutor.isPending}
              className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-50"
            >
              {patchTutor.isPending ? "Saving…" : "Save changes"}
            </button>
            {patchTutor.isSuccess && (
              <p className="text-sm text-forest">Saved.</p>
            )}
          </div>
        </form>
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
