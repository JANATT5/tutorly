import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-bold text-indigo-600"
          >
            Tutorly
          </Link>

          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link href="/tutors" className="hover:text-indigo-600">
              Find a Tutor
            </Link>

            <Link
              href="/study-tools"
              className="hover:text-indigo-600"
            >
              Study Tools
            </Link>

            <Link
              href="/student/dashboard"
              className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="mb-4 font-semibold text-indigo-600">
            Learn smarter. Match faster.
          </p>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
            Find the right tutor.
            <br />
            Study smarter.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Tutorly connects students with trusted CS and science
            tutors while giving them practical AI-powered study tools.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/tutors"
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white"
            >
              Find a tutor
            </Link>

            <Link
              href="/study-tools"
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
            >
              Explore study tools
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-20 md:grid-cols-3">
        <Feature
          title="Find Tutors"
          description="Browse tutors by subject, level, and expertise."
        />

        <Feature
          title="Practice Questions"
          description="Generate questions and test your understanding."
        />

        <Feature
          title="Career & Planr"
          description="Discover suitable paths and create a learning plan."
        />
      </section>
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-6">
      <h2 className="font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}