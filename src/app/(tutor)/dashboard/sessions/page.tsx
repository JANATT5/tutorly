import SectionCard from "@/components/SectionCard";

export default function SessionsPage() {
  return (
    <SectionCard title="Upcoming Sessions">
      <div className="space-y-4">
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">
            Data Structures
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Student: Maya Hassan
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Tomorrow · 4:00 PM
          </p>
        </div>
      </div>
    </SectionCard>
  );
}