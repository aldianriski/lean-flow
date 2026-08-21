---
sprint: 077
slug: the-decisions-epic-004-is-waiting-on
owner: Maintainer
last_updated: 2026-08-21
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-077 — Execution Log

> Append-only companion to [`../SPRINT-077-the-decisions-epic-004-is-waiting-on.md`](../SPRINT-077-the-decisions-epic-004-is-waiting-on.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-21 | promote | Gates signed; the run was requested unattended and refused
The session opened with `/orchestrator sprint-bulk unattended`. **Pre-flight was red and the run was
not spawned.** The blocking finding is the Plan's own shape: both tasks are `class: decision · HITL`
and the sprint carries **zero `AFK]` markers**, so an unattended run's execute-only charter would have
parked 2 of 2 tasks and exited `run · 0 of 9 DoD ticked`. This is L-111's shape — SPRINT-060 promoted
TASK-188 alongside four HITL tasks and foreclosed the only vehicle it had. A partial run was checked
and rejected too: only T1's DoD 2 is additive, and it is inert until DoD 1's spec decision lands.
Re-run attended by owner choice; `gates_signed: G1,G2 @ d004526`.

Also recorded: the session's skills were **1.48.0 against a 1.50.0 repo** (`/prime` reported STALE).
Diffed rather than assumed — `orchestrator/SKILL.md` and all three references are byte-identical once
CRLF is normalised, so the version gap carried **no procedure drift** for this run. Procedures were
read from `skills/` in the repo regardless, not from the plugin cache (L-021).

### 2026-08-21 | surprise | T1's `Layers:` was missing two §2 parsers, one of which fails silent
G1 recon found §2's file tables have **three** positional parsers, not the one T1 declared, and all
three hard-code the same root/`.claude`-vs-`docs/` column offset:

| File | Line | Parse | Declared? |
|---|---|---|---|
| `scripts/lib/conformance-engine.sh` | 977 | `cre = (pfx=="docs/") ? c[6] : c[5]` | yes |
| `scripts/lib/check-doc-caps.sh` | 67 | `cap = (pfx=="docs/") ? c[5] : c[4]` | **no** |
| `evals/run-s2-placement-fixtures.sh` | 69 | `cre = (pfx=="docs/") ? c[6] : c[5]` | **no** |

This matters because the obvious implementation of T1 — giving the root/`.claude/` tables the `Tier`
column the `docs/` tree already has — shifts every column by one and breaks all three. Two of those
breaks are **silent in the L-058 sense**: `check-doc-caps.sh` would read `lean loop` as the Cap cell,
find no integer, and drop every root and `.claude/` row from cap checking *while reporting PASS*; and
`run-s2-placement-fixtures.sh`, the harness meant to guard this, re-derives the required set the same
way the engine does, so it breaks identically rather than catching the break — its only guard is
`n_req >= 5`, which the `docs/` rows alone satisfy.

Per L-100 `Layers:` is a live declaration, not a frozen prediction: **T1 gains
`scripts/lib/check-doc-caps.sh` and `evals/run-s2-placement-fixtures.sh`**. Size re-estimated
**S → M** at G1 (not L, so no split). TD-057's shared `read-spec-files.sh` extraction — three copies
being the actual root cause — was explicitly held **out of scope**, as `conformance-engine.sh`'s own
comment already anticipated.

### 2026-08-21 | progress | G2 ruled: T1 needs no code change at all
The engine's discriminator for "unconditional" is literally the word `always` in §2's `Create ←` cell
(`_s2_rows`: `(cre ~ /always/) ? 1 : 0`). So re-wording the four loop rows' Create cells changes engine
behaviour with **zero code edit and zero column shift** — satisfying DoD 1's *Verify* directly, and
leaving all three parsers correct. `qa-check.sh:577` had already anticipated this exact move in prose.
The `Tier`-column and appended-`Scope`-column designs were both considered and rejected at G2 (the
former for the silent cap hole above; the latter as a fourth field to synchronise where the `docs/`
tier column already expresses the idea).

Cost recorded rather than buried: a row that stops saying `always` becomes conditional, and §2 routes
conditional rows to `S2.F-TIER`, which is unimplemented. Exposure was measured, not assumed — caps
derive from the *Cap* cell so all four keep their cap checks, and `TODO.md` · `.claude/CLAUDE.md` ·
`.claude/CONTEXT.md` are each guarded by three-to-four other checkers. **Only `AGENTS.md` is
engine-only**, so the true loss is one file's existence check until `S2.F-TIER` ships.

Owner rulings taken at G2: T1 → re-word the Create cells; spec bump → **MINOR (0.5.0)**, on the
reading that four rows reclassified unconditional → conditional changes what an adopter satisfies
(§2's own `spec/STANDARD.md` row names *reclassified* as a bump trigger), unlike 0.4.2 which changed
nothing an adopter satisfies. T2 → (a) exclude the three invocation errors; (b) adopt the wider
property, recorded as an amendment naming the prior wording, Retro rather than ADR.
