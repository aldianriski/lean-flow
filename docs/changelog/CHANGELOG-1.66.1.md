---
owner: Maintainer
last_updated: 2026-10-07
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v1.66.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.1.0 release** (2026-10-07). §11 keeps the
> current and previous minor inline (2.1.x and 2.0.x), so cutting v2.1.0 pushed v1.66.x out.

## v1.66.1 — The gate's truncation costs the fewest guards (2026-09-22)

**Released — PATCH.** All four `*-plugin/*.json` manifests and the `README.md` footer moved
together, derived with `grep -l '"version"' .*-plugin/*.json`.

### Fixed
- **`qa_budget_check` refused nothing.** A non-numeric budget made `[ "$elapsed" -gt "$budget" ]`
  error, the `if` read that as false, and the function fell through to `OK` / exit 0 — forever.
  Measured: `qa_budget_check 0 abc 0` returned **`OK 1790032685 abc`**, reporting OK at 1.79
  billion seconds elapsed. A silent false negative in the mechanism whose only job is bounding a
  run, reachable from any caller passing an env var through unvalidated. Now refuses by name with
  a distinct exit 2 (`UNUSABLE`), so a caller can tell "over budget" from "budget unusable".
  5 retained fixtures incl. a must-NOT-catch control, proven to discriminate by a seeded break.

### Changed
- **The always-on eval-harness set is ordered cheapest-first.** It was chronological, so
  truncation dropped whichever harnesses happened to be newest. Now, if a run exceeds its budget,
  it drops the dearest instead — verified live: at a 200s budget the skipped set is exactly the
  expensive tail. Per-harness costs are recorded beside the list and flagged as a snapshot (L-130).

### Reverted before release
- **A `night-run.sh` budget raise, which was a regression.** It read ADR-042's "a caller that
  knows it is detached may raise it" as licence — but that sentence's antecedent is
  `QA_CEILING_SECONDS`, a different variable, and **the pre-flight gate call is not detached**
  (it is synchronous; the only `nohup` is 144 lines below). Unbounded, the launcher reached ~955s
  in one foreground call against a 600s ceiling: killed mid-pre-flight with no verdict, strictly
  worse than the bounded refusal at ~560s it replaced. Caught by an outside review before it ran
  anywhere real. The correct fix — the caller **declaring** detachment — is `TASK-367`.

## v1.66.0 — Hooks become admissible; the first candidate is withdrawn at review (2026-09-21)

**Released — MINOR.** All four `*-plugin/*.json` manifests and the `README.md` footer moved to
`1.66.0` together, derived with `grep -l '"version"' .*-plugin/*.json` rather than from a list
(the DoD line that enumerated a subset was read as exhaustive twice).

### Added
- **`scripts/lib/check-prose-density.ts`** — gate leg 2b-ter. `check-doc-caps` counts newlines, and
  a markdown file satisfies a newline cap by writing longer lines: `.claude/CLAUDE.md` held 63 lines
  against a cap of 80 while its content grew **2.62x** after the cap was reached, longest line
  **6,681 characters**. `STANDARD` §157 already forbade the squeeze and nothing checked it. Built as
  a **ratchet** (FAIL only when a file gets denser than its recorded baseline), because `TD-174`
  records what report-only achieves. It caught its own author within minutes of being wired.
  Population **derived** from the same source `check-doc-caps` uses — 84 files, after an outside
  review found the first version examined 16 against 78 capped ones (L-186). Table rows are measured
  by longest **cell**, closing a `| `-prefix bypass that was already live. 10 retained fixtures,
  each branch proven to discriminate by a seeded break.

### Changed
- **`ADR-044` — hooks and agent definitions are admissible**, held to `ADR-001`'s curation bar.
  `ADR-001` had explicitly **rejected** "no agents / no hooks, ever" as too extreme; the blanket
  line was a *proxy* for curated that began being enforced in place of it. `ADR-011` is
  **superseded in part** on the record — its real objection was the platform fact that hooks
  auto-activate with **no per-hook disable**, making any shipped hook mandatory for every consumer.
  That sets a new standing bar: a hook must be worth being mandatory, measured on real input.
  `ADR-002` is **untouched** — it contains no hook clause (`grep -ci hook` → 0).
- **The `"no X"` banner is retired across the consumer surface**, and one member was **flatly
  false**: `/lean-doc-generator init` is titled *"Scaffold a fresh repo"* and has shipped for a long
  time, while the README's second line denied it. A negative claim has no diff that ever makes it
  look wrong. Component claims now **describe the roster**.

### Withdrawn
- **`ask-dont-tell`, a `Stop` hook for `L-002`** — built, reviewed worktree-isolated, and **not
  shipped**. Measured against 48 real transcripts (5,451 assistant blocks, 746 completed turns) it
  would have blocked ~35 turns with **~22 false positives (≈60%)** while missing ≥9 genuine inline
  decisions — 8 of those because its patterns were English-only and the maintainer works
  bilingually (`Mau saya …?` *is* "Want me to …?"). Its 7 fixtures could not see any of this: both
  blocking fixtures were keyed to patterns firing **0 and 2 times** in the corpus, and deleting
  every pattern that *does* fire left the suite fully green. Withdrawn under ADR-044's own clause —
  narrow it or withdraw it, never widen the fixtures until it looks green — and re-filed as
  **`TASK-366`**. No consumer-visible change: the roster is unchanged and Bun remains not required.

---
## SPRINT-103 — Port the Measured Hotspots (2026-09-21)

**Unreleased — no version bump.** `skills/`, the four `*-plugin/*.json` manifests, `README.md` and
`spec/` are untouched (derived from `git diff --name-only bfa3fec..HEAD`, not judged). The one
consumer-facing file in the diff, `scripts/lib/conformance-engine.sh` (ADR-027), changed by **16
comment lines only** — `sh -n` clean, byte-identical output and exit code against the pristine copy
over the full 100-rule spec. No consumer-visible change ⇒ nothing to release. Spec unchanged at
0.11.0. **23 of 34 DoD `[x]`, 11 `[~]` n/a, 0 open** — each n/a carries inline the ruling that made
it inapplicable, because closing 34/34 when 11 were never applicable reads as more work than
happened (L-088).

**The sprint measured first and ruled four of its five targets unportable — and that is the result,
not a shortfall.** SPRINT-102 inherited TD-090's harness ranking, ported five checkers and moved the
gate by nothing; Round 16, the first profile of a *completed* gate, held none of them in the top 20.
So every task here opened with its own measurement, and "ruled unportable, mechanism recorded" was an
accepted outcome (D2). It happened four times, and each ruling names a different mechanism.

**T1 — 305 s, and a port would have recovered almost none of it.** `conformance-engine.sh` costs
**2.93 s against an empty directory** with the shipped 100-rule spec and 0.35 s with zero rules —
~26 ms per rule of dispatch paid whether or not anything is checked. The harness makes **68** engine
invocations, so **199 s of its 305 s is dispatch inside the program the port would still have to
call 68 times**. Ruled not spawn-shaped. The cost was then removed anyway, on the caller side: the
harness now hands the engine an **awk-derived 43-rule spec** (§9+§10+§11+§12), reduced from the
shipped `spec/STANDARD.md` at run time and carrying a per-section drift anchor. Six alternating runs,
**319.2–354.6 s → 136.7–184.0 s, non-overlapping**; median 341.0 → 149.8 s. Output byte-identical,
69/69 verdict lines, 0 FAIL both arms, same cases and same findings (D6 holds). **The trap that
nearly shipped:** the harness header claimed §9+§10, which is 26 of its 68 cases — a reduction built
on that prose would have left 40 assertions with no rule to fire, and **40 of the 68 are
`assert_absent`**, which passes when a finding does not appear. All of them would have gone green
testing nothing. The required set was derived twice, by two mechanisms sharing nothing (case-name
prefixes, then the 23 distinct finding slugs mapped back to the emitting engine function), and both
returned exactly {§9, §10, §11, §12}.

**T2 — the one target of five whose cost was genuinely spawn-shaped, ported.**
`check-layers-observed.sh` (644 lines) → `check-layers-observed.ts` (512), oracle **retained** under
D5. 59% of its CPU is `sys` and a third of its wall is not CPU at all: 29 throwaway git repos, ~92
git spawns, ~30 non-git forks per file. Gate **leg 15** now runs the port: **20.57–21.14 s →
2.76–3.69 s** over three alternating pairs, ~6× and non-overlapping, output byte-identical and exit
code equal on every pair, `sys` 10.3–11.4 s → ≤0.02 s. Parity: 25/25 identical (exit code + stdout)
over 19 built git fixtures **plus 103 real sprint files**, with a `population-3a-non-empty` case
asserting the active-corpus comparison produced real output — the two-empty-outputs-agree shape that
passed twice in SPRINT-102 is explicitly guarded.

**T3 — ruled, not ported, and the ruling is recorded in all three places its different readers
reach (ADR-043 · the engine's own header · TD-168).** Leg 2f-ter's sweep runs **173.1 s real / 53.8
user / 81.1 sys** — 60% `sys`, corpus size executed as per-file spawns, with fixed dispatch only 1.7%
of it. That **inverts T1's conclusion for the same program, and both hold**: two different costs in
one binary. A port is the right instrument and was ruled out of scope here for a reason that survives
the sprint — exit-code and report-text parity are reversible, but **shipping a `bun` requirement to
adopters is not**, and `conformance.sh` answers for any repository under ADR-027. **T4** split
(~50 s engine, out of reach under ADR-043; ~56 s portable fixture construction → **TD-171**).
**T5** is wait-bound by construction: two runs **0.1 s apart while their CPU totals differed by more
than 2×**, because case 2 must sit out a 60 s `timeout` to demonstrate the silent shape TD-084
exists to stop. The wait *is* the assertion.

**Four worktree-isolated outside reviews; four confirmed defects; none found by the author.** The
sharpest was a real port defect that **25/25 parity, 37/37 assertions, 103 real files and a seeded
break were all structurally blind to**: the oracle's unanchored greedy `sed` takes the **last**
`(SPRINT-N Tn)` citation in a subject, the port's `.exec()` took the **first**, and `git log --all`
over this repository's entire history holds **zero** two-citation subjects — first-match and
last-match agree on every input that exists. The reviewer's brief named seven admitted-skipped
branches and all seven came back clean; the defect sat on an axis nobody had enumerated (**L-207**).
The others: a header tally reading 66 against the 68 cases in its own paragraph (two `assert_absent`
calls written with two spaces, in a header whose thesis is that a file's prose about its population
is not evidence); a fixture whose anchor extraction grabbed a planted decoy `awk` line, now bracketed
by three exactly-once sentinels and behaviourally probed **per section**, since a 43-row decoy that
drops §9 entirely passed the total-only probe; and a stale rationale comment in `qa-check.sh`.

**Also shipped.** **TD-170 resolved** — `is_governance_commit()`'s allow-list now admits
`docs/sprint/` in both implementations, so a file that is already unreportable can no longer
*disqualify* the commit carrying it; retained pair includes an **over-exemption control**
(`{TODO.md} + {scripts/real-code.sh}` must still be reported), and the discrimination proof reddened
exactly the motivating fixture with both control assertions green. Leg 12 now dispatches `.ts`
harnesses and its census glob admits them — the new fixture actually runs in the gate, which was the
whole point of the wiring diff. `.claude/CONTEXT.md` § Sprint model now states leg 15's attribution
rules in prose: they were enforced in code and written nowhere a committer reads (L-151). ADR-039's
opt-in split applied for three differentials (~104 s); `layers-observed` (189.3 s) stays excluded and
named, its ruling deferred to **TASK-357** until a re-measured gate total exists.

**Closed without a full-profile gate run**, on the record: the host sat at **3.0% free memory
(428 MB of 14,078 MB)** — the condition that killed this sprint's Wave 0 — and a wall-clock figure
taken under paging measures swap, which is the same ruling Round 17 made. The sprint's own **A3 is
therefore recorded NOT confirmed**, and TASK-357 owns both it and the deferred ADR-039 ruling. The
last completed gate read `214 pass, 9 fail`, every finding dispositioned in the Execution Log: seven
fixed, two `review-depth-*-absent` answered by dispatching the missing review rather than by
downgrading the classification that triggered them, and one commit ruled genuinely unattributable.

**A claim frozen in a commit message was false, and the retraction is part of this record.**
`ccd6c6c` asserts *"leg 15 now exits 0 on both … the close blocker is cleared."* The check ran while
the fix was **uncommitted**, where the checker takes its WIP leg; committing the fix added a commit
that was itself unattributable, and both implementations then exited 1. The claim was true when
measured and false by the time it was written — **the act of recording it is what broke it**
(**L-206**). `ccd6c6c` and `e9c7e14` are exempted for this sprint only, history not rewritten,
because their shas are cited by name in ADR-043 and TD-170's evidence trail.

`TD-168` (high) · `TD-169` (high) · `TD-171` · `TD-172` filed · `TD-170` **resolved** · `TD-167`
annotated with its second sighting · `TASK-356` filed mid-run, `TASK-357` filed `origin: close-retro`
· **L-206** · **L-207** · **L-208** filed · `ADR-043` written.

---
## SPRINT-102 — Make the Gate Green (2026-09-20)

**Unreleased — no version bump.** `skills/`, the four `*-plugin/*.json` manifests, `README.md` and
`spec/` are untouched (derived from `git diff --name-only ef02be0..HEAD`, not judged), and the three
changed scripts are this repo's own tooling rather than ADR-027's consumer-facing conformance
engine. No consumer-visible change ⇒ nothing to release. Spec unchanged at 0.11.0. **17 of 18 DoD
`[x]`, 1 `[~]`.**

**The ceiling was ruled against the measurement (`ADR-042`, T1 · TD-117 · TD-090).** For four sprints
the direction rested on TD-117's *"raising the budget cannot work, the 600 s ceiling being
external."* Two detached full-profile runs completed at **1263 s** and **1370 s** — 2.1× and 2.3× the
ceiling — ran every harness, truncated nothing, and printed their own verdicts. The constraint is a
**foreground-call** limit, and the assertion was unfalsifiable in the direction it claimed:
`qa_ceiling_check` runs ~20 lines before the verdict, so its FAIL branch could only ever fire in runs
that were *not* killed, while its message read *"a run past the ceiling is killed from outside with
no verdict line."* The branch now prints an **uncounted INFO** naming the elapsed figure, the
not-killed fact and the foreground caveat. The trade-off is recorded rather than smoothed: a
genuinely too-slow gate now reports where it used to fail, and TD-117's own *"cheaper still to learn
to ignore, which is how a guard dies"* applies to the line this creates.

**Three Bun harnesses were reporting `only 0 test(s) ran` over green suites (T2).** `run-dod-delta-`,
`run-s4-ts-evaluators` and `run-s4-differential-parity` parsed `bun test` output without stripping
ANSI, so **156 assertions ran and were never counted**. Fixed; discrimination proven live and then
reverted, which is filed honestly as **TD-165** rather than claimed as a retained fixture — these
three wrap real production test files instead of a fixtures directory, so retaining a must-FAIL would
mean a permanently broken shipped test or new shell scaffolding.

**An unmatched task-shaped commit subject now FAILs loudly (T4 · `TASK-351` · L-202).** Rule 7 in
`attributeClaim`: a first token that looks like a task but matches no structural arm returns
`unmatched-shape` and names the subject, instead of falling through to a silent coord/unscoped pass.
Its first fix **reintroduced the class it closed** — the exclusion scanned arbitrary free text
case-insensitively, so any subject whose prose merely contained a `T<digit>` substring was re-exempted
— caught by a worktree-isolated outside review and sent back as a bounded retry rather than patched
by the coordinator. Reach, re-derived by that reviewer over four independent populations (commit
ancestry, `main`, `git log --all` including ~90 unmerged agent branches, and `git fsck --unreachable`):
**exactly 1 subject in this repository's entire history**, which is the retained fixture.

**The close found two defects nothing else had.** The first completed system-verify in this sprint
printed `226 pass, 2 fail`: a harness file changed twice by T4 and declared by no task (fixed, fourth
`Layers:` correction of the sprint), and a commit that ticked another task's DoD under its own
subject. The second is true and cannot be fixed forward — filed as **TD-166** with **L-205**, because
the leg's population is scoped to the *active* sprint, so the finding clears by closing while ADR-021
blocks the close on it. Closed on an owner ruling, with the defect carried rather than waived.

`TD-165` · `TD-166` filed · `TASK-354` filed `origin: close-retro` · **L-205** filed · **L-108**
bumped to count 15, **L-120** to ×6 and **L-151** to ×5 — every one of those three a sighting where
the promoted rule was loaded and cited in the same session it failed to reach.

---
