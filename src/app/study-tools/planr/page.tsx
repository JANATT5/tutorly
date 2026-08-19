import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SectionCard";

export default function PlannerPage() {
  return (
    <AppShell
      title="Planr"
      subtitle="Build a personalized learning plan from your goals."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Your Goal">
          <div className="space-y-4">
            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="What do you want to learn?"
            />

            <select className="w-full rounded-xl border px-4 py-3">
              <option>4 weeks</option>
              <option>8 weeks</option>
              <option>12 weeks</option>
            </select>

            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Hours per week"
            />

            <button className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white">
              Create My Plan
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Suggested Plan">
          <ol className="space-y-5">
            {[
              "Foundations",
              "Core Concepts",
              "Guided Practice",
              "Mini Project",
            ].map((step, index) => (
              <li
                key={step}
                className="flex gap-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                  {index + 1}
                </span>

                <div>
                  <p className="font-semibold">
                    {step}
                  </p>

                  <p className="text-sm text-slate-500">
                    Recommended learning activities and exercises.
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>
    </AppShell>
  );
}