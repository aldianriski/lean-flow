---
epic: 026
slug: token-cost-per-box
owner: Maintainer
last_updated: 2026-11-16
status: active
member_sprints: [SPRINT-178]
update_trigger: a member sprint closes, a trial ends, or a decision lands that changes the outcome
---

# EPIC-026 — Token Cost per Box: Three Popular Tools, Each Ruled on a Measurement

> **Outcome:** RTK, ponytail and graphify each have a recorded verdict (keep, drop or inconclusive), taken from a first-hand read or a measured `scripts/session-cost.ts` USD-per-box comparison against recent sprints, and no tool ships inside lean-flow without a separate owner ruling.

## Why this, why now

Owner intent, 2026-11-15: "what next we can tackle ? is all the process already optimal ? i want to optimize token usage with Plugin ponytail, grapify and RTK. that all github kindly popular now, and we not fully addapt that."

EPIC-024 measured 60-69% of main-thread cost in shell and edit turns, so command output is a plausible lever. The measure basis is USD per box from promote to the last sprint commit (`bun scripts/session-cost.ts`), read as direction, not proof (EPIC-024 D4). Each tool needs a different kind of trial: RTK a real sprint, ponytail a reading, graphify a run on another repo. That is more than one sprint, and the trials must not overlap. The RTK and graphify trials **start only after EPIC-025 Sprint B (the workdoo SPRINT-005) closes**, so Sprint B's measurement stays clean. The ponytail reading runs now (D7), since it installs nothing.

Facts from the READMEs, read first-hand by the coordinator 2026-11-15 and to be re-read at slice time:
- **RTK** (github.com/rtk-ai/rtk): a hook rewrites shell commands to `rtk <cmd>` with compressed output, claiming 60-90% less command output (tokens estimated as bytes/4). Read, Grep and Glob pass through untouched. The CLI is Apache-2.0, and the `rtk-engine`/`rtk-proxy` parts are BUSL-1.1. Telemetry is off by default, Windows is via winget (unverified), and the name collides with crates.io `rtk`. Its README warns that a 90% cut in command output is not a 90% cut in cost.
- **Ponytail** (github.com/DietrichGebert/ponytail, MIT): a 7-rung decision ladder, the same as the laziness ladder in lean-flow's CLAUDE.md. Commands: /ponytail-review, -audit, -debt and -gain, plus a cost band. It claims "-45% tokens", self-benchmarked on 39 tasks with Opus 5.5, 5 runs each.
- **graphify**: lean-flow's own verdict stands: redundant, twice (`docs/research/graphify-daily-value.md`).

lean-flow ships no hooks (ADR-044 allows them under the ADR-001 curation bar). RTK is therefore a maintainer-environment tool, not a shipped one, unless a later ruling says otherwise. The epic adds no governance machinery (no guard, checker, gate leg or ledger field), so ADR-053's freeze does not apply. A defect a trial finds is fixed as an unfrozen change.

## Scope

**In:**
- **RTK trial:** a project-scoped install in lean-flow only, then one real sprint run with it, with USD per box compared against recent sprints. A bypass rule keeps `git diff --cached` and the gate output uncompressed.
- **Ponytail delta review:** read its SKILL.md and benchmark first-hand and map each technique to what lean-flow already has. Keep only the unmatched remainder (candidates: /ponytail-review reading the touched code, /ponytail-debt shortcut comments).
- **graphify trial on workdoo:** once, on workdoo's TypeScript code, during a dashboard sprint, measured and then ruled.
- **A verdict per tool**, recorded in `docs/research/` and reflected in the INDEX row.

**Out (explicitly not):**
- A global hook, including RTK's `-g` install.
- Shipping RTK or ponytail inside lean-flow without a separate owner ruling.
- Installing ponytail (the delta review only reads it).
- A/B arms. The A/B system was deleted 2026-11-11; releases are a Codex review of the shipped diff plus the off-host gate.
- Re-litigating lean-flow's graphify verdict, which only the workdoo trial can change.
- New governance machinery, and any work inside EPIC-025 or its Sprint B.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-178](../sprint/archive/SPRINT-178-lane-cost-fixes-and-ponytail-review.md) | Lane cost fixes (TASK-666, TASK-667) with the ponytail delta review (TASK-669) | closed · `dfd668f7` | Ponytail slice only: TASK-669 delivers the ponytail verdict (Drop, `docs/research/ponytail-delta-review.md`; "-45% tokens" inconclusive, nothing installed). TASK-666 and TASK-667 advance no EPIC-026 condition. |

## Decisions
- **D1** — Vehicle, owner popup 2026-11-15: "One small epic, after Sprint B (Recommended)". Open a 'token cost per box' epic with the trials as slices. It starts only after EPIC-025 Sprint B (the workdoo SPRINT-005) closes, so Sprint B's measurement stays clean.
- **D2** — RTK, owner popup 2026-11-15: "Measured trial, one repo (Recommended)". After Sprint B closes, install it project-scoped in lean-flow only, never with the global `-g`. Run one real sprint with it and compare `scripts/session-cost.ts` USD per box against recent sprints. Add a bypass rule for `git diff --cached` and the gate output, so edit-safety and verdict-reading stay intact.
- **D3** — Ponytail, owner popup 2026-11-15: "Delta review only (Recommended)". Read its SKILL.md and benchmark first-hand, and keep only the techniques lean-flow doesn't already have (candidates: /ponytail-review reading the touched code, /ponytail-debt shortcut comments). No install.
- **D4** — graphify, owner popup 2026-11-15: "Test on workdoo only (Recommended)". Keep lean-flow's verdict (`docs/research/graphify-daily-value.md`: redundant, twice). Try it once on workdoo's TypeScript code during a dashboard sprint, measure it, then rule.
- **D5** — Measure basis: EPIC-024's, USD per box from promote to the last sprint commit across all agents, read as direction, not proof. Each verdict says which it is, and an inconclusive tool is not shipped.
- **D6** — Approved as proposed by owner popup, 2026-11-15: "Approve, write it".
- **D7** — Owner popup 2026-11-16, "Lane fix + ponytail now (Recommended)": the ponytail delta review (D3) runs now in SPRINT-178, as a reading that installs nothing and cannot affect EPIC-025's Sprint B. D1's timing is amended for that slice only. The RTK trial (D2) and the graphify trial (D4) still start only after EPIC-025 Sprint B (workdoo SPRINT-005) closes.

## Open questions
- **Does RTK's output compression lower USD per box, not just output bytes?** (measurement) → the RTK trial sprint. The baseline is recent sprints from `session-cost.ts`, and the README's own caveat is the prior.
- **Does RTK run on this Windows host under winget, project-scoped, with the bypass rule honoured?** (documented behaviour, unverified) → read its install and hook docs at slice time, then try it in the slice's first task.
- **Does the BUSL-1.1 part (`rtk-engine`/`rtk-proxy`) affect maintainer-only use?** (documented behaviour) → read the licence text at slice time. Any adoption beyond the maintainer environment needs a separate owner ruling.
- **Which RTK-compressed commands, if any, hide something edit-safety needs (staged diffs, gate verdict lines)?** (measurement) → test the bypass rule against the real gate output before the trial sprint.
- **Which ponytail techniques are a delta over lean-flow's existing surface?** (judgement, L-017) → the delta review maps each one to the existing surface first. Only the unmatched remainder is a keeper.
- **Is ponytail's "-45% tokens" credible for lean-flow's work?** (measurement, self-benchmarked on 39 tasks with Opus 5.5) → read its benchmark. There is no paid re-run, since D3 rules out an install.
- **Does graphify on workdoo's TypeScript beat reading the code during a dashboard sprint?** (measurement) → one run during a workdoo dashboard sprint, measured against that sprint's own baseline.
- **Which workdoo sprint hosts the graphify trial?** (judgement) → the owner names it at slice time, after Sprint B closes.

## Closed when
- [ ] RTK has a recorded verdict (keep, drop or inconclusive) from one real lean-flow sprint run with it project-scoped, with USD per box compared against recent sprints by `scripts/session-cost.ts`. The bypass rule held: `git diff --cached` and the gate output were read uncompressed. → next slice: RTK measured trial
- [x] Ponytail has a recorded verdict (keep, drop or inconclusive) from a first-hand read of its SKILL.md and benchmark. Each technique is mapped to lean-flow's existing surface, and only the unmatched ones are named, as kept or dropped. Nothing is installed. → closed by SPRINT-178 (TASK-669)
- [ ] graphify has a recorded verdict (keep, drop or inconclusive) from one run on workdoo's TypeScript code during a dashboard sprint, with the measurement shown. lean-flow's own verdict is untouched. → next slice: graphify on workdoo
- [ ] Each verdict and its measurement are in `docs/research/`, and the INDEX row names all three. Nothing ships inside lean-flow without a separate owner ruling, and a kept tool is recorded as maintainer-environment only unless that ruling says otherwise. → next slice: record the verdicts
