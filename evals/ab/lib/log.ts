// Reading the measurement log (docs/research/logs/ab-measurements.md): its table rows, the tag convention the operator and the
// baseline driver write, and the freeze lines in its header. Shared by run-baseline.ts and build-slots.ts; read-only.
import fs from "node:fs";
import path from "node:path";
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

/**
 * Every data row of the table, in file order (= run order). The table ends at the first line after its body that does not start
 * with `|`: a report section with tables of its own below it is never read as rows. A row older than the widest header simply lacks
 * the later columns.
 */
export function readRows(logPath: string): LogRow[] {
  const lines = fs.readFileSync(logPath, "utf8").split(/\r?\n/);
  const head = lines.findIndex((l) => l.startsWith("| ts |"));
  if (head < 0) throw new Error(`${logPath}: no table header (| ts | ...)`);
  const cols = splitCells(lines[head]!);
  const at = (name: string) => cols.indexOf(name);
  const rows: LogRow[] = [];
  for (const line of lines.slice(head + 2)) {
    if (!line.startsWith("|")) break;
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

/**
 * The tag of a row. `measured round <r>` is a measured attempt. `measured round <r> void <ts>` is a void row, appended after an attempt a
 * subscription usage limit cut short: it quotes the `ts` of the attempt row it voids and carries that attempt's arm / task / trial / attempt.
 * The log is append-only, so a voided attempt is never edited; the void row is what takes it out of every count.
 */
export type Tag = { kind: "measured"; round: number } | { kind: "void"; round: number; ts: string } | { kind: "smoke" } | { kind: "other" };
export function parseTag(tag: string): Tag {
  const m = /^measured round (\d+)$/.exec(tag);
  if (m) return { kind: "measured", round: Number(m[1]) };
  const v = /^measured round (\d+) void (\S+)$/.exec(tag);
  if (v) return { kind: "void", round: Number(v[1]), ts: v[2]! };
  return /^smoke\b/.test(tag) ? { kind: "smoke" } : { kind: "other" };
}
export const measuredTag = (round: number) => `measured round ${round}`;
export const voidTag = (round: number, ts: string) => `measured round ${round} void ${ts}`;
export const isInfraRow = (r: LogRow): boolean => (r.measure?.attemptClass ?? "").startsWith("infra:");

/** The attempt rows a void row names, and the void rows that name nothing (no measured row with that ts and that arm / task / trial / attempt). */
export function voidIndex(rows: LogRow[]): { voided: Set<LogRow>; orphans: LogRow[] } {
  const voided = new Set<LogRow>();
  const orphans: LogRow[] = [];
  for (const v of rows) {
    const t = parseTag(v.tag);
    if (t.kind !== "void") continue;
    const target = rows.find((r) => r.ts === t.ts && r.arm === v.arm && r.task === v.task && r.trial === v.trial && r.attempt === v.attempt && parseTag(r.tag).kind === "measured");
    if (target) voided.add(target);
    else orphans.push(v);
  }
  return { voided, orphans };
}
/** The measured attempts that count: tagged measured and not voided. */
export const liveRows = (rows: LogRow[]): LogRow[] => {
  const { voided } = voidIndex(rows);
  return rows.filter((r) => parseTag(r.tag).kind === "measured" && !voided.has(r));
};

export type Freeze = { ts: string; sha256: string; carriesFrom?: string };
/**
 * The freeze lines of the log header. A blockquote paragraph (consecutive `>` lines before the table; an empty `>` line or a line without
 * `>` ends it) is a freeze line when it LEADS with the freeze and its instant, and holds the document hash:
 *
 *   > **Pre-registration frozen 2026-11-01T09:00:00Z (any words):** `evals/ab/PREREGISTRATION.md` sha256 `<64 hex>`, any words.
 *
 * i.e. after optional `**` and at most three words, `frozen` or `freeze`, then the ISO-8601 UTC instant; the first `sha256 \`<64 hex>\``
 * of the paragraph is the hash. A later instant elsewhere in the paragraph is never read, except the one after `carries over the rows
 * measured since` (`carriesFrom`, Amendment 5): rows measured under that earlier freeze stay valid under this one. Returned in file order;
 * `latestFreeze` is the one with the latest instant. A missing log has no freeze line.
 */
export function readFreezes(logPath: string): Freeze[] {
  if (!fs.existsSync(logPath)) return [];
  const lines = fs.readFileSync(logPath, "utf8").split(/\r?\n/);
  const head = lines.findIndex((l) => l.startsWith("| ts |"));
  const paragraphs: string[] = [];
  let cur: string[] = [];
  const flush = () => {
    if (cur.length > 0) paragraphs.push(cur.join(" "));
    cur = [];
  };
  for (const l of lines.slice(0, head < 0 ? lines.length : head)) {
    const body = l.replace(/^>\s?/, "");
    if (l.startsWith(">") && body.trim() !== "") cur.push(body);
    else flush();
  }
  flush();
  const out: Freeze[] = [];
  for (const p of paragraphs) {
    const ts = /^\**(?:[A-Za-z-]+ ){0,3}(?:re-)?(?:frozen|freeze)\s+(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z)\b/i.exec(p)?.[1];
    const sha = /sha256\s+`([0-9a-f]{64})`/.exec(p)?.[1];
    const carriesFrom = /\bcarries over the rows measured since\s+(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z)\b/i.exec(p)?.[1];
    if (ts && sha) out.push(carriesFrom ? { ts, sha256: sha, carriesFrom } : { ts, sha256: sha });
  }
  return out;
}
export const latestFreeze = (fs_: Freeze[]): Freeze | undefined => fs_.reduce<Freeze | undefined>((a, f) => (a === undefined || Date.parse(f.ts) >= Date.parse(a.ts) ? f : a), undefined);

/** sha256 of the pre-registration as it stands now, over the LF form (the hash-prereg.ts convention). */
export const docSha256 = (docPath: string): string => sha256(canonicalBytes(docPath));

/** The analysis arm of a scheduled arm id: the repo prefix removed and upper-cased (`workdoo-a1` -> `A1`); already-analysis ids are unchanged. */
export const analysisArm = (armId: string): string => armId.replace(/^[^-]+-/, "").toUpperCase();

/**
 * The freeze preflight every measured start passes (the driver before each slot, `run-trial.ts --measured` before its run): a freeze line
 * exists, its instant has passed, and the pre-registration still has the hash of the latest freeze line.
 */
export function freezeProblem(d: { log: string; prereg: string; now?: (() => number) | undefined }): string | undefined {
  const f = latestFreeze(readFreezes(d.log));
  if (!f) return `no freeze line in the header of ${d.log}: no measured slot may start`;
  if ((d.now ?? Date.now)() < Date.parse(f.ts)) return `the freeze is recorded for ${f.ts}, which has not happened yet`;
  const now = docSha256(d.prereg);
  if (now !== f.sha256) return `${path.basename(d.prereg)} is ${now}, but the latest freeze line (${f.ts}) records ${f.sha256}: it changed after the freeze, or the superseding freeze is not recorded yet`;
  return undefined;
}
