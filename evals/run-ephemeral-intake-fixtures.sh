#!/bin/sh
# run-ephemeral-intake-fixtures.sh -- must-FAIL/must-PASS fixtures for
# scripts/lib/check-ephemeral-intake.sh (SPRINT-055 T4, TASK-169).
#
# §2 described a BUG report's CONTENT as "routed away at /triage" and said nothing about the FILE,
# listing it with no directory prefix while every sibling row carried one. Committed? Deleted?
# Archived? Nothing said. T4's ruling: it is temp-dir intake scaffolding like the working feature PRD,
# /handoff docs and council verdicts -- never committed, so once /triage routes its substance into a
# TASK/TD//diagnose brief there is nothing left to dispose of.
#
# That ruling is what makes "undisposed" checkable at all. Before it, the failure could not even be
# expressed; after it, a committed report IS the failure.
#
# Retained, never deleted with the scaffolding that built them (L-058, TD-012's lesson).
# Dependency-free POSIX sh. Run bare: sh evals/run-ephemeral-intake-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-ephemeral-intake.sh"
fx="$here/fixtures/ephemeral-intake"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -d "$fx" ]      || { echo "FAIL harness: fixture dir not found at $fx"; exit 2; }

fail=0

# --- case 1: a BUG report committed into the repo -> FAIL ----------------------------------------
run_case_anywhere "committed-bug" 1 \
  "docs/BUG-stale-pointer.md is a committed BUG report" -- \
  sh "$checker" "$fx/committed-bug"

# --- case 2: clean tree, template present -> exit 0 (control) ------------------------------------
# The control carries a BUG.md.template on purpose: the blank form is a legitimate committed file and
# a checker that confused it with a report would fail every repo that ships the template -- which is
# every consumer of this plugin.
run_case_anywhere "clean" 0 \
  "no committed BUG-*.md reports" -- \
  sh "$checker" "$fx/clean"

# --- case 3: a BUG report inside a simulated agent worktree checkout -> exit 0 (TD-095) -----------
# `.claude/worktrees/agent-fake123/docs/BUG-ghost.md` simulates the dispatch protocol's own worktree
# copies, the shape SPRINT-086's under-load run tripped on (5 of 7 FAILs were fixture files inside
# `.claude/worktrees/agent-*`, none of which is repo content). Retained so the exclusion this checker
# now applies never regresses silently.
run_case_anywhere "worktree-excluded" 0 \
  "no committed BUG-*.md reports" -- \
  sh "$checker" "$fx/worktree-excluded"

# --- case 4: a BUG report at a path that merely CONTAINS "worktrees" -> exit 1 (must-FAIL control) -
# `docs/worktrees/BUG-real.md` is NOT under `.claude/worktrees/` -- it is a real, tracked path that
# happens to share the substring. This is the load-bearing DoD-2 case: a substring-only exclusion
# would wrongly swallow this finding; the anchored `^\.claude/worktrees/` exclusion must not.
run_case_anywhere "worktree-lookalike" 1 \
  "docs/worktrees/BUG-real.md is a committed BUG report" -- \
  sh "$checker" "$fx/worktree-lookalike"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "EPHEMERAL-INTAKE FIXTURES: all green"; else echo "EPHEMERAL-INTAKE FIXTURES: at least one FAIL"; fi
exit $fail
