---
owner: Maintainer
last_updated: 2026-11-06
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## [Unreleased]

- **Changed** — An interactive `migrate` now shows its plan as text and raises the approval and each ruling as a popup, instead of waiting in prose; a headless run still parks to `/handoff` (TASK-608).
- **Changed** — coding-standards gains an optional `## Standards adopted` section; `init` and `migrate` ask once what the repo adopts (default `none`), and review applies its checks and exceptions, naming each failed check and location (TASK-605).
- **Changed** — Feature/bug tasks and behaviour-changing debt now need a `Negative:` scenario in Done-when; docs, config and spike tasks name one when it applies, else carry `Negative: n/a: <reason>`. Triage keeps new bugs `needs-info` until they name what must keep working after the fix, and `/diagnose` adds that box from its regression test. G2 names the test that would fail if the behaviour broke, or records a judgment tick when none exists (TASK-606).
- **Fixed (maintainer-only)** — `evals/ab/`: a judge call that fails or returns an empty reply now marks the attempt `infra:judge-failed`, so its slot retries or counts toward the 3-infra abort instead of scoring as not-passed, and a usage-limit judge failure pauses the run (TASK-602; root cause: the attempt class was computed before the judges ran, and the caught failure became an UNKNOWN verdict; TD-290 stays open until the next arm's amendment discloses it).
- **Fixed (maintainer-only)** — `evals/ab/`: a G2 signer call that throws now makes the attempt `infra:judge-failed`, even when the revise round then signs; a real `refuse` still refuses (TASK-604; root cause: the caught failure was returned as a refusal, so a login lapse could lower a protocol arm's score; TD-290 gains the signer).
- **Measured (maintainer-only)** — three workers re-checked after the provisioning lock: 6 slots, no provisioning failure, no infra attempt (TASK-603); the next release arm adopts N = 3 (TD-289).

## v2.20.0 — the design reads the business facts and stays in scope, a repo profile, and reported bugs become work items (2026-11-03)

**MINOR** — ships EPIC-023's measured set: S1 (the repo profile through `init` and `migrate`, stack question sets, leaner
templates) and S3's first two `/orchestrator` bundles, with the bug-item work of SPRINT-157 and SPRINT-159. No new skill; the
roster stays at 15. The standard moves to spec 0.19.0. Restart the session after installing. Measured before release (EPIC-023
D6): the exact shipped set scored 93.8% against 2.19.x's 81.2% and the no-plugin baseline's 89.6%, at 0.70x 2.19.x's tokens, with
no symptom regression (`docs/research/logs/ab-measurements-release.md` § Report). This releases the S1 entries held under D6 below.
S3's third bundle was measured and did not ship. The STANDARD major and 3.0.0 are not taken: no consumer contract breaks.

**Upgrading:**
- Installing is enough for `/orchestrator`'s changes: G2 names each stated business fact the change touches and lets the fact
  win over neighbouring code, a design stays inside the task's declared layers, every boundary report carries a `Progress:` line,
  probes live in the working tree and are deleted before the report, and what a repo's own tests leave outside the tree is named,
  never deleted.
- To add the repo profile (Stack, Conventions in use, business facts) to a repo already on lean-flow, re-run
  `/lean-doc-generator migrate`. It takes a backup point, keeps every existing decision and moves only what you approve. Skipping
  it is safe: every skill works with the docs you have.
- Work items gain an optional `type:` (feature, bug or debt); untyped items read as features. `/triage` files a reported bug as a
  `type: bug` item, and `migrate` proposes existing bug notes as bug items, moving only what you approve.

### Changes

- **Changed (maintainer-only)** — `evals/ab/`: clinic trials take a cross-process lock from port pick through `pg_ctl start`, so concurrent trials no longer race their Postgres startup (TD-289; the three-worker re-check is TASK-603).
- **Measured (maintainer-only)** — the release arms (EPIC-023 S4): arm Final (bundles 1-3, S1, on A2's snapshots) scored 96.9% and passed against A2 and A1, but bundle 3 and its residual (the business-facts box finding sources by file name, no delete outside the tree) fell short of non-inferiority against A4b (+3.1 [-6.3, 15.6], convention -11.5) and came off `main`; Final-on-A1 (S1's docs swapped for A1's) scored 100.0%, so S1 ships. Arm Release, the exact shipped set, scored 93.8%: +15.6 [6.3, 25.0] over A2 and +12.5 [0.0, 26.0] over A1 at 0.70x A1's tokens, above A0, so it ships (Amendments 9-11). `evals/ab/`: every arm's judges now leave the repo's lean-flow docs out of their context (the list was read only for `-a<digits>` arm ids).
- **Changed** — research docs that form a series live in topic folders (`docs/research/<topic>/`, one §2 row each), and the knowledge index, research checks and caps read them; §2 also places `docs/archive/`, `docs/qa/` with `QA.md`, the generated knowledge index, data files beside research logs, and per-feature sibling docs (spec 0.19.0, ADR-057).
- **Changed** — `/lean-doc-generator migrate`, re-run on a repo already on lean-flow, reads untyped tasks as features without rewriting them and proposes existing bug notes, `BUG-*.md` files, bug-flavoured tasks and verification-capture folders as bug items and evidence, moving only what you approve.
- **Changed** — `/prime` reports open bug items (count and oldest) beside the task count; `/flow` sends a reported bug to `/triage` and builds a bug item through `/diagnose`; the close retro lists each fixed bug item with its one-line root cause.
- **Changed** — `/triage` files a reported bug as a `type: bug` work item with its repro and redacted evidence; `/diagnose` reads that item first and, at its post-mortem, writes the root cause, fix, regression test and prevention into it.
- **Changed** — work items carry an optional `type:` (feature, bug or debt), and a reported bug becomes a `type: bug` work item that carries its repro, evidence and root cause instead of a temp-only report; evidence for any item lives in `docs/work/evidence/TASK-NNN/`, and business facts get a placed `docs/product/business-notes.md` (spec 0.19.0, ADR-056).
- **Added (maintainer-only)** — `evals/ab/run-dev.ts` runs a batch of development trials in parallel (`--workers N`, default 3), each slot with its own scratch log, and prints one result line per slot (EPIC-023 D16).
- **Changed (maintainer-only)** — `evals/ab/run-baseline.ts --workers N` runs up to N A/B trials at once under one driver, lock and log (default 1, unchanged); a stop lets running trials finish, and the pilot still stops before any other slot. The stale-workspace sweep now keeps a directory whose owning driver is alive, so a second driver no longer deletes a running trial.
- **Changed** — `/orchestrator` G2: a design names each stated business fact its change touches (requirements, business notes, the repo profile's business topics) and how it honours it; where a fact and the neighbouring code disagree, the fact wins.
- **Changed** — `/orchestrator`: anything a check creates inside the working tree (a database directory, a cache, a log) is removed before the report unless the task declares it; what the repo's own tests leave outside the working tree is named in the report, never deleted, since deleting it needs a permission an unattended run does not have.
- **Changed** — `/orchestrator` reports: every boundary report (gate verdict, task done, waiting on a long job) carries a `Progress:` line after its verdict: sprint members done and epic conditions ticked, each with a percentage, plus units done and an ETA for a running job (TASK-583).
- **Changed** — `/orchestrator` G2: a design's file list holds only what the change needs, inside the task's declared layers; ticking or moving the task file is bookkeeping, not a design file; a doc is listed only when the task or the change's behaviour needs it; a pin that belongs outside the declared layers is named as an open point, not added (TASK-575).
- **Changed** — `/orchestrator`: evidence for a criterion ticked on judgment comes from the repo's existing runners first; a throwaway probe script lives inside the working tree and is deleted before the report, never in a system temp dir, because an unattended run cannot answer the permission prompt that write raises (TASK-573).
- **Measured (maintainer-only)** — arm A4b (bundle 2: the Progress line, check leftovers, business facts, on A4a) scored 93.8% against A4a's 90.6% at 0.68x A1's tokens, with no symptom regression and no parked slot. It is ship-eligible by non-inferiority (EPIC-023 D17) and ships with A4a in the next release. It was the first arm run at two workers (about 75 minutes).
- **Measured (maintainer-only)** — arm A4a (the probe and design-scope fixes on A2's snapshots) scored 90.6% against A2's 78.1% and A0's 89.6%, at 0.55x A1's tokens, with no symptom regression. It is ship-eligible and tuning-sensitive (the eleven tasks no development run touched tie A2 at 90.9%); the owner rules it ships (EPIC-023 D15), which releases the two `/orchestrator` fixes above under D6. `evals/ab/`: `analyze.ts --comparator <arm>` rules an arm against another arm than A1.
- **Measured (maintainer-only)** — arm A2 (S1's `migrate` on the 2.x A/B snapshots) scored 78.1% against A1's 81.2% and A0's 89.6%, at 0.93x A1's tokens. It is ruled failed under the pre-registration (below the A0 floor; no gain over A1, no symptom regression), so the S1 entries below stay unreleased (EPIC-023 D6). `evals/ab/`: the setup operator answers `migrate`'s questions from frozen entries, and `analyze.ts` reads several slot files and prints symptom differences against A1.
- **Fixed** — README Quick start links to the setup guide without repeating its steps; the integrations template names an API contract file only when it exists.
- **Fixed** — `/lean-doc-generator` templates and `init` guidance state their rules without maintainer-specific ids, names or file references; format examples remain.
- **Changed** — `/prime` and `/flow` route an unprofiled repo to `/lean-doc-generator init` (no CLAUDE.md, CONTEXT.md or architecture overview) or `migrate` (docs but no `## Stack`): as the next step when nothing is tracked yet, otherwise named beside it. `init` writes an undecided business topic as `Not decided yet (owner, init)`, and its heading keeps `[CUSTOMIZE]` until it is decided (SPRINT-153, TASK-554).
- **Changed** — standard 0.18.2 (PATCH): on a repo whose AI-context files already carry the spec, `product/requirements.md` is no longer skipped. It cites those files topic by topic and never copies them. No verdict moves.
- **Changed** — `migrate` adds the repo profile to a 2.x repo and keeps every decision: it takes a backup point, compares the inventory after each action, applies the profile items, and verifies by reading only (TASK-553).
- **Changed** — `init` never overwrites an existing file and offers `migrate` when the repo already has docs (TASK-560).
- **Added** — question sets for React/Vite, Vue/Vite, Go/chi and Postgres; `init` loads the sets that match the detected stack through an index (TASK-549, TASK-550, TASK-551).
- **Changed** — `init` reads the business from the repo's own docs first, asks only the unknowns, and cites the source of each fact (TASK-548).
- **Changed** — templates stop asking for what the code already says, and none prescribes an architecture (TASK-552).
- **Added (maintainer-only)** — `evals/ab/`: an A/B measurement harness tracer for EPIC-023 (lean-flow 3.0). It runs one pinned (model ids, verified plugin hash), isolated (temp home, isolated config, outside reads denied) and measured trial on a fixture repo and appends a graded, costed row to `docs/research/logs/ab-measurements.md`. It is run by hand (`bun evals/ab/selftest.ts [--paid]`) and is never part of the gate. Nothing ships to consumers (SPRINT-147, TASK-533).
- **Changed (maintainer-only)** — `evals/run-emitter-column-fixtures.ts` treats `evals/ab/` as out of scope for its population census (SPRINT-147 scope-change).
- **Added (maintainer-only)** — `evals/ab/`: the unattended trial protocol with EPIC-023's eval-only D9 G2 exception. A trial runs in two phases: the loop writes its design, the harness signs G2 only if the declared files sit inside the task's `layers` and an isolated judge finds nothing out of scope, then it resumes the session to build. The files actually changed are re-checked afterwards. Any popup or permission denial parks the trial as not-passed, and every row records the D9 deviation. Fixture repo only; run by hand (`bun evals/ab/run-trial.ts --protocol d9`, `bun evals/ab/selftest.ts`), never part of the gate. Nothing ships to consumers (SPRINT-148, TASK-542).
- **Fixed (maintainer-only)** — `scripts/gate-remote.ts` runs and judges the declared gate's second stage: `bun test` now runs after `QA_FULL=1 sh scripts/qa-check.sh` in the same remote call, each stage to its own log and rc file, and the run exits 0 only when both pass (TD-279, TASK-531).
- **Fixed (maintainer-only)** — `scripts/gate-remote.ts` and `judgeOutput()` read the LAST `QA-CHECK` verdict line, `gate-remote` exits through a closed set (0 pass, 1 gate failed, 2 refused, 5 transport) with the remote rc printed, and a dirty working tree prints a one-line warning that HEAD is what is gated (TD-268, TASK-532).
- **Added** — a review of a draft before the owner approves it (a `/task-decomposer` breakdown before `approve`, an epic or other proposal before activation) now runs in a fixed rhythm: self-check first, the owner's forks asked before round 1, the altitude stated in the brief, at most two rounds with round 2 blocking only on an outcome-changing high, and every other finding carried to the later gate as a note. It lives in the orchestrator's `review-scoping.md` § Draft reviews; both skills point there (SPRINT-149, TASK-546).
- **Added** — `init` reads code samples per layer and writes two cited sections, Stack (architecture overview) and Conventions in use (coding standards); the requirements template gains Main flows and Invariants and renames Problem → Business goal, Out of scope → Non-goals and Non-functional requirements → Quality attributes (new scaffolds only; existing docs are untouched) (SPRINT-150, TASK-547).
- **Fixed** — `/lean-doc-generator` now suggests all eight of its modes when typed (it showed four: `init`, `migrate`, `epic` and `prd` were missing), and `/humanizer` names its audit mode (SPRINT-150, TASK-557).
- **Changed** — `promote` can pull a still-blocked task together with its blockers: when every open blocker joins the same sprint, the dependent joins in a later wave with no state change, and leaves by scope-change if a blocker fails (SPRINT-151, TASK-558).
- **Added (maintainer-only)** — `evals/ab/`: EPIC-023's S0 corpus and machinery. Answers files for both A/B repos (business facts, operator answers, provenance); 16 tasks authored in isolation, each re-verified red then green, owner-signed realistic; arms A0/A1 frozen per repo by per-file manifests that the measured-run preflight enforces; blind per-dimension judges with file context, retry and validity rules, and the analysis (primary, symptoms, bootstrap, R-b, A0 floor), calibrated live at 85.5% on judged rows. Run by hand, never part of the gate; nothing ships to consumers (SPRINT-151, TASK-536..541, 543).
- **Added (maintainer-only)** — `evals/ab/`: the S0 baseline run. The pre-registration was frozen and amended five times under owner signature. `run-baseline.ts` drives the 96-slot schedule, resumable, with retries per the frozen classification and owner-ruled voids. `build-slots.ts` turns the log into analysis slots: it applies voids before the freeze check, and a freeze line may carry over rows measured under an earlier freeze. PowerShell's module-analysis cache file is not counted as the agent's edit. Result, in the log's § Report 2026-11-01: A1 (2.x) 81.2% against A0 (no lean-flow) 89.6% on the primary endpoint, regressed against A0 on convention, business and lost detail, with no symptom a measured defect. Run by hand, never part of the gate; nothing ships to consumers (SPRINT-152, TASK-544, 545).

## v2.19.1 — three guards report only what they saw (2026-10-28)

**PATCH** — ships SPRINT-146 (Say What They Saw), a fixes-only sprint. No new skill; the roster stays at 15. Installing the
release is enough; no upgrade step. The standard is unchanged (spec 0.18.1). Restart the session after installing.

### SPRINT-146 — Say What They Saw (2026-10-28)

**Consumer-facing:**
- `orchestrator/references/night-run.md` names a new rollup line, `TASK-NNN · uncovered · …`, for a member's open
  `## Done when` box that no Plan `Tn` cites. It also adds that case to the `HARD_FAILURE` row: such a run can no longer
  end `PLAN_EXHAUSTED`.

**Maintainer-side:**
- **Fixed** — the night-run reaper no longer ends `PLAN_EXHAUSTED` over a member's open `## Done when` box that no Plan `Tn` cites (TD-201): it writes a `TASK-NNN · uncovered · …` rollup line and the terminal becomes `HARD_FAILURE`, replacing only the clean ending. `sprint-members-cli.ts` gains an `uncovered` mode; `counts` output is unchanged.
- **Fixed** — the revise-loop ceiling verdict no longer overclaims (TD-152): its `PASS` line keeps its prefix and now states how many `Tn · retry ·` lines it read, that they are model-reported, and that an unlogged retry is undetectable. FAIL paths are unchanged.
- **Fixed** — `qa-verdict.ts` now says so when its non-zero exit skips a stage chained after it with `&&` (TD-155): under `bun run test` it prints that `bun test` will not run; nothing new prints on a pass, under `gate`, or on a direct run. Exit codes are unchanged.
- TD-128 and TD-166 closed (fixed in code earlier, rows never closed); TASK-527 cancelled under ADR-053; TASK-513…522
  (six files) pruned (§11); L-258 promoted to LEARNINGS § Durable rules › edit-safety; L-260 and TD-279 filed.

## v2.19.0 — English terms of art kept in Indonesian domain text, and a working list recast as requests (2026-10-27)

**MINOR** — ships SPRINT-145 (Keep the Terms, Recast the List), a feature sprint drawn from an owner's corrections to a
real Indonesian request memo. No new skill; the roster stays at 15. Installing the release is enough; no upgrade step.
The standard is unchanged (spec 0.18.1). Restart the session after installing.

### SPRINT-145 — Keep the Terms, Recast the List (2026-10-27)

**Consumer-facing:**
- The Indonesian humanizer catalog keeps English terms of art in domain text: a spec name, column header, capacity term
  or test name stays English even when a plain Indonesian phrase exists (concurrent user, acceptance test, write
  penalty, free space, fault tolerance), and the Keep Indonesian list now says it covers general vocabulary only.
  Measured on a new retained fixture of a synthetic Indonesian request memo (TASK-525).
- A sixth overlay pattern, LF-6: an internal list of open decisions inside text addressed to someone else is recast as
  numbered requests or questions to the recipient, every item kept and none decided for them. The Indonesian catalog
  gains ID-18 (hedges such as "di atas kertas" go, while the claim's basis, "menurut perhitungan", and any testing
  obligation stay) and a label-first fragment example under ID-2 (TASK-526).

**Maintainer-side:**
- A retained fixture, `evals/fixtures/humanizer/term-of-art/`: a synthetic memo that fails on the 2.17.0 pass (0 of 3)
  and passes after (3 of 3), with every run recorded and judged by a reader that did not write the brief.
- L-257 promoted; L-258 to count 2; TASK-512 pruned (§11); v2.17.x rotated to `docs/changelog/CHANGELOG-2.17.0.md`.

---

