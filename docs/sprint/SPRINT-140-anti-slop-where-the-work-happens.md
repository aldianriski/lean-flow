---
sprint: 140
slug: anti-slop-where-the-work-happens
owner: Maintainer
last_updated: 2026-10-25
status: active
update_trigger: sprint execute/close events
---

# SPRINT-140 — Anti-Slop Where the Work Happens

> **Theme:** SPRINT-139 taught every writing job to strip AI tells from prose. Code and UI still have no equivalent: no builder
> skill mentions comments, and a UI change reaches review with no check for states, keyboard, narrow widths or contrast.
> This sprint takes what anti-slop (`miqdadbadjuber/anti-slop` @ `4ca3b11c`) has that lean-flow lacks, and only that:
> code-slop tells, five copy patterns, an audit mode, a UI floor that defers to anti-slop when it is installed, honest
> prototype placeholders and a DESIGN direction field. It also cuts CLAUDE.md back to rule plus pointer, the same
> "value is not length" lesson applied to the file every session loads. It opens with the three learnings due at this promote.

## Scope

**In:** promote L-237 · L-240 · L-241 (T1) · code-slop tells for builders and the self-review floor (T2) · humanizer
overlay patterns (T3), audit mode (T4) and Grep counts of mechanical tells (T5) · a UI floor in review routing (T6) ·
honest `/prototype` placeholders (T7) · a DESIGN template direction field (T8) · CLAUDE.md compaction and a token-budget
ratchet (T9).
**Out (deferred):** importing anti-slop's rulebook or its UI, accessibility and mobile pattern lists (point to the plugin
instead) · a per-line character cap (ADR-048's token budget covers it) · TASK-507 (cross-OS CI, parked `needs-info`) ·
TASK-367 and TASK-402 (blocked) · TASK-489 (owner decision) · TASK-498 (blocked on upstream) · any new gate leg, checker,
ledger or ledger field · writing anything in `D:\Project\workdoo`.

## Members

- docs/work/todo/TASK-508-promote-l-237-l-240-l-241.md
- docs/work/todo/TASK-499-code-slop-tells-for-builders.md
- docs/work/todo/TASK-500-humanizer-overlay-patterns.md
- docs/work/todo/TASK-501-humanizer-audit-mode.md
- docs/work/todo/TASK-502-humanizer-grep-mechanical-tells.md
- docs/work/todo/TASK-503-ui-floor-in-review-routing.md
- docs/work/todo/TASK-504-prototype-honest-placeholders.md
- docs/work/todo/TASK-505-design-template-direction.md
- docs/work/todo/TASK-506-compact-claude-md-to-rule-plus-pointer.md

## Plan

### T1 — Promote L-237, L-240 and L-241 `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/builder-check.md` · `docs/LEARNINGS.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-508-promote-l-237-l-240-l-241.md`
  · `docs/work/in_progress/TASK-508-promote-l-237-l-240-l-241.md`
  · `docs/work/done/TASK-508-promote-l-237-l-240-l-241.md`
Depends-on: none
Cites: `TASK-508` · L-237 · L-240 · L-241 · STANDARD §10

All three reached count 2 at this promote. The two G2 rules go to the G2 gate's reader procedure; L-241 goes to the
consumer-side durable rules. Shipped skill: Codex loop.

**Acceptance:** each entry is `[status: promoted]` with a pointer and a disposition, and its rule reads where its flow runs.

### T2 — Give builders and the self-review floor the code-slop tells `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/references/dispatch.md`
  · `skills/tdd/SKILL.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-499-code-slop-tells-for-builders.md`
  · `docs/work/in_progress/TASK-499-code-slop-tells-for-builders.md`
  · `docs/work/done/TASK-499-code-slop-tells-for-builders.md`
Depends-on: T1
Cites: `TASK-499` · `orchestrator/references/review-scoping.md` · anti-slop `skills/antislop-code/SKILL.md` @ `4ca3b11c` · L-020 · L-015

No builder-facing skill mentions code comments today. The list lives once in the self-review checklist; the builder brief
and `/tdd` refactor each point at it. Shipped skill: Codex loop.

**Acceptance:** a real dispatch brief and a real `/tdd` refactor step each surface the list, and a run over `scripts/`
records its findings.

### T3 — Add the humanizer overlay patterns `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/humanizer/references/patterns-lf.md` · `skills/humanizer/SKILL.md` · `skills/humanizer/references/embedded.md`
  · `CHANGELOG.md`
  · `docs/work/todo/TASK-500-humanizer-overlay-patterns.md`
  · `docs/work/in_progress/TASK-500-humanizer-overlay-patterns.md`
  · `docs/work/done/TASK-500-humanizer-overlay-patterns.md`
Depends-on: T2
Cites: `TASK-500` · `references/embedded.md` · `patterns-en.md` · TASK-498 · anti-slop `skills/antislop-copywriting/SKILL.md` @ `4ca3b11c`

Five copy patterns the vendored catalog lacks, in a file lean-flow owns so the upstream copy stays verbatim. Both the
standalone and the embedded paths must read it. Shipped skill: Codex loop.

**Acceptance:** one text carrying all five patterns is caught in both modes, and `patterns-en.md` is byte-unchanged.

### T4 — Add humanizer's explicit-request audit mode `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/humanizer/SKILL.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-501-humanizer-audit-mode.md`
  · `docs/work/in_progress/TASK-501-humanizer-audit-mode.md`
  · `docs/work/done/TASK-501-humanizer-audit-mode.md`
Depends-on: T3
Cites: `TASK-501` · anti-slop `skills/antislop/SKILL.md` § Two Usage Modes @ `4ca3b11c`

A long file today gets one all-or-nothing rewrite. Audit lists numbered findings, strongest first, and only the picked
ones change. Shipped skill: Codex loop.

**Acceptance:** an audit and a partial pick on a real prose file leave every unpicked span byte-unchanged.

### T5 — Count mechanical tells with Grep in humanizer's check step `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/humanizer/SKILL.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-502-humanizer-grep-mechanical-tells.md`
  · `docs/work/in_progress/TASK-502-humanizer-grep-mechanical-tells.md`
  · `docs/work/done/TASK-502-humanizer-grep-mechanical-tells.md`
Depends-on: T4
Cites: `TASK-502`

Dashes, bold labels and curly quotes are character patterns a search finds exactly, so step 6 stops reading for them.

**Acceptance:** the reported before → after counts on a real text match an independent count.

### T6 — Add a UI floor to review routing `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/review-scoping.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-503-ui-floor-in-review-routing.md`
  · `docs/work/in_progress/TASK-503-ui-floor-in-review-routing.md`
  · `docs/work/done/TASK-503-ui-floor-in-review-routing.md`
Depends-on: T2
Cites: `TASK-503` · anti-slop `skills/antislop/SKILL.md` § Delivery Gate @ `4ca3b11c` · L-015

A UI change routes to `/run` + `/verify` with nothing naming states, keyboard, narrow widths or contrast. The floor keys on
consequence, not file type, and hands over to anti-slop's own report when that skill is present. Shipped skill: Codex loop.

**Acceptance:** one UI change in the workdoo research copy is reviewed with and without anti-slop present, both reports
recorded.

### T7 — Make /prototype UI variants use honest placeholders `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/prototype/references/ui.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-504-prototype-honest-placeholders.md`
  · `docs/work/in_progress/TASK-504-prototype-honest-placeholders.md`
  · `docs/work/done/TASK-504-prototype-honest-placeholders.md`
Depends-on: T6
Cites: `TASK-504` · `references/ui.md` · anti-slop `skills/antislop-ui/SKILL.md` § App & Dashboard @ `4ca3b11c`

Variants are asked to be "radically different" but nothing stops invented numbers or the default dashboard shell.

**Acceptance:** a three-variant prototype in the workdoo research copy carries no invented values.

### T8 — Give the DESIGN template an owner-supplied direction field `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/templates/DESIGN.md.template` · `skills/lean-doc-generator/SKILL.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-505-design-template-direction.md`
  · `docs/work/in_progress/TASK-505-design-template-direction.md`
  · `docs/work/done/TASK-505-design-template-direction.md`
Depends-on: T7
Cites: `TASK-505` · `check-count-claims.sh` · anti-slop R-37 @ `4ca3b11c`

Direction is the owner's to supply; an agent that writes it produces the default look the filter exists to remove.

**Acceptance:** the template renders once from owner-supplied answers, and the template count stays 36.

### T9 — Compact CLAUDE.md to rule plus pointer and ratchet the token budget `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `.claude/CLAUDE.md` · `docs/LEARNINGS.md` · `scripts/lib/token-budget.txt` · `docs/research/logs/token-calibration.md`
  · `docs/work/todo/TASK-506-compact-claude-md-to-rule-plus-pointer.md`
  · `docs/work/in_progress/TASK-506-compact-claude-md-to-rule-plus-pointer.md`
  · `docs/work/done/TASK-506-compact-claude-md-to-rule-plus-pointer.md`
Depends-on: T1 · T8
Cites: `TASK-506` · `check-count-claims.sh` · ADR-048 · L-117 · L-210

CLAUDE.md is 80 lines but 2,432 words, longest line 3,678 chars, loaded every session. The stories move to their L-NNN
entries; the rules stay.

**Acceptance:** every bullet is rule plus pointer, the count claims still check out, and the lowered budget passes.

## Owner-action checklist

- [ ] T4 · T9: read the result before close (audit-mode findings shape; the compacted CLAUDE.md).
- [ ] Close: push the release.

## Decisions (pre-locked)

- **D1** — The chain is linear because tasks share files: `review-scoping.md` T2→T6; `skills/humanizer/SKILL.md` T3→T5;
  `docs/LEARNINGS.md` T1→T9. `CHANGELOG.md` is written in task order; status moves, log and sprint-file edits commit as bare
  `sprint(140):` (L-238). Execution is sequential in the main tree.
- **D2** — One `consequence · Tn ·` line per task in this sprint's log (SPRINT-137 T3).
- **D3** — Every task that changes a shipped skill takes the Codex review → fix → re-review loop; review cap 2 rounds, a
  third only by owner ruling.
- **D4** — Curated, not copied: no anti-slop text is vendored. Each task writes lean-flow's own wording and cites the source
  file at `4ca3b11c`.
- **D5** — Every agent brief this sprint writes names secret files as off-limits (L-247).
- **D6** — The release is a MINOR (2.16.0) bumped by hand at close; release-patch is PATCH-only.

## Assumptions

- **A1** — `orchestrator/SKILL.md` and `lean-doc-generator/SKILL.md` are at 140 lines and `.claude/CLAUDE.md` at 80 (measured
  2026-10-25); a task that adds to one compresses a line to stay at the cap. *Confirm: `check-doc-caps.ts` at each review.*
- **A2** — Consumer-path exercises run in the `D:\Research\workdoo` copy (snapshot and revert), never in `D:\Project\workdoo`.
  *Confirm: T2 · T6 · T7 · T8 G2.*
- **A3** — "anti-slop installed" is detected from the session's skill listing. *Confirm: T6 G2.*
- **A4** — T2's run over `scripts/` records findings in the log; a comment fix landing there would touch files outside
  `Layers:`, so it goes through a `scope-change` first. *Confirm: T2 G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-140-anti-slop-where-the-work-happens.md`](logs/SPRINT-140-anti-slop-where-the-work-happens.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
