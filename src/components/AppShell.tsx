import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
};

type AppShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  nav?: NavItem[];
};

export default function AppShell({
  children,
  title,
  subtitle,
  nav = [],
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-indigo-600"
          >
            Tutorly
          </Link>

          <nav className="flex gap-6 text-sm text-slate-600">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-indigo-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </main>
    </div>
  );
}