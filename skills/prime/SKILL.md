---
name: prime
description: Use when starting a new session and want to load project context in a deterministic order — CLAUDE.md, CONTEXT.md, README, MEMORY index, active sprint, ARCHITECTURE map. Emits a health check showing which files were found versus missing. Everything degrades gracefully; nothing aborts. Do not use for mid-session orientation — re-read the specific file instead.
argument-hint: ""
allowed-tools: Read, Glob, Grep
user-invocable: true
version: "0.3.0"
---

# prime

Ordered context loader + health check. One-shot session priming. Read-only — never writes.

## When to invoke

- First action of a fresh session, before any code-touching work.
- After `/clear` to reload context without restarting.
- When the session feels stale and you want to confirm what state you are operating against.

## Read order

Read each that exists, in order. Mark `[OK]` / `[MISSING]` per item. All are optional —
absence is reported, never fatal. Canonical placement (STANDARD §2) is listed first; legacy
locations second. Adapt the globs to the host project's layout.

| # | Path (first match wins) | Purpose |
|---|---|---|
| 1 | `.claude/CLAUDE.md`, `CLAUDE.md` | Project instructions, anti-patterns, conventions |
| 2 | `.claude/CONTEXT.md`, `CONTEXT.md` | Vocabulary · gates · modes (if the project uses one) |
| 3 | `README.md` — *presence-check by default* | Front-door (humans); overlaps 1·2·6 → **full read deferred** (note below) |
| 4 | MEMORY index (harness-resolved; fallback: `memory/MEMORY.md`, `.claude/memory/MEMORY.md`) | Sprint state, feedback, references |
| 5 | `docs/work/`, `TECH-DEBT.md`, `docs/sprint/SPRINT-*.md` | Work-item store + debt ledger — frontmatter + open `- [ ]` items only |
| 6 | `docs/architecture/overview.md`, `docs/ARCHITECTURE.md`, `ARCHITECTURE.md` | Module map / where-things-live (the durable map) |
| 7 | active `docs/epic/EPIC-*.md` (not `archive/`) § Closed when · `docs/product/roadmap.md` (or `docs/roadmap.md`) Delivery-sequence rows | Coverage count (below) |

**README is a fallback (token discipline).** It is the human front-door and overlaps CLAUDE.md (1) +
CONTEXT.md (2) + ARCHITECTURE.md (6). Stat its presence for the health line, but **read its full
content only when CLAUDE.md *or* CONTEXT.md is MISSING** (then it is the best available overview).
Why: the README duplicates CLAUDE.md/CONTEXT.md/ARCHITECTURE.md content, so reading it in full doubles
the priming token cost for near-zero new signal.

**Resolution** (v2 store): backlog = `docs/work/backlog/`. Active sprint = each `docs/sprint/SPRINT-NNN-<slug>.md`
with `status: active` (a multi-stream repo has one per stream) — read only its frontmatter + `## Members`.
Open DoD = count of `- [ ]` lines under `## Done when` in each member's task file — found **by id**
(`docs/work/**/TASK-NNN-*.md`), never by the listed path, which goes stale once a member moves folder — summed per active
sprint (report per stream when more than one, e.g. `Tasks: 5 open (main: 3 · payments: 2)`); no active
sprint → fall back to the backlog.
`TODO.md` present and no `docs/work/` → v1 · both present → mixed · only `docs/work/` → v2 (existence only, never content).
**On v1 or mixed** — prime reports the `Layout:` row `v1 layout → run /lean-doc-generator migrate`, skips the task count, and continues; it never aborts.
**Coverage (read-only count):** an open `- [ ]` § Closed-when item of a `status: active` epic, and a roadmap row with `Status: active`,
is **covered** when its mark names `next slice:`, an open task (outside `done/` · `cancel/`), or (rows) an active `EPIC-NNN`; else
**uncovered**. Count both; `proposed` epics and `planned`/`done` rows exempt. Procedure → `lean-doc-generator/references/epic-coverage.md`.
**Resuming from a `/handoff`?** Also read the handoff doc at the temp path it printed. When its **Uncertain writes** item names one, the `Handoff:` row adds `· uncertain write: <target> → reconcile first` (the row is emitted for this even when no repo-side `handoff` entry exists) and `Next:` leads with reading that target back before any retry (a timeout is not a failure); `none` adds nothing.

**Handoff status (read-only report, SPRINT-094 T2)** — an active sprint's Execution Log, or root
`HANDOFF-LEDGER.md` when none is active, may carry a `handoff` entry (see
`sprint-log.md.template`'s event vocabulary). Report the LATEST such entry's `handoff-status:` —
`live` (not yet resumed), `consumed` (resumed, still open), or none outstanding. Never write it
(that is `/handoff`'s and `/lean-doc-generator close`'s job, not this one's) — priming only surfaces
what a reader would otherwise have to open the temp file, or have been in the session, to know.

## Skill freshness — a report, not a gate

A live session keeps whatever installed copy of a plugin it started with, so a skill edited but not
reinstalled keeps running its **old** procedure — no error, and a diff that reads as if the change was
simply ignored. The fact is never hidden: every skill invocation prints its own base directory, and
that path carries the installed version (`…/<plugin>/<version>/skills/prime`). It just goes unread.

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

1. Read each path in order; track found/missing.
2. From the active task list, count open `- [ ]` tasks — skipped on v1/mixed (§ Resolution layout check).
3. Compare the base-dir version against the plugin manifest — or, with no version segment, the live-checkout row (above).
4. Read the LATEST `handoff` entry (§ Handoff status) — report only, never write.
5. Emit the health report (below) — health check ONLY, no inline file summaries. Its first line — the banner itself — carries the **verdict** (ready · stale · blocked, why in one clause) and the next step, so the reader has both before reading a row.
6. Emit one `Next:` line:
   - open tasks exist → `/orchestrator` to continue — and when those tasks sit in an **active
     sprint** with ≥1 open member `autonomy: AFK` at authority `J0`/`J1`, name `/orchestrator
     sprint-bulk unattended` too (a night run executing the promoted Plan). An all-HITL/J2 sprint gets
     `/orchestrator` alone: an unattended run would park every J2 task and end at AUTHORITY_BOUNDARY
     having done nothing. **Naming it is the whole job:** priming never launches anything; the mode is
     declared at the trigger, and the run is gated by its own pre-flight (`orchestrator/references/night-run.md`)
   - no open tasks but the backlog has `state: ready` tasks → `/lean-doc-generator` to promote / close
   - backlog exists but nothing is `state: ready` (blocked/needs-info/ungroomed) → `/triage` to groom
   - uncovered epic conditions or roadmap rows > 0 → also name `/triage` (it lists them)
   - nothing tracked yet → `/task-decomposer "<intent>"`

## Output format

```
=== PRIME HEALTH: ready — context current; continue the active sprint with /orchestrator ===
[OK]      CLAUDE.md
[OK]      CONTEXT.md
[OK]      README.md
[MISSING] MEMORY index
[OK]      docs/work/
[OK]      ARCHITECTURE.md
Skills:   1.22.0 base-dir == 1.22.0 repo → fresh
Tasks:    3 open
Coverage: 2 uncovered (EPIC-015 ×1 · roadmap P2a) → /triage
Handoff:  live -- docs/sprint/logs/SPRINT-NNN-<slug>.md (not yet resumed)
Next:     /orchestrator — continue the 3 open tasks (or `sprint-bulk unattended` for a night run — only if an open AFK J0/J1 member exists)
```

The `Handoff:` row is omitted only when no `handoff` entry exists anywhere reachable (no active
sprint AND no `HANDOFF-LEDGER.md`) — otherwise report it, including `none outstanding`, so its
absence is never mistaken for "nothing was ever taken."

The `Coverage:` row is omitted only when there is neither an active epic nor a roadmap; otherwise it reports the count, `0 uncovered` included. Prime never edits either.

The `Skills:` row is omitted only when it would be meaningless — no manifest **and** no version in the
base dir; otherwise report it, including `n/a`, so its absence is never mistaken for a pass.

## Red flags

❌ **Reading files outside the declared slots** (beyond a referenced handoff, the plugin manifest the
   freshness row compares against, and the Execution Log / `HANDOFF-LEDGER.md` the Handoff row reads, and the active epics' § Closed when / the roadmap the Coverage row reads)
   — adds noise; not this skill's job.
❌ **Aborting on a missing file** — everything is optional; `[MISSING]` is the correct response.
❌ **Summarizing file contents inline** — emit the health check only; files are already in context for downstream skills.
❌ **Reading a full sprint file** — frontmatter + active section is enough for priming.
❌ **Running mid-task** — this is for session priming; mid-task use signals context drift.
❌ **Writing a `handoff-status:` transition** — priming only reports the latest one; `/handoff` and
   `/lean-doc-generator close` are the only writers.
