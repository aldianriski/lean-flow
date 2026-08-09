---
sprint: 057
slug: prove-the-guards
owner: Maintainer
last_updated: 2026-08-09
status: active
gates_signed: G1,G2 @ 6d3811b
plan_commit: d9b1ab9
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-057 — Prove the Guards

> **Theme:** The night-run protocol tells you how to build its guards and never how to prove one is
> live. A field report from a **consumer** — their own SPRINT-131 on lean-flow 1.29.0, a different OS
> and shell — lost two whole configurations to guards that were present, plausible and inert, and
> caught both only because the probe carried a deliberate must-deny action. SPRINT-056 fixed checkers
> that reported green over input they never read; this is the same failure one layer out, in the
> permission surface and the watchdog, arriving as outside evidence rather than dogfooding.

## Scope

**In:** a pre-flight probe that proves the permission surface is live, with a negative control ·
watchdog start-verification · the G1/G2 sign-off written where the run can read it · `promote`
refusing to freeze a `size: L` · DoD commands executed once before firing · one output format agreed
across Parts 2, 3 and 4.

**Out (deferred):** every host-specific detail in the report — a Store-stub `python3`, separator
spelling, PowerShell BOM/ANSI, exact matcher strings. The report's own generalizes/host-specific table
says not to encode them and L-015 makes that binding here · the report's second Finding-8 point (two
stall signals), already satisfied — Part 3 defines the stall as *no new `stream-json` line **and** no
new commit* · TD-037, re-reviewed and reaffirmed at this promote · TASK-177 (research diet) and
TASK-178 (gate timing), unrelated to the protocol and left in the Backlog.

## Plan

### T1 — Make the permission surface prove itself live `[size: M · risk: med · class: decision · HITL]`
Layers: `skills/orchestrator/references/night-run.md` · `skills/orchestrator/references/night-run-checks.md` · `docs/research/headless-permission-surface.md` · `docs/LEARNINGS.md`
Cites: `settings.json` — named as the consumer artifact the rules live in, not edited here
Depends-on: none
The capability-checks note in `night-run-checks.md` reads *"Capability checks (specified — the probing
mechanism graduates to its own task)"*. That task was never created, which is why there is no probe for a negative control to
live in — this is that task, four sprints late. The control is the whole method: without a deliberate
must-deny action, "every call succeeded" and "the allowlist was ignored entirely" produce identical
output, and the second is exactly what an untrusted workspace does. Also delivers **L-086's
promotion**, ruled at this promote and deliberately not written anywhere else, since this task
rewrites the section that is its home (§10: a second copy reproduces the failure — L-092).

**Acceptance:** Part 1 specifies a probe whose green verdict is evidence rather than a vibe — it
carries a must-deny control, names which resolved trust key to verify, and states the probe's cost
against the run's.

**DoD:**
- [x] The probe procedure exists as a pre-flight item, with a **deliberate must-deny action** whose
      continued denial is what makes the other results readable
- [x] It names **which resolved trust key** to check, and why running interactively once cannot fix a
      headless-key mismatch — the interactive session lands on the key that is already trusted, so the
      remedy the CLI itself prints produces no change and no error
- [x] Measured rows exist for **file-tool** forms (`Read`/`Edit`/`Write`), not `Bash` alone, with the
      containment trade named: a working form broader than a path glob pushes containment onto the
      deny list and the task scope
- [x] Probe cost is stated **against** run cost, so probing reads as unconditional rather than as a
      judgement call each time
- [x] **No host-specific detail encoded** — the transferable claim is "measure these forms before
      relying on them", never a spelling that held on one machine (L-015 · the report's own table)
- [x] `L-086` marked `promoted: yes → night-run.md Part 1`, and its ledger body collapsed (§11)

### T2 — Execute the DoD commands once at pre-flight `[size: S · risk: low · class: execution · HITL]`
Layers: `skills/orchestrator/references/night-run.md`
Cites: none
Depends-on: T1 (shared `night-run.md` — T1 owns it first)
A DoD command is a claim about the **host**, not only about the code. An interpreter or task runner
named in project instructions can be absent or shadowed on the machine the run actually uses, and the
failure then reads as a broken script rather than a missing tool. It bites hardest because these are
the commands used to *prove* work is finished: if they cannot run, every task fails its gate for a
reason unrelated to the work.

**Acceptance:** Part 1 requires running each DoD/gate command once on the run's own host before
firing, and says why a failure there is not a failure of the work.

**DoD:**
- [x] Pre-flight item added, naming the cost (one invocation per command) so it is not skipped
- [x] States the diagnostic point: a missing tool surfaces as a broken script (L-052 — a platform
      fact is run, never inferred)
- [x] Generic — the reporter's specific absent binaries are evidence in the log, not content in the doc

### T3 — Agree one output format across Parts 2, 3 and 4 `[size: M · risk: med · class: decision · HITL]`
Layers: `skills/orchestrator/references/night-run.md`
Cites: `night-run.sh` — the launcher whose ALIVE check consumes the format; verified, not edited here
Depends-on: T2 (shared `night-run.md`)
Found while verifying the report, and **ours rather than the reporter's**: Part 2's trigger recipe
specifies no `--output-format`; Part 3's watchdog defines its stall signal as *no new `stream-json`
line*; Part 4 tells you to read `total_cost_usd` off `--output-format json`, which buffers until exit.
Three sections, three incompatible assumptions. L-083 is the recorded instance — a healthy run
reported `DEAD-ON-ARRIVAL` because the format it was given could not emit progress by construction.

**Acceptance:** one format is mandated in Part 2 and every downstream consumer of it (watchdog stall
signal, calibration row) is consistent with that choice.

**DoD:**
- [x] Part 2's recipe mandates `stream-json`, so liveness is observable by construction
- [x] Part 4's calibration row reads cost from the **terminating result event** in the stream rather
      than from `--output-format json`
- [x] **Verify first** that the terminating event actually carries `total_cost_usd` / `num_turns` /
      `duration_api_ms` — a platform fact to run, not infer (L-052). If it does not, the degrade rule
      applies and the calibration row says so rather than going quiet
- [x] No section left assuming a format another section contradicts

### T4 — Verify the watchdog actually started `[size: S · risk: low · class: execution · HITL]`
Layers: `skills/orchestrator/references/night-run.md`
Cites: none
Depends-on: T3 (shared `night-run.md`)
Part 3 specifies watchdog behaviour and never says to confirm it is running. A watchdog that dies at
startup guards nothing and is indistinguishable from a healthy one — the inert-permission-rule family,
one layer up — and it fails at the worst possible moment, because you discover it only when you needed
it. The reporter's first watchdog died instantly on a parse error and logged nothing.

**Acceptance:** Part 3 requires confirming the watchdog is alive after launch and says what to do when
it is not.

**DoD:**
- [x] Start-verification step added to Part 3, naming the failure it prevents
- [x] The existing two-signal stall rule is **left alone** — Part 3 already requires *no new line AND
      no new commit*, which is what the report asks for (L-017: the delta over our surface, not the
      finding's standalone merit)

### T5 — Record the G1/G2 sign-off where the run can read it `[size: M · risk: med · class: decision · HITL]`
Layers: `skills/lean-doc-generator/SKILL.md` · `skills/lean-doc-generator/templates/SPRINT.md.template` · `skills/orchestrator/references/night-run.md` · `scripts/qa-check.sh` · `scripts/lib/check-gates-signed.sh` · `evals/run-gates-signed-fixtures.sh` · `evals/fixtures/gates-signed/`
Cites: `docs/QA.md` — the gate inventory it will need a row in at close
Depends-on: T4 (shared `night-run.md`, and the `scripts/qa-check.sh` chain starts here)
Pre-flight requires that batch G1 and G2 are "already signed off by the human" and never says the
sign-off must live **in the sprint artifact**. The run reads the sprint file; a sign-off that exists
only in the launching session's transcript is invisible to it, so the run re-runs both gates, reaches
for `AskUserQuestion` — unregistered headless — and parks every task having done zero work. This is
L-099 exactly, arriving from a consumer one sprint after we shipped that lesson.

**Acceptance:** `promote` writes a machine-readable record of which gates were signed and at what
commit; a `sprint-bulk unattended` run reads it instead of re-running the gates.

**DoD:**
- [x] `promote` sets a `gates_signed:` frontmatter field naming the gates and the commit
- [x] `night-run.md` Part 1's checklist item points at that field rather than at a human's memory
- [x] **An ABSENT field means NOT signed** — a must-FAIL fixture proves it, because a new field whose
      absence reads as approval is the L-058 false negative shipped into a headless run
- [x] Frontmatter, not a body block: every checker already parses frontmatter via `fmv()`, so this
      costs no new parser (ruled at this promote)
- [x] Fixture retained and wired into `qa-check.sh` (TD-012), verified red-on-new/green-on-old (L-090)

### T6 — Stop promote freezing a size L into the Plan `[size: S · risk: low · class: execution · HITL]`
Layers: `skills/lean-doc-generator/SKILL.md` · `.claude/CONTEXT.md`
Cites: none
Depends-on: T5 (shared `skills/lean-doc-generator/SKILL.md`)
G1 splits an `L` before proceeding — but G1 runs *after* `promote` has rendered, frozen and committed
the Plan as `plan locked`. So an `L` reaches a frozen Plan and the split then costs a `scope-change`
entry plus a Plan amendment against a commit minutes old. The check is one scan over the tasks being
pulled, at the moment they are pulled, where splitting is still free.

**Acceptance:** `promote` refuses to render a `size: L` task into a Plan, and says what to do instead.

**DoD:**
- [ ] `promote` checks the size tag of every task it pulls, before rendering
- [ ] An `L` is split (or returned to decompose) *before* `plan locked`, never after
- [ ] The rule is stated where promote's reader will meet it, and in `CONTEXT.md` § Gates if that is
      where the G1 split rule already lives

## Owner-action checklist

- [ ] Reinstall the plugin — still `1.28.0` installed against a `1.29.0` repo, and this sprint edits
      `night-run.md` and `lean-doc-generator`, both of which a stale copy would describe wrongly
      (L-021; in-session repair is `git diff <release>..HEAD -- skills/`, L-095)
- [ ] Bump to **v1.30.0** by hand — SPRINT-056 shipped a feature sprint and `/release-patch` is
      PATCH-only. CHANGELOG rotation becomes due the moment it lands (§11)

## Decisions (pre-locked)

- **D1** — Ownership is a strict chain, written into `Depends-on:` and not only here (L-099, and the
  lesson SPRINT-056 learned when the gate rejected its first map). `night-run.md` is shared by
  T1→T2→T3→T4→T5; `skills/lean-doc-generator/SKILL.md` by T5→T6. No task runs in parallel.
- **D2** — Findings 1·2·3·8 are one principle but **two tasks**, split by the guard they protect (T1
  permission surface, T4 watchdog). They fail independently and are verified by different means, so
  one task would have an acceptance criterion spanning two mechanisms.
- **D3** — The sign-off record is **frontmatter**, not a `## Gates` body block. Frontmatter is already
  parsed by every checker; a body block would cost a template section every consumer must carry plus a
  new parser, for the same readability.
- **D4** — Nothing host-specific from the report is encoded. The report supplies the *principle* and
  the *method*; its spellings held on one machine and this repo ships to consumers (L-015).

## Assumptions

- **A1** — The terminating `stream-json` result event carries the cost fields Part 4 needs.
  *Confirm: T3's first DoD line — run it, do not infer it (L-052). If false, the degrade rule applies.*
- **A2** — `gates_signed:` in frontmatter is readable by a headless run without new parsing.
  *Confirm: T5, by exercising the read path, not by asserting it.*
- **A3** — Part 3's two-signal stall rule needs no change. *Confirmed at promote by reading Part 3;
  recorded so T4 does not re-open it.*
- **A4** — We cannot cheaply dogfood a night run (markdown repo; calibration rows show $6.60–$16.54 a
  run). *Confirm on the consumer path — trace the scenario and exercise the mechanism, never read
  "it didn't fire here" as either broken or fine (L-016).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-057-prove-the-guards.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
