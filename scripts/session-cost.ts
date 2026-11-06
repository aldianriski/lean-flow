// Where a repo's Claude Code spend goes, from its session transcripts (docs/research/router-mode.md, TASK-609).
//   bun scripts/session-cost.ts <transcripts-dir> [days=14]
// <transcripts-dir> is ~/.claude/projects/<encoded-repo-path>. Prints aggregates only, never transcript content.
// USD comes from the harness's cost-state rows; prices are recovered per model from those rows by least squares.
// A resumed session's cost row can undercount, so main-thread USD is tokens times recovered price, not the row.
// A session with 25% or more of its Bash calls on the A/B harness is classed research: a heuristic, stated in the output.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

type ThreadUse = { read: number; write: number; out: number; turns: number; contexts: number[] };
type Session = { id: string; date: string; usd: number; main: Record<string, ThreadUse>; abBash: number; bash: number; commits: number; sprints: Set<string> };
type ModelRows = { tokens: number[][]; usd: number[] };

const dir = process.argv[2];
if (!dir) { console.error("usage: bun scripts/session-cost.ts <transcripts-dir> [days=14]"); process.exit(2); }
const days = Number(process.argv[3] ?? 14);
if (!Number.isFinite(days) || days <= 0) { console.error(`days must be a positive number, got ${process.argv[3]}`); process.exit(2); }
const cutoff = Date.now() - days * 864e5;

/** USD per million tokens for [read, write, output], fitted to one model's cost rows. */
function fitPrices(tokens: number[][], usd: number[]): number[] {
  const a = [0, 1, 2].map(() => [0, 0, 0, 0]);
  tokens.forEach((row, i) => { for (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) a[r]![c]! += (row[r]! * row[c]!) / 1e12; a[r]![3]! += (row[r]! * usd[i]!) / 1e6; } });
  for (let i = 0; i < 3; i++) {
    let p = i; for (let k = i + 1; k < 3; k++) if (Math.abs(a[k]![i]!) > Math.abs(a[p]![i]!)) p = k;
    [a[i], a[p]] = [a[p]!, a[i]!];
    for (let k = i + 1; k < 3; k++) { const f = a[k]![i]! / a[i]![i]!; for (let c = i; c < 4; c++) a[k]![c]! -= f * a[i]![c]!; }
  }
  const x = [0, 0, 0];
  for (let i = 2; i >= 0; i--) { let s = a[i]![3]!; for (let c = i + 1; c < 3; c++) s -= a[i]![c]! * x[c]!; x[i] = s / a[i]![i]!; }
  return x;
}

const sessions: Session[] = [];
const byModel: Record<string, ModelRows> = {};
for (const name of readdirSync(dir)) {
  if (!name.endsWith(".jsonl")) continue;
  const file = join(dir, name), stat = statSync(file);
  if (stat.mtimeMs < cutoff) continue;
  let cost: any = null, abBash = 0, bash = 0, commits = 0;
  const seen = new Set<string>(), main: Record<string, ThreadUse> = {}, sprints = new Set<string>();
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line) continue;
    if (line.includes('"cost-state"')) {
      try { const r = JSON.parse(line); if (r.type === "cost-state" && (!cost || r.totalCostUSD >= cost.totalCostUSD)) cost = r; } catch { /* a torn last line */ }
      continue;
    }
    if (!line.includes('"assistant"')) continue;
    let r: any; try { r = JSON.parse(line); } catch { continue; }
    if (r.type !== "assistant") continue;
    const m = r.message;
    if (m?.id && m.usage && !seen.has(m.id)) {
      seen.add(m.id);
      const t = (main[m.model ?? "?"] ??= { read: 0, write: 0, out: 0, turns: 0, contexts: [] });
      const read = m.usage.cache_read_input_tokens ?? 0, write = m.usage.cache_creation_input_tokens ?? 0;
      t.read += read; t.write += write; t.out += m.usage.output_tokens ?? 0; t.turns++; t.contexts.push(read + write);
    }
    if (Array.isArray(m?.content)) for (const b of m.content) if (b.type === "tool_use" && b.name === "Bash") {
      bash++;
      const c = String(b.input?.command ?? "");
      if (/evals\/ab|run-baseline|run-trial|run-dev|ab-measurements|schedule-/.test(c)) abBash++;
      const g = c.match(/git[^\n]*commit[\s\S]{0,200}?sprint\((\d+)\)/);
      if (g) { commits++; sprints.add(g[1]!); }
    }
  }
  if (!cost) continue; // a session still running has no cost row yet
  for (const [model, v] of Object.entries(cost.modelUsage ?? {}) as [string, any][]) {
    const rows = (byModel[model] ??= { tokens: [], usd: [] });
    rows.tokens.push([v.cacheReadInputTokens, v.cacheCreationInputTokens, v.outputTokens]); rows.usd.push(v.costUSD);
  }
  sessions.push({ id: name.slice(0, 8), date: new Date(stat.mtimeMs).toISOString().slice(0, 10), usd: cost.totalCostUSD, main, abBash, bash, commits, sprints });
}
if (sessions.length === 0) { console.error(`no session with a cost row in ${dir} within ${days} days`); process.exit(1); }

const price: Record<string, number[]> = {};
for (const [model, rows] of Object.entries(byModel)) {
  if (rows.tokens.length < 3 || rows.usd.reduce((a, b) => a + b, 0) <= 5) continue; // too little to fit
  price[model] = fitPrices(rows.tokens, rows.usd);
  console.log(`${model} USD/MTok read ${price[model]![0]!.toFixed(2)}, write ${price[model]![1]!.toFixed(2)}, output ${price[model]![2]!.toFixed(2)} (${rows.tokens.length} sessions)`);
}

const kinds: Record<string, { n: number; usd: number; main: number; read: number; write: number; out: number; turns: number; readTokens: number }> = {};
const bands = [100e3, 200e3, 400e3, Infinity], bandTurns = [0, 0, 0, 0], bandUsd = [0, 0, 0, 0];
let unpriced = 0;
console.log("\ndate       session    USD  main$ turns read/turn kind       sprints");
for (const s of sessions.sort((a, b) => a.date.localeCompare(b.date))) {
  const kind = s.abBash / Math.max(1, s.bash) >= 0.25 ? "research" : s.commits > 0 ? "delivery" : "other";
  const k = (kinds[kind] ??= { n: 0, usd: 0, main: 0, read: 0, write: 0, out: 0, turns: 0, readTokens: 0 });
  let mainUsd = 0, turns = 0, readTokens = 0;
  for (const [model, t] of Object.entries(s.main)) {
    const p = price[model];
    if (!p) { unpriced += t.turns; continue; }
    const read = (t.read * p[0]!) / 1e6, write = (t.write * p[1]!) / 1e6, out = (t.out * p[2]!) / 1e6;
    mainUsd += read + write + out; k.read += read; k.write += write; k.out += out; turns += t.turns; readTokens += t.read;
    for (const c of t.contexts) { const i = bands.findIndex((b) => c < b); bandTurns[i]!++; bandUsd[i]! += (c * p[0]!) / 1e6; }
  }
  k.n++; k.usd += s.usd; k.main += mainUsd; k.turns += turns; k.readTokens += readTokens;
  console.log(`${s.date} ${s.id} ${s.usd.toFixed(1).padStart(6)} ${mainUsd.toFixed(1).padStart(6)} ${String(turns).padStart(5)} ${(readTokens / Math.max(1, turns) / 1e3).toFixed(0).padStart(8)}k ${kind.padEnd(10)} ${[...s.sprints].join(",")}`);
}
console.log("");
for (const [kind, k] of Object.entries(kinds)) {
  console.log(`${kind}: ${k.n} sessions, ${k.usd.toFixed(0)} USD by cost rows; main thread ${k.main.toFixed(0)} USD (reads ${k.read.toFixed(0)}, writes ${k.write.toFixed(0)}, output ${k.out.toFixed(0)}), ${k.turns} turns, ${(k.readTokens / Math.max(1, k.turns) / 1e3).toFixed(0)}k read per turn`);
}
const turnsAll = bandTurns.reduce((a, b) => a + b, 0), usdAll = bandUsd.reduce((a, b) => a + b, 0);
const label = ["<100k", "100-200k", "200-400k", "400k+"];
console.log(`\nmain-thread turns and cache-read USD by context size: ${label.map((l, i) => `${l} ${(100 * bandTurns[i]! / Math.max(1, turnsAll)).toFixed(0)}% / ${(100 * bandUsd[i]! / Math.max(1e-9, usdAll)).toFixed(0)}%`).join(" · ")}`);
console.log(`classing is a heuristic; ${unpriced} main turns had no fitted price and are left out`);
