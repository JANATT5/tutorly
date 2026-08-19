type StatCardProps = {
  label: string;
  value: string;
};

export default function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}