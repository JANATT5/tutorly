// components/layout/PageContainer.tsx
//
// Every page in the app wraps its content in this. It just standardizes
// the max-width and side padding so pages don't drift out of alignment
// with each other as different people build different routes.
//
// `children` is typed as React.ReactNode because a container can hold
// literally anything renderable — text, other components, lists, etc.
// That's the TypeScript way of saying "I don't know what's inside, and
// I don't need to — I just need to be able to render it."

import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  /** Set narrow for forms/detail flows (booking, quiz) vs wide for listings/dashboards */
  width?: "narrow" | "default" | "wide";
};

const widthClasses: Record<NonNullable<PageContainerProps["width"]>, string> = {
  narrow: "max-w-2xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
};

export default function PageContainer({ children, width = "default" }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <main className={`mx-auto ${widthClasses[width]} px-6 py-12 md:px-8 md:py-16`}>
        {children}
      </main>
    </div>
  );
}
