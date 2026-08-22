// app/(admin)/layout.tsx
//
// Same fix as (tutor)/layout.tsx: this used to duplicate the site's
// own Navbar with dead links ("/admin/dashboard/users" doesn't match
// the real route structure — (admin) is a route group, adds no URL
// segment, and "admin-dashboard"/"users"/etc. are flat sibling routes).
// The root layout's Navbar/Footer already wrap this group.

export default function AdminLayout({
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
