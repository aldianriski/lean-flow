---
sprint: 044
slug: night-run-ergonomics
owner: Maintainer
last_updated: 2026-08-01
status: closed
plan_commit: 8024a7d
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-044 — Night-Run Ergonomics

> **Theme:** SPRINT-043 proved a night run can finish. What it did not do is make one pleasant to
> start or affordable to repeat: the trigger was a hand-assembled 50-rule command line, nothing
> confirmed the run was alive before the owner walked away, and two units cost $16.54. This sprint
> closes the distance between "it works" and "you would actually use it nightly" — and clears the
> reference-length debt the last two sprints kept making worse.

## Scope

**In:** splitting the capability-check snippets out of the unattended reference so it stays readable
while three tasks add to it (T1) · deriving the allowlist into settings permissions instead of a CLI
string (T2) · a launcher that fires detached and reports whether the run is actually alive (T3) ·
finding and cutting the dominant cost driver (T4) · erasing resolved tech-debt rows rather than
collapsing them (T5) · cutting the MINOR release that covers SPRINT-043 **and** this sprint (T6).

**Out (deferred):** **TD-023**'s form-sensitivity fix — T2 carries the caveat forward but does not
revise the derivation rule; the fix wants its own task once a reproduction exists · **TD-024** — its
diagnosis was corrected at the last close and it needs *reproduction* before any mitigation, which is
research, not execution · **throughput** (larger Plans per night) — T4 establishes cost per unit
first, because scaling an unmeasured cost is how a night run gets expensive · running **this** sprint
unattended, which D2 rules out.

## Plan

### T1 — Split the capability checks out of the unattended-run reference `[size: M · risk: low · class: execution · AFK]`
Layers: `skills/orchestrator/references/night-run.md` · `skills/orchestrator/references/night-run-checks.md` · `evals/run-skill-freshness-fixtures.sh` · `evals/run-worktree-usability-fixtures.sh`
Depends-on: none

TD-014, whose re-review fell due at this promote. Its written trigger — a third embedded snippet —
has still not fired, but the file has grown 427 → 495 lines since the debt was filed and **three tasks
in this sprint add to it again**. The trigger was a proxy for "past comfortable reading for someone
deciding whether to fire a run", and the proxy has drifted from what it measures. Goes first so the
rest of the sprint edits the smaller file.

**Acceptance:** the two snippets and their decision tables live in a sibling reference, the
unattended-run doc points at them, and both fixture harnesses pass with their content unchanged —
re-pointed at the new path and nothing else.

**DoD:**
- [x] Both capability-check snippets and their decision tables moved **verbatim** — no wording,
      logic, or exit-path changes ride along with the move
- [x] The unattended-run reference keeps the contract, entry path, pre-flight, trigger, watchdog and
      rollup, and points to the new sibling for the checks
- [x] Both extracting harnesses re-pointed at the new path, their assertion content otherwise
      **unmodified** — this is the proof the move was verbatim rather than a rewrite
- [x] Both harnesses pass, run bare (L-057); a deliberately mis-pointed path FAILs loud by name,
      confirming the anchor guard still discriminates
- [x] Both files carry ownership headers
<!-- QA: the harness pass/fail IS the verbatim proof — treat a green run as the evidence, not a formality. -->

### T2 — Derive the allowlist into the project settings permissions `[size: S · risk: low · class: execution · AFK]`
Layers: `skills/orchestrator/references/night-run.md` · `.claude/settings.json`
Depends-on: T1

The four-source derivation currently lands in a `--allowedTools` string assembled by hand — 50 rules
for SPRINT-043, rebuilt from scratch each run and reviewable only as a command line. A settings file
makes it a static, diffable artefact. Split it the way this repo already splits config: repo-generic
rules tracked, owner-reserved or machine-specific ones in the gitignored local file, which is exactly
where `git push` already sits.

**Acceptance:** the pre-flight describes deriving into settings permissions with the tracked/local
split stated, one syntax form pinned, and TD-023's caveat carried; this repo's own tracked settings
file gains the night-run rules.

**DoD:**
- [x] Pre-flight says the derivation lands in settings permissions, not an inline string
- [x] The tracked-vs-local split is stated as a rule, not an example — repo-generic tracked,
      owner-reserved and machine-specific local
- [x] **One permission-rule syntax form is pinned and stated once.** The repo currently carries two
      spellings of the same rule and neither reader nor matcher flags the mismatch
- [x] TD-023's caveat carried explicitly: a settings file changes ergonomics, **not** form-sensitivity
      — the matcher still reads the literal invocation
- [x] Wording never assumes a settings file exists — a consumer may have none, and no skill gains the
      ability to write one (`init`'s exclusion is unchanged, L-015)
- [x] **(scope-change)** The **bare-invocation rule** is stated: landing-path and gate commands are
      issued one per call — no `cd` prefix, no `&&` chain, no variable-assignment prefix, no redirect —
      and anchored with `git -C <abs-path>` rather than by changing directory. Carries the measured
      evidence (23 of 25 denials were form failures on individually-permitted commands) so the rule
      reads as a finding rather than a style preference, and notes it converges with L-057's
      never-pipe-a-gate rule for a different reason
- [x] **(scope-change)** The derivation covers **tools as well as commands** — a host offering more
      than one shell needs each authorized, or the run silently loses the unauthorized one. This is the
      same class of omission as the landing-path gap, one level up

### T3 — Ship a launcher that fires detached and confirms the run is alive `[size: M · risk: med · class: execution · AFK]`
Layers: `scripts/night-run.sh` · `skills/orchestrator/references/night-run.md`
Depends-on: T1, T2

Firing a run today means pasting a long command and then having no idea whether it survived its first
seconds — a trigger that dies immediately and one running normally look identical until the watchdog's
20-minute stall window elapses. The hidden half: a run started as a child of the terminal dies when
that terminal closes, so a confirmation that dies with it would be worse than none, not better.

**Acceptance:** the launcher fires detached and prints exactly one verdict after ~2–3 minutes —
`ALIVE` or `DEAD-ON-ARRIVAL` naming the failure — and the run demonstrably survives closing the shell
that launched it.

**DoD:**
- [x] Dependency-free POSIX sh; runs the pre-flight checks before firing, and does not fire if one blocks
- [x] Fires **detached** — closing the launching terminal cannot signal the run dead
- [x] After ~2–3 minutes prints one verdict: `ALIVE` requires process up **and** first observable
      progress (a log line or a commit), never merely a live PID
- [x] `DEAD-ON-ARRIVAL` names what failed, rather than reporting a bare non-zero (L-059)
- [x] **Both verdicts exercised on real input** — a genuine start and a deliberately broken trigger —
      using a throwaway prompt costing cents, not a sprint
- [x] **Detachment proven by doing it**: close the parent shell, confirm the run continues. Reasoning
      about `nohup` semantics is not the test
- [x] Consumer-generic: no path or command specific to this repo leaks into the shipped guidance (L-015)

### T4 — Find and cut the dominant cost driver `[size: M · risk: low · class: execution · AFK]`
Layers: `docs/research/night-run-cost.md` · `skills/orchestrator/references/night-run.md` · `scripts/lib/check-layers-observed.sh`
Depends-on: T1, T2, T3

L-073. $16.54 for two ~25-line changes, 64 turns, against SPRINT-041's 15 turns for comparable work.
Something in the loop is spending turns disproportionately and nobody has looked at where. Wall-clock
is explicitly not the target: 22 minutes for two units leaves a full night with capacity to spare.

**Acceptance:** the run's spend is attributed to **named** drivers in a research note, and the largest
one has a named change applied.

**DoD:**
- [x] Spend decomposed into named drivers — coordinator versus dispatched agents, and by phase — from
      the captured run data rather than estimated
- [x] The single largest driver is identified and a change applied to it, stated as a change to a
      specific behaviour rather than an aspiration
- [x] The note records what was *not* the driver, so the next investigation does not re-derive it
- [x] Proof of reduction is **explicitly out of scope** — it is the next run's calibration row. This
      task must not be closeable only by firing a paid run it does not control

### T5 — Erase resolved tech-debt rows instead of collapsing them `[size: S · risk: low · class: execution · AFK]`
Layers: `skills/lean-doc-generator/references/DOCS_Guide.md` · `skills/lean-doc-generator/SKILL.md` · `TECH-DEBT.md`
Depends-on: none

The retention leg keeps a permanent one-line pointer per resolved debt. The substance already lives in
the changelog, the sprint archive and git, so the pointer is a breadcrumb rather than a record, and the
ledger accretes rows that will never be read again. The 3-sprint delay stays — a just-resolved debt is
still useful context at the next promote; only the permanent residue goes.

**Acceptance:** the standard says delete at the 3-sprint mark, the ledger's § Resolved section and its
existing collapsed lines are gone, and the promote governance scan no longer looks for that section.

**DoD:**
- [x] The retention leg changes from "collapse to a one-line § Resolved entry" to **delete the row**,
      at the same 3-sprint trigger
- [x] The ledger's § Resolved section and its existing collapsed lines are removed
- [x] The promote governance doc-aging scan is updated to match, so it stops scanning for a section
      that no longer exists — a check looking for something deleted is a check that cannot fire
- [x] The id-monotonicity rule is restated where it now matters more: deleting a row must not free its
      id for reuse
- [x] Consumer-facing (a shipped standard changes) → a CHANGELOG line at close (L-015)

### T6 — Cut the MINOR release covering SPRINT-043 and SPRINT-044 `[size: S · risk: low · class: decision · HITL]`
Layers: `CHANGELOG.md` · `.claude-plugin/plugin.json` · `.claude-plugin/marketplace.json` · `README.md` · `docs/changelog/CHANGELOG-1.23.0.md`
Depends-on: T1, T2, T3, T4, T5

TASK-137, expanded by D3. SPRINT-043's work sits in an `Unreleased` CHANGELOG block; this sprint adds
more consumer-facing change on top. Cutting one MINOR that covers both is simpler than two releases
days apart, and avoids a window where half the shipped surface is released and half is not. Runs last
by construction — a release that precedes the work it releases is the bug.

**Acceptance:** one MINOR version covers both sprints, manifests are in lockstep, every version echo
in the repo matches, and the run stops before push.

**DoD:**
- [x] `Unreleased` retitled to the chosen MINOR, with this sprint's user-visible changes folded in
- [x] `plugin.json` + `marketplace.json` bumped in **lockstep**
- [x] **Every version echo outside the manifests** grepped repo-wide and updated (L-048 — the README
      footer shipped stale once already this way)
- [x] §11 CHANGELOG rotation applied if the new MINOR pushes a third block inline
- [x] **Stops before push.** Push stays owner-reserved

## Owner-action checklist
- [ ] `git push` after T6 — never performed by a task or a run.

## Decisions (pre-locked)

- **D1** — **`TECH-DEBT.md` is coordinator-owned at close.** T1 resolves TD-014 and T5 restructures the
  ledger; if each marked its own row, the two would share a file and serialize for no benefit. Marking
  moves to close, as SPRINT-043 did. L-071 applied at planning time.
- **D2** — **This sprint does not run unattended**, and that is a deliberate trade. T6 is a version
  choice — judgement, not execution — so it would park immediately under the unattended contract,
  taking its five dependencies' completion report with it. Recorded rather than discovered.
- **D3** — **One release covers SPRINT-043 and SPRINT-044.** TASK-137 was written for SPRINT-043 alone;
  since this sprint ships consumer-facing change too, cutting separately would release half the surface
  and leave the rest pending days later.
- **D4** — **T1 goes first.** Three later tasks edit the reference it restructures; splitting after they
  land would mean moving text they just wrote.

## Assumptions

- **A1** — The two fixture harnesses locate their snippets by anchor and fail loud when it is missing,
  so a missed re-point in T1 surfaces as a named FAIL. *Confirm: T1's mis-pointed-path DoD line.*
- **A2** — The captured SPRINT-043 run data is sufficient to attribute spend to named drivers without
  re-running anything. *Confirm: T4's decomposition DoD line — if it is not sufficient, T4 says so
  rather than estimating.*
- **A3** — A throwaway prompt is enough to exercise both launcher verdicts. *Confirm: T3's both-verdicts
  DoD line.*

## Execution Log

<!-- Append-only, dated. The Plan is frozen at promote — log here rather than editing § Plan.
     Compressed at close: each finding below now has a durable home (TECH-DEBT / LEARNINGS /
     CHANGELOG), so this section records what happened and points there rather than restating it. -->

### 2026-08-01 | scope-change | T2 widened to fix TD-023, and to cover tools
Frozen Plan had TD-023's fix **out** of scope, on the understanding its evidence was a single observed
denial. Reading the captured run's `permission_denials` at G2 overturned that: of **25** denials,
**21** were `cd`-prefixed, **2** variable-assignment-prefixed, 1 a `git -C` form, 1 an unauthorized
**tool** (PowerShell). So 23 of 25 were *form* failures on individually-permitted commands — TD-023 was
the dominant failure mode of the run that tested the four-source rule, not a footnote to it, and the
25th exposed that the derivation enumerates commands but not tools.

Owner re-signed G2 with both folded into T2 rather than a new task: T2 already edits that section, its
`Layers:` are unchanged, no new file enters the sprint — overlap map, wave ranks and preflight verdict
all hold. Logged before § Plan was edited. Also recorded: the array's first entry is the very probe
TD-024's evidence came from, and it never ran.

### 2026-08-01 | T1 | capability checks split out — TD-014 resolved
Dispatched. `night-run.md` **495 → 283**; moved material in `night-run-checks.md` (236). **The verbatim
claim was verified against git, not accepted**: both snippets extracted from `HEAD`'s pre-move file and
the new file, diffed **byte-identical** (89 and 46 lines). Harness diffs are one path line each, so the
guarding assertions are unchanged — a quiet rewrite would have failed them. Negative test re-run on the
harness the agent did *not* use: exit 2, named finding, reverted, green.

Correction to T1's own commit: it claimed both harnesses changed by "exactly one line each" — true of
one, false of the other, where my negative-test revert used a broad `sed` that also updated two comment
lines. Fixed in a follow-up; caught by reading the diffstat rather than the message.

### 2026-08-01 | T2 | allowlist moved into settings permissions
Run inline. Pre-flight now derives into settings permissions with the tracked/local split stated as a
rule, one syntax form pinned (`Bash(<cmd>:*)`), the bare-invocation rule carrying its measured evidence,
and tool coverage. Repo settings 5 → 20 rules; `git checkout`/reset deliberately excluded (L-043 bans
tree-wide state ops). **`Bash(git -C:*)` is the one genuinely broad rule** — any git subcommand, any
path, and tracked so it applies interactively too; flagged for the owner to move local if unwanted.

### 2026-08-01 | T3 | launcher shipped — and it root-caused TD-024
Dispatched; the agent **returned before finishing**, so the artifact was inspected rather than its reply
(trap (c)): script sound, `night-run.md` untouched, nothing left running. Finished inline.

Two defects. The launcher hard-required `--allowedTools`, contradicting T2 — **the edge ordered the work,
not the reading** (→ **L-080**). Then it blocked its own live test with `qa-check` at 72/1 inside and
73/0 standalone: **`MSYS_NO_PATHCONV=1`, inherited into the gate** — TD-024's root cause, reproducible,
emitting the exact string that row had carried under two wrong diagnoses (→ **TD-024**, **L-081**).

Verified on real input: three `DEAD-ON-ARRIVAL` paths each naming its cause; `ALIVE` under the hostile
environment with the child logging `ok` and exiting 0; **detachment proven by observation** — launcher
exited first, child still running, completing later on its own. That run also showed the live-PID rule
firing correctly. ~$0.5 across four `claude -p` calls.

### 2026-08-01 | scope-change | T4 gains the observed-checker
Writing T4's research note regenerated the knowledge index, and the observed-layers check FAILed: index
undeclared. Both ways out fail the gate (regenerate → undeclared; skip → stale), so the exclusion was
forced — the index is generated, never hand-authored, and its sources are already excluded. **Then the
guard caught itself**: editing the checker made it undeclared. Adding it to its own exclusion list was
rejected outright (→ **L-082**); declared in T4's `Layers:` instead. No new file, no edge change, ranks
untouched — G2 re-confirmed. Logged before § Plan was edited.

### 2026-08-01 | T4 | cost driver measured
Run inline (the run data was already in context). Cache reads dominate — 26.5M against 191K output —
and turns drive them, so the lever is turn count; ~40% of turns went to denials. Ruled out and recorded:
output volume, wall-clock. T2's rule is therefore also the cost fix; T4 adds the no-retry-in-a-different-
wrapper rule. Full attribution → `docs/research/night-run-cost.md`. Proof of reduction deliberately left
to the next run's calibration row (→ **TASK-143**).

### 2026-08-01 | T5 | resolved TD rows are deleted, not collapsed
Run inline. Rule changed in **four** places, because it was stated in four — a rule changed in one of
its homes is the L-020 shape. § Resolved removed; TD-018/TD-019 deleted (due at this promote, deferred
here deliberately). Ledger 210 → 165.

### 2026-08-01 | T6 | v1.25.0 cut, stopped before push
One MINOR covering SPRINT-043 + SPRINT-044 (D3). Manifests lockstep, L-048 sweep found and fixed the
README echo, §11 rotation moved v1.23.0 out with all 11 archive links verified. Two gate failures fixed
rather than worked around: the rotation archive was undeclared (joined T6's `Layers:`), and the sprint
file hit **405 > 400** — trimmed my own prose, never the cap (§7).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/night-run.md` | T1–T4 | checks split out (TD-014); allowlist → settings permissions + bare-invocation + tool coverage (TD-023); launcher section; denial no-retry rule | low — guidance | snippets diffed byte-identical vs git; harnesses green |
| `skills/orchestrator/references/night-run-checks.md` | T1 | new sibling holding the two capability-check snippets verbatim | low | both extracting harnesses pass unmodified |
| `evals/run-skill-freshness-fixtures.sh` · `evals/run-worktree-usability-fixtures.sh` | T1 | re-pointed at the moved reference (one path line each) | low | mis-pointed path FAILs loud by name, both directions |
| `.claude/settings.json` | T2 | night-run rules, 5 → 20, in the pinned `Bash(<cmd>:*)` form | **med** — `git -C:*` is broad and tracked | JSON validated; flagged for owner review |
| `scripts/night-run.sh` | T3 | new detached launcher with `ALIVE`/`DEAD-ON-ARRIVAL` verdicts | **med** — fires real runs | both verdicts live-fired; detachment proven by observation |
| `docs/research/night-run-cost.md` | T4 | cost attribution from captured run data | none | figures read off `modelUsage`, not estimated |
| `scripts/lib/check-layers-observed.sh` | T4 | generated index added to the exclusion list, with its reason stated | low | check re-run; caught its own edit, which is the point |
| `skills/lean-doc-generator/references/DOCS_Guide.md` · `.../SKILL.md` | T5 | TD retention: collapse → delete, updated in all four places the rule was stated | low | gate green |
| `TECH-DEBT.md` | T5, close | § Resolved removed; TD-018/019 deleted; TD-014/023/024 resolved; TD-025/026 filed | none | 210 → 165 lines |
| `CHANGELOG.md` · `.claude-plugin/*.json` · `README.md` · `docs/changelog/CHANGELOG-1.23.0.md` | T6 | v1.25.0 cut, manifests lockstep, §11 rotation | low | L-048 sweep clean; 11 archive links resolve |

## Retro

**Retrieval check** — no miss, but one **gap in a learning rather than in retrieval**. L-067 was
applied correctly (the trigger needed `MSYS_NO_PATHCONV=1`), yet it describes the variable as affecting
"every argument in that invocation" and says nothing about *inheritance* — which is the property that
broke the gate two layers down. The learning was found and followed; it was incomplete. Filed as
**L-081** and L-067's count bumped to 2.

**Cost** — 6 units delivered and landed, 6 attempted. Two dispatched agents (~241k subagent tokens),
four live `claude -p` launcher tests (~$0.5), the rest inline. Total dollar cost is not observable from
inside an interactive session, so it is stated as unavailable rather than omitted — the same degrade
rule this repo shipped two sprints ago. Cheaper in shape than SPRINT-043 by deliberate choice: only the
two genuinely mechanical tasks were dispatched, and T4's own finding (turns drive cost) is why.

**Worked**
- **Verifying dispatched claims against git rather than accepting them.** T1's "moved verbatim" is
  exactly the assertion that reads identically whether true or false; diffing both snippets against
  `HEAD` made it evidence. The harness coupling is the elegant part — assertions unchanged means a
  rewrite would have failed them, so the proof was already built into the task's shape.
- **Inspecting the artifact when a subagent returned early.** T3's agent stopped mid-task; the script
  on disk was sound and nearly complete. Reading the reply alone would have suggested starting over.
- **Chasing a context-dependent gate failure instead of shrugging at it.** 72/1 inside the launcher
  versus 73/0 standalone looked like flakiness. It was an inherited environment variable, and following
  it root-caused a debt that had survived two wrong diagnoses across two sprints.
- **Letting the gates fail on my own work.** Three separate blocks — undeclared index, the checker
  flagging itself, the 405-line cap — each fixed at the cause rather than by loosening the check.

**Friction**
- **A dependency edge did not prevent a contradiction.** T3 shipped a launcher that rejected T2's
  invocation despite depending on it. → **L-080**.
- **The preflight cannot see transitive ordering**, so a legitimate four-task chain on one file HALTed
  and was worked around with redundant edges. → **TD-025**.
- **The two-commit sha convention guarantees a red gate** in the window between `plan locked` and
  recording the sha. → **TD-026**.
- **My own Execution Log breached the 400-line cap** and had to be compressed at close — the findings
  belonged in their durable homes all along, not restated at length in a working doc.

**Pattern candidate**
- **L-080** — an edge orders the work, not the reading.
- **L-081** — an environment workaround is inherited, and can cause a second bug far from where it was set.
- **L-082** — when a guard flags its own file, exempting it is the one fix never available.
- **L-067 now at count 2** → promotion candidate at the next promote.

**Bucket routing**

| Bucket | Filed |
|---|---|
| Shipped | `CHANGELOG.md` **v1.25.0** (cut in T6, covering SPRINT-043 + 044) |
| Tech debt | **TD-014** · **TD-023** · **TD-024** resolved · **TD-025** (transitive ordering) · **TD-026** (sha-window red gate) filed |
| Follow-ups | **TASK-143** — fire a run through the launcher, produce calibration row three |
| Learnings | **L-080** · **L-081** · **L-082**; **L-067** count → 2 |
