import SectionCard from "@/components/SectionCard";

export default function AdminBookingsPage() {
  return (
    <SectionCard title="Bookings">
      <div className="space-y-4">
        <div className="rounded-xl border p-5">
          <p className="font-semibold">
            Maya Hassan → Ahmad Khalil
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Data Structures · Tomorrow · 4:00 PM
          </p>

          <span className="mt-3 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            Pending
          </span>
        </div>
      </div>
    </SectionCard>
  );
}