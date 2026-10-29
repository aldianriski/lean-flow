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
};

const COLUMNS = ["ts", "tag", "arm", "repo", "task", "trial", "attempt", "graders", "in", "out", "cache-read", "cache-write", "cost-usd", "wall-s", "exit", "pins", "raw"];

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

| ${COLUMNS.join(" | ")} |
|${COLUMNS.map(() => "---").join("|")}|
`;

const cell = (v: unknown) => String(v ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

export function appendRow(logPath: string, row: Row, now = new Date()): string {
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.writeFileSync(logPath, HEADER);
  }
  const t = row.tokens;
  const cells = [now.toISOString(), row.tag, row.arm, row.repo, row.task, row.trial, row.attempt, row.graders, t?.input ?? "none", t?.output ?? "none", t?.cacheRead ?? "none", t?.cacheWrite ?? "none", row.costUsd === null ? "none" : row.costUsd.toFixed(6), row.wallS.toFixed(1), row.exit, JSON.stringify(row.pins), JSON.stringify(row.raw)];
  const line = `| ${cells.map(cell).join(" | ")} |\n`;
  const body = fs.readFileSync(logPath, "utf8");
  fs.appendFileSync(logPath, body.endsWith("\n") ? line : `\n${line}`);
  return line;
}
