---
sprint: 046
slug: permission-surface
owner: Maintainer
last_updated: 2026-08-01
status: active
plan_commit: 3459149
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-046 — Permission Surface

> **Theme:** SPRINT-045's run produced a finding worth more than its Plan: the permission surface
> **narrowed mid-session**, denying command forms that had succeeded an hour earlier — seen
> independently by the coordinator and a dispatched agent. If that is real, then allowlist derivation,
> a static exercise done once at pre-flight, is necessary but not sufficient for a long run. Nobody has
> pinned the mechanism, so this sprint measures before it defends. The one fix it carries is the one
> whose cause is already known.

## Scope

**In:** establishing what actually governs command denial in a headless session — the mid-session
effect and which rule forms genuinely match, both tested rather than inferred (T1) · excluding in-repo
agent worktree paths from the observed-layers check, whose cause is known and whose fix is one entry
(T2).

**Out (deferred):** **any mitigation for TD-027/TD-028** — that is the entire point of T1, and shipping
guidance before the mechanism is pinned is what produced TD-024's two wrong diagnoses and a `pwd -W`
sweep nearly applied to a phantom · **TD-029** (launcher liveness vs buffered output) — cause known,
fix clear, simply not this sprint · **TD-031** (the exclusion list's design question) — deliberately
filed rather than solved; its trigger is a sixth exclusion or the first that fails L-082's test ·
running this sprint unattended (D2).

## Plan

### T1 — Establish what governs command denial in a headless run `[size: M · risk: low · class: execution · AFK]`
Layers: `docs/research/headless-permission-surface.md` · `skills/orchestrator/references/night-run.md`
Depends-on: none

TD-027 · TD-028. Two unknowns that share one experiment. SPRINT-045 recorded `awk … > file` and
`sh <path>` denied *after* those exact forms had already succeeded in the same session, and separately
found that `Bash(sh evals/:*)` — a directory-prefix rule — never matched while the exact-file form did.
Both are currently anecdotes with a plausible story attached, which is the state TD-024 was in twice
before it was root-caused.

**Acceptance:** a research note that answers each question with evidence, or explicitly records it as
not established — and ships **no** mitigation either way.

**DoD:**
- [ ] Mid-session effect probed by **replaying a fixed known-good command form at intervals** inside one
      headless session, recording turn index and elapsed time at each attempt
- [ ] Rule forms tested **one at a time** — exact-file, directory prefix, glob, bare command — so a
      result attaches to a single variable rather than a bundle
- [ ] Every claim carries the observation behind it; anything the probe fails to establish is **named as
      not established**, never softened into a likely story (TD-024 was filed twice on plausible stories)
- [ ] If the effect does not reproduce in one session, the note **says so** rather than extrapolating
      from SPRINT-045's single observation
- [ ] **No mitigation, no guidance change**, unless a form finding is conclusive — in which case it may
      update the derivation guidance and nothing else
- [ ] Probe cost recorded, so the next investigation knows what this class of question costs
<!-- QA: this is research, not a gate — the deliverable is a defensible answer, and "not established"
     is a valid one. The failure mode here is a confident conclusion, not an absent one. -->

### T2 — Exclude agent worktree paths from the observed-layers check `[size: S · risk: low · class: execution · AFK]`
Layers: `scripts/lib/check-layers-observed.sh` · `evals/run-layers-observed-fixtures.sh`
Depends-on: none

TD-030. Worktree dispatch creates agent worktrees inside the repo, and the observed check counts those
paths as changed-but-undeclared — so every fan-out turns the post-merge gate red for reasons unrelated
to the work. Transient (it clears at prune) but guaranteed, which is the same cry-wolf shape TD-026
just fixed.

**Acceptance:** a run with live agent worktrees reports no undeclared finding for those paths, while a
genuinely undeclared file elsewhere still FAILs by name.

**DoD:**
- [ ] In-repo agent worktree paths no longer counted as undeclared
- [ ] The reason is stated **inline** with the other exclusions — never a silent skip entry
- [ ] **Negative-tested, fixture retained** (L-058): a genuinely undeclared file outside those paths
      still FAILs by name. An exclusion that swallowed the real case would satisfy the acceptance and
      hollow out the guard — which is the only way this task can go wrong
- [ ] L-082's test applied and recorded: this entry is added because no task *can* declare a path the
      dispatch protocol creates, not because it makes a commit convenient

## Owner-action checklist
- [ ] `git push` after close — owner-reserved, always.

## Decisions (pre-locked)

- **D1** — **`TECH-DEBT.md` is coordinator-owned at close**, as in the last three sprints: both tasks
  would otherwise mark their own `TD-NNN` and serialise on the ledger for no benefit.
- **D2** — **This sprint runs interactively, not unattended.** T1 *is* an investigation into headless
  behaviour, so running it inside the thing it measures would confound the result — and its probe needs
  to fire and observe sessions, which a session cannot cleanly do to itself.
- **D3** — **T1 ships no mitigation.** Recorded as a decision rather than left to judgement, because the
  pull toward "while we're here, let's also fix it" is exactly what TD-024's history warns about. A
  conclusive *form* finding may update derivation guidance; nothing else.
- **D4** — **"Not established" is a successful outcome for T1.** The failure mode for research is a
  confident wrong answer, not an absent one.

## Assumptions

- **A1** — The mid-session effect is observable within a single headless session; SPRINT-045 saw it by
  turn 25. *Confirm: T1's reproduce-or-say-so DoD line.*
- **A2** — Rule-form behaviour is deterministic enough that one-at-a-time testing attributes a result to
  a single variable. *Confirm: T1's one-form-at-a-time DoD line — if results are inconsistent, that is
  itself a finding worth more than a clean table.*
- **A3** — The agent-worktree path prefix is stable. *Confirm: T2's assumption line — if dispatch later
  moves worktrees out of the repo, the exclusion becomes dead code, not wrong code.*

## Execution Log

<!-- Append-only, dated. The Plan is frozen at promote — log here rather than editing § Plan.
     Keep entries short: a finding's durable home is TECH-DEBT / LEARNINGS / CHANGELOG. -->

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->
