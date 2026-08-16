---
sprint: 070
slug: attested
owner: Maintainer
last_updated: 2026-08-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-070 — Execution Log

> Append-only companion to [`../SPRINT-070-attested.md`](../SPRINT-070-attested.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-16 | progress | G1+G2 signed @ `cac204b`; assumptions re-derived rather than trusted

Batch G1 ran the **full** checklist for both tasks, not the fast path: the Plan's `### Tn` entries
carry no `origin:` field, and a missing origin is treated as ungrilled by rule. Both `M`, both HITL,
no `L` to split. G2 confirmed D3's file-disjointness against the actual `Layers:` — T1 is `spec/` +
`docs/`, T2 is `skills/orchestrator/references/dispatch.md` + `evals/`, no shared file, no
`Depends-on:` edge.

A1 · A2 · A3 · A5 re-derived and hold. **A2 re-measured at execution as its own text instructs
(L-097):** `%G?` = `N` on 20 of 20 recent commits — this repo signs nothing, so T1's worked example
must demonstrate the unsigned case honestly rather than illustrate a signature that does not exist.

**A4 carries one stale figure, reported not silently corrected:** it states `TODO.md 178/320`; the
file is **118** lines, at HEAD *and* at `plan_commit` `76eb88a`, so the figure was never right rather
than having drifted. The assumption's *conclusion* — no cap blocks — is unaffected, and both the
`CLAUDE.md 63/80` and `CONTEXT.md 132/150` legs reconcile exactly. Recorded because a stated figure
that nobody re-derives is how L-088 sprints close green against numbers no one re-agreed to.

### 2026-08-16 | surprise | T2's mechanism was already in the repo — L-046, six sprints before TD-054 asked

TD-054 has been held open since SPRINT-063 on one question — *why* does a dispatched worktree branch
from a stale sha when the session is current — and its own text forbids writing the guard until that
cause is understood (L-091). The cause is **measured and confirmed**: `origin/main` is `622f420`,
which is exactly the sha all four worktrees across SPRINT-068 and SPRINT-069 pinned to, while local
`main` sits **31 commits ahead and unpushed**. Agent worktrees fork from the **remote default
branch**, not local HEAD. Nothing pinned them; `origin/main` simply stood still because push is
owner-reserved here.

The surprise is not the mechanism, it is where it was: **`L-046` (SPRINT-026, `status: active`)
states it verbatim**, and `dispatch.md` line 327 already carries it as the "base-ref caveat" —
inside the very file T2 was promoted to edit. Two independent records, both in context, and the
question stayed open for six sprints across three aging re-reviews. TD-054's cost accounting from
SPRINT-069 (a merge conflict, a task forced inline, union-verification on every merge) was paid
against an answer the repo already held. This is a candidate learning, not just a finding.

### 2026-08-16 | surprise | worktree dispatch is disqualified for this sprint; D3's order-indifference does not hold

Consequence of the above, established before any dispatch rather than at merge-back.
`spec/STANDARD.md`, `spec/CHANGELOG.md` and `ADR-024` are **absent at `origin/main`** — they were
created in SPRINT-069, which is inside the unpushed 31. T1 edits files that exist only in unpushed
commits, which `dispatch.md`'s own corollary forbids worktree-dispatching (the merge becomes add/add
on the task's primary file).

D3 pre-locked T1 and T2 as file-disjoint with "no ordering constraint". File-disjoint holds; **order-
indifferent does not** — T2's cure is the thing that would make T1 dispatchable at all. Not logged as
a `scope-change`: no scope moved, and the Plan is untouched. **Owner ruling at G2: both tasks run
inline, T2 first**, and T2's cure is the root-cause fix (`worktree.baseRef: "head"`) *plus* the
halting guard, per TD-054's own framing — the assertion catches it, the pin is the thing to fix.

Also observed, not acted on: two leftover branches `worktree-agent-a756b5b9e735387c6` and
`worktree-agent-af7c31821869c7fd1` with no registered worktrees. `dispatch.md`'s pre-dispatch
guardrail (harness issue #51596) says clean these before any dispatch.

### 2026-08-16 | progress | T2 — `Layers:` corrected to add `scripts/qa-check.sh` (L-100, not a scope-change)

The gate found it, which is the point of running it before the commit rather than after:
`FAIL layers observed: … changed but undeclared in any task's Layers:: scripts/qa-check.sh`. T2
declared `dispatch.md · evals/` at promote, and a `Layers:` written before the work cannot name the
file the work turns out to need — the new harness has to be registered in `qa-check.sh`'s
`eval_harnesses_optin` or its own completeness leg reports it as silently un-gated. Declared,
logged, continuing; **not** filed as a `scope-change`, because no scope moved (L-100: a mid-sprint
`Layers:` edit is the expected cost of declaring before the work, not a pivot to re-confirm at G2).

`.claude/settings.json` also changed and the gate did **not** flag it. Checked rather than assumed:
`check-layers-observed.sh` line 208 excludes both settings files by name, so the silence is by
design. Declaring it anyway, since the overlap map reads `Layers:` and a file this task really does
edit should appear there.

### 2026-08-16 | progress | T2 — cause, cure and guard land; 3 of 4 DoD ticked

**Cause (DoD 1), and it is not a bug.** `worktree.baseRef` defaults to `"fresh"`, which branches a
worktree from `origin/HEAD`. Verified against the official worktrees documentation rather than
inferred from our own logs: *"Subagent worktrees use the same base branch as `--worktree`, so they
branch from your repository's default branch unless `worktree.baseRef` is set to `"head"`."* So the
pin is documented default behaviour meeting a repo that pushes deliberately — `origin/main` stands
still, every agent gets the same sha, and it looks like an inexplicable pin until you resolve
`origin/HEAD`. Two details neither L-046 nor `dispatch.md` had, now written down: on a `"fresh"`
base `origin/HEAD` is refreshed by a ≤5s fetch if stale >24h (so "current" means current *to the
remote*), and with no remote — or an unfetchable `origin/HEAD` — it silently falls back to local
HEAD, meaning the same setting yields opposite bases in two repos.

**Cure.** `worktree.baseRef: "head"` in `.claude/settings.json`, which removes the pin at its cause,
*plus* the guard — the setting is per-repo, absent in a fresh clone, and one deleted key from
reverting. `git push` was considered and rejected in the doc text: it makes the base current exactly
once and re-breaks on the next unpushed commit.

**Guard (DoD 3).** New `### Worktree-base guard` in `dispatch.md`, extracted by anchor and exercised
by `evals/run-worktree-base-fixtures.sh` — one case per named finding, six findings:
`worktree-base-unresolved` · `-missing` · `-unreadable` · `-stale` · `-divergent` · plus a PASS
control. Two design points worth recording: the guard resolves the *coordinator* ref first, so a
broken invocation reports itself instead of masquerading as drift (L-091), and the `stale` arm counts
distance only when the worktree's base is an actual ancestor — across unrelated roots `rev-list
--count` returns a number that reads like a distance and means nothing, so that case reports
`divergent` and `do not merge` instead.

**The fixtures were proven to bite, not just to pass.** Ticking a must-FAIL suite because it is green
is the false-negative L-058 is about, so the guard's comparison was deliberately inverted
(`!=` → `=`) and the suite re-run: 4 of 7 assertions went red, including the TD-054 case and the PASS
control. Restored and re-verified green. A suite that stays green under an inverted comparison would
have been decoration.

**DoD 4.** The preflight's base-ref item now states what it does *not* cover — it compares the
declared base to live HEAD in the main checkout and is silent about any worktree — and points at the
guard. Its own leg still passes: all 10 `run-dispatch-preflight-fixtures.sh` cases green, including
`base-ref-drift`, after the runner was retrofitted from `extract_sole_fenced_block` to
`extract_between_anchors` (the second ```sh block is exactly the case that helper fails loud on).

Gate: **144 pass / 0 fail**, identical to the pre-task baseline; **150 / 0** under `QA_FULL=1`, where
`PASS eval harness run-worktree-base-fixtures.sh` confirms the new harness is wired and firing rather
than merely present. Tier is opt-in per `qa-check.sh`'s declared rule (cheap-and-git-free stays
always-on; git-repo-building stays opt-in) — recorded in the runner header as a rule the guard
*loses* to, since its own defect went six sprints unnoticed, and revisitable if it ever gains a
git-free leg.

**DoD 2 remains open** — it requires a *real* dispatched worktree with its base recorded, which needs
one `Agent(isolation: "worktree")` spawn. Raised to the owner rather than substituted: a hand-made
`git worktree add` would exercise git, not the harness path whose default is the entire defect.

### 2026-08-16 | progress | T2 DoD 2 — the cure proven on a real dispatch; T2 complete at 4 of 4

Owner approved one worktree spawn for the demonstration. Coordinator HEAD recorded **before** the
spawn, so the comparison could not be fitted to the result afterwards:
`97eca0b10af4c22a79780d1947afe123a831f44f`, with `origin/main` at `622f4201…` — 31 commits behind and
the sha every previous dispatch had pinned to.

The dispatched agent reported, from inside its own tree:

```
git rev-parse HEAD          -> 97eca0b10af4c22a79780d1947afe123a831f44f
git rev-parse --abbrev-ref  -> worktree-agent-a0750e8c1b2437a6d
pwd                         -> /d/Project/lean-flow/.claude/worktrees/agent-a0750e8c1b2437a6d
ls spec/                    -> CHANGELOG.md  STANDARD.md
ADR-024 present?            -> yes
```

**The worktree's HEAD is the coordinator's HEAD exactly**, so DoD 2's stated verify — merge-base
equals coordinator HEAD at spawn — holds by identity rather than by common ancestry, which is the
stronger of the two. Stated precisely because `git merge-base` was **not** run: see the sweep note
below. The corroborating evidence is independent of any sha comparison and is what makes this
unfakeable — `spec/` and `ADR-024` **exist in the agent's tree**, and both are absent at
`origin/main`. Under the old `"fresh"` default this dispatch would have landed on `622f420` with no
`spec/` directory at all, which is precisely what disqualified T1 from worktree dispatch at G2.

Also learned, and worth more than the tick: **the setting took effect without a session restart.**
`.claude/settings.json` was edited during this same session and the very next spawn honoured it — so
`worktree.baseRef` is not subject to the stale-session trap that L-021 describes for plugin skills.

**Surprise, now written into `dispatch.md`: the evidence destroys itself.** The plan was to run the
new guard against the live worktree. By the time the agent's report arrived, the worktree *and its
branch* were both gone — a subagent worktree that finishes without changes is removed automatically,
branch included. `git worktree list` showed only the main checkout and the branch ref did not
resolve, so there was nothing left to point the guard at. A read-only measurement agent leaves no
changes by construction, which makes it the *most* likely to be swept before it can be inspected.
The protocol now says to put `git rev-parse HEAD` in the agent's brief and run the guard while the
agent is live. This is the same class as L-057 — the report is not the artifact — with the twist that
here the artifact is deleted by design, so the report is the only thing that ever existed.

Consequence for the DoD, stated rather than glossed: the guard was exercised end-to-end against
retained fixtures (7 assertions, defect-seeded), and the *base* was captured from a real dispatch.
The guard was not run against this particular live worktree. Both halves of the DoD are met; the
combination that was not achieved is a single command's timing, and the fix for it is in the doc.
