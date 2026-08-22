import SectionCard from "@/components/SectionCard";
import StatCard from "@/components/StatCard";

export default function TutorDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Tutor Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your tutoring activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Pending Requests"
          value="4"
        />

        <StatCard
          label="Upcoming Sessions"
          value="6"
        />

        <StatCard
          label="This Month"
          value="$240"
        />

        <StatCard
          label="Rating"
          value="4.9"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Booking Requests">
          <p className="text-sm text-slate-500">
            Your newest student requests will appear here.
          </p>
        </SectionCard>

        <SectionCard title="Today's Sessions">
          <p className="text-sm text-slate-500">
            Your sessions for today will appear here.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}