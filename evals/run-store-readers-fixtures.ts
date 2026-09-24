// evals/run-store-readers-fixtures.ts -- retained proof that /handoff and /flow read the work-item
// store (docs/work/ folders + frontmatter), never TODO.md, and that handoff-reconciliation files a
// follow-up TASK as a task file (SPRINT-107 T3 · TASK-376 · ADR-047). Tier X (ADR-029).
// Run by Bun: `bun evals/run-store-readers-fixtures.ts`
//
// WHY RETAINED. TD-012: deleting the fixtures leaves the rule unexercised.
//
// WHAT THIS PROVES, AND WHAT IT DOES NOT. The two skills' resolution rules are PROSE an agent
// follows; there is no shipped code to run. So this harness carries a small reference resolver that
// implements the rules EXACTLY as the prose states them (each function cites its sentence) and runs
// it over v2 fixture trees built in a temp dir. Every read goes through `R`, which logs each path,
// so "no read of TODO.md" is asserted, not assumed. It proves: the stated rules are well-formed and
// pick the right sprint / members / route / next id on each tree, including the selection traps
// below. A text-contract block then checks each file still STATES those rules (anchor phrases) and
// that handoff/flow mention TODO.md only in the layout rule or a "never" clause. It does NOT prove an
// agent reading the SKILL.md will follow it -- that is a behaviour of the model, not of the text.
//
// POPULATION (L-186) -- cases that vary the SELECTION, not only the verdict:
//   · a log file under docs/sprint/logs/ and an archived sprint both carry `status: active`; neither
//     is a candidate (only top-level docs/sprint/SPRINT-*.md is).
//   · members reached by both arms: TASK-812 via a `## Members` path that went stale (the file moved
//     todo -> in_progress), TASK-813 only via its `sprint:` stamp; TASK-8110 shares a prefix and is
//     NOT a member.
//   · a stray TODO.md whose § Active Sprint names a closed sprint: the layout becomes mixed and the
//     skills refuse -- the pointer is never followed, and TODO.md's bytes are never read.
//   · two active sprints on different `stream:`s: resolved by stream, ambiguous without one.
//   · next id: the numeric max sits in cancel/ (TASK-100 > TASK-99, lexically the reverse) and a
//     worktree copy under .claude/worktrees/ carries TASK-999, which must not count.

import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FIX = fileURLToPath(new URL("fixtures/store-readers/", import.meta.url));
const SKILLS = fileURLToPath(new URL("../skills/", import.meta.url));

// ---------- instrumented reader: every read and listing is logged ----------
const R = {
  log: [] as string[],
  read(root: string, rel: string): string {
    R.log.push(rel);
    return readFileSync(join(root, rel), "utf8").replace(/\r\n/g, "\n");
  },
  list(root: string, rel: string): string[] {
    R.log.push(rel + "/");
    return existsSync(join(root, rel)) ? readdirSync(join(root, rel)).sort() : [];
  },
};

function frontmatter(text: string): Record<string, string> {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const out: Record<string, string> = {};
  for (const line of (m?.[1] ?? "").split("\n")) {
    const kv = line.match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (kv) out[kv[1]!] = kv[2]!.trim();
  }
  return out;
}

// ---------- the reference resolver (mirrors the prose) ----------
const FOLDERS = ["backlog", "todo", "in_progress", "review", "done", "cancel"];
const OPEN = ["backlog", "todo", "in_progress", "review"];

// Layout rule (both skills, ADR-046): existence only, never content.
function layout(root: string): "v1" | "v2" | "mixed" | "none" {
  const todo = existsSync(join(root, "TODO.md"));
  const work = existsSync(join(root, "docs/work"));
  return todo && work ? "mixed" : todo ? "v1" : work ? "v2" : "none";
}

interface Task { id: string; folder: string; path: string; fm: Record<string, string> }
function tasks(root: string): Task[] {
  const out: Task[] = [];
  for (const f of FOLDERS) {
    for (const name of R.list(root, `docs/work/${f}`)) {
      const m = name.match(/^(TASK-\d+)-[a-z0-9-]+\.md$/);
      if (!m) continue;
      const path = `docs/work/${f}/${name}`;
      out.push({ id: m[1]!, folder: f, path, fm: frontmatter(R.read(root, path)) });
    }
  }
  return out;
}

// "Candidates are the top-level docs/sprint/SPRINT-*.md files only (not logs/ ... nor archive/)
//  whose frontmatter reads status: active; on a multi-stream repo keep the one whose stream:
//  matches the work in hand (still more than one -> ask)."
interface Sprint { id: string; path: string; file: string; text: string; fm: Record<string, string> }
function activeSprint(root: string, stream?: string): Sprint | "none" | "ask" {
  let c: Sprint[] = [];
  for (const file of R.list(root, "docs/sprint")) {
    if (!/^SPRINT-\d+-[a-z0-9-]+\.md$/.test(file)) continue; // logs/ and archive/ are dirs: never matched
    const path = `docs/sprint/${file}`;
    const text = R.read(root, path);
    const fm = frontmatter(text);
    if (fm.status === "active") c.push({ id: `SPRINT-${fm.sprint}`, path, file, text, fm });
  }
  if (c.length > 1 && stream !== undefined) c = c.filter((s) => s.fm.stream === stream);
  return c.length === 0 ? "none" : c.length > 1 ? "ask" : c[0]!;
}

// "Its members -- the ## Members paths ∪ every docs/work/*/TASK-*.md stamped sprint: SPRINT-NNN,
//  whatever folder it sits in." A Members path is resolved by its id, so a later move does not lose it.
function members(root: string, s: Sprint, all: Task[]): Task[] {
  const sec = s.text.split(/\n## Members\n/)[1]?.split(/\n## /)[0] ?? "";
  const listed = new Set([...sec.matchAll(/TASK-\d+(?=-)/g)].map((m) => m[0]));
  return all.filter((t) => listed.has(t.id) || t.fm.sprint === s.id).sort((a, b) => a.id.localeCompare(b.id));
}

function handoff(root: string, stream?: string) {
  const lay = layout(root);
  if (lay !== "v2") return { layout: lay, refuse: true } as const;
  const s = activeSprint(root, stream);
  if (s === "none") return { layout: lay, stub: "HANDOFF-LEDGER.md" } as const;
  if (s === "ask") return { layout: lay, ask: true } as const;
  const ms = members(root, s, tasks(root));
  // "The log to use is docs/sprint/logs/ + the sprint file's own filename"
  return { layout: lay, sprint: s.id, stub: `docs/sprint/logs/${s.file}`, members: ms.map((t) => `${t.id}@${t.folder}`) } as const;
}

// flow § What it conducts, "Assess from the store" + stages 2-5.
function flowRoute(root: string, stream?: string): string {
  if (layout(root) !== "v2") return "refuse";
  const all = tasks(root);
  const s = activeSprint(root, stream);
  if (s === "ask") return "ask";
  if (s !== "none") {
    const ms = members(root, s, all);
    return ms.some((t) => !["done", "cancel"].includes(t.folder)) ? "build" : "close";
  }
  if (all.some((t) => t.folder === "backlog" && t.fm.state === "ready")) return "plan";
  if (all.some((t) => OPEN.includes(t.folder))) return "triage";
  return "feed";
}

// handoff-reconciliation: follow-up TASK -> new file in docs/work/backlog/, origin: close-retro,
// no sprint:; NNN = numeric max over every docs/work/*/ folder + legacy TODO.md rows if present;
// never a recursive search from the root (it would reach .claude/worktrees/).
function fileFollowUp(root: string, slug: string): string {
  const ids: number[] = [];
  for (const f of FOLDERS) for (const n of R.list(root, `docs/work/${f}`)) {
    const m = n.match(/^TASK-(\d+)-/);
    if (m) ids.push(Number(m[1]));
  }
  if (existsSync(join(root, "TODO.md"))) for (const m of R.read(root, "TODO.md").matchAll(/TASK-(\d+)/g)) ids.push(Number(m[1]));
  const id = `TASK-${Math.max(0, ...ids) + 1}`;
  const path = `docs/work/backlog/${id}-${slug}.md`;
  const body = readFileSync(join(FIX, "TASK-template.md"), "utf8").replace(/\r\n/g, "\n")
    .replace(/TASK-ID/g, id).replace(/SLUG/g, slug).replace("SPRINT_LINE\n", "").replace("STATE", "ready")
    .replace("origin: manual", "origin: close-retro");
  mkdirSync(join(root, "docs/work/backlog"), { recursive: true });
  writeFileSync(join(root, path), body);
  return path;
}

// ---------- fixture trees ----------
function fix(name: string): string {
  return readFileSync(join(FIX, name), "utf8").replace(/\r\n/g, "\n");
}
function put(root: string, rel: string, content: string) {
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), content);
}
function task(root: string, folder: string, id: string, slug: string, sprint: string | null, state = "ready") {
  const body = fix("TASK-template.md").replace(/TASK-ID/g, id).replace(/SLUG/g, slug)
    .replace("SPRINT_LINE\n", sprint ? `sprint: ${sprint}\n` : "").replace("STATE", state);
  put(root, `docs/work/${folder}/${id}-${slug}.md`, body);
}
function base(): string {
  const root = mkdtempSync(join(tmpdir(), "store-readers-"));
  for (const f of FOLDERS) mkdirSync(join(root, "docs/work", f), { recursive: true });
  put(root, "docs/sprint/SPRINT-800-closed.md", fix("SPRINT-800-closed.md"));
  put(root, "docs/sprint/SPRINT-801-live.md", fix("SPRINT-801-live.md"));
  put(root, "docs/sprint/SPRINT-802-planned.md", fix("SPRINT-802-planned.md"));
  put(root, "docs/sprint/logs/SPRINT-799-logonly.md", fix("log-SPRINT-799-logonly.md"));
  put(root, "docs/sprint/archive/SPRINT-798-archived.md",
    fix("SPRINT-800-closed.md").replace(/800/g, "798").replace("status: closed", "status: active"));
  task(root, "done", "TASK-801", "old", "SPRINT-800");
  task(root, "todo", "TASK-811", "alpha", "SPRINT-801");
  task(root, "in_progress", "TASK-812", "beta", "SPRINT-801"); // Members line still says todo/
  task(root, "review", "TASK-813", "gamma", "SPRINT-801"); // stamped, not on ## Members
  task(root, "backlog", "TASK-8110", "prefix", null); // shares a prefix with TASK-811
  task(root, "backlog", "TASK-820", "ready", null, "ready");
  task(root, "backlog", "TASK-821", "draft", null, "draft");
  return root;
}
function setStatus(root: string, rel: string, status: string, extra = "") {
  const p = join(root, rel);
  writeFileSync(p, readFileSync(p, "utf8").replace(/^status: .*$/m, `status: ${status}${extra}`));
}
function moveTask(root: string, from: string, to: string, name: string) {
  const text = readFileSync(join(root, "docs/work", from, name), "utf8");
  rmSync(join(root, "docs/work", from, name));
  put(root, `docs/work/${to}/${name}`, text);
}

// ---------- cases ----------
let pass = 0;
let fail = 0;
function check(name: string, ok: boolean, detail: string) {
  console.log(`${ok ? "PASS" : "FAIL"}  store-readers: ${name} -- ${detail}`);
  ok ? pass++ : fail++;
}
const J = (v: unknown) => JSON.stringify(v);
const noTodoRead = () => !R.log.includes("TODO.md");

interface Case { name: string; setup: (root: string) => void; run: (root: string) => unknown; expect: unknown; todoMayBeRead?: boolean }
const CASES: Case[] = [
  {
    name: "handoff-v2-active-sprint (log + archive carry status: active; only SPRINT-801 is a candidate)",
    setup: () => {},
    run: (r) => handoff(r),
    expect: { layout: "v2", sprint: "SPRINT-801", stub: "docs/sprint/logs/SPRINT-801-live.md",
      members: ["TASK-811@todo", "TASK-812@in_progress", "TASK-813@review"] },
  },
  {
    name: "handoff-no-active-sprint -> fallback ledger",
    setup: (r) => setStatus(r, "docs/sprint/SPRINT-801-live.md", "closed"),
    run: (r) => handoff(r),
    expect: { layout: "v2", stub: "HANDOFF-LEDGER.md" },
  },
  {
    name: "handoff-stray-TODO-stale-pointer (mixed -> refuse; pointer to SPRINT-800 never followed)",
    setup: (r) => put(r, "TODO.md", fix("TODO-stale.md")),
    run: (r) => handoff(r),
    expect: { layout: "mixed", refuse: true },
  },
  {
    name: "handoff-two-active-streams (stream: core selects SPRINT-801)",
    setup: (r) => {
      setStatus(r, "docs/sprint/SPRINT-801-live.md", "active", "\nstream: core");
      setStatus(r, "docs/sprint/SPRINT-802-planned.md", "active", "\nstream: docs");
    },
    run: (r) => handoff(r, "core"),
    expect: { layout: "v2", sprint: "SPRINT-801", stub: "docs/sprint/logs/SPRINT-801-live.md",
      members: ["TASK-811@todo", "TASK-812@in_progress", "TASK-813@review"] },
  },
  {
    name: "handoff-two-active-no-stream -> ask",
    setup: (r) => setStatus(r, "docs/sprint/SPRINT-802-planned.md", "active"),
    run: (r) => handoff(r),
    expect: { layout: "v2", ask: true },
  },
  { name: "flow-build (active sprint, members open)", setup: () => {}, run: (r) => flowRoute(r), expect: "build" },
  {
    name: "flow-close (every member in done/ or cancel/, one reached only by stamp)",
    setup: (r) => {
      moveTask(r, "todo", "done", "TASK-811-alpha.md");
      moveTask(r, "in_progress", "cancel", "TASK-812-beta.md");
      moveTask(r, "review", "done", "TASK-813-gamma.md");
    },
    run: (r) => flowRoute(r),
    expect: "close",
  },
  {
    name: "flow-build-stamp-only-member-open (Members-listed done; stamp-only TASK-813 still in review)",
    setup: (r) => {
      moveTask(r, "todo", "done", "TASK-811-alpha.md");
      moveTask(r, "in_progress", "done", "TASK-812-beta.md");
    },
    run: (r) => flowRoute(r),
    expect: "build",
  },
  {
    name: "flow-plan (no active sprint, a state: ready backlog task)",
    setup: (r) => setStatus(r, "docs/sprint/SPRINT-801-live.md", "closed"),
    run: (r) => flowRoute(r),
    expect: "plan",
  },
  {
    name: "flow-triage (no active sprint, open work but none ready)",
    setup: (r) => {
      setStatus(r, "docs/sprint/SPRINT-801-live.md", "closed");
      for (const [f, n] of [["todo", "TASK-811-alpha.md"], ["in_progress", "TASK-812-beta.md"], ["review", "TASK-813-gamma.md"],
        ["backlog", "TASK-8110-prefix.md"], ["backlog", "TASK-820-ready.md"]] as const) moveTask(r, f, "done", n);
    },
    run: (r) => flowRoute(r),
    expect: "triage",
  },
  {
    name: "flow-feed (no active sprint, no open work)",
    setup: (r) => {
      setStatus(r, "docs/sprint/SPRINT-801-live.md", "closed");
      for (const [f, n] of [["todo", "TASK-811-alpha.md"], ["in_progress", "TASK-812-beta.md"], ["review", "TASK-813-gamma.md"],
        ["backlog", "TASK-8110-prefix.md"], ["backlog", "TASK-820-ready.md"], ["backlog", "TASK-821-draft.md"]] as const) moveTask(r, f, "cancel", n);
    },
    run: (r) => flowRoute(r),
    expect: "feed",
  },
  {
    name: "flow-stray-TODO-stale-pointer (mixed -> refuse)",
    setup: (r) => put(r, "TODO.md", fix("TODO-stale.md")),
    run: (r) => flowRoute(r),
    expect: "refuse",
  },
  {
    name: "reconcile-next-id (numeric max in cancel/, worktree TASK-999 excluded) -> TASK-101 file",
    setup: (r) => {
      for (const f of FOLDERS) rmSync(join(r, "docs/work", f), { recursive: true, force: true });
      task(r, "done", "TASK-99", "a", null);
      task(r, "cancel", "TASK-100", "b", null);
      task(r, "backlog", "TASK-7", "c", null);
      put(r, ".claude/worktrees/agent-x/docs/work/backlog/TASK-999-x.md", fix("TASK-template.md"));
    },
    run: (r) => {
      const p = fileFollowUp(r, "follow-up");
      const fm = frontmatter(readFileSync(join(r, p), "utf8"));
      return { path: p, id: fm.id, origin: fm.origin, sprint: fm.sprint ?? null, worktreeCopyPresent: existsSync(join(r, ".claude/worktrees/agent-x/docs/work/backlog/TASK-999-x.md")) };
    },
    expect: { path: "docs/work/backlog/TASK-101-follow-up.md", id: "TASK-101", origin: "close-retro", sprint: null, worktreeCopyPresent: true },
  },
  {
    name: "reconcile-next-id-legacy-TODO (TASK-9500 row counted; TODO.md left byte-identical)",
    setup: (r) => put(r, "TODO.md", fix("TODO-stale.md")),
    run: (r) => {
      const before = readFileSync(join(r, "TODO.md"), "utf8");
      const p = fileFollowUp(r, "follow-up");
      return { path: p, todoUnchanged: readFileSync(join(r, "TODO.md"), "utf8") === before };
    },
    expect: { path: "docs/work/backlog/TASK-9501-follow-up.md", todoUnchanged: true },
    todoMayBeRead: true,
  },
];

for (const c of CASES) {
  const root = base();
  R.log = [];
  try {
    c.setup(root);
    const got = c.run(root);
    const ok = J(got) === J(c.expect);
    const todoOk = c.todoMayBeRead || noTodoRead();
    check(c.name, ok && todoOk, `expected ${J(c.expect)} got ${J(got)}${todoOk ? "" : " -- TODO.md WAS READ"}`);
  } catch (e) {
    check(c.name, false, `harness error: ${(e as Error).message.split("\n")[0]}`);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// ---------- text contract: the files still state the rules the resolver mirrors ----------
const skill = (rel: string) => readFileSync(join(SKILLS, rel), "utf8").replace(/\r\n/g, "\n");
const CONTRACT: Record<string, string[]> = {
  "handoff/SKILL.md": [
    "**Resolve context** — after the layout check above (v1/mixed stops here):",
    "never through `TODO.md`", "top-level `docs/sprint/SPRINT-*.md`", "not `logs/`", "`status: active`",
    "`stream:`", "`## Members` paths ∪ every `docs/work/*/TASK-*.md`", "stamped `sprint: SPRINT-NNN`",
    "`docs/sprint/logs/` + the sprint file's own filename", "`HANDOFF-LEDGER.md`",
  ],
  "flow/SKILL.md": [
    "**Assess from the store**", "`TODO.md` is never read", "`docs/work/{backlog,todo,in_progress,review}/`",
    "`state: ready`", "top-level `docs/sprint/SPRINT-*.md` (not `logs/` or `archive/`) with `status: active`",
    "stamped `sprint: SPRINT-NNN`", "no active sprint and no open work", "open work but none `state: ready`",
    "no active sprint but a ready backlog", "an active sprint with a member outside `done/`/`cancel/`",
    "every member of the active sprint in `docs/work/done/` or `cancel/`",
  ],
  "lean-doc-generator/references/handoff-reconciliation.md": [
    "new task file in `docs/work/backlog/`**, never a `TODO.md` row", "`origin: close-retro`", "no `sprint:`",
    "**numeric** maximum", "(`done/` and `cancel/` included)", "`.claude/worktrees/`",
  ],
};
for (const [rel, phrases] of Object.entries(CONTRACT)) {
  const text = skill(rel);
  const missing = phrases.filter((p) => !text.includes(p));
  check(`text-contract ${rel}`, missing.length === 0, missing.length ? `missing: ${missing.map((m) => J(m)).join(" · ")}` : `${phrases.length} phrases present`);
}
for (const rel of ["handoff/SKILL.md", "flow/SKILL.md"]) {
  const stray = skill(rel).split("\n").filter((l) => l.includes("TODO") && !/present and no `docs\/work\/`/.test(l) && !/\bnever\b/.test(l));
  check(`text-contract ${rel} mentions TODO only in the layout rule or a 'never' clause`, stray.length === 0,
    stray.length ? `stray: ${stray.map((l) => J(l.trim().slice(0, 90))).join(" · ")}` : "clean");
  check(`text-contract ${rel} has no § Active Sprint pointer read`, !skill(rel).includes("§ Active Sprint"), "checked");
}

console.log(`store-readers-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
