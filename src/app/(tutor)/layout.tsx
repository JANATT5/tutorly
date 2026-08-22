// app/(tutor)/layout.tsx
//
// Previously duplicated the site's own Navbar (with dead links like
// "/tutor/dashboard" that don't match the real route structure, since
// (tutor) is a route group and adds no URL segment). The root layout's
// Navbar/Footer already wrap every page including this group, so this
// just needs to provide the content area — no second header.

export default function TutorLayout({
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
