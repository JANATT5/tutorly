// Ambient module declaration for plain (non-module) CSS side-effect
// imports, e.g. `import "./globals.css";` in app/layout.tsx. Next.js's
// own shipped types only declare `*.module.css` (CSS Modules) — this
// covers the plain stylesheet import Tailwind's setup uses.
declare module "*.css";
