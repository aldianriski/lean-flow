---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Rotated from root CHANGELOG.md when a newer MINOR landed (DOCS_Guide §11)
status: current
---

# lean-flow — Changelog archive (v1.29.0)

<!-- Rotated verbatim from root CHANGELOG.md when v1.31.0 landed (v1.31.0 + v1.30.0 stay inline).
     Append-only; never edited. -->

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

_Older releases (**v1.27.3** and earlier) → [`CHANGELOG-1.27.3.md`](CHANGELOG-1.27.3.md)._
