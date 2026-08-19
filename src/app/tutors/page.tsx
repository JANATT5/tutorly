import Link from "next/link";
import AppShell from "@/components/AppShell";

const tutors = [
  {
    id: "1",
    name: "Ahmad Khalil",
    subject: "Computer Science",
    level: "University",
    rating: "4.9",
  },
  {
    id: "2",
    name: "Lina Haddad",
    subject: "Mathematics",
    level: "School",
    rating: "4.8",
  },
  {
    id: "3",
    name: "Omar Saleh",
    subject: "Programming",
    level: "University",
    rating: "5.0",
  },
];

export default function TutorsPage() {
  return (
    <AppShell
      title="Find a Tutor"
      subtitle="Find the right tutor for your learning goals."
      nav={[
        { label: "Home", href: "/" },
        { label: "Study Tools", href: "/study-tools" },
      ]}
    >
      {/* Search */}
      <div className="mb-8 grid gap-3 md:grid-cols-[1fr_220px_140px]">
        <input
          className="rounded-xl border bg-white px-4 py-3 outline-none focus:border-indigo-500"
          placeholder="Search tutor or subject..."
        />

        <select className="rounded-xl border bg-white px-4 py-3">
          <option>All subjects</option>
          <option>Computer Science</option>
          <option>Mathematics</option>
          <option>Programming</option>
        </select>

        <button className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">
          Search
        </button>
      </div>

      {/* Tutors */}
      <div className="grid gap-6 md:grid-cols-3">
        {tutors.map((tutor) => (
          <Link
            key={tutor.id}
            href={`/tutors/${tutor.id}`}
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
              {tutor.name
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </div>

            <h2 className="text-lg font-semibold">
              {tutor.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {tutor.subject}
            </p>

            <p className="mt-4 text-sm">
              ⭐ {tutor.rating} · {tutor.level}
            </p>

            <p className="mt-5 font-semibold text-indigo-600">
              View profile →
            </p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}