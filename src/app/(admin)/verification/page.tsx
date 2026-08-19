import SectionCard from "@/components/SectionCard";

export default function VerificationPage() {
  return (
    <SectionCard title="Tutor Verification">
      <div className="space-y-4">
        <div className="rounded-xl border p-5">
          <h3 className="font-semibold">
            Ahmad Khalil
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Computer Science Tutor
          </p>

          <div className="mt-4 flex gap-3">
            <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">
              Approve
            </button>

            <button className="rounded-lg border px-4 py-2 text-sm font-semibold">
              Review
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}