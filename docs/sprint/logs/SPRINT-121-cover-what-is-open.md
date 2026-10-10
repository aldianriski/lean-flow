---
sprint: 121
slug: cover-what-is-open
owner: Maintainer
last_updated: 2026-10-10
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-121 — Execution Log

> Append-only companion to [`../SPRINT-121-cover-what-is-open.md`](../SPRINT-121-cover-what-is-open.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-10 | promote | plan locked at `4d82a8f`, governance signed, seven members: give every open item a home, run as EPIC-015 Dogfood 1
The backlog held nothing promotable until a full scan, which the owner asked for after a backlog-only triage, found four EPIC-015
conditions with no tasks and four workdoo epics filed in this repository. Two Codex review rounds ranked the work. The owner ruled the
grill (CW6 via a ruling task; CW5 and Dogfood 2 in one overnight run; this sprint as Dogfood 1; the re-armed freeze widened to
governance) and the governance checklist (aging sweep `448641e`; §11 deletion of TD-122/124). TASK-404 was split at size-check so
only its profile (TASK-421) joins. `promote-check.ts` returned 22 pass, 0 fail after two member files' bare filenames were written
as full paths.

System verify at promote (`QA_FULL=1`, VPS fresh clone of `7679f3f6`): `301 pass, 3 fail`, 116 s. That run had two causes.
(1) **This log was absent**: the sprint file said "created lazily", but the night-run rollup leg treats an active sprint without a
log as a FAIL, so this entry creates the log. (2) **The fresh clone had no `node_modules`**, so `typecheck` and
`typecheck-population` could not find `tsc`. That is a property of the run environment, not of the tree, and the re-run installs
dependencies first.

### 2026-10-10 | progress | system verify at promote is green after the log fix
`QA_FULL=1` on a VPS fresh clone of `d38a4f71`, with `bun install --frozen-lockfile` run first: `QA-CHECK: 303 pass, 0 fail`, rc 0,
120 s, read from the run's own `gate121.rc` and `gate121.secs` files. The two typecheck FAILs from the first run were the
environment (no `node_modules` on a fresh clone). The rollup FAIL was the missing log, which the promote entry above created.

### 2026-10-10 | g2 | G1 + G2 signed (owner); every J2 ruling settled up front, all seven tasks re-declared J1 for a continuous run
G1, as a batch: no member is size L. TASK-414, 416, 419 and 420 are `origin: decomposer` and confirmed unchanged. TASK-413, 418 and
421 took the full checklist. TASK-418's scope changed (see the scope-change below). Recon ran before G2: an Explore census of the
62 active learnings, an Explore pass over workdoo's commit gate and epic citations, and the ADR-044/048 Decision diffs.
Owner rulings, taken by popup before execution so that nothing pauses between tasks (Dogfood 1):
- **T1 (TASK-414), pre-delegated:** tick CW6 only if every field maps to a rollup line AND the emitter emits every field on all
  five terminal paths (file:line). Otherwise leave it open and file the gap.
- **T2 (TASK-413), restore + appended correction, for both ADRs:** the engine compares the § Decision BODY against its accepted
  text, so neither a header marker nor `superseded` clears S4.APPEND. Each ADR gets its accepted body restored, a header
  `Corrected:` marker, and an appended dated § Correction that carries today's corrected text.
- **T3 (TASK-421), target rule pre-set:** TASK-404's target is a ≥50% cut of the engine's Windows wall clock, or the measured
  share of the top spawn sites if that is lower. It is recorded in TASK-404 as ruled by this rule.
- **T4 (TASK-419), census approved with the fold rule:** 10 families plus 1 singleton = 62 (A 6 · B 6 · C1 10 · C2 7 · D 5 · E 10 ·
  F 6 · G 4 · H 4 · I 3; L-210 singleton). Members of A, B, C1, C2, D, E and I fold into their existing promoted rule as
  sightings (`disposition: merge`). In F, G and H the newest member survives with the summed count and is listed as a promotion
  candidate. The census's uncertain placements stand. L-198 and L-229 headings say `[status: active]` while their bodies say
  `promoted: yes`, and are repaired.
- **T5 (TASK-420), naming:** each open Closed-when line of an active epic ends with `→ TASK-NNN[, …]` or `→ next slice: <name>`.
  The epic alone holds its coverage, and /triage, /prime and promote read only the epic. There are no positional condition numbers.
- **T6 (TASK-418), move plus an amending ADR:** see the scope-change below.
- **Log-template defect:** filed separately as TASK-422 (`fe339ee`) rather than widening this vehicle.
Waves: T1 and T2 inline, with T3, T4 and T5 dispatched to isolated worktrees in parallel, then T6, then T7. Shared-file owners per
§ Decisions D1/D2. The coordinator owns the sprint file, this Log, member ticks and `git mv`s. Review: T5 gets the Codex loop
(shipped skills/spec). T4 gets a must-FAIL fixture, a run on the real ledger, and a scoped reviewer. T2 and T6 get a scoped
reviewer. T1, T3 and T7 get self-review. Estimated cost: about 1.5–2.5M sub-agent tokens.

### 2026-10-10 | scope-change | TASK-418 (T6) gains an ADR amending ADR-041; T6 Layers widened to `docs/adr/`
What broke: ADR-041's accepted Decision says "lean-flow owns the outcome record — EPIC-016 … workdoo owns the execution record",
and workdoo's `.claude/CLAUDE.md:22` repeats it. The owner's move ruling reverses that, so the move cannot land without a
decision record (L-220: the ADR was read before the option was offered). Impact: T6 writes a new ADR that amends ADR-041 (an
epic's outcome record lives with its execution), adds a `Scope amended by:` header marker to ADR-041, and updates workdoo's
`.claude/CLAUDE.md` and `AGENTS.md`. TASK-418 gains one Done-when box for it, and T6's `Layers:` gains `docs/adr/`. Recon:
workdoo has no attribution gate, no `docs/epic/` and no conformance run, and its 88 citations are bare ids, so there is no id
collision. G2 re-confirmed: owner signed, same popup round.
