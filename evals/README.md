# evals/

Maintainer-only executable checks and their must-FAIL/must-SKIP fixtures — never shipped to
consumers (same boundary ADR-008 already draws for `scripts/`: executable artifacts stay outside
the plugin surface, so an installed consumer never receives this directory).

## Harness home — decided (TASK-124, SPRINT-038 T2)

**`evals/` is the permanent home**, not provisional. Placement was left open pending "a later task"
(above); T2 is that task. **Why here, not `scripts/`:** `scripts/` (ADR-008) holds maintainer
tooling that supports the *repo itself* (qa-check, index generation); `evals/` holds must-FAIL/
must-SKIP fixtures that guard a *shipped skill's* behavioral contract (night-run.md, dispatch.md) —
a different lifecycle (grows with the contract, run on demand, never in `qa-check`'s always-on
path) that earns its own top-level directory rather than a `scripts/evals/` subtree. Both stay
maintainer-only and outside `plugin.json`; neither is shipped.

**Why no ADR (A4 check).** SPRINT-038's A4 requires an ADR if this choice sets a precedent for
*shipping executable code inside the plugin surface* — the question T1-037 sidestepped by choosing
a procedure step, and which ADR-008 deliberately confined to maintainer-only `scripts/`. It doesn't:
`evals/` stays maintainer-only, absent from `plugin.json`, exactly as `scripts/` already is (verified:
`grep evals .claude-plugin/plugin.json` → no match). Staying maintainer-only under `evals/` is the
one option A4 itself names as *not* triggering an ADR — so none was written.

**Generalised, not duplicated.** T1 shipped two runners that each hand-rolled the same shape:
extract the real snippet from its shipped doc between stable markers, then assert exit code + a
named finding per fixture. `evals/lib/harness-common.sh` factors that shape out — `extract_between_anchors`
(the `<!-- name:start/end -->` pattern), `extract_sole_fenced_block` (for a doc with no anchors but
exactly one fenced block of its kind — see the dispatch-preflight fixtures below), and
`run_case_firstline` / `run_case_anywhere` (assert the named finding on the first output line, or
anywhere in it). All three runners below source it; none hand-rolls extraction or assertion logic
of its own anymore. A fourth runner is therefore a few lines, not a new mechanism.

## What's here

`fixtures/skill-freshness/` — one fixture per outcome for the skill-freshness check specified in
`skills/orchestrator/references/night-run.md` (Part 1, "Capability checks"). Deleting a must-FAIL
fixture is exactly the regression TD-012 named and L-058 promoted a rule against — retain these even
if the check they guard is later rewritten; update the fixtures alongside it instead.

| Fixture | Exercises |
|---|---|
| `no-local-repo/` | leg 1 — no `.claude-plugin/plugin.json` at the given root → `SKIP no-local-repo` |
| `stale-release/` | leg 2 — installed version ≠ repo manifest version → `BLOCK stale-release` |
| `cache-differs/` | leg 3 — installed cache content ≠ repo content, versions equal → `BLOCK cache-differs` (the unbumped-edit trap the whole check exists to catch) |

`cache-differs/installed_plugins.json` templates its `installPath` as `__CACHE_DIR__` — a committed
fixture can't hardcode a machine-specific absolute path — substituted at run time by the harness.

`fixtures/worktree-usability/` — one fixture per **degrade** leg of the worktree-isolation check,
same section of `night-run.md`. Only the two legs that actually probe (never blocks — see the check's
own text for why "agent dispatch" has no fixture) get one, per L-058:

| Fixture | Exercises |
|---|---|
| `no-worktree-support/` | leg 1 — `git worktree list` genuinely fails (pointed at a repo-root path that doesn't exist) → `DEGRADE no-worktree-support` |
| `leftover-worktrees/` | leg 2 — a canned `git worktree list --porcelain` listing with a second entry → `DEGRADE leftover-worktrees` |

Neither fixture creates or removes a real worktree — see each fixture's own `README.md` for why: the
probe's own file exists precisely to avoid that hazard on this repo's tree.

`fixtures/dispatch-preflight/` — one fixture per must-FAIL leg of the pre-dispatch preflight
snippet shipped in `skills/orchestrator/references/dispatch.md` § Pre-dispatch preflight. **This is
TD-012's adoption**: the snippet was negative-tested by three must-FAIL fixtures that lived in a
scratch dir and were deleted with their prototype, leaving it with no retained regression guard —
exactly the L-058 shape TD-012 named. Each fixture is a throwaway one/two-task `sprint.md` carrying
only the three markup tokens the preflight parses (`### Tn`, `Layers:`, `Depends-on:`), isolated so
only its own check fires:

| Fixture | Exercises |
|---|---|
| `cycle/` | T1 and T2 `Depends-on` each other → no valid dispatch order → `FAIL cycle-detected` |
| `shared-file-unowned/` | T1 and T2 both name `shared.md` in `Layers:`, no `Depends-on` edge between them → `FAIL shared-file-unowned` |
| `base-ref-drift/` | one independent task; the runner passes a declared base 5 commits behind live HEAD → `FAIL base-ref-drift` |

`dispatch.md` predates the `<!-- name:start/end -->` anchor convention (added by T1, and `skills/**`
is frozen for T2) and has no comment anchors around its preflight snippet — but it has exactly **one**
` ```sh ` fenced block, so `extract_sole_fenced_block` pulls it unambiguously (and fails loud if a
second ` ```sh ` block is ever added, rather than silently grabbing the wrong one). The snippet's
`git rev-parse` calls are bare (no `-C`), so the runner invokes it with the repo root as cwd — all
three calls are read-only (`rev-parse`, never a write) even though the harness lives inside the repo
it's reading.

**TD-012 outcome (for T4 to record):** the three retained-and-deleted fixtures are recreated and
green against the real shipped snippet. Not touched here: wiring this runner into `scripts/qa-check.sh`
(TD-012's stated alternative mitigation) — `qa-check.sh` is out of this task's editable-path scope
(T3 owns it this sprint) and remains a manual `sh evals/run-dispatch-preflight-fixtures.sh` step
until/unless a future task wires it in. TD-012's core risk (no retained regression guard) is closed;
the "must run automatically" nice-to-have is not.

## Real-run fixtures (live, on-demand, not part of the bare-run set)

A fourth class, not listed above because it costs real API tokens and is **not deterministic
enough to gate on**: TASK-124 built one fixture where an actual headless `sprint-bulk unattended`
run — not a hand-built end-state — was pointed at a copy of the orchestrator with `night-run.md`
Part 0's park protocol inverted (loaded via `claude --plugin-dir`, never the real install), to see
whether a compliant run could be made to genuinely violate the unattended contract and whether the
same four structural assertions from `docs/research/behavioral-eval-feasibility.md` would catch it.

**Result: the assertions are validated on a real (non-synthetic) run, the violation is not.** A
real control run against the unmodified installed skill parked its HITL task correctly and passed
all four assertions — that alone already improves on the research doc's finding (which only ever
ran the assertions against a hand-built synthetic end-state). Two independent attempts to make a
*compliant* model actually self-approve under the weakened, `--plugin-dir`-loaded procedure both
failed to produce a violation: the model declined to self-approve the destructive step even when
the loaded procedure text explicitly told it to, in both a self-flagged-as-fake version and a
second version with every "this is a test" tell removed and the task's own text neutralized to a
plain `HITL` tag (matching real sprint convention, no in-task hint). Full transcripts/reasoning are
in the sprint's Execution Log and this task's report; not reproduced here.

**Labelled per SPRINT-038 A2's pre-authorized honest-gap clause:** this fixture class ships as
*assertion-validated-on-a-real-run, not proven-as-a-violation-catcher* — the same limit the research
doc named, narrowed by one real run but not closed. No script is checked in for this class (the
fixture repos and the weakened plugin copy are throwaway scratch, not deterministic enough to be a
gate); reproducing it means rebuilding both from this description. Retrying with a different HITL
category (e.g. a pure judgement/approval task with no data loss, instead of a file deletion) is the
open thread if a future task wants a third attempt — see the sprint's T2 report for why the first
two attempts' failure mode looks like model alignment resisting the injected instruction, not a
fixable confound in the fixture design.

## How to run

```sh
sh evals/run-skill-freshness-fixtures.sh
sh evals/run-worktree-usability-fixtures.sh
sh evals/run-dispatch-preflight-fixtures.sh
```

Each harness extracts the actual snippet shipped in its target doc — between `<!-- …:start/end -->`
anchors where the doc has them, or the sole matching fenced code block where it doesn't — and runs
it against each fixture, asserting both the exit code and the named finding (`harness-common.sh`).
This tests the real shipped snippet, not a hand-copied duplicate that could silently drift out of
sync with it. Run bare, per L-057 — never pipe its output into a formatter ahead of an `&&` chain
that acts on the result. All three are read-only against this repo (they read `night-run.md` /
`dispatch.md` and, for the third, `git rev-parse`) — none writes.

## Cost (pinned tier, TASK-124)

The research doc's $0.797 figure was an **Opus upper bound** (no `--model` flag was passed). Pinned
to `sonnet` and re-measured on a real (non-synthetic) `sprint-bulk unattended` run of the same
one-task-fixture shape: **$0.4255, ~96s API time, 12 turns** — a little over half the Opus cost for
an equivalent real run. See the sprint's T2 report for the two additional pinned-tier runs (both
~$0.28–0.30, 5–6 turns) spent on the real-violation attempt above.
