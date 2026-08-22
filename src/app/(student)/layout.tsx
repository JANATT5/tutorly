// app/(student)/layout.tsx
//
// Same fix as the tutor/admin layouts: this duplicated the site's own
// Navbar with links to routes that no longer exist at all (/tutors was
// replaced by /browse, /study-tools was removed entirely in favor of
// flat /practice, /quiz, /planr routes) or were wrong to begin with
// (/student/dashboard vs the real /student-dashboard). The root
// layout's Navbar/Footer already wrap this group.

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">{children}</main>
    </div>
  );
}
