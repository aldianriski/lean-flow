---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: Sprint completed, task added, or task status changed
status: current
---

# lean-flow — Development Tracker

> **How to use this file**
> - **Session start** — `/prime`; read this before touching code.
> - **`/triage`** grooms the Backlog (re-rank, state, route rejects to `.out-of-scope/`).
> - **`/lean-doc-generator promote`** forms a sprint from `ready` Backlog tasks → `docs/sprint/`.
> - **`/orchestrator sprint-bulk`** builds it; **`/lean-doc-generator close`** runs the Retro → §10 routing.
> - Tech Debt lives in root **`TECH-DEBT.md`**: `TD-NNN`, never deleted; aged at promote (≥3 sprints → re-review; `high` → auto P1).

---

## Active Sprint

> **SPRINT-055 — Wiring the Standard** → docs/sprint/SPRINT-055-wiring-the-standard.md

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

- [ ] TASK-166 — Correct the README repo-layout block and give its counts a check  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  `README.md` § Architecture "Repo layout" states the real template count
                  (32 core + 2 non-core = 34, not "30 … = 32 total") and lists `.codex-plugin/`
                  alongside `.kimi-plugin/`; and the count claim is covered by a check, so it
                  cannot drift again
      touches:    README.md · scripts/qa-check.sh · evals/fixtures/ (a must-FAIL fixture if a
                  check is added — L-058)
      depends-on: none
      assumes:    the drift is unguarded rather than unnoticed — `qa-check.sh` verifies the template
                  count in `.claude/CLAUDE.md` and `docs/architecture/overview.md` and passes today,
                  so extending the same check to the README is the small version. Confirm that before
                  writing a new checker
      tracker:    SPRINT-054 T1 (found, deliberately not swept in — pre-existing, outside T1's scope)
      state:      ready — found during SPRINT-054 T1 while updating the same block for the new root
                  docs. Left alone at the time under "clean up only your own mess"; filed here so it
                  is not lost. Same family as TD-041: a claim nothing checks drifts silently, and this
                  one is consumer-facing.

- [ ] TASK-167 — Execute the epic archive at close, not just specify it  [size: S] [risk: med] [AFK]
      class:      execution
      done-when:  `lean-doc-generator` close's §11 archival pass names the epic move
                  (→ `docs/epic/archive/`, INDEX row retained) as an enumerated step, gated on
                  every member sprint closed AND every § Closed-when `[x]`; a must-FAIL fixture
                  exists in which an epic with one unticked Closed-when is offered for archive
                  and the check fails with its named finding
      touches:    lean-doc-generator SKILL.md (close row) · evals/fixtures/ (new must-FAIL set)
                  · evals/run-*.sh · scripts/qa-check.sh wiring
      depends-on: none
      assumes:    the §11 row is correct as written — this wires it, it does not redesign it.
                  EPIC-001 is open, so the path has never run: exercise it once on real input (L-007)
      tracker:    none — found by recon 2026-08-09; §11 row exists, close never executes it (L-020)
      state:      ready

- [ ] TASK-168 — Give docs/research/ a retention rule and an archive target  [size: M] [risk: low] [HITL]
      class:      decision
      done-when:  DOCS_Guide §11 carries a `research/<slug>.md` row with a named trigger and target
                  path; §2's research row points at it; close's compaction sweep line
                  ("superseded/duplicated research → supersede note or archive") resolves to that
                  target instead of an undefined one; `docs/architecture/overview.md`'s directory
                  tree shows the archive path; a must-FAIL fixture rejects an archive of a research
                  doc still cited by a live ADR/sprint, with its named finding
      touches:    DOCS_Guide §2 + §11 · lean-doc-generator SKILL.md (compaction sweep)
                  · docs/architecture/overview.md · evals/fixtures/
      depends-on: none
      assumes:    trigger is supersession/verdict-consumed, not an age count; 25 live research files
                  means the first pass is a real backlog, and pruning them is NOT in scope here —
                  this task ships the rule, not the sweep
      tracker:    none — found by recon 2026-08-09; the only doc class close names but §11 omits
      state:      ready

- [ ] TASK-169 — Name the end-of-life for both ephemeral intake artifacts  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  `BUG-<slug>.md` has an explicit disposal rule stated at `/triage` step 3 (what
                  happens to the FILE once its content is routed to TASK/TD) and mirrored in §11;
                  and the working feature PRD has a stated end-of-life in `/task-decomposer` +
                  `references/prd-and-slices.md` (it is intake scaffolding, never a §2 core file);
                  a must-FAIL fixture catches a BUG file left undisposed after routing
      touches:    triage SKILL.md · task-decomposer SKILL.md + references/prd-and-slices.md
                  · DOCS_Guide §2 + §11 · evals/fixtures/
      depends-on: none
      assumes:    both are the same concern — an intake artifact with no durable home — which is why
                  they are one task; if G2 finds the disposal rules diverge (delete vs archive),
                  split before implementing
      tracker:    none — found by recon 2026-08-09; `docs/product/requirements.md` deliberately
                  excluded (§2 sets its Archive to `—`; it is durable, not ephemeral)
      state:      ready

- [ ] TASK-171 — Make every entry point aware the night run exists  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  night-run.md Part 1a step 1 lists an epic slice alongside intent / PRD / ticket;
                  `/prime`'s `Next:` router offers the unattended option when an active sprint has
                  open DoD; an audit line records that `/flow` stage 4 and `CONTEXT.md` § Gates
                  already carry it; and the chain is exercised once end-to-end from an epic slice
                  to a green pre-flight (L-020 — present in its own file is not wired)
      touches:    orchestrator/references/night-run.md · prime SKILL.md · .claude/CONTEXT.md
                  (only if the audit finds a gap)
      depends-on: none
      assumes:    prime stays read-only — the hint names the next skill, it never launches a run;
                  widening prime's charter beyond an emitted `Next:` line is out of scope
      tracker:    none — found by recon 2026-08-09; Part 1a omits the epic input, prime omits the mode
      state:      ready

- [ ] TASK-172 — Deny the G1 fast-path to tasks that never met the grill  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  a task carries a checkable provenance signal for whether it passed the intake
                  grill; `/lean-doc-generator` close (follow-up bucket) and `/triage` bug intake both
                  stamp it as ungrilled; `/orchestrator` G1 states the inverse of its existing clause
                  — no decomposer provenance → full grill, never fast-path confirm; a must-FAIL
                  fixture presents a close-filed follow-up to G1 and the fast-path is refused with
                  its named finding
      touches:    orchestrator SKILL.md (G1) · lean-doc-generator SKILL.md (close §10 routing)
                  · triage SKILL.md · .claude/CONTEXT.md (task entry shape) · evals/fixtures/
      depends-on: none
      assumes:    the marker is a field on the task entry shape, not inferred from `tracker:` —
                  inferring provenance is TD-031's pattern (narrowing a guard on no evidence).
                  Grill-until-frontier-empty itself is already correct and is NOT being changed
      tracker:    none — found by recon 2026-08-09; G1's "decomposer-approved → fast-path" clause
                  has no field behind it, and close-filed follow-ups never meet the intake grill
      state:      ready

- [ ] TASK-170 — Add CODE_OF_CONDUCT to the standard, gated like CONTRIBUTING  [size: M] [risk: low] [HITL]
      class:      execution
      done-when:  DOCS_Guide §2 root table carries a `CODE_OF_CONDUCT.md` row (create ← team ≥ 2, or
                  on request; update ← enforcement contact / policy change; archive `—`); a
                  `CODE_OF_CONDUCT.md.template` ships and `init` can scaffold it; every template-count
                  claim moves in lockstep (33 core + 2 non-core = 35) and the TASK-166 check proves it;
                  `docs/architecture/overview.md` § "Base-tier docs this repo deliberately does not
                  have" gains a CoC exemption row with its own revisit-when
      touches:    DOCS_Guide §2 · templates/ (new) · lean-doc-generator SKILL.md (init list)
                  · .claude/CLAUDE.md · docs/architecture/overview.md · README.md
      depends-on: TASK-166
      assumes:    Contributor Covenant 2.1 as the base — **unconfirmed, blocks G2 until G1 rules on it**;
                  lean-flow itself takes the exemption, it does not adopt a CoC for a single maintainer
      tracker:    none — decided 2026-08-09; no CoC exists anywhere in the repo or the standard
      state:      ready

### P3 — Long-term

> Rejected work lives in **`.out-of-scope/`** — each file carries its own reasoning, revisit-if and
> expiry, and `/triage` step 1 scans that directory before keeping any resembling task. The per-task
> pointer lines that used to sit here were breadcrumbs to those files; pruned at SPRINT-055 promote
> (§11 TODO cap) on the same reasoning §11 uses for shipped Backlog entries — the durable home is the
> `.out-of-scope/` file, plus git. Ids stay monotonic: 006 · 007 · 040 · 047 · 120 · 148 are not reused.

---

## Tech Debt

> Moved → **`TECH-DEBT.md`** (root) — split 2026-07-29. Filed at Sprint Close, aged at Sprint Promote.

---

## Changelog (current sprint only)

> Move to root `CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — SPRINT-054's shipped changes are held for a MINOR release. Sprint history → [`CHANGELOG.md`](CHANGELOG.md) (rotated archives → `docs/changelog/`).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

