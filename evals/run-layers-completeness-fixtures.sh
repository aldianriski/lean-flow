#!/bin/sh
# run-layers-completeness-fixtures.sh -- must-FAIL fixtures for scripts/lib/check-layers-
# completeness.sh, the checker qa-check.sh's leg 14 delegates to (TD-020, L-071, SPRINT-042 T3).
#
# The dispatch preflight's shared-file check is sound and negative-tested; its input is a
# hand-written `Layers:`/`Depends-on:` declaration, and a check over a manifest cannot detect an
# omission from that manifest (L-071: omission looks identical to absence). Case 1 below
# reconstructs SPRINT-041's real Plan verbatim -- both T1 and T2's DoDs required marking a TD
# resolved, neither declared TECH-DEBT.md in Layers:, the preflight passed, and two agents edited
# the file concurrently, merging clean only by ~19 lines of luck. That is a recorded miss, not an
# invented one. Case 2 (the Depends-on: half) has no equivalent recorded incident, so its fixture is
# a small constructed Plan -- labeled as such in the fixture file itself, never claimed as real.
#
# Calls scripts/lib/check-layers-completeness.sh directly against retained fixtures under
# evals/fixtures/layers-completeness/ (L-058: retain the fixtures, don't delete them with the
# scaffolding that built them -- TD-012's lesson). SPRINT-097 T3's cases are the one exception: they
# are built into a throwaway mktemp dir at run time rather than committed as new static files, since
# T3's own declared Layers: covers this harness script and its three siblings, not a fixture
# directory -- see that section's own header comment. Dependency-free POSIX sh.
# Run bare: sh evals/run-layers-completeness-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-layers-completeness.sh"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }

fail=0

# --- case 0: bare invocation (no sprint files) -- must-note, exit 0 (TD-056, SPRINT-069 T4) -------
# Previously `for sp in "$@"` over an empty arg list printed nothing and exited 0 -- a silent pass
# indistinguishable from a real clean run. This proves the guard fires: run the checker with zero
# arguments and require the "nothing verified" note, at exit 0 (never non-zero -- the guarded
# siblings note at exit 0, and qa-check.sh always supplies arguments so this leg never touches the
# gate path).
run_case_anywhere "bare-invocation-notes-nothing-verified" 0 \
  "layers completeness: no sprint files given -- nothing verified" -- \
  sh "$checker"

# --- case 1: SPRINT-041 reconstructed -- TD marked resolved implies TECH-DEBT.md, undeclared -----
run_case_anywhere "sprint-041-reconstructed" 1 \
  "Layers completeness: DoD/Acceptance implies TECH-DEBT.md(TD-marked-resolved), absent from Layers: -- if the prose only cites it rather than touching it, declare it on a Cites: line" -- \
  sh "$checker" "$here/fixtures/layers-completeness/sprint-041-reconstructed.md"

# --- case 2: Depends-on omission (constructed) -- T2's prose references T1, Depends-on: none -----
run_case_anywhere "depends-on-omitted" 1 \
  "Depends-on completeness: DoD/Acceptance references T1, absent from Depends-on: -- if the prose only cites that task rather than depending on it, declare it on a Cites: line" -- \
  sh "$checker" "$here/fixtures/layers-completeness/depends-on-omitted.md"

# --- cases 3-5: the `Cites:` escape and the wrapped-declaration rule (SPRINT-049 T3) -------------
# Case 3 is the only must-PASS fixture in this harness, and it is the one that guards against the
# regression TD-032 actually recorded: the gate quietly reshaping documentation. Its three blocks are
# the real SPRINT-048 false positives (commits 45ff548 / 68bdc7e / c401a0e). Cases 4 and 5 are the
# escape's own must-FAIL bar -- an escape with no abuse case is a silencer (L-058).

run_case_anywhere "sprint-048-citations-escaped" 0 \
  "Layers completeness (DoD-implied files all declared)" -- \
  sh "$checker" "$here/fixtures/layers-completeness/sprint-048-citations.md"

run_case_anywhere "cites-contradiction" 1 \
  "Cites/Layers contradiction: docs/QA.md declared as touched AND escaped as merely cited" -- \
  sh "$checker" "$here/fixtures/layers-completeness/cites-contradiction.md"

run_case_anywhere "unindented-continuation" 1 \
  "declaration continuation: a wrapped Layers line must be indented to continue" -- \
  sh "$checker" "$here/fixtures/layers-completeness/unindented-continuation.md"

# --- case 6: directory tokens are a PREFIX, not a wildcard (SPRINT-055 T1) -----------------------
# A `Layers:` token ending in "/" now covers every path beneath it. Before T1 it matched nothing at
# all while still reading as a declaration -- accepted, guarding zero files. Both halves are asserted
# from the ONE fixture file: T1's block must PASS (its implied paths sit under the declared tree) and
# T2's must FAIL naming the path outside it. Asserting only the PASS half would let a prefix rule
# that swallowed everything look correct, which is the same false-negative the rule removed.
run_case_anywhere "dir-token-prefix-covers" 1 \
  "### T1 Layers completeness (DoD-implied files all declared)" -- \
  sh "$checker" "$here/fixtures/layers-completeness/dir-token-prefix.md"

run_case_anywhere "dir-token-prefix-outside" 1 \
  "### T2 Layers completeness: DoD/Acceptance implies scripts/lib/check-count-claims.sh, absent from Layers:" -- \
  sh "$checker" "$here/fixtures/layers-completeness/dir-token-prefix.md"

# ================================================================================================
# cases 7-9: SPRINT-097 T3 (TD-142). These fixtures are BUILT below into a throwaway mktemp dir
# rather than added as new static files under evals/fixtures/layers-completeness/ -- deliberately:
# T3's own declared Layers: covers exactly this harness script and its sibling three, not a fixture
# directory, and check-layers-observed.sh (this same sprint's sibling checker) would otherwise report
# a new committed fixture file as changed-but-undeclared. Building it here keeps every new byte
# inside the one file already declared, the same reason check-layers-observed.sh's OWN harness
# builds its git-repo fixtures in a mktemp dir instead of committing them (see that file's header).
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT

# --- case 7/8: THE SILENT DIRECTION, FIXED (TD-142). Membership used to be a SUBSTRING test
# (`grep -qF` against the raw Layers: line) -- a token read as "declared" if it merely appeared
# anywhere in the line, inside a longer path (T1) or inside a trailing, unbackticked comment (T2).
# Both are now must-FAIL by their own named finding; T2 also exercises the NEW
# `layers-unbackticked-token` finding (DoD item 3), since the same unbackticked text is exactly that
# shape. T3 is the sibling control asserted in the SAME run: an ordinary correct declaration, which
# must stay a clean PASS under both checks.
sub_fx="$work/substring-declaration-not-declared.md"
cat > "$sub_fx" <<'EOF'
---
sprint: 902
slug: substring-declaration-not-declared
status: active
plan_commit: fixture
update_trigger: fixture -- must-FAIL input, built by evals/run-layers-completeness-fixtures.sh
  (SPRINT-097 T3, TD-142), not a real sprint file. Reproduces the SILENT direction of TD-142's
  divergence, now fixed: membership used to be a SUBSTRING test against the raw Layers: line, so a
  DoD-implied token merely appearing inside a longer declared path (T1) or an unbackticked trailing
  comment (T2) read as "declared" -- L-108's shape, failing GREEN. T2 also exercises the NEW
  layers-unbackticked-token finding. T3 is the sibling control.
---

## Plan

### T1 — a DoD-implied token sits INSIDE a longer declared path
Layers: `scripts/lib/other-config.sh`
Depends-on: none

config.sh and the declared file above are two distinct files. The declared path merely CONTAINS
`config.sh`'s text as a substring; that is not a declaration of the shorter file.

**Acceptance:** `config.sh` is recognised as undeclared even though its name sits inside the text of
the longer, genuinely-declared path above.

**DoD:**
- [ ] `config.sh` is updated

### T2 — a DoD-implied token sits INSIDE an unbackticked trailing comment on Layers:
Layers: `scripts/lib/check-layers-completeness.sh` (also touches config.sh conceptually)
Depends-on: none

The parenthetical is prose commentary on the Layers: line, not a second, backtick-delimited
declaration -- and per the 2026-09-10 backtick ruling it never was one.

**Acceptance:** `config.sh` is recognised as undeclared, and the bare mention in the parenthetical is
itself named as a declaration written outside backticks.

**DoD:**
- [ ] `config.sh` is updated

### T3 — sibling control: an ordinary, correct declaration
Layers: `config.sh`
Depends-on: none

The declared file matches the implied file exactly, entirely inside backticks. This block must stay
green under both the substring-fix and the new unbackticked-token check.

**Acceptance:** the declared file matches the implied file exactly.

**DoD:**
- [ ] `config.sh` is updated
EOF

run_case_anywhere "substring-not-a-declaration (token inside a longer declared path still FAILs)" 1 \
  "### T1 Layers completeness: DoD/Acceptance implies config.sh, absent from Layers:" -- \
  sh "$checker" "$sub_fx"

run_case_anywhere "substring-not-a-declaration (token inside a trailing comment still FAILs)" 1 \
  "### T2 Layers completeness: DoD/Acceptance implies config.sh, absent from Layers:" -- \
  sh "$checker" "$sub_fx"

run_case_anywhere "substring-not-a-declaration (unbackticked token gets its own named finding)" 1 \
  "### T2 layers-unbackticked-token: declares a path-shaped token outside backticks (config.sh)" -- \
  sh "$checker" "$sub_fx"

sub_out=$(sh "$checker" "$sub_fx" 2>&1)
if printf '%s\n' "$sub_out" | grep '^FAIL' | grep -qF '### T3'; then
  echo "FAIL fixture(substring-not-a-declaration sibling control): a FAIL line names T3 -- got:"
  printf '%s\n' "$sub_out"; fail=1
elif printf '%s\n' "$sub_out" | grep -qF '### T3 Layers completeness (DoD-implied files all declared)'; then
  echo "PASS fixture(substring-not-a-declaration sibling control): T3 stayed a clean PASS, never named in a FAIL line"
else
  echo "FAIL fixture(substring-not-a-declaration sibling control): T3's expected PASS line not found -- got:"
  printf '%s\n' "$sub_out"; fail=1
fi

# --- case 9: SELECTION, not verdict (L-186) -- which Plans enter this checker's population AT ALL.
# Both check-*.sh checkers skip `*/archive/*`, and qa-check.sh's real caller hands them a NON-
# recursive `ls docs/sprint/SPRINT-*.md` that never reaches an archived file either -- the exclusion
# is doubled, and before this fixture neither half had ever been exercised for THIS checker
# (check-layers-observed.sh's own suite covers archive handling extensively; this one had none). The
# archived fixture is built at a path CONTAINING an `archive/` segment and passed to the checker
# DIRECTLY (bypassing the non-recursive glob a real caller would use), so the checker's OWN
# `*/archive/*` guard is what has to do the excluding. The live sibling carries the identical
# violation shape with no `archive/` segment, and must still FAIL in the same run -- the control that
# tells "excluded correctly" apart from "stopped checking".
mkdir -p "$work/archive"
arch_fx="$work/archive/SPRINT-999-archived-should-be-skipped.md"
cat > "$arch_fx" <<'EOF'
---
sprint: 999
slug: archived-should-be-skipped
status: closed
plan_commit: fixture
close_commit: fixture
update_trigger: fixture -- SELECTION fixture (L-186), built by evals/run-layers-completeness-fixtures.sh
  under a path carrying an archive/ segment on purpose. Carries a real, undeclared DoD-implied file
  so that if the archive skip were ever silently dropped this fixture would start failing loudly.
---

## Plan

### T1 — a real completeness violation, deliberately never checked
Layers: `foo.txt`
Depends-on: none

This Plan must never be evaluated at all -- it lives under an `archive/` path segment on purpose.

**Acceptance:** n/a -- reaching this block would itself be the defect under test.

**DoD:**
- [ ] `bar.txt` is created, and never declared in Layers: above -- a real completeness violation that
      must never surface, because this Plan is archived
EOF

live_fx="$work/archive-sibling-live.md"
cat > "$live_fx" <<'EOF'
---
sprint: 998
slug: archive-sibling-live
status: active
plan_commit: fixture
update_trigger: fixture -- sibling control for the archive-path-excluded case (L-186). Carries the
  SAME completeness violation shape as its archived sibling, but on a LIVE Plan (no archive/ path
  segment) -- it must still FAIL by name in the same run the archived sibling is silently skipped.
---

## Plan

### T1 — the same violation shape, on a Plan that IS in scope
Layers: `foo.txt`
Depends-on: none

**Acceptance:** `bar.txt` is recognised as undeclared -- this Plan is live, so it must be evaluated.

**DoD:**
- [ ] `bar.txt` is created, and never declared in Layers: above -- a real completeness violation
EOF

run_case_anywhere "archive-path-excluded (live sibling still FAILs by name)" 1 \
  "Layers completeness: DoD/Acceptance implies bar.txt, absent from Layers:" -- \
  sh "$checker" "$arch_fx" "$live_fx"

arc_out=$(sh "$checker" "$arch_fx" "$live_fx" 2>&1)
case "$arc_out" in
  *"SPRINT-999"*|*"archived-should-be-skipped"*)
    echo "FAIL fixture(archive-path-excluded: archived Plan was not skipped): got:"
    printf '%s\n' "$arc_out"; fail=1 ;;
  *)
    echo "PASS fixture(archive-path-excluded: archived Plan reached via a direct path argument was skipped)" ;;
esac

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "LAYERS-COMPLETENESS FIXTURES: all green"; else echo "LAYERS-COMPLETENESS FIXTURES: at least one FAIL"; fi
exit $fail
