import SectionCard from "@/components/SectionCard";

export default function AdminCoursesPage() {
  return (
    <SectionCard title="Courses">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          "Computer Science",
          "Programming",
          "Mathematics",
          "Data Structures",
        ].map((course) => (
          <div
            key={course}
            className="rounded-xl border p-5"
          >
            <h3 className="font-semibold">
              {course}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Active course
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}