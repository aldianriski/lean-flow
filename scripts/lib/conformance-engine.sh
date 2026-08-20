#!/usr/bin/env sh
# conformance-engine.sh -- the engine core: mark-driven dispatch across EVERY `## §N` section's
# Conformance rules, producing a report that states a LEVEL and named findings -- never a score
# (SPRINT-075 T2). Generalises check-attestation.sh's §13-only dispatch loop (SPRINT-074 T2) from one
# section's five rules to all 13 sections' 100 (EPIC-004 D1/D2).
#
# --- what this file is, and what it deliberately is not --------------------------------------------
# The DRIVER lives here: read every rule via read-spec-rules.sh, decide from its MARK column whether
# to evaluate it, dispatch mechanical/split rules to an `assert_<id>` function if one is registered,
# and report. It ships with NO registered assertions of its own -- SPRINT-075 T4 folds in
# `S9.GATESWELLFORMED`/`S9.GATESABSENT` (replacing check-gates-signed.sh), T6 folds in the
# ownership-header family, and every later family follows the same shape: append `assert_<ID>`
# functions below the marker, never re-implement the loop. A mechanical (or split) rule with none
# registered is a GAP, reported as `rule-unimplemented` -- never silently skipped (L-058). With 43
# `build` dispositions and only what later tasks add actually wired, this fires often at first; that
# is the report's most useful content while coverage grows, not a defect in the driver.
#
# --- the correctness claim, and how it is proven ----------------------------------------------------
# Inclusion is driven by the spec's MARK COLUMN, never by an id list this file remembers. Proof: copy
# the spec, flip one rule's mark, run again with --spec pointing at the copy -- behaviour changes with
# no code edit (evals/run-conformance-engine-fixtures.sh, the same shape SPRINT-074 used for §13).
# `judgment-only` and `implementation-directed` rules are NEVER evaluated against a repository -- §14
# is explicit that doing so produces findings no adopter can ever clear. They are reported as excluded,
# named by mark, and never appear as a PASS/FAIL verdict line.
#
# --- levels, and what "the next one" means -----------------------------------------------------------
# §14 defines three levels in increasing strictness of evidence: Structural < Gated < Attested. This
# engine's aggregate level is the highest one fully cleared: every DISPATCHED (mechanical/split) rule
# at that level or below passed. judgment-only/implementation-directed rules never enter this
# arithmetic -- they are not debt (§14). The closing line names the level reached and points at the
# FAIL lines above that block the next one; it never computes or prints a ratio, score, grade or
# percentage anywhere (§14 forbids this normatively -- a ratio improves whenever the standard declines
# to automate something, which is exactly backwards).
#
# --- packaging (D1: standalone-capable AND plugin-bundled, one implementation, two entry points) ----
# The spec defaults to the copy shipped BESIDE this script, resolved relative to the script itself --
# not to the repository under test, which is an adopter's and has no reason to vendor a copy of the
# standard it is being measured against (copied from check-attestation.sh's proven approach). The two
# entry points are conformance.sh (repo root, for a standalone/adopter invocation) and
# scripts/qa-check.sh (this repo's own gate) -- both call this same file. `--spec` overrides for a
# repo that vendors its own version.
#
# Usage: sh conformance-engine.sh <repo-dir> [--spec <path/to/STANDARD.md>]
# Prints one line per rule (PASS/FAIL/note) plus a closing `level:` line; exits 1 if any FAIL line was
# printed, 0 otherwise. Dependency-free POSIX sh -- no jq, no bashisms.
set -u

fail=0
n_gap=0
last_bad=0
# `last_ok` is the counterpart `last_bad` needed and did not have. Without it the driver inferred
# "passed" from "did not fail", which silently counts a THIRD outcome as a pass: an assertion that
# legitimately emits only notes. S9.GATESABSENT on an absent field is exactly that -- §9 states it as
# "field absent => NOT SIGNED, never approval", so it may not report a pass, and the engine was
# counting it as one and reaching `level: Attested` on an unsigned sprint (SPRINT-075 T4 review).
last_ok=0
ok()   { last_ok=1; printf 'PASS  %s\n' "$1"; }
# `last_bad` is reset before each dispatch call and read right after -- `fail` alone cannot tell a
# caller whether THIS call failed once a prior call has already set it (a boolean flag has no memory
# of which call flipped it), which is what the per-level counters below need to know.
bad()  { fail=1; last_bad=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }
# `gap` is a THIRD verdict class, and the distinction it draws is the one SPRINT-075 T3 was created to
# find. A `rule-unimplemented` is a statement about THIS ENGINE, never about the repository under test.
# Reported as FAIL it entered the adopter's level arithmetic and set the adopter's exit code, so the
# first run against a repo that never installed lean-flow returned 58 FAIL lines -- 56 of them our own
# missing assertions, 2 of them findings about their repo -- under a headline reading "level: none, 41
# findings prevent Structural". Their repo had two. That report is about our roadmap wearing their
# repo's name, and a level that moves when WE ship a checker is not a property of their tree.
# So a gap is still named, every time, never silently skipped (L-058 is untouched -- silence was never
# the alternative); it simply stops being counted against the thing it says nothing about. Engine
# coverage gets its own line in the report instead (owner ruling, SPRINT-075 T3).
last_gap=0
gap()  { last_gap=1; n_gap=$((n_gap + 1)); printf 'GAP   %s\n' "$1"; }

# --- arguments ---------------------------------------------------------------------------------
repo=""; spec=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --spec) shift; spec=${1:-} ;;
    -h|--help) printf 'usage: sh conformance-engine.sh <repo-dir> [--spec <STANDARD.md>]\n'; exit 0 ;;
    *) [ -n "$repo" ] || repo=$1 ;;
  esac
  shift
done
[ -n "$repo" ] || { bad "conformance: usage -- sh conformance-engine.sh <repo-dir> [--spec <STANDARD.md>]"; exit 1; }
[ -d "$repo" ] || { bad "conformance: repo directory not found: $repo"; exit 1; }
repo_abs=$(CDPATH= cd -- "$repo" && pwd)

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
[ -n "$spec" ] || spec="$here/../../spec/STANDARD.md"
reader="$here/read-spec-rules.sh"

# Checked explicitly rather than left to fail through, matching check-attestation.sh: a MISSING
# reader must not be misread as a bad spec.
[ -f "$reader" ] || { bad "conformance: reader-missing -- $reader not found beside this script; the rule set is read through read-spec-rules.sh and this engine does not carry its own copy of the parse"; exit 1; }

# --- rule source: every `## §N` Conformance table, document order --------------------------------
rules=$(sh "$reader" "$spec" 2>/dev/null); reader_rc=$?
if [ "$reader_rc" -ne 0 ] || [ -z "$rules" ]; then
  bad "conformance: spec-table-unreadable -- no Conformance rows parsed from $spec. An engine that cannot read its rule source checks NOTHING; that is reported here rather than exiting clean (L-058)"
  exit 1
fi
n_rules=$(printf '%s\n' "$rules" | wc -l | tr -d ' ')

printf '=== conformance -- %s ===\n' "$repo_abs"
note "rule source: $spec -- $n_rules rules read across every section. Rule set and marks are the spec's; assertion bodies are this engine's, registered per id below"

# ==================================================================================================
# ASSERTION REGISTRY -- assert_<id with . as _> functions. None shipped by T2 (the driver only);
# later tasks append theirs between this block and the DRIVER below (a function must be DEFINED
# before the loop that calls it runs, so it belongs here, never after). The line below is a stable
# insertion anchor a fixture can awk/sed after, the same convention as evals/lib/harness-common.sh's
# anchor extraction.
# registry:insert-point

# --- §9 gates-signed family (SPRINT-075 T4) -------------------------------------------------------
# Migrated from scripts/lib/check-gates-signed.sh (now deleted), which guarded a specific failure:
# a MISSING `gates_signed:` field being treated as approval. An unattended run reads the sprint file
# and nothing else, so a sign-off held only in a session transcript is invisible to it (L-099). Its
# three states stay distinct across the two rule ids the spec's §9 table publishes for this field:
#
#   field absent               -> S9.GATESABSENT reports NOT SIGNED. Never a FAIL of this rule -- a
#                                  sprint may legitimately sit unsigned between promote and the gate
#                                  pass -- but never rendered as a pass either.
#   field present, garbled     -> S9.GATESWELLFORMED FAILs. A record nobody can parse looks like
#                                  evidence and is worse than none.
#   field present, well-formed -> S9.GATESWELLFORMED PASSes, naming the gates and the commit.
#
# An unfilled template placeholder (`gates_signed: [G1,G2 @ <sha> ...]`) counts as ABSENT, not as a
# value -- the template ships the field commented-out-by-placeholder, and without this an unfilled
# template would bless a sprint nobody signed.

# _s9_gates_fmv <file> -- the frontmatter value of `gates_signed:`; empty for both a genuinely absent
# field and an unfilled template placeholder (both read as absence, never as a value).
_s9_gates_fmv() {
  v=$(awk -v k=gates_signed 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} $0~"^"k":"{sub("^"k":[ ]*","");print;exit}' "$1")
  case "$v" in "["*) v="" ;; esac
  printf '%s' "$v"
}

# _s9_active_sprints <repo> -- docs/sprint/SPRINT-*.md paths, repo-relative, one per line. The glob is
# NON-RECURSIVE (S9.LOGDIR: load-bearing) so docs/sprint/archive/ is excluded by construction; the
# explicit path guard below is defence in depth, matching check-gates-signed.sh's stated scoping --
# a closed sprint is history and its record is not re-litigated.
_s9_active_sprints() {
  for f in "$1"/docs/sprint/SPRINT-*.md; do
    [ -f "$f" ] || continue
    case "$f" in */archive/*) continue ;; esac
    printf '%s\n' "docs/sprint/${f##*/}"
  done
}

assert_S9_GATESWELLFORMED() {
  repo=$1
  files=$(_s9_active_sprints "$repo")
  if [ -z "$files" ]; then
    note "S9.GATESWELLFORMED  -- no active sprint files under docs/sprint/*.md (docs/sprint/archive/ is out of scope) -- nothing to verify"
    return
  fi
  saved_ifs9=$IFS
  IFS='
'
  for sp in $files; do
    IFS=$saved_ifs9
    gs=$(_s9_gates_fmv "$repo/$sp")
    if [ -z "$gs" ]; then
      note "gates-signed: $sp -- not evaluated by S9.GATESWELLFORMED: field absent or an unfilled template placeholder (see S9.GATESABSENT)"
      IFS='
'
      continue
    fi
    gates=$(printf '%s' "$gs" | sed -n 's/^\([^@]*\)@.*/\1/p' | tr -d ' ')
    sha=$(printf '%s' "$gs" | sed -n 's/^[^@]*@[ ]*\([0-9a-f]\{7,40\}\).*/\1/p')
    if [ -z "$gates" ] || [ -z "$sha" ]; then
      bad "gates-signed: $sp -- malformed gates_signed: '$gs' (want '<GATE>[,<GATE>] @ <sha>'); a record nobody can parse looks like evidence and is worse than none"
      IFS='
'
      continue
    fi
    case "$gates" in
      *[!G0-9,]*)
        bad "gates-signed: $sp -- unrecognised gate token in '$gates' (want G1 / G2, comma-separated)"
        IFS='
'
        continue
        ;;
    esac
    ok "gates-signed: $sp -- $gates signed @ $sha"
    IFS='
'
  done
  IFS=$saved_ifs9
}

assert_S9_GATESABSENT() {
  repo=$1
  files=$(_s9_active_sprints "$repo")
  if [ -z "$files" ]; then
    note "S9.GATESABSENT      -- no active sprint files under docs/sprint/*.md (docs/sprint/archive/ is out of scope) -- nothing to verify"
    return
  fi
  saved_ifs9=$IFS
  IFS='
'
  for sp in $files; do
    IFS=$saved_ifs9
    gs=$(_s9_gates_fmv "$repo/$sp")
    if [ -z "$gs" ]; then
      # `note`, NOT `ok` -- and this is the whole rule, not a formatting preference. §9's row states
      # S9.GATESABSENT as "field absent => NOT SIGNED, never approval", and the checker this migrated
      # from used note() for the same reason its header spells out: absence is REPORTED, never a FAIL
      # (a sprint legitimately sits unsigned between promote and the gate pass) and never a pass
      # either. Emitting `PASS  ... NOT SIGNED ...` renders an unsigned sprint as approved to anything
      # reading verdict labels, and carries it into the summary as a level the repo has not earned --
      # which is the rendering the rule exists to forbid. The finding TEXT alone is not the contract;
      # its verdict class is part of it (SPRINT-075 T4, caught in coordinator review).
      note "gates-signed: $sp -- NOT SIGNED (no gates_signed: field). An unattended run must treat this as unsigned, never as approval"
    else
      note "gates-signed: $sp -- not evaluated by S9.GATESABSENT: field present (see S9.GATESWELLFORMED)"
    fi
    IFS='
'
  done
  IFS=$saved_ifs9
}

# --- §1/§3 ownership-header family (SPRINT-075 T6) ------------------------------------------------
# The first NEW coverage the engine adds -- four rules, five finding names already published in
# docs/research/conformance-dispositions.md § build. This task CONSUMES that contract; it does not
# choose it (L-058: a check specified without its finding name is a half-shipped gate).
#
#   S1.LAW2   -> owner-not-a-role
#   S1.LAW3   -> update-trigger-absent                 (the mechanical half of a split)
#   S3.SCHEMA -> ownership-header-missing · ownership-header-field-missing
#   S3.AGENTS -> agents-ownership-footer-missing
#
# Chosen for reach rather than for ease: every repository containing documents has an ownership-header
# surface, which is what lets a report against a repo that never installed lean-flow say something
# instead of nothing.
#
# --- the doc set, and the three exceptions --------------------------------------------------------
# §3 says the header is mandatory on "every doc"; §2 says which files are docs. Evaluated here: every
# *.md under docs/, plus the §2 core files at the root and in .claude/ that actually exist. A repo
# keeping its docs elsewhere is not silently under-reported -- the empty case is stated, not skipped.
# NOT evaluated, each for a written reason:
#
#   README.md · AGENTS.md at the REPO ROOT -- §3's two stated exceptions: the front-door and the
#                         thin-pointer file each carry a footer <sub> line instead of a YAML block.
#                         S3.README and S3.AGENTS own them. Scoped to the ROOT deliberately: an
#                         earlier draft excluded */README.md and */AGENTS.md at any depth, which also
#                         swallowed docs/strategy/adlc/README.md -- a nested doc, not a front-door.
#                         Caught by an independent census disagreeing by exactly one (14 vs 15); a
#                         too-broad exclusion fails GREEN, which is the L-058 shape.
#   docs/adr/ADR-*.md  -- the UNSTATED third case, ruled at SPRINT-075 T6. §4 ships an ADR template
#                         whose frontmatter is id/tags/domain/status/related -- the ADR-009 knowledge
#                         metadata -- carrying no owner:/last_updated:/update_trigger:. Reporting ADRs
#                         against §3 would tell an adopter to break the standard's own template, and
#                         costs 27 findings on the reference implementation alone. The exemption is
#                         NAMED in the report rather than applied silently, and the spec gap (§3 owes
#                         an explicit ADR row, the way it spells out README and AGENTS.md) is filed as
#                         a follow-up. A checker's silence is not where a spec question gets settled.
#   */templates/*, SKILL.md -- a template is an artefact a doc is generated FROM, and a SKILL.md is a
#                         skill definition governed by §2's skill rows. Neither is a doc under §3.

# --- the role vocabulary ---------------------------------------------------------------------------
# §14 marks S1.LAW2 `mechanical` -- "one owner: field, value in a role vocabulary" -- but the spec
# publishes no vocabulary, and §7's S7.PERSON states the same distinction as "mechanical against a role
# vocabulary, judged without one". The vocabulary is therefore the thing that has to exist for the mark
# to hold, so the engine ships one. A repo declares its own in `.conformance-roles` (one role per line,
# blank lines and # comments ignored); a declared file REPLACES the default rather than extending it,
# so a repo that means "only these roles" can say exactly that. Matching is case-insensitive and
# whole-value -- a substring match would accept "Alice, Maintainer" as a role (L-108).
_OWN_DEFAULT_ROLES='Maintainer
Maintainers
Owner
Owners
Team
Tech Lead
Lead
Platform
Platform Team
Engineering
Docs
Product
Security
Architect
Core Team'

_own_roles() {
  if [ -f "$1/.conformance-roles" ]; then
    grep -v '^[[:space:]]*#' "$1/.conformance-roles" | grep -v '^[[:space:]]*$'
  else
    printf '%s\n' "$_OWN_DEFAULT_ROLES"
  fi
}

# _own_docs <repo> -- the doc set above, repo-relative, one per line, sorted. Cached: the three
# assertions below each need it, and walking the tree once per rule was a third of the original cost.
_OWN_DOCS_CACHE=""
_OWN_DOCS_DONE=0
_own_docs() {
  if [ "$_OWN_DOCS_DONE" -eq 1 ]; then printf '%s' "$_OWN_DOCS_CACHE"; return; fi
  r=$1
  _OWN_DOCS_CACHE=$({
    for c in TODO.md TECH-DEBT.md CHANGELOG.md CONTRIBUTING.md SECURITY.md \
             CLAUDE.md CONTEXT.md .claude/CLAUDE.md .claude/CONTEXT.md; do
      [ -f "$r/$c" ] && printf '%s\n' "$c"
    done
    find "$r/docs" -type f -name '*.md' 2>/dev/null | while IFS= read -r f; do
      rel=${f#"$r"/}
      case "$rel" in
        docs/adr/ADR-*.md) continue ;;
        */templates/*)     continue ;;
        */SKILL.md)        continue ;;
      esac
      printf '%s\n' "$rel"
    done
  } | sort)
  _OWN_DOCS_DONE=1
  printf '%s' "$_OWN_DOCS_CACHE"
}

# _own_adr_count <repo> -- how many ADRs the exemption above covered, so the report can name it.
_own_adr_count() {
  n=0
  for f in "$1"/docs/adr/ADR-*.md; do [ -f "$f" ] && n=$((n + 1)); done
  printf '%s' "$n"
}

# --- ONE pass over the doc set, cached ------------------------------------------------------------
# The first version of this family walked the tree once per rule and spawned an awk PER FIELD PER DOC:
# roughly 2,800 processes on this repository, which took the engine from seconds to minutes and stalled
# the gate leg that runs it. Process spawn is the whole cost, so the fix is to stop spawning: one walk
# and one awk per doc, read once into caches the three assertions share.
#
# Caches rather than parameters because the three assert_* functions are dispatched independently by the
# driver -- they cannot hand each other a value, and the driver has no business knowing that this family
# would like to share one. First call fills them; the rest read them.
#
# Deliberately NOT a single awk over all files at once (one process instead of ~236). That version needs
# a cross-file state machine and silently drops a zero-byte file, because awk never reaches FNR==1 for
# one -- a doc missing from the scan is a doc no rule reports on, which is the silent skip this engine
# exists to prevent (L-058). This version is fast enough and cannot lose a row.
#
# The awk emits ready-made lists rather than a row to be re-parsed downstream: splitting a row per doc
# per rule in the shell would have put the spawns straight back.
_OWN_SCAN_DONE=0
_OWN_N_DOCS=0        # every doc considered
_OWN_NOHDR=""        # paths with no `---` frontmatter block at all
_OWN_FIELDMISS=""    # "path --<space-joined missing fields>" for headers that are incomplete
_OWN_OWNERS=""       # "path<TAB>owner-value", only for docs that actually carry one
_OWN_NOTRIG=""       # paths with no update_trigger: (header absent, or field absent)
_OWN_N_TRIG=0        # docs that DO declare one

_own_scan() {
  [ "$_OWN_SCAN_DONE" -eq 1 ] && return
  r=$1
  docs=$(_own_docs "$r")
  [ -n "$docs" ] || { _OWN_SCAN_DONE=1; return; }
  saved_ifs_s=$IFS
  IFS='
'
  for d in $docs; do
    IFS=$saved_ifs_s
    _OWN_N_DOCS=$((_OWN_N_DOCS + 1))
    row=$(awk '
      NR == 1 { if ($0 != "---") { print "nohdr"; exit } infm = 1; next }
      infm && $0 == "---" { exit }
      infm {
        if ($0 ~ /^owner:/)               { v = $0; sub(/^owner:[ ]*/, "", v);          owner = v }
        else if ($0 ~ /^update_trigger:/) { v = $0; sub(/^update_trigger:[ ]*/, "", v); upd = v }
        else if ($0 ~ /^last_updated:/)   { v = $0; sub(/^last_updated:[ ]*/, "", v);   lu = v }
        else if ($0 ~ /^status:/)         { v = $0; sub(/^status:[ ]*/, "", v);         st = v }
      }
      END {
        if (NR == 0) { print "nohdr"; exit }
        if (!infm && owner == "" && lu == "" && upd == "" && st == "" && NR == 1) { print "nohdr"; exit }
        miss = ""
        if (owner == "") miss = miss " owner"
        if (lu    == "") miss = miss " last_updated"
        if (upd   == "") miss = miss " update_trigger"
        if (st    == "") miss = miss " status"
        print "owner\t" owner
        print "upd\t" upd
        print "miss\t" miss
      }
    ' "$r/$d")
    case "$row" in
      nohdr*)
        _OWN_NOHDR="$_OWN_NOHDR$d
"
        _OWN_NOTRIG="$_OWN_NOTRIG$d
"
        ;;
      *)
        o=${row#owner	}; o=${o%%
*}
        u=${row#*upd	}; u=${u%%
*}
        m=${row#*miss	}; m=${m%%
*}
        [ -n "$o" ] && _OWN_OWNERS="$_OWN_OWNERS$d	$o
"
        if [ -n "$u" ]; then
          _OWN_N_TRIG=$((_OWN_N_TRIG + 1))
        else
          _OWN_NOTRIG="$_OWN_NOTRIG$d
"
        fi
        [ -n "$m" ] && _OWN_FIELDMISS="$_OWN_FIELDMISS$d --$m
"
        ;;
    esac
    IFS='
'
  done
  IFS=$saved_ifs_s
  _OWN_SCAN_DONE=1
}

assert_S3_SCHEMA() {
  repo=$1
  nadr=$(_own_adr_count "$repo")
  # The exemption is announced BEFORE the empty-doc-set return, not after it. A repo whose only
  # documents are ADRs has an empty doc set here, and reporting "no documents found" while silently
  # skipping 27 files states the opposite of what happened -- caught by the adr-exempt fixture, which
  # is the one case where the two paths differ (L-103).
  [ "$nadr" -gt 0 ] && note "S3.SCHEMA           -- $nadr docs/adr/ADR-*.md exempt: §4's template carries ADR-009 knowledge metadata (id/tags/domain/status/related) instead of §3's header. Named, not silent -- §3 owes an explicit ADR row (SPRINT-075 T6)"
  _own_scan "$repo"
  if [ "$_OWN_N_DOCS" -eq 0 ]; then
    note "S3.SCHEMA           -- no documents found to evaluate (no docs/*.md outside the exemptions above, and no §2 core file present) -- nothing to verify. This states an empty doc set, not a pass"
    return
  fi
  n_bad=0
  saved_ifs6=$IFS
  IFS='
'
  for d in $_OWN_NOHDR; do
    IFS=$saved_ifs6
    [ -n "$d" ] || { IFS='
'; continue; }
    bad "ownership-header-missing: $d -- no YAML frontmatter block; §3 makes the ownership header mandatory on every doc"
    n_bad=$((n_bad + 1))
    IFS='
'
  done
  for e in $_OWN_FIELDMISS; do
    IFS=$saved_ifs6
    [ -n "$e" ] || { IFS='
'; continue; }
    bad "ownership-header-field-missing: $e"
    n_bad=$((n_bad + 1))
    IFS='
'
  done
  IFS=$saved_ifs6
  n_clean=$((_OWN_N_DOCS - n_bad))
  if [ "$n_bad" -eq 0 ]; then
    ok "S3.SCHEMA           -- all $_OWN_N_DOCS doc(s) carry a complete ownership header (owner, last_updated, update_trigger, status)"
  else
    note "S3.SCHEMA           -- $n_clean doc(s) carry a complete ownership header; the rest are named in the finding lines above"
  fi
}

assert_S1_LAW2() {
  repo=$1
  _own_scan "$repo"
  roles=$(_own_roles "$repo")
  if [ -f "$repo/.conformance-roles" ]; then src="declared in .conformance-roles"; else src="the engine's default vocabulary"; fi
  if [ "$_OWN_N_DOCS" -eq 0 ]; then
    note "S1.LAW2             -- no documents found -- nothing to verify. This states an empty doc set, not a pass"
    return
  fi
  n_checked=0; n_role=0
  saved_ifs6=$IFS
  IFS='
'
  # An ABSENT owner is S3.SCHEMA's finding, not this one -- _OWN_OWNERS carries only docs that have a
  # value. LAW 2 is about the VALUE being a role; reporting one missing field under two names doubles a
  # single defect and makes the report read as worse than the repo is.
  for line in $_OWN_OWNERS; do
    IFS=$saved_ifs6
    [ -n "$line" ] || { IFS='
'; continue; }
    d=${line%%	*}
    v=${line#*	}
    n_checked=$((n_checked + 1))
    if printf '%s\n' "$roles" | grep -qix -- "$v"; then
      n_role=$((n_role + 1))
    else
      bad "owner-not-a-role: $d -- owner '$v' is not in the role vocabulary ($src). LAW 2 wants a role, not a person; declare .conformance-roles if '$v' is one of yours"
    fi
    IFS='
'
  done
  IFS=$saved_ifs6
  if [ "$n_checked" -eq 0 ]; then
    note "S1.LAW2             -- no doc carries an owner: field to evaluate (see S3.SCHEMA's findings); reported rather than passed"
  elif [ "$n_role" -eq "$n_checked" ]; then
    ok "S1.LAW2             -- all $n_checked owner: value(s) are roles, matched against $src"
  else
    note "S1.LAW2             -- $n_role owner: value(s) matched $src; the rest are named in the finding lines above"
  fi
}

assert_S1_LAW3() {
  repo=$1
  _own_scan "$repo"
  if [ "$_OWN_N_DOCS" -eq 0 ]; then
    note "S1.LAW3             -- no documents found -- nothing to verify. This states an empty doc set, not a pass"
    return
  fi
  saved_ifs6=$IFS
  IFS='
'
  for d in $_OWN_NOTRIG; do
    IFS=$saved_ifs6
    [ -n "$d" ] || { IFS='
'; continue; }
    bad "update-trigger-absent: $d -- LAW 3 requires a defined update trigger; without one the doc has no lifecycle and ages silently"
    IFS='
'
  done
  IFS=$saved_ifs6
  # The judged half, stated so the split is visible in the report rather than implied by the mark.
  note "S1.LAW3             -- mechanical half only: this checks that update_trigger: is PRESENT. Whether it is the RIGHT trigger is the judged half of the split and is never decided here (§14)"
  if [ "$_OWN_N_TRIG" -eq "$_OWN_N_DOCS" ]; then
    ok "S1.LAW3             -- all $_OWN_N_DOCS doc(s) declare an update_trigger:"
  else
    note "S1.LAW3             -- $_OWN_N_TRIG doc(s) declare an update_trigger:; the rest are named in the finding lines above"
  fi
}

assert_S3_AGENTS() {
  repo=$1
  if [ ! -f "$repo/AGENTS.md" ]; then
    # Whether a repo OWES an AGENTS.md is §2's question, not §3's. Absence is reported, never failed
    # here and never passed either -- the same three-state discipline the §9 family needed.
    note "S3.AGENTS           -- no AGENTS.md at the repo root; whether one is owed is §2's question, not this rule's -- nothing to verify"
    return
  fi
  if grep -qE '^<sub>.*[Dd]oc owner:.*status:.*</sub>' "$repo/AGENTS.md"; then
    ok "S3.AGENTS           -- AGENTS.md carries its ownership as a footer <sub> line (§3's thin-pointer exception)"
  else
    bad "agents-ownership-footer-missing: AGENTS.md -- §3 exempts it from the YAML header precisely because a 6-line block would defeat a ~10-line pointer file, but the ownership still has to live somewhere: a footer <sub>Doc owner: … · last updated: … · status: …</sub> line"
  fi
}
# ==================================================================================================

# ==================================================================================================
# DRIVER -- iterated WITHOUT a pipe, matching check-attestation.sh's documented reason: `printf |
# while read` runs the loop in a subshell, where every bad() would set a `fail` the parent never sees
# (a report disagreeing with its artifact -- this repo's own most-repeated failure class).
# ==================================================================================================
n_pass=0; n_judgment=0; n_impl=0; n_unclassified=0; n_reported=0; n_dispatchable=0
struct_fail=0; gated_fail=0; attested_fail=0

saved_ifs=$IFS
IFS='
'
for row in $rules; do
  IFS=$saved_ifs
  # shellcheck disable=SC2086
  set -- $row
  id=$1; level=$2; mark=$3
  fn="assert_$(printf '%s' "$id" | tr '.' '_')"
  pid=$(printf '%-20s' "$id")
  case "$mark" in
    implementation-directed)
      n_impl=$((n_impl + 1))
      note "$pid -- excluded by mark: implementation-directed (level: $level). Constrains a tool's inference, never a repository; evaluating it would emit a finding no adopter can ever clear (§14)"
      ;;
    judgment-only)
      n_judgment=$((n_judgment + 1))
      note "$pid -- judgment-required (mark: judgment-only, level: $level). Not checkable in principle -- the standard is choosing a human, and this is not debt (§14)"
      ;;
    mechanical|split)
      last_bad=0
      last_ok=0
      last_gap=0
      n_dispatchable=$((n_dispatchable + 1))
      if command -v "$fn" >/dev/null 2>&1; then
        "$fn" "$repo_abs"
      else
        gap "$pid -- rule-unimplemented: the spec marks this $mark at level $level and this engine has no assertion for it yet. A rule the spec states and the engine skips is named here rather than silently absent (L-058) -- but it is a gap in THIS ENGINE, so it does not enter the level below or the exit code"
      fi
      # A gap is neither a pass, a failure, nor "reported without a verdict" -- it is the absence of a
      # check, counted on the coverage axis only. Ordered first so it can never fall through into one
      # of the three verdict states below.
      if [ "$last_gap" -eq 1 ]; then
        :
      elif [ "$last_bad" -eq 1 ]; then
        case "$level" in
          Structural) struct_fail=$((struct_fail + 1)) ;;
          Gated)      gated_fail=$((gated_fail + 1)) ;;
          Attested)   attested_fail=$((attested_fail + 1)) ;;
        esac
      elif [ "$last_ok" -eq 1 ]; then
        n_pass=$((n_pass + 1))
      else
        # Reported without a verdict: the assertion ran, said something, and deliberately claimed
        # neither pass nor fail. Counted separately because folding it into either one misstates the
        # report -- into `passed` it manufactures approval the rule refuses to give, and into a
        # failure it blocks a level over something that is not a finding.
        n_reported=$((n_reported + 1))
      fi
      ;;
    "?")
      n_unclassified=$((n_unclassified + 1))
      note "$pid -- unclassified (mark: ?, level: $level). Not a silent skip and not a pass -- §14 names this a real state for a rule added since this spec version"
      ;;
    *)
      note "$pid -- unrecognized mark '$mark' (level: $level), not evaluated"
      ;;
  esac
  IFS='
'
done
IFS=$saved_ifs

# --- the level line ------------------------------------------------------------------------------
# §14: a conformant report states a level, the named findings preventing the next level, and the
# judgment-required items -- never a score, a grade, or a percentage.
if [ "$struct_fail" -gt 0 ]; then
  note "level: none -- Structural not yet reached. $struct_fail finding(s) at Structural prevent it (see FAIL lines above)"
elif [ "$gated_fail" -gt 0 ]; then
  note "level: Structural -- $gated_fail finding(s) at Gated prevent Gated, the next level (see FAIL lines above)"
elif [ "$attested_fail" -gt 0 ]; then
  note "level: Gated -- $attested_fail finding(s) at Attested prevent Attested, the next level (see FAIL lines above)"
else
  # "No finding at any level" and "every rule passed" are not the same statement, and the second one
  # is the dangerous paraphrase: a run where every dispatched rule reported without a verdict has no
  # findings either, and calling that "passed" hands back approval nothing earned.
  if [ "$n_pass" -gt 0 ]; then
    note "level: Attested -- no finding at any level; $n_pass dispatched rule(s) passed"
  else
    note "level: Attested -- no finding at any level, but NO rule actually passed ($n_reported reported without a verdict). This states the absence of findings, not evidence of conformance"
  fi
fi

# --- the coverage line: a SECOND, independent statement -------------------------------------------
# The level above describes the REPOSITORY. This describes THIS ENGINE. Keeping them apart is what
# SPRINT-075 T3 bought: folded together, an adopter's level moved every time we shipped a checker, and
# a repo with two real defects read as "41 findings prevent Structural". A level is a claim about what
# was CHECKED, so it may never be read as certifying a rule nobody ran -- hence the qualifier below
# whenever any gap remains, rather than a quiet footnote. Counts, never a ratio: §14 forbids a
# percentage here, and it would be exactly the wrong number anyway -- it climbs when we defer work.
n_impl_reg=$((n_dispatchable - n_gap))
if [ "$n_gap" -gt 0 ]; then
  note "coverage: $n_impl_reg checkable rule(s) have an assertion in this engine; $n_gap are unchecked, each named on a GAP line above. Two counts, never a ratio (§14) -- the level states what was checked and makes no claim about the rest"
else
  note "coverage: all $n_dispatchable checkable rule(s) have an assertion in this engine"
fi
note "counts: $n_pass passed, $n_judgment judgment-required, $n_impl excluded (implementation-directed), $n_gap unchecked (engine gap)$([ "$n_reported" -gt 0 ] && printf ', %s reported without a verdict' "$n_reported")$([ "$n_unclassified" -gt 0 ] && printf ', %s unclassified' "$n_unclassified")"

exit $fail
