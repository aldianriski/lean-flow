---
epic: 023
slug: specific-not-short
owner: Maintainer
last_updated: 2026-11-02
status: active
member_sprints: [SPRINT-147, SPRINT-148, SPRINT-150, SPRINT-151, SPRINT-152, SPRINT-153, SPRINT-154, SPRINT-156]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-023 — Specific, not short (lean-flow 3.0)

> **Outcome:** lean-flow ships (as 2.x MINORs, or 3.0.0 on a named contract break, D9) only the discovery, carry-through and expertise components whose
> staged A/B on two real repos gained ≥ +10 pp on the primary endpoint, with no symptom measure
> regressing past −5 pp and within 2× the 2.x token cost. Where a hypothesis fails, the epic records it
> and ships the measurement harness and findings instead.

## Why this, why now

The owner sees lean-flow's trimming push results toward generic output: generic docs, a misread
business, detail lost between stages. The rules against that already exist on paper (LAW 4, "never
squeeze"). What is missing is a mechanism that produces repo-specific content and carries it to the
step that needs it. Outside evidence cuts both ways. Context files on average do not raise task success
and cost over 20% more (arXiv 2602.11988), so "more detail" is not the fix and every change has to be
measured. That makes it multi-sprint: a baseline first, then three stacked mechanisms, each with its
own A/B arm, and a release last. Full analysis, evidence and A/B design →
[`docs/research/lean-flow-3-foundation.md`](../research/lean-flow-3-foundation.md).

## Scope

**In:** the maintainer-only A/B harness and baseline (S0) · repo-profile discovery in `init`/`migrate`
with hybrid framework question sets and business discovery (S1) · the section-pointer contract
carrying non-derivable facts to builder, reviewer and handoff (S2) · expertise in three measured steps:
S3a brief fields and fan-out budget, S3b pilot reviewers (domain and invariants, architecture and
integration, QA), S3c optional agent definitions or tier routing for a deferred role whose trigger fired;
the full-loop roster → [`lean-flow-3-specialist-roster`](../research/lean-flow-3-specialist-roster.md) (S3) ·
per-role admission, the version decision and the release (S4).
**Out (explicitly not):** prescribing any consumer architecture (`architecture-baselines` verdict
stands) · a framework encyclopedia beyond the four first profiles · turning the A/B harness into a gate
or `qa-check.sh` leg · imposing R5 (measured context changes) on adopters.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-147](../sprint/archive/SPRINT-147-first-trial-first-slice.md) | First Trial, First Slice (S0: harness tracer + clinic booking slice) | closed · `751df00d` | S0's two foundations. The harness runs one pinned, isolated, graded and costed trial (TASK-533), and the second A/B repo, Vue 3 + Go chi + PostgreSQL, books end-to-end with both invariants red-before-green (TASK-534). Closed-when 1 stays open on TASK-544/545 |
| [SPRINT-148](../sprint/archive/SPRINT-148-rules-protocol-and-a-whole-gate.md) | Rules, Protocol and a Whole Gate (S0: clinic rules + spec, trial protocol) | closed · `c8ebeea1` | The clinic repo enforces five invariants test-first (cap serialised per doctor) and its spec carries the facts not in code, signed realistic (TASK-535). The D9 two-phase protocol runs on the fixture repo with G1 pre-signed, G2 by scope check + isolated judge, popup parks recorded (TASK-542). The off-host gate is whole (TASK-531, 532, outside the epic). Closed-when 1 stays open on TASK-544/545 |
| [SPRINT-150](../sprint/archive/SPRINT-150-scan-tracer-and-answers-scope.md) | Scan Tracer and Answers Scope (S1 tracer + S0 answers-file widening) | closed · `1b917eb6` | S1's tracer holds: on an unprofiled SvelteKit repo, through the installed plugin, `init` wrote Stack and Conventions in use with every line citing a real file, read by the owner as specific (TASK-547). TASK-536's answers file now covers the seven profile topics and is ready (TASK-556). Closed-when lines 1 and 2 stay open (S0 on TASK-544/545, S1 on TASK-548..555) |
| [SPRINT-151](../sprint/archive/SPRINT-151-s0-answers-tasks-arms-judges.md) | S0: Answers, Tasks, Arms and Judges | closed · `a9f03af4` | S0 minus the freeze: answers files, 16 verified tasks (TASK-536..540), four frozen arms (TASK-541), judges calibrated at 85.5% (TASK-543). Line 1 open on TASK-544/545 |
| [SPRINT-152](../sprint/archive/SPRINT-152-s0-freeze-and-baseline.md) | S0: Freeze and Baseline (S0 freeze + paid A0/A1 baseline) | closed · `ba3675db` | S0 closes: the pre-registration frozen before any trial and amended five times under owner signature; 96/96 slots VALID; A1 81.2% vs A0 89.6%, regressed on convention, business and lost detail, no symptom an R-b defect. Closed-when 1 ticked, S2 recorded as not admitted, D10 admits S3 on the regressions |
| [SPRINT-153](../sprint/archive/SPRINT-153-s1-discovery-profile.md) | S1: Discovery Profile (stream s1-discovery; heavy runs on the VPS) | closed · `82990174` | init and migrate write a cited repo profile through the installed plugin, shown on an unprofiled repo (all seven topics) and on kalasuara (migrate kept every decision file and Closed-when set unchanged); question sets for React/Vite, Vue/Vite, Go/chi and Postgres; spec 0.18.2. Details in its Retro. Open for the S1 condition: arm A2 (TASK-555) and the profile on both A/B repos |
| [SPRINT-154](../sprint/archive/SPRINT-154-a2-migrate-arm.md) | A2: Migrate Arm (S1's arm A2 through a real migrate; stream s1-discovery) | closed · `c6255747` | S1's arm: A2 set up by a real `migrate` from the S1 pin with an operator answering from frozen entries, 32/32 VALID, ruled failed (below the A0 floor; no gain or regression vs A1), so S1 does not ship (D6). Ticks S1; S3's intake found the regressions are UNKNOWN verdicts (D11) |
| [SPRINT-156](../sprint/SPRINT-156-lean-flow-habits-a4a.md) | S3: Three lean-flow Habits, Measured as A4a (stream s3-expertise) | active | — |

## Decisions

- **D1** — The trim rule is reframed as hypotheses (H1 specificity · H2 carry-through · H3 expertise)
  tested by a staged A/B, not asserted. The STANDARD changes last, once H1/H2 hold.
- **D2** — ADR-053 admission: S2, S3 and the STANDARD change are frozen surfaces, admitted only on S0's
  *measured defect*, which each task's `## Why` names. A symptom S0 does not reproduce admits nothing.
- **D3** — A/B rulings (owner, 2026-10-29): full budget (240 + 32 runs per candidate, plus setup) ·
  +10 pp minimum gain / −5 pp regression limit · first profiles React/Vite · Vue/Vite · Go/chi ·
  Postgres · A/B repos are the workdoo snapshot plus a new Vue 3 + Vite + Go chi + PostgreSQL repo in
  `D:\Research\`.
- **D4** — G2 in A/B trials: an **eval-only exception** to night-run Part 0. G2 is signed by a written
  policy (approve as written unless the design leaves task scope) plus a mechanical check (files
  touched ⊆ task `Layers:`), recorded as a deviation. It never applies to product runs.
- **D5** — Shipped expert agents each clear ADR-001 on their own ablation delta. Expertise ships only
  if the final set beats the carry-through arm by the minimum gain.
- **D6** — Release (owner, 2026-10-30): S1 and S2 each ship as a 2.x MINOR only once their own arm passes (A2, A3); until
  then their changes stay under [Unreleased], unversioned. Fresh installs from the marketplace's `main` already carry what is
  merged there; a release, not a push, is what counts as shipping.
- **D7** — Specialist roster (owner, 2026-10-31; research D13): named now for the whole loop. Pilots are domain and
  invariants, architecture and integration (describes, never prescribes) and QA; existing skills get brief fields only;
  frontend, backend, data, design system and release are deferred behind named triggers; no standing diagram agent.
- **D8** — S3 splits into S3a, S3b and an optional S3c, each with its own arm (research D14), so each step's effect is
  measured apart instead of one bundled A4.
- **D9** — The version is decided at S4 on a named consumer-contract break (STANDARD §15; research D15). Without one,
  the admitted set ships as 2.x MINORs; S3 roles ship only after S4 admits them.
- **D10** — After S0 (owner, 2026-11-01; `docs/research/logs/ab-measurements.md` § Report 2026-11-01): no symptom is an R-b
  defect, but A1 regressed against A0 under section 4 (primary −8.3 points, below the A0 floor, at about 3.9× A0's tokens).
  Amends D2 for S3 only: S3 is admitted as a measured experiment on the convention (−10.3, 13 tasks) and business (−11.1,
  9 tasks) regressions, and its `## Why` cites them; D5 still ships a role only on its own positive delta. S2 is not admitted:
  its lost-detail regression (−8.3) rests on 4 tasks. The STANDARD change stays under D2. With no A3, S3 and S4 compare
  against A2.
- **D11** — S3's first slice (owner, 2026-11-02): the convention and business regressions D10 admits S3 on are judge UNKNOWN
  verdicts, not more FAILs (first pass, on each measure's own tasks: convention FAIL A1 1 vs A0 2, UNKNOWN 8 vs 3; business FAIL
  0 vs 0, UNKNOWN 4 vs 1). Some of those UNKNOWNs are lean-flow sessions parked at a permission popup after writing a probe
  outside the working tree (L-272; scored parks A1 3 of 48, A2 3 of 32, A0 none). S3's first slice therefore fixes those popup
  stops (TASK-573) and measures the fix as its own arm A4a against A2 (TASK-574). S3a's brief fields wait; when they come, they
  apply to the session's own G1/G2 brief, since only 3 of 93 measured A1/A2 sessions dispatched a subagent. A4a stacks on A2
  whatever A2's ruling is.
- **D12** — A4a's scope (owner, 2026-11-02): A4a bundles three lean-flow fixes, measured once against A2: the popup stops
  (TASK-573), a coding task's design declaring only the files its change needs (TASK-575; 82 of 93 measured A1/A2 sessions failed
  G2's first scope check and paid a revise round), and a light path for small tasks (TASK-576; A2's plan phase alone costs about
  A0's whole task). S4's leave-one-out attributes the effect.

## Open questions

- Closed 2026-10-30 → D6 (asked at SPRINT-150's close; the S1 promote scan did not raise it).

## Closed when

- [x] S0: design frozen at S0 promote; pre-registration hash frozen before any trial on an A/B repo or a
  task-set task (harness smoke runs use a separate fixture repo only; owner ruling R-c, 2026-10-29); arms
  A0 (no lean-flow docs) and A1 (2.x) measured on both repos; each of the three symptoms recorded as
  *measured defect* or *not reproduced* → TASK-544, TASK-545 ✓ SPRINT-152: all three not reproduced
  (`docs/research/logs/ab-measurements.md` § Report 2026-11-01)
- [x] S1: `init`/`migrate` produce a repo profile on both A/B repos and on an unprofiled stack through the
  installed plugin; a real 2.x `migrate` keeps every existing decision; arm A2 measured vs A1
  → TASK-548, TASK-549, TASK-550, TASK-551, TASK-552, TASK-553, TASK-554, TASK-555 ✓ SPRINT-153 (profile, migrate keeps
  every decision) + SPRINT-154: A2 measured vs A1, ruled **failed** (below the A0 floor; no gain, no regression vs A1), so S1
  does not ship under D6 (`docs/research/logs/ab-measurements-a2.md` § Report 2026-11-02)
- [x] S2: not admitted at S0 (D2, D10): symptom 3 not reproduced, and its −8.3-point regression against A0
  rests on 4 tasks; TASK-567..572 cancelled (`.out-of-scope/pointer-carry-through.md`) ✓ SPRINT-152, recorded 2026-11-01
- [ ] S3: the three pilot roles (and any S3c role) runnable in the harness; arms A4a vs A2 and A4b vs A4a
  measured (A4c vs A4b if S3c runs); each deferred role's trigger checked against the residual failures
  → TASK-573, TASK-574, TASK-575, TASK-576
- [ ] S4: shipped set = only components with a positive ablation delta, the final set re-measured vs A1
  and A2; STANDARD MAJOR and 3.0.0 only if H1/H2 held and a named consumer contract breaks, else 2.x
  MINORs; released with migration notes (or a recorded no-ship with numbers)
  → next slice: S4 Admit + STANDARD + release
