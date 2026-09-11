#!/bin/sh
# run-epic-archive-fixtures.sh -- must-FAIL/must-PASS fixtures for scripts/lib/check-epic-archive.sh,
# the checker qa-check.sh delegates STANDARD §11's epic retention row to (SPRINT-055 T2, TASK-167).
#
# The §11 row shipped with the epic layer and `close` never executed it, so the rule had never run
# once -- EPIC-001 sat closed and fully ticked in docs/epic/ across five sprints while every gate
# reported green. A retention rule nothing enforces does not announce that it stopped.
#
# Both directions get fixtures because both are silent:
#   premature / no-conditions  -- archived without earning it (what §11 explicitly warns about)
#   eligible-unarchived        -- earned it and never moved (what actually happened)
# Testing only the first would pass the exact repo state this task was filed to fix.
#
# Retained, never deleted with the scaffolding that built them (L-058, TD-012's lesson).
# Dependency-free POSIX sh. Run bare: sh evals/run-epic-archive-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-epic-archive.sh"
fx="$here/fixtures/epic-archive"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -d "$fx" ]      || { echo "FAIL harness: fixture dir not found at $fx"; exit 2; }

fail=0

# --- case 1: archived while an exit condition is still open -> FAIL ------------------------------
# Every member sprint had closed, so a count-based rule would have waved this through. That is the
# failure §11's row names in its own text.
run_case_anywhere "premature" 1 \
  "archived with 1 § Closed when condition(s) still open" -- \
  sh "$checker" "$fx/premature"

# --- case 2: eligible and still sitting in docs/epic/ -> FAIL -----------------------------------
# The recorded shape: EPIC-001, closed and fully ticked, unmoved for five sprints.
run_case_anywhere "eligible-unarchived" 1 \
  "is closed with every § Closed when condition met" -- \
  sh "$checker" "$fx/eligible-unarchived"

# --- case 3: archived with NO exit conditions at all -> FAIL ------------------------------------
# "All conditions met" is vacuously true for an epic that states none, so the empty section has to
# be its own finding rather than the happy path.
run_case_anywhere "no-conditions" 1 \
  "archived with no § Closed when conditions at all" -- \
  sh "$checker" "$fx/no-conditions"

# --- case 4: correctly archived -> exit 0 (control) ----------------------------------------------
run_case_anywhere "properly-archived" 0 \
  "archived correctly (2 condition(s), all met, status closed" -- \
  sh "$checker" "$fx/properly-archived"

# --- case 5: live epic with work left -> exit 0 (control) ---------------------------------------
# Without cases 4 and 5, a checker that FAILed unconditionally would satisfy every case above.
run_case_anywhere "live-open" 0 \
  "correctly live (status 'active', 1 of 2 condition(s) open)" -- \
  sh "$checker" "$fx/live-open"


# --- case 6: archived while a member sprint is still open -> FAIL --------------------------------
# §11's trigger is a genuine TWO-PART test and this checker enforced only the second half until
# SPRINT-080 T4. This is the silent direction: every exit condition ticked, so a conditions-only rule
# waves it through while a sprint that belongs to the epic is still running. §11 names exactly this
# -- "never archive on member-sprint count alone -- an epic whose last sprint closed with exit
# conditions unmet is unfinished, not done, and archiving it hides that".
run_case_anywhere "archived-member-open" 1 \
  "archived while member sprint(s) 906 are still open" -- \
  sh "$checker" "$fx/archived-member-open"

# --- case 7: closed and fully ticked, but a member sprint is open -> exit 0 (control) -------------
# The state that was previously unrepresentable, and the false positive that fired on EPIC-004 at
# SPRINT-080 T4: the epic is finished, the sprint that finished it is not. Demanding the move here
# would ask for an archive §11 forbids. Without this control, case 6 is satisfied by a checker that
# simply refuses every epic naming an open member.
run_case_anywhere "closed-member-open" 0 \
  "correctly NOT yet archived" -- \
  sh "$checker" "$fx/closed-member-open"

# ================================================================================================
# § epic-state -- SPRINT-094 T1 (TASK-324). The three drift classes the checker gained when it was
# widened from "should this epic be archived?" to "is this epic's rollup CURRENT?".
#
# These are RETAINED, not scaffolding to delete with the prototype (TD-012). One fixture per class,
# each asserting ITS OWN finding text rather than a bare exit code -- a shared exit 1 would let any
# one class satisfy every case, which is the coverage hole L-058 names.
#
# The classes were proven on REAL artifacts before these fixtures existed (L-166): class (b) fires on
# EPIC-014 at d43a7a1 -- the stale header that passed a fully green gate and was found by hand -- and
# classes (a) and (c) fired on EPIC-015's four unrolled close_commits and three unattributed ticks in
# the live tree. Fixtures prove the branch works; those artifacts proved it is reachable.
# ================================================================================================

fxs="$here/fixtures/epic-state"
[ -d "$fxs" ] || { echo "FAIL harness: epic-state fixture dir not found at $fxs"; exit 2; }

# --- case 8: closed member rolled up WITHOUT its close_commit -> FAIL (class a) ------------------
# The EPIC-015 shape: a Status cell reading "**closed** <date> — N of M DoD". The row exists and
# looks complete, so only reading the cell against EPIC.md.template's format finds it.
run_case_anywhere "a-no-close-commit" 1 \
  "SPRINT-910's § Member sprints Status cell carries no close_commit" -- \
  sh "$checker" "$fxs/a-no-close-commit"

# --- case 9: closed member with no rollup row at all -> FAIL (class a) ---------------------------
# The louder half of the same class, and a separate case because a checker keyed only to a MALFORMED
# cell would silently pass a member that was never rolled up at all.
run_case_anywhere "a-no-member-row" 1 \
  "SPRINT-911 is closed but has NO row in § Member sprints" -- \
  sh "$checker" "$fxs/a-no-member-row"

# --- case 10: header older than the newest closed member -> FAIL (class b) -----------------------
# EPIC-014's real case. Invisible to S3.SCHEMA, which asserts last_updated is PRESENT and never that
# it is current -- which is exactly why this passed every gate while stale.
run_case_anywhere "b-stale-header" 1 \
  "last_updated is 2026-01-01 but its newest closed member sprint closed 2026-02-01" -- \
  sh "$checker" "$fxs/b-stale-header"

# --- case 11: ticked exit condition naming no sprint -> FAIL (class c) ---------------------------
run_case_anywhere "c-unattributed-tick" 1 \
  "has a ticked § Closed-when condition naming no member sprint" -- \
  sh "$checker" "$fxs/c-unattributed-tick"

# --- case 12: all three classes satisfied -> exit 0 (control) ------------------------------------
# Load-bearing: without it, a checker that FAILed every active epic unconditionally would satisfy
# cases 8-11 and look fully covered.
run_case_anywhere "control-current" 0 \
  "rollup current (every closed member rolled up with its own close_commit" -- \
  sh "$checker" "$fxs/control-current"

# --- REACHABILITY cases 13-17 (T1 independent review) --------------------------------------------
# The review's through-line: cases 8-12 discriminate each class's BRANCHES, and nothing varied the
# SET OF MEMBERS those branches are applied to. Member resolution happens three ways -- which row is
# selected, which sprints count as closed, which paths are searched -- and a seed in any of them left
# all twelve green. These five vary that set. Retained (TD-012).

# --- case 13: sibling row's PROSE mentions the member -> FAIL (HIGH-1) --------------------------
# SPRINT-921 has no row at all; SPRINT-920's contribution text ends "carried on into SPRINT-921".
# The first draft matched the whole row, so 921 bound to 920's row and inherited its close_commit.
# Live on EPIC-014, where SPRINT-091's row mentions SPRINT-092.
run_case_anywhere "r-row-by-prose" 1 \
  "SPRINT-921 is closed but has NO row in § Member sprints" -- \
  sh "$checker" "$fxs/r-row-by-prose"

# --- case 14: member closed on the LIVE path, not archive/ -> FAIL (HIGH-3) ---------------------
# Every one of cases 8-12 puts its member under archive/, so deleting the live half of the glob left
# the whole suite green while a real drift went silent. SPRINT-093 is exactly this shape in the repo.
run_case_anywhere "r-live-path" 1 \
  "SPRINT-922 is closed but has NO row in § Member sprints" -- \
  sh "$checker" "$fxs/r-live-path"

# --- case 15: archived member whose frontmatter never flipped -> FAIL (HIGH-2) ------------------
# The retention directions call an archived sprint closed; the first draft of closed_members also
# demanded status: closed, so a half-completed close was closed for one half of this file and open
# for the other, and the drift went vacuously green.
run_case_anywhere "r-archived-not-flipped" 1 \
  "SPRINT-923 is closed but has NO row in § Member sprints" -- \
  sh "$checker" "$fxs/r-archived-not-flipped"

# --- case 16: cell carries a hex token that is NOT this sprint's commit -> FAIL (MEDIUM-6) ------
# Shape alone passes; a row copying its neighbour's sha is the likeliest real instance and is
# traceable to the WRONG place, which is worse than untraceable.
run_case_anywhere "r-wrong-sha" 1 \
  "names a close_commit that is not the sprint's own" -- \
  sh "$checker" "$fxs/r-wrong-sha"

# --- case 17: tick attributed to a NON-member sprint -> FAIL (MEDIUM-4) -------------------------
run_case_anywhere "r-nonmember-attrib" 1 \
  "has a ticked § Closed-when condition naming no member sprint" -- \
  sh "$checker" "$fxs/r-nonmember-attrib"

# --- SELECTION cases 18-20 (SPRINT-097 T5, TD-144 / L-186) --------------------------------------
# Cases 8-17 vary which VERDICT the epic-state branches reach. Every one of them declares its member
# the same way -- `[SPRINT-NNN]` -- so all seventeen sit inside one selection rule, and none of them
# asks whether the checker picked the right member in the first place. The live tree has always used
# three id shapes (`SPRINT-NNN`, bare `NNN`, and `<repo> SPRINT-NNN`); the fixtures used one. That
# shared incidental property is L-186's cheap tell, and TD-144 is what it hid: EPIC-016's members
# live in `workdoo` (ADR-041), the parser split the field on whitespace, and `001` then resolved
# against lean-flow's OWN SPRINT-001 -- a close_commit mismatch reported on a correct artifact.
#
# These three vary the SELECTION and hold the verdict logic fixed. All three name member 930 and all
# three ship an identical local docs/sprint/archive/SPRINT-930-m.md whose close_commit (ccc111930)
# disagrees with the `eb3d9e7` in the epic's row -- so the wrong-sha branch is armed in every one,
# and only the ID SHAPE decides whether it should fire. Retained (TD-012).

# --- case 18: foreign member colliding with a local sprint number -> exit 0 + NOTE ---------------
# EPIC-016's exact shape, and the case with no reader before this sprint. Passing here is possible
# only if the member was never resolved locally: the collision partner IS on disk and its sha DOES
# disagree, so a checker that still globs `SPRINT-930-*` for this member fails the case loudly.
# The NOTE names the collision itself: the local twin IS on disk and was deliberately not used.
run_case_anywhere "s-foreign-collision" 0 \
  "SPRINT-930 lives outside this repository, and this repository ALSO has a same-numbered Plan" -- \
  sh "$checker" "$fxs/s-foreign-collision"

# --- case 19: the SIBLING CONTROL -- same row, LOCAL member -> FAIL -----------------------------
# Differs from case 18 by exactly one token in one field: the `workdoo ` qualifier. Without it, case
# 18 is satisfied by a checker that has simply stopped reporting on member rows altogether -- the
# silent false negative this family exists to remove (L-142).
run_case_anywhere "s-local-collision-twin" 1 \
  "SPRINT-930's § Member sprints Status cell names a close_commit that is not the sprint's own" -- \
  sh "$checker" "$fxs/s-local-collision-twin"

# --- case 20: bare-number id shape -> FAIL -------------------------------------------------------
# `member_sprints: [930]`, the EPIC-004 shape -- live in this repository (`[072, 073]`) and
# unrepresented by any fixture until now, so the other arm of the id normalisation had no reader
# either. A parser handling only `SPRINT-NNN` leaves this member unselected and goes green.
run_case_anywhere "s-bare-number-member" 1 \
  "SPRINT-930's § Member sprints Status cell names a close_commit that is not the sprint's own" -- \
  sh "$checker" "$fxs/s-bare-number-member"

# --- SELECTION cases 21-22: epic file DEPTH (SPRINT-097 T5 owner ruling) -------------------------
# The second selection axis, and the one that sank T5's first retry. That attempt classified a member
# as local or external by matching its row's link href against `../sprint/*`. Every archived epic in
# this repository sits one directory deeper and links its local members TWO levels up
# (`](../../sprint/archive/SPRINT-NNN-...)` -- EPIC-001, 002, 003 and 004 all do), so all four had
# their LOCAL members classified external and silently dropped from the verified set. That defeats
# direction (a), "ARCHIVED TOO EARLY ... the one §11 warns about", and trades a loud false positive
# for a silent false negative.
#
# No fixture could catch it: every archived-epic fixture above carries NO § Member sprints table at
# all, so no fixture varied -- or even exercised -- epic file depth, and a seeded break could not
# reach a branch the fixtures never entered. These two put an archived epic at the real corpus depth
# with a real two-level member link, and differ only in whether that member is closed. Retained.

# --- case 21: archived epic at real depth whose local member is still OPEN -> FAIL ---------------
run_case_anywhere "s-archived-depth-open" 1 \
  "archived while member sprint(s) 932 are still open" -- \
  sh "$checker" "$fx/s-archived-depth-open"

# --- case 22: the SIBLING CONTROL -- same depth, member closed -> exit 0 -------------------------
# Without it, case 21 is satisfied by a checker that refuses every archived epic at this depth.
run_case_anywhere "s-archived-depth-closed" 0 \
  "EPIC-933-f.md archived correctly" -- \
  sh "$checker" "$fx/s-archived-depth-closed"

# --- cases 23-25: the T5 REVIEW's findings, each with its own case -------------------------------
# All three come from the independent worktree-isolated review of the first merge attempt. Each is a
# hole the 22 cases above could not see, and each is here because a seeded break proved the suite
# stayed green without it (L-142).

# --- case 23: foreign member colliding with an OPEN local twin -> FAIL (review MAJOR-2a) ---------
# Every OTHER selection fixture's collision partner is CLOSED, so `open_members`/`unknown_members`
# return empty whether or not they skip foreign members -- and the `_members_scan` half of the fix
# was therefore deletable with all 22 cases green. Proven: with that one guard line removed this
# case flips to `PASS ... correctly NOT yet archived`, exit 0.
# This case has now been rewritten TWICE by review, and the sequence is the lesson. Round 2 found
# the sentence unnarrowed and round 3 narrowed it -- while leaving it a `bad`, so the branch still
# FAILED the gate on an epic it had just said nothing was demanded of. That turns EPIC-016 red the
# moment its nine conditions tick: a red gate on a correct ADR-041 artifact, TD-144's own harm one
# branch over. Round 4 made it `ok`. Each time, THIS case asserted the defect and defended it --
# a fixture is only ever as right as the behaviour it was written against (L-186's own trap).
run_case_anywhere "s-foreign-open-collision" 0 \
  "every LOCAL member sprint closed, but 1 member(s) could not be resolved" -- \
  sh "$checker" "$fxs/s-foreign-open-collision"

# --- case 32: the collision glob's LIVE arm (round 3 MINOR-1) ------------------------------------
# The hit glob has two arms, archive/ and the live path, and only the archive one was pinned --
# dropping the live arm left all 31 cases green. This same fixture already EMITTED the live-arm
# NOTE; nothing asserted it. Same failure mode as round 2's MINOR-1, one branch along.
run_case_anywhere "s-collision-live-arm" 0 \
  "ALSO has a same-numbered Plan at docs/sprint/SPRINT-960-m.md" -- \
  sh "$checker" "$fxs/s-foreign-open-collision"

# --- case 33: LOCAL-FIRST mixed list (round 3 MAJOR-3) ------------------------------------------
# The third population axis. Round 2 closed all-local-or-all-foreign with ONE mixed fixture, and
# that fixture lists the foreign member FIRST -- which discriminates the two `|| continue` skips and
# is structurally blind to `report_unresolvable`'s `&& continue`, reachable only by a local-first
# list. Proven: with that one skip turned into a `break`, this fixture loses its NOTE (1 -> 0) while
# the foreign-first fixture keeps its own, and all 31 earlier cases stay green.
run_case_anywhere "s-local-first-mixed" 1 \
  "NOTE  epic-archive: docs/epic/EPIC-952-f.md member workdoo SPRINT-001 lives outside this repository" -- \
  sh "$checker" "$fxs/s-local-first-mixed"

# --- case 24: archived epic with NO resolvable member -> exit 0, but a NARROWED claim ------------
# The verdict is not the finding; the SENTENCE is. Direction (a) used to print "every member sprint
# closed" for an epic where it resolved nothing, two lines above a NOTE saying §11's trigger cannot
# be read for those members -- an affirmative claim about a test that never ran (review CRITICAL-1).
run_case_anywhere "s-allforeign-archived" 0 \
  "every LOCAL member sprint closed -- but 2 member(s) could not be resolved" -- \
  sh "$checker" "$fx/s-allforeign-archived"

# --- case 25: the UNKNOWN-member NOTE is asserted, not merely emitted (review MAJOR-2b) ----------
# `unknown_members()` shipped for five sprints with ZERO callers while its own header declared that
# unknown members are "NAMED on the report ... never silently skipped". T5 wired it -- and shipped it
# with zero ASSERTIONS, so deleting the reporting loop again left the suite green. Same silent-stance
# failure, one level along. This case is the reader that was missing.
run_case_anywhere "unknown-member-noted" 0 \
  "NOTE  epic-archive: docs/epic/EPIC-903-live.md member SPRINT-903 names no Plan anywhere" -- \
  sh "$checker" "$fx/live-open"

# --- cases 26-30: ROUND 2's findings, each with the case that was missing ------------------------
# Round 2 re-seeded all five round-1 fixes and confirmed each holds. What it found instead was that
# the code ROUND 1 ADDED -- the narrowing and `unverified_count` -- was itself unasserted, and that
# two selection axes were still unvaried. Every case below exists because a seeded break proved the
# suite stayed green without it.
#
# NOTE assertions from here on include the `epic-archive:` PREFIX (round 2 MINOR-2): every earlier
# NOTE assertion was a bare substring, so MINOR-3's own prefix fix could be reverted with the suite
# fully green. A fix nothing asserts is a fix that will be undone by the next edit.

# --- case 26: an entry naming no sprint number -> counted and NOTED (review CRITICAL-2) ----------
# The inverse of the narrowing, and it silently defeated it: a dropped entry left `unverified_count`
# at 0, so an epic that verified NOTHING got "archived correctly ... every member sprint closed".
# The motivating artifact is this plugin's own shipped EPIC.md.template (L-166).
run_case_anywhere "s-template-default-members" 0 \
  "NOTE  epic-archive: docs/epic/archive/EPIC-970-f.md has a member_sprints entry naming no sprint number" -- \
  sh "$checker" "$fx/s-template-default-members"

# --- case 27: the same fixture must NOT get the fully affirmative claim --------------------------
run_case_anywhere "s-template-default-narrowed" 0 \
  "every LOCAL member sprint closed -- but 2 member(s) could not be resolved" -- \
  sh "$checker" "$fx/s-template-default-members"

# --- case 28: MIXED member list, foreign first -> the local member is still reached --------------
# Census at round 2: all 24 other fixture epics are all-local or all-foreign, so the per-entry skip
# could have been a whole-loop `break` and nothing would have noticed. Proven: `continue` -> `break`
# in both skips flips this case FAIL/exit 1 -> PASS/exit 0 with every other case green.
run_case_anywhere "s-mixed-local-foreign" 1 \
  "SPRINT-951's § Member sprints Status cell names a close_commit that is not the sprint's own" -- \
  sh "$checker" "$fxs/s-mixed-local-foreign"

# --- case 29: the PLAIN foreign NOTE, with no local twin to collide with (round 2 MINOR-1) -------
# Case 18 asserts only the COLLISION variant, so the non-collision branch -- the common one -- was
# assertion-free and `note` could be replaced by `:` with the suite green.
run_case_anywhere "s-plain-foreign-note" 1 \
  "NOTE  epic-archive: docs/epic/EPIC-951-f.md member workdoo SPRINT-001 lives outside this repository -- its rollup row cannot be verified here" -- \
  sh "$checker" "$fxs/s-mixed-local-foreign"

# --- case 30: the UNKNOWN half of unverified_count (round 3's own seed R2-H) --------------------
# unverified_count sums two producers, foreign and unknown, and cases 24/27 assert only the foreign
# half -- so pinning the unknown half to a constant 0 left all 30 cases green while the report
# printed a member count that disagreed with its own NOTE lines. EPIC-980 has NO foreign member, so
# its count comes entirely from the unknown side and this assertion cannot be satisfied any other
# way. Found by re-running the previous review's own seed against the fix that claimed to close it.
run_case_anywhere "s-unknown-counted" 0 \
  "every LOCAL member sprint closed -- but 1 member(s) could not be resolved" -- \
  sh "$checker" "$fx/s-unknown-counted"

# --- case 31: the EPIC-STATE half of the narrowing (round 2 MAJOR-1) ----------------------------
# Only direction (a)'s narrowing was asserted. Disabling the epic-state one left the suite green
# while the report printed "rollup current" for an epic that resolved zero members.
# Pointed at s-foreign-collision, not the mixed fixture: the mixed one carries a real class (a)
# drift, so `drift` is 1 there and the epic-state success line is never reached at all. A case
# asserting a line its fixture cannot emit would fail for the right reason by accident today and
# for no reason tomorrow.
run_case_anywhere "s-epic-state-narrowed" 0 \
  "rollup current for every LOCAL member -- but 1 member(s) could not be resolved" -- \
  sh "$checker" "$fxs/s-foreign-collision"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "EPIC-ARCHIVE FIXTURES: all green"; else echo "EPIC-ARCHIVE FIXTURES: at least one FAIL"; fi
exit $fail
