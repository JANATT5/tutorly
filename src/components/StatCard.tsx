type StatCardProps = {
  label: string;
  value: string;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <p className="text-sm text-subtle">{label}</p>
      <p className="mt-2 text-2xl font-bold text-fg">{value}</p>
    </div>
  );
}