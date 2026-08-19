import SectionCard from "@/components/SectionCard";

export default function BookingRequestsPage() {
  return (
    <SectionCard title="Booking Requests">
      <div className="space-y-4">
        {["Maya Hassan", "Karim Ali", "Nour Ahmad"].map(
          (student) => (
            <div
              key={student}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <h3 className="font-semibold">
                  {student}
                </h3>

                <p className="text-sm text-slate-500">
                  Data Structures · Tomorrow 4:00 PM
                </p>
              </div>

              <div className="flex gap-2">
                <button className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white">
                  Accept
                </button>

                <button className="rounded-lg border px-3 py-2 text-sm">
                  Decline
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </SectionCard>
  );
}