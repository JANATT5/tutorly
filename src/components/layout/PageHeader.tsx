// components/layout/PageHeader.tsx
//
// The top-of-page block: a small uppercase "eyebrow" label (DM Mono, matches
// the brand system), the Fraunces display title, and an optional one-line
// description. `eyebrow` and `description` are optional (the `?` in the type
// below), so a page can pass just a title if that's all it needs — that's
// what `eyebrow?: string` means versus `title: string` which is required.

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-10">
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-[#D47A2A]">
          {eyebrow}
        </p>
      )}
      <h1 className="font-serif text-3xl text-[#1A1714] md:text-4xl">{title}</h1>
      {description && (
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#6B6560]">
          {description}
        </p>
      )}
    </header>
  );
}

// Note: "font-serif" here is meant to map to Fraunces and "font-mono" to DM
// Mono. If your tailwind.config (or Tailwind v4 @theme block in globals.css)
// hasn't aliased those font-family keys to Fraunces/DM Mono yet, swap these
// two class names for whatever your project already uses (e.g. font-fraunces,
// font-dmmono) so the header actually picks up the right typefaces.
