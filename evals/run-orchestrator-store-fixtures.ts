// evals/run-orchestrator-store-fixtures.ts -- retained proof that /orchestrator's sprint-bulk reads
// a sprint's members BY REFERENCE from the work-item store (docs/work/), never from a Plan copy and
// never from TODO.md (SPRINT-107 T4 · TASK-375 · TASK-362's merge-back half · ADR-047 · ADR-045 D6).
// Tier X (ADR-029). Run by Bun: `bun evals/run-orchestrator-store-fixtures.ts`
//
// WHY RETAINED. TD-012: deleting the fixtures leaves the rule unexercised.
//
// WHAT THIS PROVES, AND WHAT IT DOES NOT. sprint-bulk's reads are PROSE an agent follows
// (skills/orchestrator/SKILL.md § sprint-bulk + references/dispatch.md § Members by reference ·
// § Merge-back queue, night-run.md Part 1a/1/2/4, review-scoping.md rung 4). This harness carries a
// small reference resolver that implements each rule EXACTLY as that prose states it (each function
// cites its sentence) and runs it over v2 fixture repos built in a temp dir, with real `git mv`
// commits. Every file read by the resolver goes through `R`, which logs each path, so "TODO.md is
// never read" is asserted, not assumed. The duplicate-id check is not re-implemented: the one-line
// command is lifted verbatim out of dispatch.md and executed. Where the host keeps T1's close/freeze
// gate (scripts/lib/check-sprint-by-reference.ts) it is run on the same repo, so the return-to-backlog
// procedure is shown to keep that gate green -- and, without its scope-change entry, to trip it.
// A text-contract block then checks each file still STATES the rules (anchor phrases). It does NOT
// prove an agent reading the SKILL.md will follow it -- that is a behaviour of the model.
//
// END TO END (one v2 fixture sprint, steps share one repo): resolve active sprint -> members ->
// open-DoD guard -> tick a member + git mv through statuses (each move its own commit) -> rollup
// N of M + units -> review comparand from the task file -> return-to-backlog -> duplicate-id check ->
// close precondition (+ host --close).
//
// POPULATION (L-186) -- cases that vary the SELECTION, not only the verdict:
//   · TASK-913 is a member ONLY by its `sprint:` stamp (not on ## Members);
//   · TASK-912's ## Members path goes stale when it moves todo -> in_progress (resolved by id);
//   · TASK-9110 shares TASK-911's prefix and is NOT a member, nor a Cites: match;
//   · a second active sprint on another `stream:` (SPRINT-902): selected by stream, else ask;
//   · a log under docs/sprint/logs/ and an archived sprint both carry `status: active`: never candidates;
//   · the duplicate-id check: a must-FAIL (same id in todo/ and in_progress/) and a worktree copy
//     under .claude/worktrees/ that must NOT be counted.

import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FIX = fileURLToPath(new URL("fixtures/orchestrator-store/", import.meta.url));
const SKILLS = fileURLToPath(new URL("../skills/", import.meta.url));
const CHECKER = fileURLToPath(new URL("../scripts/lib/check-sprint-by-reference.ts", import.meta.url));
const SPRINT = "docs/sprint/SPRINT-901-run.md";
const LOG = "docs/sprint/logs/SPRINT-901-run.md";

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
function section(text: string, heading: string): string {
  return text.split(new RegExp(`\\n## ${heading}\\n`))[1]?.split(/\n## /)[0] ?? "";
}

// ---------- the reference resolver (mirrors the prose) ----------
const FOLDERS = ["backlog", "todo", "in_progress", "review", "done", "cancel"];

// SKILL.md § Intake routing: "`TODO.md` present and no `docs/work/` → v1 · both present → mixed ·
// only `docs/work/` → v2 (existence only, never content). Refuse this skill's queue operation and
// point to `/lean-doc-generator migrate`".
function layout(root: string): "v1" | "v2" | "mixed" | "none" {
  const todo = existsSync(join(root, "TODO.md"));
  const work = existsSync(join(root, "docs/work"));
  return todo && work ? "mixed" : todo ? "v1" : work ? "v2" : "none";
}
function entry(root: string) {
  const lay = layout(root);
  return lay === "v2" ? { layout: lay, refuse: false } : { layout: lay, refuse: true, pointTo: "/lean-doc-generator migrate" };
}

interface Task { id: string; folder: string; path: string; text: string; fm: Record<string, string> }
function tasks(root: string): Task[] {
  const out: Task[] = [];
  for (const f of FOLDERS) {
    for (const name of R.list(root, `docs/work/${f}`)) {
      const m = name.match(/^(TASK-\d+)-[a-z0-9-]+\.md$/);
      if (!m) continue;
      const path = `docs/work/${f}/${name}`;
      const text = R.read(root, path);
      out.push({ id: m[1]!, folder: f, path, text, fm: frontmatter(text) });
    }
  }
  return out;
}
// dispatch.md rule 2: "resolved by its TASK id -- the filename that starts `TASK-NNN-` in any of the
// six status folders (the trailing hyphen keeps `TASK-81` from matching `TASK-810`)".
function byId(all: Task[], id: string): Task[] {
  return all.filter((t) => t.path.split("/").pop()!.startsWith(`${id}-`));
}

// dispatch.md rule 1: "candidates are the top-level `docs/sprint/SPRINT-*.md` files only (never
// `logs/` or `archive/`, whatever their frontmatter says) whose frontmatter reads `status: active`.
// On a multi-stream repo keep the one whose `stream:` matches the work in hand; still more than one → ask."
interface Sprint { id: string; path: string; text: string; fm: Record<string, string> }
function activeSprint(root: string, stream?: string): Sprint | "none" | "ask" {
  let c: Sprint[] = [];
  for (const file of R.list(root, "docs/sprint")) {
    if (!/^SPRINT-\d+-[a-z0-9-]+\.md$/.test(file)) continue; // logs/ and archive/ are dirs: never matched
    const path = `docs/sprint/${file}`;
    const text = R.read(root, path);
    const fm = frontmatter(text);
    if (fm.status === "active") c.push({ id: `SPRINT-${fm.sprint}`, path, text, fm });
  }
  if (c.length > 1 && stream !== undefined) c = c.filter((s) => s.fm.stream === stream);
  return c.length === 0 ? "none" : c.length > 1 ? "ask" : c[0]!;
}

// SKILL.md § sprint-bulk + dispatch.md rule 2: "the `## Members` paths ∪ every `docs/work/*/TASK-*.md`
// stamped `sprint: SPRINT-NNN`, whatever folder it sits in" -- a Members path resolved by its id.
function members(s: Sprint, all: Task[]): Task[] {
  const listed = new Set([...section(s.text, "Members").matchAll(/TASK-\d+(?=-)/g)].map((m) => m[0]));
  return all.filter((t) => listed.has(t.id) || t.fm.sprint === s.id).sort((a, b) => a.id.localeCompare(b.id));
}

// A member's DoD is its own `## Done when` (ADR-047); boxes `- [ ]` / `- [x]`.
function boxes(text: string): { open: number; ticked: number } {
  const lines = section(text, "Done when").split("\n");
  return {
    open: lines.filter((l) => /^\s*[-*+] \[ \]/.test(l)).length,
    ticked: lines.filter((l) => /^\s*[-*+] \[[xX]\]/.test(l)).length,
  };
}

// SKILL.md step 0 + dispatch.md rule 3: "runnable while at least one member's `## Done when` still has
// an open `[ ]` box. Plan `Tn` blocks carry no boxes, so they are never counted." None -> halt -> promote.
function guard(root: string, stream?: string) {
  if (entry(root).refuse) return { refuse: true };
  const s = activeSprint(root, stream);
  if (s === "none") return { halt: "/lean-doc-generator promote" };
  if (s === "ask") return { ask: true };
  const open = members(s, tasks(root)).reduce((n, t) => n + boxes(t.text).open, 0);
  return open > 0 ? { run: s.id, open } : { halt: "/lean-doc-generator promote" };
}

// dispatch.md rule 4: "a `### Tn` block carries only sprint-scoped meta ... `Layers:` · `Depends-on:` ·
// `Cites:` ... The task's own content ... is read from the member file(s) its `Cites:` names."
interface Unit { tn: string; layers: string[]; cites: string[]; planBoxes: number }
function units(s: Sprint): Unit[] {
  const plan = section(s.text, "Plan");
  const out: Unit[] = [];
  for (const block of plan.split(/\n(?=### T\d+)/).filter((b) => /^### T\d+/.test(b))) {
    const tn = block.match(/^### (T\d+)/)![1]!;
    const layers: string[] = [];
    let cur = "";
    for (const line of block.split("\n")) {
      if (line.startsWith("Layers:")) cur = "L";
      else if (/^\s/.test(line) && cur === "L") { /* continuation of Layers: (dispatch.md TD-040) */ }
      else cur = "";
      if (cur === "L") layers.push(...[...line.matchAll(/`([^`]+)`/g)].map((m) => m[1]!));
    }
    const citesLine = block.split("\n").find((l) => l.startsWith("Cites:")) ?? "";
    const cites = [...citesLine.matchAll(/TASK-\d+/g)].map((m) => m[0]);
    const planBoxes = block.split("\n").filter((l) => /^\s*[-*+] \[[ xX]\]/.test(l)).length;
    out.push({ tn, layers, cites, planBoxes });
  }
  return out;
}

// night-run.md Part 4 "What the counts read": "`N of M` counts the `## Done when` boxes across the
// sprint's member files ... Units are the Plan's `### Tn` blocks, and a unit is delivered when every
// member its `Cites:` names has no open `## Done when` box; a `Tn` whose `Cites:` names no current
// member (all scoped out) leaves both unit counts."
function rollup(root: string, stream?: string) {
  const s = activeSprint(root, stream) as Sprint;
  const ms = members(s, tasks(root));
  const byMember = new Map(ms.map((t) => [t.id, boxes(t.text)]));
  let N = 0, M = 0;
  for (const b of byMember.values()) { N += b.ticked; M += b.ticked + b.open; }
  const counted = units(s).map((u) => ({ ...u, cited: u.cites.filter((c) => byMember.has(c)) })).filter((u) => u.cited.length > 0);
  const delivered = counted.filter((u) => u.cited.every((c) => byMember.get(c)!.open === 0)).map((u) => u.tn);
  return { header: `run · ${N} of ${M} DoD ticked`, units: `${delivered.length} of ${counted.length}`, delivered };
}

// review-scoping.md rung 4: "A cited `TASK-NNN` resolves by id to its task file,
// `docs/work/*/TASK-NNN-*.md` in whichever status folder it sits ... measured against that file's
// `## Done when` ... never the Plan block, which carries no DoD".
function comparand(root: string, tn: string, stream?: string) {
  const s = activeSprint(root, stream) as Sprint;
  const u = units(s).find((x) => x.tn === tn)!;
  const all = tasks(root);
  const files = u.cites.map((id) => byId(all, id));
  return {
    layersFromPlan: u.layers,
    planBoxes: u.planBoxes,
    files: files.map((f) => f.map((t) => t.path)),
    doneWhen: files.flat().map((t) => section(t.text, "Done when").trim().split("\n").filter((l) => l.startsWith("- ["))),
  };
}

// dispatch.md § Merge-back queue: the duplicate-id command, lifted verbatim out of the prose.
const DISPATCH = readFileSync(join(SKILLS, "orchestrator/references/dispatch.md"), "utf8").replace(/\r\n/g, "\n");
const DUP_CMD = (DISPATCH.split("\n").find((l) => /^ {4}find docs\/work .*uniq -d$/.test(l)) ?? "").trim();
function duplicateIds(root: string): string[] {
  if (!DUP_CMD) throw new Error("duplicate-id command not found in dispatch.md");
  const r = spawnSync("sh", ["-c", DUP_CMD], { cwd: root, encoding: "utf8" });
  return r.stdout.split("\n").filter(Boolean);
}

// dispatch.md rule 7: "every member sits in `docs/work/done/` or `docs/work/cancel/`; Plan boxes are
// never counted ... Any member in `todo/`, `in_progress/` or `review/` blocks close".
function closeReady(root: string, stream?: string) {
  const s = activeSprint(root, stream) as Sprint;
  const blocking = members(s, tasks(root)).filter((t) => !["done", "cancel"].includes(t.folder)).map((t) => `${t.id}@${t.folder}`);
  return { ready: blocking.length === 0, blocking };
}

// ---------- git-backed writes (the coordinator's moves and ticks) ----------
function git(dir: string, args: string[]): string {
  return execFileSync("git", args, { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}
function commit(dir: string, msg: string) {
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-q", "--allow-empty", "-m", msg]);
}
const lastCommitFiles = (dir: string) => git(dir, ["show", "--name-status", "--format=", "-M", "HEAD"]).trim().split("\n");
function pathOf(root: string, id: string): string {
  const hit = FOLDERS.flatMap((f) => readdirSync(join(root, "docs/work", f)).filter((n) => n.startsWith(`${id}-`)).map((n) => `docs/work/${f}/${n}`));
  if (hit.length !== 1) throw new Error(`${id} resolves to ${hit.length} files`);
  return hit[0]!;
}
// dispatch.md rule 6: "Each is `git mv docs/work/<from>/TASK-NNN-<slug>.md docs/work/<to>/` in its own
// commit, never sharing one with a content edit (ADR-045 D6)."
function transition(root: string, id: string, to: string) {
  const from = pathOf(root, id);
  mkdirSync(join(root, "docs/work", to), { recursive: true });
  git(root, ["mv", from, `docs/work/${to}/`]);
  git(root, ["commit", "-q", "-m", `move ${id} -> ${to}`]);
}
// dispatch.md rule 5: "`- [ ]` → `- [x]`, appending ` ✓ <evidence>` after the frozen text".
function tick(root: string, id: string, evidence: string) {
  const p = join(root, pathOf(root, id));
  const text = readFileSync(p, "utf8");
  const next = text.replace(/^(\s*[-*+]) \[ \] (.*)$/m, `$1 [x] $2 ✓ ${evidence}`);
  if (next === text) throw new Error(`no open box in ${id}`);
  writeFileSync(p, next);
  commit(root, `tick ${id}`);
}
// dispatch.md § Merge-back queue, return-to-backlog steps 1-3.
function returnToBacklog(root: string, id: string, withLog = true) {
  if (withLog) {
    appendFileSync(join(root, LOG), `\n### 2026-09-25 | scope-change | ${id} returned to backlog\n${id} -- worktree broken; unblock: rebuild on the new tip.\n`);
    commit(root, `log scope-change ${id}`);
  }
  transition(root, id, "backlog");
  const p = join(root, pathOf(root, id));
  writeFileSync(p, readFileSync(p, "utf8").replace(/^sprint: .*\n/m, ""));
  const sp = join(root, SPRINT);
  writeFileSync(sp, readFileSync(sp, "utf8").replace(new RegExp(`^- docs/work/[a-z_]+/${id}-[a-z0-9-]+\\.md\\n`, "m"), ""));
  commit(root, `unstamp ${id}, drop Members line`);
}
function hostCheck(root: string, close: boolean): string[] | null {
  if (!existsSync(CHECKER)) return null; // a consumer without the host gate: the plain-git fallback is the check
  const r = spawnSync("bun", [CHECKER, join(root, SPRINT), ...(close ? ["--close"] : [])], { encoding: "utf8" });
  return (r.stdout ?? "").split(/\r?\n/).filter((l) => l.startsWith("FAIL  ")).map((l) => l.slice(6).split(" -- ")[0]!.trim()).sort();
}

// ---------- fixture repo ----------
function fix(name: string): string {
  return readFileSync(join(FIX, name), "utf8").replace(/\r\n/g, "\n");
}
function put(root: string, rel: string, content: string) {
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), content);
}
function task(root: string, folder: string, id: string, slug: string, sprint: string | null) {
  put(root, `docs/work/${folder}/${id}-${slug}.md`, fix("TASK-template.md").replace(/TASK-ID/g, id).replace(/SLUG/g, slug)
    .replace("SPRINT_LINE\n", sprint ? `sprint: ${sprint}\n` : ""));
}
function setStatus(root: string, rel: string, status: string) {
  const p = join(root, rel);
  writeFileSync(p, readFileSync(p, "utf8").replace(/^status: .*$/m, `status: ${status}`));
}
function build(): string {
  const root = mkdtempSync(join(tmpdir(), "orchestrator-store-"));
  git(root, ["init", "-q"]);
  git(root, ["config", "user.email", "fixture@example.com"]);
  git(root, ["config", "user.name", "Fixture Bot"]);
  git(root, ["config", "core.autocrlf", "false"]);
  git(root, ["config", "commit.gpgsign", "false"]); // the host signer is not the fixture's (and fails at volume)
  put(root, "README.md", "fixture repo\n");
  commit(root, "base");
  for (const f of FOLDERS) put(root, `docs/work/${f}/.gitkeep`, "");
  put(root, SPRINT, fix("SPRINT-901-run.md"));
  put(root, LOG, fix("log-SPRINT-901-run.md"));
  put(root, "docs/sprint/SPRINT-902-docs.md", fix("SPRINT-902-docs.md"));
  put(root, "docs/sprint/logs/SPRINT-899-logonly.md", fix("log-SPRINT-899-logonly.md"));
  put(root, "docs/sprint/archive/SPRINT-898-archived.md",
    fix("SPRINT-902-docs.md").replace(/902/g, "898").replace("status: planned", "status: active").replace("stream: docs\n", ""));
  task(root, "todo", "TASK-911", "alpha", "SPRINT-901");
  task(root, "todo", "TASK-912", "beta", "SPRINT-901");
  task(root, "todo", "TASK-913", "gamma", "SPRINT-901"); // stamped, NOT on ## Members
  task(root, "todo", "TASK-921", "docs", "SPRINT-902");
  task(root, "backlog", "TASK-9110", "prefix", null); // shares TASK-911's prefix; not a member
  commit(root, "sprint(901): plan locked");
  const pc = git(root, ["rev-parse", "--short", "HEAD"]).trim();
  put(root, SPRINT, readFileSync(join(root, SPRINT), "utf8").replace("plan_commit: PLAN_COMMIT", `plan_commit: ${pc}`));
  commit(root, "sprint(901): record plan_commit");
  return root;
}

// ---------- cases ----------
let pass = 0;
let fail = 0;
const J = (v: unknown) => JSON.stringify(v);
function check(name: string, ok: boolean, detail: string) {
  console.log(`${ok ? "PASS" : "FAIL"}  orchestrator-store: ${name} -- ${detail}`);
  ok ? pass++ : fail++;
}
function expectEq(name: string, got: unknown, want: unknown, todoMayExist = false) {
  const todoOk = !R.log.includes("TODO.md");
  check(name, J(got) === J(want) && todoOk, `expected ${J(want)} got ${J(got)}${todoOk ? "" : " -- TODO.md WAS READ"}${todoMayExist ? " (TODO.md present, existence-only)" : ""}`);
}
function guarded(name: string, fn: () => void) {
  try { fn(); } catch (e) { check(name, false, `harness error: ${(e as Error).message.split("\n")[0]}`); }
}
const memberView = (root: string, stream?: string) => {
  const s = activeSprint(root, stream);
  return typeof s === "string" ? s : members(s, tasks(root)).map((t) => `${t.id}@${t.folder}`);
};

// --- end to end on one v2 fixture sprint ---
{
  const root = build();
  R.log = [];
  guarded("e2e", () => {
    expectEq("e2e-1 layout v2 -> no refusal", entry(root), { layout: "v2", refuse: false });
    const s = activeSprint(root);
    expectEq("e2e-2 active sprint (log + archive carry status: active; SPRINT-902 planned)", typeof s === "string" ? s : s.id, "SPRINT-901");
    expectEq("e2e-3 members = Members ∪ stamps (913 stamp-only; 9110 prefix excluded)", memberView(root), ["TASK-911@todo", "TASK-912@todo", "TASK-913@todo"]);
    expectEq("e2e-4 guard: open member boxes -> run", guard(root), { run: "SPRINT-901", open: 6 });
    expectEq("e2e-5 rollup before any work", rollup(root), { header: "run · 0 of 6 DoD ticked", units: "0 of 3", delivered: [] });

    const sprintBefore = readFileSync(join(root, SPRINT), "utf8");
    transition(root, "TASK-911", "in_progress");
    const mv1 = lastCommitFiles(root);
    tick(root, "TASK-911", "fixture alpha 2/2");
    const tk = lastCommitFiles(root);
    tick(root, "TASK-911", "fixture alpha empty");
    transition(root, "TASK-911", "review");
    transition(root, "TASK-911", "done");
    const mv3 = lastCommitFiles(root);
    check("e2e-6 each status move is its own pure-rename commit; the tick is a content-only commit (D6)",
      mv1.length === 1 && /^R100\t/.test(mv1[0]!) && mv3.length === 1 && /^R100\t.*done\/TASK-911-alpha\.md$/.test(mv3[0]!) &&
        tk.length === 1 && /^M\tdocs\/work\/in_progress\/TASK-911-alpha\.md$/.test(tk[0]!),
      `move ${J(mv1)} · tick ${J(tk)} · final ${J(mv3)}`);
    const t911 = readFileSync(join(root, "docs/work/done/TASK-911-alpha.md"), "utf8");
    check("e2e-7 tick lands in the MEMBER FILE with the ✓ suffix; the sprint Plan is untouched",
      t911.includes("- [x] alpha returns the documented value ✓ fixture alpha 2/2") &&
        readFileSync(join(root, SPRINT), "utf8") === sprintBefore,
      "member ticked, sprint file byte-identical to before the loop");

    transition(root, "TASK-912", "in_progress"); // its ## Members path (todo/) is now stale
    tick(root, "TASK-912", "fixture beta");
    R.log = [];
    expectEq("e2e-8 stale Members path still resolves by id", memberView(root), ["TASK-911@done", "TASK-912@in_progress", "TASK-913@todo"]);
    expectEq("e2e-9 rollup counts member boxes (stamp-only 913 included); units from Plan Tn", rollup(root),
      { header: "run · 3 of 6 DoD ticked", units: "1 of 3", delivered: ["T1"] });

    transition(root, "TASK-913", "review");
    R.log = [];
    expectEq("e2e-10 review comparand: T2's Layers from the Plan (wrapped), DoD from TASK-912's file", comparand(root, "T2"), {
      layersFromPlan: ["src/beta.ts", "src/beta-helpers.ts"], planBoxes: 0,
      files: [["docs/work/in_progress/TASK-912-beta.md"]],
      doneWhen: [["- [x] beta returns the documented value ✓ fixture beta", "- [ ] a retained fixture covers beta's empty input"]],
    });
    expectEq("e2e-11 review comparand: T1 Cites TASK-911 never resolves TASK-9110", comparand(root, "T1").files, [["docs/work/done/TASK-911-alpha.md"]]);

    returnToBacklog(root, "TASK-912");
    const f912 = readFileSync(join(root, "docs/work/backlog/TASK-912-beta.md"), "utf8");
    const log = readFileSync(join(root, LOG), "utf8");
    R.log = [];
    check("e2e-12 return-to-backlog: scope-change entry, git mv, stamp cleared, Members line removed",
      /### 2026-09-25 \| scope-change \| TASK-912/.test(log) && !/^sprint:/m.test(f912) &&
        !readFileSync(join(root, SPRINT), "utf8").includes("TASK-912-beta.md") &&
        J(memberView(root)) === J(["TASK-911@done", "TASK-913@review"]), `members now ${J(memberView(root))}`);
    expectEq("e2e-13 rollup after return: T2 cites no current member -> leaves both unit counts", rollup(root),
      { header: "run · 2 of 4 DoD ticked", units: "1 of 2", delivered: ["T1"] });
    const hc = hostCheck(root, false);
    check("e2e-14 host freeze gate stays green after a logged return (skipped if absent)", hc === null || hc.length === 0, hc === null ? "no host gate" : `findings ${J(hc)}`);

    expectEq("e2e-15 duplicate-id check (dispatch.md command verbatim) prints nothing", duplicateIds(root), []);
    expectEq("e2e-16 close precondition blocked by a member in review/", closeReady(root), { ready: false, blocking: ["TASK-913@review"] });
    tick(root, "TASK-913", "fixture gamma");
    tick(root, "TASK-913", "fixture gamma empty");
    transition(root, "TASK-913", "done");
    R.log = [];
    expectEq("e2e-17 close precondition met: every member in done/ or cancel/", closeReady(root), { ready: true, blocking: [] });
    expectEq("e2e-18 guard after the Plan is exhausted -> halt", guard(root), { halt: "/lean-doc-generator promote" });
    expectEq("e2e-19 final rollup", rollup(root), { header: "run · 4 of 4 DoD ticked", units: "2 of 2", delivered: ["T1", "T3"] });
    const hcc = hostCheck(root, true);
    check("e2e-20 host --close gate green (skipped if absent)", hcc === null || hcc.length === 0, hcc === null ? "no host gate" : `findings ${J(hcc)}`);
  });
  rmSync(root, { recursive: true, force: true });
}

// --- standalone cases, each on a fresh repo ---
interface Case { name: string; setup?: (root: string) => void; run: (root: string) => unknown; expect: unknown; todo?: boolean }
const CASES: Case[] = [
  {
    name: "v1-refusal (TODO.md present, no docs/work) -> refuse, point to migrate; TODO.md never read",
    setup: (r) => { rmSync(join(r, "docs/work"), { recursive: true, force: true }); put(r, "TODO.md", fix("TODO-legacy.md")); },
    run: (r) => ({ entry: entry(r), guard: guard(r) }),
    expect: { entry: { layout: "v1", refuse: true, pointTo: "/lean-doc-generator migrate" }, guard: { refuse: true } }, todo: true,
  },
  {
    name: "mixed-refusal (TODO.md beside docs/work) -> refuse",
    setup: (r) => put(r, "TODO.md", fix("TODO-legacy.md")),
    run: (r) => guard(r), expect: { refuse: true }, todo: true,
  },
  {
    name: "selection: second active sprint on stream docs -> stream core selects SPRINT-901",
    setup: (r) => setStatus(r, "docs/sprint/SPRINT-902-docs.md", "active"),
    run: (r) => ({ core: memberView(r, "core"), docs: memberView(r, "docs") }),
    expect: { core: ["TASK-911@todo", "TASK-912@todo", "TASK-913@todo"], docs: ["TASK-921@todo"] },
  },
  {
    name: "selection: two active sprints, no stream -> ask",
    setup: (r) => setStatus(r, "docs/sprint/SPRINT-902-docs.md", "active"),
    run: (r) => guard(r), expect: { ask: true },
  },
  {
    name: "selection: only a log + an archived sprint carry status: active -> no candidate -> halt",
    setup: (r) => setStatus(r, SPRINT, "closed"),
    run: (r) => guard(r), expect: { halt: "/lean-doc-generator promote" },
  },
  {
    name: "selection: a stamp-only member contributes its boxes to M",
    run: (r) => rollup(r).header, expect: "run · 0 of 6 DoD ticked",
  },
  {
    name: "duplicate-id must-FAIL: TASK-913 in todo/ AND in_progress/ (two worktrees' claims merged) -> reported",
    setup: (r) => put(r, "docs/work/in_progress/TASK-913-gamma.md", readFileSync(join(r, "docs/work/todo/TASK-913-gamma.md"), "utf8")),
    run: (r) => duplicateIds(r), expect: ["TASK-913"],
  },
  {
    name: "duplicate-id must-FAIL: a reused id under a different slug -> reported",
    setup: (r) => task(r, "review", "TASK-911", "other-claim", "SPRINT-901"),
    run: (r) => duplicateIds(r), expect: ["TASK-911"],
  },
  {
    name: "duplicate-id: a worktree copy under .claude/worktrees/ is NOT counted",
    setup: (r) => put(r, ".claude/worktrees/agent-x/docs/work/in_progress/TASK-911-alpha.md", readFileSync(join(r, "docs/work/todo/TASK-911-alpha.md"), "utf8")),
    run: (r) => duplicateIds(r), expect: [],
  },
  {
    name: "duplicate-id: prefix-sharing TASK-911 and TASK-9110 are distinct ids",
    setup: (r) => task(r, "todo", "TASK-9110", "prefix", null),
    run: (r) => duplicateIds(r), expect: ["TASK-9110"], // backlog + todo copies of 9110; 911 not confused with it
  },
  {
    name: "return-to-backlog WITHOUT its scope-change entry -> host gate reports MEMBER-DROPPED (skipped if absent)",
    setup: (r) => returnToBacklog(r, "TASK-912", false),
    run: (r) => { const h = hostCheck(r, false); return h === null ? ["MEMBER-DROPPED TASK-912"] : h.filter((f) => f.startsWith("MEMBER-DROPPED")); },
    expect: ["MEMBER-DROPPED TASK-912"],
  },
];
for (const c of CASES) {
  const root = build();
  R.log = [];
  guarded(c.name, () => {
    c.setup?.(root);
    R.log = [];
    expectEq(c.name, c.run(root), c.expect, c.todo);
  });
  rmSync(root, { recursive: true, force: true });
}

// ---------- text contract: the files still state the rules the resolver mirrors ----------
const skill = (rel: string) => readFileSync(join(SKILLS, rel), "utf8").replace(/\r\n/g, "\n");
const CONTRACT: Record<string, string[]> = {
  "orchestrator/SKILL.md": [
    "**members by reference** (ADR-047)", "the `## Members` paths ∪ every `docs/work/*/TASK-*.md` stamped `sprint: SPRINT-NNN`",
    "whose members have an open `## Done when` `[ ]` exists", "tick the **member file's** `## Done when` box",
    "each move in its own commit (ADR-045 D6)", "counted over the members' `## Done when` boxes",
    "every member in `docs/work/done/` or `cancel/`", "`check-sprint-by-reference.ts <sprint> --close`",
    "never edit § Plan",
  ],
  "orchestrator/references/dispatch.md": [
    "## Members by reference", "`TODO.md` is never read", "never\n   `logs/` or `archive/`",
    "resolved **by its TASK id**", "A unit (`### Tn`)\n   is **delivered** when every member its `Cites:` names has no open `## Done when` box",
    "names no current member (all scoped out) is not counted", "appending\n   ` ✓ <evidence>`",
    "in **its own commit**, never\n   sharing one with a content edit", "**Coordinator-owned**",
    "Plain-git fallback", "the task's own content is read from\nthe member file its `Cites:` names",
    "dispatched agent never `git mv`s a task file or ticks a box", "find docs/work -name 'TASK-*.md'",
    "`.claude/worktrees/`\nare excluded by construction", "`DUPLICATE-ID`",
    "**Returning it is a file move by the\ncoordinator**", "`### <date> | scope-change | …`",
    "`git mv docs/work/<status>/TASK-NNN-<slug>.md docs/work/backlog/` in **its own commit**",
    "clear the file's `sprint:` stamp and remove its line from the sprint's `## Members`",
  ],
  "orchestrator/references/night-run.md": [
    "a `TASK-NNN` file in `docs/work/backlog/`", "the files in `docs/work/backlog/` are ungroomed",
    "no active sprint holds the work — no top-level `docs/sprint/SPRINT-*.md` with `status: active` has the task as a member",
    "at least one of its **members** still has an open `## Done when`", "never Plan boxes",
    "counts the `## Done when` boxes across the active sprint's\n**member files**", "retargeted onto member files under TASK-383",
    "`N of M` counts the `## Done when` boxes across the\nsprint's **member files**",
    "a unit is **delivered** when every member its `Cites:` names has no open\n`## Done when` box",
  ],
  "orchestrator/references/review-scoping.md": [
    "resolves **by id** to its task file, `docs/work/*/TASK-NNN-*.md`", "measured against **that file's `## Done when`**",
    "never the Plan block, which carries no DoD",
  ],
};
for (const [rel, phrases] of Object.entries(CONTRACT)) {
  const text = skill(rel);
  const missing = phrases.filter((p) => !text.includes(p));
  check(`text-contract ${rel}`, missing.length === 0, missing.length ? `missing: ${missing.map((m) => J(m)).join(" · ")}` : `${phrases.length} phrases present`);
  const stray = text.split("\n").filter((l) => l.includes("TODO") && !/present and no `docs\/work\/`/.test(l) && !/\bnever\b/.test(l));
  check(`text-contract ${rel} mentions TODO only in the layout rule or a 'never' clause`, stray.length === 0,
    stray.length ? `stray: ${stray.map((l) => J(l.trim().slice(0, 90))).join(" · ")}` : "clean");
}
{
  const lines = skill("orchestrator/SKILL.md").split("\n").length - 1;
  check("text-contract orchestrator/SKILL.md <= 140 lines", lines <= 140, `${lines} lines`);
  check("text-contract dispatch.md duplicate-id command extractable", DUP_CMD.length > 0, J(DUP_CMD));
}

console.log(`orchestrator-store-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
