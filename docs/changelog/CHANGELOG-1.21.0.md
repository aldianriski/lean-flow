---
owner: Maintainer
last_updated: 2026-07-30
update_trigger: Never — rotated archive (DOCS_Guide §11); append-only history
status: current
---

# lean-flow — Changelog (rotated: v1.21.0)

<!-- Rotated out of root CHANGELOG.md at the v1.23.0 release (§11: keep current + previous minor inline). -->

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

_Older releases (**v1.20.0** and earlier) → [`CHANGELOG-1.20.0.md`](CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](CHANGELOG-1.7.1.md)._
