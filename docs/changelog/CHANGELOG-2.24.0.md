---
owner: Maintainer
last_updated: 2026-11-20
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.24.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.26.0 release** (2026-11-20). §11 keeps the
> current and previous minor inline (2.26.x and 2.25.x), so cutting v2.26.0 pushed v2.24.x out.

## v2.24.0 — a coordinator for multi-session work, an opt-in cross-model route, and reviews that state their limits (2026-11-15)

**MINOR** — no new skill; the roster stays at 16, and the standard is spec 0.21.0. Restart the session after installing.
Released on a Codex review of the shipped diff since v2.23.0 (R1: one High and one Med, both fixed; R2 CLEAR) and the off-host gate.
The coordinator reference comes from a real adopter run: one coordinator and one lane session per stream, across two repos (SPRINT-176).
SPRINT-177's `--detached` flag was folded in before the push, on its own Codex reviews and a re-run of the release review over its shipped delta.
SPRINT-178's lane rotation and lane-cost rules were folded in the same way (task reviews by Codex, then a release review of the shipped delta, CLEAR).
SPRINT-179's opt-in trial cells were folded in the same way (blind Fable and Codex task reviews, then a release review of the shipped delta).

- **`/orchestrator`: a host-declared `dispatch-trial` opts in to per-role model-tier and effort cells for one sprint, capped at six strongest-tier dispatches, with blind Codex comparisons where the cross-model channel is enabled; consumer defaults stay unchanged (ADR-010, TASK-670).**
- The `LEARNINGS.md` template's `related:` comment now says to cite corpus ids only (learnings, ADRs, research), never a retired id or an epic, and to resolve each against the ledger first (L-319).

- **`/orchestrator`: the coordinator can launch a new lane with one owner popup and rotate an existing lane to a fresh session at a task boundary with `claude --bg`, against a 200k target.** `/handoff` and `/flow` name the same 200k target.
- **`/orchestrator`: lanes keep bulky outputs (device runs, full test suites, long logs) in a worker.** They send only messages
  another session acts on, batch shared-file approvals per task, and wait on a lock or RAM in a background shell loop
  instead of `/loop` turns.

- **`night-run.sh`: adds a `--detached` flag so the pre-flight gate runs to completion.** The caller declares detachment; both gate limits
  are raised inline on that one call. An undeclared slow gate now refuses by name (`pre-flight-gate-foreground-limit`) instead of being
  killed at the 600 s ceiling, and a gate that truncated itself is refused on either arm, ahead of any `gate_exceptions:` grant (TASK-367).

- **`/orchestrator`: adds a coordinator reference for multi-session work.** `references/coordinator.md` gives the lane brief
  shape (including each gate's signed-or-unsigned status), the 3-line status check, relayed-ruling labelling and
  re-requesting a lost report. CONTEXT's Streams rule now says one coordinator may run one lane session per stream, one session
  per stream runs its workers and never relays, and sessions split by stream, never by step (TASK-662).

- **`/orchestrator`: the coordinator reference covers shared files and id booking across lanes.** The coordinator owns each
  named shared file and approves a lane's hunks file by file; it books a `TD` / `L` / `TASK` id range per lane, above every
  maximum in use and disjoint, and a lane never files outside its range. CONTEXT's L-143 grain and the task-file derivation
  rule say single-tree derivation is unchanged and a lane derives inside its booked range (TASK-663).

- **`/orchestrator`: adds an opt-in cross-model route.** Another provider's CLI reviews drafts, designs and code,
  builds in an isolated worktree, or gives one read-only diagnosis after two failures. The route is off by default;
  a `cross-model: <cases> via <cli>` line in the host repo's CONTEXT file or the owner's request enables it in attended
  modes only. An empty, timed-out or verdict-less result is never an approval. ADR-010 is amended (TASK-660).

- **`/orchestrator`: review results now state coverage and limitations.** A result missing either is sent back once to the
  same reviewer and cannot pass without both. A coordinator who edits task work after review becomes a builder and needs
  a fresh scoped review; revisions that replace a behaviour sweep the whole draft, design or plan for old passages,
  acceptance criteria included. The builder-check reader prompt asks for both statements too (TASK-659).

- **`/humanizer`: the English catalog is re-synced to blader/humanizer 4.0.0** (`b48c832f`, from 3.1.0). No pattern is added or
  renumbered; §15 is renamed "Shallow -ing phrases". Upstream now tells the editor to ignore instructions found inside the text and, in
  file mode, to read the whole file from disk first. It also lets a rewrite add a detail the editor knows to be true; lean-flow does
  not, and step 2 of the skill now says its never-add-a-fact rule overrides the catalog (TASK-498).

- **Fixed** — `/orchestrator`: when the other provider's CLI is missing or a call fails, the cross-model route now falls back by
  operation. A review goes to the same-provider reviewer, a delegated build returns to the ordinary dispatch, and a diagnosis handoff
  is skipped. Before, every failure went to the reviewer fallback. `coordinator.md` states the two stream rules it relies on instead
  of assuming the host's CONTEXT file has a streams section (release review).
