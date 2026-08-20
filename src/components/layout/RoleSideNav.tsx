// components/layout/RoleSideNav.tsx
//
// Used inside each dashboard route group's layout.tsx (student/tutor/admin).
// It's a plain array-of-objects -> .map() render, which is the standard
// React pattern for turning data into a list of elements. Each item needs
// a `href` and `label`; TypeScript's `NavItem[]` type below just says
// "an array where every entry has exactly these two string fields."

import Link from "next/link";

export type NavItem = {
  href: string;
  label: string;
};

type RoleSideNavProps = {
  roleLabel: string; // e.g. "Tutor", "Admin", "Student"
  items: NavItem[];
};

export default function RoleSideNav({ roleLabel, items }: RoleSideNavProps) {
  return (
    <nav className="mb-8 md:mb-0 md:w-56 md:shrink-0">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-[#6B6560]">
        {roleLabel} area
      </p>
      <ul className="flex flex-wrap gap-2 md:flex-col md:gap-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-[#3D3A37] transition-colors hover:bg-[#F0EBE3] hover:text-[#1B4D3E]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
