---
sprint: 160
slug: s3-bundle-3
stream: s3-expertise
epic: EPIC-023
owner: Maintainer
last_updated: 2026-11-02
status: closed
plan_commit: 3bacd634
gates_signed: G1,G2 @ 688ed825
close_commit: ff9e9d71
update_trigger: sprint execute/close events
---

# SPRINT-160 — S3 Bundle 3: Quoted Business Facts, No Delete Outside the Tree, Release Worker Count

> **Theme:** A4b shipped bundle 2 by non-inferiority (EPIC-023 D17), but its development runs left two misses in the kept
> streams. A design still skipped the business-facts file, and a build still deleted a system-temp directory and parked on the
> popup. This sprint fixes both in `/orchestrator` and shows them on development runs (D16: no measured arm here). It also
> measures how many workers the 2.20.0 release arm can use. TASK-595, outside the epic, settles the skill copy that SPRINT-159's
> audit found in `docs/research/storm/`.

## Scope

**In:** the design opens the business-facts source and quotes the fact it honours (T1, TASK-587) · no delete command names a path
outside the working tree (T2, TASK-588) · the release arm's worker count from a 3- and 4-worker capacity check (T3, TASK-586) ·
the storm copy adopted through ADR-001's bar or moved out (T4, TASK-595).
**Out (deferred):** the 2.20.0 release and its full arm (D16: before the release, not in this sprint) · S4's admission and
STANDARD work · S3a's brief fields and S3b's pilot reviewers · workdoo-specific fixes · the harness's G2 scope check on
`docs/work/` (TD-286).

## Members

- docs/work/todo/TASK-587-the-design-opens-the-business-facts-file-and-quotes-the-fact.md
- docs/work/todo/TASK-588-the-build-never-deletes-a-path-outside-the-working-tree.md
- docs/work/todo/TASK-586-release-arm-worker-count-from-a-capacity-check.md
- docs/work/todo/TASK-595-decide-the-storm-skill-copy-under-the-curation-bar.md

## Plan

### T1 — The design opens the business-facts file and quotes the fact `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `skills/orchestrator/SKILL.md` · `CHANGELOG.md`
Depends-on: none
Cites: TASK-587 · TASK-585 · EPIC-023 D16, D17 · SPRINT-158 log (development runs, owner ruling) · the A/B repo's `BUSINESS-NOTES.md`
TASK-585's box lists where facts live, and two self-onboarding-guard designs still never opened `BUSINESS-NOTES.md` or named fact
6. The box now makes the design open the source and quote the line it honours.

**Acceptance:** development runs on self-onboarding-guard (two) and invitation-issued-by produce designs that quote fact 6 and the
en-GB fact.

### T2 — The build never deletes a path outside the working tree `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `skills/orchestrator/SKILL.md` · `CHANGELOG.md`
Depends-on: T1 (shared file, D2)
Cites: TASK-588 · TASK-584 · EPIC-023 D16 · SPRINT-158 log (counter-run)
TASK-584's report-don't-delete rule was in context, and `iso-PtJHOH` still ran `rm -rf` on a system-temp directory. The cleanup
line becomes a prohibition the build meets at the moment it cleans up.

**Acceptance:** development runs on reissue-invitation and self-onboarding-guard (two each) end with no delete outside the working
tree and no popup.

### T3 — Set the release arm's worker count from a capacity check `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `evals/ab/PREREGISTRATION.md`
Depends-on: TASK-581 (done)
Cites: TASK-586 · TASK-582 · EPIC-023 D14, D16
Two workers took A4b to about 75 minutes, and on this PC memory is the limit, not CPU, so 3 and 4 workers are measured on slots
A4a passed. The highest clean N is adopted by an owner-signed amendment before the release arm runs.

**Acceptance:** the owner reads the per-N report, and the adopted N is in a signed amendment.

### T4 — Decide the storm skill copy under the curation bar `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `docs/research/`
Depends-on: none
Cites: TASK-595 · ADR-001 · `docs/research/adopter-folder-audit.md` (F10) · `docs/research/storm/SKILL.md`
A skill file and an HTML template sit in `docs/research/storm/`, outside `skills/` and the curation bar. The owner rules adopt or
move out by popup. An adopt ruling widens `Layers:` to the roster files by scope-change.

**Acceptance:** the owner's ruling is applied, its citing docs updated, and the gate is green.

## Decisions (pre-locked)

- **D1** — Bundle 3 stacks on A4b. It is shown by development runs (D16), not a measured arm. The 2.20.0 release arm comes after
  this sprint and uses T3's N.
- **D2** — Shared files: `skills/orchestrator/SKILL.md` in commit order T1, then T2 (sequential); `CHANGELOG.md` in commit order,
  staged per hunk.
- **D3** — Development runs use research copies of the A2 snapshots and a pinned clone of the plugin, never a frozen arm snapshot
  or the live checkout from an interactive session (L-277).
- **D4** — T3's capacity check runs with the machine otherwise idle: no build, gate, selftest or development run alongside it.
- **D5** — Every member is decision-class, so Claude builds them; any execution piece found at G2 is Codex-built and
  Claude-reviewed. Every material skill change gets its scoped review logged before close.
- **D6** — `skills/orchestrator/SKILL.md` is at its ~140-line cap (140): T1 and T2 replace or tighten wording, never only add.
- **D7** — T4 is outside EPIC-023 (TASK-595 carries no `epic:`) and does not count toward S3.

## Assumptions

- **A1** — A2's snapshots and the A4b pin serve the development runs unchanged, as they served bundle 2's. *Confirm: at T1's G2.*
- **A2** — `run-dev.ts` (TASK-582) runs the development batches for T1 and T2. *Confirm: at T1's G2.*
- **A3** — Slots A4a passed in both trials are enough to compare outcomes at N = 3 and 4. *Confirm: at T3's G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-160-s3-bundle-3.md`](logs/SPRINT-160-s3-bundle-3.md), created at promote, first entry
> the `promote` / `plan locked` record. Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/SKILL.md` | T1 | business-facts box: open each source, read every fact, quote every fact the change touches | Med | 6 development runs, Codex 2 rounds |
| `skills/orchestrator/SKILL.md` | T2 | cleanup line: no delete names a path outside the working tree; reported, not removed | Med | 4 development runs, Codex 1 round |
| `CHANGELOG.md` | T1, T2 | one `[Unreleased]` bullet each | Low | read |
| `docs/research/storm/` (removed) · `council-improvements.md` · `loop-hygiene-prd.md` · `adopter-folder-audit.md` | T4 | the copied skill leaves the repo by owner ruling; citations point to `94248e54` | Low | off-host gate 476/0 |
| `TECH-DEBT.md` | close | TD-289 (concurrent clinic Postgres start) | Low | census 107 rows, no duplicate id |
| `docs/LEARNINGS.md` | close | L-285; sightings on L-261 and L-251 | Low | no duplicate id |

## Retro

**Outcome** — 4 of 4 members delivered (TASK-587, 588, 586, 595). `/orchestrator`'s G2 design now opens each business-facts source,
reads every fact and quotes every fact the change touches; on the revision both target facts were quoted (fact 6, the en-GB fact)
where SPRINT-158's runs opened no facts file. Its cleanup line now forbids a delete naming a path outside the working tree: 4 of 4
runs kept every delete inside the tree, with no popup. No worker count above 2 is clean, so the release arm stays at two workers
(owner ruling; TD-289). The copied storm skill is out of the repo. Bundle 3 is shown by development runs only (EPIC-023 D16); the
2.20.0 arm measures bundles 1-3 together.

**Retrieval check** — yes, two misses. Both close-time FAILs repeat promoted learnings: tick evidence naming a script (L-261) and
a rewritten line passing `check-doc-caps` while crossing the prose-density limit (L-251). Both were loaded; neither was run before
the commit. Counted as sightings, not new entries.

**Cost** — development runs 12.91 USD (8 runs; 5 on the first pin, 3 on the revision); capacity check 19.39 USD (14 slots); three
failed launches cost nothing. Codex 13.8k tokens (T1/T2 7.8k, T1 revision 6.0k). Builder check: four Sonnet readers, about 208k.
Shape: coordinator inline, Codex reviewer, four readers; no builder sub-agent (every member was decision-class one-line text).

**Worked**
- The builder check settled every fact before G2, so the popup carried four real intent questions and nothing else.
- Reading streams with one extractor (design text, delete commands, denials) turned box 2 into a count, not an impression.
- The free-RAM sampler showed the infra failures were not memory: lowest free RAM was at N = 3's 2-slot pilot, not at N = 4.

**Friction**
- Three development launches failed on scratch-arm setup before any trial (L-285).
- A Windows worktree for a clean gate run failed on a long fixture path; the off-host gate was the clean route.
- Two close-time FAILs from rules already in context (L-261, L-251).

**Pattern candidates**
- L-285 (count 1): a scratch development arm needs a research-copy snapshot and an inventory beside it; preflight before paying.

**Buckets routed** — Shipped: CHANGELOG `[Unreleased]` (TASK-587, TASK-588). Tech debt: TD-289. Follow-ups: TASK-597 (find the
facts sources by file name; filed mid-sprint by owner ruling). Learnings: L-285; sightings on L-261 and L-251.
