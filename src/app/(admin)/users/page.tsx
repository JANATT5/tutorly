import SectionCard from "@/components/SectionCard";

export default function UsersPage() {
  return (
    <SectionCard title="Users">
      <div className="overflow-hidden rounded-xl border">
        <div className="grid grid-cols-3 bg-slate-50 p-4 text-sm font-semibold">
          <span>Name</span>
          <span>Role</span>
          <span>Status</span>
        </div>

        <div className="grid grid-cols-3 border-t p-4 text-sm">
          <span>Ahmad Khalil</span>
          <span>Tutor</span>
          <span className="text-green-600">
            Active
          </span>
        </div>

        <div className="grid grid-cols-3 border-t p-4 text-sm">
          <span>Maya Hassan</span>
          <span>Student</span>
          <span className="text-green-600">
            Active
          </span>
        </div>
      </div>
    </SectionCard>
  );
}