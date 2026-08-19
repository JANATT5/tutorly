import SectionCard from "@/components/SectionCard";

export default function AvailabilityPage() {
  return (
    <SectionCard title="Availability">
      <div className="space-y-4">
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ].map((day) => (
          <div
            key={day}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <span className="font-medium">{day}</span>

            <span className="text-sm text-green-600">
              Available
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}