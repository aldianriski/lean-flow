---
owner: Maintainer
last_updated: 2026-08-14
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.38.0 — Where It Fires (2026-08-14)

MINOR — SPRINT-064, **3 of 3 units**, the third member sprint of **EPIC-002 Make Room** (only its T1 is
epic-tracked). Three governance mechanisms that existed and did not reach. In all three the rule was
already written, already correct, and gated on something that could not reach the failure.

**What changed for you**

- **Worktree-dispatched agents no longer write the Execution Log.** `dispatch.md` previously said an
  agent "never touches a file the overlap map marks shared". That map is derived from each task's
  `Layers:`, and **sprint infrastructure is declared by no task** — so it could never be marked, and the
  clause could never fire for it. `coordinator-owned` is now defined as a **class** with its members
  named: the sprint **Plan file** (DoD ticks · § Files Changed) and its **Execution Log** sibling. A
  dispatched agent **returns its Log entry inside its report**; the coordinator appends at merge-back.
  Wired at both decision points — `orchestrator/SKILL.md` step 2 (where the overlap map is built) and
  `dispatch.md` § Worktree dispatch protocol (where the brief is written).
  *Symptom this fixes:* SPRINT-063 dispatched one agent and ended with **two copies of one Execution
  Log**, merged by hand — from a brief that correctly banned editing § Plan and ticking DoD and said
  nothing about the Log.

**Maintainer-facing**

- **A promoted rule became an action.** The "match by shape, not substring" guard (L-108) had been
  correctly placed in `CONTEXT.md` § Gates and *loaded in context* for all eleven of its sightings,
  reaching none. Sorting them by the flow that was running showed **8 of 11 were ad-hoc verification
  queries inside a governance pass** — where § Gates is already loaded, so the file was never the
  defect. Every instance ever caught was caught by **a second number that disagreed**, never by recalling
  the rule. It is now `.claude/CLAUDE.md` § Behavioral Guidelines, phrased as a required cross-check.
- **One §11 collapse pass applied to `docs/LEARNINGS.md` — applied count 0.** 96 entries (64 active, 31
  promoted, 1 superseded); all 31 promoted already carry their pointer. With SPRINT-063's
  `docs/research/` pass, **both §11 legs are now applied**, each returning zero with the evidence rule
  honoured.
- `L-108` → count 6 · `L-113` → count 2 (promotable at the next promote).

**Known gaps, named rather than closed:** `complete` is a reserved run-level event in the Execution Log
and the template does not say so — writing it to mean "this task finished" silently arms the Part 4
rollup assertions (`TD-055`). The new cross-check rule is procedural text and skill prose has no fixture
harness, so it ships with a walkthrough rather than a retained test (`TD-052`, whole category).

## v1.37.0 — Headroom (2026-08-14)

MINOR — SPRINT-063, **4 of 4 units**, the second member sprint of **EPIC-002 Make Room**. SPRINT-062
built the procedure for ruling a cap and delivered no headroom; this one spent it. Every task mapped to
one of the epic's four Closed-when conditions, and in three of the four the tidy answer was available
and wrong.

**Governance caps — two ADRs, and neither moved a number by ceremony**
- **ADR-019** — `TODO.md`'s cap `~150 soft` → **`320 soft`**. Derived, not chosen: § Task entry shape's
  ten mandatory fields cost **~17.6 lines per entry** (measured 176 lines / 10 tasks), so the cap and
  the schema could not both hold. Kept **soft** deliberately — §11's response to this cap is a prune
  conversation with the owner, which needs the breach reported rather than the gate failed.
- **ADR-020** — `docs/research/<slug>.md`'s cap `120 soft` → **`130 soft`**, *and* a
  **`status: superseded` doc is FROZEN: the cap no longer applies to it.** A spent verdict's only legal
  future is §11 archival, and the one thing that can still grow on it is the annotation recording *why*
  it is spent — so the cap was asking for the supersession trail to be deleted.
- `.claude/CLAUDE.md` **80 → 61 lines** (24% headroom) with its cap **held at 80**. Its diet pass found
  real duplication: `## File Structure` was a hand-maintained codemap of `docs/architecture/overview.md`
  § Directory structure, which `CONTEXT.md` § Orientation already forbids. The five per-skill
  `references/` one-liners it uniquely held were **moved** to `overview.md` before the cut.
- `.claude/CONTEXT.md` **held at 150** — ADR-017's diet pass had already falsified the standing
  duplication hypothesis two sprints earlier, so re-running it would have re-derived a dead premise.

**Checkers**
- `check-doc-caps.sh` exempts frozen verdicts, **reported never silent** — `FROZEN (superseded): …`
  names the state *and* the exit condition. The matcher is position-anchored to the frontmatter window,
  and the retained fixture proves it: a `status: current` doc carrying the literal string
  `status: superseded` in prose is still caught. Two fixtures added
  (`evals/fixtures/doc-caps/frozen-spent/`), both retained per TD-012.
- **The 11 checkers stand alone; consolidation is deferred to EPIC-004** (EPIC-002 D3, with a one-line
  reason per checker). They share no input model — markdown tables, frontmatter, git history, JSON
  manifests and prose inference are five different parsing problems — so one engine today would be a
  dispatcher with eleven bodies. The deferral names its closing class of fact: EPIC-003's spec existing
  in a form a checker can read as its rule source.

**Retention**
- One §11 archive pass applied to `docs/research/` — **applied count 0**. All four `status: superseded`
  docs have live citers, each verified by reading the citing line rather than trusting a match.
- `TD-046` deleted per §11 (resolved three sprints prior); `TD-050` and `TD-049` re-reviewed and held
  with unblock conditions stated.

**Consumer-facing note:** `DOCS_Guide.md` §2 and §11 changed, and the standard ships inside the plugin —
adopters pick up the new research cap, the frozen-verdict rule and the `TODO.md` cap on upgrade.

_Older releases (**v1.36.0** and earlier) → [`CHANGELOG-1.36.0.md`](docs/changelog/CHANGELOG-1.36.0.md) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
