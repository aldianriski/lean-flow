---
owner: Maintainer
last_updated: 2026-08-25
update_trigger: EPIC-008 D4 needs updated evidence, or a deferred candidate's blocking condition clears
status: current
id: harness-delta
tags: [process, tooling]
domain: skills
related: [adlc-epic-sequencing, harness-engineering-adaptation, gauntlet-loop-delta, ADR-010, L-017]
---

# Research — Which harness mechanics from `05-HARNESS-RESEARCH-BRIEF.md` are a real delta over lean-flow's existing surface?

> **Question.** Phase C (`03-ADLC-ROADMAP.md`) names four candidates for the Lean-controlled dispatch
> layer. Which improve Lean Flow at the layer it actually controls, judged against what already ships
> — never on standalone merit (L-017)?
> **Verdict.** One real delta. **A — keep.** B, C, and D each map onto a real remainder but each is
> blocked — B on Candidate A shipping, C on a genuinely unowned (not merely OS-flaky) repeat incident,
> D on `05`'s own prescribed loop-vs-batch measurement — so all three **defer**. Zero outright rejects:
> the honest map found a real unmatched remainder on every candidate, just not enough evidence yet to
> keep any of the three.

## Why this matters

This doc is EPIC-008's named input (D4): `RunEnvelope`, `Dispatch` and `Effect` trace their
provenance to whatever Phase C rules here. `03` forbids opening an epic from this work — these are
rulings, not a charter — and `05` warns that "adopt everything" would mean the scan failed to
preserve Lean Flow's admission discipline.

## Findings — one row per mechanism (`05`'s required table)

| Mechanism | Current Equivalent | Owner | Delta? | Keep/Reject/Defer | Evidence | Proof Vehicle |
|---|---|---|---|---|---|---|
| Reconstructible Lean-controlled dispatch | Task-decomposer's TASK-NNN fields (plan, done-when, verification, dependencies, cites, class/tier) exist, but the coordinator hand-authors the actual dispatch prompt from them — no `derive_dispatch(input, revision) → canonical brief` function, no proof of determinism | `skills/orchestrator/references/dispatch.md` | Yes — the fields exist, the mechanical derivation and reproducibility proof do not | **Keep** | No mechanism today reconstructs a dispatch brief from durable inputs; EPIC-008's closed-when literally requires this proof | `docs/research/adlc-epic-sequencing.md` F4/F6 names it the open "vocabulary is stable" gate condition |
| Independent dispatch replay | `worktree-base-guard.sh` already runs live-vs-derived comparison and prints a named FAIL (`worktree-base-stale`, `worktree-base-divergent`) — but only for the git-SHA base, not the full brief (constraints, governing decisions, Verify method, dependencies, workflow) | `skills/orchestrator/references/dispatch.md` (guard family) | Partial — the *pattern* is proven at small scope; full-brief drift detection is unmatched | **Defer** | TD-054 (six sprints) proves the pattern catches real drift at SHA scope; no canonical brief exists yet to diff the rest against | Blocked on Candidate A shipping — nothing to replay against until then |
| Reversible effect lifecycle | `dispatch.md` "Cleanup (coordinator-only)" is a manual, ad hoc step (leave the worktree before removing it); no ledger (owner/created_at/lifetime/dispose/final state) | `skills/orchestrator/references/dispatch.md` | Unclear — `05` explicitly says not to add a ledger absent evidence of friction | **Defer** | No *unowned*-effect `L-NNN` at count ≥2 found; `L-044` (tooling, promoted, seen Sprint-025+026, count 2) is a repeated worktree/lock disposal failure, but it is an *owned* effect hitting a Windows handle-lock quirk with an existing dispose step, not an effect with no owner; TD-054 (base drift) is a different failure, closed by the guard above | Admission needs a genuinely unowned repeat incident (CONTEXT.md's own admission rule) — not yet met |
| Programmatic mechanical batching | 2 of `05`'s 6 named classes are already shipped as local batch: rule inventory (`conformance-engine.sh`, spec-driven per EPIC-004 D1) and cross-reference validation (`gen-index.sh` link generation, `check-verify-reaches.sh`). Repo census, general dependency scans, fixture scans, and coverage mapping have no shipped equivalent — `fixture-coverage-audit.md` is itself a *manual* audit that missed 7 of 12 checkers on its first pass | `scripts/lib/`, `scripts/qa-check.sh` (12 `check-*.sh`, re-derived from disk — corrects a stale 11 copied from a pre-`check-verify-reaches.sh` count) | Partial — 2 of 6 classes matched; 4 remain unmatched, one with a documented manual-audit miss | **Defer** | `fixture-coverage-audit.md`'s missed 7-of-12 is real friction on the unmatched remainder, but `05` forbids setting a threshold before running its own prescribed loop-vs-batch measurement | Run `05`'s measurement (tool_calls/round_trips/tokens/wall_time/cost/accuracy) on the 4 unmatched classes before building anything |

## Per-candidate ruling (delta mapped first, per L-017)

- **A — keep.** What we already have: task fields with the right *shape* (work item, plan, done-when,
  verification, dependencies, governing decisions, workflow, revision, runtime policy — all named in
  `05`'s candidate-input list already exist as TASK-NNN fields). What's missing: a mechanical function
  from those fields to a canonical brief, and the same-input/same-revision → same-brief proof. That gap
  is unmatched by anything shipped — a genuine delta. **Layer:** `skills/orchestrator/references/dispatch.md`
  now; the object shape itself is EPIC-008's `RunEnvelope`/`Dispatch` per its D1 provenance table.
- **B — defer, not reject.** What we already have: `worktree-base-guard.sh`'s live-vs-derived compare
  and named-finding pattern (`FAIL worktree-base-stale`, `-divergent`, `-unresolved` — the same shape
  as `05`'s proposed `dispatch-envelope-drift`). The unmatched remainder — comparing the full brief, not
  just the SHA — has no input to compare against until Candidate A exists. Deferring, not rejecting,
  because the pattern is proven and the blocker is sequencing, not merit. **Would-be layer:** same guard
  family, gated on A landing.
- **C — defer, not reject.** `05` itself instructs: "Do not add an effect ledger if evidence shows no
  meaningful friction." Search: all `tooling`- and `process`-tagged entries in `docs/LEARNINGS.md` (the
  two tag groups covering execution/dispatch mechanics) for worktree/orphan/lock/background-job
  keywords. That turned up two repeat incidents, not zero — but both are already *owned*, not unowned:
  TD-054 (base drift, closed by B's existing guard) and **`L-044`** (Windows worktree handle-lock,
  `seen Sprint-025 + Sprint-026`, count 2) — a real repeated disposal failure, but one with an existing
  dispose step (`dispatch.md`: leave the worktree, then remove, retry from a fresh shell) that needs
  retrying, not an effect left with *no* owner. Neither meets Candidate C's own bar — "no successful
  execution leaves an **unowned** live effect behind." Deferring rather than rejecting outright because
  a genuinely unowned effect (no dispose step at all) would flip this.
- **D — defer, not reject.** Two of the six named classes are already matched: rule inventory
  (`conformance-engine.sh` is spec-driven per EPIC-004 D1) and cross-reference validation
  (`gen-index.sh`'s link generation, `check-verify-reaches.sh`). The other four — repo census, general
  dependency scans (`check-layers-completeness.sh`/`check-layers-observed.sh` validate a TASK's
  declared `Depends-on:` field, a narrower job than general dependency scanning — not a match), fixture
  scans, and coverage mapping — have no shipped batch equivalent. `fixture-coverage-audit.md` is itself
  evidence of real friction there: a *manual* audit that missed 7 of 12 checkers on its first pass. That
  is friction, not proof a batch script fixes it, and `05` explicitly forbids setting a threshold before
  running its own prescribed measurement (individual loop vs. one local batch). So: not reject — a real
  unmatched remainder exists with a documented failure on it — and not keep — no measurement has been
  run. **Defer**, gated on running `05`'s measurement on the four unmatched classes. (`check-*.sh` count
  re-derived from disk at 12, not the 11 an earlier doc recorded before `check-verify-reaches.sh`
  shipped.)

## Non-goals — reasserted as constraints, not reopened (`05` § Explicit Non-Goals)

None of the following are in scope for A, and none is relitigated here: a custom provider cache
system · a full session event log · byte-identical complete LLM replay · a custom compaction engine ·
a new generic plugin runtime · a replacement agent loop. `03 § 4`'s own anti-goal (workflow engine
before stable workflow semantics) applies identically to any future B/C implementation.

## Recommendation

Ship nothing from this doc directly — Phase C forbids opening an epic from it. Candidate A's gap
becomes an EPIC-008 input, tracked at that epic's D1/D4 and its "vocabulary is stable" decision-gate
condition (`adlc-epic-sequencing.md` F6). B, C, and D stay `docs/research` register entries, re-opened
only when their named blocking condition clears (A ships; a genuinely unowned-effect incident is
logged; `05`'s loop-vs-batch measurement runs on the four unmatched batching classes).

## Out of scope / open questions

- Whether Candidate A's proof belongs inside `dispatch.md` or as a standalone script → EPIC-008's own
  first-sprint G2, not this doc's call.
- Whether B's full-brief diff needs a new `check-*.sh` or extends `worktree-base-guard.sh` in place →
  decide once A exists to diff against.
- C's re-open trigger is explicit: a sighting of a genuinely *unowned* live effect (no dispose step),
  filed as its own `L-NNN`, not a re-read of this table.
- D's re-open trigger: `05`'s own loop-vs-batch measurement, run on repo census / general dependency
  scans / fixture scans / coverage mapping — the four unmatched classes, not the two already matched.
