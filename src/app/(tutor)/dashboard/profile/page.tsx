import SectionCard from "@/components/SectionCard";

export default function TutorProfilePage() {
  return (
    <SectionCard title="Tutor Profile">
      <div className="space-y-5">
        <input
          className="w-full rounded-xl border px-4 py-3"
          placeholder="Full name"
        />

        <textarea
          className="min-h-32 w-full rounded-xl border px-4 py-3"
          placeholder="Tell students about yourself..."
        />

        <input
          className="w-full rounded-xl border px-4 py-3"
          placeholder="Hourly rate"
        />

        <button className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">
          Save Changes
        </button>
      </div>
    </SectionCard>
  );
}