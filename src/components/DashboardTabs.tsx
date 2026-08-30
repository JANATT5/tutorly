// components/DashboardTabs.tsx
//
// Shared tab bar for the Tutor and Admin dashboards — both were
// previously spread across 6-8 separate routes with a broken/dead nav
// between them (see the removed (tutor)/layout.tsx and (admin)/layout.tsx
// headers, which linked to routes that don't match the real folder
// structure). Consolidating each into one page with in-page tabs
// removes that whole class of dead-link bug, since there's no longer a
// separate route per section to get out of sync.

"use client";

import { useState } from "react";

export type DashboardTab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

export default function DashboardTabs({ tabs }: { tabs: DashboardTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-border">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-forest text-forest"
                  : "border-transparent text-subtle hover:text-fg"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="pt-6">{activeTab?.content}</div>
    </div>
  );
}