import SectionCard from "@/components/SectionCard";

export default function SubjectsPage() {
  return (
    <SectionCard title="Subjects">
      <div className="flex flex-wrap gap-3">
        {[
          "Computer Science",
          "Programming",
          "Mathematics",
          "Algorithms",
          "Web Development",
        ].map((subject) => (
          <button
            key={subject}
            className="rounded-full border px-4 py-2 text-sm hover:border-indigo-400"
          >
            {subject}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}