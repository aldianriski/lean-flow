---
sprint: 139
slug: humanize-every-writing-job
owner: Maintainer
last_updated: 2026-10-24
status: active
update_trigger: sprint execute/close events
---

# SPRINT-139 — Humanize Every Writing Job

> **Theme:** lean-flow writes docs, CHANGELOG entries, handoffs, commits and PR bodies, and nothing checks that prose for AI
> tells. This sprint ships `/humanizer`: upstream's 26-pattern English catalog vendored after a per-pattern review, an
> Indonesian layer that keeps English terms where the KBBI coinage is uncommon (error, not galat), and translation on request.
> It is wired into every writing job through a child-context contract. First, every agent brief learns to keep out of secret
> files (L-247), so the new humanizer brief inherits that. Each change is checked from the consumer's side, on an installed
> copy in a repo that is not lean-flow.

## Scope

**In:** agent briefs name secret files off-limits (T1) · `/humanizer` standalone with the English catalog (T2) · the
Indonesian slop and term-policy catalog (T3) · on-request EN↔ID translation (T4) · the embedded child-context contract and the
lean-doc-generator wiring (T5) · release-patch and handoff wiring (T6) · commit and PR-body wiring (T7) · one MINOR release
and the consumer-path proof (T8).
**Out (deferred):** rewriting existing lean-flow docs through humanizer (only new writing passes through it) · automatic sync
with upstream · any new gate leg, checker, ledger or ledger field · TASK-367 and TASK-402 (blocked) · TASK-489 (owner decision)
· writing anything in workdoo.

## Members

- docs/work/todo/TASK-497-agent-briefs-name-secret-files-off-limits.md
- docs/work/todo/TASK-490-ship-humanizer-standalone-with-english-catalog.md
- docs/work/todo/TASK-491-add-indonesian-slop-and-term-policy-catalog.md
- docs/work/todo/TASK-492-add-on-request-en-id-translate-mode.md
- docs/work/todo/TASK-493-define-embedded-contract-and-wire-lean-doc-generator.md
- docs/work/todo/TASK-494-wire-humanizer-into-release-patch-and-handoff.md
- docs/work/todo/TASK-495-wire-humanizer-into-commit-messages-and-pr-bodies.md
- docs/work/todo/TASK-496-release-humanizer-set-and-verify-consumer-path.md

## Plan

### T1 — Agent briefs name secret files off-limits `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/dispatch.md` · `skills/task-decomposer/SKILL.md` · `docs/LEARNINGS.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-497-agent-briefs-name-secret-files-off-limits.md`
  · `docs/work/in_progress/TASK-497-agent-briefs-name-secret-files-off-limits.md`
  · `docs/work/done/TASK-497-agent-briefs-name-secret-files-off-limits.md`
Depends-on: none
Cites: `TASK-497` · L-247 · L-239

Promotes L-247 (count 2) by the owner's ruling at this promote. The census of brief sites comes first; `Layers:` is amended
by `scope-change` if it finds a site outside the list. Shipped skill: Codex loop.

**Acceptance:** a real orchestrator dispatch brief and a real task-decomposer recon brief each forbid opening secret files.

### T2 — Ship /humanizer standalone with the English catalog `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/humanizer/SKILL.md` · `skills/humanizer/references/patterns-en.md` · `.claude/CONTEXT.md` · `README.md`
  · `.claude/CLAUDE.md` · `docs/architecture/overview.md` · `evals/run-layout-fixtures.ts` · `CHANGELOG.md`
  · `docs/work/todo/TASK-490-ship-humanizer-standalone-with-english-catalog.md`
  · `docs/work/in_progress/TASK-490-ship-humanizer-standalone-with-english-catalog.md`
  · `docs/work/done/TASK-490-ship-humanizer-standalone-with-english-catalog.md`
Depends-on: T1
Cites: `TASK-490` · ADR-001 · ADR-006 · ADR-050 · blader/humanizer v3.1.0 @ `8c307f3`

Tier X, provisional (the eval skill-list edit is executable); re-tier at G2. The 26-row review is approved before the catalog is
committed. Shipped skill: Codex loop.

**Acceptance:** `/humanizer` cleans a real English text and a real Markdown file, and the roster reads 15 everywhere.

### T3 — Add the Indonesian slop and term-policy catalog `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `skills/humanizer/references/patterns-id.md` · `skills/humanizer/SKILL.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-491-add-indonesian-slop-and-term-policy-catalog.md`
  · `docs/work/in_progress/TASK-491-add-indonesian-slop-and-term-policy-catalog.md`
  · `docs/work/done/TASK-491-add-indonesian-slop-and-term-policy-catalog.md`
Depends-on: T2
Cites: `TASK-491`

The owner's native-speaker judgment is the deliverable: they approve the term table and slop list. Codex loop.

**Acceptance:** an AI-drafted Indonesian text with galat-class terms comes back in dev code-mixed Indonesian.

### T4 — Add on-request EN↔ID translation `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/humanizer/SKILL.md` · `skills/humanizer/references/translate.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-492-add-on-request-en-id-translate-mode.md`
  · `docs/work/in_progress/TASK-492-add-on-request-en-id-translate-mode.md`
  · `docs/work/done/TASK-492-add-on-request-en-id-translate-mode.md`
Depends-on: T3
Cites: `TASK-492`

`skills/humanizer/references/translate.md` is written only if the cap needs it. Codex loop.

**Acceptance:** an explicit request translates EN→ID and ID→EN under the term policy; the default mode never translates.

### T5 — Define the embedded contract and wire lean-doc-generator `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `skills/humanizer/SKILL.md` · `skills/humanizer/references/embedded.md` · `skills/lean-doc-generator/SKILL.md`
  · `skills/lean-doc-generator/references/humanize-pass.md` · `.claude/CONTEXT.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-493-define-embedded-contract-and-wire-lean-doc-generator.md`
  · `docs/work/in_progress/TASK-493-define-embedded-contract-and-wire-lean-doc-generator.md`
  · `docs/work/done/TASK-493-define-embedded-contract-and-wire-lean-doc-generator.md`
Depends-on: T4 · T1
Cites: `TASK-493` · ADR-006 · L-247

G2 settles the voice-sample rule (house style survives) and the subagent tier before any edit. The embedded brief carries
T1's secret-files line. Both execution paths are exercised: child context, and inline fallback with notice. Reference file
names are proposals; G2 may rename them.

**Acceptance:** a real lean-doc-generator doc passes through humanizer by both paths and keeps template structure and house style.

### T6 — Wire release-patch CHANGELOG entries and handoff docs `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `skills/release-patch/SKILL.md` · `skills/handoff/SKILL.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-494-wire-humanizer-into-release-patch-and-handoff.md`
  · `docs/work/in_progress/TASK-494-wire-humanizer-into-release-patch-and-handoff.md`
  · `docs/work/done/TASK-494-wire-humanizer-into-release-patch-and-handoff.md`
Depends-on: T5
Cites: `TASK-494`

Reuses T5's contract unchanged. Codex loop.

**Acceptance:** a release-patch dry run and a handoff each show the humanizer pass; release-patch still stops before push.

### T7 — Wire commit messages and PR bodies `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/dispatch.md` · `skills/lean-doc-generator/SKILL.md`
  · `skills/release-patch/SKILL.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-495-wire-humanizer-into-commit-messages-and-pr-bodies.md`
  · `docs/work/in_progress/TASK-495-wire-humanizer-into-commit-messages-and-pr-bodies.md`
  · `docs/work/done/TASK-495-wire-humanizer-into-commit-messages-and-pr-bodies.md`
Depends-on: T6
Cites: `TASK-495`

The census of commit/PR composers comes first, by two selectors; `Layers:` is amended by `scope-change` if the census finds a
site outside it. Commits are plain text, PR bodies rendered Markdown. Codex loop.

**Acceptance:** a real orchestrator commit, a lean-doc-generator close commit and a PR body each show the pass.

### T8 — Release the set and prove it on the consumer path `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `.claude-plugin/plugin.json` · `.claude-plugin/marketplace.json` · `.codex-plugin/plugin.json` · `.kimi-plugin/plugin.json`
  · `README.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-496-release-humanizer-set-and-verify-consumer-path.md`
  · `docs/work/in_progress/TASK-496-release-humanizer-set-and-verify-consumer-path.md`
  · `docs/work/done/TASK-496-release-humanizer-set-and-verify-consumer-path.md`
Depends-on: T7
Cites: `TASK-496` · L-015 · L-020

The manifest set is re-derived with `grep -l '"version"' .*-plugin/*.json` at execution; the list above is today's result.
The owner pushes.

**Acceptance:** an installed copy in a non-lean-flow repo runs `/humanizer` standalone, one embedded caller, and the `/flow` chain.

## Owner-action checklist
- [ ] T2: approve the 26-row per-pattern review before the catalog is committed.
- [ ] T3: approve the Indonesian term table and slop list.
- [ ] T5: rule on the voice-sample rule and the embedded subagent's model tier at G2.
- [ ] T8: push the release.

## Decisions (pre-locked)

- **D1** — The chain is linear because tasks share files: `dispatch.md` T1→T7; `skills/humanizer/SKILL.md` T2→T5;
  `lean-doc-generator/SKILL.md` T5→T7; `release-patch/SKILL.md` T6→T7. `CHANGELOG.md`, `README.md` and `.claude/CONTEXT.md`
  are written in task order; status moves, log and sprint-file edits commit as bare `sprint(139):` (L-238).
- **D2** — One `consequence · Tn ·` line per task in this sprint's log (SPRINT-137 T3).
- **D3** — Every task changes a shipped skill, so each takes the Codex review → fix → re-review loop; review cap 2 rounds,
  a third only by owner ruling.
- **D4** — The vendored catalog is copied verbatim from upstream at `8c307f3`, fetched fresh by the builder; nothing from a
  session scratchpad is a source.
- **D5** — Only new writing passes through humanizer; existing docs are not bulk-rewritten in this sprint.
- **D6** — From this promote on, every agent brief this sprint writes names secret files as off-limits, ahead of T1 landing
  the rule in the skills (L-247).

## Assumptions

- **A1** — Upstream is still MIT at `8c307f3`. *Confirm: T2, the LICENSE read at fetch.*
- **A2** — A session without the subagent tool can be produced for T5's inline-fallback exercise. *Confirm: T5 G2.*
- **A3** — The consumer-path repo for T8 is a throwaway scratch repo with a fresh install, not workdoo (its pin is TASK-489's
  call). *Confirm: T8 G2.*
- **A4** — `lean-doc-generator/SKILL.md` and `orchestrator/SKILL.md` are at 140 lines, `.claude/CLAUDE.md` at 80 and
  `.claude/CONTEXT.md` at 150 (all measured 2026-10-24); a task that adds to one compresses a line to stay at the cap.
  *Confirm: `check-doc-caps.ts` and `wc -l` at each task's review.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-139-humanize-every-writing-job.md`](logs/SPRINT-139-humanize-every-writing-job.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
