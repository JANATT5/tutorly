// components/Dropdown.tsx
//
// Small reusable select-style dropdown used by Browse's Curriculum /
// Language / Rating / Price filters and its Sort control — a plain
// <select> would work functionally, but doesn't match the pill-button
// look those filters already had. Closes on selecting an option or on
// clicking anywhere outside it.

"use client";

import { useEffect, useRef, useState } from "react";

export type DropdownOption<T extends string> = {
  value: T;
  label: string;
};

type DropdownProps<T extends string> = {
  label: string;
  options: DropdownOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
  /** When true, shows "Label: Selected" instead of just "Label" once a non-default option is picked. */
  showSelectedInline?: boolean;
};

export default function Dropdown<T extends string>({
  label,
  options,
  selected,
  onSelect,
  showSelectedInline = false,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === selected);
  const buttonLabel =
    showSelectedInline && selectedOption ? `${label}: ${selectedOption.label}` : label;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1 rounded-full border border-border bg-white px-3.5 py-1.5 text-sm text-body transition-colors hover:border-amber"
      >
        {buttonLabel}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-20 mt-2 min-w-[10rem] rounded-xl border border-border bg-white py-1.5 shadow-lg"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === selected}
                onClick={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                  option.value === selected ? "font-semibold text-forest" : "text-fg"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
