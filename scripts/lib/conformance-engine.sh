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
# §4 ADR family (SPRINT-076 T2) -- S4.ONEFILE · S4.APPEND · S4.INDEX · S4.SECTIONS · S4.NEGATIVE
#
# Five mechanical rules firing five finding names ALREADY PUBLISHED in
# docs/research/conformance-dispositions.md § build. This task CONSUMES that contract; it does not
# choose it (L-058).
#
#   S4.ONEFILE  -> adr-path-noncanonical
#   S4.APPEND   -> adr-edited-after-decision        (the family's only Gated rule -- reads HISTORY)
#   S4.INDEX    -> decisions-index-missing-adr
#   S4.SECTIONS -> adr-required-section-missing
#   S4.NEGATIVE -> adr-no-negative-consequence
#
# Four are Structural (answerable from the tree) and one is Gated (answerable only from the record),
# so the level arithmetic separates them for free -- the driver buckets by the SPEC's level column,
# never by anything this block asserts.
#
# --- what an "ADR" is here, and why the answer is not just a glob -----------------------------------
# §4 states one file per ADR at `docs/adr/ADR-NNN-<slug>.md`. That is THREE claims, not one, and a
# rule checking only the filename pattern passes both of the ones that actually corrupt an index: a
# canonically-named ADR sitting somewhere else, and two files claiming the same number. All three are
# reported under the single published name, each naming which sub-case it hit.

# _adr_canonical <repo> -- repo-relative paths of files that ARE canonical ADRs, sorted. This is the
# set the other four rules iterate: a file failing S4.ONEFILE is reported by that rule and then left
# alone, rather than collecting a second and third finding from rules whose subject it is not.
_adr_canonical() {
  for f in "$1"/docs/adr/*.md; do
    [ -f "$f" ] || continue
    b=${f##*/}
    case "$b" in
      ADR-[0-9][0-9][0-9]-*.md) printf '%s\n' "docs/adr/$b" ;;
    esac
  done | LC_ALL=C sort
}

# _adr_section <name> -- reads a doc on stdin, prints the body of its `## <name>...` section.
# Matched as a PREFIX of the heading text so `## Alternatives considered` answers to "Alternatives",
# and anchored at position 1 so a heading merely CONTAINING the word is not mistaken for it (L-108:
# anchor to a position, never to a bare substring).
_adr_section() {
  awk -v want="$1" '
    /^## / { h = substr($0, 4); inside = (index(h, want) == 1); next }
    inside { print }
  '
}

assert_S4_ONEFILE() {
  repo=$1
  [ -d "$repo/docs/adr" ] || {
    note "S4.ONEFILE          -- no docs/adr/ directory; whether this repo owes ADRs is §2's question, not this rule's -- nothing to verify"
    return
  }
  n_ok=0
  seen_nums=""
  for f in "$repo"/docs/adr/*.md; do
    [ -f "$f" ] || continue
    b=${f##*/}
    case "$b" in
      ADR-[0-9][0-9][0-9]-?*.md) ;;
      *)
        bad "adr-path-noncanonical: docs/adr/$b -- §4 requires one file per ADR named ADR-NNN-<slug>.md (three-digit number, kebab-case slug). A file in docs/adr/ that is not one is either a mis-named ADR nothing will index, or a non-ADR document in the ADR set"
        continue
        ;;
    esac
    num=$(printf '%s' "$b" | cut -c1-7)
    prev=$(printf '%s\n' "$seen_nums" | sed -n "s/^$num	//p")
    if [ -n "$prev" ]; then
      bad "adr-path-noncanonical: docs/adr/$b -- $num is already claimed by docs/adr/$prev. §4 is one file per ADR: two files sharing a number means the index, every cross-reference and every 'superseded by' pointer are ambiguous about which one they mean"
      continue
    fi
    seen_nums="$seen_nums$num	$b
"
    n_ok=$((n_ok + 1))
  done

  # A canonically-named ADR outside docs/adr/ is the sub-case a docs/adr/-only glob cannot see -- and
  # it is the one that silently escapes every other rule in this family, since they all iterate the
  # canonical set. Pruned against the repo's own noise directories so an adopter's node_modules or a
  # vendored copy does not turn one finding into a hundred.
  # Scoped to the DOC TREE (docs/, minus docs/adr/) plus the repo root, not the whole checkout. §2
  # places documentation under docs/, so an ADR-named file inside the doc tree but outside docs/adr/
  # is unambiguously misplaced -- while one under evals/, tests/ or src/ is test data or a template,
  # and adjudicating it means reporting a defect about a tree this rule was never given. Found by
  # running against this repo rather than by review: the first draft walked the whole checkout and
  # returned 12 findings, every one of them a fixture directory whose own docs/adr/ is canonical
  # relative to its own root. An adopter with test fixtures gets the same noise (L-016 -- verify on
  # the consumer path, not only on our dogfooding).
  strays=$( { find "$repo/docs" -type f -name 'ADR-[0-9][0-9][0-9]-*.md' 2>/dev/null |
                sed "s|^$repo/||" | grep -v '^docs/adr/'
              for rf in "$repo"/ADR-[0-9][0-9][0-9]-*.md; do
                [ -f "$rf" ] && printf '%s\n' "${rf##*/}"
              done
            } | LC_ALL=C sort -u)
  if [ -n "$strays" ]; then
    saved_ifs4=$IFS
    IFS='
'
    for s in $strays; do
      IFS=$saved_ifs4
      bad "adr-path-noncanonical: $s -- an ADR-NNN-named file outside docs/adr/. §4 fixes the location as well as the name: an ADR the canonical path does not reach is invisible to the index rule, the append-only rule and every reader who looks where the standard says to look"
      IFS='
'
    done
    IFS=$saved_ifs4
    return
  fi

  [ "$last_bad" -eq 1 ] && return
  if [ "$n_ok" -eq 0 ]; then
    note "S4.ONEFILE          -- docs/adr/ exists but holds no ADR-NNN-<slug>.md file -- nothing to verify"
  else
    ok "S4.ONEFILE          -- all $n_ok ADR(s) sit at a canonical one-file-per-ADR path"
  fi
}

assert_S4_INDEX() {
  repo=$1
  adrs=$(_adr_canonical "$repo")
  [ -n "$adrs" ] || {
    note "S4.INDEX            -- no canonical ADR files to index -- nothing to verify"
    return
  }
  # §2 places the index at docs/DECISIONS.md; a repo keeping it at the root is accepted rather than
  # reported, because §4's claim is that the index EXISTS and is complete, not where it lives.
  idx=""
  for cand in docs/DECISIONS.md DECISIONS.md; do
    [ -f "$repo/$cand" ] && { idx=$cand; break; }
  done
  if [ -z "$idx" ]; then
    bad "decisions-index-missing-adr: no decision index found at docs/DECISIONS.md or DECISIONS.md -- §4 requires a thin index linking every ADR. Without one there is no single place that answers 'what has been decided here', which is the whole reason the ADRs are one-per-file"
    return
  fi
  n_indexed=0
  saved_ifs4=$IFS
  IFS='
'
  for a in $adrs; do
    IFS=$saved_ifs4
    b=${a##*/}
    # -F: the basename carries no regex metacharacters worth honouring, and treating it as a pattern
    # is how a hyphenated slug would silently match the wrong row.
    if grep -qF "$b" "$repo/$idx"; then
      n_indexed=$((n_indexed + 1))
    else
      bad "decisions-index-missing-adr: $a -- $idx carries no row linking it. An index missing an entry is worse than no index: it reads as complete, so the decision it omits is one nobody knows to look for"
    fi
    IFS='
'
  done
  IFS=$saved_ifs4
  [ "$last_bad" -eq 1 ] && return
  ok "S4.INDEX            -- all $n_indexed ADR(s) carry a row in $idx"
}

assert_S4_SECTIONS() {
  repo=$1
  adrs=$(_adr_canonical "$repo")
  [ -n "$adrs" ] || {
    note "S4.SECTIONS         -- no canonical ADR files -- nothing to verify"
    return
  }
  n_complete=0
  saved_ifs4=$IFS
  IFS='
'
  for a in $adrs; do
    IFS=$saved_ifs4
    f="$repo/$a"
    missing=""
    # Status and Deciders are header BULLETS in §4's template, not headings; the other four are
    # `## ` sections. Both spellings are accepted for each, so a repo that renders Status as a
    # heading is not reported for a difference §4 does not make.
    for s in Status Deciders; do
      grep -qE "^- \*\*$s:?\*\*|^## $s" "$f" || missing="$missing, $s"
    done
    for s in Context Decision Consequences Alternatives; do
      grep -qE "^## $s" "$f" || missing="$missing, $s"
    done
    if [ -n "$missing" ]; then
      bad "adr-required-section-missing: $a -- ${missing#, }. §4 lists six required sections and each carries a distinct load: without Context the decision is unexplainable, without Alternatives it is unfalsifiable, and a reader cannot tell a considered call from an arbitrary one"
    else
      n_complete=$((n_complete + 1))
    fi
    IFS='
'
  done
  IFS=$saved_ifs4
  [ "$last_bad" -eq 1 ] && return
  ok "S4.SECTIONS         -- all $n_complete ADR(s) carry Status · Deciders · Context · Decision · Consequences · Alternatives"
}

assert_S4_NEGATIVE() {
  repo=$1
  adrs=$(_adr_canonical "$repo")
  [ -n "$adrs" ] || {
    note "S4.NEGATIVE         -- no canonical ADR files -- nothing to verify"
    return
  }
  n_neg=0
  n_skipped=0
  saved_ifs4=$IFS
  IFS='
'
  for a in $adrs; do
    IFS=$saved_ifs4
    f="$repo/$a"
    # An ADR with NO § Consequences at all is S4.SECTIONS' finding, and reporting it here too would
    # bill one defect to two rules -- which inflates a report an adopter reads as a work list.
    if ! grep -qE '^## Consequences' "$f"; then
      n_skipped=$((n_skipped + 1))
      IFS='
'
      continue
    fi
    if _adr_section Consequences < "$f" | grep -qi 'negative'; then
      n_neg=$((n_neg + 1))
    else
      bad "adr-no-negative-consequence: $a -- § Consequences names no Negative. §4 requires at least one because no decision is cost-free: an ADR listing only upsides has not been examined, it has been advertised"
    fi
    IFS='
'
  done
  IFS=$saved_ifs4
  [ "$last_bad" -eq 1 ] && return
  if [ "$n_neg" -eq 0 ]; then
    note "S4.NEGATIVE         -- no ADR carries a § Consequences section to examine ($n_skipped reported by S4.SECTIONS instead) -- nothing to verify"
  else
    ok "S4.NEGATIVE         -- all $n_neg ADR(s) with a § Consequences section name at least one Negative$([ "$n_skipped" -gt 0 ] && printf ' (%s without one left to S4.SECTIONS)' "$n_skipped")"
  fi
}

# --- S4.APPEND: the only rule here that reads the RECORD rather than the tree ----------------------
# §4 marks it `mechanical *via git history*` at level Gated, and that placement is the point: a tree
# can never show that a decided ADR was edited, because the edit leaves no trace in the file it
# changed. Only history can answer, which is precisely what separates Gated from Structural (§14).
#
# What is compared is the § DECISION BODY at the deciding commit against the same section at HEAD.
# Everything §4 explicitly permits after a decision -- marking it `deprecated`, marking it
# `superseded by ADR-NNN`, adding a `Scope amended by:` bullet -- lands in the HEADER, leaving the
# decision text itself untouched, so the permitted path passes without needing to be enumerated. This
# repo is its own hardest case here: ADR-008 and ADR-027 both carry post-decision markers, and a rule
# that reddens on them is unusable before it is ever pointed at an adopter.
#
# Net-effect semantics, stated rather than hidden: an edit later reverted reads as unedited. The
# alternative -- walking every intermediate revision -- reports a defect that no longer exists in a
# file whose current text is exactly what was decided.
#
# History that cannot answer is REPORTED, never guessed at, and the two ways it fails are kept
# distinct because they mean different things to an adopter: a tarball has no record to consult, while
# a shallow clone has one that was deliberately truncated (A3).
assert_S4_APPEND() {
  repo=$1
  adrs=$(_adr_canonical "$repo")
  [ -n "$adrs" ] || {
    note "S4.APPEND           -- no canonical ADR files -- nothing to verify"
    return
  }
  if ! git -C "$repo" rev-parse --git-dir >/dev/null 2>&1; then
    note "S4.APPEND           -- history unavailable: $repo is not a git repository, so whether a decided ADR was edited cannot be answered. Reported rather than passed -- the absence of a record is not evidence that nothing happened"
    return
  fi
  if [ "$(git -C "$repo" rev-parse --is-shallow-repository 2>/dev/null)" = "true" ]; then
    note "S4.APPEND           -- history truncated: $repo is a shallow clone, so a deciding commit older than the fetch depth is unreachable. Distinct from having no repository at all, and reported rather than passed: a truncated history that reads as clean is the false negative this rule exists to prevent"
    return
  fi

  n_clean=0
  n_undecided=0
  saved_ifs4=$IFS
  IFS='
'
  for a in $adrs; do
    IFS=$saved_ifs4
    # Oldest-first, so the FIRST revision carrying an accepted status is the deciding one. A file
    # that was proposed first and accepted later is measured from the acceptance, not from creation.
    revs=$(git -C "$repo" log --reverse --format=%H -- "$a" 2>/dev/null)
    if [ -z "$revs" ]; then
      note "S4.APPEND           -- $a has no commit touching it (untracked or added since the last commit); nothing to compare against"
      IFS='
'
      continue
    fi
    deciding=""
    for r in $revs; do
      if git -C "$repo" show "$r:$a" 2>/dev/null |
         grep -qiE '^status: *accepted|^- \*\*Status:\*\* *accepted'; then
        deciding=$r
        break
      fi
    done
    if [ -z "$deciding" ]; then
      n_undecided=$((n_undecided + 1))
      IFS='
'
      continue
    fi
    then_body=$(git -C "$repo" show "$deciding:$a" 2>/dev/null | _adr_section Decision)
    now_body=$(_adr_section Decision < "$repo/$a")
    if [ "$then_body" = "$now_body" ]; then
      n_clean=$((n_clean + 1))
    else
      short=$(git -C "$repo" rev-parse --short "$deciding" 2>/dev/null)
      bad "adr-edited-after-decision: $a -- § Decision differs from the text accepted at $short. §4 is append-only: a decided ADR is marked deprecated or superseded, never rewritten, because the record of what was decided is the only thing that makes the reasoning auditable later. A post-decision MARKER in the header is the supported path and does not trip this"
    fi
    IFS='
'
  done
  IFS=$saved_ifs4
  [ "$last_bad" -eq 1 ] && return
  if [ "$n_clean" -eq 0 ]; then
    note "S4.APPEND           -- no ADR has reached an accepted status yet ($n_undecided still proposed); there is no decision to have been edited"
  else
    ok "S4.APPEND           -- $n_clean ADR(s) unedited since their deciding commit$([ "$n_undecided" -gt 0 ] && printf ' (%s not yet accepted)' "$n_undecided")"
  fi
}
# ==================================================================================================


# ==================================================================================================
# §2 placement pair (SPRINT-076 T3) -- S2.F-FILE · S2.R-PLACEMENT
#
#   S2.F-FILE      -> core-file-missing
#   S2.R-PLACEMENT -> file-outside-canonical-placement
#
# Chosen because they are the LIKELIEST to produce artefacts against a stranger's repository, not the
# safest. SPRINT-075 T3's triage recorded zero artefacts and recorded itself as barely asked -- six of
# 62 rules, none of them shape-bound. These two are the prime suspects, so covering them is what turns
# the artefact question from open into answered (A4 -- and disconfirming A4 is a result, not a failure).
#
# --- the row source, and the two traps in parsing it ------------------------------------------------
# §2's three tables are the data; the rules are its column families ("a row is a parameter set, not a
# rule"). Rows are read from the SPEC at runtime, never hard-coded, so re-wording a Create cell changes
# behaviour with no code edit (EPIC-004 D1).
#
# Trap 1: §2's own **Conformance** table lives inside §2 and after the `docs/` marker, so without a
# guard its Rule cells parse as File cells and the engine invents 21 core files called `docs/S2.F-FILE`.
# check-doc-caps.sh escapes this only by accident -- it discards any row with no integer in the Cap
# cell. Guarded explicitly here rather than relying on the same luck.
#
# Trap 2: the Cap and Create columns sit at DIFFERENT indices in the docs tree (it carries a Tier
# column) than in the root/.claude/spec tables. Same shape check-doc-caps.sh makes, for the same reason.
#
# NOTE -- this is the SECOND §2 table parser in the repo (check-doc-caps.sh owns the first, for the Cap
# column). Two parsers reading one table is the drift TD-057 describes one level down; extracting a
# shared `read-spec-files.sh` beside `read-spec-rules.sh` is the right shape and is out of T3's declared
# Layers, so it is filed at close rather than smuggled in here.

# _s2_rows <spec> -- `always|path` per §2 row with a LITERAL canonical path, plus its legacy path when
# the row names one. Pattern rows (`ADR-NNN-<slug>.md`, `flows/<slug>.md`) are excluded: a pattern names
# a family, and a family cannot be "missing".
# Emits: <always:0|1>|<canonical-path>|<legacy-path-or-empty>
_S2_ROWS_CACHE=""
_s2_rows() {
  [ -n "$_S2_ROWS_CACHE" ] && { printf '%s\n' "$_S2_ROWS_CACHE"; return; }
  _S2_ROWS_CACHE=$(awk '
    /^## §2/ { in2 = 1; next }
    /^## §/  { in2 = 0 }
    !in2     { next }
    /^\*\*Conformance/        { in2 = 0; next }          # trap 1
    /^\*\*Root files/         { pfx = "";         next }
    /^\*\*AI context/         { pfx = ".claude/"; next }
    /^\*\*`docs\/` tree\*\*/  { pfx = "docs/";    next }
    /^\|/ {
      if ($0 ~ /^\|[ ]*File[ ]*\|/) next
      if ($0 ~ /^\|[-| ]*\|$/)      next
      n = split($0, c, "|"); if (n < 5) next
      file = c[2]
      cre  = (pfx == "docs/") ? c[6] : c[5]              # trap 2
      if (match(file, /`[^`]+`/)) path = substr(file, RSTART + 1, RLENGTH - 2); else next
      if (path ~ /[<>*]/) next
      # legacy path, where the row names one: *(was docs/ARCHITECTURE.md)*
      legacy = ""
      if (match(file, /\(was [^)]+\)/)) {
        legacy = substr(file, RSTART + 5, RLENGTH - 6)
        gsub(/[` ]/, "", legacy)
      }
      printf "%d|%s%s|%s\n", (cre ~ /always/) ? 1 : 0, pfx, path, legacy
    }' "$1")
  printf '%s\n' "$_S2_ROWS_CACHE"
}

# --- S2.F-FILE ------------------------------------------------------------------------------------
# Evaluated ONLY against rows the spec marks unconditional -- a `Create ←` cell saying "always". Every
# other row is tier-gated, and §2 routes tier DETECTION to S2.F-TIER, which §14 marks a split whose
# detection half is judged (§6). So requiring a conditional row here would be this engine guessing a
# tier the standard explicitly declines to infer, and telling a four-file JS library it owes
# docs/database/erd.md. The discriminator is the spec's own word, not a list this file remembers.
#
# No legacy fallback, deliberately: §2 states that S2.R-PLACEMENT carries the legacy-path second-match
# rule "which S2.F-FILE does not -- a repo on a legacy layout satisfies one and not the other, so they
# are separable". Reading them the other way round collapses two separable rules into one.
assert_S2_F_FILE() {
  repo=$1
  rows=$(_s2_rows "$spec" | grep '^1|')
  if [ -z "$rows" ]; then
    bad "core-file-missing: no unconditional rows parsed from §2 -- the table shape changed and this parser did not. An engine that silently derives an EMPTY required set reports every repository as conformant (L-058)"
    return
  fi
  n_present=0
  saved_ifs2=$IFS
  IFS='
'
  for r in $rows; do
    IFS=$saved_ifs2
    p=$(printf '%s' "$r" | cut -d'|' -f2)
    if [ -e "$repo/$p" ]; then
      n_present=$((n_present + 1))
    else
      bad "core-file-missing: $p -- §2 marks this file's create trigger \"always\", so it is owed by every repository regardless of tier. Absent, the reader §2 names for it has nowhere to look"
    fi
    IFS='
'
  done
  IFS=$saved_ifs2
  [ "$last_bad" -eq 1 ] && return
  ok "S2.F-FILE           -- all $n_present unconditional core file(s) present at their canonical §2 path"
}

# --- S2.R-PLACEMENT ---------------------------------------------------------------------------------
# Fires on a doc the repo evidently HAS but filed somewhere §2 does not name -- neither the canonical
# path nor the documented legacy one. That is what the published finding name says
# (`file-outside-canonical-placement`) and it is the only reading under which §2's own parenthetical
# holds: legacy paths are "matched second", i.e. TOLERATED by this rule, which is how a legacy-layout
# repo satisfies R-PLACEMENT while failing F-FILE.
#
# Matched by BASENAME, which is what keeps it quiet on a stranger's tree: it cannot fire on a document
# §2 never named, only on one whose filename §2 owns. A repo with no `overview.md` anywhere raises
# nothing here -- that absence is F-FILE's finding, and billing one defect to two rules inflates a
# report an adopter reads as a work list.
assert_S2_R_PLACEMENT() {
  repo=$1
  rows=$(_s2_rows "$spec")
  [ -n "$rows" ] || {
    bad "file-outside-canonical-placement: no rows parsed from §2 -- the table shape changed and this parser did not (L-058)"
    return
  }
  # Every path §2 names, canonical and legacy alike -- the exclusion set for the basename search below.
  _s2_all_paths=$(printf '%s\n' "$rows" | cut -d'|' -f2,3 | tr '|' '\n' | grep -v '^$' | LC_ALL=C sort -u)
  n_canon=0; n_legacy=0
  saved_ifs2=$IFS
  IFS='
'
  for r in $rows; do
    IFS=$saved_ifs2
    p=$(printf '%s' "$r" | cut -d'|' -f2)
    lg=$(printf '%s' "$r" | cut -d'|' -f3)
    if [ -e "$repo/$p" ]; then
      n_canon=$((n_canon + 1))
      IFS='
'
      continue
    fi
    # Matched SECOND: present, tolerated, and NAMED -- an accepted fallback applied silently is
    # indistinguishable from a rule that never ran.
    if [ -n "$lg" ] && [ -e "$repo/$lg" ]; then
      n_legacy=$((n_legacy + 1))
      note "S2.R-PLACEMENT      -- $lg matched second: §2 names it as the legacy path for $p. Tolerated, not silent; the canonical path is where a reader is told to look"
      IFS='
'
      continue
    fi
    base=${p##*/}
    canon_dir=${p%/*}
    # Exclude every path §2 itself names -- canonical OR legacy, for ANY row. Two §2 rows can share a
    # basename (`CHANGELOG.md` at the root and `spec/CHANGELOG.md`), and without this the root file,
    # sitting exactly where its own row puts it, is reported as a misplaced copy of the other. Caught
    # by the PASS control rather than by review: a rule that fires on a correctly-laid-out repo is
    # unusable, and the must-FAIL cases all stayed green while it did.
    found=$(find "$repo" \
        \( -name .git -o -name node_modules -o -name vendor -o -name .venv -o -name dist -o -name build \) -prune -o \
        -type f -name "$base" -print 2>/dev/null |
      sed "s|^$repo/||" | grep -v "^$canon_dir/" |
      grep -vxF "$_s2_all_paths" 2>/dev/null | LC_ALL=C sort | head -n 3)
    if [ -n "$found" ]; then
      where=$(printf '%s' "$found" | tr '\n' ' ')
      bad "file-outside-canonical-placement: $p -- §2 places it here, and the repository has a file of that name at: ${where%% }. Neither the canonical path nor a legacy path §2 names, so a reader following the standard will not find it"
    fi
    IFS='
'
  done
  IFS=$saved_ifs2
  [ "$last_bad" -eq 1 ] && return
  ok "S2.R-PLACEMENT      -- $n_canon §2 file(s) at their canonical path$([ "$n_legacy" -gt 0 ] && printf ', %s at a legacy path matched second' "$n_legacy")$([ "$n_canon" -eq 0 ] && printf ' (none of §2 core set present -- nothing is mis-placed, which is not the same as conformant)')"
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
  # `.` AND `-` both map to `_`. The hyphen half was missing until SPRINT-076 T3, and it was a silent
  # false negative of exactly the shape L-058 names: `S2.F-FILE` resolved to `assert_S2_F-FILE`, no
  # such function was ever defined, and the driver reported `rule-unimplemented` with the assertion
  # sitting right there in this file. Every rule covered before T3 happened to have no hyphen in its
  # id, so nothing surfaced it. **21 of the spec's 100 ids carry a hyphen**, so this was waiting under
  # a fifth of the rule set. Verified collision-free before changing: all 100 ids stay distinct under
  # the two-character mangling, so no two rules can now resolve to one assertion.
  fn="assert_$(printf '%s' "$id" | tr '.-' '__')"
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
