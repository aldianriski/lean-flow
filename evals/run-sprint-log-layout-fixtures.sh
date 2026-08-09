#!/bin/sh
# run-sprint-log-layout-fixtures.sh -- guards ADR-014's load-bearing claim: the Execution Log lives
# in docs/sprint/logs/ specifically BECAUSE the sprint-file legs in scripts/qa-check.sh glob
# `docs/sprint/SPRINT-*.md`, which is non-recursive.
#
# Why this fixture exists. ADR-014 moved the Execution Log out of the capped Plan file and chose a
# SUBDIRECTORY over a same-directory `-log.md` suffix. That choice looks cosmetic and is not: a
# suffix sibling still matches SPRINT-*.md, so all four legs (cap-400, task-schema, layers-
# completeness, layers-observed) would treat the log as a Plan -- capping it at 400, which is the
# exact constraint the split removes. Nothing in the gate enforces the subdirectory; only the glob's
# non-recursiveness does. A future edit widening it to `docs/sprint/**/SPRINT-*.md`, or a generator
# change emitting `-log.md`, would silently re-cap every log with no FAIL anywhere.
#
# The pattern is EXTRACTED from scripts/qa-check.sh rather than re-typed here (L-057's family:
# assert against the shipped artifact, never a hand-copied duplicate that can drift).
#
# Retained per TD-012 / L-058 -- the fixtures are the guard, deleting them with the scaffolding that
# built them leaves the claim unfalsifiable. Dependency-free POSIX sh, no git, no network.
# Run bare: sh evals/run-sprint-log-layout-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
qa="$repo_root/scripts/qa-check.sh"
fx="$here/fixtures/sprint-log-layout"

[ -f "$qa" ] || { echo "FAIL harness: qa-check.sh not found at $qa"; exit 2; }
[ -d "$fx" ] || { echo "FAIL harness: fixture tree not found at $fx"; exit 2; }

fail=0

# --- case 1: the shipped glob is still the non-recursive form -----------------------------------
# Every sprint-file reference in the gate must use exactly `docs/sprint/SPRINT-*.md`. A `**`, a
# `logs/`, or any other widening breaks ADR-014's guarantee, so it fails here by name.
# Match ANY docs/sprint/... .md reference, not just the expected shape -- so a widened pattern is
# reported by name rather than vanishing from the extraction and leaving a blank diagnostic
# (L-059: a failure whose finding is empty tells the next reader nothing).
pats=$(grep -oE 'docs/sprint/[^ )";]*\.md' "$qa" | sort -u)
n_pats=$(printf '%s\n' "$pats" | grep -c .)
if [ "$n_pats" -eq 1 ] && [ "$pats" = 'docs/sprint/SPRINT-*.md' ]; then
  echo "PASS fixture(glob-shape): qa-check.sh uses exactly one sprint pattern, the non-recursive 'docs/sprint/SPRINT-*.md'"
else
  echo "FAIL fixture(glob-shape): ADR-014 requires the single non-recursive pattern 'docs/sprint/SPRINT-*.md'; qa-check.sh now carries $n_pats distinct pattern(s):"
  printf '%s\n' "$pats" | sed 's/^/  /'
  fail=1
fi

# Division of labour, so cases 2-3 are not misread as testing the shipped glob directly:
#   case 1  asserts qa-check.sh still USES the non-recursive pattern.
#   cases 2-3 demonstrate what that pattern SELECTS -- a property of shell globbing, exercised here
#             against retained trees rather than argued in prose. If the gate's pattern ever widens,
#             case 1 is what catches it; these two keep the consequence concrete and falsifiable.
# selected_in <fixture-subdir> -- expand the pattern there, one path per line.
selected_in() { (cd "$fx/$1" && for f in docs/sprint/SPRINT-*.md; do [ -f "$f" ] && echo "$f"; done); }
# has <set> <path> -- exact-line membership. Order-independent on purpose: `sort` collates
# `-log.md` against `.md` differently by locale, and this fixture must not be locale-fragile.
has() { printf '%s\n' "$1" | grep -qxF "$2"; }

# --- case 2: correct layout -- Plan selected, logs/ sibling NOT selected ------------------------
sel_correct=$(selected_in correct)
if has "$sel_correct" 'docs/sprint/SPRINT-900-layout-fixture.md' \
   && ! printf '%s\n' "$sel_correct" | grep -q 'logs/'; then
  echo "PASS fixture(logs-subdir-excluded): glob selected the Plan; docs/sprint/logs/SPRINT-900-layout-fixture.md correctly NOT selected"
else
  echo "FAIL fixture(logs-subdir-excluded): the logs/ sibling is being selected -- an Execution Log would be capped at 400 and schema-checked as a Plan (ADR-014 broken). Selected:"
  printf '  %s\n' $sel_correct
  fail=1
fi

# --- case 3: the rejected layout IS trapped -- this is why the subdirectory is load-bearing ------
# Must-demonstrate case. If this ever stops selecting the -log.md file, the suffix layout became
# safe and ADR-014's rationale needs revisiting rather than silently rotting.
sel_trap=$(selected_in trap)
if has "$sel_trap" 'docs/sprint/SPRINT-901-layout-fixture.md' \
   && has "$sel_trap" 'docs/sprint/SPRINT-901-layout-fixture-log.md'; then
  echo "PASS fixture(suffix-layout-trapped): a same-dir '-log.md' IS selected by the glob -- confirms the subdirectory choice is load-bearing, not stylistic"
else
  echo "FAIL fixture(suffix-layout-trapped): expected the glob to select BOTH the Plan and the -log.md sibling; ADR-014's rationale no longer matches observed behaviour. Selected:"
  printf '  %s\n' $sel_trap
  fail=1
fi

if [ "$fail" -eq 0 ]; then
  echo "run-sprint-log-layout-fixtures: all cases passed"
  exit 0
fi
echo "run-sprint-log-layout-fixtures: FAILURES above"
exit 1
