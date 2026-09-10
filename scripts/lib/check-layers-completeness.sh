#!/usr/bin/env sh
# check-layers-completeness.sh -- derives a second, independently-sourced touched-file/dependency
# set from each task block's own DoD+Acceptance prose and diffs it against that block's
# hand-written `Layers:`/`Depends-on:` declaration (TD-020, L-071, SPRINT-042 T3).
#
# The dispatch preflight's shared-file check reads `Layers:` -- sound logic, unvalidated input.
# A mechanical check over a hand-written manifest validates that manifest's internal consistency,
# never its completeness: an omission from Layers:/Depends-on: looks identical to absence, so only
# a second, independently-derived source can catch it (L-071). This derives one from the same
# prose a human wrote the manifest from. Fails toward over-reporting by design (TD-020): a false
# positive costs a glance, the SPRINT-041 false negative cost a corrupted merge.
#
# Two independent checks per task block:
#   (a) a backtick-quoted, file-shaped token (has a "." extension) named in the block's DoD or
#       Acceptance prose but absent from its Layers: line
#   (b) "TD-NNN" co-occurring with "resolved" anywhere in the block's prose implies the debt
#       ledger TECH-DEBT.md must be in Layers: (the exact SPRINT-041 shape: prose says "TD-019
#       marked ... resolved", never names the file it lives in)
#   (c) another task's id (T<N>) named in the block's prose but absent from its Depends-on: line
#
# --- `Cites:` -- the explicit escape (SPRINT-049 T3, ruling R3/R4) -------------------------------
# Legs (a) and (c) cannot tell a filename the task will TOUCH from one its prose merely CITES, and
# TD-032's proposed narrowing ("scan DoD/Acceptance lines only, not the rationale paragraph") is
# refuted by its own evidence: replaying all 11 revisions of the SPRINT-048 Plan shows every false
# positive sitting INSIDE a DoD checkbox item -- `fog-fleet-orchestration.md` cited as a source read,
# `requirements.md` cited while explaining a pipeline, `T6` cited in a retrospective note. The
# discriminator is the token's ROLE in the sentence, which no line-scoped filter separates.
#
# Leg (a) still earns a FAIL rather than a WARN because it is the only validation of `Layers:` that
# runs BEFORE any file changes, and the worktree dispatch ownership map is derived from `Layers:` at
# promote. The observed checker (check-layers-observed.sh) cannot substitute: it fires post-hoc,
# after the collision it exists to prevent. So the author declares intent instead of rewording the
# documentation to keep the gate quiet -- which is the behaviour TD-032 recorded, ~11 times in one
# sprint, as the check actively making docs worse.
#
#   Cites: `fog-fleet-orchestration.md` `requirements.md` T6 T7
#
# One optional line per task block, beside Layers:/Depends-on:. A token listed there is exempt from
# (a)/(c) for that block only. ABSENCE CHANGES NOTHING -- an unescaped mention still FAILs, so the
# escape is opt-in and an author who forgets it gets today's behaviour, never a silent pass (L-071:
# an omission must not look like absence).
#
# The escape cannot become a blanket silencer: a token in BOTH Cites: and Layers: is contradictory
# -- the block claims to touch it and to merely cite it -- and is its own named FAIL. Whether a
# Cites: token was nonetheless CHANGED is not knowable here (this checker reads text, not history);
# that is check-layers-observed.sh's job, which attributes real changes per task.
#
# --- multi-line declarations --------------------------------------------------------------------
# A declaration continues onto following lines that are INDENTED, matching how TODO.md task entries
# already wrap. Previously only `grep -E '^Layers:'` was read, so a wrapped declaration silently kept
# its first line and every path on the continuation became simultaneously undeclared AND
# prose-implied -- a cascade of false positives under a misleading finding (this is what failed at
# the SPRINT-049 promote and was first mis-diagnosed as TD-032's prose-mention shape). A continuation
# left at column 0 is NOT silently reclassified as prose: it is its own named FAIL, because that is
# precisely the shape whose finding used to mislead.
#
# Usage: sh check-layers-completeness.sh <sprint-plan.md> [<sprint-plan.md> ...]
# Only files whose frontmatter `status:` is `active` are checked; a non-active, malformed, or
# missing file is silently skipped (not a FAIL) -- safe to run unconditionally over every
# docs/sprint/SPRINT-*.md. Prints one PASS/FAIL line per check per task block; exits 1 if any FAIL
# line was printed, 0 otherwise. Dependency-free POSIX sh -- no jq, no bashisms.
set -u

fmv() { awk -v k="$2" 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} $0~"^"k":"{sub("^"k":[ ]*","");print;exit}' "$1"; }

# --- ONE extractor, shared with check-layers-observed.sh (TD-142, ruled 2026-09-10) ----------------
# Both checkers used to carry the comment "kept deliberately identical ... a parsing rule that
# differs between them would make one of the two lie" while running two DIFFERENT parsers:
# check-layers-observed.sh's task_decls() extracted only backtick-quoted tokens; this file tested
# membership with `grep -qF` against the raw Layers: line -- a SUBSTRING test, backtick-agnostic,
# that read a token as "declared" if it merely appeared anywhere in the line (inside a longer path,
# or a trailing comment). One of the two was lying, and it was this file (L-108's shape: a guard
# matched by substring instead of by shape, failing GREEN).
#
# The ruling: a declaration is backtick-delimited. Rather than re-typing the (now-strict) extraction
# here as a second copy that can drift again, this file sources check-layers-observed.sh to reach its
# ONE definition of layers_tokens() -- the comment above is enforced by construction, not by
# discipline. LAYERS_OBSERVED_SOURCED tells that file to define its functions and stop, never running
# its own `for sp in "$@"` main loop or its bare-invocation guard against THIS file's "$@".
_layers_completeness_self_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
LAYERS_OBSERVED_SOURCED=1
. "$_layers_completeness_self_dir/check-layers-observed.sh"
unset LAYERS_OBSERVED_SOURCED

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

# A bare invocation (no sprint files) previously fell straight into `for sp in "$@"` over an empty
# list: zero output, exit 0 -- reading as a silent pass rather than "nothing was checked" (TD-056,
# one of exactly two check-*.sh sharing this shape). Cure matches check-gates-signed.sh's note-line.
[ "$#" -gt 0 ] || { note "layers completeness: no sprint files given -- nothing verified"; exit 0; }

# Classify every line of a task block as a declaration line (its key), a stray continuation, or
# prose. Emits "<tag>|<text>" where tag is one of: Layers | Depends-on | Cites | STRAY | P.
# A line indented under a declaration continues it; a column-0 line starting with a backtick
# immediately after a declaration is a STRAY -- an unindented continuation the author expected to
# be read (see header).
classify() {
  printf '%s\n' "$1" | awk '
    /^### / { cur=""; next }
    /^(Layers|Depends-on|Cites):[ \t]*/ {
      cur=$0; sub(/:.*/,"",cur); line=$0; sub(/^[^:]*:[ \t]*/,"",line)
      print cur "|" line; next
    }
    cur != "" && /^[ \t]+[^ \t]/ { line=$0; sub(/^[ \t]+/,"",line); print cur "|" line; next }
    cur != "" && /^`/ { print "STRAY|" cur; cur=""; print "P|" $0; next }
    { cur=""; print "P|" $0 }
  '
}

# Pull the joined value of one declaration key out of classified block text.
declval() { printf '%s\n' "$1" | sed -n "s/^$2|//p" | tr '\n' ' '; }

check_block() {
  # $1=sprint-file $2=tid (e.g. "### T1") $3=block-text (header line through the next header)
  sp=$1; tid=$2; blk=$3
  tshort=$(printf '%s' "$tid" | grep -oE 'T[0-9]+')
  cls=$(classify "$blk")

  layers_line=$(declval "$cls" 'Layers')
  deps_line=$(declval "$cls" 'Depends-on')
  cites_line=$(declval "$cls" 'Cites')
  # prose = everything not part of a declaration, so a declaration is never diffed against itself.
  prose=$(printf '%s\n' "$cls" | sed -n 's/^P|//p')

  # -- unindented continuation: named, never silently folded into prose ----------------------
  strays=$(printf '%s\n' "$cls" | sed -n 's/^STRAY|//p' | sort -u | tr '\n' ' ')
  if [ -n "$(printf '%s' "$strays" | tr -d ' ')" ]; then
    bad "$sp $tid declaration continuation: a wrapped ${strays}line must be indented to continue; at column 0 it reads as prose"
  fi

  cites_toks=$(layers_tokens "$cites_line" | sort -u)
  cites_tids=$(printf '%s' "$cites_line" | grep -oE '\bT[0-9]+\b' | sort -u)

  # THE single extraction of what Layers: actually declares (TD-142) -- shared with
  # check-layers-observed.sh via layers_tokens(), sourced above. Every membership test below reads
  # this list with an EXACT match (`grep -qxF`), never a substring test against the raw line: a
  # substring test is what let a DoD-implied token read as "declared" merely because it happened to
  # appear inside a longer declared path, or inside a trailing comment on the Layers: line (L-108's
  # shape, failing GREEN -- this was the bug TD-142 named).
  layers_toks=$(layers_tokens "$layers_line" | sort -u)

  # -- Cites:/Layers: contradiction -- the escape must not double as a declaration ------------
  contra=""
  for c in $cites_toks; do
    printf '%s\n' "$layers_toks" | grep -qxF "$c" && contra="$contra $c"
  done
  if [ -n "$contra" ]; then
    bad "$sp $tid Cites/Layers contradiction:$contra declared as touched AND escaped as merely cited"
  fi

  # -- (a)+(b): file-shaped tokens named in prose, absent from Layers: -----------------------
  # A declared token ending in "/" is a DIRECTORY prefix covering every path beneath it (SPRINT-055
  # T1). Before that, such a token was accepted and could never match anything, so it read as a
  # declaration while guarding zero files -- the silent-false-negative shape L-058 is about. Filtered
  # from the SAME layers_toks list above rather than a second, separately-anchored grep, so the two
  # checks (is it declared at all? is it declared as a directory?) can never disagree on what a
  # token IS.
  miss_f=""
  layers_dirs=$(printf '%s\n' "$layers_toks" | grep '/$')
  covered_by_dir() { # <path>
    for _d in $layers_dirs; do
      case "$1" in "$_d"*) return 0 ;; esac
    done
    return 1
  }
  toks=$(printf '%s' "$prose" | grep -oE '`[A-Za-z0-9_./-]+\.[A-Za-z]+`' | tr -d '`' | sort -u)
  for t in $toks; do
    printf '%s\n' "$layers_toks" | grep -qxF "$t" && continue
    covered_by_dir "$t" && continue
    printf '%s\n' "$cites_toks" | grep -qxF "$t" && continue
    miss_f="$miss_f $t"
  done
  if printf '%s' "$prose" | grep -qE 'TD-[0-9]+' && printf '%s' "$prose" | grep -qi 'resolved'; then
    if ! printf '%s\n' "$layers_toks" | grep -qxF 'TECH-DEBT.md'; then
      printf '%s\n' "$cites_toks" | grep -qxF 'TECH-DEBT.md' || miss_f="$miss_f TECH-DEBT.md(TD-marked-resolved)"
    fi
  fi
  if [ -n "$miss_f" ]
  then bad "$sp $tid Layers completeness: DoD/Acceptance implies$miss_f, absent from Layers: -- if the prose only cites it rather than touching it, declare it on a Cites: line"
  else ok  "$sp $tid Layers completeness (DoD-implied files all declared)"
  fi

  # -- (d) NEW: a FILE-shaped token written in Layers: OUTSIDE backticks (TD-142 ruling, DoD item 3) -
  # A declaration is backtick-delimited by the ruling above -- an unbackticked path-shaped string in
  # Layers: is therefore NOT a declaration to either checker, but it IS still a declaration to the
  # dispatch preflight's backtick-agnostic TOK extraction (see check-layers-observed.sh's BOUNDARY
  # note above its covers() function). Left unreported, that is a silent three-way disagreement: both
  # checkers would read "nothing declared here" while the preflight reads "declared, shared-file-
  # checked". Detected by stripping every backtick-quoted span out of the raw line first, so a
  # LEGITIMATE backtick-quoted declaration never trips this -- only text that was never inside
  # backticks to begin with.
  #
  # SCOPED to FILE-shaped tokens (dot-extension), the same character class the (a) leg above already
  # uses for prose-implied tokens -- deliberately NOT the preflight's own two-alternative TOK, whose
  # second arm (`[A-Za-z0-9_.-][A-Za-z0-9_./-]*/`, a bare DIRECTORY token with no dot) would also match
  # ordinary parenthetical prose on a Layers: line ("... (see also evals/fixtures/foo)" reads a
  # directory-shaped run ending before the closing paren) -- exactly the over-eager-gate cost TD-032
  # was filed to stop. TD-142's own counted evidence is file-shaped paths throughout (TECH-DEBT.md,
  # *.sh); a bare, unbackticked DIRECTORY token is a real but narrower residual gap this leg does not
  # close, left for a future task if it is ever observed in practice.
  layers_bare=$(printf '%s' "$layers_line" | sed -E 's/`[^`]*`//g' | grep -oE '[A-Za-z0-9_./-]+\.[A-Za-z]+' | sort -u)
  if [ -n "$layers_bare" ]; then
    bad "$sp $tid layers-unbackticked-token: declares a path-shaped token outside backticks ($(printf '%s' "$layers_bare" | tr '\n' ' ')); a declaration is backtick-delimited, so this reads as prose to both checkers and as a declaration to the dispatch preflight"
  fi

  # -- (c): other task ids named in prose, absent from Depends-on: ---------------------------
  miss_d=""
  oids=$(printf '%s' "$prose" | grep -oE '\bT[0-9]+\b' | sort -u)
  for o in $oids; do
    [ "$o" = "$tshort" ] && continue
    printf '%s' "$deps_line" | grep -qE "\b$o\b" && continue
    printf '%s\n' "$cites_tids" | grep -qxF "$o" && continue
    miss_d="$miss_d $o"
  done
  if [ -n "$miss_d" ]
  then bad "$sp $tid Depends-on completeness: DoD/Acceptance references$miss_d, absent from Depends-on: -- if the prose only cites that task rather than depending on it, declare it on a Cites: line"
  else ok  "$sp $tid Depends-on completeness (prose-referenced tasks all declared)"
  fi
}

for sp in "$@"; do
  [ -f "$sp" ] || { printf 'FAIL  %s\n' "layers-completeness: file not found: $sp"; fail=1; continue; }
  # Scoped by LOCATION, not by `status:` (SPRINT-056 T4, TD-042). Gating on `status = active` meant
  # writing `status: closed` disarmed this check in the very commit that makes the largest edit to
  # the file -- the Retro, the four-bucket routing and close_commit all landed unvalidated. Twice
  # measured: 72->68 pass at SPRINT-054's close, 94->87 at SPRINT-055's, both reporting 0 fail.
  # §11's retention pass MOVES a closed sprint to archive/ in a SEPARATE, later commit, so keying on
  # location keeps the close commit covered (the file is still here) while archived history stays
  # out of scope -- which was always the defensible half. The ordering problem dissolves rather than
  # needing pre-flip content reconstructed.
  case "$sp" in */archive/*) continue ;; esac
  plan=$(awk '/^## Plan/{f=1;next} /^## /{f=0} f' "$sp")
  tid=""; blk=""
  while IFS= read -r line; do
    case "$line" in
      "### "*)
        [ -n "$tid" ] && check_block "$sp" "$tid" "$blk"
        tid=$(printf '%s' "$line" | grep -oE '^### T[0-9]+')
        blk="$line"
        ;;
      *)
        blk="$blk
$line"
        ;;
    esac
  done <<PLANEOF
$plan
PLANEOF
  [ -n "$tid" ] && check_block "$sp" "$tid" "$blk"
done

exit $fail
