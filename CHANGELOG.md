---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.33.0 — Prove the Run Finished (2026-08-10)

MINOR — SPRINT-059. The night-run protocol could tell you a run failed. It could not tell you a run
**stopped early** — and that is the failure that reports `success`.

**What changed for you:**

- **A night run now reports how much of the Plan it finished, at every exit.** The rollup used to
  speak only for non-green tasks, so a run that ended mid-Plan without hitting a blocker wrote nothing
  at all and the morning reader saw a clean page. It now opens with `run · N of M DoD ticked`,
  unconditionally. Measured on a consumer's host before the fix: **4 of 7 units landed, every commit
  correct, tree clean, exit `success`, three tasks never begun and not one line about them.**
- **`unattempted` is a state.** It had no name, which is why those three tasks went *unreported*
  rather than misreported — they were not blocked, parked, denied or stalled. They never began.
- **The rollup is written by the launcher, not asked of the run** (ADR-016). This is the part worth
  reading twice: asking was *tried and measured*. A run whose trigger requested a rollup, a
  calibration row and a park re-check completed every unit of work and wrote **none of the three**. An
  instruction about the work holds; an instruction about bookkeeping does not, because a step that
  happens after the work and that no gate depends on is the first thing an agent drops. So
  `scripts/night-run.sh` emits it from the wrapper that already captures the exit code. Trade named,
  not hidden: this reaches only consumers who use the launcher, and the documented format still has
  to stand alone for everyone else.
- **A recorded run missing its rollup now FAILs the gate**, with two separately-named findings. The
  reaper emits; the checker refuses to let a missing one pass. That pairing is what makes it *gated*
  rather than merely requested.
- **A park the run itself unblocks gets revisited.** The protocol assumed a park outlives the run. It
  can also name a condition the same run satisfies two tasks later — observed: a field parked for the
  renderer, **three** subsequent tasks owned that renderer, none went back. Unattended runs only; an
  interactive run halts at the first blocker with a human present.
- **Two consumer calibration rows**, the table's first `inline` rows and its first from a host that is
  not ours. Read them loosely — different shape, different repo. The figure that transfers: **zero
  denials across 318 turns** after **$1.77** of probing, against a predecessor run that lost ~40% of
  its turns to denials.

**For maintainers — everything found this sprint was found by running something, never by reading it.**
The reaper silently dropped a task, because a whole-file grep matched a worked example in the log's own
prose. The park assertion's first draft **could only ever exit 0** (its loop was behind a pipe, so
`fail=1` died in a subshell) and, once fixed, still **passed the violation** because it searched for the
word "revisit" and the fixture's slug was `unrevisited`. The end-to-end night run reported a wall-clock
of `2 min` for a measured 163 s — correct arithmetic, 40% low, always in the same direction. Three of
the four are one pattern: a substring standing in for a structural claim, failing *green*.

**Housekeeping:** three learnings filed (`L-108` substring-vs-contract, 3 sightings · `L-109` the pipe
that swallows a failure · `L-110` how a `Layers:` declaration goes stale), one debt row (`TD-049`), one
follow-up (`TASK-188`). Five resolved TD rows deleted at promote (§11), ledger 281 → 160. Gate 131 →
141 checks, with 6 retained fixtures added. Run cost: $1.59 across two verification runs.

---

## v1.32.0 — Measure Before Moving (2026-08-10)

MINOR — SPRINT-058. Two decisions had been held for sprints on figures nobody re-took. Taking the
measurements changed both answers, and in one case the thing being measured turned out not to be the
problem at all.

**What changed for you:**

- **`AGENTS.md`'s cap in DOCS_Guide §2 is now `12`, not `~10`** (ADR-015). The old cap never budgeted
  for the two-line ownership footer §3 makes mandatory — nine lines of content plus that footer is
  eleven, so `~10` was unreachable from the day it was written. If `init` scaffolded you an
  `AGENTS.md` that read as over its cap, this is why, and it now isn't.
- **A stated cap is a real number.** Writing `~N` into a table a checker reads buys the appearance of
  judgement and defers the decision onto whoever next trips it — and because a breach visibly
  implicates the *file*, the cost lands on the wrong artifact. Approximate a figure a human reads;
  state a real one wherever a checker can reach it.
- **The grandfather list records hard-cap breaches only** (ADR-015 rule 2). A soft cap already has a
  route — the checker reports it every run and §11 sends it to the promote governance review — so
  recording it twice bought only a growth ratchet, at the price of a permanent row in a file whose
  whole purpose is to reach empty. Trade-off named rather than hidden: soft caps lose that ratchet,
  and nothing enforces the new rule yet, which is filed rather than implied.
- **Two oversized research docs split behind pointers**, nothing compressed (§7): the loop-hygiene PRD
  214 → 118 and the graphify verdict 157 → 107, each keeping a one-line pointer where its moved
  sections stood. The PRD also carried a banner reading *"nothing here has been applied"* while every
  workstream in it had shipped; that is corrected.

**For maintainers — the gate is not where we thought it was.** The always-on QA gate was measured
per-harness for the first time (`docs/research/qa-gate-timing.md`, two samples). The fourteen eval
harnesses are **~34%** of a ~130s run; the inline checks are **~66%** and had never been measured by
anyone. TD-046's proposed cure — move harnesses behind `QA_FULL=1` — is retired: it buys at most a
third of the gate, and the three harnesses that dominate it are the highest-value suites in the set.
Its specific suspicion, that "several harnesses re-run their checker over the entire live repo", was
two of fourteen costing ~10s, and both are deliberate zero-coverage guards whose live input is the
entire point — one exists because that checker's first live run matched nothing at all. Nothing was
moved, cheapened or edited; `scripts/qa-check.sh` and `evals/` are byte-identical.

**Housekeeping:** `L-105` promoted → `CONTEXT.md` § Gates (a guard is placed in time, not only in
text). `TD-037` re-scoped and held on a corrected basis — the miss that appeared on the uncommitted
path was TD-044's, not its own, and the distinction had been blurred by a too-broadly-worded reaffirm.
CHANGELOG rotated 181 → 94 lines. Two learnings filed (`L-106` approximate caps · `L-107` the legible
suspect), one debt row (`TD-048`), three follow-ups (`TASK-179`/`180`/`181`). Gate 131 pass, 0 fail.

---

_Older releases (**v1.31.0** and earlier) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
