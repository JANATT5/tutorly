// components/layout/PlaceholderBlock.tsx
//
// A dashed placeholder box. This is NOT meant to ship — it's a stand-in
// so every route renders something structured today, and a clear visual
// marker for "real component/data goes here" when you or a teammate
// comes back to wire it up. Search your codebase for "PlaceholderBlock"
// later to find every spot that still needs real content.

type PlaceholderBlockProps = {
  label: string;
  height?: string; // e.g. "h-40" — lets taller sections (tables, forms) reserve more space
};

export default function PlaceholderBlock({ label, height = "h-32" }: PlaceholderBlockProps) {
  return (
    <div
      className={`flex ${height} w-full items-center justify-center rounded-xl border border-dashed border-[#DDD8CF] bg-[#F0EBE3] px-4 text-center font-mono text-xs uppercase tracking-wide text-[#6B6560]`}
    >
      {label}
    </div>
  );
}