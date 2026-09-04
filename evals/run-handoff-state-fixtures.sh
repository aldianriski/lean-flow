#!/bin/sh
# run-handoff-state-fixtures.sh -- must-FAIL/must-PASS fixtures for scripts/lib/check-handoff-state.sh
# (SPRINT-094 T2, TASK-325). Delegates STANDARD Sec 12(b)'s Meeting-notes conversion, which lean-flow
# shipped no step to perform: a handoff is written, the session ends, and whether anything in it
# reached a durable home was answered by nobody.
#
# Retained, never deleted with the scaffolding that built them (L-058, TD-012's lesson).
# Dependency-free POSIX sh. Run bare: sh evals/run-handoff-state-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-handoff-state.sh"
fx="$here/fixtures/handoff-state"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -d "$fx" ]      || { echo "FAIL harness: fixture dir not found at $fx"; exit 2; }

fail=0

# --- DoD 3's must-FAIL case, verbatim: a sprint closing with a `live` handoff outstanding ---------
run_case_anywhere "closed-live-outstanding" 1 \
  "closed with a 'live' handoff outstanding (/tmp/handoff-930-x.md)" -- \
  sh "$checker" "$fx/closed-live-outstanding"

# --- the sibling word: `consumed` is ALSO not `spent`, and close still owes reconciliation --------
run_case_anywhere "closed-consumed-outstanding" 1 \
  "closed with a 'consumed' handoff outstanding (/tmp/handoff-931-x.md)" -- \
  sh "$checker" "$fx/closed-consumed-outstanding"

# --- UNKNOWN status (field missing) -> FAIL, DoD 1's core clause: never assumed spent -------------
run_case_anywhere "closed-unknown-missing-status" 1 \
  "(/tmp/handoff-932-x.md) carries UNKNOWN status ('<missing>')" -- \
  sh "$checker" "$fx/closed-unknown-missing-status"

# --- UNKNOWN via a missing handoff-path (the record cannot be identified or deduplicated) ---------
run_case_anywhere "closed-unknown-missing-path" 1 \
  "(<no handoff-path recorded>) carries UNKNOWN status ('live')" -- \
  sh "$checker" "$fx/closed-unknown-missing-path"

# --- DoD 3's sibling control, verbatim: all handoffs `spent` -> passes in the SAME run ------------
run_case_anywhere "closed-all-spent" 0 \
  "handoff spent at /tmp/handoff-934-x.md" -- \
  sh "$checker" "$fx/closed-all-spent"

# --- LATEST-entry-per-path wins: live -> consumed -> spent under one handoff-path, sprint closed --
# Without this, a checker that OR'd every entry for a path together instead of taking the latest
# would also pass a genuinely re-opened handoff sharing an old spent path.
run_case_anywhere "closed-superseded-to-spent" 0 \
  "handoff spent at /tmp/handoff-935-x.md" -- \
  sh "$checker" "$fx/closed-superseded-to-spent"

# --- a `live` handoff is NOT a violation while the sprint is still active -------------------------
# Without this control, a checker that FAILed every `live` handoff regardless of sprint status would
# also satisfy the must-FAIL case above and look correct.
run_case_anywhere "open-live-not-yet" 0 \
  "handoff 'live' at /tmp/handoff-936-x.md -- not yet reconciled, sprint still active" -- \
  sh "$checker" "$fx/open-live-not-yet"

# --- reachability: closed via status: closed but still on the LIVE path, not yet archived ---------
# T1's independent review found the identical gap in check-epic-archive.sh (HIGH-3): every fixture
# put its member under archive/, so the live-path half of the glob went unexercised while SPRINT-093
# was exactly this shape in this repo. Exercised here before a reviewer has to find it a second time.
run_case_anywhere "closed-live-path-not-archived" 1 \
  "closed with a 'live' handoff outstanding (/tmp/handoff-937-x.md)" -- \
  sh "$checker" "$fx/closed-live-path-not-archived"

# --- the no-sprint fallback ledger: UNKNOWN status is gated exactly like the sprint case -----------
run_case_anywhere "ledger-unknown-status" 1 \
  "(/tmp/handoff-triage-x.md) carries UNKNOWN status ('<missing>')" -- \
  sh "$checker" "$fx/ledger-unknown-status"

# --- the ledger's OWN empty-path branch, which no fixture reached ---------------------------------
# The sprint-side loop and the ledger loop are separate `read` loops over the same record shape, so a
# fix or a regression can land in one and not the other. Every ledger fixture happened to carry a
# path, leaving the ledger's empty-path branch unexercised -- the same "the branch works, but is it
# reachable" gap L-166 names. `consumed` here, not `live`, so this case's finding cannot be satisfied
# by the sprint-side one above.
run_case_anywhere "ledger-unknown-missing-path" 1 \
  "(<no handoff-path recorded>) carries UNKNOWN status ('consumed')" -- \
  sh "$checker" "$fx/ledger-unknown-missing-path"

# --- the no-sprint fallback ledger: `live` is reported, not gated (no close event to hook onto) ---
run_case_anywhere "ledger-live-reported" 0 \
  "entry 'live' at /tmp/handoff-research-x.md -- reconciled at the next promote governance review" -- \
  sh "$checker" "$fx/ledger-live-reported"

# --- L-166: pointed at the REAL motivating case, not fixtures alone -------------------------------
# The vocabulary this checker reads is new -- no historical commit literally carries a
# `handoff-status:` field, so an unmodified historical blob cannot be replayed against it the way
# T1 replayed check-epic-archive.sh against d43a7a1. This fixture carries forward the REAL id, dates
# and close_commit of docs/sprint/archive/SPRINT-027-watchdog-housekeeping.md, whose real Execution
# Log records a genuine 54-line handoff doc produced in OS temp on 2026-07-29 -- the same day the
# sprint closed -- with the field this checker reads genuinely never written, because the mechanism
# did not exist yet. That is the exact silent-loss shape T2 closes.
run_case_anywhere "sprint027-real-gap" 1 \
  "(%TEMP%/handoff-stall-exercise.md) carries UNKNOWN status ('<missing>')" -- \
  sh "$checker" "$fx/sprint027-real-gap"

# --- independent review, Finding 1: a heading whose summary placeholder was left blank ------------
# `### <date> | handoff |` with nothing after the second pipe used to fail the block anchor and fall
# through to the generic `^### ` rule, which CLOSED the block -- so the real handoff-status and
# handoff-path lines directly beneath it were never parsed, and a closed sprint with a `live`
# handoff outstanding reported "skip (no handoff records)" at exit 0. A silent false negative
# reachable by forgetting to fill in a bracketed placeholder.
run_case_anywhere "closed-heading-without-summary" 1 \
  "closed with a 'live' handoff outstanding (/tmp/handoff-940-x.md)" -- \
  sh "$checker" "$fx/closed-heading-without-summary"

# --- review round 1, Finding 2: a quoted stub format standing between a heading and its fields ----
# Field capture was first-occurrence-wins, so an entry that quoted the format as a reminder had the
# EXAMPLE captured as the record and its real `live` fields ignored -- PASS at exit 0. Two further
# review rounds then broke two successive attempts to parse AROUND the quoted block, which is why
# there is no longer any attempt to: under the strict shape, content between the heading and the
# fields ends the record incomplete, so this reports UNKNOWN rather than guessing which of two
# candidate records was meant. The assertion pins the log file and line, so it cannot be satisfied by
# another fixture's UNKNOWN.
run_case_anywhere "closed-quoted-format-block" 1 \
  "SPRINT-941-x.md handoff at line 9 (<no handoff-path recorded>) carries UNKNOWN status ('<missing>')" -- \
  sh "$checker" "$fx/closed-quoted-format-block"

# --- independent review, Finding 3: a literal TAB byte inside a handoff-path value ----------------
# TAB is this record format's own delimiter. An unescaped tab in a path made the emitter print FOUR
# fields; `resolve_latest` reads only $1..$3, so the path's tail fragment was taken as the status --
# a path ending `<tab>spent` turned a live handoff into `PASS ... spent` at exit 0. The assertion
# pins BOTH halves: the status stays `live`, and the fragment stays part of the path.
run_case_anywhere "closed-delimiter-inside-value" 1 \
  "closed with a 'live' handoff outstanding (/tmp/foo spent)" -- \
  sh "$checker" "$fx/closed-delimiter-inside-value"

# --- review rounds 2 and 3: content AFTER a complete record must not swallow the NEXT entry -------
# This fixture is the graveyard of two fence mechanisms. A closed sprint whose first (already
# `spent`) entry is followed by an unclosed code fence, with a REAL outstanding `live` handoff below
# it. Round 2's bare toggle consumed everything to EOF, so the real entry was ERASED -- absent from
# the output entirely, PASS at exit 0. Round 3's EOF sentinel caught only that subset, staying silent
# whenever the fence happened to balance again after swallowing the record. Under the strict shape
# both are structurally impossible: the first entry completes at its second field, after which
# nothing is skipped or tracked, so the second heading is read normally. The assertion names the
# SECOND entry's real path -- the one both earlier designs lost.
run_case_anywhere "closed-unbalanced-fence" 1 \
  "closed with a 'live' handoff outstanding (/tmp/handoff-953-second-REAL.md)" -- \
  sh "$checker" "$fx/closed-unbalanced-fence"

# --- review round 3: the same intervening-content case reached by a different fence character -----
# Round 2 guarded ``` only, so `~~~` -- CommonMark's other fence -- reproduced the quoted-format
# exploit by swapping one character. Retained because it is the cheapest possible demonstration of
# why the fence-aware design kept failing: the guard had to enumerate every syntax that could hide a
# record, and missing one was a silent false negative. The strict shape enumerates nothing; any
# intervening line, whatever its syntax, ends the record as UNKNOWN.
run_case_anywhere "closed-tilde-format-block" 1 \
  "SPRINT-954-x.md handoff at line 9 (<no handoff-path recorded>) carries UNKNOWN status ('<missing>')" -- \
  sh "$checker" "$fx/closed-tilde-format-block"

# --- re-review Finding 3: literal TABs around the keyword in the heading --------------------------
# The anchor repeated a literal space (` *`) rather than `[ \t]*`, so `|<TAB>handoff<TAB>|` fell
# through to the generic `^### ` rule, closed the block, and left a real live handoff unparsed --
# "skip", exit 0. The same failure class as this round's own Finding 1, via a different malformed
# heading, and inconsistent with clean()'s tolerance of stray tabs everywhere else in the record.
run_case_anywhere "closed-heading-tab-padded" 1 \
  "closed with a 'live' handoff outstanding (/tmp/handoff-955-x.md)" -- \
  sh "$checker" "$fx/closed-heading-tab-padded"

# --- review round 3, Finding 1: the fence closes AFTER swallowing, so no EOF sentinel fires -------
# Round 3's sentinel only fired when a fence was still open at EOF. A fence opened in entry A and
# closed anywhere inside entry B left `fence=0` by EOF -- sentinel silent -- while entry B's heading
# and both its fields had already been consumed. A closed sprint with a real outstanding `live`
# handoff reported PASS at exit 0 with the entry absent from the output. Retained because it is the
# case that proved the fence DESIGN unfixable rather than the fence RULES buggy: the second of two
# mechanisms failed on it, and it is the reason the parser skips nothing at all now.
run_case_anywhere "closed-fence-closed-after-swallowing" 1 \
  "closed with a 'live' handoff outstanding (/tmp/handoff-961-second-REAL.md)" -- \
  sh "$checker" "$fx/closed-fence-closed-after-swallowing"

# --- review round 3, Finding 2: a CommonMark-correct nested fence defeats character-only tracking --
# The standard way to quote a fenced example is a 4-backtick fence around a 3-backtick one. Round 3
# matched the fence's opening CHARACTER but not its RUN LENGTH, so the outer block closed on the
# inner marker, exposed the nested example as the real record, then re-opened on the inner's leftover
# marker and swallowed the real fields -- PASS at exit 0. Retained as the cheapest demonstration of
# why enumerating fence syntaxes could never terminate.
run_case_anywhere "closed-nested-fence-example" 1 \
  "SPRINT-960-x.md handoff at line 9 (<no handoff-path recorded>) carries UNKNOWN status ('<missing>')" -- \
  sh "$checker" "$fx/closed-nested-fence-example"

# --- the strict shape's ONE tolerance: a blank line between the heading and its fields -----------
# Added because the seeded-break pass caught its absence, not because anyone noticed it missing.
# Removing the blank-line rule reddened NOTHING across the other 20 fixtures -- a landed, targeted
# break that scored as a pass, which is precisely the vacuous-control shape L-142 names. The rule is
# the only thing standing between "strict" and "brittle": every other line ends the record as
# UNKNOWN, so if a blank line did too, the shape most authors actually write would FAIL. The
# assertion pins the real path, so a regression that turns this into UNKNOWN cannot satisfy it.
run_case_anywhere "closed-blank-line-before-fields" 1 \
  "closed with a 'live' handoff outstanding (/tmp/handoff-956-x.md)" -- \
  sh "$checker" "$fx/closed-blank-line-before-fields"

# --- a field APPENDED rather than replaced: both branches of the repeated-field guard -------------
# Also added because the seeded-break pass caught their absence -- disabling the guard reddened
# nothing across 21 fixtures. The guard matters because these logs are append-only and "never edited
# in place", so a second `handoff-status:` in ONE entry is not an update, it is a malformed entry: the
# LATEST-wins rule resolves whole RECORDS keyed by handoff-path, never individual fields. Without the
# guard the later value silently overwrites the earlier one and a half-edited entry reports a
# confident, wrong status. Each assertion pins the FIRST value read plus the missing half, so a
# regression that takes the later value cannot satisfy either.
run_case_anywhere "closed-repeated-status-field" 1 \
  "(<no handoff-path recorded>) carries UNKNOWN status ('spent')" -- \
  sh "$checker" "$fx/closed-repeated-status-field"

run_case_anywhere "closed-repeated-path-field" 1 \
  "(/tmp/stale-958.md) carries UNKNOWN status ('<missing>')" -- \
  sh "$checker" "$fx/closed-repeated-path-field"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "HANDOFF-STATE FIXTURES: all green"; else echo "HANDOFF-STATE FIXTURES: at least one FAIL"; fi
exit $fail
