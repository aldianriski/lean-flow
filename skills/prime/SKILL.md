---
name: prime
description: Use at session start for a light health report and next step. Check project instructions, context, README, memory, work and architecture sources; read CONTEXT in full and defer the architecture map to the stage that needs it. Missing files never abort. Do not use for mid-session orientation — read the needed source instead.
argument-hint: ""
allowed-tools: Read, Glob, Grep
user-invocable: true
version: "0.3.0"
---

# prime

Ordered presence/status check + next step. One-shot session priming. Read-only — never writes.

## When to invoke

- First action of a fresh session, before any code-touching work.
- After `/clear` to reload context without restarting.
- When the session feels stale and you want to confirm what state you are operating against.

## Check order

Check each slot in order; read only as specified below. `[OK]` means found; slots 1, 2 and 4 are also loaded. All are optional —
absence is reported, never fatal. Canonical placement (STANDARD §2) is listed first; legacy
locations second. Adapt the globs to the host project's layout.

| # | Path (first match wins) | Purpose |
|---|---|---|
| 1 | `.claude/CLAUDE.md`, `CLAUDE.md` | Read project instructions unless already loaded by the host |
| 2 | `.claude/CONTEXT.md`, `CONTEXT.md` | Read in full: vocabulary · gates · sprint rules · modes, which every stage obeys (if the project uses one) |
| 3 | `README.md` — *presence-check by default* | Front-door (humans); overlaps 1·2·6 → **full read deferred** (note below) |
| 4 | MEMORY index (harness-resolved; fallback: `memory/MEMORY.md`, `.claude/memory/MEMORY.md`) | Read the index for sprint state, feedback, references |
| 5 | `docs/work/`, `TECH-DEBT.md`, `docs/sprint/SPRINT-*.md` | Work-item store (incl. `type:`) + debt ledger — frontmatter + open `- [ ]` items only |
| 6 | `docs/architecture/overview.md`, `docs/ARCHITECTURE.md`, `ARCHITECTURE.md` | Presence + narrow `## Stack` heading search only; defer the module map |
| 7 | active `docs/epic/EPIC-*.md` (not `archive/`) § Closed when · `docs/product/roadmap.md` (or `docs/roadmap.md`) Delivery-sequence rows | Coverage count (below) |

**README fallback.** Report its presence; read it in full only when CLAUDE.md or CONTEXT.md is missing. Stages load their own facts even without `/prime`.

**Resolution** (v2 store): backlog = `docs/work/backlog/`. Active sprint = each `docs/sprint/SPRINT-NNN-<slug>.md`
with `status: active` (a multi-stream repo has one per stream) — read only its frontmatter + `## Members`. Open bugs = `type: bug` items outside `done/`·`cancel/`, oldest = lowest id.
Open DoD = count of `- [ ]` lines under `## Done when` in each member's task file — found **by id**
(`docs/work/**/TASK-NNN-*.md`), never by the listed path, which goes stale once a member moves folder — summed per active
sprint (report per stream when more than one, e.g. `Tasks: 5 open (main: 3 · payments: 2)`); no active
sprint → fall back to the backlog.
`TODO.md` present and no `docs/work/` → v1 · both present → mixed · only `docs/work/` → v2 (existence only, never content).
**On v1 or mixed** — prime reports the `Layout:` row `v1 layout → run /lean-doc-generator migrate`, skips the task count, and continues; it never aborts.
**Coverage (read-only count):** an open `- [ ]` § Closed-when item of a `status: active` epic, and a roadmap row with `Status: active`,
is **covered** when its mark names `next slice:`, an open task (outside `done/` · `cancel/`), or (rows) an active `EPIC-NNN`; else
**uncovered**. Count both; `proposed` epics and `planned`/`done` rows exempt. Procedure → `lean-doc-generator/references/epic-coverage.md`.
**Resuming from a `/handoff`?** Resolve a live stub's `handoff-path` and read that temp doc (or the supplied path when no stub exists). When its **Uncertain writes** item names one, the `Handoff:` row adds `· uncertain write: <target> → reconcile first` (even with no repo-side entry) and `Next:` leads with reading that target back before any retry or question handling (a timeout is not a failure); `none` adds nothing.

**Handoff status (read-only).** Read the LATEST `handoff` entry in each active sprint Execution Log and
root `HANDOFF-LEDGER.md`. A handoff belongs to a sprint when the session focus names its member;
other handoffs go in the ledger. Report each latest `handoff-status:`: `live` (not resumed),
`consumed` (resumed, open), or none outstanding. Never write it; `/handoff` and `/lean-doc-generator close` own transitions.

**Questions before mode advice.** From the latest run's readable live handoff, surface its **Blockers / open questions** ready frontier as a `Questions:` digest leading `Next:` after any uncertain-write reconciliation. If that run has no handoff (absent, denied or unreadable), use its newest `### <date> | progress | open questions at exit` Log entry; never substitute an older run's live stub.
A later `… | questions answered` entry or a newer `open questions at exit` retires the older digest, including a stale handoff's copy; no other entry does, including that run's handoff stub, progress or rollup. Prefer the newer digest if one supersedes the handoff. Read only these entries for this recovery; show question + recommendation, never ask or write answers. The resuming session records answers per `orchestrator/references/sprint-bulk-run.md` § Runtime; an empty (`none`) frontier adds no Questions digest.

## Skill freshness — a report, not a gate

A live session retains its starting plugin copy. The invocation's base directory (`…/<plugin>/<version>/skills/prime`) exposes its installed version.

Compare that version against the host repo's plugin manifest (`.claude-plugin/plugin.json`, first
match; a project that vendors its own plugin may place it elsewhere — adapt the glob):

| Condition | Row |
|---|---|
| base dir has no `<version>/` segment (ends `…/skills/prime` — `--plugin-dir <repo>`, a live checkout) | `<v> live checkout → fresh` — read `<base-dir>/../../.claude-plugin/plugin.json`; no separate installed copy exists, so it cannot be stale |
| versions equal | `<v> base-dir == <v> repo → fresh` |
| versions differ | `<installed> base-dir != <repo> repo → STALE, reinstall before trusting any procedure` |
| no manifest — the ordinary consumer, who never checked the plugin out | `n/a (no local plugin repo)` |

**Never block on it.** Priming is read-only and reports; whether a stale procedure is acceptable is the
session's call. One row covers every skill (one version-scoped root). Out of scope: a skill edited
*without* a version bump still reads `fresh` — only the version string is compared.

## Steps

1. Check each slot in order; track found/missing. Read slot 2 in full. Never full-read the architecture map for priming; use Grep for the slot-6 `^## Stack\b` heading check.
2. From the active task list, count open `- [ ]` tasks — skipped on v1/mixed (§ Resolution layout check).
3. Compare the base-dir version against the plugin manifest — or, with no version segment, the live-checkout row (above).
4. Read the LATEST `handoff` entry (§ Handoff status), resolve its live path and recover questions (§ Questions before mode advice) — report only, never write.
5. Emit the health report (below) — health check ONLY, no inline file summaries. Its first line — the banner itself — carries the **verdict** (ready · stale · blocked, why in one clause) and the next step, so the reader has both before reading a row.
6. Emit one `Next:` line: uncertain-write reconciliation first, then any `Questions:` digest (§ above), then the advice below:
   - open members in an **active sprint** → name the mode `orchestrator/references/mode-choice.md` recommends from prime's allowed entry facts (member frontmatter + open-DoD counts). Advice only: name unknown facts for intake confirmation; priming never asks or launches. Other open work → `/orchestrator` intake.
   - no open tasks but the backlog has `state: ready` tasks → `/lean-doc-generator` to promote / close
   - backlog exists but nothing is `state: ready` (blocked/needs-info/ungroomed) → `/triage` to groom
   - uncovered epic conditions or roadmap rows > 0 → also name `/triage` (it lists them)
   - **unprofiled** (slots already checked, never a new file: none of slots 1·2·6 exists → `/lean-doc-generator init`; else the heading search finds no `## Stack` in slot 6, or no slot-6 file → `migrate`) → with work tracked, also name that command;
     with nothing tracked, it is the `Next:` instead of `/task-decomposer`. Name it, never run it; on a v1/mixed layout skip this bullet and the next (the `Layout:` row's migrate is the `Next:`)
   - nothing tracked yet, profiled → `/task-decomposer "<intent>"`

## Output format

```
=== PRIME HEALTH: ready — sources found; continue the active sprint with /orchestrator ===
[OK]      CLAUDE.md
[OK]      CONTEXT.md
[OK]      README.md
[MISSING] MEMORY index
[OK]      docs/work/
[OK]      ARCHITECTURE.md
Skills:   1.22.0 base-dir == 1.22.0 repo → fresh
Tasks:    3 open · bugs: 1 open (oldest TASK-NNN)
Coverage: 2 uncovered (EPIC-015 ×1 · roadmap P2a) → /triage
Handoff:  live -- docs/sprint/logs/SPRINT-NNN-<slug>.md (not yet resumed)
Next:     /orchestrator sprint-bulk — 3 open members; attended advice pending intake's readiness check (mode-choice.md)
```

The `Handoff:` row is omitted only when no `handoff` entry exists anywhere reachable (neither an active
sprint's Log nor a `HANDOFF-LEDGER.md` carries one) — otherwise report it, including `none outstanding`, so its
absence is never mistaken for "nothing was ever taken."

The `Coverage:` row is omitted only when there is neither an active epic nor a roadmap; otherwise it reports the count, `0 uncovered` included. Prime never edits either.

The `Skills:` row is omitted only when it would be meaningless — no manifest **and** no version in the
base dir; otherwise report it, including `n/a`, so its absence is never mistaken for a pass.

## Red flags

❌ **Reading files outside the declared slots** (beyond a referenced handoff, the plugin manifest the
   freshness row compares against, `orchestrator/references/mode-choice.md` for advice, and the Execution Log / `HANDOFF-LEDGER.md` the Handoff row reads, and the active epics' § Closed when / the roadmap the Coverage row reads)
   — adds noise; not this skill's job.
❌ **Aborting on a missing file** — everything is optional; `[MISSING]` is the correct response.
❌ **Treating presence as loaded context** — emit the health check only; each downstream stage reads its own required sources, including when invoked without `/prime`.
❌ **Reading a full sprint file** — frontmatter + active section is enough for priming.
❌ **Running mid-task** — this is for session priming; mid-task use signals context drift.
❌ **Writing a `handoff-status:` transition** — priming only reports the latest one; `/handoff` and
   `/lean-doc-generator close` are the only writers.
