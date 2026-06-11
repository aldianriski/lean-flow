---
sprint: 002
slug: dogfood-fixes
owner: Maintainer
last_updated: 2026-06-11
status: closed
plan_commit: 5024bab
close_commit: 007869e
update_trigger: sprint execute/close events
---

# SPRINT-002 — Dogfood Fixes

> **Theme:** Fix the four frictions the first real run surfaced (L-001…004) before any new
> capability. A curated tool earns trust by repairing what its own dogfood exposed — placement,
> grill timing, parallel streams, retention. All four reshape the standard, so they come first.

## Scope

**In:** canonical doc placement + prime/migrate alignment · grill moved to intake · one-sprint-per-stream support · §11 Retention + doc-aging at promote.
**Out (deferred):** `migrate` real-repo test (TASK-003) · council slimming (TASK-005) · hooks / recon / insights (TASK-006…008) · executing the first retention archive on this repo's history (the policy ships in T4; the first archive run happens at a later promote).

## Plan

### T1 — Define canonical doc placement and align prime + migrate `[size: M · risk: low]` — from TASK-009
Layers: `skills/lean-doc-generator/references/DOCS_Guide.md` · `skills/prime/SKILL.md` · `skills/lean-doc-generator/references/migration-map.md` · `skills/lean-doc-generator/SKILL.md` · templates
The standard contradicts its own repo (root vs `docs/`); a Placement column makes the layout canonical and the consumers (prime, migrate, generation) follow it.

**Acceptance:** generated docs land per the placement table; `/prime` finds them first-try; `migrate` relocates legacy layouts.

**DoD:**
- [x] DOCS_Guide §2 gains a Placement column — root: `README` · `TODO` — `.claude/`: `CLAUDE` · `CONTEXT` — `docs/`: the rest
- [x] `/prime` read order lists the `docs/` paths first (first-match-wins)
- [x] migration-map gains relocate rules to the new layout
- [x] lean-doc-generator SKILL + templates reference the canonical paths

### T2 — Move the full grill to task-decomposer intake `[size: M · risk: med]` — from TASK-010
Layers: `skills/task-decomposer/SKILL.md` · `skills/orchestrator/SKILL.md` · `skills/flow/SKILL.md` · `.claude/CONTEXT.md` · `README.md`
Ambiguity is cheapest to kill at intake; the conducted path currently grills nowhere in detail (L-002) because the intake escape hatch and batch-G2 collapse it.

**Acceptance:** a `/flow` run on ambiguous intent triggers the detailed grill at decompose; orchestrator G2 still catches residual open assumptions; cold `quick`/`mvp` keeps a grill path (standalone contract).

**DoD:**
- [x] Grill moves (glossary · sharpen · edge-cases · code cross-ref · prototype/council routing) live in task-decomposer Clarify; escape hatch tightened to zero-open-assumptions
- [x] Orchestrator G2 thinned to a residual grill check
- [x] sprint-bulk batch-G2 grills any task with unconfirmed `assumes:`
- [x] `/flow` + CONTEXT.md + README aligned

### T3 — Support parallel work streams — one sprint per stream `[size: M · risk: med]` — from TASK-011
Layers: `templates/SPRINT.md.template` · `templates/TODO.md.template` · `skills/flow` · `skills/prime` · `skills/orchestrator` · `skills/lean-doc-generator` · `.claude/CONTEXT.md`
Two work streams in one repo currently collide by design (single Active Sprint pointer + one-sprint-at-a-time rule). Streams are additive and optional — single-stream stays the unchanged default.

**Acceptance:** two active sprints with distinct `stream:` coexist; `/prime` reports per stream; a single-stream repo sees zero change.

**DoD:**
- [x] SPRINT frontmatter gains `stream:`; TODO § Active Sprint becomes a per-stream table
- [x] `/flow` rule becomes one-sprint-per-stream; sprint-bulk asks which sprint when >1 active
- [x] `/prime` counts open DoD across all active sprints, reported per stream
- [x] batch-G2 flags cross-stream file overlap (same files → sequence, don't parallel-build)
- [x] Single-stream path verified unchanged

### T4 — Add §11 Retention and wire doc-aging into promote `[size: M · risk: med]` — from TASK-012 · depends-on T1
Layers: `skills/lean-doc-generator/references/DOCS_Guide.md` · `skills/lean-doc-generator/SKILL.md` · templates (TODO · CHANGELOG · LEARNINGS · SPRINT)
LAW 3 promises archive triggers that nowhere exist; the single-file ledgers (TODO, CHANGELOG) bloat in a long agentic loop (L-004). Compress + archive; git history stays the full audit trail.

**Acceptance:** §11 defines the retention rules; promote governance runs doc-aging next to tech-debt aging.

**DoD:**
- [x] §11: TODO pruning — promoted-task tombstones deleted at close · resolved TD rows collapsed after 3 sprints · ~150-line soft cap, flagged at promote
- [x] §11: CHANGELOG rotation — current + previous minor inline; older blocks → `docs/changelog/`
- [x] §11: LEARNINGS collapse-on-promote · closed sprints → `docs/sprint/archive/` + one-line index
- [x] Promote governance runs doc-aging; templates updated

## Decisions (pre-locked)
- **D1** — Grill canonically at *intake* (decomposer), residual at G2 — chosen over patching batch-G2, which fires after tasks are already written. Reversible; no ADR unless implementation surfaces a real trade-off.
- **D2** — Streams are *optional and additive*; the single-stream path stays the untouched default — protects existing adopters.
- **D3** — Retention *compresses + archives*, never rewrites append-only history — git is the audit trail.

## Assumptions
- **A1** — `README` + `TODO` stay at root; `CLAUDE`/`CONTEXT` in `.claude/`. *Confirm: owner — confirmed 2026-06-11 feedback session.*
- **A2** — No adopters depend on root `CHANGELOG`/`LEARNINGS` placement yet (v0.1.0 shipped 2 days ago) — relocation is safe. *Confirm: owner.*

## Execution Log

### 2026-06-11 | promote | sprint planned
Promoted TASK-009…012 (the dogfood-feedback fixes) in dependency order (T4 depends-on T1).
Governance review: `LEARNINGS.md` holds L-001…004, all `count: 1` — none promotable; tech-debt
aging — all rows `build-0`, one sprint old, none aged. Plan frozen.

### 2026-06-11 | T1 complete | canonical placement shipped (`9edab1d`)
G1+G2 approved (owner, incl. A2 confirm + self-apply scope add). Surprise: templates **already**
linked `docs/` paths (`docs/DECISIONS.md`, `docs/CHANGELOG.md`) — only §2 contradicted them, so the
fix was narrower than planned. Scope adds (approved): `release-patch` CHANGELOG detection gets the
canonical path; self-applied to this repo (`git mv DECISIONS.md docs/` + inbound links in
ARCHITECTURE/README/CONTEXT + template relative-link fix). Friction: PowerShell `Get-Content`
round-trip mangled UTF-8 em-dashes in DECISIONS.md — caught by self-review, rewritten via Write.
Versions: prime → 0.2.0, lean-doc-generator → 0.3.0.

### 2026-06-11 | T2 complete | grill relocated to intake (`cc79d82`)
Full moves now in task-decomposer Clarify (+ a new move: a design-that-must-be-felt / high-stakes
fork gets *flagged* on `assumes:` for G2's `/prototype`//`/council` routing, not resolved at intake —
preserves stage separation). Orchestrator G2 → residual grill; open `assumes:`/`needs-info` BLOCKS.
Side benefit: orchestrator 111 → 108 lines (TD-003 pressure eased). Observation for retro:
`.claude/CONTEXT.md` was already over its own 100-line cap (137, now 136) — pre-existing, untouched.
Versions: task-decomposer · orchestrator · flow → 0.2.0.

### 2026-06-11 | T3 complete | parallel streams shipped (`bfaaa97`)
Implemented as per-stream pointer *lines* in TODO § Active Sprint (not a markdown table — pointer
lines match the existing single-stream shape, so the zero-diff guarantee is structural: no `stream:`
field + one unprefixed pointer = exactly today's format). Verified: SPRINT-001/002 + this repo's TODO
parse unchanged. Cross-stream overlap guard lives in batch-G2; sprint selection in the sprint-bulk
guard. Orchestrator stayed at 108 lines (trimmed the T2 mvp footnote to make room).

### 2026-06-11 | T4 complete | §11 Retention shipped
Retention split by when it runs: close-time triggers (tombstone delete · sprint → archive/ + INDEX)
execute in `close`; scan-based triggers (TD collapse · CHANGELOG rotation · LEARNINGS collapse ·
TODO ~150 soft cap) run as **doc-aging** at promote, beside TD aging. Always propose → approve.
§2 ledger rows re-labelled (`append-only · rotated/pruned (§11)`), §7 anti-pattern row added,
4 templates annotated, CONTEXT governance gains the doc-aging line (SSOT). lean-doc-generator →
0.4.0. Per Scope, the first archive run on this repo happens at the *next* promote — not now.

### 2026-06-11 | review + fixes | 7-finder /code-review pass (`007869e`)
Per the G2 review plan: 7 parallel finder agents over the cumulative diff → 6 confirmed findings,
all fixed — §11 INDEX.md line format defined · promote gains the multi-stream which-stream guard ·
README's stale "learnings index in TODO" claim corrected · template path prefixes (`docs/`) on
DECISIONS/LEARNINGS mentions · orchestrator residual-grill parenthetical trimmed (108 → 107 lines).
Notable refuted candidates: ARCHITECTURE template link (resolves correctly from `docs/`), prime's
sprint glob (doesn't descend into `archive/`). CONTEXT.md over-cap → TD-005 at close.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T1 | §2 Place column + canonical-placement rule; §10 routes pathed | Low | grep |
| `skills/prime/SKILL.md` | T1 | read order: canonical paths first | Low | self |
| `skills/lean-doc-generator/references/migration-map.md` | T1 | relocate table for legacy layouts | Low | self |
| `skills/lean-doc-generator/SKILL.md` | T1 | Golden Rule + Write step + retro routing pathed | Low | grep |
| `skills/release-patch/SKILL.md` | T1 | detect `docs/CHANGELOG.md` first | Low | self |
| `docs/DECISIONS.md` (moved from root) | T1 | self-apply placement; relative links fixed | Low | grep |
| `templates/DECISIONS.md.template` | T1 | links relative to docs/ placement | Low | self |
| `docs/ARCHITECTURE.md` · `README.md` · `.claude/CONTEXT.md` | T1 | inbound refs → canonical paths | Low | grep |
| `skills/task-decomposer/SKILL.md` | T2 | Clarify = the full grill (5 moves + tightened escape hatch) | Med | self |
| `skills/orchestrator/SKILL.md` | T2+T3 | G2 → residual grill; batch-G2 grills open `assumes:` + cross-stream overlap; multi-sprint guard | Med | cap check |
| `skills/flow/SKILL.md` | T2+T3 | grill-at-intake note; one-sprint-per-stream rule | Low | self |
| `.claude/CONTEXT.md` · `README.md` | T2+T4 | grill placement + doc-aging (SSOT) | Low | grep |
| `templates/SPRINT.md.template` · `templates/TODO.md.template` | T3+T4 | `stream:` field · per-stream pointers · retention comments | Low | zero-diff check |
| `skills/prime/SKILL.md` | T3 | count DoD across active sprints, per stream | Low | self |
| `skills/lean-doc-generator/SKILL.md` | T3+T4 | per-stream promote/close · close-time retention · doc-aging | Med | self |
| `references/DOCS_Guide.md` | T4 | §11 Retention; §2 ledger labels; §7 row | Med | self |
| `templates/CHANGELOG.md.template` · `templates/LEARNINGS.md.template` | T4 | rotation / collapse annotations | Low | self |

## Retro

**Worked**
- Sequential T1→T4 with per-task commit + log entry; the heavy file overlap made the no-`/batch` call right.
- The end-of-sprint `/code-review` pass earned its keep: 7 finders → 6 real fixes, including two spec gaps (INDEX format, promote stream guard) no single pass had caught.
- Self-applying the standard (T1) surfaced that the templates *already* encoded `docs/` placement — the standard was the outlier, exactly the L-001 thesis.

**Friction**
- PowerShell `Get-Content`→`Set-Content` round-trip corrupted UTF-8 em-dashes in DECISIONS.md → **L-005**.
- An Edit on this sprint file swallowed the `## Files Changed` heading (old_string didn't preserve what it replaced) — caught one edit later.
- `.claude/CONTEXT.md` stands at ~137 lines against its own 100 cap (pre-existing, +4 this sprint) → **TD-005**.

**Pattern candidate** (→ `docs/LEARNINGS.md`)
- Shell text pipelines are unsafe for UTF-8 markdown edits; use Write/Edit tools (L-005, count 1).

**Bucket routing (§10):** Shipped → `docs/CHANGELOG.md` (Sprint 002 block) · Tech debt → **TD-005** (CONTEXT over cap) · Follow-ups → none new (TASK-003 · 005–008 already tracked) · Learnings → **L-005**. **Close-time retention (§11, first run):** Backlog tombstones deleted · this file → `docs/sprint/archive/` + `docs/sprint/INDEX.md` line. SPRINT-001 archives at the next promote's doc-aging.
