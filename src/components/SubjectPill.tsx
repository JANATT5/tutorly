type SubjectPillProps = {
  icon: React.ReactNode;
  label: string;
};

export default function SubjectPill({ icon, label }: SubjectPillProps) {
  return (
    <button className="bg-white border border-gray-200 rounded-full px-5 py-3 flex items-center gap-2 text-[#1B3B2F] font-medium hover:shadow-md transition-shadow">
      <span>{icon}</span>
      {label}
    </button>
  );
}