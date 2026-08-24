#!/usr/bin/env sh
# check-verify-reaches.sh -- a mechanical `*Verify:*` clause must name a method that EXISTS and that
# REACHES the target the criterion claims (SPRINT-082 T3).
#
# Why this exists. §9 already requires a ticked criterion to name how it was verified (S9.VERIFYCLAUSE),
# and that check passes on a clause naming a method which cannot examine its own subject. L-136's fourth
# sighting is the worked example: SPRINT-081 T1 froze
#
#   "Verify: sh scripts/lib/check-doc-caps.sh still PASSes each"   -- for three docs/qa/ files
#
# but that checker derives its caps from §2's table and §2 states no cap for `docs/qa/`, so it could
# neither pass nor fail them. It ran `66 PASS, 0 FAIL` and said nothing whatever about its named
# subject. The criterion was UNREACHABLE, not failed -- and unreachable reads exactly like satisfied.
# Statically visible the whole time: `grep -c docs/qa scripts/lib/check-doc-caps.sh` is 0.
#
# --- what this checks, and what it deliberately does not ------------------------------------------
# G2's test has four questions -- EXISTS · RUNS · REACHES · PROVES (orchestrator/SKILL.md § G2). Two of
# them are mechanical and are what this file does:
#
#   EXISTS   -- the named script is present in the repo.        -> verify-method-absent
#   REACHES  -- the named script textually references the       -> verify-does-not-reach-target
#               target path the criterion claims.
#
# RUNS and PROVES stay human questions at G2 and are NOT claimed here. Saying so matters: a checker
# that implied it settled all four would be the same over-claim it exists to catch, one level up.
#
# --- the deliberate limits, stated rather than discovered later -----------------------------------
# * Static text match. A script reaching a target through a variable, or through a helper it sources,
#   reads as not-reaching here. That direction is a FALSE POSITIVE and is the safe one: it asks a human
#   to look, it never certifies a gap as fine.
# * A target must contain `/` to be recognised. A bare filename is too ambiguous to key on -- prose
#   naming `dispatch.md` is usually discussing it, not claiming a checker examines it. This is the
#   trade that keeps the false-positive rate survivable, and it means a criterion claiming a bare
#   filename target is NOT covered.
# * Only `*Verify: ...*` clauses are read -- the declared method. A ticked box's `✓ <evidence>` is a
#   record of what happened, not a claim about scope, and is S9.VERIFYCLAUSE's business.
# * A clause naming NO script is a judgment method. Legitimate, reported as a note, never failed --
#   T3's rule is explicit that manual verification stays valid where no mechanical method exists.
#
# Usage: sh check-verify-reaches.sh <sprint.md> [<sprint.md> ...]
# Archived sprints are skipped by path (docs/sprint/archive/) -- closed history is not re-litigated.
# Prints one PASS/FAIL/note line per file; exits 1 if any FAIL line was printed.
# Dependency-free POSIX sh -- no jq, no bashisms.
set -u

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

[ "$#" -gt 0 ] || { note "verify reaches: no sprint files given -- nothing verified"; exit 0; }

for sp in "$@"; do
  [ -f "$sp" ] || { bad "verify reaches: file not found: $sp"; continue; }
  case "$sp" in */archive/*) continue ;; esac

  if ! grep -q '\*Verify:' "$sp" 2>/dev/null; then
    note "verify reaches: $sp has no mechanical Verify: clause -- nothing to verify"
    continue
  fi

  filefail=0
  checked=0
  judgment=0

  # One clause per line. Reading line by line rather than file-wide is load-bearing for the same
  # reason as check-review-depth.sh: a reachable target elsewhere in the file must not vouch for an
  # unreachable one here.
  while IFS= read -r line; do
    [ -n "$line" ] || continue

    # The declared method: scripts invoked as `sh <path>.sh` inside the Verify clause.
    clause=$(printf '%s' "$line" | sed -E 's/.*\*Verify:([^*]*)\*.*/\1/')
    scripts=$(printf '%s' "$clause" | tr -d '`' | tr ' ' '\n' \
              | grep -E '^[A-Za-z0-9_./-]+\.sh$' | sort -u)

    if [ -z "$scripts" ]; then
      judgment=$(( judgment + 1 ))
      continue
    fi

    # Targets: path-like tokens anywhere on the line, minus the scripts themselves. A `/` is required
    # (see limits above).
    targets=$(printf '%s' "$line" | tr -d '`*' | tr ' ' '\n' \
              | sed -E 's/[,.;:)]+$//' \
              | grep -E '^[A-Za-z0-9_.-]+/[A-Za-z0-9_./-]*$' | sort -u)

    for scr in $scripts; do
      if [ ! -f "$scr" ]; then
        bad "verify-method-absent: $sp -- a Verify: clause names \`$scr\`, which does not exist in this repository. A criterion whose method is absent is a claim with nothing behind it"
        filefail=1
        continue
      fi
      for tgt in $targets; do
        [ "$tgt" = "$scr" ] && continue
        case "$scr" in *"$tgt"*) continue ;; esac
        # Comments are stripped before matching. A script's prose can NAME a path its code never
        # touches -- the self-describing-corpus failure (L-108), and it vouches for exactly the gap
        # this check exists to find. Caught by this file's own fixture on first run: the stand-in
        # checker's explanatory comment mentioned the unreachable target and the must-FAIL case went
        # green. Limit, stated: a trailing inline comment on a code line is still matched.
        if ! grep -v '^[[:space:]]*#' "$scr" 2>/dev/null | grep -qF -- "$tgt"; then
          bad "verify-does-not-reach-target: $sp -- the criterion claims \`$tgt\` but \`$scr\` never references it, so running it proves nothing about that target. Unreachable reads exactly like satisfied (L-136); either name a method whose scope covers it, or state the criterion as a judgment tick"
          filefail=1
        else
          checked=$(( checked + 1 ))
        fi
      done
    done
  done <<EOF
$(grep -n '\*Verify:' "$sp" 2>/dev/null | sed 's/^[0-9]*://')
EOF

  # A negative assertion needs a positive witness (L-156): report what was actually examined, so a
  # file whose clauses named no checkable target is visibly untested rather than quietly green.
  if [ "$filefail" -eq 0 ]; then
    ok "verify reaches $sp ($checked claimed target(s) confirmed reachable, $judgment judgment-method clause(s) left to G2)"
  fi
done

exit "$fail"
