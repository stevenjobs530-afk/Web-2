// Builds the Oriental Renaissance site (Ding Fang's signed editions, English + 中文) into dist/ding-fang/.
// Runs after `vite build`, with the same BASE_PATH as the portfolio ("/" on Vercel and Netlify, "/Web-2/" on GitHub Pages).
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = (process.env.BASE_PATH ?? "/Web-2/").replace(/\/?$/, "/");

execFileSync(process.execPath, [join(root, "ding-fang/src/build.mjs")], {
  stdio: "inherit",
  env: {
    ...process.env,
    DING_BASE: `${base}ding-fang`,
    DING_OUT: join(root, "dist/ding-fang"),
    DING_PORTFOLIO: `${base}#ding-fang`,
  },
});
