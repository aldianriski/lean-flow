---
sprint: 105
slug: enforce-what-is-written
owner: Maintainer
last_updated: 2026-09-22
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-105 — Execution Log

> Append-only companion to [`../SPRINT-105-enforce-what-is-written.md`](../SPRINT-105-enforce-what-is-written.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

---

### 2026-09-21 | promote | sprint opened RETROACTIVELY, and that is the entry

Unusual and worth stating rather than smoothing over: T1 and T2 were **built before this sprint
existed**, in one session, on direct owner instruction ("this happen every time, please fix this
also"). They therefore landed outside `SPRINT-104`'s frozen Plan, and leg 15 correctly reported
every file as *changed but undeclared*.

Three attributions were available and the owner ruled: open `SPRINT-105`. The alternative —
commit as governance and let leg 15 stay red until SPRINT-104 closes — was rejected as `TD-174`'s
exact failure mode: a red gate everyone learns to ignore. `SPRINT-104` was left untouched and
unstarted throughout.

`plan_commit` 1aa3f71.

---

### 2026-09-21 | progress | T2 — density ratchet built, wired, and it caught its own author

- Threshold **derived**: 400 chars ≈ p97 of the capped prose corpus (n=2,246; median 74, p90 130,
  p95 254, p99 664, max 6,681). Not chosen.
- Built as a **ratchet** rather than a threshold, on `TD-174`'s evidence that a report-only cap is
  a log line.
- Wired as leg 2b-ter and **observed to fire** — 16 `prose-density` rows in a real gate run.
- Seeded-break proof: neutering the ratchet arm reddens exactly `grew`; the control stays green.
  Restored under one stated convention (`sha256sum` vs a pristine copy).
- **Then it failed the author.** The `.claude/CLAUDE.md` architecture bullet, edited minutes
  earlier for T1, hit 805 characters on one line and the leg went red. Fixed by **rewrapping**,
  baseline untouched — which is what §157 requires and what the baseline file explicitly forbids
  doing instead. This is the single best piece of evidence the leg works, and it was unplanned.

---

### 2026-09-21 | surprise | the research on the hook's own input format was wrong

An external research pass returned a transcript schema with a top-level `tool_calls[]` array
carrying a `name` field. Checked against a live transcript: that is **not** this format. Entries
carry `message.content[]` blocks, and a tool call is `{type:"tool_use", name:"AskUserQuestion"}`.

Had it been trusted, `askedThisTurn()` would have read a field that does not exist, found nothing,
and **allowed every turn** — an absent guard wearing the shape of a present one (`L-166`). It would
have passed every fixture written against the same wrong assumption, too. Caught only by checking
the real artifact rather than the description of it.

---

### 2026-09-21 | surprise | a must-NOT-catch control was vacuous, and only the seeded break showed it

The first `asked-properly` fixture ended on *"Waiting on your pick."* — not decision-shaped. So it
allowed via `endsOnDecision()` returning false, and **never exercised the AskUserQuestion detection
it existed to guard**. Seeding a break that neutered that detection left it green.

Fixed by making the trailing text decision-shaped (*"Which option do you want?"*), so the only
thing that can allow the case is the detection itself. Both dependent cases now redden under the
seed while the five independent ones stay green. This is `L-142` — a control that passes vacuously
scores as a pass — and it was caught by the discipline, not by reading.

---

### 2026-09-21 | progress | gate run, and three of its five FAILs were this sprint's

`QA-CHECK: 228 pass, 5 fail`, TRUNCATED at 522s against the 520s budget.

| FAIL | Whose |
|---|---|
| no Execution Log, SPRINT-104 | pre-existing — promoted, never executed |
| layers completeness, SPRINT-104 T1–T4 | pre-existing |
| no Execution Log, SPRINT-105 | **this sprint's** — fixed by this file |
| corpus metadata: ADR-044 tag/domain | **this sprint's** — `architecture`, `governance`-as-a-tag and `platform` are outside the vocabulary in `scripts/gen-index.sh` (`TAGS="process docs tooling edit-safety sprint-model"`, `DOMAINS="skills doc-standard governance knowledge sprint-model"`); corrected to `[process, tooling]` / `governance` |
| budget exceeded 522s > 520s | **partly this sprint's** — see below |

**The budget overrun deserves its own note, because the irony is load-bearing.** The gate was
already at ~519s; T2 added two harnesses (855 ms and 2.07 s) and a leg, which tipped it past 520.
Truncation then skipped 16 items — **including both of the new harnesses**. They are registered,
they pass when run directly, and they did **not** execute in the gate run that reported green-ish.
That is exactly the shape this sprint is about: a check that exists, is wired, and still does not
run. `SPRINT-104` T4 exists to re-measure the gate total and is the right owner of the fix; noted
here so it is not mistaken for a passing state.

---

### 2026-09-21 | progress | two outside reviews dispatched, worktree-isolated

Per `ADR-029` ii · `L-165` · `L-168`. One per task, each in its own worktree because adversarial
verification **writes** — it seeds breaks in the tree it reviews, and a non-isolated reviewer plus
any `git add -A` ships a corrupted guard inside an unrelated commit.

The T2 brief was pointed hardest at the **population**: `proseFiles()` is a hardcoded three-file
list plus a `skills/*/SKILL.md` glob, and `README.md`, `TODO.md`, `TECH-DEBT.md` and `docs/**` are
capped in §2 but unreachable by the leg. The author's own expectation, recorded before the verdict
arrives: **this is a real `L-186` defect, built into the guard within an hour of writing the epic
that names that exact failure class.** Recorded now so the prediction is on the record either way.

---

### 2026-09-21 | scope-change | T1's hook WITHDRAWN at outside review; the stance survives

The T2 review confirmed the author's recorded prediction (population defect, L-186). **The T1
review was worse, and its verdict was NOT SAFE TO SHIP.**

Measured on 48 of the maintainer's real transcripts — 5,451 assistant blocks, 746 completed turns:

| | |
|---|---|
| turns the hook would block | ~35 |
| of those, **false positives** | **~22 (≈60%)** |
| genuine inline decisions **missed** | ≥9, **8 of them Indonesian** |
| fixtures that could see any of this | **none** |

The last row is the finding. Both blocking fixtures were keyed to patterns that fire **0 and 2
times** in the whole corpus; the three patterns that actually fire had no fixture at all, and
deleting all three left the suite at **7 pass, 0 fail**. Seven hand-written fixtures in the
author's own phrasing, all agreeing with a detector written in the same sitting — L-186 and L-166
together, and the exact shape T2's review had just found in the sibling task.

**The bilingual miss is the one that settles it.** The maintainer writes mixed ID/EN. `Mau saya
commit tiga file ini dulu …?` is literally "Want me to …?" — the single reliable pattern, in
Indonesian, structurally invisible. The hook would have been noisiest exactly where it was least
useful, and it cannot be disabled per-hook by anyone it annoys.

Three further defects, each verified by the author rather than taken on report:
- `ADR-002` contains **no hook clause** (`grep -ci hook` → 0), so ADR-044's "only its hook clause
  is lifted" and its `supersedes_in_part: [ADR-002]` were **factually false**.
- `ADR-011` rejected a plugin hook because **hooks auto-activate with no per-hook disable ⇒
  mandatory for every consumer**. ADR-044 reframed that as a concern "about gates" and shipped the
  rejected option. Now superseded-in-part on the record.
- The 3-line anchor is conditional on newlines: the suite's own must-NOT-catch fixture, **reflowed
  to one paragraph with identical words, is BLOCKED**.

**Disposition, per the owner:** revert the hook, keep the stance. ADR-044 amended in place (not yet
shipped, so correcting beats publishing a wrong record), with a new standing constraint — *a hook
must be worth being **mandatory**, because a consumer cannot switch one off selectively.* Re-filed
as `TASK-366` carrying the corpus-derived spec, `state: needs-info` because the pattern set must be
derived before it can be specified.

**What this cost and what it bought.** One day's build reverted. In exchange: the "no scaffold"
lie found and killed, ADR-044's two mis-citations caught before publication, a new bar for hooks
that did not exist this morning, and a second independent confirmation that *nothing the author can
run finds these* — the prediction was written down in advance and still needed an outside pass to
act on (L-165 ×3).

---

### 2026-09-22 | progress | T3 — the gate's budget was never the defect; an unwired ruling was

**Measured first.** Per-harness cost, all 38 always-on, this host: **533.8s total**.
`run-conformance-engine-fixtures.sh` alone is **162.2s — 30% of it**; the cheapest 24 together
cost ~100s. Gate total ~679s, so the 520s budget truncated on **every** run, skipping ~16.

**The skipped set was chosen by position, not value.** The list was in order-of-addition, so the
gate spent 162.2s on one harness and then skipped `run-s4-ts-evaluators.sh` at **0.75s**.

**A wrong turn, recorded because it is the useful part.** The first fix split the always-on set by
a measured 30s cost cap, moving the expensive four behind `QA_FULL=1`. It was built, approved on
the strength of the measurement, and **reverted before commit** for two independent reasons:

1. `ADR-042`'s alternatives table **already rejects that exact move** — it "trades a coverage claim
   for a schedule, which is the shape L-058 warns about."
2. The premise was wrong. The 600s ceiling is a **foreground** limit (`ADR-042`'s whole ruling),
   not a wall. Nothing forced a coverage cut.

And the correct fix was already decided: **SPRINT-101's log records the owner ruling it by hand** —
*"raise `QA_BUDGET_SECONDS` and re-run, so the 13 skipped harnesses actually execute"* — with a
1200s run completing at 945s. That ruling lived in a sprint log and **no procedure read it**.

So the defect was never the harness set. It was `L-020` (shipping is not wiring) meeting `L-151`
(a decision filed where its reader cannot reach it), and the first fix would have deleted coverage
an accepted ADR had explicitly protected. **This is the second time in two days an ADR's objection
was reframed instead of read** — `ADR-011` was the first, caught by an outside reviewer. This one
was caught by the author, which is the only thing that improved.

**Shipped instead:**
- `scripts/night-run.sh` raises its own budget to 1200s. It **is** the detached caller ADR-042
  anticipated, and it was invoking the gate at the **foreground** default — truncating the
  pre-flight that decides whether to FIRE an unattended run. A floor, not an override.
- The always-on set is ordered **cheapest-first**, so any future truncation costs the fewest guards.
- The truncation message names the concrete remedy, not just the variable name.

**Proof, from the gate's own printed verdict** (never an exit code — L-120):

| run | verdict | harnesses | truncation |
|---|---|---|---|
| before, default 520s | `228 pass, 5 fail` | 22 of 38 | yes, every run |
| after, detached 1200s | **`262 pass, 3 fail`** | **38 of 38** | **none** |

**+34 checks now actually run.** Wall 601s — which is itself the argument: a complete gate sits
*just past* the 600s foreground ceiling, so the detached caller raising it is not a workaround, it
is the only correct invocation.

**A smaller finding, kept because it nearly became an exemption.** The new density leg failed T1's
own `Layers:` line at 554 chars. The tempting fix was to exempt `Layers:`/`Cites:` declarations the
way table rows are exempt — defensible in principle, and **suspect by construction when written by
the author whose file is failing**. Tested instead whether the line simply wraps: it does, and both
parsers still accept it. The rule held without a carve-out.

---

### 2026-09-22 | scope-change | T3's outside review: the code was right, the reasoning was not

**Verdict: "the code does what it claims, but the justification does not hold — FIX BEFORE
TICKING."** Eleven findings, four CONFIRMED by reproduction. The ordering reproduced, the headline
`262 pass, 3 fail` reproduced exactly, and set integrity was exact. Everything else was wrong.

**F1, the one that matters: the change was a REGRESSION.**

| | before | after |
|---|---|---|
| gate | bounded at 520s, self-terminated | ran to completion, **805s measured** |
| launcher | `die_doa` at ~560s — fit under 600s | + `--wait-seconds` ⇒ **~955s = 1.6× the ceiling** |
| failure mode | clean named refusal | **killed mid-pre-flight, no verdict** |

The premise was false and checkable in one command: the gate call at `:589` is **synchronous**,
and the only `nohup` is **144 lines below**. At gate time night-run.sh *is* the blocking foreground
invocation. The comment asserted the opposite. TD-084's silent truncation was relocated into the
one script whose entire purpose is refusing to act on an incomplete verdict — and the gate said so
in its own voice: *"a FOREGROUND invocation of this duration would be killed."*

**F2: the ADR quote is about a different variable.** ADR-042's *"a caller that knows it is detached
may raise it"* has **`QA_CEILING_SECONDS`** as its antecedent. It was reproduced verbatim in the
DoD, the commit message, the code comment and the Execution Log, each time attached to
`QA_BUDGET_SECONDS`. `night-run.sh` has **zero** hits for `QA_CEILING_SECONDS`, so the one line
ADR-042 actually licensed was never implemented.

**This is the fourth ADR misreading in two days** — ADR-011 reframed (reviewer-caught), ADR-042's
alternatives table missed (self-caught), ADR-042's own sentence mis-attributed and propagated into
four artifacts. Not carelessness on one ADR: **the Decision section gets read and everything that
qualifies it does not.** That is the learning this sprint owes.

**F3/F5: two numbers were wrong in the author's favour.** Headroom was stated against **601s** when
the same quantity measures **805s** here and **945s** in SPRINT-101 — and 945s is still live and
unedited in `TODO.md`. And the motivating anecdote ("spent 162.2s on conformance-engine, then
skipped a 0.75s harness") **cannot have happened**: conformance-engine was **#23** in the old
order, and with 22 of 38 running it was the *first harness skipped* — 0s, not 162.2s. A
standalone-sweep figure narrated as in-run behaviour, frozen into three artifacts.

**F4, fixed here rather than filed.** `qa_budget_check` with a non-numeric budget returned
**`OK 1790032685 abc`, rc 0** — the guard reporting OK at 1.79 billion seconds elapsed, forever.
`[` errors, the `if` reads false, the function falls through. Now refuses by name with a distinct
rc 2. Five retained cases incl. a must-NOT-catch control; a seeded break removing the validation
reddens exactly 14–17 reproducing the original string, while 18 stays green.

**F7 → `TD-175` (high).** A truncating gate prints **two** `QA-CHECK:` verdict lines, and
`night-run.sh:597` takes `tail -n1`. The launcher can read another run's verdict as its pre-flight.
Proven pre-existing by reverting T3 and reproducing identically. It survived only because trailing
text happened to break the anchored pattern — **by luck, not design.**

**Disposition:** raise reverted and pushed ahead of everything else (`ecf376e`); ordering kept, and
independently verified — ranking reproduces on a spanning sample, no order coupling, skipped set at
a 200s budget is exactly positions 30–38. Real fix filed as `TASK-367`: the **caller** declares
detachment; a script cannot see how it was invoked.

**What this sprint has now demonstrated three times over:** every defect that mattered was found by
an outside pass, and none by the author recalling the rule — including the one the author had
correctly predicted in writing beforehand (L-165 ×3).
