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
#               (present, but only findable by basename          -> verify-method-unresolvable
#               against the known roots, is a DIFFERENT claim
#               from confirmed absent -- TD-097.)
#   REACHES  -- the named script textually references the       -> verify-does-not-reach-target
#               target path the criterion claims, as code, at
#               a path boundary, outside an exclusion (TD-087).
#
# RUNS and PROVES stay human questions at G2 and are NOT claimed here. Saying so matters: a checker
# that implied it settled all four would be the same over-claim it exists to catch, one level up.
#
# --- the deliberate limits, stated rather than discovered later -----------------------------------
# * Static text match. A `$VAR/literal/path` idiom -- a variable prefix in front of a literal path
#   suffix, this repo's own convention (`conformance.sh`'s `$here/scripts/lib/...`) -- DOES reach,
#   because lf_line_touches matches the target as a segment run anywhere inside a token, not only at
#   its front (SPRINT-100 T1, caught by outside review after an earlier draft missed it). What still
#   reads as not-reaching: a target named ONLY through a variable holding the whole path with no
#   literal path text visible on that line at all, or through a helper the script merely sources.
#   That remaining direction is a FALSE POSITIVE and is the safe one: it asks a human to look, it
#   never certifies a gap as fine.
# * A target must contain `/` to be recognised. A bare filename is too ambiguous to key on -- prose
#   naming `dispatch.md` is usually discussing it, not claiming a checker examines it. This is the
#   trade that keeps the false-positive rate survivable, and it means a criterion claiming a bare
#   filename target is NOT covered.
# * Only `*Verify: ...*` clauses are read -- the declared method. A ticked box's `✓ <evidence>` is a
#   record of what happened, not a claim about scope, and is S9.VERIFYCLAUSE's business.
# * A clause naming NO script is a judgment method. Legitimate, reported as a note, never failed --
#   T3's rule is explicit that manual verification stays valid where no mechanical method exists.
# * A bare-basename method resolves against the CWD first, then `scripts/`, `scripts/lib/`, `evals/`
#   in that fixed order -- first match wins. Two roots sharing a basename is a corpus-hygiene question
#   this checker does not adjudicate (SPRINT-100 T1, TD-097).
# * Exclusion-idiom detection (`lf_is_exclusion_line`) is a closed set of shapes -- `grep -v`, a
#   `case … ) continue` arm, `--exclude` / `-not` / `! -path` / `! -name` -- not a parser. A pruning
#   idiom spelled a sixth way (e.g. `awk '!/pat/'`) is NOT recognised and reads as a genuine reach: a
#   FALSE NEGATIVE, the unsafe direction this file otherwise avoids. Widen the case statement as new
#   shapes are found in this repo's own scripts; don't generalise ahead of evidence.
# * A token that is itself one of this clause's OTHER named scripts is never treated as a target, even
#   on the rare chance it was meant as one -- an N-method `Verify:` clause (TD-087) would otherwise have
#   the checker pair named methods against each other, each reading as unreachable from the other.
#
# Usage: sh check-verify-reaches.sh <sprint.md> [<sprint.md> ...]
# Archived sprints are skipped by path (docs/sprint/archive/) -- closed history is not re-litigated.
# Prints one PASS/FAIL/note line per file; exits 1 if any FAIL line was printed.
# Dependency-free POSIX sh -- no jq, no bashisms.
set -u

# Shared archive predicate (SPRINT-099 T3, TD-145 · TD-151). Ten checkers each carried the same
# string glob `case "$x" in */archive/*)`, which admits `docs/sprint/Archive/...` -- the SAME
# directory, one inode, on any case-insensitive filesystem. One predicate, asked of the filesystem.
# Missing file is FATAL rather than a local fallback: a fallback copy here would rebuild the ten
# copies this task exists to remove.
_lf_ap=$(dirname -- "$0")/archive-path.sh
[ -f "$_lf_ap" ] || { echo "FAIL verify reaches: shared archive predicate not found at $_lf_ap"; exit 2; }
. "$_lf_ap"

# lf_line_touches <line> <tgt-core>
#   0 if <line> contains <tgt-core> as a contiguous run of WHOLE "/"-separated path segments, found
#   anywhere inside a longer path-like token -- not merely as a character substring. Tokenising on
#   every character outside the path charset, then wrapping both the token and the target in a
#   leading/trailing "/" before a literal substring test, is what makes "src/db" vs "src/dbtools/" a
#   segment-boundary question (TD-087's prefix-collision shape) while STILL matching "src/db" inside
#   "$here/src/db/migrate.sh" -- an earlier draft required the match to start at the token's own
#   front, which silently missed every `$VAR/literal/path` idiom (this repo's own `conformance.sh`
#   reaching `scripts/lib/conformance-engine.sh` via `$here/...`), caught only by an outside review
#   dispatched per ADR-029, not by any fixture (SPRINT-100 T1). <tgt-core> must already have its
#   trailing "/" stripped.
lf_line_touches() {
  _llt_l=$1; _llt_t=$2
  for _llt_tok in $(printf '%s' "$_llt_l" | tr -c 'A-Za-z0-9_./-' ' '); do
    case "/${_llt_tok%/}/" in
      *"/${_llt_t}/"*) return 0 ;;
    esac
  done
  return 1
}

# lf_is_exclusion_line <line>
#   0 if <line>'s own structure PRUNES whatever path it mentions rather than examining it -- a
#   `grep -v`, a `case … ) continue` arm, or a find-style exclude flag (TD-087). A mention inside one
#   of these reads exactly like a mention inside a comment: present in the text, absent from what the
#   script actually does with it. Closed set of shapes -- see the limits note above this function.
lf_is_exclusion_line() {
  case "$1" in
    *'grep -v'*|*'grep -qv'*|*'grep -vq'*|*'--invert-match'*) return 0 ;;
    *')'*'continue'*) return 0 ;;
    *'--exclude'*|*' -not '*|*'! -path'*|*'! -name'*) return 0 ;;
    *) return 1 ;;
  esac
}

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

[ "$#" -gt 0 ] || { note "verify reaches: no sprint files given -- nothing verified"; exit 0; }

for sp in "$@"; do
  [ -f "$sp" ] || { bad "verify reaches: file not found: $sp"; continue; }
  lf_is_archived_path "$sp" && continue

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

    # A token that is itself one of THIS clause's other named scripts is never a target -- see the
    # two-method limit note above (TD-087: SPRINT-084 T5 named two scripts in one clause and the
    # unfixed checker paired them against each other, each reading as unreachable from the other).
    real_targets=""
    for t in $targets; do
      is_method=0
      for s in $scripts; do
        [ "$t" = "$s" ] && is_method=1 && break
      done
      [ "$is_method" -eq 0 ] && real_targets="$real_targets $t"
    done

    for scr in $scripts; do
      resolved=""
      case "$scr" in
        */*)
          # Fully-qualified: exact path only, unchanged behaviour.
          [ -f "$scr" ] && resolved=$scr
          ;;
        *)
          # Bare basename -- the repo's dominant convention (TD-097). CWD-relative first, so a
          # root-level script (e.g. `conformance.sh`) that already resolved keeps resolving exactly
          # as before; only then the known roots, in this fixed order.
          if [ -f "$scr" ]; then
            resolved=$scr
          else
            for root in scripts scripts/lib evals; do
              if [ -f "$root/$scr" ]; then resolved="$root/$scr"; break; fi
            done
          fi
          ;;
      esac

      if [ -z "$resolved" ]; then
        case "$scr" in
          */*)
            bad "verify-method-absent: $sp -- a Verify: clause names \`$scr\`, which does not exist in this repository. A criterion whose method is absent is a claim with nothing behind it"
            ;;
          *)
            bad "verify-method-unresolvable: $sp -- a Verify: clause names \`$scr\` by basename, and it resolves against neither the current directory nor the known script roots (scripts/, scripts/lib/, evals/). A criterion whose method cannot be located this way is not confirmed absent, only unresolved -- qualify the path, or confirm by hand whether the script still exists"
            ;;
        esac
        filefail=1
        continue
      fi
      scr=$resolved

      for tgt in $real_targets; do
        tgt_core=$(printf '%s' "$tgt" | sed -E 's#/+$##')
        lf_line_touches "$scr" "$tgt_core" && continue

        # Comments are stripped before matching. A script's prose can NAME a path its code never
        # touches -- the self-describing-corpus failure (L-108), and it vouches for exactly the gap
        # this check exists to find. Caught by this file's own fixture on first run: the stand-in
        # checker's explanatory comment mentioned the unreachable target and the must-FAIL case went
        # green. Limit, stated: a trailing inline comment on a code line is still matched.
        content=$(grep -v '^[[:space:]]*#' "$scr" 2>/dev/null)
        reached=0
        while IFS= read -r cline; do
          [ -n "$cline" ] || continue
          lf_line_touches "$cline" "$tgt_core" || continue
          lf_is_exclusion_line "$cline" && continue
          reached=1
          break
        done <<EOF2
$content
EOF2
        if [ "$reached" -eq 1 ]; then
          checked=$(( checked + 1 ))
        else
          bad "verify-does-not-reach-target: $sp -- the criterion claims \`$tgt\` but \`$scr\` never references it as code, at a path boundary, outside an exclusion, so running it proves nothing about that target. Unreachable reads exactly like satisfied (L-136); either name a method whose scope covers it, or state the criterion as a judgment tick"
          filefail=1
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
