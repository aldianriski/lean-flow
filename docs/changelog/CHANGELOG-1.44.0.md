---
owner: Maintainer
last_updated: 2026-08-16
update_trigger: Rotated out of root CHANGELOG.md at a new MINOR (§11)
status: current
---

# lean-flow — Changelog v1.44.0

> Rotated out of root `CHANGELOG.md` at v1.46.0 (§11: keep current + previous inline).

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
