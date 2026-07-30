`listing.txt` is a canned `git worktree list --porcelain` listing, not a real worktree. A real one
can't be created to build this fixture — that would mean running `git worktree add` inside lean-flow's
own tree to manufacture a test condition, which is the exact hazard this file's parent (`night-run.md`)
warns unattended runs about (a git-state operation reaching work nobody meant to touch).

The probe's listing-file argument is a fixture seam for exactly this: same data shape a real
`git worktree list --porcelain` call would produce, fed in from a file instead of a live command, so
the `leftover-worktrees` decision leg can be asserted deterministically without ever creating or
removing a worktree.
