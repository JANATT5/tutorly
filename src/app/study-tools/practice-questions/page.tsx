import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SectionCard";

export default function PracticeQuestionsPage() {
  return (
    <AppShell
      title="Practice Questions"
      subtitle="Generate targeted questions for your next study session."
    >
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <SectionCard title="Generate Questions">
          <div className="space-y-4">
            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Topic, e.g. Arrays"
            />

            <select className="w-full rounded-xl border px-4 py-3">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <select className="w-full rounded-xl border px-4 py-3">
              <option>5 Questions</option>
              <option>10 Questions</option>
            </select>

            <button className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white">
              Generate
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Your Questions">
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Question 1
            </p>

            <p className="mt-2 font-semibold">
              What is the time complexity of searching for an
              element in a balanced Binary Search Tree?
            </p>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}