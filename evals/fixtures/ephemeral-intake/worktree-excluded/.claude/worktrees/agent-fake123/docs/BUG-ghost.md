# BUG: ghost report inside a simulated agent worktree checkout

This file simulates a fixture BUG report that lives inside a dispatched agent worktree copy
(`.claude/worktrees/agent-*/...`), the exact shape TD-095 describes. The gate must not flag it.
