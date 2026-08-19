import SectionCard from "@/components/SectionCard";
import StatCard from "@/components/StatCard";

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor and manage the Tutorly platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Users"
          value="248"
        />

        <StatCard
          label="Tutors"
          value="46"
        />

        <StatCard
          label="Pending Verification"
          value="7"
        />

        <StatCard
          label="Bookings"
          value="132"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Platform Activity">
          <p className="text-sm text-slate-500">
            Platform activity will appear here.
          </p>
        </SectionCard>

        <SectionCard title="Needs Attention">
          <p className="text-sm text-slate-500">
            Items requiring admin review will appear here.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}