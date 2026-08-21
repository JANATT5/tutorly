// app/(tutor)/dashboard/courses/page.tsx  →  /dashboard/courses
//
// Same situation as the student dashboard: this file was empty (0
// bytes) in the original project, which breaks the build. No Figma
// reference exists for this screen yet, so this is a minimal, honest
// stub rather than an invented design.

import PageHeader from "@/components/layout/PageHeader";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";

export default function TutorCoursesPage() {
  return (
    <div>
      <PageHeader eyebrow="Tutor" title="Your courses" />
      <PlaceholderBlock label="Courses you teach + subject/topic management" height="h-56" />
    </div>
  );
}
