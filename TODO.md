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

> **SPRINT-057 — Prove the Guards** → [docs/sprint/SPRINT-057-prove-the-guards.md](docs/sprint/SPRINT-057-prove-the-guards.md)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

- [ ] TASK-177 — Put the four grandfathered cap breaches on a diet, or move their caps by ADR  [size: M] [risk: low] [HITL]
      class:      decision
      done-when:  `scripts/lib/doc-caps-grandfathered.txt` is empty, and each entry left it by one of
                  two routes recorded in the file's history: the doc came back under its stated cap,
                  or its cap moved by ADR after a measured diet (§7). The checker already prints
                  "back under cap: DELETE its grandfather row" when a row has earned removal
      touches:    docs/research/{loop-hygiene-prd,graphify-daily-value,graph-engineering}.md ·
                  AGENTS.md · scripts/lib/doc-caps-grandfathered.txt · docs/adr/ if a cap moves
      depends-on: none
      assumes:    the three research docs (214 · 157 · 122 against 120) split by moving whole
                  sections, never by compressing — §7 says knowledge docs split and ledgers compress,
                  and SPRINT-054 T4 has a worked precedent. AGENTS.md at 11 vs ~10 is the odd one:
                  the cap is written approximate and the file is a thin pointer, so the honest fix
                  may be to state a real number in §2 rather than to trim a line
      tracker:    SPRINT-056 T2 — the check that found them; three were known, AGENTS.md was not
      origin:     close-retro
      state:      ready

- [ ] TASK-178 — Measure where the gate's 126 seconds actually go before moving anything  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  a per-harness timing breakdown exists for a bare `qa-check.sh` run, and the
                  decision to move / cheapen / keep each always-on harness is made against that
                  table rather than against an impression
      touches:    scripts/qa-check.sh · evals/ (measurement only; changes are a separate task)
      depends-on: none
      assumes:    no harness is moved to `QA_FULL=1` inside this task. Moving one is a coverage
                  reduction and carries L-076's proof obligation — demonstrate what a bare run no
                  longer catches — which is its own work. This task produces the number that decision
                  needs, because there isn't one: 126s is the only figure anyone has, and the
                  per-harness split has never been taken (L-097)
      tracker:    TD-046
      origin:     close-retro
      state:      ready

- [ ] TASK-179 — Make the permission surface prove itself live  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  Part 1 specifies a pre-flight PROBE with (a) a deliberate must-deny action, so
                  "everything succeeded" and "the allowlist was ignored entirely" stop looking
                  identical; (b) which resolved trust key to verify, and why running interactively
                  once cannot fix a headless-key mismatch; (c) measured rows for Read/Edit/Write
                  forms, not Bash alone, with the containment trade named; (d) probe cost stated
                  against run cost so probing reads as unconditional
      touches:    skills/orchestrator/references/night-run.md (Part 1, Part 4) ·
                  skills/orchestrator/references/night-run-checks.md · docs/research/headless-permission-surface.md
      depends-on: none
      assumes:    night-run-checks.md:13 says the probing mechanism "graduates to its own task" —
                  that task was never created, which is why there is no probe for a control to live
                  in. This IS that task. Encode the PRINCIPLE and the method, never the reporter's
                  host detail (Store-stub python3, separator spelling, exact matcher strings) — the
                  report says so itself and L-015 makes it law. Shares night-run.md with 180/183/184
      tracker:    consumer field report, lean-flow 1.29.0 · findings 1·2·3·9 · L-103 · L-086
      origin:     decomposer
      state:      ready

- [ ] TASK-180 — Verify the watchdog actually started before trusting it  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  Part 3 requires confirming the watchdog is running after launch, and says what to
                  do when it is not; a watchdog that dies at startup is named as indistinguishable
                  from a healthy one
      touches:    skills/orchestrator/references/night-run.md (Part 3)
      depends-on: none
      assumes:    ONLY the start-verification half of the finding applies. The report's second point
                  (use two stall signals) is already satisfied — Part 3 defines the stall as "no new
                  stream-json line AND no new commit". Verified by reading; do not re-litigate it
                  (L-017: the delta over our surface, not the finding's standalone merit)
      tracker:    consumer field report · finding 8 · L-103 (same family, one layer up)
      origin:     decomposer
      state:      ready

- [ ] TASK-181 — Record the G1/G2 sign-off where the run can read it  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  promote writes a `gates_signed:` frontmatter field naming which gates passed and at
                  what commit; night-run Part 1's checklist item points at that field instead of at a
                  human's memory; a `sprint-bulk unattended` run can skip re-running signed gates. A
                  must-FAIL fixture proves an ABSENT field reads as NOT signed, never as a pass
      touches:    skills/lean-doc-generator/SKILL.md (promote row) · templates/SPRINT.md.template ·
                  skills/orchestrator/references/night-run.md (Part 1) · scripts/qa-check.sh ·
                  scripts/lib/ · evals/
      depends-on: none
      assumes:    this is L-099 arriving from a consumer one sprint after SPRINT-055 shipped that
                  lesson — a sign-off the run cannot read is a sign-off that did not happen. The
                  field's ABSENCE must mean unsigned: a new field whose absence reads as approval is
                  the L-058 false negative shipped into a headless run. Frontmatter chosen over a
                  body block because every checker already parses frontmatter via fmv(). Shares
                  lean-doc-generator/SKILL.md with 182
      tracker:    consumer field report · finding 4 · L-099
      origin:     decomposer
      state:      ready

- [ ] TASK-182 — Stop promote emitting a size L into a frozen Plan  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  promote checks the size tag of every task it pulls and refuses to render an `L`
                  into the Plan, splitting (or sending back to decompose) while it is still free —
                  before `plan locked` freezes the Plan
      touches:    skills/lean-doc-generator/SKILL.md (promote row) · .claude/CONTEXT.md if the gate
                  table needs the rule stated
      depends-on: none
      assumes:    G1 already splits an L, but G1 runs AFTER promote has frozen and committed the
                  Plan, so the split costs a scope-change entry plus a Plan amendment. The check is
                  one scan at the moment tasks are pulled. Shares lean-doc-generator/SKILL.md with 181
      tracker:    consumer field report · finding 5
      origin:     decomposer
      state:      ready

- [ ] TASK-183 — Execute the DoD commands once at pre-flight  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  Part 1 requires running each DoD/gate command once on the host that will execute
                  the run, before firing; the item names why (a DoD command is a claim about the
                  host, not only about the code) and that failure there fails every task for a
                  reason unrelated to the work
      touches:    skills/orchestrator/references/night-run.md (Part 1)
      depends-on: none
      assumes:    generic — an interpreter or task runner named in project instructions can be
                  absent or shadowed on the run's host. Do NOT encode the reporter's specific case.
                  Cost is one invocation per command. Shares night-run.md with 179/180/184
      tracker:    consumer field report · finding 6 · L-052 (platform facts get run, not inferred)
      origin:     decomposer
      state:      ready

- [ ] TASK-184 — Resolve the output-format conflict across Parts 2, 3 and 4  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  Part 2's trigger recipe mandates `stream-json`; Part 3's stall signal and Part 4's
                  cost row are consistent with it, with `total_cost_usd` read from the terminating
                  result event rather than from `--output-format json`; no section assumes a format
                  another section contradicts
      touches:    skills/orchestrator/references/night-run.md (Parts 2, 3, 4)
      depends-on: none
      assumes:    the conflict is ours, not the reporter's: Part 2 specifies no format, Part 3's
                  watchdog needs stream-json lines to exist, Part 4 says to read cost off
                  `--output-format json` — which buffers until exit. L-083 is the recorded instance
                  (a healthy run reported DEAD-ON-ARRIVAL). Verify the terminating result event
                  actually carries the cost fields before rewriting Part 4 — that is a platform fact
                  to run, not infer (L-052). Shares night-run.md with 179/180/183
      tracker:    consumer field report · finding 7 · L-083
      origin:     decomposer
      state:      ready

### P3 — Long-term

> Rejected work lives in **`.out-of-scope/`** — each file carries its own reasoning, revisit-if and
> expiry, and `/triage` step 1 scans that directory before keeping any resembling task. The per-task
> pointer lines that used to sit here were breadcrumbs to those files, pruned under §11's TODO cap on
> the same reasoning §11 uses for shipped Backlog entries — the durable home is the `.out-of-scope/`
> file, plus git. Ids stay monotonic: 006 · 007 · 040 · 047 · 120 · 148 are not reused.

---

## Tech Debt

> Moved → **`TECH-DEBT.md`** (root) — split 2026-07-29. Filed at Sprint Close, aged at Sprint Promote.

---

## Changelog (current sprint only)

> Move to root `CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — SPRINT-056's shipped changes are written up as **v1.30.0** in [`CHANGELOG.md`](CHANGELOG.md) and await the MINOR version bump (feature sprint → by hand; `/release-patch` is PATCH-only). SPRINT-055's shipped as v1.29.0, SPRINT-054's as v1.28.0. Rotated archives → `docs/changelog/`.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

