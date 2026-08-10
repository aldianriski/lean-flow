#!/bin/sh
# run-doc-caps-fixtures.sh -- must-FAIL fixtures for scripts/lib/check-doc-caps.sh (TD-041).
#
# The checker replaces four hand-listed globs in qa-check.sh with coverage DERIVED from DOCS_Guide
# §2. Two of the cases below exist because a derivation has two distinct ways to lie:
#   (a) it can under-report a file that IS over its stated cap -- the ordinary must-FAIL leg;
#   (b) it can silently drop a §2 row it failed to parse, which is hand-listing again with the
#       hand-list hidden inside the parser. That one is the reason this task exists at all, so it
#       gets its own fixture rather than being trusted.
# The remaining two cover the grandfather clause, which is a deliberate coverage reduction and
# therefore carries the extra proof obligation L-076 names: show what it no longer catches, and show
# that it cannot become a blanket silencer.
#
# Dependency-free POSIX sh. Run bare: sh evals/run-doc-caps-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-doc-caps.sh"
fx="$here/fixtures/doc-caps"
. "$here/lib/harness-common.sh"

fail=0

# --- case 1: a doc over its stated §2 cap -> FAIL ------------------------------------------------
run_case_anywhere "over-cap" 1 "FAIL  cap tiny.md (5 > 3)" -- \
  sh "$checker" "$fx/over-cap/DOCS_Guide.md" "$fx/over-cap" "$fx/over-cap/none.txt"

# --- case 2: a §2 row that states a cap but yields no path -> FAIL, never a silent skip ----------
# Without this leg the checker could quietly drop any row whose File cell it cannot parse, and the
# gate would read green while covering less than it claims -- the exact shape of the defect being
# fixed, reintroduced one level down (L-058).
run_case_anywhere "unparseable-row" 1 "no path could be derived" -- \
  sh "$checker" "$fx/unparseable-row/DOCS_Guide.md" "$fx/unparseable-row" "$fx/unparseable-row/none.txt"

# --- case 3: a grandfathered file that GREW past its recorded count -> FAIL ----------------------
# The clause exists so a new check can land on a repo with pre-existing drift. It must not become a
# licence to keep drifting: recorded 5, actual 7.
run_case_anywhere "grandfather-grew" 1 "it GREW" -- \
  sh "$checker" "$fx/grandfather-grew/DOCS_Guide.md" "$fx/grandfather-grew" "$fx/grandfather-grew/gf.txt"

# --- case 4: the same file, held at its recorded count -> reported, exit 0 -----------------------
# The must-NOT-catch half of case 3 (L-076): this is precisely what the clause stops catching, shown
# rather than described, so the trade is legible instead of asserted.
run_case_anywhere "grandfather-held" 0 "OVER-CAP (grandfathered): drifting.md" -- \
  sh "$checker" "$fx/grandfather-grew/DOCS_Guide.md" "$fx/grandfather-grew" "$fx/grandfather-grew/gf-held.txt"

# --- case 5a/5b: SOFT caps report, HARD caps fail, in one fixture --------------------------------
# §2 marks its caps ("~150 soft" vs "400 hard") and the first version of this checker discarded the
# marker, so a soft breach failed the gate exactly like a hard one. §11 routes a soft cap to the
# governance review for a prune-with-the-owner, which means failing there blocks the very commit that
# would do the pruning. The narrowing is deliberate, so both halves are asserted: 5a is the
# must-NOT-catch demonstration L-076 requires (soft over cap, exit 0, still reported by name), 5b
# proves the hard leg was not weakened along with it. One fixture, both caps, opposite verdicts.
run_case_anywhere "soft-cap-reports-not-fails" 0 "OVER-CAP (soft): soft.md (5 > 3)" -- \
  sh "$checker" "$fx/soft-cap/DOCS_Guide.md" "$fx/soft-cap" "$fx/soft-cap/none.txt"

run_case_anywhere "hard-cap-still-fails-beside-it" 1 "FAIL  cap hard.md (4 > 3)" -- \
  sh "$checker" "$fx/soft-cap-hard-breach/DOCS_Guide.md" "$fx/soft-cap-hard-breach" "$fx/soft-cap-hard-breach/none.txt"

# --- case 6a/6b: ADR-015 rule 2 -- the grandfather list is HARD caps only (SPRINT-060 T2) ---------
# The rule shipped as prose in the list's own header and in ADR-015, whose Consequences section named
# the gap outright: "nothing enforces rule 2 yet". Recording a soft cap there buys only the growth
# ratchet, since the soft branch already reports it every run and §11 routes it to the promote review.
# The two cases differ in ONE variable -- the recorded path's cap is soft in 6a, hard in 6b -- so a
# regression that stopped distinguishing them shows up here rather than as a silently tolerated row.
run_case_anywhere "soft-cap-must-not-be-grandfathered" 1 "must not be in the grandfather list [ADR-015 rule 2]" -- \
  sh "$checker" "$fx/soft-cap-grandfathered/DOCS_Guide.md" "$fx/soft-cap-grandfathered" "$fx/soft-cap-grandfathered/gf-soft.txt"

# 6b is the must-NOT-catch half (L-076): the same list shape naming a HARD-capped path is legal, and
# still earns its ordinary grandfathered report rather than being swept up by the new rule.
run_case_anywhere "hard-cap-may-be-grandfathered" 0 "OVER-CAP (grandfathered): hard.md" -- \
  sh "$checker" "$fx/soft-cap-grandfathered/DOCS_Guide.md" "$fx/soft-cap-grandfathered" "$fx/soft-cap-grandfathered/gf-hard.txt"

# --- case 6: the live repo's own §2 must still derive rows ---------------------------------------
# A parser that stops matching the real table degrades to zero coverage, and zero coverage over zero
# rows would otherwise exit 0 -- a PASS over an empty input set, which is the L-058 family in its
# purest form and the very thing T4 fixes elsewhere in this sprint. Assert the real standard yields
# real rows, not merely that the checker ran.
run_case_anywhere "live-standard-derives" 0 "PASS  cap .claude/CLAUDE.md" -- \
  sh "$checker"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "DOC-CAPS FIXTURES: all green"; else echo "DOC-CAPS FIXTURES: at least one FAIL"; fi
exit $fail
