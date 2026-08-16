---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.45.0 — Cite, Not Restate (2026-08-16)

MINOR — SPRINT-071, **14 of 14 DoD**, and the sprint that **completes EPIC-003**. The standard is now
something you can pin *and* build against: the skills defer to it instead of restating it, and the
spec defines the evidence each conformance level is checked on.

**What changed for you**

- **`spec/STANDARD.md` is at `0.3.0`, and §9 now defines what the Gated level is checked against.**
  Two things were missing and would have stopped you building a conformance tool from the spec alone:
  **`gates_signed: <GATE>[,<GATE>…] @ <sha>`** is now specified — including that its **absence means
  NOT SIGNED** and is never approval, that the record belongs in the sprint file rather than in the
  session that approved it, and that a malformed record is worse than none because it looks like
  evidence. And the **`*Verify: …*` clause** on a DoD criterion is now specified, so a criterion with a
  mechanical check is distinguishable from a judgment tick.
- **The skills cite the standard instead of restating it.** Six sites across `council`, `prototype`,
  `lean-doc-generator` and its `init` reference now point at §4 · §3 · §2 rather than repeating their
  rules. If you have been reading a rule out of a skill file, read it from `spec/` now — that is the
  copy that is maintained.
- **Nothing you rely on moved.** Every converted line still tells you a rule applies and where it
  lives; only the duplicated rule text is gone. Templates were deliberately left alone — a template is
  rendered output read by someone who may not hold the spec at all.

**Maintainer-facing**

- **A dangling cross-reference inside the spec, live for a full sprint.** §13 pointed at "§9" for
  `gates_signed:`; §9 never defined it. It survived authoring, review and a green gate, and was found
  only by auditing the spec as a reader with no `skills/` access — every other path finds the field
  documented in a skill and never notices the spec is silent. Filed as **L-129**, with **TD-060** for
  the absent check: nothing verifies that a `§N` reference resolves.
- **The sweep was 6 sites, not 15 files.** Inventorying first turned a plausible-sounding sweep into a
  small edit — 39 candidate sites classified as 6 restatements · 25 already-citations · 8
  legitimately-local. Four of the six *already cited* their section and restated it anyway, which is
  the case a citation-presence check cannot see.
- **A DoD frozen at promote was unsatisfiable as written** — its census came from summing eight
  overlapping greps (`~121`) when the real figure was 39. Caught at G2 by re-derivation before any
  task ran. Filed as **L-130**: a figure entering a frozen artifact is a query result and needs the
  same second-query treatment, at the moment it is written.

**EPIC-003 — The Standard: closed**, all five conditions met across SPRINT-069 · 070 · 071. Next in
the sequence is **EPIC-004 Conformance**, which builds the engine this spec was made checkable for.

---

## v1.44.0 — Attested (2026-08-16)

MINOR — SPRINT-070, **10 of 10 DoD**, EPIC-003's second member sprint. The top conformance level
becomes writable, and parallel dispatch stops handing every agent a stale copy of your repo.

**What changed for you**

- **The attestation format is specified — `spec/STANDARD.md` §13, spec `0.2.0`** ([ADR-025]). Three
  git trailers on the task's own commit (`Gate-Signed-By:` · `Gate:` · `Evidence:`), so gate approval
  travels with the commit and a reviewer with a clone can read it without opening your sprint file.
  You can adopt the format today.
- **§13 states plainly that an unsigned trailer is a claim, not proof.** Trailers are plain text;
  anyone who can write a commit can name anyone as approver. So **Attested is not reachable by
  trailers alone** — it needs commit signing. Emitting trailers over unsigned commits leaves you at
  **Gated** with more legible records, which is exactly where lean-flow itself sits. The worked
  example in §13 is a real commit from this repo shown in its true unsigned state rather than an
  invented signed one.
- **The trailer carries your *sprint-level* sign-off onto each covered commit — it does not require
  approving every task.** This corrects [ADR-018], which described git-native attestation as raising
  approval to per-task granularity. What you gain is verifiability, not more approvals; batch G1/G2
  stays viable and conformant.
- **Worktree-isolated subagents now branch from your current work, not your remote's default branch.**
  If you dispatch parallel tasks over commits you have not pushed, every agent used to get a tree
  missing them — silently, and identically, every run. `.claude/settings.json` now sets
  `worktree.baseRef: "head"`, and `dispatch.md` ships a **worktree-base guard** that halts a dispatch
  whose base is not current, naming what it found. **If you dispatch worktree agents and push
  infrequently, set `worktree.baseRef` in your own repo — the default is `"fresh"`.**
- **Know before you dispatch:** a task editing a file that exists only in unpushed commits still must
  not be worktree-dispatched under a `"fresh"` base — the merge becomes add/add. And a subagent
  worktree that finishes without changes is deleted *with its branch* the moment it returns, so any
  measurement you want from it belongs in the agent's brief, not in a check you run afterwards.

**Fixed** — the stale-base pin behind SPRINT-069's merge conflict, a task forced inline, and
union-verification on every merge (TD-054, open since SPRINT-063; the cause turned out to be
documented default behaviour, recorded in this repo since SPRINT-026).

[ADR-025]: docs/adr/ADR-025-git-native-attestation-format.md
[ADR-018]: docs/adr/ADR-018-standard-implementation-split.md

---


_Older releases (**v1.43.0** and earlier) → [`CHANGELOG-1.43.0.md`](docs/changelog/CHANGELOG-1.43.0.md) → [`CHANGELOG-1.42.0.md`](docs/changelog/CHANGELOG-1.42.0.md) → [`CHANGELOG-1.41.0.md`](docs/changelog/CHANGELOG-1.41.0.md) → [`CHANGELOG-1.40.0.md`](docs/changelog/CHANGELOG-1.40.0.md) → [`CHANGELOG-1.39.0.md`](docs/changelog/CHANGELOG-1.39.0.md) → [`CHANGELOG-1.38.0.md`](docs/changelog/CHANGELOG-1.38.0.md) → [`CHANGELOG-1.37.0.md`](docs/changelog/CHANGELOG-1.37.0.md) → [`CHANGELOG-1.36.0.md`](docs/changelog/CHANGELOG-1.36.0.md) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
