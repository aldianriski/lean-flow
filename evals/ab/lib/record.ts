// The run record: one table row per run, appended to a measurement log under docs/research/logs/.
import fs from "node:fs";
import path from "node:path";

export const DEFAULT_LOG = path.join(import.meta.dir, "..", "..", "..", "docs", "research", "logs", "ab-measurements.md");

export type Row = {
  tag: string;
  arm: string;
  repo: string;
  task: string;
  trial: number;
  attempt: number;
  /** "typecheck:pass,acceptance:fail,..." */
  graders: string;
  tokens: { input: number; output: number; cacheRead: number; cacheWrite: number } | null;
  costUsd: number | null;
  wallS: number;
  exit: string;
  /** every pin the run actually ran under */
  pins: Record<string, unknown>;
  /** the CLI's own usage, per-model usage and sub-agent stats, verbatim */
  raw: unknown;
  /** the grade's verdict; false for a refused G2, a park or a scope breach */
  passed: boolean;
  /** protocol trials: the D9 exception, logged on every use */
  deviation?: string;
  /** protocol trials: scope result, judge verdict + reason, design sha256 */
  g2?: { scope: string; judge: string; reason: string; designSha256: string; judgeUsage?: { input: number; output: number; cacheRead: number; cacheWrite: number; costUsd: number } | undefined } | undefined;
  /** protocol trials: the popup that parked the trial, verbatim */
  park?: unknown;
};

const BASE_COLUMNS = ["ts", "tag", "arm", "repo", "task", "trial", "attempt", "graders", "in", "out", "cache-read", "cache-write", "cost-usd", "wall-s", "exit", "pins", "raw"];
const COLUMNS = [...BASE_COLUMNS, "passed", "deviation", "g2", "park"];
const tableRow = (cols: string[]) => `| ${cols.join(" | ")} |`;

const HEADER = `---
owner: Maintainer
last_updated: 2026-10-29
update_trigger: an A/B trial run is appended (evals/ab, run by hand)
status: active
id: ab-measurements-log
tags: [tooling, process]
domain: governance
related: [EPIC-023]
---

# A/B trial measurements -- run log

> Append-only. One row per run of \`evals/ab/run-trial.ts\`, written by the harness, never by hand. Rows tagged
> \`smoke\` exercise the harness on a fixture and are **not measurements**. Tokens and cost come from the CLI's own
> \`result\` event (\`modelUsage\` summed over every model); \`raw\` keeps its \`usage\`, \`modelUsage\` and \`subagent_stats\`.
> A \`usage-missing\` row is invalid: the CLI reported no usage, and the trial stops for an owner ruling.

${tableRow(COLUMNS)}
|${COLUMNS.map(() => "---").join("|")}|
`;

const cell = (v: unknown) => String(v ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

export function appendRow(logPath: string, row: Row, now = new Date()): string {
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.writeFileSync(logPath, HEADER);
  }
  // a log written before the protocol columns existed gets its header widened; earlier rows stay as they are
  const sep = (cols: string[]) => `|${cols.map(() => "---").join("|")}|`;
  const text = fs.readFileSync(logPath, "utf8");
  const old = new RegExp(`(^|\\n)${tableRow(BASE_COLUMNS).replace(/[|]/g, "\\|")}(\\r?\\n)${sep(BASE_COLUMNS).replace(/[|]/g, "\\|")}(?=\\r?\\n)`);
  if (old.test(text)) fs.writeFileSync(logPath, text.replace(old, (_m, a, nl) => `${a}${tableRow(COLUMNS)}${nl}${sep(COLUMNS)}`));
  const t = row.tokens;
  const cells = [now.toISOString(), row.tag, row.arm, row.repo, row.task, row.trial, row.attempt, row.graders, t?.input ?? "none", t?.output ?? "none", t?.cacheRead ?? "none", t?.cacheWrite ?? "none", row.costUsd === null ? "none" : row.costUsd.toFixed(6), row.wallS.toFixed(1), row.exit, JSON.stringify(row.pins), JSON.stringify(row.raw), row.passed, row.deviation ?? "", row.g2 ? JSON.stringify(row.g2) : "", row.park === undefined ? "" : JSON.stringify(row.park)];
  const line = `| ${cells.map(cell).join(" | ")} |\n`;
  const body = fs.readFileSync(logPath, "utf8");
  fs.appendFileSync(logPath, body.endsWith("\n") ? line : `\n${line}`);
  return line;
}
