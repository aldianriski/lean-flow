---
sprint: 155
slug: consumer-docs-codex-built
stream: codex-pilot
owner: Maintainer
last_updated: 2026-11-01
status: active
plan_commit: 2ea2af75
gates_signed: G1,G2 @ 1314a5da
update_trigger: sprint execute/close events
---

# SPRINT-155 — Consumer Docs, Codex-Built

> **Theme:** Five small follow-ups from SPRINT-153's close, three of them built by Codex instead of a Claude builder. Codex
> writes the change in a worktree, a Claude reviewer checks the diff, and the coordinator commits. Each task's findings,
> rounds and tokens are recorded, so the owner can decide whether Codex becomes the default builder.

## Scope

**In:** lean-flow-internal ids out of the shipped templates and init's reference (T1, TASK-563) · the README template's Quick
start and the integrations pointer (T2, TASK-564) · the conformance-engine comment (T3, TASK-562) · the Codex launch
diagnosis (T4, TASK-565) · lean-flow's own repo profile (T5, TASK-561).
**Out (deferred):** making Codex the default builder (the owner rules it after this sprint, from the recorded figures) · any
template change beyond these tasks · stream s1-discovery's A2 work (SPRINT-154).

## Members

- docs/work/todo/TASK-563-remove-lean-flow-internal-ids-from-shipped-templates-and-init.md
- docs/work/todo/TASK-564-stop-the-readme-template-quick-start-repeating-setup.md
- docs/work/todo/TASK-562-update-the-conformance-engine-comment-that-quotes-the-old-requirements-row.md
- docs/work/todo/TASK-565-diagnose-why-codex-task-launch-fails-on-this-host.md
- docs/work/todo/TASK-561-rule-whether-lean-flow-itself-carries-the-repo-profile.md

## Plan

### T1 — Remove lean-flow-internal ids from the shipped templates and init's reference `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `skills/lean-doc-generator/templates/` · `skills/lean-doc-generator/references/init.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-563-remove-lean-flow-internal-ids-from-shipped-templates-and-init.md`
  · `docs/work/in_progress/TASK-563-remove-lean-flow-internal-ids-from-shipped-templates-and-init.md`
  · `docs/work/done/TASK-563-remove-lean-flow-internal-ids-from-shipped-templates-and-init.md`
Depends-on: none
Cites: TASK-563 · `.claude/CLAUDE.md` § Anti-Patterns (consumer-side)
Codex-built. An adopter's generated docs must not inherit an id that means nothing in their repo. The census separates
format examples (kept) from lean-flow's own rows (removed or restated in words).

**Acceptance:** no shipped template or init's reference names a lean-flow-internal id, and a real `init` writes none into a fresh
snapshot.

### T2 — Stop the README template's Quick start repeating setup, and fix the integrations pointer `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `skills/lean-doc-generator/templates/README.md.template`
  · `skills/lean-doc-generator/templates/architecture-integrations.md.template` · `CHANGELOG.md`
  · `docs/work/todo/TASK-564-stop-the-readme-template-quick-start-repeating-setup.md`
  · `docs/work/in_progress/TASK-564-stop-the-readme-template-quick-start-repeating-setup.md`
  · `docs/work/done/TASK-564-stop-the-readme-template-quick-start-repeating-setup.md`
Depends-on: T1
Cites: TASK-564
Codex-built, after T1 because both edit the README template. One owner per step for the setup sequence (the setup guide),
and no pointer to a file init never writes.

**Acceptance:** a real `init` on a fresh snapshot writes neither the duplicated setup steps nor a dead OpenAPI pointer.

### T3 — Update the conformance-engine comment that quotes the old requirements row `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `scripts/lib/conformance-engine.sh`
  · `docs/work/todo/TASK-562-update-the-conformance-engine-comment-that-quotes-the-old-requirements-row.md`
  · `docs/work/in_progress/TASK-562-update-the-conformance-engine-comment-that-quotes-the-old-requirements-row.md`
  · `docs/work/done/TASK-562-update-the-conformance-engine-comment-that-quotes-the-old-requirements-row.md`
Depends-on: none
Cites: TASK-562 · `spec/STANDARD.md` §2 (the `product/requirements.md` row)
Codex-built. Comment only, but the file is consequential G (ADR-050): the diff must show comment lines only, the hash-restore
discipline applies, the review is worktree-isolated, and the full gate runs on the VPS.

**Acceptance:** the comment quotes §2's current cell, and the conformance fixtures and the full gate pass unchanged.

### T4 — Write up the Codex launch diagnosis and the standing review route `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `docs/work/todo/TASK-565-diagnose-why-codex-task-launch-fails-on-this-host.md`
  · `docs/work/in_progress/TASK-565-diagnose-why-codex-task-launch-fails-on-this-host.md`
  · `docs/work/done/TASK-565-diagnose-why-codex-task-launch-fails-on-this-host.md`
Depends-on: none
Cites: TASK-565
Claude-run. S0 already showed the route that works (`codex exec` with the prompt on stdin) and the one that hangs (the
companion's `setup`); this task records the cause, the owner's ruling on the standing route, and the process cleanup.

**Acceptance:** the failure's cause is named with its error text, the owner rules the standing route, and no codex process
is left behind.

### T5 — Rule lean-flow's own repo profile, then run migrate here or record the exemption `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `docs/architecture/overview.md` · `docs/product/` · `docs/development/` · `.conformance-exempt`
  · `docs/work/todo/TASK-561-rule-whether-lean-flow-itself-carries-the-repo-profile.md`
  · `docs/work/in_progress/TASK-561-rule-whether-lean-flow-itself-carries-the-repo-profile.md`
  · `docs/work/done/TASK-561-rule-whether-lean-flow-itself-carries-the-repo-profile.md`
Depends-on: none
Cites: TASK-561 · `skills/lean-doc-generator/references/migration-map.md` · `.claude/CONTEXT.md` · `.claude/CLAUDE.md`
Claude-run: `migrate` is an installed Claude Code skill, which Codex cannot run. The owner already ruled dogfood (2026-11-01),
so `/prime` on lean-flow stops naming migrate once the profile exists.

**Acceptance:** lean-flow carries the profile `migrate` writes, its inventory holds, and `/prime` no longer names migrate here.

## Decisions (pre-locked)

- **D1** — The Codex builder pilot (owner ruling 2026-11-01). T1, T2 and T3 are built by
  `codex exec -s workspace-write` in a worktree from the builder brief, with no git writes. A Claude reviewer checks each
  diff. The coordinator reviews `git status`, commits, moves the member and writes the Log. T4 and T5 are Claude-run.
- **D2** — The pilot bar, recorded per Codex-built task in its `progress` entry: reviewer findings (count, severity), review
  rounds to clean, Codex tokens, and Claude tokens (coordinator and reviewer). The comparison baseline is the same figures
  from SPRINT-153 and SPRINT-152 T2. The owner rules Codex as the default builder only if findings and rounds are no worse,
  with fewer Claude tokens.
- **D3** — Shared files: `skills/lean-doc-generator/templates/README.md.template` and `CHANGELOG.md` are owned by T1, then T2, in that commit order.
  `docs/architecture/overview.md` is T5's alone, and it sits at its 150-line cap, so T5's profile section must fit or the cap
  is ruled at G2.
- **D4** — The stream pauses while SPRINT-154's trials measure wall time (no build, gate or selftest on this machine then);
  its gate runs on the VPS.

## Assumptions

- **A1** — Codex in `workspace-write` can edit files and run `bun` in the worktree but cannot write `.git`. *Confirm: S0's run
  (`index.lock: Permission denied`), and again at T1's launch.*
- **A2** — The installed plugin's `init` (the real-init checks in T1 and T2) reads the shipped templates of the version under
  test. *Confirm: at G2, whether those checks run from a live checkout (`--plugin-dir`) or need a reinstall.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-155-consumer-docs-codex-built.md`](logs/SPRINT-155-consumer-docs-codex-built.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/lean-doc-generator/templates/*` · `references/init.md` · `CHANGELOG.md` | T1 | internal ids and maintainer paths out of what adopters get; format examples kept | med | census grep + real init on two clinic copies |
| `skills/lean-doc-generator/templates/README.md.template` · integrations template | T2 | Quick start is a link to setup; the API-contract pointer only when a contract file exists | low | real init on a README-less copy |
| `scripts/lib/conformance-engine.sh` | T3 | comment quotes the current requirements row | low | comment-only diff, review |
| `docs/work/done/TASK-565-...` | T4 | Codex launch diagnosis and the standing review route | low | owner ruling |
| `docs/architecture/overview.md` · `docs/product/` · `docs/development/` · `.conformance-exempt` | T5 | lean-flow's own repo profile via migrate | low | scoped review, `/prime` reports profiled |
| `evals/ab/setup-arm.ts` | coordinator | init's operator catalog carries UNDECIDED, for the init proofs | low | selftest 74/74 |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
**Outcome** — 5 of 5 members delivered (TASK-561..565). Shipped templates and init's reference no longer carry lean-flow-internal
ids, the README template's Quick start links to setup instead of repeating it, and the API-contract pointer appears only with a
contract file; a real `init` on fresh clinic copies through the pinned checkout proved both (no internal id in 20 and 21 added
files; a one-link Quick start). The conformance-engine comment is current, the Codex launch hang is diagnosed with a standing
review route, and lean-flow carries its own repo profile. The Codex builder pilot (D1) built T1, T2 and T3.

**Codex builder pilot (D2 figures, for the owner's ruling)**

| task | Codex tokens | Claude tokens | findings | rounds |
|---|---|---|---|---|
| T1 | 123.1k (check 50.5k + build 72.6k) | review 60.8k | 1 Low (coordinator-fixed) | 1 |
| T2 | 63.9k (reader 19.1k + build 44.8k) | review (not metered) | 0 | 1 |
| T3 | 74.5k (check 26.7k + build 47.8k) | review 52.9k | 0 | 1 |

Baseline (SPRINT-153's Claude-built tasks): builder about 90k, builder check about 73k, each Sonnet review about 65k Claude tokens.
With Codex building, a task's Claude cost fell to the review alone; findings stayed at Low or none and every task cleared in one
round. Coordinator tokens are not metered per task in either sprint, so the comparison covers builder and reviewer only.

**Retrieval check** — one rule missed, one held. Missed: the first two clinic inits ran from an interactive session started
with `--plugin-dir`, and the installed 2.19.1 won (L-277); both outputs were discarded. Held: TASK-564 box 3 was not ticked
on a run where its templates never ran (the README existed); a README-less run proved it.

**Cost** — Codex 261.5k tokens across T1-T3; Claude reviews about 114k metered. Six headless init proof sessions (four on the
first copy, two on the README-less copy; four stopped before writing anything). Owner time: the clinic init attempts in
SPRINT-154's sitting and the popup rulings.

**Worked**
- Codex builds in a worktree with a Claude reviewer: every diff landed with blob hashes equal to the worktree's, in one round.
- The setup operator, built for A2, ran the init proofs headless with the plugin pinned, so no interactive plugin precedence.

**Friction**
- Interactive `--plugin-dir` lost to the installed copy of the same plugin (L-277).
- The init proofs stopped four times on questions the frozen answers did not cover or on a reply the parser refused; each stop
  wrote nothing, so the cost was sessions, not bad output.

**Pattern candidates**
- L-277 (count 1): an interactive session can prefer the installed copy of a plugin over `--plugin-dir`; prove a checkout's
  behaviour headless, or with the installed copy disabled.

**Buckets routed** — Shipped: CHANGELOG [Unreleased] already carries T1 and T2 (Fixed). Tech debt: TD-285 (the members check can read another sprint's log as its baseline, found at this close's system verify). Follow-ups: none
new. Learnings: L-277. Every member is in `done/`. No handoff entry was taken in this sprint. No release: the changes stay under
[Unreleased] with S1's (EPIC-023 D6). The owner rules on Codex as the default builder from the table above. Retention and the
archive move wait for the owner's approval.
