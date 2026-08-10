---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: a MINOR version rotates out of the root CHANGELOG
status: current
---

# lean-flow — Changelog v1.32.0

<!-- Rotated out of root CHANGELOG.md per DOCS_Guide §11 — moved verbatim, never edited. -->

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

