---
sprint: 044
slug: night-run-ergonomics
owner: Maintainer
last_updated: 2026-08-01
status: active
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

<!-- Append-only, dated. The Plan is frozen at promote — log here rather than editing § Plan. -->

### 2026-08-01 | scope-change | T2 widened to fix TD-023, not merely cite it
**What changed.** The Plan froze with TD-023's fix explicitly *out* of scope: T2 was to carry the
form-sensitivity caveat forward and nothing more, on the understanding that the evidence was a single
observed `git worktree add` denial. Reading the captured run's `permission_denials` array at G2
overturned that. All **25** denials classified:

| Shape | Count | Cause |
|---|---|---|
| `cd <path> && …` | 21 | prefix broke the match |
| `w=$(mktemp -d); echo …` | 2 | variable-assignment prefix broke the match |
| `git -C …` | 1 | allowlisted as `Bash(git -C *)` and denied anyway |
| `PowerShell` | 1 | tool never authorized at all |

**Impact.** 23 of 25 were **form** failures — every one of those commands was individually permitted and
the prefix stopped the matcher recognising it. TD-023 is not a footnote to the four-source rule; it is
the dominant failure mode of the run that tested it, and skipping it would have shipped a sprint about
night-run ergonomics with its largest known ergonomic defect deliberately left in. The 25th denial
exposes a second gap: the derivation enumerates **commands** but not **tools** — this host has two
shells and one was authorized.

**Bonus finding, recorded not acted on.** The array's first entry is
`cd "D:/Project/lean-flow" && sh scripts/qa-check.sh > /tmp/qa-main.txt …` — the *probe TD-024's
evidence came from*. It never ran, confirming the downgrade applied at the SPRINT-043 close.

**Re-confirm G2.** Owner re-signed with both additions folded into T2 rather than a new task: T2 already
edits the section that must carry the rule, its `Layers:` are unchanged, and no new file enters the
sprint — so the overlap map, wave ranks and preflight verdict all hold. Logged before § Plan was edited.


### 2026-08-01 | T1 | capability checks split out — TD-014's subject resolved
Dispatched to a Sonnet sub-agent (docs restructure, implemented directly — no routed procedure skill).
`night-run.md` **495 → 283 lines** (−43%), zero embedded snippets remaining; the moved material lives
in `night-run-checks.md` (236 lines) with a pointer left behind. All six Parts intact.

**The verbatim claim was checked, not accepted.** "Moved verbatim" is the kind of assertion that reads
identically whether or not it is true, so it was verified against git rather than the agent's word:
both snippets extracted from `HEAD`'s pre-move file and from the new file, diffed —
**byte-identical**, 89 and 46 lines. Harness diffs are exactly one line each (the path), so the
assertions that guard those snippets are unchanged; if a snippet had been quietly rewritten, unchanged
assertions would have failed.

Negative test re-run **on the harness the agent did not use** — mis-pointed the worktree-usability
harness at the now-anchorless file: exit 2 with its named finding
(`no snippet extracted between … in …/night-run.md`), then reverted and confirmed green. The anchor
guard discriminates a real miss rather than silently passing, which is what makes the whole
unchanged-assertions proof meaningful.

Note: `night-run.md` previously carried **no** ownership header; DoD line 5 asked for one on both
files, so it gained one. Additive, and it brings the file into line with DOCS_Guide §3.

Gate: 73 pass, 0 fail. Diff confined to the four declared `Layers:` files.

**Correction to this task's own commit.** It claimed both harnesses changed by "exactly one line each
(the path)". True of one, false of the other: the negative-test revert used a broad `sed` that also
updated two comment lines naming the old file. Those updates were correct in themselves but unintended,
and they left the two harnesses inconsistent — one with fresh comments, one still pointing readers at a
file that no longer holds the snippet. Fixed in a follow-up commit; caught by reading the diffstat
rather than trusting the message just written.

### 2026-08-01 | T2 | allowlist moved into settings permissions; TD-023 fixed, not cited
Run inline — prose edits to a section read end-to-end this session, where dispatching would re-pay the
full substrate to produce ~30 lines (this sprint's own T4 subject).

Pre-flight now derives into **settings permissions** rather than an inline string, with the split
stated as a rule: repo-generic rules tracked, owner-reserved and machine-specific ones in the gitignored
local file — the pattern this repo already follows, with `git push` sitting on the local side. Wording
never assumes a settings file exists, since a consumer may have none and no skill creates one.

**Three things the scope-change added**, each carrying its evidence rather than asserted as style:
- **Bare invocation.** One command per call — no `cd` prefix, no `VAR=` prefix, no `&&` chain, no
  redirect; anchor with `git -C <abs-path>`. Stated with the measurement: 23 of 25 denials were form
  failures on individually-permitted commands. Noted as converging with L-057 from the opposite
  direction — that rule protects the exit status, this one protects the permission match.
- **Tools, not only commands.** A two-shell host needs each shell authorized; the run had every `Bash`
  rule it needed and no `PowerShell` rule at all.
- **One pinned syntax.** `Bash(<cmd>:*)`, the form the settings file already used. A bare-glob variant
  was observed denying a command it was written to permit, so a second spelling is treated as suspect
  until seen to match.

This repo's tracked settings gained 15 rules (5 → 20): read-only git, the landing path (`worktree`,
`merge`), and the gate's subprocesses (`init`, `config`, `-C`, `mktemp`). Deliberately **excluded**:
`git checkout` and any reset/clean — L-043 bans tree-wide state ops because they can sweep a sibling's
uncommitted work, and the merge-back protocol uses a separate integration worktree instead. `git push`
stays owner-reserved in the untracked local file.

**One rule worth your eye: `Bash(git -C:*)`.** It is genuinely broad — it authorizes any git subcommand
against any path, including destructive ones, and because it is in the *tracked* file it applies to
interactive sessions too. The gate's harnesses need it to drive throwaway repos. Flagged rather than
buried: move it to the local file if you would rather it not be repo-wide.

Gate: 73 pass, 0 fail. `night-run.md` 283 → 311 lines, still far below the 495 it started the sprint at.

### 2026-08-01 | T3 | launcher shipped — and it root-caused TD-024 on the way
Dispatched to a Sonnet sub-agent, which **returned before finishing** (waiting on its own background
test). Per CLAUDE.md trap (c) the artifact was inspected rather than the reply: `scripts/night-run.sh`
existed and was well-built, `night-run.md` was untouched, and no stray process was left running. The
remainder was completed inline.

**A defect the chain ordering should have caught.** The launcher hard-required `--allowedTools` — which
T2 had just made optional by moving the allowlist into settings permissions, so a correct settings-based
invocation would have been rejected. T3 depends on T2 precisely so this could not happen; the dependency
ordered the *work*, not the agent's *reading*. Now accepts `--allowedTools`, `--settings`, or a settings
file with a `permissions.allow` block, refusing only when none exists.

**Then the launcher blocked its own live test, correctly — and that root-caused TD-024.** `qa-check`
returned **72/1** from inside the launcher and 73/0 standalone, three times: context-dependent, not
flaky. Ruled out command substitution and absolute-path invocation, then found **`MSYS_NO_PATHCONV=1`**
— exported so a bare `/orchestrator` prompt isn't rewritten into a Windows path (L-067). It is
*inherited*, so it reached the gate and broke `git -C` on a POSIX path, emitting
`could not resolve live HEAD in /d/Project/lean-flow` — the **exact string TD-024 recorded**. The debt's
filed mechanism was nearly right and missed the trigger: **L-067's own workaround causing a second
path-translation bug in a child process, far from where it was set.** The launcher now clears the
variable around the gate only; the fired command keeps the caller's environment.

**Verified on real input, both verdicts:**
- Three `DEAD-ON-ARRIVAL` paths, each naming its cause: missing `unattended` signal · wrong permission
  mode · forbidden `--dangerously-skip-permissions`.
- `ALIVE` under the hostile environment (`MSYS_NO_PATHCONV=1` still exported) — the child logged `ok`
  and exited 0. Real work, not a heartbeat.
- **Detachment proven by observation**: fired with a 5s window so the launcher exited first, then
  confirmed the child was **still running** after its parent was gone, and later completed on its own
  with exit 0. That same run also demonstrated "a live PID is not progress" — up but silent at 5s, so
  the verdict was correctly `DEAD-ON-ARRIVAL`. A window that short is a false negative for a healthy
  slow starter, which is why the default is ~150s; noted in the shipped guidance.

Live-test cost: ~$0.5 across four `claude -p` calls. No stray logs in the repo (all under `TMPDIR`), no
surviving processes.

### 2026-08-01 | scope-change | T4 gains the observed-checker; the gate caught its own gap, then itself
**What changed.** T4's research note is a metadata-carrying doc, so writing it regenerates
`docs/knowledge-index.md`. The **observed-layers check shipped last sprint then FAILed**: the index had
changed and no task declared it. Both ways out fail the gate — regenerate and the index is undeclared,
skip it and the freshness leg reports STALE — so the fix was forced rather than chosen.

**Impact.** The index is **generated, never hand-authored**, regenerating whenever any
LEARNINGS/ADR/research doc changes; its sources are already excluded or declared, so declaring it would
mean naming it in every task that touches a learning. It belongs in the checker's exclusion list — a
genuine gap in a guard shipped five commits ago, found by that guard.

**Then the guard caught itself**, which is the part worth keeping: editing the checker made *it*
undeclared and the check FAILed again, naming its own file. The tempting fix — adding the checker to its
own exclusion list — was rejected outright: it is a hand-authored source file, exactly what the check
exists to watch, and excluding it would hollow out the guard for one commit's convenience. Declared in
T4's `Layers:` instead.

**Re-confirm G2.** No new file beyond this one, no edge changes, wave ranks untouched — overlap map and
preflight verdict hold. Logged before § Plan was edited, same as the T2 scope-change.

### 2026-08-01 | T5 | resolved tech-debt rows are deleted now, not collapsed forever
Run inline. The retention leg changes from "collapse the row to a one-line § Resolved entry" to
**delete the row**, at the same 3-sprint trigger. The delay is kept deliberately — a just-resolved debt
is still context at the next promote — so what goes is the *permanent residue*, not the review window.

Updated in four places rather than one, because the rule was stated in four: §11's retention row, §2's
lifecycle row for the ledger (`collapsed rows` → `open rows only`), §11's "when it runs" list, and the
promote governance checklist in the skill (`TD collapse` → `TD deletion`). A rule changed in one of its
four homes is the L-020 shape — half-shipped and readable as complete.

**Id monotonicity restated where it now matters more.** Collapsing left a visible pointer, so id reuse
was self-evidently wrong; deleting removes that reminder. Both the standard and the ledger header now
say a deleted row never frees its id.

Applied to this repo: § Resolved and its five collapsed lines removed, and **TD-018 + TD-019 deleted**
outright — they hit the 3-sprint mark at this promote, and their action was deliberately deferred here
rather than collapsed at promote and deleted a week later. Ledger **210 → 165 lines** (−21%). Nothing
else was due: TD-016/TD-020 resolved at SPRINT-042 and TD-021/TD-022 at SPRINT-043, so their windows
close at SPRINT-045 and SPRINT-046.

Consumer-facing — a shipped standard changed — so it needs a CHANGELOG line at close (L-015).
Gate: 73 pass, 0 fail.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->
