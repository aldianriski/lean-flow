import { writeFileSync } from "node:fs";
import { join } from "node:path";

writeFileSync(join(process.cwd(), ".git", "trial-run", "marker.json"), JSON.stringify({
  args: process.argv.slice(2), gateDir: process.env.LF_GATE_DIR, keyPath: process.env.LF_GATE_KEY,
  tmp: process.env.TMP, config: process.env.CLAUDE_CONFIG_DIR, dotenvLoaded: process.env.TRIAL_ENV_SENTINEL ?? null,
}));
console.log(JSON.stringify({ type: "result", subtype: "success", total_cost_usd: 0, result: "fake only" }));
