#!/usr/bin/env sh
# check-handoff-state.sh -- SPRINT-094 T2 (TASK-325). Tracks a `/handoff`'s repo-side status and
# gates a sprint close over one left unreconciled -- STANDARD Sec 12(b)'s Meeting-notes row prescribes
# "convert outcomes into requirements / ADRs / issues; never commit the raw notes" and lean-flow ships
# no step that performs the conversion. The temp-dir doc itself stays out of the repo (Sec 12(a)/(b) are
# correct and unchanged by this task) -- what was missing is a repo-side STATUS STUB so "was this
# actioned, or still live?" is answerable without opening the temp file or having been in the session.
#
# Owner ruling (G2, recorded in the Execution Log promote entry): the stub is an Execution Log
# `handoff` event where a sprint exists, PLUS one named fallback ledger (root HANDOFF-LEDGER.md,
# create-lazily) for the no-sprint case -- governance work, a /triage pass, a research session. Both
# carry the SAME three-state status so neither path can silently default to `spent`:
#   live     -- a session may still resume it
#   consumed -- a session resumed it and the work continued
#   spent    -- superseded, or the sprint closed past it
#
# THE RULE THIS SCRIPT ENFORCES, AND WHY IT IS THE WHOLE POINT:
#   an UNKNOWN status (the handoff-status field missing, malformed, or its handoff-path missing) is
#   ALWAYS a FAIL, in every context -- it is never read as `spent`. That silent-loss shape is exactly
#   what a "no sprint to log into" gap would produce without the fallback ledger, and it is also what
#   a typo'd or half-written stub produces with one. A sprint closing while a `live` or `consumed`
#   handoff is still outstanding is a SECOND, separate FAIL -- STANDARD Sec 12(b)'s conversion was
#   never performed, so the close is blocked until it is (DoD 2's reconciliation is what a red gate
#   here forces).
#
# The fallback ledger is gated only on UNKNOWN (there is no "close" event for ungoverned work to hook
# a hard block onto); its live/consumed rows are reported and reconciled at the next promote's
# governance review (propose->approve, same shape as TD aging / epic rollup currency).
#
# Both contexts share ONE entry shape and ONE parser, position-anchored (L-108 -- match by shape, not
# substring): a heading line `### <date> | handoff | <summary>` followed, before the next `### `
# heading or EOF, by a `handoff-status:` line and a `handoff-path:` line. Where the SAME handoff-path
# is recorded more than once (a later entry updating an earlier one -- append-only logs are never
# edited in place), the LATEST occurrence by file position is authoritative; earlier ones are not
# separately reported. A record naming no handoff-path cannot be deduplicated against anything and is
# therefore its own permanently-unresolved record, always UNKNOWN.
#
# Usage: sh check-handoff-state.sh <repo-root>
# Prints one PASS/FAIL line per resolved handoff record; exits 1 if any FAIL line was printed, 0
# otherwise. No sprint logs and no ledger at all is a silent skip. Dependency-free POSIX sh.
set -u

root=${1:?usage: check-handoff-state.sh <repo-root>}
[ -d "$root" ] || { echo "FAIL handoff-state: repo root not found at $root"; exit 2; }

fail=0
checked=0
ok()  { checked=$((checked + 1)); printf 'PASS  %s\n' "$1"; }
bad() { checked=$((checked + 1)); fail=1; printf 'FAIL  %s\n' "$1"; }

# Frontmatter value for <key>, first block only (the check-epic-archive.sh convention, TD-087/TD-097's
# reason not to reinvent a second reader for the same shape).
fmv() { awk -v k="$2" 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} $0~"^"k":"{sub("^"k":[ ]*","");print;exit}' "$1"; }

# handoff_records <file> -- "<line>\t<path-or-EMPTY>\t<status-or-EMPTY>" per `handoff` heading block.
handoff_records() {
  awk '
    # A fenced block inside a handoff entry is an EXAMPLE, never the record: without this, an entry
    # quoting the stub format as a reminder has the example captured and its real fields ignored.
    # BOTH CommonMark fence syntaxes count -- guarding only ``` left `~~~` as a full bypass of this
    # very rule. A fence is closed only by its OWN character, so a `~~~` line inside a ``` block is
    # content, not a terminator. Toggling before every other rule also means a `### ` line inside a
    # fence cannot open or close a handoff entry.
    /^[ \t]*(```|~~~)/ {
      m = $0; sub(/^[ \t]*/, "", m); c = substr(m, 1, 1)
      if (!fence) { fence = 1; fchar = c; fline = NR }
      else if (c == fchar) { fence = 0 }
      next
    }
    fence { next }
    # `handoff` anchored as the SECOND pipe-delimited field, tolerating tabs as well as spaces around
    # the keyword, and requiring NO summary after it. Demanding a trailing space made a heading whose
    # `[one-line focus]` placeholder was left blank fall through to the generic `^### ` rule below,
    # which CLOSED the block -- so its real fields were never parsed and the file reported "skip" at
    # exit 0. `[^|]*` cannot cross the first pipe, so a summary that merely CONTAINS `| handoff |`
    # still does not match.
    /^### [^|]*\|[ \t]*handoff[ \t]*\|/ {
      if (inb) { flush() }
      inb = 1; ln = NR; path = ""; status = ""; next
    }
    /^### / { if (inb) { flush() }; inb = 0; next }
    inb && /^handoff-status:[ \t]*/ {
      if (status == "") { status = clean($0, "handoff-status") }
      next
    }
    inb && /^handoff-path:[ \t]*/ {
      if (path == "") { path = clean($0, "handoff-path") }
      next
    }
    END {
      if (inb) { flush() }
      # An unbalanced fence swallowed everything after it, so any handoff entry below is invisible --
      # and invisible is the one outcome a guard may never report as clean. Emitting a pathless record
      # routes it into the UNKNOWN branch both callers already have, which FAILs and is never assumed
      # spent. That is the correct reading: a region the parser could not read has an unknown status.
      if (fence) { printf "%d\t<unreadable: a code fence opened here was never closed>\t\n", fline }
    }
    # Strip the key, trim the ends, then squash any INTERIOR tab to a space. TAB is this format own
    # record delimiter, so a tab inside a value made flush() emit four fields; resolve_latest reads
    # only $1..$3 and would take the path tail-fragment as the status -- a path ending `<tab>spent`
    # turned a live handoff into `PASS ... spent` at exit 0. Squashing keeps the record intact and the
    # status truthful; a squashed status like `live spent` fails status_valid and reports UNKNOWN,
    # which is the safe direction.
    function clean(line, key,   s) {
      s = line; sub("^" key ":[ \t]*", "", s); gsub(/[ \t]+$/, "", s); gsub(/\t/, " ", s); return s
    }
    function flush() { printf "%d\t%s\t%s\n", ln, path, status }
  ' "$1"
}

# resolve_latest -- reads "<line>\t<path>\t<status>" rows on stdin, prints one row per DISTINCT path
# (a blank path is never deduplicated -- each such row is its own record), keeping only the LATEST
# occurrence by line number for a given non-blank path. Input is already in ascending line order
# because the log is append-only, so the last write inside the awk array wins for free.
resolve_latest() {
  awk -F'\t' '
    {
      if ($2 == "") { printf "%d\t%s\t%s\n", $1, $2, $3; next }
      ln[$2] = $1; st[$2] = $3
    }
    END { for (p in ln) printf "%d\t%s\t%s\n", ln[p], p, st[p] }
  '
}

status_valid() { case "$1" in live|consumed|spent) return 0 ;; *) return 1 ;; esac; }

# Records are TAB-joined and an EMPTY field is meaningful (a handoff naming no path is exactly the
# permanently-unresolved record this checker exists to report). TAB is IFS *whitespace* in POSIX, so
# `IFS=<tab> read -r ln path status` COLLAPSES the `\t\t` of an empty path and shifts every later
# field one slot left -- printing `live` in the path slot and `<missing>` in the status slot, i.e. the
# right verdict under the wrong named finding, which is the one thing a must-FAIL fixture exists to
# rule out (L-058). Split by explicit parameter expansion instead, so an empty field stays empty.
TAB=$(printf '\t')
split_rec() {
  rec_ln=${1%%"$TAB"*}
  _rest=${1#*"$TAB"}
  rec_path=${_rest%%"$TAB"*}
  rec_status=${_rest#*"$TAB"}
}

# --- sprint context: docs/sprint/SPRINT-*.md (live) and docs/sprint/archive/SPRINT-*.md (archived),
#     each paired with its Execution Log sibling under logs/ (S9.LOGDIR / S11.LOGPAIR shape) ---------
for plan in "$root"/docs/sprint/SPRINT-*.md "$root"/docs/sprint/archive/SPRINT-*.md; do
  [ -f "$plan" ] || continue
  case "$plan" in *SPRINT-NNN*) continue ;; esac
  planrel=${plan#"$root"/}
  case "$plan" in
    */archive/*) log="$root/docs/sprint/archive/logs/$(basename "$plan")" ;;
    *)           log="$root/docs/sprint/logs/$(basename "$plan")" ;;
  esac
  [ -f "$log" ] || continue
  logrel=${log#"$root"/}
  st=$(fmv "$plan" status)

  recs=$(handoff_records "$log" | resolve_latest)
  [ -n "$recs" ] || continue

  while IFS= read -r rec; do
    [ -n "$rec" ] || continue
    split_rec "$rec"
    ln=$rec_ln; path=$rec_path; status=$rec_status
    pathdisp=${path:-"<no handoff-path recorded>"}
    if [ -z "$path" ] || ! status_valid "$status"; then
      statdisp=${status:-"<missing>"}
      bad "handoff-state: $logrel handoff at line $ln ($pathdisp) carries UNKNOWN status ('$statdisp') -- never assumed spent"
    elif [ "$status" = "spent" ]; then
      ok "handoff-state: $logrel handoff spent at $pathdisp"
    elif [ "$st" = "closed" ]; then
      bad "handoff-state: $planrel closed with a '$status' handoff outstanding ($pathdisp) -- STANDARD Sec 12(b)'s conversion was not performed before close"
    else
      ok "handoff-state: $logrel handoff '$status' at $pathdisp -- not yet reconciled, sprint still active"
    fi
  done <<RECEOF
$recs
RECEOF
done

# --- no-sprint fallback: root HANDOFF-LEDGER.md, create-lazily -- gated on UNKNOWN only, since there
#     is no "close" event here to force reconciliation against; live/consumed rows are reported for
#     the next promote's governance review to reconcile (propose->approve, TD-aging's shape) ----------
ledger="$root/HANDOFF-LEDGER.md"
if [ -f "$ledger" ]; then
  recs=$(handoff_records "$ledger" | resolve_latest)
  if [ -n "$recs" ]; then
    while IFS= read -r rec; do
      [ -n "$rec" ] || continue
      split_rec "$rec"
      ln=$rec_ln; path=$rec_path; status=$rec_status
      pathdisp=${path:-"<no handoff-path recorded>"}
      if [ -z "$path" ] || ! status_valid "$status"; then
        statdisp=${status:-"<missing>"}
        bad "handoff-state: HANDOFF-LEDGER.md entry at line $ln ($pathdisp) carries UNKNOWN status ('$statdisp') -- never assumed spent"
      elif [ "$status" = "spent" ]; then
        ok "handoff-state: HANDOFF-LEDGER.md entry spent at $pathdisp"
      else
        ok "handoff-state: HANDOFF-LEDGER.md entry '$status' at $pathdisp -- reconciled at the next promote governance review"
      fi
    done <<RECEOF
$recs
RECEOF
  fi
fi

[ "$checked" -eq 0 ] && printf '      %s\n' "handoff-state: skip (no handoff records under docs/sprint/ or HANDOFF-LEDGER.md)"
exit $fail
