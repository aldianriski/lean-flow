// Reading the measurement log (docs/research/logs/ab-measurements.md): its table rows, the tag convention the operator and the
// baseline driver write, and the freeze lines in its header. Shared by run-baseline.ts and build-slots.ts; read-only.
import fs from "node:fs";
import { canonicalBytes, sha256 } from "../hash-prereg.ts";
import type { Measure } from "./record.ts";

export type LogRow = {
  ts: string;
  tag: string;
  arm: string;
  repo: string;
  task: string;
  trial: number;
  attempt: number;
  graders: string;
  costUsd: number | null;
  wallS: number;
  exit: string;
  measure: Measure | undefined;
};

/** Split one table line into cells: `\|` is an escaped pipe (record.ts `cell`), every other `|` ends a cell. */
export function splitCells(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;
    if (c === "\\" && line[i + 1] === "|") {
      cur += "|";
      i++;
    } else if (c === "|") {
      cells.push(cur);
      cur = "";
    } else cur += c;
  }
  cells.push(cur);
  return cells.slice(1, -1).map((s) => s.trim()); // the line starts and ends with a pipe
}

/** Every data row of the log, in file order (= run order). A row older than the widest header simply lacks the later columns. */
export function readRows(logPath: string): LogRow[] {
  const lines = fs.readFileSync(logPath, "utf8").split(/\r?\n/);
  const head = lines.findIndex((l) => l.startsWith("| ts |"));
  if (head < 0) throw new Error(`${logPath}: no table header (| ts | ...)`);
  const cols = splitCells(lines[head]!);
  const at = (name: string) => cols.indexOf(name);
  const rows: LogRow[] = [];
  for (const line of lines.slice(head + 2)) {
    if (!line.startsWith("|")) continue;
    const c = splitCells(line);
    const get = (name: string) => c[at(name)] ?? "";
    const m = get("measure");
    const cost = get("cost-usd");
    rows.push({
      ts: get("ts"),
      tag: get("tag"),
      arm: get("arm"),
      repo: get("repo"),
      task: get("task"),
      trial: Number(get("trial")),
      attempt: Number(get("attempt")),
      graders: get("graders"),
      costUsd: cost === "" || cost === "none" ? null : Number(cost),
      wallS: Number(get("wall-s")),
      exit: get("exit"),
      measure: m === "" ? undefined : (JSON.parse(m) as Measure),
    });
  }
  return rows;
}

/** The tag every measured attempt carries: `measured round <r>`, plus ` usage-limit` on an attempt a subscription limit cut short. */
export type Tag = { kind: "measured"; round: number; usageLimit: boolean } | { kind: "smoke" } | { kind: "other" };
export function parseTag(tag: string): Tag {
  const m = /^measured round (\d+)( usage-limit)?$/.exec(tag);
  if (m) return { kind: "measured", round: Number(m[1]), usageLimit: m[2] !== undefined };
  return /^smoke\b/.test(tag) ? { kind: "smoke" } : { kind: "other" };
}
export const measuredTag = (round: number, usageLimit = false) => `measured round ${round}${usageLimit ? " usage-limit" : ""}`;
export const isInfraRow = (r: LogRow): boolean => (r.measure?.attemptClass ?? "").startsWith("infra:");

export type Freeze = { ts: string; sha256: string };
/**
 * The freeze lines of the log header: every blockquote paragraph (consecutive `>` lines before the table) that names a freeze, holds an
 * ISO-8601 UTC instant and a PREREGISTRATION.md sha256 in backticks. The first instant and the first 64-hex value of the paragraph win.
 * Returned in file order; `latestFreeze` is the one with the latest instant.
 */
export function readFreezes(logPath: string): Freeze[] {
  const lines = fs.readFileSync(logPath, "utf8").split(/\r?\n/);
  const head = lines.findIndex((l) => l.startsWith("| ts |"));
  const paragraphs: string[] = [];
  let cur: string[] = [];
  for (const l of lines.slice(0, head < 0 ? lines.length : head)) {
    if (l.startsWith(">")) cur.push(l.replace(/^>\s?/, ""));
    else if (cur.length > 0) {
      paragraphs.push(cur.join(" "));
      cur = [];
    }
  }
  if (cur.length > 0) paragraphs.push(cur.join(" "));
  const out: Freeze[] = [];
  for (const p of paragraphs) {
    if (!/\b(?:frozen|freeze)\b/i.test(p)) continue;
    const ts = /\b(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z)\b/.exec(p)?.[1];
    const sha = /sha256\s+`([0-9a-f]{64})`/.exec(p)?.[1];
    if (ts && sha) out.push({ ts, sha256: sha });
  }
  return out;
}
export const latestFreeze = (fs_: Freeze[]): Freeze | undefined => fs_.reduce<Freeze | undefined>((a, f) => (a === undefined || Date.parse(f.ts) >= Date.parse(a.ts) ? f : a), undefined);

/** sha256 of the pre-registration as it stands now, over the LF form (the hash-prereg.ts convention). */
export const docSha256 = (docPath: string): string => sha256(canonicalBytes(docPath));

/** The analysis arm of a scheduled arm id: the repo prefix removed and upper-cased (`workdoo-a1` -> `A1`); already-analysis ids are unchanged. */
export const analysisArm = (armId: string): string => armId.replace(/^[^-]+-/, "").toUpperCase();
