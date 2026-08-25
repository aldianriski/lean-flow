#!/bin/sh
# run-research-archive-fixtures.sh -- must-FAIL/must-PASS fixtures for
# scripts/lib/check-research-archive.sh, the checker qa-check.sh delegates STANDARD §11's research
# retention row to (SPRINT-055 T3, TASK-168).
#
# `close`'s compaction sweep said "superseded/duplicated research -> supersede note or archive" while
# §11 carried no research row, so the "or archive" half pointed nowhere. T3 resolved it. The rule is
# conservative on purpose: a superseded verdict is usually the WHY-trail for whatever replaced it, so
# it is archivable only once nothing live still points at it.
#
# The archived-still-cited case is the one T3's DoD names, and it is not hypothetical: applied to the
# live repo, the rule's verdict on the only superseded doc lean-flow has (behavioral-eval-feasibility)
# is LEAVE IT -- evals/README.md and graph-engineering.md both still cite it. A rule that fires zero
# times on real input can still be the correct rule, which is why both controls are retained.
#
# Retained, never deleted with the scaffolding that built them (L-058, TD-012's lesson).
# Dependency-free POSIX sh. Run bare: sh evals/run-research-archive-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-research-archive.sh"
fx="$here/fixtures/research-archive"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -d "$fx" ]      || { echo "FAIL harness: fixture dir not found at $fx"; exit 2; }

fail=0

# --- case 1: archived while a live ADR still cites it -> FAIL (the DoD's named case) -------------
run_case_anywhere "archived-still-cited" 1 \
  "is archived but still cited by docs/adr/ADR-900-built-on-research.md" -- \
  sh "$checker" "$fx/archived-still-cited"

# --- case 2: archived while still `status: current` -> FAIL --------------------------------------
# Archiving is gated on supersession, not on someone deciding a doc looks finished.
run_case_anywhere "archived-not-superseded" 1 \
  "is archived while status is 'current'" -- \
  sh "$checker" "$fx/archived-not-superseded"

# --- case 3: superseded, uncited, never moved -> FAIL ---------------------------------------------
# The retention leg silently not running -- how §11's epic row went five sprints without executing.
run_case_anywhere "superseded-uncited-lingering" 1 \
  "is superseded and cited by nothing live but still sits in docs/research/" -- \
  sh "$checker" "$fx/superseded-uncited-lingering"

# --- case 4: superseded + unreferenced + archived -> exit 0 (control) ----------------------------
run_case_anywhere "archived-clean" 0 \
  "archived correctly (superseded, no live citer)" -- \
  sh "$checker" "$fx/archived-clean"

# --- case 5: superseded but load-bearing -> exit 0 (control) -------------------------------------
# The live repo's own shape. Without cases 4 and 5 an unconditionally-FAILing checker would pass.
run_case_anywhere "superseded-cited-in-place" 0 \
  "superseded but still cited by docs/research/consumer.md -- correctly left in place" -- \
  sh "$checker" "$fx/superseded-cited-in-place"

# --- case 6: superseded, only a worktree copy "cites" it -> FAIL (TD-095's false-negative sibling) -
# The load-bearing case: a full repo checkout under `.claude/worktrees/agent-*/` is not a live citer.
# Before the fix, live_citer() matched the worktree copy's text and this incorrectly reported PASS
# ("still cited, correctly left in place") -- a SILENT false negative masking a doc that should have
# moved to archive/. After the fix it must FAIL.
run_case_anywhere "worktree-only-citer" 1 \
  "is superseded and cited by nothing live but still sits in docs/research/" -- \
  sh "$checker" "$fx/worktree-only-citer"

# --- case 7: superseded, cited from a path that merely CONTAINS "worktrees" -> exit 0 (must-PASS
# control, not a demolition) -------------------------------------------------------------------
# `docs/worktrees/notes.md` is a real, tracked citer -- not under `.claude/worktrees/`. Proves the
# exclusion is anchored to the exact path segment, not a bare substring: a substring-only exclusion
# would wrongly swallow this genuine citer too.
run_case_anywhere "worktree-lookalike-citer" 0 \
  "superseded but still cited by docs/worktrees/notes.md -- correctly left in place" -- \
  sh "$checker" "$fx/worktree-lookalike-citer"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "RESEARCH-ARCHIVE FIXTURES: all green"; else echo "RESEARCH-ARCHIVE FIXTURES: at least one FAIL"; fi
exit $fail
