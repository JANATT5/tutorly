import Link from "next/link";
import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SectionCard";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ tutorId: string }>;
}) {
  const { tutorId } = await params;

  return (
    <AppShell
      title="Request a Session"
      subtitle="Send your preferred session details to the tutor."
    >
      <div className="mx-auto max-w-2xl">
        <SectionCard title="Session Details">
          <div className="space-y-5">
            <label className="grid gap-2 text-sm font-medium">
              Your name

              <input
                className="rounded-xl border px-4 py-3"
                placeholder="Full name"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Email

              <input
                className="rounded-xl border px-4 py-3"
                placeholder="you@example.com"
                type="email"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Subject

              <input
                className="rounded-xl border px-4 py-3"
                placeholder="e.g. Data Structures"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Preferred date

                <input
                  type="date"
                  className="rounded-xl border px-4 py-3"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Preferred time

                <input
                  type="time"
                  className="rounded-xl border px-4 py-3"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium">
              Message

              <textarea
                className="min-h-32 rounded-xl border px-4 py-3"
                placeholder="Tell the tutor what you need help with..."
              />
            </label>

            <Link
              href={`/tutors/${tutorId}/book/confirmation`}
              className="block rounded-xl bg-indigo-600 px-4 py-3 text-center font-semibold text-white"
            >
              Send Request
            </Link>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}