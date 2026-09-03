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
  "closed with a 'live' handoff outstanding" -- \
  sh "$checker" "$fx/closed-live-outstanding"

# --- the sibling word: `consumed` is ALSO not `spent`, and close still owes reconciliation --------
run_case_anywhere "closed-consumed-outstanding" 1 \
  "closed with a 'consumed' handoff outstanding" -- \
  sh "$checker" "$fx/closed-consumed-outstanding"

# --- UNKNOWN status (field missing) -> FAIL, DoD 1's core clause: never assumed spent -------------
run_case_anywhere "closed-unknown-missing-status" 1 \
  "carries UNKNOWN status" -- \
  sh "$checker" "$fx/closed-unknown-missing-status"

# --- UNKNOWN via a missing handoff-path (the record cannot be identified or deduplicated) ---------
run_case_anywhere "closed-unknown-missing-path" 1 \
  "carries UNKNOWN status" -- \
  sh "$checker" "$fx/closed-unknown-missing-path"

# --- DoD 3's sibling control, verbatim: all handoffs `spent` -> passes in the SAME run ------------
run_case_anywhere "closed-all-spent" 0 \
  "handoff spent at" -- \
  sh "$checker" "$fx/closed-all-spent"

# --- LATEST-entry-per-path wins: live -> consumed -> spent under one handoff-path, sprint closed --
# Without this, a checker that OR'd every entry for a path together instead of taking the latest
# would also pass a genuinely re-opened handoff sharing an old spent path.
run_case_anywhere "closed-superseded-to-spent" 0 \
  "handoff spent at" -- \
  sh "$checker" "$fx/closed-superseded-to-spent"

# --- a `live` handoff is NOT a violation while the sprint is still active -------------------------
# Without this control, a checker that FAILed every `live` handoff regardless of sprint status would
# also satisfy the must-FAIL case above and look correct.
run_case_anywhere "open-live-not-yet" 0 \
  "not yet reconciled, sprint still active" -- \
  sh "$checker" "$fx/open-live-not-yet"

# --- reachability: closed via status: closed but still on the LIVE path, not yet archived ---------
# T1's independent review found the identical gap in check-epic-archive.sh (HIGH-3): every fixture
# put its member under archive/, so the live-path half of the glob went unexercised while SPRINT-093
# was exactly this shape in this repo. Exercised here before a reviewer has to find it a second time.
run_case_anywhere "closed-live-path-not-archived" 1 \
  "closed with a 'live' handoff outstanding" -- \
  sh "$checker" "$fx/closed-live-path-not-archived"

# --- the no-sprint fallback ledger: UNKNOWN status is gated exactly like the sprint case -----------
run_case_anywhere "ledger-unknown-status" 1 \
  "carries UNKNOWN status" -- \
  sh "$checker" "$fx/ledger-unknown-status"

# --- the no-sprint fallback ledger: `live` is reported, not gated (no close event to hook onto) ---
run_case_anywhere "ledger-live-reported" 0 \
  "reconciled at the next promote governance review" -- \
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
  "carries UNKNOWN status" -- \
  sh "$checker" "$fx/sprint027-real-gap"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "HANDOFF-STATE FIXTURES: all green"; else echo "HANDOFF-STATE FIXTURES: at least one FAIL"; fi
exit $fail
