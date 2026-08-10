---
owner: Maintainer
last_updated: 2026-08-10
status: superseded
id: loop-hygiene-workstreams
tags: [process, docs, tooling]
domain: governance
related: [loop-hygiene-prd, loop-hygiene-findings]
---

# Process Loop Engineering & Docs Hygiene — implementation decisions (detail)

> Split verbatim out of [`loop-hygiene-prd.md`](loop-hygiene-prd.md) at SPRINT-058 T1 (§7 diet — whole
> sections moved, nothing compressed). The PRD keeps the problem, solution, stories and testing
> decisions; this file keeps the six workstreams. Read the parent first — this is its detail level.
>
> **`status: superseded` — ruled 2026-08-10 (SPRINT-061 T2).** Ruled on this file's own evidence, not
> inherited from the parent's ruling. This is a set of *implementation decisions*, several stated as
> open questions ("decide at G2") — and all of them have since been decided and built. Spot-checked
> rather than taken from the parent's summary (L-098): W2's `/triage` branch is live in `prime`, W4's
> monotonic-id policy is in the LEARNINGS header, W5's `gen-index.sh` parenthetical is gone from
> `insights`, W6's canonical SKILL.md skeleton is written into `DOCS_Guide.md`. That is the RESEARCH
> template's trigger exactly: *once a decision is built on it, mark `status: superseded` rather than
> editing it.*
>
> **Nothing moves.** §11 archives a superseded research doc only once nothing live cites it, and
> `loop-hygiene-prd.md` still points here. Superseded does not demote this file — the template's own
> wording is that such a doc *remains the WHY-trail*.

## Implementation Decisions

### W1 — Hygiene enforcement loop (P0 · the complaint)
- **Tombstone standard**: define ONE canonical tombstone string that `lean-doc-generator close`
  writes (e.g. `<!-- shipped: TASK-NNN[, …] → SPRINT-NNN vX.Y.Z · CHANGELOG -->`) and that
  §11's delete rule + a new qa-check lint both match. Policy: a tombstone survives exactly one
  sprint (written at close N, deleted at close N+1) — or delete immediately; decide at G2.
- **Close sweep** (new named substep in the close row): delete matured tombstones · grep TODO.md
  for any reference to the just-closed `SPRINT-NNN` outside § Active Sprint and refresh/delete ·
  verify CHANGELOG-rotation links still resolve. Presented propose→approve.
- **qa-check.sh extensions** (each a cheap grep-class check): tombstone-format lint · README
  footer version == plugin.json version · ownership frontmatter on CLAUDE.md + README (extend
  the fixed 7-file list) · TD entries with `created:` ≥3 closed sprints ago and no re-review
  annotation → FAIL · temp-dir/`(temp)` tracker refs in TODO.md → FAIL · no hand-written
  "currently N/cap" snapshots outside generated docs (fix docs/QA.md:24 by deleting the snapshot).
- **gen-index.sh**: rewrite `last_updated` on every run (one-line sed fix).
- **Promote aging becomes a checklist**: §10's promote-time scan (TD aging · L-promotion ·
  dedup-when-near-cap) emitted as explicit checkbox lines in promote's output, not recalled prose.

### W2 — Wiring (P1)
- Triage: add a bug-intake step implementing CONTEXT.md:53's routing, or delete the claim.
- Promote: intake filters `state: ready` explicitly (consumes triage's shortlist contract).
- Prime: add `Next:` branch — backlog exists but nothing `ready` → `/triage`.
- CONTEXT.md built-in list: drop `/fork` (or wire it); point `/simplify` at its actual home
  (`orchestrator/references/review-scoping.md`).
- Loop statement: keep the 3-node headline but suffix it with the feed pipeline in the same
  sentence, so a verbatim reader can't skip decomposer/triage.
- G1 ownership: orchestrator states the rule — task arrived via decomposer `approve` → G1 runs
  as a 10-second "scope unchanged since approval? y/n" fast-path; otherwise full G1.

### W3 — Gate clarity (P1)
- No G3. Close + promote each get one explicit human-approval line before their write/commit
  actions, mirroring triage/decomposer verbs. Promote: after governance review, before render.
  Close: before the delete/archive/squash sequence (the W1 sweep is inside this approval).

### W4 — Knowledge integrity (P1)
- `L-NNN` ids monotonic forever; §11 pruning removes the *body*, never frees the id (leave a
  one-line `L-016: promoted → CLAUDE anti-pattern` stub or a retired-ids line in LEARNINGS.md).
- Fix the two live collisions (tdd:82 cites old L-016 · task-decomposer:89 cites old L-017) and
  the dangling L-024/L-037/L-042 cites — replace with "(promoted → red-flag)" wording.
- Citation policy for shipped surface: generic SKILL.md/references cite no repo-local ids;
  rationale is inlined or dropped. Repo-local docs (CLAUDE/CONTEXT) may cite freely.
- Verdict archival: a council verdict referenced by any durable doc is copied into
  `docs/research/verdict-<slug>.md` at reference time; TODO trackers point there. Fix TASK-040/047.

### W5 — Consumer surface (P2)
- `insights`: drop the `scripts/gen-index.sh` parenthetical (generalize to "the project's own
  index-regen command, if any"); inline the minimal LEARNINGS entry shape instead of pointing
  at lean-doc-generator's private template.
- `prime:38` and `dispatch.md:5`: inline the one-line rationale, drop `docs/research/…` pointers.
- Sweep remaining SPRINT/TASK-NNN ballast from generic files on next touch (low priority).

### W6 — Format standard (P2)
- Document the canonical SKILL.md skeleton once (DOCS_Guide or a short style note):
  frontmatter (6 fields, `argument-hint` may be `""`) → `## When to invoke` (optional but
  canonical name) → one procedure section (name free) → `## Output format` (required only for
  deterministic-output skills) → `## Hard rules` (optional) → `## Red flags` (required, ❌-bullets).
  Normalize deviations: council gets `argument-hint` + `${CLAUDE_SKILL_DIR}` prefixes; insights
  `## Output` → `## Output format`; council `## When to run` → `## When to invoke`.
- `allowed-tools`: keep unscoped Bash where genuinely needed (tdd/diagnose run arbitrary test
  commands) but record that rationale once; scope the rest (release-patch pattern).
- Templates: add `id/tags/domain/status/related` frontmatter to ADR + RESEARCH templates;
  reconcile the count — BUG becomes core row 14 in DOCS_Guide §2; README "13" → "14 core
  (+ DESIGN · QA-TESTCASE non-core = 16)".

### W0 — One-shot mechanical cleanup (do first, no design needed)
Delete TODO.md's 13 tombstone lines · fix TODO:48 (SPRINT-016) + TODO:98 (rotated CHANGELOG
link) · README footer → v1.10.2 + real date · add CLAUDE.md ownership frontmatter · delete
orphan `docs/research/image.png` · record TD-008 re-review (or promote it to a TASK).
