---
owner: Maintainer
last_updated: 2026-07-30
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.23.0 — Freshness Row and Park Records (2026-07-30)

MINOR — SPRINT-040. Two things this repo already did correctly but left no trace of. A contract you
can't see the results of is one you end up taking on faith.

**What changed for you:**
- **`/prime` now tells you whether the skills you're running are the ones in your repo.** A live
  session keeps whatever installed plugin copy it started with, so a skill you edited but didn't
  reinstall keeps executing its **old** procedure — no error, and a diff that reads as if your change
  was ignored. The version was never hidden; it's printed in every skill's invocation header. It just
  went unread, once for an entire sprint. The health check now carries a `Skills:` row: `fresh`,
  `STALE — reinstall before trusting any procedure`, or `n/a (no local plugin repo)` if you only ran
  `plugin install` and have no checkout to compare against. It reports and never blocks — whether a
  stale procedure is acceptable is your call, not the skill's. Version-only by design: an edit that
  skips the version bump still reads `fresh` here, and that leg stays covered by the unattended
  pre-flight, which diffs cache content against the working tree.
- **`migrate` and `init` now leave a record when a headless run can't get your approval.** Both
  already refused to touch anything without sign-off — that half was never in doubt. But they
  declined *in prose*, so an overnight run ended with no artifact showing it had run or what it was
  waiting on. Both now detect the missing ask channel and write a park record to a `/handoff` doc
  naming the proposed plan and the unblock condition, before halting.
- **The fix that mattered was the trigger, not the rule.** Stating what to do when headless changed
  nothing across two real test runs, because nothing told the run *how it knows* it is headless — and
  waiting in prose is correct when someone is watching. Adding the detection probe made both comply
  immediately. If you write conditional behaviour into a skill, ship the condition's observable with
  it; that's the difference between the entry points that complied and the ones that didn't.

---

## v1.22.0 — Runnable Night-Run Pre-Flight Checks (2026-07-30)

MINOR — SPRINT-038. v1.21.0 specified two of the night-run pre-flight capability checks in prose
only. This ships them as snippets you can actually run, so the gap between "documented" and
"enforced" closes.

**What changed for you:**
- **The night-run pre-flight capability checks are now runnable, not just described.**
  `night-run.md` ships copy-pasteable POSIX-sh snippets for the two checks v1.21.0 only specified:
  **installed-skill-version vs. repo manifest**, and **worktree usability**. The first is the
  load-bearing one — a night run executes the *installed* skill, so editing a skill without
  reinstalling means the run faithfully executes the **previous** procedure, with no error and a
  morning diff that looks like it ignored your change. You can now check for that mismatch before
  a run starts, instead of finding out after.
- **The README's file-map was corrected** to match the doc layout `/lean-doc-generator` has
  produced since ADR-012 (root `CHANGELOG.md`, `docs/architecture/overview.md`,
  `docs/deployment/{deployment,rollback}-guide.md`) — it had drifted stale against what actually
  ships.

---

## v1.21.0 — Gates and Evals (2026-07-30)

MINOR — SPRINT-037. v1.20.0 proved the preflight was feasible and then deleted it. This ships it
for real, closes the allowlist gap a live probe found, and answers whether behavioural evals are
worth building — with measured numbers rather than an opinion.

**What changed for you:**
- **The dispatch preflight is now a real step, not a prototype.** Before any parallel wave,
  `/orchestrator` derives four things from the three markup tokens your sprint Plan already
  carries (`### Tn` · `Layers:` · `Depends-on:`): a **cycle** check, a **shared-file
  single-owner** check, a **base-ref-vs-HEAD** check, and **wave computation**. Any failure halts
  the wave with a *named* finding, so a morning rollup says which check tripped. It ships as a
  procedure step plus an optional dependency-free POSIX-sh snippet you can run verbatim — no new
  file, no second source of truth (ADR-013's addendum: "a preflight *step*, not a file format").
- **A shared file with a `Depends-on:` edge now passes instead of blocking.** The check
  distinguishes an overlap already serialised by a dependency (PASS, ownership order derived from
  the edge) from an unowned one (FAIL). Without that distinction, ordinary sequenced work would
  have tripped the gate.
- **The gate was tested against inputs that must fail** — one fixture per check, each failing with
  its own finding, because a gate's worst outcome is passing a real violation silently. That is not
  theoretical: stripping a single parse-guard clause made the snippet report `CLEAR` on a genuine
  overlap. If you write gates, the discipline is now a project anti-pattern (L-058).
- **An unattended run can finish its clean halt.** The night-run pre-flight allowlist now covers
  the `/handoff` invocation *and* the write of its output doc to the OS temp dir — a separate call
  that `dontAsk` would deny on its own, so allowlisting the skill alone still left a run unable to
  halt. A real probe hit exactly this: it parked every HITL task correctly, then stopped one step
  short. The Execution-Log fallback stays documented — belt, not replacement.
- **New pre-flight capability checks, specified with their degrade rules.** Agent-dispatch
  availability (absent → run inline and sequentially; a task that then can't finish parks),
  worktree usability (absent → run the wave sequentially in the shared tree), and — the
  load-bearing one — **installed-skill-version vs repo manifest (mismatch → block the unattended
  run)**. That last one matters to you directly: a night run executes the *installed* skill, so
  editing a skill without reinstalling means the run faithfully executes the **previous**
  procedure, with no error and a morning diff that looks like it ignored your change.
- **Behavioural evals: feasible and cheap, on measured numbers** — one fixture, first attempt,
  **$0.797** and ~140s, asserting structural facts (checkbox state, file survival, park-record
  shape, commit log) rather than grading prose. Verdict and honest limits →
  `docs/research/behavioral-eval-feasibility.md`.

---

_Older releases (**v1.20.0** and earlier) → [`docs/changelog/CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
