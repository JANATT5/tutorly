// src/fonts/index.ts
//
// Fonts loaded via next/font/google — Next.js downloads and self-hosts
// these automatically at build/dev time on your machine (no manual
// font files to place, no folder-path mistakes possible). Still zero
// runtime request to Google's CDN in the browser, and no flash of
// unstyled text, same as next/font/local.

import { Fraunces, Outfit, DM_Mono } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

// Combine into one className string for convenience in app/layout.tsx —
// `className={fontVariables}` on <html> puts all three CSS variables in
// scope for the whole app in one place instead of three separate props.
export const fontVariables = `${fraunces.variable} ${outfit.variable} ${dmMono.variable}`;