#!/bin/sh
# run-night-run-outcome-fixtures.sh -- fixtures for the outcome/DoD consistency check added to
# scripts/lib/check-night-run-rollup.sh (SPRINT-098 T3 -- EPIC-015 Closed-when 6).
#
# reap() now emits a typed `outcome · DELIVERED | PARTIAL | FAILED · ...` line beside the existing
# `run · N of M DoD ticked` / `terminal · <STATE> · ...` lines (scripts/night-run.sh). This checker
# is the one place that reads `outcome ·` back and asserts it agrees with the mechanical DoD count
# sitting beside it -- the exact silent false negative T3 exists to close, one level up from T1's own
# terminal/per-task agreement check: a run that stopped mid-Plan (an open DoD box remains) reporting
# itself DELIVERED.
#
# `outcome ·` is grandfathered, not required: every log written before this task shipped has no such
# line at all (including the real committed SPRINT-067/082/089/090 archives and every other fixture
# in evals/fixtures/night-run-rollup/), so the check below only fires when the line IS present --
# adding it to the hdr/cal/term shape requirement would retroactively FAIL all of that pre-existing,
# still-correct history.
#
# Each FAIL case asserts on the checker's OWN NAMED FINDING (L-058), never a bare non-zero exit:
#   outcome-delivered-with-open-dod -- outcome says DELIVERED, but N < M DoD boxes are ticked
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-night-run-outcome-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-night-run-rollup.sh"
fx="$here/fixtures/night-run-outcome"
. "$here/lib/harness-common.sh"

fail=0

# --- case 1 (must-FAIL): outcome · DELIVERED with an open DoD box -- the mid-Plan-reports-DELIVERED
# shape DoD 4 names directly. No non-done per-task line anywhere, so this cannot also trip T1's own
# terminal/per-task agreement rule (L-189: fails for its own reason, not incidentally). -------------
run_case_anywhere "delivered-open-dod-fails" 1 "outcome-delivered-with-open-dod" -- \
  sh "$checker" "$fx/delivered-open-dod/docs/sprint/logs/SPRINT-971-delivered-open-dod.md"

# --- case 2 (control, L-142): the SAME outcome · DELIVERED claim, genuinely exhausted -> PASS ------
# Without this, a checker that FAILed every 'outcome · DELIVERED' line would satisfy case 1 alone.
run_case_anywhere "delivered-open-dod-sibling-ok" 0 "agrees with its per-task lines" -- \
  sh "$checker" "$fx/delivered-open-dod-sibling/docs/sprint/logs/SPRINT-972-delivered-open-dod-sibling.md"

# --- case 3 (must-vary-SELECTION, L-186): two run-complete blocks, same verdict math either time ---
# (outcome · DELIVERED vs an open DoD count is the same contradiction in block one) -- what must
# differ is which block is in scope. Block one alone would FAIL; the file as a whole must read only
# the LAST block (T1's own windowing discipline, reused here) and PASS.
run_case_anywhere "window-second-block-outcome-ok" 0 "agrees with its per-task lines" -- \
  sh "$checker" "$fx/window-second-block-outcome/docs/sprint/logs/SPRINT-973-window-second-block-outcome.md"

# --- case 4 (self-describing-corpus control, L-108): a genuine, correct rollup followed -- in the
# SAME window, before the next `### ` entry header -- by an illustrative aside quoting the exact bad
# shape this check exists to catch. The real evidence is written FIRST (reap()'s own emission order,
# protected by the Execution Log's append-only rule -- STANDARD §9/ADR-014 -- which means an aside can
# only land AFTER it, never before); `head -n1` in the checker always selects that first, genuine
# occurrence. Must stay green: this is the fixed L-108 shape recurring one function over (T2's outside
# review found the SAME family in check_revise_ceiling() one file down), pinned here as a control
# before this checker ever ships the equivalent defect.
run_case_anywhere "illustrative-aside-after-real-ok" 0 "agrees with its per-task lines" -- \
  sh "$checker" "$fx/illustrative-aside-after-real/docs/sprint/logs/SPRINT-974-illustrative-aside-after-real.md"

# --- case 5 family: outcome_for_terminal()'s own mapping, driven through the real `--reap` path ----
# Everything above proves the CONSUMER (check-night-run-rollup.sh) catches a bad outcome/DoD pairing.
# It never proves the PRODUCER (outcome_for_terminal() in scripts/night-run.sh) maps each terminal
# state to the RIGHT outcome in the first place -- the exact "code that PRODUCES the field is the half
# that gets forgotten" gap run-reap-terminal-fixtures.sh's own header names for the terminal state one
# level down. Same shape reused here: build a throwaway repo-shaped tree, drive the real reaper via
# `--reap`, read the emitted `outcome ·` token back.
launcher="$repo_root/scripts/night-run.sh"
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; fail=1; work=""; }
if [ -n "$work" ]; then
  trap 'rm -rf "$work"' EXIT INT TERM

  case_outcome() {
    label=$1; want=$2; box=$3; body=$4; ec=${5:-}
    d="$work/$label"
    mkdir -p "$d/docs/sprint/logs"
    cat > "$d/docs/sprint/SPRINT-961-fx.md" <<EOF
---
sprint: 961
status: active
---

## Plan

### T1 — x \`[size: S · risk: low · class: execution · AFK · J1]\`
Layers: \`a.md\`

**DoD:**
- [$box] a thing
EOF
    printf '# log\n%s\n' "$body" > "$d/docs/sprint/logs/SPRINT-961-fx.md"
    : > "$d/run.log"
    [ -n "$ec" ] && printf '%s' "$ec" > "$d/run.log.exit"

    err=$(sh "$launcher" --reap "$d/run.log" "$d" "" 0 2>&1 >/dev/null)
    got=$(grep -oE '^outcome · [A-Z]+' "$d/docs/sprint/logs/SPRINT-961-fx.md" 2>/dev/null | sed 's/^outcome · //')

    if [ "$got" = "$want" ] && [ -z "$err" ]; then
      echo "PASS fixture($label): outcome · $got"
    else
      echo "FAIL fixture($label): got '${got:-<none>}', wanted '$want'${err:+ -- stderr: $err}"
      fail=1
    fi
  }

  case_outcome "outcome-plan-exhausted-is-delivered" "DELIVERED" "x" "T1 · done · 1 of 1 DoD"
  case_outcome "outcome-blocked-is-partial"           "PARTIAL"   " " "T1 · blocked · needs a human decision"
  case_outcome "outcome-unreached-is-partial"         "PARTIAL"   " " "some prose that mentions T1 · done in passing"
  case_outcome "outcome-stalled-is-failed"            "FAILED"    " " "T1 · stalled · watchdog fired"
  case_outcome "outcome-nonzero-exit-is-failed"       "FAILED"    "x" "T1 · done · 1 of 1 DoD" "1"

  # --- provenance-tag assertions (coordinator, after T3's outside review) ------------------------
  # The tags ARE T3's headline feature -- they exist so a morning reader can tell a counted figure
  # from a model-written one, which is TD-152's overclaim turned into structure. Nothing asserted
  # them. The review seeded `parks · %s  [model-reported]` -> `[mechanical]` (TD-152's exact
  # overclaim direction, one level down inside the fix for it), and BOTH suites stayed green:
  # a landed, targeted seed that reddens nothing has tested nothing (L-142 · L-187).
  #
  # Asserted per field rather than as a set, so a mislabel names WHICH field drifted. The expected
  # tag is the field's provenance as ruled at G2, not as currently printed -- an assertion copied
  # from the output it checks would ratify a mislabel instead of catching it.
  case_tags() {
    d="$work/tags"
    mkdir -p "$d/docs/sprint/logs"
    cat > "$d/docs/sprint/SPRINT-962-tags.md" <<EOF
---
sprint: 962
status: active
---

## Plan

### T1 — x \`[size: S · risk: low · class: execution · AFK · J1]\`
Layers: \`a.md\`

**DoD:**
- [x] a thing
EOF
    printf '# log\nT1 · done · 1 of 1 DoD\n' > "$d/docs/sprint/logs/SPRINT-962-tags.md"
    : > "$d/run.log"
    sh "$launcher" --reap "$d/run.log" "$d" "" 0 >/dev/null 2>&1
    emitted="$d/docs/sprint/logs/SPRINT-962-tags.md"

    # field <TAB> expected tag. Counted-from-text -> mechanical; written-by-the-run -> model-reported;
    # a function of the fields above it -> derived (never more certain than what it reads).
    for pair in \
      'run|mechanical' \
      'outcome|derived' \
      'terminal|derived' \
      'tasks|mechanical' \
      'parks|model-reported' \
      'repair-cycles|model-reported' \
      'verification|model-reported' \
      'warnings|mechanical'
    do
      fld=${pair%%|*}; want=${pair##*|}
      line=$(grep -E "^${fld} · " "$emitted" 2>/dev/null | head -n1)
      if [ -z "$line" ]; then
        echo "FAIL fixture(provenance-tag-$fld): field not emitted at all -- the tag cannot be checked because the line is gone"
        fail=1
      elif printf '%s' "$line" | grep -qF "[$want]"; then
        echo "PASS fixture(provenance-tag-$fld): tagged [$want]"
      else
        echo "FAIL fixture(provenance-tag-$fld): expected [$want], got: $line"
        fail=1
      fi
    done
  }
  case_tags

  # --- verification extraction across token shapes (coordinator, after T3's outside review) ------
  # The first form was `([^ ]+) ·`, requiring a space-free token. A sed whose pattern does not match
  # does not truncate -- it passes the whole line through -- so a finding name containing a space
  # emitted the entire raw line duplicated behind `verification · `. Dormant (every finding name this
  # repo emits is kebab-case) and retained anyway: "unreachable today" is how a guard becomes
  # reachable tomorrow, and the original comment named the wrong failure mode, which is what sends a
  # later reader looking for a truncation that never happens.
  case_verify() {
    label=$1; line=$2; want=$3
    d="$work/verify-$label"
    mkdir -p "$d/docs/sprint/logs"
    sed 's/sprint: 961/sprint: 964/' "$work/outcome-plan-exhausted-is-delivered/docs/sprint/SPRINT-961-fx.md" \
      > "$d/docs/sprint/SPRINT-964-v.md" 2>/dev/null || {
        echo "FAIL harness: could not derive the verify fixture Plan from case 5's tree -- its shape changed"
        fail=1; return; }
    printf '# log\nT1 · done · 1 of 1 DoD\n%s\n' "$line" > "$d/docs/sprint/logs/SPRINT-964-v.md"
    : > "$d/run.log"
    sh "$launcher" --reap "$d/run.log" "$d" "" 0 >/dev/null 2>&1
    got=$(grep -E '^verification · ' "$d/docs/sprint/logs/SPRINT-964-v.md" 2>/dev/null | tail -n1 | sed -E 's/^verification · (.*)  \[.*$/\1/')
    if [ "$got" = "$want" ]; then
      echo "PASS fixture(verification-$label): extracted '$got'"
    else
      echo "FAIL fixture(verification-$label): expected '$want', got '${got:-<none>}'"
      fail=1
    fi
  }
  case_verify "kebab-token"  'system-verify · FAIL(revise-loop-ceiling-exceeded) · sh scripts/qa-check.sh' 'FAIL(revise-loop-ceiling-exceeded)'
  case_verify "spaced-token" 'system-verify · FAIL(some finding with spaces) · sh scripts/qa-check.sh'     'FAIL(some finding with spaces)'
  case_verify "bare-pass"    'system-verify · PASS · sh scripts/qa-check.sh'                               'PASS'
fi

# --- motivating real artifact (L-166) ---------------------------------------------------------------
# None exists, and that is stated plainly rather than fabricated (per this task's own brief). The
# `outcome ·` field is new in this task: reap() has never emitted it before this change, so no
# committed Execution Log anywhere in this repository -- including every archived sprint used as a
# motivating artifact elsewhere in this file's siblings -- can carry one. The earliest run that COULD
# produce a real one is SPRINT-098 T4 (a genuine unattended run against the repaired reaper), which
# has not happened yet at the time this suite was written.
echo "NOTE: no real committed motivating artifact exists for the outcome/DoD check -- the field is new in this task; see this file's header comment"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "NIGHT-RUN-OUTCOME FIXTURES: all green"; else echo "NIGHT-RUN-OUTCOME FIXTURES: at least one FAIL"; fi
exit $fail
