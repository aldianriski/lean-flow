# evals/

Maintainer-only executable checks and their must-FAIL/must-SKIP fixtures — never shipped to
consumers (same boundary ADR-008 already draws for `scripts/`: executable artifacts stay outside
the plugin surface, so an installed consumer never receives this directory).

**Placement is provisional.** This directory holds the first fixture set; a later task decides the
eval-harness home for lean-flow generally and may relocate this content. Nothing here is wired into
`plugin.json` or any skill's runtime path.

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

## How to run

```sh
sh evals/run-skill-freshness-fixtures.sh
sh evals/run-worktree-usability-fixtures.sh
```

Each harness extracts the actual snippet shipped between its check's `<!-- …:start/end -->` anchors
in `night-run.md` and runs it against each fixture, asserting both the exit code and the named
finding on its first output line. This tests the real shipped snippet, not a hand-copied duplicate
that could silently drift out of sync with it. Run bare, per L-057 — never pipe its output into a
formatter ahead of an `&&` chain that acts on the result.
