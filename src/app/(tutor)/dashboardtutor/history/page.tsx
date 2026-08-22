import SectionCard from "@/components/SectionCard";

export default function HistoryPage() {
  return (
    <SectionCard title="Session History">
      <div className="space-y-4">
        {[
          "Programming · Maya Hassan",
          "Algorithms · Karim Ali",
          "Web Development · Nour Ahmad",
        ].map((session) => (
          <div
            key={session}
            className="rounded-xl border p-4"
          >
            <p className="font-medium">
              {session}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Completed · August 2026
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}