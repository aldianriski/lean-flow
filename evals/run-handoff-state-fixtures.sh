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

# --- independent review, Finding 2: a fenced example inside the entry, quoted as a reminder -------
# Field capture is first-occurrence-wins and had no fence awareness, so an entry that quoted the
# stub format above its real fields captured the EXAMPLE (`spent`, /tmp/example-format.md) and
# ignored the real `live` record below it -- PASS at exit 0. The assertion pins the REAL path, so a
# regression that re-reads the example cannot satisfy it.
run_case_anywhere "closed-quoted-format-block" 1 \
  "closed with a 'live' handoff outstanding (/tmp/handoff-941-x.md)" -- \
  sh "$checker" "$fx/closed-quoted-format-block"

# --- independent review, Finding 3: a literal TAB byte inside a handoff-path value ----------------
# TAB is this record format's own delimiter. An unescaped tab in a path made the emitter print FOUR
# fields; `resolve_latest` reads only $1..$3, so the path's tail fragment was taken as the status --
# a path ending `<tab>spent` turned a live handoff into `PASS ... spent` at exit 0. The assertion
# pins BOTH halves: the status stays `live`, and the fragment stays part of the path.
run_case_anywhere "closed-delimiter-inside-value" 1 \
  "closed with a 'live' handoff outstanding (/tmp/foo spent)" -- \
  sh "$checker" "$fx/closed-delimiter-inside-value"

# --- re-review Finding 1: an unbalanced fence must not ERASE what follows ------------------------
# The first fence fix was a bare parity flip: an opened-and-never-closed fence stayed on to EOF, so
# every later handoff entry was consumed by `fence { next }` and never reached the anchor at all. A
# closed sprint with a real outstanding `live` handoff below the fence reported PASS at exit 0, and
# the entry appeared NOWHERE in the output -- not wrong, erased. That is the silent-false-negative
# class the fence rule existed to close, reintroduced by the rule itself. An unreadable region is now
# an UNKNOWN record, which is never assumed spent. The assertion pins the NAMED cause, so a
# regression that merely FAILs for some other reason cannot satisfy it.
run_case_anywhere "closed-unbalanced-fence" 1 \
  "(<unreadable: a code fence opened here was never closed>) carries UNKNOWN status ('<missing>')" -- \
  sh "$checker" "$fx/closed-unbalanced-fence"

# --- re-review Finding 2: `~~~` is CommonMark's other fence, and bypassed the guard entirely ------
# Guarding only ``` left the previous round's quoted-stub-format exploit fully reproducible by
# swapping the fence character. Both syntaxes now count, and a fence closes only on its OWN
# character. The assertion pins the REAL path, so capturing the tilde-fenced example instead fails.
run_case_anywhere "closed-tilde-format-block" 1 \
  "closed with a 'live' handoff outstanding (/tmp/handoff-954-x.md)" -- \
  sh "$checker" "$fx/closed-tilde-format-block"

# --- re-review Finding 3: literal TABs around the keyword in the heading --------------------------
# The anchor repeated a literal space (` *`) rather than `[ \t]*`, so `|<TAB>handoff<TAB>|` fell
# through to the generic `^### ` rule, closed the block, and left a real live handoff unparsed --
# "skip", exit 0. The same failure class as this round's own Finding 1, via a different malformed
# heading, and inconsistent with clean()'s tolerance of stray tabs everywhere else in the record.
run_case_anywhere "closed-heading-tab-padded" 1 \
  "closed with a 'live' handoff outstanding (/tmp/handoff-955-x.md)" -- \
  sh "$checker" "$fx/closed-heading-tab-padded"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "HANDOFF-STATE FIXTURES: all green"; else echo "HANDOFF-STATE FIXTURES: at least one FAIL"; fi
exit $fail
