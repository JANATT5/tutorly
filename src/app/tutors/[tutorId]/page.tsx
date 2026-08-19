import Link from "next/link";
import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SectionCard";

export default async function TutorProfile({
  params,
}: {
  params: Promise<{ tutorId: string }>;
}) {
  const { tutorId } = await params;

  return (
    <AppShell
      title="Tutor Profile"
      subtitle="Learn more about this tutor."
      nav={[
        { label: "All Tutors", href: "/tutors" },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <SectionCard title="About the Tutor">
            <div className="flex gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                AK
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Ahmad Khalil
                </h2>

                <p className="text-slate-500">
                  Computer Science · ⭐ 4.9
                </p>

                <p className="mt-4 leading-7 text-slate-600">
                  University tutor specializing in programming,
                  algorithms, data structures, and introductory
                  computer science.
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Subjects & Courses">
            <div className="flex flex-wrap gap-2">
              {[
                "Programming",
                "Data Structures",
                "Algorithms",
                "Web Development",
              ].map((subject) => (
                <span
                  key={subject}
                  className="rounded-full bg-slate-100 px-3 py-2 text-sm"
                >
                  {subject}
                </span>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Reviews">
            <p className="text-sm text-slate-600">
              &ldquo;Clear explanations and very helpful.&rdquo;
            </p>
          </SectionCard>
        </div>

        {/* Booking card */}
        <div className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Starting from
          </p>

          <p className="mt-1 text-2xl font-bold">
            $15 / session
          </p>

          <Link
            href={`/tutors/${tutorId}/book`}
            className="mt-6 block rounded-xl bg-indigo-600 px-4 py-3 text-center font-semibold text-white"
          >
            Request a Session
          </Link>
        </div>
      </div>
    </AppShell>
  );
}