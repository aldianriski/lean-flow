// evals/run-store-writers-fixtures.ts -- retained fixtures for the two work-item store WRITERS,
// /task-decomposer and /triage (SPRINT-107 T2 · TASK-361). Run by Bun. Tier X (ADR-029): retained
// fixture, no discrimination proof owed.
//
// WHAT IS UNDER TEST. The skills are prose; an agent follows them. So this file holds a reference
// implementation of each rule the two skills state -- the id derivation and file shape from
// skills/task-decomposer/references/task-file.md, the derived order and in-place edit from
// skills/triage/SKILL.md § Order / § Applying -- and pins each to fixtures. A rule rewritten in a
// SKILL.md without this file following is drift a reviewer can see in one diff.
//
// POPULATION (L-186). The id cases vary the SELECTION, not only the verdict: the maximum sits in a
// folder other than the one being written (done/, cancel/), in a four-digit id a string sort
// misorders, and in a worktree copy that must NOT be counted (L-170). The order case the owner
// ruling (SPRINT-107 G2 A2) turns on is a depends-on that overrides priority.
//
// Usage:
//   bun evals/run-store-writers-fixtures.ts                 run every fixture case
//   bun evals/run-store-writers-fixtures.ts --check <root>  validate <root>/docs/work, print the
//                                                           next id and the derived backlog order
//   bun evals/run-store-writers-fixtures.ts --write <root>  write the retained EPIC-017 breakdown
//                                                           into <root>/docs/work/backlog/ (a
//                                                           SCRATCH store -- never this repo's)
// Verdict line: `store-writers-fixtures: N pass, M fail` (M is the verdict, L-120).

import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FIX = fileURLToPath(new URL("fixtures/store-writers/", import.meta.url));

export const STATUS_FOLDERS = ["backlog", "todo", "in_progress", "review", "done", "cancel"] as const;
const CLOSED = new Set(["done", "cancel"]);
const FILENAME_RE = /^TASK-(\d{3,})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const REQUIRED = ["id", "title", "priority", "size", "risk", "autonomy", "class", "tier", "authority", "origin", "state", "depends-on"];
const VALUES: Record<string, RegExp> = {
  priority: /^P[0-3]$/,
  size: /^(S|M|L)$/,
  risk: /^(low|med|high)$/,
  autonomy: /^(HITL|AFK)$/,
  class: /^(decision|execution|mechanical-ingest)$/,
  tier: /^(G|X|P)$/,
  authority: /^J[0-2]$/,
  origin: /^(decomposer|close-retro|triage-bug|manual)$/,
  state: /^(ready|needs-info|blocked)$/,
};
const SECTIONS = ["Done when", "Touches", "Assumes", "Tracker"];

// --- layout (existence only, never content -- ADR-046) -------------------------------------------

export function layout(root: string): "v1" | "v2" | "mixed" | "none" {
  const todo = existsSync(join(root, "TODO.md"));
  const work = existsSync(join(root, "docs", "work"));
  return todo && work ? "mixed" : todo ? "v1" : work ? "v2" : "none";
}

// --- task files ------------------------------------------------------------------------------------

export interface TaskFile {
  readonly rel: string; // docs/work/<folder>/<name>
  readonly folder: string;
  readonly name: string;
  readonly fm: Record<string, string>;
  readonly body: string;
  readonly deps: string[];
}

function parse(content: string): { fm: Record<string, string>; body: string } {
  const text = content.replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: text };
  const fm: Record<string, string> = {};
  for (const line of (m[1] ?? "").split("\n")) {
    const kv = line.match(/^([a-z-]+):\s*(.*)$/);
    if (kv?.[1] !== undefined) fm[kv[1]] = (kv[2] ?? "").replace(/\s+#.*$/, "").trim();
  }
  return { fm, body: m[2] ?? "" };
}

function depList(v: string | undefined): string[] {
  if (!v) return [];
  return v.replace(/^\[|\]$/g, "").split(",").map((s) => s.trim()).filter((s) => /^TASK-\d+$/.test(s));
}

/** Every `docs/work/<dir>/*.md` under ROOT's own store -- rooted, so `.claude/worktrees/` is never walked. */
export function loadStore(root: string): TaskFile[] {
  const work = join(root, "docs", "work");
  if (!existsSync(work)) return [];
  const out: TaskFile[] = [];
  for (const folder of readdirSync(work)) {
    const dir = join(work, folder);
    if (!statSync(dir).isDirectory()) continue;
    for (const name of readdirSync(dir).sort()) {
      if (!name.endsWith(".md")) continue;
      const { fm, body } = parse(readFileSync(join(dir, name), "utf8"));
      out.push({ rel: `docs/work/${folder}/${name}`, folder, name, fm, body, deps: depList(fm["depends-on"]) });
    }
  }
  return out;
}

const num = (id: string) => parseInt(id.replace(/^TASK-/, ""), 10);
const fileId = (name: string) => name.match(/^TASK-(\d+)-/)?.[1];

// --- next id (task-file.md § The next id) ---------------------------------------------------------

export function nextId(root: string): { max: number; next: string; seen: number } {
  let max = 0;
  let seen = 0;
  for (const t of loadStore(root)) {
    if (!(STATUS_FOLDERS as readonly string[]).includes(t.folder)) continue;
    for (const raw of [fileId(t.name), t.fm.id?.replace(/^TASK-/, "")]) {
      if (raw && /^\d+$/.test(raw)) max = Math.max(max, parseInt(raw, 10));
    }
    seen++;
  }
  return { max, next: `TASK-${String(max + 1).padStart(3, "0")}`, seen };
}

// --- validation (task-file.md § File shape + docs/work/README.md) ---------------------------------

export function validate(root: string): string[] {
  const findings: string[] = [];
  const all = loadStore(root);
  const byId = new Map<string, TaskFile[]>();
  for (const t of all) {
    const tag = `${t.rel}`;
    if (!(STATUS_FOLDERS as readonly string[]).includes(t.folder)) {
      findings.push(`folder-not-status ${tag} -- '${t.folder}/' is not one of the six status folders (readiness is state:, never a folder)`);
    }
    if (!FILENAME_RE.test(t.name)) findings.push(`filename ${tag} -- not TASK-NNN-kebab-slug.md`);
    const id = t.fm.id ?? "";
    if (fileId(t.name) && id && id !== `TASK-${fileId(t.name)}`) findings.push(`id-mismatch ${tag} -- id: ${id}`);
    if ("status" in t.fm) findings.push(`status-field ${tag} -- status lives in the folder only`);
    for (const f of REQUIRED) {
      const v = t.fm[f];
      const re = VALUES[f];
      if (v === undefined || v === "") findings.push(`missing-field:${f} ${tag}`);
      else if (re && !re.test(v)) findings.push(`bad-value:${f} ${tag} -- '${v}'`);
    }
    for (const s of SECTIONS) if (!new RegExp(`^## ${s}\\s*$`, "m").test(t.body)) findings.push(`missing-section:${s} ${tag}`);
    if (!/^- \[[ xX]\] /m.test(section(t.body, "Done when"))) findings.push(`no-done-when-box ${tag}`);
    const assumes = section(t.body, "Assumes");
    if (t.fm.state === "needs-info" && !/\*\*open:\*\*/.test(assumes)) findings.push(`needs-info-no-question ${tag}`);
    if (t.fm.state === "blocked" && t.deps.length === 0 && !/\*\*blocked-by:\*\*/.test(assumes)) findings.push(`blocked-no-blocker ${tag}`);
    if (id) byId.set(id, [...(byId.get(id) ?? []), t]);
  }
  for (const [id, ts] of byId) if (ts.length > 1) findings.push(`duplicate-id ${id} -- ${ts.map((t) => t.rel).join(" + ")}`);
  for (const t of all) for (const d of t.deps) if (!byId.has(d)) findings.push(`dangling-depends ${t.rel} -- ${d} has no file`);
  return findings;
}

function section(body: string, name: string): string {
  const m = body.replace(/\r\n/g, "\n").match(new RegExp(`^## ${name}\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"));
  return m?.[1] ?? "";
}

// --- derived order (triage § Order; SPRINT-107 G2 ruling A2) --------------------------------------

export function deriveOrder(tasks: readonly { id: string; priority: string; deps: string[] }[]): { order: string[]; cycle: string[] } {
  const ids = new Set(tasks.map((t) => t.id));
  const prio = new Map(tasks.map((t) => [t.id, parseInt(t.priority.replace(/^P/, ""), 10)]));
  const deps = new Map(tasks.map((t) => [t.id, t.deps.filter((d) => ids.has(d))])); // in-set edges only
  // Effective priority: a blocker sorts at the highest priority of anything waiting on it (transitive).
  const eff = new Map(prio);
  for (let changed = true, guard = 0; changed && guard <= tasks.length; guard++) {
    changed = false;
    for (const [id, ds] of deps) for (const d of ds) if (eff.get(id)! < eff.get(d)!) { eff.set(d, eff.get(id)!); changed = true; }
  }
  const cmp = (a: string, b: string) => eff.get(a)! - eff.get(b)! || num(a) - num(b);
  const done = new Set<string>();
  const order: string[] = [];
  while (order.length < ids.size) {
    const ready = [...ids].filter((id) => !done.has(id) && deps.get(id)!.every((d) => done.has(d)));
    const first = ready.sort(cmp)[0];
    if (first === undefined) return { order, cycle: [...ids].filter((id) => !done.has(id)).sort((a, b) => num(a) - num(b)) };
    done.add(first);
    order.push(first);
  }
  return { order, cycle: [] };
}

export function backlogOrder(root: string): { order: string[]; cycle: string[] } {
  const all = loadStore(root);
  return deriveOrder(all.filter((t) => t.folder === "backlog").map((t) => ({ id: t.fm.id ?? "", priority: t.fm.priority ?? "P3", deps: t.deps })));
}

// --- triage in-place edit (triage § Applying) ------------------------------------------------------

export function applyTriage(content: string, change: { priority?: string; state?: string }): string {
  let out = content;
  for (const [k, v] of Object.entries(change)) {
    if (v === undefined) continue;
    const re = new RegExp(`^${k}:.*$`, "m");
    if (!re.test(out)) throw new Error(`no ${k}: line to edit`);
    out = out.replace(re, `${k}: ${v}`);
  }
  return out;
}

// --- writer (task-file.md § File shape) -----------------------------------------------------------

interface Slice {
  slug: string; title: string; priority: string; size: string; risk: string; autonomy: string;
  class: string; tier: string; authority: string; state: string; deps: number[];
  done: string[]; touches: string; assumes: string[]; tracker: string;
}

export function renderTask(id: string, s: Slice, depIds: string[], epic?: string): string {
  const fm = [
    "---", `id: ${id}`, `title: "${s.title.replace(/"/g, '\\"')}"`, ...(epic ? [`epic: ${epic}`] : []),
    `priority: ${s.priority}`, `size: ${s.size}`, `risk: ${s.risk}`, `autonomy: ${s.autonomy}`, `class: ${s.class}`,
    `tier: ${s.tier}`, `authority: ${s.authority}`, "origin: decomposer", `state: ${s.state}`,
    `depends-on: [${depIds.join(", ")}]`, "---",
  ];
  return [
    ...fm, "", `# ${id} — ${s.title}`, "", "## Done when", "", ...s.done.map((d) => `- [ ] ${d}`), "",
    "## Touches", "", s.touches, "", "## Assumes", "", ...s.assumes.map((a) => (a === "none" ? "none" : `- ${a}`)), "",
    "## Tracker", "", s.tracker, "",
  ].join("\n");
}

export function writeBreakdown(root: string, slices: Slice[], epic?: string): string[] {
  const kind = layout(root);
  if (kind === "v1" || kind === "mixed") throw new Error(`refused: ${kind} tree -- run /lean-doc-generator migrate`);
  const first = nextId(root).max + 1;
  const ids = slices.map((_, i) => `TASK-${String(first + i).padStart(3, "0")}`);
  const dir = join(root, "docs", "work", "backlog");
  mkdirSync(dir, { recursive: true });
  const written: string[] = [];
  slices.forEach((s, i) => {
    if (s.deps.some((d) => d - 1 >= i)) throw new Error(`${s.slug}: a blocker must come first`);
    const name = `${ids[i]}-${s.slug}.md`;
    if (!FILENAME_RE.test(name)) throw new Error(`bad filename ${name}`);
    const p = join(dir, name);
    if (existsSync(p)) throw new Error(`refusing to overwrite ${name}`);
    writeFileSync(p, renderTask(ids[i]!, s, s.deps.map((d) => ids[d - 1]!), epic));
    written.push(`docs/work/backlog/${name}`);
  });
  return written;
}

// --- fixture plumbing ------------------------------------------------------------------------------

let pass = 0;
let fail = 0;
const tmps: string[] = [];

function report(name: string, ok: boolean, detail: string) {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name} -- ${detail}`);
}
function store(): string {
  const d = mkdtempSync(join(tmpdir(), "store-writers-"));
  tmps.push(d);
  mkdirSync(join(d, "docs", "work"), { recursive: true });
  return d;
}
const TEMPLATE = () => readFileSync(join(FIX, "task-template.md"), "utf8").replace(/\r\n/g, "\n");
function task(root: string, folder: string, id: string, o: { priority?: string; state?: string; deps?: string[]; assumes?: string; slug?: string; mutate?: (s: string) => string } = {}) {
  let s = TEMPLATE()
    .replaceAll("{{ID}}", id)
    .replaceAll("{{PRIORITY}}", o.priority ?? "P2")
    .replaceAll("{{STATE}}", o.state ?? "ready")
    .replaceAll("{{DEPS}}", (o.deps ?? []).join(", "))
    .replaceAll("{{ASSUMES}}", o.assumes ?? "none");
  if (o.mutate) {
    const before = s;
    s = o.mutate(s);
    if (s === before) throw new Error(`fixture mutation did not land for ${id}`);
  }
  const dir = join(root, "docs", "work", folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${id}-${o.slug ?? "fixture"}.md`), s);
}
const set = (a: string[]) => [...new Set(a.map((f) => f.split(" ")[0]))].sort().join(",");
function expectFindings(name: string, root: string, want: string[]) {
  const got = set(validate(root));
  const exp = [...want].sort().join(",");
  report(name, got === exp, got === exp ? `findings {${got || "none"}}` : `want {${exp || "none"}} got {${got || "none"}}`);
}

function runFixtures() {
  // --- id derivation ----------------------------------------------------------------------------
  { const r = store(); report("id-empty-store", nextId(r).next === "TASK-001", `next ${nextId(r).next} (want TASK-001)`); }
  { const r = store(); task(r, "backlog", "TASK-004"); task(r, "backlog", "TASK-007");
    report("id-backlog-only", nextId(r).next === "TASK-008", `next ${nextId(r).next} (want TASK-008)`); }
  { const r = store(); task(r, "backlog", "TASK-010"); task(r, "done", "TASK-050");
    report("id-max-in-done (selection)", nextId(r).next === "TASK-051", `max sits in done/, not backlog/ -- next ${nextId(r).next} (want TASK-051)`); }
  { const r = store(); task(r, "backlog", "TASK-010"); task(r, "todo", "TASK-020"); task(r, "cancel", "TASK-061");
    report("id-max-in-cancel (selection)", nextId(r).next === "TASK-062", `a cancelled id is still taken -- next ${nextId(r).next} (want TASK-062)`); }
  { const r = store(); task(r, "done", "TASK-999"); task(r, "backlog", "TASK-1000");
    report("id-numeric-not-lexical (selection)", nextId(r).next === "TASK-1001", `TASK-1000 > TASK-999 -- next ${nextId(r).next} (want TASK-1001)`); }
  { const r = store(); task(r, "backlog", "TASK-012");
    const wt = join(r, ".claude", "worktrees", "agent-x"); mkdirSync(join(wt, "docs", "work"), { recursive: true }); task(wt, "backlog", "TASK-950");
    report("id-worktree-excluded (selection)", nextId(r).next === "TASK-013", `a worktree copy holding TASK-950 is not a row -- next ${nextId(r).next} (want TASK-013)`); }
  { const r = store(); writeFileSync(join(r, "TODO.md"), "- [ ] TASK-900 — legacy\n");
    let refused = "";
    try { writeBreakdown(r, [], undefined); } catch (e) { refused = String((e as Error).message); }
    report("layout-mixed-refused", layout(r) === "mixed" && /refused: mixed/.test(refused), `layout ${layout(r)}; writer: ${refused || "did NOT refuse"}`); }
  { const r = mkdtempSync(join(tmpdir(), "store-writers-")); tmps.push(r); writeFileSync(join(r, "TODO.md"), "x\n");
    let refused = ""; try { writeBreakdown(r, [], undefined); } catch (e) { refused = String((e as Error).message); }
    report("layout-v1-refused", /refused: v1/.test(refused), `writer: ${refused || "did NOT refuse"}`); }

  // --- derived order (A2: priority -> topological over depends-on -> id; no order file) ----------
  const ord = (ts: { id: string; priority: string; deps?: string[] }[]) => deriveOrder(ts.map((t) => ({ ...t, deps: t.deps ?? [] })));
  { const o = ord([{ id: "TASK-001", priority: "P2" }, { id: "TASK-002", priority: "P0" }, { id: "TASK-003", priority: "P1" }]).order.join(",");
    report("order-priority", o === "TASK-002,TASK-003,TASK-001", o); }
  { const o = ord([{ id: "TASK-001", priority: "P0", deps: ["TASK-002"] }, { id: "TASK-002", priority: "P3" }, { id: "TASK-003", priority: "P1" }]).order.join(",");
    report("order-depends-overrides-priority", o === "TASK-002,TASK-001,TASK-003", `P0 TASK-001 waits on P3 TASK-002, which is pulled ahead of P1 TASK-003 -- ${o}`); }
  { const o = ord([{ id: "TASK-010", priority: "P0", deps: ["TASK-011"] }, { id: "TASK-011", priority: "P2", deps: ["TASK-012"] }, { id: "TASK-012", priority: "P3" }, { id: "TASK-013", priority: "P1" }]).order.join(",");
    report("order-transitive-pull", o === "TASK-012,TASK-011,TASK-010,TASK-013", o); }
  { const o = ord([{ id: "TASK-100", priority: "P1" }, { id: "TASK-099", priority: "P1" }]).order.join(",");
    report("order-id-numeric-tiebreak", o === "TASK-099,TASK-100", o); }
  { const r = store(); task(r, "backlog", "TASK-001", { priority: "P1", deps: ["TASK-005"] }); task(r, "backlog", "TASK-002", { priority: "P2", deps: ["TASK-006"] });
    task(r, "done", "TASK-005", { priority: "P3" }); task(r, "todo", "TASK-006", { priority: "P0" }); task(r, "backlog", "TASK-003", { priority: "P3" });
    const o = backlogOrder(r).order.join(",");
    report("order-deps-outside-backlog (selection)", o === "TASK-001,TASK-002,TASK-003", `done/ and todo/ deps are not in the ordered set -- ${o}`); }
  { const c = ord([{ id: "TASK-001", priority: "P1", deps: ["TASK-002"] }, { id: "TASK-002", priority: "P1", deps: ["TASK-001"] }, { id: "TASK-003", priority: "P2" }]);
    report("order-cycle-reported", c.cycle.join(",") === "TASK-001,TASK-002" && c.order.join(",") === "TASK-003", `cycle {${c.cycle}} order {${c.order}}`); }

  // --- validation: the fields that must survive, readiness never a folder ------------------------
  { const r = store(); task(r, "backlog", "TASK-001"); task(r, "backlog", "TASK-002", { state: "needs-info", assumes: "- **open:** which tokenizer?" });
    task(r, "backlog", "TASK-003", { state: "blocked", deps: ["TASK-001"] }); task(r, "backlog", "TASK-004", { state: "blocked", assumes: "- **blocked-by:** owner ruling" });
    task(r, "done", "TASK-005");
    expectFindings("valid-store", r, []); }
  const one = (name: string, want: string, o: Parameters<typeof task>[3], folder = "backlog") => {
    const r = store(); task(r, folder, "TASK-001", o); expectFindings(name, r, [want]);
  };
  one("must-fail status-field", "status-field", { mutate: (s) => s.replace("state: ready", "state: ready\nstatus: backlog") });
  one("must-fail readiness-folder", "folder-not-status", {}, "blocked");
  one("must-fail missing-origin", "missing-field:origin", { mutate: (s) => s.replace("origin: decomposer\n", "") });
  one("must-fail missing-authority", "missing-field:authority", { mutate: (s) => s.replace("authority: J1\n", "") });
  one("must-fail bad-state", "bad-value:state", { state: "in-review" });
  one("must-fail filename", "filename", { slug: "Fixture Task" });
  one("must-fail id-mismatch", "id-mismatch", { mutate: (s) => s.replace("id: TASK-001", "id: TASK-002") });
  one("must-fail missing-assumes", "missing-section:Assumes", { mutate: (s) => s.replace("## Assumes\n\nnone\n\n", "") });
  one("must-fail needs-info-no-question", "needs-info-no-question", { state: "needs-info" });
  one("must-fail blocked-no-blocker", "blocked-no-blocker", { state: "blocked" });
  one("must-fail dangling-depends", "dangling-depends", { deps: ["TASK-077"] });
  { const r = store(); task(r, "backlog", "TASK-001"); task(r, "done", "TASK-001", { slug: "older" });
    expectFindings("must-fail duplicate-id-across-folders (selection)", r, ["duplicate-id"]); }

  // --- triage edits in place, everything else byte-identical --------------------------------------
  { const r = store(); task(r, "backlog", "TASK-001", { assumes: "- a load-bearing assumption" });
    const p = join(r, "docs/work/backlog/TASK-001-fixture.md"); const before = readFileSync(p, "utf8");
    const edited = applyTriage(before, { priority: "P0", state: "needs-info" });
    const a = before.split("\n"), b = edited.split("\n");
    const changed = b.length === a.length ? b.filter((l, i) => l !== a[i]).length : -1;
    const after = edited.replace("- a load-bearing assumption", "- a load-bearing assumption\n- **open:** fixture question");
    const kept = ["authority: J1", "origin: decomposer", "- a load-bearing assumption", "- [ ] The fixture outcome for TASK-001 is observable."].every((l) => after.includes(l));
    writeFileSync(p, after);
    const ok = changed === 2 && kept && /priority: P0/.test(after) && /state: needs-info/.test(after) && validate(r).length === 0 && existsSync(p);
    report("triage-edit-preserves", ok, `priority+state rewritten in place (${changed} line(s) differ, want 2); authority/origin/assumes/done-when intact; file stays in backlog/`); }

  // --- a large breakdown lands as one file per task, no container grows --------------------------
  { const r = store(); task(r, "done", "TASK-040");
    const d = JSON.parse(readFileSync(join(FIX, "decomposition-epic-017.json"), "utf8"));
    const written = writeBreakdown(r, d.tasks, "EPIC-017");
    const files = readdirSync(join(r, "docs/work/backlog")).length;
    const f = validate(r);
    const firstOk = (written[0] ?? "").includes("TASK-041-");
    report(`decomposition-${d.tasks.length}`, written.length === d.tasks.length && files === d.tasks.length && f.length === 0 && firstOk && d.tasks.length >= 30,
      `${d.tasks.length} slices -> ${files} files in backlog/, first id ${basename(written[0] ?? "").slice(0, 8)} (after done/ TASK-040), ${f.length} findings`); }
}

// --- CLI -------------------------------------------------------------------------------------------

function cli(): number {
  const [mode, rootArg] = process.argv.slice(2);
  if (mode === "--check" || mode === "--write") {
    const root = resolve(rootArg ?? ".");
    if (mode === "--write") {
      if (existsSync(join(root, ".git"))) { console.log("FAIL  store-writers: --write refuses a git checkout (a live store) -- use a scratch root"); return 1; }
      const d = JSON.parse(readFileSync(join(FIX, "decomposition-epic-017.json"), "utf8"));
      const before = nextId(root);
      const written = writeBreakdown(root, d.tasks, "EPIC-017");
      console.log(`wrote ${written.length} files, ids ${basename(written[0] ?? "").slice(0, 8)}..${basename(written.at(-1) ?? "").slice(0, 8)} (store max before: TASK-${before.max}, over ${before.seen} files)`);
      console.log(`source: ${d.source}`);
    }
    const f = validate(root);
    for (const x of f) console.log(`FAIL  ${x}`);
    const n = nextId(root);
    const o = backlogOrder(root);
    console.log(`layout: ${layout(root)} · files: ${loadStore(root).length} (backlog ${loadStore(root).filter((t) => t.folder === "backlog").length}) · next id: ${n.next}`);
    console.log(`backlog order: ${o.order.join(" ")}${o.cycle.length ? ` · CYCLE: ${o.cycle.join(" ")}` : ""}`);
    console.log(`store-writers-check: ${loadStore(root).length - new Set(f.map((x) => x.split(" ")[1])).size} clean, ${f.length} findings`);
    return f.length ? 1 : 0;
  }
  try {
    runFixtures();
  } finally {
    for (const d of tmps) rmSync(d, { recursive: true, force: true });
  }
  console.log(`store-writers-fixtures: ${pass} pass, ${fail} fail`);
  return fail ? 1 : 0;
}

if (import.meta.main) process.exit(cli());
