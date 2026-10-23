// @tempo-owned: tailwind-v3-host-config
import type { Config } from "tailwindcss";

// Tempo-owned Tailwind v3 config for the canvas host. Content globs are
// relative to this tempo/ directory (Tailwind v3 resolves content against the
// build cwd, which is tempo/).
const config: Config = {
  content: [
    "../packages/**/*.{ts,tsx,js,jsx,mdx}",
    "./designs/**/*.{ts,tsx,js,jsx,mdx}",
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
  ],
};

export default config;
