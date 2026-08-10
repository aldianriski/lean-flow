---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

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

## v1.31.0 — Prove the Guards (2026-08-10)

MINOR — SPRINT-057. The night-run protocol told you how to build its guards and never how to prove
one is live. Driven by a **field report from someone running lean-flow on their own project** — the
first outside evidence this protocol has had, on an OS and shell we don't use.

**What changed for you:**
- **Pre-flight now proves the allowlist is in effect, instead of assuming it.** A new probe item
  carries a deliberate **must-deny action**, because without one "every call succeeded" and "the
  allowlist was ignored entirely" produce identical output — and the second is exactly what an
  untrusted workspace does. A three-row table tells you how to read the two results together.
- **Workspace trust: check the key the headless launcher resolves.** Trust is recorded per resolved
  path key, and one directory can have more than one spelling, so the interactive session and the
  launcher can consult different records. The remedy the CLI itself prints — run interactively once
  and accept — **cannot** fix that, because the interactive session lands on the key already trusted.
- **File-tool permission forms are their own surface.** The measured rows were `Bash` only; a
  path-scoped `Write(<abs>/**)` was denied on a real host while the bare tool name matched. Measure
  them before relying on them, and note the trade: the working form is broader than a path fence.
- **DoD commands get executed once before the run fires.** A DoD command asserts a binary exists on
  the host, and when it doesn't, every task fails its gate for a reason unrelated to its work.
- **One output format, end to end.** The trigger now mandates `--output-format stream-json`, and the
  watchdog's stall signal and the cost row follow it. Previously three sections assumed three
  different formats, and `json` buffers until exit — which is how a healthy run once got reported
  dead.
- **The watchdog must be confirmed running.** One that dies at startup guards nothing and looks
  exactly like a healthy one, because silence is what both look like.
- **`gates_signed:` in sprint frontmatter.** An unattended run reads the sprint file and nothing
  else, so a G1/G2 sign-off held only in your session's transcript was invisible to it — the run
  re-ran both gates, couldn't ask, and parked every task. An **absent** field means *not signed*,
  never "assume it was fine".
- **`promote` refuses to freeze a `size: L`.** G1 already split an `L`, but it ran after the Plan was
  committed, so the split cost a scope-change. It's now checked where splitting is still free.
- **Doc line caps distinguish soft from hard.** A `~150 soft` cap in the standard now *reports* when
  exceeded instead of failing the gate, which is what §11 always said it should do; `400 hard` still
  fails. Coverage is unchanged.

**Housekeeping:** L-086 promoted into the pre-flight procedure on its second, independent sighting;
TD-038 deleted (resolved 3 sprints); TD-047 filed (the pre-flight checklist is becoming the doc's
centre of gravity). Gate 126 → 131 checks, with 10 retained fixture cases added.

---

## v1.30.0 — Silent Passes (2026-08-09)

MINOR — SPRINT-056. Five gates that reported green over input they never examined. Every one had
produced a real false PASS on this repo and announced it as a clean run.

**What changed for you:**
- **The dispatch preflight now reads the declarations it used to skip.** A wrapped `Layers:` line
  (the normal shape for any task touching three or more files) had everything after its first line
  invisible, and a directory token ending in `/` was invisible entirely — both producing
  `PREFLIGHT: CLEAR` over a genuinely unowned shared file. Continuations are now collected and
  directory tokens compare prefix-aware, naming both sides when they collide.
- **Doc line-caps are derived from the standard instead of hand-listed.** `qa-check.sh` named four
  globs covering 17 files; DOCS_Guide §2 states a cap on far more rows than that, and every unlisted
  row was a cap with nothing behind it. Coverage is now read from §2 itself — 47 checks — and a §2
  row whose path cannot be parsed is a named failure, not a silent skip. Pre-existing breaches are
  grandfathered **visibly**: each prints on every run with its count at adoption, fails if it grows,
  and is told to delete its own row once back under cap.
- **All four plugin manifests are compared to each other.** Previously only the README footer was
  compared against `plugin.json`, which is how `.codex-plugin/` and `.kimi-plugin/` drifted five
  releases behind before anyone noticed by hand. The manifest set is discovered on disk, so a fifth
  enrolls itself.
- **An undeclared edit is reported while it is still cheap to fix.** Files excluded as "close
  bookkeeping" (`TODO.md`, `TECH-DEBT.md`, `CHANGELOG.md`, `LEARNINGS.md`) are now excluded *only at
  close* — during execution an edit to one of them is task work and must be declared. Previously the
  violation stayed invisible for a whole task and surfaced later, attributed to a task already
  finished and pushed.
- **The sprint checks stay armed through the commit that closes the sprint.** They used to gate on
  `status: active`, so writing `status: closed` disarmed them in the same commit that adds the Retro
  and all the close bookkeeping — 72→68 checks at one close, 94→87 at the next, both reporting
  "0 fail". They now skip on archived *location*, which changes in a separate later commit. A check
  that verified zero inputs reports as a skip instead of a pass.

**Housekeeping:** four `TD-NNN` rows closed (TD-040 · TD-041 · TD-042 · TD-043 · TD-044); two filed
(TD-045 preflight parser duplication, now guarded by a parity fixture rather than removed; TD-046
gate runtime). Gate coverage 89 → 126 checks, with 15 retained must-FAIL fixture cases added.

---

_Older releases (**v1.29.0** and earlier) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
