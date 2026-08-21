type SectionCardProps = {
  title: string;
  children: React.ReactNode;
};

export default function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-fg">{title}</h2>
      {children}
    </section>
  );
}
