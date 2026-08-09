---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

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

## v1.29.0 — Wiring the Standard (2026-08-09)

MINOR — SPRINT-055. Five rules had been written and were not running. The retention row for epics had
never executed once; `close` pointed at a research archive target that was never defined; the standard
described a bug report's content but not its file; G1 fast-passed "decomposer-approved" tasks with no
field recording whether any task had met the grill; and the README's template count was guarded on two
surfaces but not the third — the one it had drifted on. Each is now wired to something that reads it.

**Retention that actually runs.** `close`'s archival pass now names the epic move (`docs/epic/archive/`,
INDEX row kept) gated on *every* member sprint closed **and** every § Closed-when `[x]` — never on
sprint count alone — and re-bases the relative links an archived epic needs one level deeper.
EPIC-001 has moved: the rule's first execution since the epic layer shipped. `docs/research/` gains a
§11 row: a verdict moves to `archive/` once `status: superseded` **and** nothing live still cites it,
because a spent verdict is usually the WHY-trail for whatever replaced it. Archived research stays in
the generated knowledge index, marked `(archived)`, rather than silently vanishing from it.

**An end of life for intake scaffolding.** A `BUG-<slug>.md` report and the working feature PRD are
temp-dir working material — never committed, like `/handoff` docs and council verdicts. Once `/triage`
routes a bug's substance into a `TASK` / `TD` / `/diagnose` brief there is nothing left to dispose of,
and §11 deliberately has no row for either: retention acts on committed files, so the absence is the
rule. `/triage` now tells the author to carry the repro *into* the destination rather than point at a
file that will vanish.

**G1's fast-path has a field behind it.** New `origin: decomposer | close-retro | triage-bug | manual`
on the task entry shape, stamped by all three filers. It records **where a task came from**, not a
self-assessed "was it grilled?" — faking it means misreporting the source. Only `origin: decomposer`
fast-paths; a missing origin reads as ungrilled, because the fast-path is the exception that must be
earned.

**Night runs are visible from where sessions start.** `/prime` and `/task-decomposer` were the only two
skills with zero night-run awareness — and they are the two a session begins at. `/prime`'s `Next:` line
now names `sprint-bulk unattended` when an active sprint has open DoD (naming only; priming stays
read-only), and the entry path lists an epic slice beside intent / PRD / ticket. `--epic` now also
resolves archived epics, reporting them as *closed* instead of advising you to create an epic for work
that is already finished.

**`CODE_OF_CONDUCT.md` joins the standard**, gated exactly like `CONTRIBUTING.md` (team ≥ 2, or on
request) with a Contributor Covenant 2.1 template. Its enforcement contact is load-bearing: `init` is
told not to scaffold the file at all if you cannot name a real monitored address, because a code of
conduct nobody can report to advertises a process that does not exist. lean-flow itself takes the
exemption and records why.

**The gate grew 74 → 94 checks**, via five new checkers each with retained must-FAIL *and* must-PASS
fixtures. Four of the five failed on real pre-existing repo state on their first run. Template counts
are now guarded on all three surfaces and on **both** halves — core and total — since the total was the
half that had drifted. A `Layers:` token ending in `/` is now a directory prefix in both layers
checkers; previously such a token matched nothing while still reading as a declaration.

---

## v1.28.0 — Rulings (2026-08-09)

MINOR — SPRINT-054. Three questions the repo had been carrying are settled, and **two of the three
changed nothing** — recorded as decisions rather than quietly dropped, because an unanswered question
that looks answered is worse than an open one.

**New docs, and the reasoning for the ones deliberately absent.** lean-flow now ships `AGENTS.md`
(a ten-line pointer, because `.codex-plugin/` and `.kimi-plugin/` mean non-Claude agents already work
in this repo with no instructions at all), `SECURITY.md` (what the plugin can actually do in your repo:
6 of 14 skills declare unscoped `Bash`, `night-run.sh` runs unattended, and there was no way to report
a problem privately), and `docs/development/setup.md`. Three other base-tier rows are **exempt with a
written reason and a revisit trigger** in `docs/architecture/overview.md` § Boundaries, so an absent
doc reads as a decision instead of an oversight.

**One consumer-facing standard change.** `DOCS_Guide` §2's `product/requirements.md` create-trigger now
states its condition: skipped on an existing repo whose AI-context files already *are* the spec, since a
third copy is a second SSOT. Greenfield `init` is unaffected — nothing owns the content yet there.

**Two questions closed by evidence rather than preference**, both with no change to the loop:

- The claim that ❌ prohibitions activate the behaviour they forbid is real but narrower than usually
  stated. Its popular write-up runs no experiment; the benchmark normally cited measures negation
  comprehension in question answering, a different construct, and reports positive scaling under
  stronger prompting. Anthropic's own guidance targets a *bare* prohibition — and that same page's
  production prompt samples are built from scoped prohibitions paired with a positive rule, which is
  the shape lean-flow's anti-patterns already use.
- The "push right" tension against gate-before-work turned out to be a **category mismatch**, found by
  reading the source instead of this repo's summary of it: push right governs *runtime* checkpoints,
  G1/G2 govern *direction* before work, and the skill making the argument grills exhaustively up front
  exactly as we do. Both principles were already in the loop, on the correct halves.

**Housekeeping:** `docs/research/mattpocock.md` split behind an index (159 → 110 lines, nothing
compressed); `.codex-plugin` and `.kimi-plugin` manifests brought back into lockstep after drifting five
releases behind; three new learnings and debt rows filed for gate gaps found along the way.

---

_Older releases (**v1.27.3** and earlier) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
