---
sprint: 093
slug: close-the-autonomy-guard-gap
stream: autonomy
owner: Maintainer
last_updated: 2026-08-29
status: active
update_trigger: appended at each execute/close event — append-only, never edited
---

# SPRINT-093 — Execution Log

> Append-only sibling of the frozen Plan (ADR-014). The § Plan is frozen at promote; a mid-sprint
> scope shift is logged **here** before the Plan is edited.

---

### 2026-08-29 | progress | G1 + G2 signed; full checklist, no fast-path

**Gates signed at `760dc69`.** G1 ran its **full checklist** rather than the fast-path, and the reason
is a fact about these tasks rather than a judgement: all four are `origin: close-retro`. A close-Retro
follow-up is filed from a Retro and never passed `/task-decomposer`'s intake grill, so there is no prior
scope agreement for a fast-path to re-confirm. The `origin:` field is what says so — never inferred from
`tracker:` or from how well the entry reads.

**Both assumptions confirmed against artifacts before G2.**
**A1** (the false-`PLAN_EXHAUSTED` artifact is committed and reproducible) — confirmed at
`docs/sprint/archive/logs/SPRINT-089-prove-the-unattended-run.md:194`:
`terminal · PLAN_EXHAUSTED · every task reached a resolved state`, with `:213` recording that T2
**parked**, which makes the correct state `AUTHORITY_BOUNDARY`. The artifact is real, committed and
quotable — so T1's retained fixture points at it rather than at a synthetic reconstruction (L-166).
**A2** (the launcher dies on a red gate and no bypass exists) — confirmed by counting rather than by
eye: `bypass` 0 occurrences, `--force` 0, and `die_doa "pre-flight gate scripts/qa-check.sh failed"`
present. **The first attempt at this check was wrong and is recorded as such**: it read
`grep -c ... | head -3 || echo "EMPTY"`, where `||` binds to `head` — which succeeds on empty input, so
the fallback could never fire and an absent match would have read as a confirmed presence. That is
L-045's own shape inside the confirmation of an assumption, caught by re-deriving with a count.

**Every task here is `authority: J2` and two are `class: decision`.** Recorded at G2 rather than
discovered later: T3's exception policy and T4's item-3 reading are **rulings, and the ruling IS the
deliverable** — neither can be discharged by an implementation. This Plan is therefore not a night-run
candidate, and saying so here is what stops a future pre-flight from parking 4 of 4 and calling it a run
(L-111).

**SPRINT-090's D4 is explicitly not inherited** (§ Decisions D3). Its justification was corrected after
the fact — only one of three cited mechanisms is genuinely unreachable under the strict reading, and
`AFK-safe` and `J2` are defined as opposites in the same document, which cuts the other way. T4
re-derives rather than citing it as precedent.

**Cross-stream ownership fixed before either stream started.** This stream owns `gen-index.sh`,
`docs/knowledge-index.md`, `night-run.sh`, `check-night-run-rollup.sh`,
`evals/run-night-run-rollup-fixtures.sh` and `night-run.md`; the `engine` stream owns
`scripts/qa-check.sh` and the ADR-family harness. The `engine` stream's T3 had declared a bare `evals/`
directory that swallowed this stream's rollup harness — corrected there at G2, logged in its own Log.

Checkers: `check-layers-completeness` · `check-verify-reaches` · `check-authority` — **0 FAIL each**.
---

### 2026-08-29 | scope-change | T1's DoD 2 is unsatisfiable as written; owner ruled it reworded

**The criterion demanded something the repository does not contain.** DoD 2 read: *"The SPRINT-089
artifact is the retained fixture — pointed at the real committed rollup, not a synthetic
reconstruction (L-166)."* The independent reviewer checked the archive and found that SPRINT-089's
committed rollup carries **only** `run · 12 of 12 DoD ticked` and the `terminal · PLAN_EXHAUSTED` line.
It has **no per-task line at all** — T2's parked state exists there in prose only. Feeding that real,
unmodified file to the checker **PASSes**, because there is nothing present to contradict.

**And no other committed artifact can serve either.** The reviewer went looking, including at
SPRINT-088's rollup, which Part 0b's own margin note cites by name: that file shows only the
*corrected* `AUTHORITY_BOUNDARY` reading, with the false one again in prose. **No single committed file
in this repository's history carries a contradicting terminal + per-task pair at column 1** — every real
instance was either corrected before commit, or split across two files by the very cross-write bug
TD-112 describes. The defect erased its own evidence.

**What the harness actually builds** is a composite: SPRINT-089's `run` and `terminal` lines plus
SPRINT-090's `T2 · parked-hitl` line, each grep-extracted verbatim at test-run time, with an
`extract_ok` guard that FAILs loud if either source drifts. Assembled into a `SPRINT-989` file that
never existed. The `12 of 12` DoD count beside that particular `T2` line was never true of anything.

**Owner ruling: reword DoD 2 to what is provable, rather than tick a false claim or leave the sprint
carrying a permanently unsatisfiable checkbox.** The original wording is preserved above so the change
is auditable. Two things made the rewording the right call rather than a convenience: the extraction is
genuinely verbatim and drift-guarded, which is materially stronger than a hand-typed fixture; and the
*fact* it encodes — T2 parked under a `PLAN_EXHAUSTED` terminal — is attested by SPRINT-089's own log,
just in prose rather than in rollup syntax.

**The coordinator's earlier judgement was wrong and is recorded as such.** Reviewing the composite
before dispatch, the coordinator judged it L-166-satisfying and asked the reviewer to *test rather than
echo* that judgement. The reviewer refuted it. That is the review working as designed — and it is the
second time this sprint an outside pass has overturned a coordinator judgement, after the CRLF finding
below, where the coordinator's own instrument (`grep -c $'\r'`, which counts matching *lines*) reported
0 CR bytes against `tr -cd '\r' | wc -c`'s 35 and nearly dismissed a live gate defect.

**Reachability was separately confirmed, and this is what keeps L-166 satisfied in substance.** The
archived quote cannot trip the checker for three independent reasons — the `*/archive/*` path skip, the
entry heading having been retroactively corrected from `run-complete` to `surprise`, and the rollup
being indented four spaces inside a fenced block. Any one alone would suffice. On a live log the
reaper's `printf` writes at column 1, so the guard is reachable exactly where it must be.

---

### 2026-08-29 | progress | T1 and T2 complete — four passes on one guard, each fixing a real defect and exposing a different one

consequence · T1 · behaviour:material · governance:high — review: independent-adversarial, worktree-isolated ×2
consequence · T2 · behaviour:material · governance:high — review: independent-adversarial, worktree-isolated

**T1 took four passes, and the sequence is the finding.** Every pass fixed something real and every pass
left something real behind, in a guard whose entire purpose is catching what passes silently:

| Pass | Fixed | What it left, found by whom |
|---|---|---|
| `9fd074c` | shape → **agreement** | `BUDGET_STOP` false-FAILed legitimate reaper output — *first reviewer* |
| `3ed88ea` | that false-FAIL | matrix asserted only what a state is **incompatible with**, never what it **requires**; `BUDGET_STOP` and `AUTHORITY_BOUNDARY` both passed with zero corroborating lines — *coordinator, by probing the fix* |
| `8464714` | the required-evidence half | every check still read the **whole file** and validated only the **first** `run-complete` block — *third reviewer* |
| `4611f8e` | the window | (nothing found; the remaining gap is undetectable from the log — TD-122) |

**The last one is the sharpest, because the rule was already correct.** After three passes the truth
table matched `reap()` exactly in both directions — the third reviewer built it cell by cell from source
and found no disagreement. The guard was still blind, because it read the wrong *window*: `term_state`
took `head -n1` of the whole file, so a contradiction in a later block passed by borrowing an earlier
block's terminal claim. **`reap()` had already solved this and left a comment saying why** — *a guard
that reads the wrong window fails exactly like one that is absent*. The producer observed that
discipline; the checker never did, and nobody compared them until someone derived the table from source.
This is not hypothetical: `SPRINT-082`'s committed log already carries two `run-complete` blocks, so it
is the modal shape for any sprint that survives more than one night.

**The fix's discriminating case is what proves it, not the failing one.** `win()` scopes to the *last*
block. A fixture where the **first** block contradicts and the last is clean must **PASS** — that is
what distinguishes "moved the window" from "widened the net to anywhere in the file". Both were built,
plus a real-artifact pair against `SPRINT-082` with line numbers derived live so a future edit to that
archive fails loud rather than silently mismeasuring.

**Discrimination was proven by three people using three different seeding methods** — blob-revert
(builder), targeted in-place edit (second reviewer), single-token removal from an alternation (third
reviewer) — each reddening exactly its own case. That independence is worth more than three runs of one
method, and it is why the count is recorded as three methods rather than four passes.

**One irony recorded rather than smoothed:** the `BUDGET_STOP` correction, right on its own terms,
*removed an accidental catch*. Before it, a stray `parked-hitl` under `BUDGET_STOP` would have failed
the multi-block probe — for entirely the wrong reason. A correct fix made a latent defect visible by
removing the noise that had been masking it.

**T2 ended somewhere its own Acceptance did not reach, and the owner widened it deliberately.** The
date fix was confirmed. Then the reviewer ruled the coordinator's DoD-1 verification **not faithful** —
it had backdated a file already left in LF state by earlier test runs, never the state git hands out —
and on a genuinely pristine checkout the check FAILed. **The gate was red on a fresh clone of this
repository and nobody knew**, because every gate run in this session had a working tree holding the
generator's LF output rather than git's CRLF. `.gitattributes` normalized only `*.sh`.

**The coordinator refuted that finding before confirming it**, using `grep -c $'\r'` — which counts
matching *lines*, not CR bytes — and read 0 against `tr -cd '\r' | wc -c`'s 35. A live gate defect was
one wrong instrument away from being dismissed. Caught only because the byte counts differed by exactly
35 over exactly 35 lines, which is a disagreeing second number and nothing else.

**TD-121 and TD-122 filed.** TD-122 is the last surviving member of TD-112's family and is explicitly
**not** closable by better parsing: a run that fires but never reaches the reaper leaves a log
byte-identical to one where no run happened. The evidence does not exist inside the artifact being
parsed. It needs a ledger written at fire time, independent of `reap()`'s own decision to append — a new
mechanism, correctly reported by the builder rather than half-built inside this task.

---

### 2026-08-29 | scope-change | T5 added — the authority leg fires outside the context it was written for

**Found by the gate, against this coordinator's own execution.** After T1 and T2 landed,
`check-authority.sh` reported `authority-j2-not-parked` for both: each carries an execution record
(`consequence · Tn · `) and no park record (`Tn · parked`). Its `J2` branch requires a park, then a
recorded `owner-ruling · Tn · <ruling>`, before any execution record may exist.

**The finding is half right, and the half it gets right is the coordinator's.** The authorization for
T1 and T2 was real — signed G1/G2 at `760dc69`, plus an explicit owner direction to run both streams —
but it lived in the session transcript, and the checker reads only the Execution Log. **A per-task
`owner-ruling · Tn · ` line is the shape it can read, and none was written.** That is L-151 exactly,
committed by the coordinator while the rule was loaded. The guard was not wrong that something was
missing; it was wrong about what.

**The half it gets wrong is why T5 exists.** The protocol it enforces is `night-run.md` Part 0 § Park
protocol, which governs **headless** runs — where `AskUserQuestion` is unregistered, `dontAsk`
auto-denies, and a missing answer must never be read as consent. **Parking is what an unattended run
does INSTEAD of asking.** An attended run has an ask channel and uses it; there is no park step to
perform. Enforced against an attended run the check inverts, demanding the artifact of an absent ask
channel from a run that had one. **L-105's family — a guard placed correctly in text and wrongly in
time**, which is this sprint's own theme arriving one level up: T1 spent four passes on a guard reading
the wrong window, and here is a guard reading the wrong *mode*.

**Owner ruling: the checker is over-broad; add T5 and make the leg mode-aware.** Filed as **TD-123**
(high) — and the debt row is not discharged by filing, because `scripts/qa-check.sh` consumes this leg,
so the gate is RED and ADR-021 blocks the close. Recording it without fixing it would have meant closing
through a red gate, which is the one thing the gate exists to prevent.

**T5 is declared `J1` while its four siblings are `J2`, and the reasoning is recorded so it cannot read
as a dodge.** The others are J2 because each needs an owner *ruling*: T3's exception policy, T4's item-3
reading, and T1/T2's originating debt decisions. T5's ruling has already been given — the design is
settled, and what remains is execution inside that envelope, which is J1's definition. **Declaring it J2
would be circular**: the task fixing the check would itself be failed by the check it fixes.

**Impact on the frozen Plan:** T5 added (`Layers: scripts/lib/check-authority.sh` ·
`evals/run-authority-fixtures.sh`; `Depends-on: none`). No other task's scope moves. Cross-stream
ownership is unaffected — neither file is declared by the `engine` stream. **Task count is now 5**,
recorded plainly rather than left to be counted.

---

### 2026-08-29 | progress | T4 complete — the contradiction is dissolved, not decided

consequence · T4 · behaviour:none · governance:high — review: Tier P read-through (ADR-029: prose takes G1 + a read-through, not the seeded-break bar)

**Owner ruled STRICT: a declared `J2` task FAILS pre-flight item 3.** A Plan carrying one is not
launchable unattended; the J2 work is split out before the rest fires. Recorded in `night-run.md`
**item 3 itself** — the line a launcher reads while running the pre-flight pass — not a footnote and
not a separate section (L-151, which this sprint has now paid for three times).

**The reconciliation is the part worth keeping, because it did not simply pick a side.** `AFK-safe`
and `J2` were defined as opposites in the same document while the `J2` row's *"parks — continues
disjoint AFK work"* clause read as permission for a declared J2 to ride along in an unattended Plan.
T4's framing: **the two are the same rule read at two different moments.** Parking describes what a run
does with a J2-shaped step it *meets* mid-run and could not have declared at G2 — a revise-loop judgment
finding, a `promote`/`close`/`triage` approval, a mid-sprint scope-change. A **declared** J2 is
different: its class is fixed before the run starts, so item 3 excludes it *there* rather than leaving
it to be parked at runtime. **Both definitions survive untouched; only the implication that one permits
the other is removed.**

**SPRINT-090's D4 was not inherited, per this sprint's D3, and re-derivation was the right call.** D4
ruled the permissive reading and its justification was later corrected in two of three parts — only one
of three cited mechanisms is genuinely unreachable under the strict reading, and the AFK-safe/J2
opposition cuts the other way and was never weighed. A ruling whose reasoning was shown wrong in two
thirds is not precedent.

**Internal consistency was checked as a list, not a spot-check.** Every site discussing `AFK-safe`,
`J2` or item 3 was enumerated with its verdict, *including the ones left unchanged and why* — the
authority-class table, the envelope-widening rule, the declared-never-inferred paragraph, the
HITL/AFK implication, the revise-loop retry rows, the park protocol, and the `AUTHORITY_BOUNDARY`
terminal-state row. That last one is the interesting catch: it says remaining work may be "all J2 or
blocked behind a park", which reads like a contradiction until you notice it describes remaining
*process* steps rather than declared Plan-task classes. Checked and left, with the reasoning recorded
rather than the line silently edited to match.

`.claude/CONTEXT.md` was deliberately **not** edited: its J-class vocabulary never claimed a Plan may
launch holding a declared J2, so the ruling settles how `night-run.md`'s item 3 treats one without
moving the vocabulary. **TD-109 marked `resolved → TASK-306`** with the supersession of D4 and the
EPIC-015 consequence recorded in the row: a proof of `AUTHORITY_BOUNDARY`/park behaviour can no longer
come from a Plan that *declares* its J2 task — it needs a J2 shape surfaced dynamically.

