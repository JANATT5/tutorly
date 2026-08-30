type SubjectPillProps = {
  icon: React.ReactNode;
  label: string;
};

export default function SubjectPill({ icon, label }: SubjectPillProps) {
  return (
    <button className="flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 font-medium text-forest transition-shadow hover:shadow-md">
      <span aria-hidden="true">{icon}</span>
      {label}
    </button>
  );
}