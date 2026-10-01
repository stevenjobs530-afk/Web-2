import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves the site under /Web-2/; other hosts (e.g. Vercel previews) set BASE_PATH=/.
const base = process.env.BASE_PATH ?? "/Web-2/";
const root = import.meta.dirname;

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "next/image": resolve(root, "src/shims/next-image.tsx"),
    },
  },
  // The case-study pages were written for Next; they read their base path from this variable.
  define: {
    "process.env.NEXT_PUBLIC_BASE_PATH": JSON.stringify(base.replace(/\/$/, "")),
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        ukRetail: resolve(root, "case-studies/uk-retail/index.html"),
        appleAppStore: resolve(root, "case-studies/apple-app-store/index.html"),
        earlyCareerWellbeing: resolve(root, "case-studies/early-career-wellbeing/index.html"),
        aiWorkflow: resolve(root, "case-studies/ai-assisted-job-workflow/index.html"),
        personalTraining: resolve(root, "personal-projects/personal-training/index.html"),
      },
    },
  },
});
