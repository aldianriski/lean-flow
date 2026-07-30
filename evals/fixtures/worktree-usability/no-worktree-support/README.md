No fixture tree lives here on purpose. This leg exercises `git worktree list` genuinely failing —
which the harness triggers by pointing `check-worktree-usability.sh` at a repo-root path that does
not exist (`no-worktree-support/does-not-exist`), the same way `evals/fixtures/skill-freshness/
no-local-repo/` stands in for "nothing to find" rather than committing an empty directory tree.

A real non-repo directory can't be committed *inside* this repo to test the "not a git working tree"
case — any path under `evals/` is still inside lean-flow's own `.git`. Pointing at a path that doesn't
exist at all triggers the same code path (`git -C <path> worktree list` fails, non-zero exit) without
that problem, and without ever running a git write to manufacture the condition.
