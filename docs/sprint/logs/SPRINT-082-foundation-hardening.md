---
sprint: 082
slug: foundation-hardening
owner: Maintainer
last_updated: 2026-08-24
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-082 — Execution Log

> Append-only companion to [`../SPRINT-082-foundation-hardening.md`](../SPRINT-082-foundation-hardening.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-08-24 | promote | Plan locked, gates signed

T1–T5 promoted from TASK-261…265. `plan_commit: 45d510b`; G1+G2 signed at `4d3274a`. D6 rules the run
mode **attended**, which is what makes T4's unattended-PARK branch unreachable by the dogfood — proven
by T1's retained fixture instead (L-111 discharged at G2 rather than discovered at T4).

### 2026-08-24 | progress | T1 — D3's trigger fired; the rung needs an ADR

D3 was pre-locked as a conditional: an ADR only *if* the declared gate rung introduces a new
consumer-facing declaration file. It does — `.gate-command` at the repo root — so **ADR-033** is
written rather than skipped. Recording the trigger firing, not just its outcome: the condition was the
decision, and a later reader needs to see which way it went and why.

### 2026-08-24 | scope-change | T1 — `Layers:` corrected mid-task (L-100)

**What broke:** `check-layers-observed.sh` failed the gate with `changed but undeclared in any task's
Layers:: .gate-command`. T1's `Layers:` said "the declared-gate file and its consumer-facing docs" —
prose, where the checker needs a literal path.

**Impact:** none to scope. The Plan's task set, acceptance criteria and DoD are unchanged; only the
declaration of which files T1 touches was incomplete. Promote could not have named `.gate-command`,
`evals/lib/check-system-verify-block.sh`, `docs/adr/ADR-033-*.md` or `docs/DECISIONS.md`, because
D3's trigger had not yet fired and the rung's shape was undecided.

**Re-confirm G2:** not required — this is the expected cost of declaring before the work (L-100:
`Layers:` is a live declaration, not a frozen prediction to defend). Logged, declared, continued.

Worth keeping: the finding came from the repo's own guard, on a file created minutes earlier. That is
the guard working exactly as intended, and it is the first time this sprint's own machinery caught this
sprint.

### 2026-08-24 | surprise | T1 — the checker asserted on wording, and the rewording broke it

`run-system-verify-fixtures.sh` case 4 (`wellformed-pass-passes`) asserted the substring
`nothing to block on`. That phrase was the *old* short-circuit's message — the very reasoning ADR-033
rejects — so rewording the PASS branch reddened a case that was testing nothing about the PASS path.
Updated to `the gate ran and was green`.

This is L-158 in miniature (a fixture asserting what a finding SAYS rather than what it DOES), caught
here for free because the wording changed. Noted rather than filed: the assertion is legitimate for a
PASS-verdict log, and the family's new cases assert on findings that carry consequence.

### 2026-08-24 | progress | T1 — the no-gate family shipped, with its discrimination proven

`no-gate-discovered` no longer short-circuits to PASS. The rollup line carries the risk class
(`no-gate-discovered(low|material)`), and `check-system-verify-block.sh` routes on it. Five fixtures
added — two must-FAIL, three controls:

| Fixture | Shape | Verdict |
|---|---|---|
| `no-gate-material-closed` | material + close, no ruling | **FAIL** `system-verify-no-gate-material-silently-closed` |
| `no-gate-unmarked-closed` | bare marker + close | **FAIL** `no-gate-risk-unmarked` |
| `no-gate-low-closed` | low + close | PASS — the cheap path, preserved |
| `no-gate-material-parked` | material, no close | PASS — correctly parked |
| `no-gate-material-ruled` | material + close + ruling | PASS — attended, recorded |

**Discrimination proof (Tier G).** Two targeted single-line seeds (`bad` → `ok`), each guarded: the
seed landed (`cmp` vs pristine), the seeded file still parsed (`sh -n`), the break stayed targeted
(114 → 114 lines, so a demolition could not masquerade as a discrimination), the named case reddened,
and the sibling control stayed green in both runs. Restore verified against the pristine `sha256`.
Seeding the material branch reddened only `no-gate-material-closed-fails`; seeding the unmarked branch
reddened only `no-gate-unmarked-closed-fails`. `no-gate-low-closed-passes` stayed green under both —
which is the evidence that the correction stopped the silent close *without* becoming a blanket block
on every repo that legitimately has no gate.

### 2026-08-24 | scope-change | T2 — the routing needed a record before it could be checked

**What broke:** T2's DoD demands a must-FAIL fixture proving a high-governance `.md` cannot pass as
trivial. T1 was enforceable because `check-system-verify-block.sh` reads a line the run writes into the
Execution Log. Review depth has no such record — the routing decision is an agent's judgement over
prose, and nothing writes down which pass actually fired. So the fixture had nothing to read, and the
DoD as promoted was unsatisfiable by any amount of prose editing. Found while writing the fixture, not
while writing the rule.

**Impact:** T2 grows past its declared `Layers:`. It now also touches `night-run.md` (a `review ·` line
added to the Part 4 rollup vocabulary), a new `evals/lib/check-review-depth.sh`, a new
`evals/run-review-depth-fixtures.sh`, and `scripts/qa-check.sh` for the wiring. No change to T2's
acceptance, to any other task, or to the sprint's Scope.

**Re-confirm G2:** owner ruled the recorded-outcome option over two cheaper alternatives — a
prose-reversion guard (would test what the skill SAYS, never that a review fired — L-158's criticism) and
re-tiering T2 down to P (honest, but leaves the rule unguarded). The Tier **G** declaration from A5 is
re-confirmed and is now attachable to a real mechanism, which is what it was missing.

**Why this is the same failure T3 exists to prevent, found one task early:** the promoted criterion
named a proof method — "a retained must-FAIL fixture" — that could not reach its subject, because the
subject left no trace to assert on. That is L-136's shape arriving through a frozen DoD, and T3's
EXISTS · RUNS · REACHES · PROVES test would have caught it at G2 had it already shipped. Recorded here
rather than only in the Retro, because it is the sprint's own strongest evidence for T3.

### 2026-08-24 | progress | T2 — routing re-keyed onto consequence, with a record behind it

`review-scoping.md`'s skip table no longer exempts `docs / config / trivial`. Depth is chosen from two
dimensions — **behaviour impact** (the material classes, consumed from `dispatch.md` § System verify,
not restated) and **governance impact** (does this change a rule, contract or decision other work is
measured against). A diff needs *both* low to earn the self-review floor. Unclear ⇒ material, same
default as T1 and for the same reason.

`scripts/lib/check-review-depth.sh` reads the new Part 4 `review ·` line and is wired into `qa-check.sh`
against **live** logs, not only fixtures — a guard that only ever sees `evals/fixtures/` has not been
shown to reach this repository at all. Seven fixtures, three must-FAIL:

| Fixture | Shape | Verdict |
|---|---|---|
| `governance-self-reviewed` | `behaviour:low · governance:high` + self-review | **FAIL** `review-depth-governance-self-reviewed` |
| `material-self-reviewed` | `behaviour:material · governance:low` + self-review | **FAIL** `review-depth-material-self-reviewed` |
| `unclassified-self-reviewed` | no classes + self-review | **FAIL** `review-depth-unclassified` |
| `low-self-reviewed` | both low + self-review | PASS — the cheap path, preserved |
| `multi-task-mixed` | 3 tasks, 1 violation | **FAIL** on that task only |
| `archived` | violation, archived | skipped — closed history |
| *(no args)* | — | the denominator note, never a silent pass |

`multi-task-mixed` exists because the obvious implementation — grep the file for `self-review`, grep it
for `governance:high` — is wrong in **both** directions: it flags a file where the two never meet on one
line, and it lets an honest self-review mask a real violation elsewhere. The checker reads line by line
and this fixture is what holds it there.

**Discrimination proof (Tier G).** Three targeted single-line seeds, each guarded as in T1 (landed ·
parses · 99 → 99 lines · restored under a checked hash). Each seed reddened **only** its own case, and
`low-self-reviewed-passes` stayed green under all three — the evidence that the cheap path survived.

### 2026-08-24 | blocker | T1 and T2 are governance:high and now owe themselves an independent review

The rule shipped in T2 applies to the diff that shipped it. T1 and T2 both change rules other work is
measured against — `behaviour:material · governance:high` — so under § Two dimensions neither earns the
self-review floor, and recording `review · T1 · self-review · …` would fail the checker T2 just added.

No `review ·` line is therefore written for T1 or T2 yet: the record states what actually fired, and an
independent pass has not. This session cannot dispatch one (the operating instruction for this session
forbids calling the Agent tool unless the owner asks), so the Review step is **owed and owner-triggered**.
Recorded as a blocker rather than resolved by writing a line that would be false — the first thing this
rule protects is the honesty of its own record.
