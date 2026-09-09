---
owner: Maintainer
last_updated: 2026-09-09
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v1.61.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v1.63.0 release** (2026-09-09), on schedule
> this time: §11 keeps the current and previous minor inline, so cutting v1.63.0 pushed v1.61.0 out.
> Reachable only from the root `CHANGELOG.md`.

## v1.61.0 — Prove the Unattended Run (2026-08-27)

MINOR — SPRINT-089, **10 of 10 DoD**, plus SPRINT-090 (the run vehicle), **6 of 6**. Closed at
`QA-CHECK: 199 pass, 0 fail`. **The loop ran itself unattended for the first time**, and the sprint's
most valuable output is the list of things that stood in the way.

**Consumer-facing — this changes what your gate runs and what your permissions must cover.**

- **New always-on eval harness** (`evals/run-git-availability-fixtures.sh`, ~3.2s) — the always-on set
  goes **30 → 31**, zero removed. It guards the conformance engine's **git-availability branch**, which
  twelve assertions gate on and which had **no discriminating coverage in either direction**: two seeded
  breaks were run against the existing suites and *neither reddened*. If your gate time matters, this is
  where the extra three seconds went, and it is placed always-on deliberately — a guard for an always-on
  code path that itself ran only under `QA_FULL` could not catch the defect it exists for.
- **`scripts/lib/conformance-engine.sh` is faster per call** — the `git rev-parse --git-dir` probe was
  spawned once per *rule that asks* (twelve of them); it is now memoised per target, **6 spawns → 1**.
  Output is byte-identical. The wall-clock share is **not claimed**: on the measuring host it sat inside
  run-to-run variance, and one sample cannot resolve it.
- **An unattended run may now need more permissions than you have granted.** Directory-prefix rules of
  the form `Bash(sh dir/:*)` are **non-functional** (measured, and independently corroborated by prior
  research) — use exact-file or bare-command forms. On a two-shell host, `PowerShell(...)` rules are a
  separate surface from `Bash(...)`: a run silently loses the shell you did not authorize, along with
  whatever work went through it.

**The gate's budget criterion was wrong, and is now reproducible.** A default run measuring 288s against
a 450s budget reads as healthy. It was not: the same **byte-identical** code (verified with
`git hash-object` against `git rev-parse <ref>:<path>`) ran **1.92–2.20× faster** than on the host that
recorded 454s, so normalized the tree was **553–632s** — and a sibling sprint had independently observed
634s. `TD-090`'s re-raise condition is restated as **arithmetic anyone can re-run** against a pinned
calibration anchor, instead of a wall-clock figure that reports the weather (**L-175**).

**Five things stood between a promoted Plan and an executed one, and none was found by reading the
procedure** — each surfaced only by attempting the next step (**L-179**):

- **`TD-109`** — pre-flight requires every task be AFK-class, while the vehicle Plan must carry a
  declared `J2`. The machinery is built for that `J2`; the wording forbids it.
- **`TD-110`** — the launcher refuses to fire unless `qa-check.sh` exits 0, so **no Plan whose task
  repairs a gate FAIL can ever run unattended**. The precondition lives in code the checklist never
  mentions.
- **`TD-111`** — `gen-index.sh` stamps `last_updated:` into the generated index, so **the index goes
  stale at every midnight regardless of content** and reddens the gate on an untouched tree. Combined
  with `TD-110`, an overnight run can be refused by the clock alone.
- **`TD-112`** — with two active sprints the launcher's reaper wrote its rollup into the sprint the run
  did **not** execute, reporting `PLAN_EXHAUSTED` over a run that **parked** a `J2` — and
  `check-night-run-rollup.sh` **passed it**, because it asserts shape and never agreement (**L-178**;
  the same class as the previous release's `L-174`, recurring one sprint later through a different
  route).
- Plus `sprint-bulk` step 0's *"more than one active → ask which sprint"*, in a channel with no ask.

**What the run got right is worth as much as what it exposed.** It executed a `J1` with no
confirmation, parked a **seeded** `J2` with its unblock condition, consumed the ten-dimension approval
envelope without re-confirming anything — and when it met `TD-111` it **parked its own close** rather
than repairing, exactly as `repair-policy: none` required. The contract held on a case its authors had
never considered. EPIC-015 § Closed-when **3 and 4** complete; **1 deliberately left open** until a run
*reports* its ending as truthfully as it reaches it.

**Process.** An independent Tier G reviewer found a latent silent-direction defect in the engine change
that 43 green assertions missed, and a second reviewer found the author's own reasoning defect in a
governance ruling (two of three cited mechanisms overclaimed). **Of every defect this sprint, not one
was caught by recalling the rule that governed it** — all came from a guard firing, a disagreeing second
number, or an independent pass. `L-175` · `L-176` · `L-177` · `L-178` · `L-179` filed;
`TASK-303`–`TASK-306` routed.

