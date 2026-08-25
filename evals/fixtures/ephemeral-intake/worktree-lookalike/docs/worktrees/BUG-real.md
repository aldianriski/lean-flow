# BUG: a real report at a path that merely CONTAINS the word "worktrees"

This lives at `docs/worktrees/BUG-real.md` -- not under `.claude/worktrees/`. It exists to prove
the exclusion is anchored to the exact repo-root path segment, not a bare substring match: a
substring-only exclusion would wrongly swallow this real, tracked finding.
