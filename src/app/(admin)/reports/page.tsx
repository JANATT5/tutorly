import SectionCard from "@/components/SectionCard";

export default function ReportsPage() {
  return (
    <SectionCard title="Reports">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">
            Total Sessions
          </p>

          <p className="mt-2 text-2xl font-bold">
            132
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">
            Active Tutors
          </p>

          <p className="mt-2 text-2xl font-bold">
            46
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">
            Completion Rate
          </p>

          <p className="mt-2 text-2xl font-bold">
            92%
          </p>
        </div>
      </div>
    </SectionCard>
  );
}