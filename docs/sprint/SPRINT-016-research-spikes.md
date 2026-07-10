---
sprint: 016
slug: research-spikes
owner: Maintainer
last_updated: 2026-07-10
status: active
plan_commit: 2f69b7b
close_commit: pending
update_trigger: sprint execute/close events
---

# SPRINT-016 — Research Spikes

> **Theme:** Clear the cheap research/decision backlog before the next build sprint. Two external-tool
> scans (structarmed, obra brainstorming) evaluated against curated-not-copied, and the init-vs-migrate
> decision that **unblocks TASK-052**. Docs-only, parallel, no code — decisions in, build tasks out.

## Scope

**In:**
- structarmed repo scanned → keepers/rejects doc (T1).
- obra `brainstorming` skill evaluated → keepers/rejects doc (T2).
- `init` (new-repo adaptation) decision recorded, resolving the init↔migrate split (T3).

**Out (deferred):** *building* anything the scans surface (each files a follow-up build `TASK-NNN`
only for what clears the bar) · TASK-052 migrate-sync build (gated on T3's decision) · TASK-056
recon+tiers (wants a `/council` call first).

## Plan

### T1 — Scan structarmed for adaptable patterns `[size: S · risk: low]`  *(TASK-049)*
Layers: `docs/research/structarmed-adaptation.md`
Evaluate github.com/boundwize/structarmed against the curated-not-copied bar (useful **and** important
**and** actually-used), mirroring the bmad scan. If the repo can't be fetched, ask the user to paste.

**Acceptance:** `docs/research/structarmed-adaptation.md` lists keepers vs rejects with a one-line
rationale each; any keeper becomes a filed follow-up `TASK-NNN`, nothing built inline.

**DoD:**
- [x] research doc written (ADR-009 frontmatter: id/tags/domain/status) — keepers vs rejects
- [x] each keeper → a filed follow-up TASK (**no keepers** — domain mismatch, stated explicitly)
- [x] knowledge-index regenerated (`sh scripts/gen-index.sh`); qa-check passes

### T2 — Evaluate the obra `brainstorming` skill `[size: S · risk: low]`  *(TASK-050)*
Layers: `docs/research/brainstorming-adaptation.md`
Evaluate the obra superpowers `brainstorming` skill (crossaitools.com/skills/obra/superpowers/
brainstorming) — **evaluate-first per curated-not-copied** (your call at intake), do NOT build. If the
page can't be fetched, ask the user to paste.

**Acceptance:** `docs/research/brainstorming-adaptation.md` — keepers/rejects; a follow-up build task
filed ONLY for what clears the useful+important+used bar.

**DoD:**
- [x] research doc written (ADR-009 frontmatter) — keepers vs rejects vs "adapt as X"
- [x] follow-up build TASK filed only for cleared keepers (**TASK-058** — K1/K2 fold)
- [x] knowledge-index regenerated; qa-check passes *(doc + index clean; the lone 47/1 FAIL is a pre-existing empty untracked `docs/research/mattpocock.md` — owner's file, left untouched per instruction)*

### T3 — Decide whether lean-flow needs an `init` `[size: M · risk: med]`  *(TASK-051)*
Layers: `docs/adr/` (if adopted) or a research note · resolves the split with TASK-052
Decide whether to add an `init`/onboarding command that scaffolds a *fresh* repo's context docs
(+ optional `.claude/settings.json` safe-command allowlist) — the greenfield twin of `migrate`. This
is a scope-addition fork; record the decision (ADR if it qualifies — hard-to-reverse + surprising +
a real trade-off) and pin the init↔migrate boundary so TASK-052 can proceed unambiguously.

**Acceptance:** a recorded decision (ADR or research note) stating yes/no on `init`, and — if yes —
its boundary vs `migrate`; TASK-052's scope is unblocked either way.

**DoD:**
- [ ] decision recorded (ADR-NNN or `docs/research/init-vs-migrate.md`), with the WHY
- [ ] init↔migrate boundary pinned; TASK-052 updated (`assumes`/`state`) to reflect it
- [ ] do NOT build settings.json scaffolding — decision only (within-task guard)

## Owner-action checklist
- (none — but T1/T2 may need the user to paste repo/page content if external fetch is unavailable)

## Decisions (pre-locked)
- **D1 — No shared-file overlap.** T1·T2·T3 each write a distinct `docs/research/…` (or `docs/adr/`)
  file → fully parallel, no ownership contention (contrast SPRINT-015). `/batch`-eligible but small
  enough to run inline.
- **D2 — Evaluate-first, build-never.** T1·T2 produce keeper/reject verdicts only; any build is a
  separately-filed follow-up (curated-not-copied — nothing ships from a scan un-reviewed).

## Assumptions
- **A1** — structarmed (T1) + the obra brainstorming page (T2) are fetchable this session; if not,
  degrade to user-paste. *Confirm: at each task's start.*
- **A2** — T3 is a lighter scope-decision, not an agent-free-core fork, so an ADR/note suffices over a
  full `/council`. *Confirm: if the decision turns genuinely hard-to-reverse, escalate to `/council`.*

## Execution Log

### 2026-07-10 | promote | plan locked
Formed after SPRINT-015 close + the TODO doc-aging pass. Chosen over the P2 batch because T3 (init
decision) unblocks TASK-052 and TASK-056 still needs a `/council` call. No shared-file overlap (D1).

### 2026-07-10 | T1 done | structarmed scan → 0 keepers
Recon (cheap-tier Explore) found structarmed is a **PHP architecture-enforcement linter**
(Deptrac-class), not an AI-workflow framework — domain mismatch. `docs/research/structarmed-adaptation.md`
records the reject rationale; the one adjacent idea (gate-as-code enforcement) is already TASK-006. No
follow-up filed. qa-check 48/0.

### 2026-07-10 | T2 done | brainstorming eval → reject-the-skill, 2 micro-keepers
Recon (cheap-tier Explore) pulled the real `obra/superpowers` SKILL.md. Curated-not-copied judgment:
~90% of its discipline already lives in lean-flow (G2 gate · decomposer grill + popups · /prototype ·
/council · YAGNI · self-review) → **no standalone skill** (would be a 15th skill on owned ground).
Kept K1 ("too simple to need design" anti-pattern) + K2 (section-by-section approval) → **TASK-058**
filed. Rejected the visual-companion browser server as scaffold. `docs/research/brainstorming-adaptation.md`.
**qa note:** doc + regenerated index are clean; the 47/1 lint FAIL is the owner's pre-existing empty
`docs/research/mattpocock.md` (untracked, left untouched per owner instruction — not this sprint's).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro
<!-- Written at close. Route buckets (DOCS_Guide §10): shipped → CHANGELOG · tech debt → TD-NNN ·
     follow-ups → TASK-NNN · learnings → LEARNINGS. Then archive → docs/sprint/archive/ + INDEX line. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-
