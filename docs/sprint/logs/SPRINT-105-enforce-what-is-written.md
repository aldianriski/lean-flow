---
sprint: 105
slug: enforce-what-is-written
owner: Maintainer
last_updated: 2026-09-21
status: active
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
