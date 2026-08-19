import Link from "next/link";
import AppShell from "@/components/AppShell";

const tools = [
  {
    href: "/study-tools/practice-questions",
    title: "Practice Questions",
    description:
      "Generate questions and test your knowledge.",
    icon: "❓",
  },
  {
    href: "/study-tools/career-quiz",
    title: "Career Quiz",
    description:
      "Discover which CS paths match your interests.",
    icon: "🧭",
  },
  {
    href: "/study-tools/planner",
    title: "Planr",
    description:
      "Turn your goals into a personalized study plan.",
    icon: "🗺️",
  },
];

export default function StudyToolsPage() {
  return (
    <AppShell
      title="Study Tools"
      subtitle="AI-powered tools to help you learn smarter."
      nav={[
        { label: "Home", href: "/" },
        { label: "Tutors", href: "/tutors" },
      ]}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300"
          >
            <div className="text-3xl">
              {tool.icon}
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              {tool.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {tool.description}
            </p>

            <p className="mt-6 font-semibold text-indigo-600">
              Open tool →
            </p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}