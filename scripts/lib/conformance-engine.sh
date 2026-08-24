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
# --- rule attribution on verdict lines (SPRINT-079 T6) -------------------------------------------
# `_cur_rid` is the id of the rule currently being asserted, set by the DRIVER before it dispatches
# and cleared after. Every verdict line that does not already LEAD with a rule id gets that id
# appended, so no finding about a repository is un-attributable.
#
# WHY APPENDED AND NOT PREPENDED, which would have matched the dispatch loop's own `$pid` shape.
# Three retained fixtures assert the ABSENCE of a finding at line start -- e.g.
# `! grep -qE '^FAIL +ownership-header'` in run-ownership-header-fixtures.sh, and siblings in
# run-s2-placement-fixtures.sh. A prefix satisfies those negations unconditionally, turning real
# failures into vacuous passes: the fixture would go green because the line no longer matches, not
# because the defect is gone (L-146). A suffix breaks no pattern, positive or negative, and keeps the
# finding first -- which is the order an adopter reads and acts on.
#
# WHY THIS EXISTS AT ALL. 23 of 54 verdict lines named a finding with no rule id. The dispatch loop's
# lines carry `$pid`; the per-item lines inside assertions did not -- and a failing assertion returns
# BEFORE its `ok` line, so a failing rule could be entirely un-attributable. It cost a wrong diagnosis
# in this sprint: a grep by rule id over a report returned nothing and was read as "the check does not
# fire", when the check fires correctly under a different line shape (L-108).
#
# No subshell: these run once per finding per file, and a `$( )` here is the per-row process spawn
# that has cost this engine its wall clock three times (L-144).
_cur_rid=""
last_bad=0
# `last_ok` is the counterpart `last_bad` needed and did not have. Without it the driver inferred
# "passed" from "did not fail", which silently counts a THIRD outcome as a pass: an assertion that
# legitimately emits only notes. S9.GATESABSENT on an absent field is exactly that -- §9 states it as
# "field absent => NOT SIGNED, never approval", so it may not report a pass, and the engine was
# counting it as one and reaching `level: Attested` on an unsigned sprint (SPRINT-075 T4 review).
last_ok=0
ok()   { last_ok=1; case "$1" in S[0-9]*|conformance:*) printf 'PASS  %s\n' "$1" ;; *) if [ -n "$_cur_rid" ]; then printf 'PASS  %s (%s)\n' "$1" "$_cur_rid"; else printf 'PASS  %s\n' "$1"; fi ;; esac; }
# `last_bad` is reset before each dispatch call and read right after -- `fail` alone cannot tell a
# caller whether THIS call failed once a prior call has already set it (a boolean flag has no memory
# of which call flipped it), which is what the per-level counters below need to know.
bad()  { fail=1; last_bad=1; case "$1" in S[0-9]*|conformance:*) printf 'FAIL  %s\n' "$1" ;; *) if [ -n "$_cur_rid" ]; then printf 'FAIL  %s (%s)\n' "$1" "$_cur_rid"; else printf 'FAIL  %s\n' "$1"; fi ;; esac; }
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
# `hold` is a FOURTH verdict class, and the one §13 could not migrate without (SPRINT-078 T1). It
# reads exactly like a note -- same indented line, no verdict prefix -- and it additionally records
# that the rule named something PREVENTING the next level without FAILING.
#
# The case that forced it: `attestation-unsigned-claim-only`. §13c says a well-formed attestation over
# an unsigned commit has genuinely reached Gated and genuinely has not reached Attested. That is a
# level, not a defect, so it must not touch the exit code -- but it is also, in §14's own words, the
# named finding preventing the next level, so a report that swallows it and prints `level: Attested`
# certifies precisely what §13 exists to refuse. The checker this family migrated from had a §13-only
# level ladder of its own and said `level: Gated (not Attested) -- preventing finding:
# attestation-unsigned-claim-only`; this engine publishes ONE level line, so the distinction had to
# move into the ladder rather than travel with the family.
#
# Without it the migration would have been a silent downgrade: same finding text, same exit code, and
# a headline promoting every unsigned attestation to Attested.
last_hold=0
hold() { last_hold=1; note "$1"; }

# --- arguments ---------------------------------------------------------------------------------
repo=""; spec=""
# `--rev` exists because §13's rules are defined over a COMMIT, not over the working tree, and the
# checker they migrated from (SPRINT-078 T1) took the commit-ish as a required argument. Defaulting to
# HEAD keeps the common case a one-word invocation; keeping the override is what stops the migration
# quietly costing an adopter the ability to attest a commit that is not HEAD -- and it is what lets
# the retained §13 fixtures go on targeting the exact commits they were built around. Rules that read
# the working tree ignore it entirely.
rev="HEAD"
while [ "$#" -gt 0 ]; do
  case "$1" in
    --spec) shift; spec=${1:-} ;;
    --rev)  shift; rev=${1:-HEAD} ;;
    -h|--help) printf 'usage: sh conformance-engine.sh <repo-dir> [--spec <STANDARD.md>] [--rev <commit-ish>]\n'; exit 0 ;;
    *) [ -n "$repo" ] || repo=$1 ;;
  esac
  shift
done
[ -n "$repo" ] || { bad "conformance: usage -- sh conformance-engine.sh <repo-dir> [--spec <STANDARD.md>] [--rev <commit-ish>]"; exit 1; }
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

# --- §2's README ownership footer (SPRINT-078 T3) -------------------------------------------------
# `S2.R-README` is marked `mechanical *on the invariants* -- the anti-SSOT rule and the footer
# ownership line`. TWO invariants, and only one of them is mechanical:
#
#   the footer ownership line -- §3's README exception states its exact shape, so it is checkable and
#                               is what this assertion answers.
#   the anti-SSOT rule        -- "not a second copy of CONTEXT.md (vocabulary) or
#                               architecture/overview.md (structure), which the README links to". That
#                               is a judgement about content, and the split is reported rather than
#                               faked: a heuristic here (does the README repeat headings from those
#                               files?) would fire on every repo whose README legitimately summarises
#                               its own architecture, which is what a front-door is for.
#
# WHY THE SHAPE IS READ FROM §3 AND NOT WRITTEN HERE. `S3.README` is scoped out in the register for
# one reason -- *restates a rule checked elsewhere*, the arrow pointing at `S2.R-README`. If this
# assertion invented its own idea of the footer, the two rules would disagree and a scope-out would
# quietly become a gap: §3 would state a shape nothing checks while §2 checked a different one. So the
# field labels come from §3's own worked example, parsed at runtime. Re-word §3's example and this
# check follows it.
#
# The sibling `assert_S3_AGENTS` matches the same footer with a hard-coded pattern. Not unified here:
# it belongs to a rule this task does not own, and changing a shipped assertion to share a helper is a
# change rather than a move. Filed at close alongside the read-spec-files.sh extraction (TD).

_README_FIELDS_CACHE=""
_README_FIELDS_DONE=0

# _readme_footer_fields <spec> -- the field LABELS §3's README exception names, one per line
# (`Doc owner` · `last updated` · `status`). Read from the `<sub>...</sub>` example in §3's own prose,
# which is the only place the standard states the shape.
_readme_footer_fields() {
  [ "$_README_FIELDS_DONE" -eq 1 ] && { printf '%s\n' "$_README_FIELDS_CACHE"; return; }
  _README_FIELDS_DONE=1
  _README_FIELDS_CACHE=$(awk '
    /^## /{h=$0; sub(/^## [^0-9]*/,"",h); sec=h+0}
    sec != 3 { next }
    /README exception/ { inx = 1 }
    inx && match($0, /<sub>[^<]*<\/sub>/) {
      s = substr($0, RSTART + 5, RLENGTH - 11)
      n = split(s, parts, "·")
      for (i = 1; i <= n; i++) {
        lab = parts[i]
        sub(/:.*$/, "", lab)
        gsub(/^[ \t`]+|[ \t`]+$/, "", lab)
        if (lab != "") print lab
      }
      exit
    }
    /^\*\*AGENTS\.md exception\*\*/ { inx = 0 }
  ' "$1")
  printf '%s\n' "$_README_FIELDS_CACHE"
}

assert_S2_R_README() {
  _rrepo=$1
  _rid=$(printf '%-20s' 'S2.R-README')
  if [ ! -f "$_rrepo/README.md" ]; then
    # Whether a repo OWES a README is §2's `S2.F-FILE` question (the row is marked "init (always)"),
    # and it fires `core-file-missing` for it. Reporting the absence twice under two rule ids is the
    # double-count § scope-out (a) exists to prevent -- one constraint, one report.
    note "$_rid-- no README.md at the repo root; whether one is owed is S2.F-FILE's question, which reports it. Nothing to verify here"
    return
  fi

  _rfields=$(_readme_footer_fields "$spec")
  if [ -z "$_rfields" ]; then
    bad "$_rid-- readme-ownership-footer-missing: §3's README exception no longer states a <sub> footer example this engine can parse, so the required shape could not be derived. A check that silently derives an EMPTY required shape accepts any README at all (L-058) -- reported instead"
    return
  fi

  # The footer is matched at a LINE POSITION (`^<sub>` … `</sub>`), never as a substring anywhere in
  # the file. A README that quotes the footer format while explaining it -- which the standard's own
  # README does -- would otherwise satisfy the rule by talking about it (L-108).
  _rline=$(grep -E '^<sub>.*</sub>' "$_rrepo/README.md" | head -1)
  if [ -z "$_rline" ]; then
    bad "$_rid-- readme-ownership-footer-missing: README.md has no footer <sub>…</sub> line. §3 exempts the front-door from the YAML header because a top metadata table renders badly, not from ownership: it still carries $(printf '%s' "$_rfields" | tr '\n' ' ' | sed 's/ $//') as a small footer line"
    return
  fi

  _rmissing=""
  # Split on NEWLINE, not on whitespace: §3's labels contain spaces (`Doc owner`, `last updated`), and
  # default word-splitting would turn three fields into five words. It happened to still catch a
  # missing field, which is exactly the kind of accident that survives review -- the loop would have
  # reported `owner` and `updated` as the missing things, naming tokens the standard never uses.
  _rsaved_ifs=$IFS
  IFS='
'
  for _f in $_rfields; do
    IFS=$_rsaved_ifs
    printf '%s' "$_rline" | grep -qi -- "$_f" || _rmissing="$_rmissing '$_f'"
    IFS='
'
  done
  IFS=$_rsaved_ifs
  if [ -n "$_rmissing" ]; then
    bad "$_rid-- readme-ownership-footer-missing: README.md's footer line omits:$_rmissing. §3's README exception names every field it must carry, and a partial footer records less than it appears to"
    return
  fi

  # The anti-SSOT half is NAMED, not silently dropped -- §2 marks this rule mechanical on BOTH
  # invariants, and a PASS that quietly covered one of them would overstate what was checked.
  note "$_rid-- the anti-SSOT half of this rule (\"not a second copy of CONTEXT.md or architecture/overview.md\") is a judgement about content and is not evaluated here; the footer half is"
  ok "$_rid-- README.md carries its ownership as a footer <sub> line with every field §3 names"
}

# --- §2/§6 tier doc-set family (SPRINT-078 T2) ----------------------------------------------------
# FIVE RULES, ONE CHECK, THE TIER A PARAMETER. `S2.F-TIER` · `S6.BASE` · `S6.BACKEND` · `S6.MEDIUM` ·
# `S6.MULTISVC` are the same question asked at four scopes plus §2's statement of it, and the register
# dispositioned them that way before a line was written: *the tier is a parameter, not four checkers*.
#
# WHAT §6 ACTUALLY MARKS, and why it decides the whole shape. All four rules are `split -- detection
# judged`. Satisfaction ("given the tier, is its doc set present?") is mechanical; DETECTION ("is this
# repo multi-dev, sustained, or architecturally forked?") is a human call the standard explicitly
# declines to automate. This engine is already on record refusing to guess it: assert_S2_F_FILE's own
# comment rules that requiring a tier-gated row would be "this engine guessing a tier the standard
# explicitly declines to infer, and telling a four-file JS library it owes docs/database/erd.md".
#
# So the tier is DECLARED, not detected -- `.conformance-tier`, one token, exactly the shape
# `.conformance-roles` already uses for §1's role vocabulary. Undeclared is not a failure and not a
# pass: Base is still checked, because §6's trigger for Base is *every dev repo* and needs no
# detection, and the other three say they were not evaluated and why. A repo that declares gets its
# full cumulative set checked.
#
# WHERE THE REQUIRED SET COMES FROM. §2's own docs-tree table, read at runtime -- the Tier cell says
# which tier owes the row, so adding a row to §2 changes the required set with no code edit here.
# What this file supplies is the VOCABULARY that reads a Tier cell against §6's four tiers (below),
# the same division of labour as the role vocabulary: the spec owns the data, the engine owns the
# words it reads the data with.
#
# ROWS DELIBERATELY NOT OWED BY ANY TIER:
#   `always` rows        -- S2.F-FILE's, and it fires `core-file-missing` for them. Counting one
#                           absence under two findings is precisely the double-counting § scope-out
#                           (a) exists to prevent.
#   `auth exists` · `DB exists` -- SUBSTRATE-gated, not tier-gated. §6 says substrate-conditional rows
#                           are "skipped, not owed, when the substrate is absent", and no tier implies
#                           a database. Reported as skipped, never as missing.
#   `lean loop` · `as needed` · `ephemeral` -- not tier rows at all.

_TIER_RANK_base=1
_TIER_RANK_backend=2
_TIER_RANK_medium=3
_TIER_RANK_multisvc=4

# _tier_rank_of_cell <tier-cell-text> -- §2's Tier cell to a §6 tier rank, 0 = owed by no tier.
# `API exists` ranks with backend deliberately: §6's Backend row names `api/openapi.yaml` in its own
# doc set, and a repo that "exposes an API" is the same fact as the substrate being present. auth and
# DB have no such tier statement anywhere in §6, which is why they stay at 0.
_tier_rank_of_cell() {
  case "$1" in
    *medium*)                              printf '3' ;;
    *backend*|*"API exists"*)              printf '2' ;;
    *base*)                                printf '1' ;;
    *)                                     printf '0' ;;
  esac
}

# _exempt_reason <repo> <path> -- the declared reason a doc is not owed HERE, from `.conformance-exempt`.
# Prints the reason and returns 0 when the path is declared WITH one; prints nothing and returns 1 when
# the path is not declared at all; prints nothing and returns 2 when it is declared with NO reason.
#
# Three return states, not two, because they are three different facts and the caller says something
# different about each. Collapsing "declared without a reason" into "not declared" would make the
# reason-less row silently ineffective, and collapsing it into "declared" would let a bare path switch
# a Structural finding off -- which is the loophole §6's reasoned-exemption rule exists to refuse.
#
# One row per line, `<path> -- <reason>`, `#` comments and blanks skipped. Unlike `.conformance-tier`
# this reads EVERY row: a tier is one fact about the repo, an exemption set is one fact per doc.
# The path is matched whole, never as a prefix: a substring match would let `docs/` exempt the tree.
_exempt_reason() {
  [ -f "$1/.conformance-exempt" ] || return 1
  _xfound=0; _xreason=''
  while IFS= read -r _xline || [ -n "$_xline" ]; do
    _xline=$(printf '%s' "$_xline" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')
    [ -z "$_xline" ] && continue
    case "$_xline" in '#'*) continue ;; esac
    _xpath=$(printf '%s' "$_xline" | sed 's/[[:space:]]*--.*$//' | sed 's/[[:space:]]*$//')
    [ "$_xpath" = "$2" ] || continue
    _xfound=1
    case "$_xline" in
      # Strip through the FIRST `--` by parameter expansion, never by a `[^-]*` regex: a path
      # routinely contains a single hyphen (`acceptance-criteria.md`) and the regex stops at it, so
      # the separator is never reached and the path is emitted as part of its own reason. Caught on
      # real input -- `requirements.md` has no hyphen and read correctly, which is exactly how a
      # fixture using only that path would have gone green over the bug (L-142).
      *--*) _xreason=$(printf '%s' "${_xline#*--}" | sed 's/^[[:space:]]*//') ;;
      *)    _xreason='' ;;
    esac
    break
  done < "$1/.conformance-exempt"
  [ "$_xfound" -eq 1 ] || return 1
  [ -n "$_xreason" ] || return 2
  printf '%s' "$_xreason"; return 0
}

# _tier_declared <repo> -- the declared tier token, normalised; empty when undeclared. First
# non-blank, non-comment line only: a tier is one fact, and reading further would invent a repo at
# two tiers at once.
_tier_declared() {
  [ -f "$1/.conformance-tier" ] || { printf ''; return; }
  _t=$(grep -v '^[[:space:]]*#' "$1/.conformance-tier" | grep -v '^[[:space:]]*$' | head -1 \
       | tr '[:upper:]' '[:lower:]' | tr -d '[:space:]')
  case "$_t" in
    base)                                  printf 'base' ;;
    backend|integration|backend/integration) printf 'backend' ;;
    medium|complex|medium/complex|medium+) printf 'medium' ;;
    multi-service|multiservice|multisvc)   printf 'multisvc' ;;
    "")                                    printf '' ;;
    *)                                     printf 'UNKNOWN:%s' "$_t" ;;
  esac
}

_tier_rank_of_name() {
  case "$1" in
    base) printf '1' ;; backend) printf '2' ;; medium) printf '3' ;; multisvc) printf '4' ;;
    *)    printf '0' ;;
  esac
}

_tier_label() {
  case "$1" in
    1) printf 'Base' ;; 2) printf 'Backend / integration' ;; 3) printf 'Medium / complex' ;;
    4) printf 'Multi-service' ;; *) printf 'unknown' ;;
  esac
}

# _s2_tier_rows <spec> -- `<rank>|<path>` for every docs-tree row with a LITERAL path that some tier
# owes. Pattern rows (`flows/<slug>.md`) are excluded for the same reason _s2_rows excludes them: a
# pattern names a family, and a family cannot be "missing". `always` rows are excluded because
# S2.F-FILE owns them.
#
# Trap 1 and trap 2 from _s2_rows apply here verbatim and are guarded the same way: §2's own
# Conformance table lives inside §2 (its Rule cells would parse as File cells), and the docs tree
# carries a Tier column the root tables do not, so Create sits at a different index.
_S2_TIER_CACHE=""
_S2_TIER_DONE=0
_s2_tier_rows() {
  [ "$_S2_TIER_DONE" -eq 1 ] && { printf '%s\n' "$_S2_TIER_CACHE"; return; }
  _S2_TIER_DONE=1
  # The RANK is resolved inside this one awk pass, not by a shell function per row. That is not
  # tidiness: the first cut called _tier_rank_of_cell from a `while read` loop, ten times over ~20
  # rows per run, and cost the engine 38% of its wall clock on a four-file repository -- the harness
  # invokes it about sixty times, which took the gate past ten minutes. Same lesson S2.R-PLACEMENT
  # paid 29 seconds for and the ownership family paid ~2,800 awk processes for: walk once, then
  # filter. Third sighting; the cost model is not optional.
  _S2_TIER_CACHE=$(awk '
    /^## §2/ { in2 = 1; next }
    /^## §/  { in2 = 0 }
    !in2     { next }
    /^\*\*Conformance/        { in2 = 0; next }
    /^\*\*`docs\/` tree\*\*/  { intree = 1; next }
    /^\*\*/                   { intree = 0 }
    !intree { next }
    /^\|/ {
      if ($0 ~ /^\|[ ]*File[ ]*\|/) next
      if ($0 ~ /^\|[-| ]*\|$/)      next
      n = split($0, c, "|"); if (n < 7) next
      file = c[2]; tier = c[3]; cre = c[6]
      if (match(file, /`[^`]+`/)) p = substr(file, RSTART + 1, RLENGTH - 2); else next
      if (cre ~ /always/) next
      # §2 Tier cell -> §6 tier rank; 0 = owed by no tier. `API exists` ranks with backend because §6
      # names api/openapi.yaml in the Backend doc set -- "exposes an API" and "the substrate is
      # present" are the same fact. auth and DB have no such tier statement anywhere in §6, so they
      # stay at 0 and are reported as substrate-gated rather than owed.
      rank = 0
      # multi-service is tested FIRST, not appended: it is the most specific tier, and a cell that
      # ever names two (`medium+, multi-service`) is owed at the higher one. Added SPRINT-079 T2 --
      # before it, §2 carried no row any tier-4 test could match, so S6.MULTISVC reported
      # tier-doc-set-underivable and adding the rows alone would have fixed nothing visible.
      if      (tier ~ /multi-service/)             rank = 4
      else if (tier ~ /medium/)                    rank = 3
      else if (tier ~ /backend/ || tier ~ /API exists/) rank = 2
      else if (tier ~ /base/)                      rank = 1
      if (rank == 0) next
      # A PATTERN row (`flows/<slug>.md`) names a family, and a family cannot be "missing" -- but it
      # is emitted and MARKED rather than dropped, because "this tier has no rows at all" and "this
      # tier has only families" are different facts, and only the first is a hole in the standard.
      print rank "\t" "docs/" p "\t" ((p ~ /[<>*]/) ? "pattern" : "literal")
    }' "$1")
  printf '%s\n' "$_S2_TIER_CACHE"
}

# _tier_rows_at <spec> <rank> <literal|pattern> -- the paths owed by EXACTLY that tier, of one kind.
# Not cumulative: each rule answers for its own row of §6's table, and folding lower tiers in would
# make S6.MEDIUM re-report every finding S6.BASE already named. A grep over a string already in
# memory, never a walk (see the cost note above).
_tier_rows_at() {
  _s2_tier_rows "$1" | awk -F'	' -v r="$2" -v k="$3" '$1 == r && $3 == k { print $2 }'
}


# _tier_substrate_stems <spec> <rank> -- the paths §6's OWN tier row marks substrate-conditional,
# read from the text after the words "substrate-conditional" in that row's Doc set cell.
#
# WHY §6 AND NOT §2's Create CELL. Both describe a condition and they do not agree: §2 writes
# `development/coding-standards`'s trigger as a bare "init", while §6 lists that exact file among the
# rows that are "skipped, not owed" without code. §6's tier table is the statement OF the tier doc
# sets -- §2's Tier column only assigns rows to them -- so where the two differ about what a tier owes,
# §6 is the one being asked. Reading §2's Create prose for condition words instead was tried and
# rejected: it makes `product/requirements.md` conditional (its cell says "or first sanitized PRD
# lands ... skipped on an existing repo whose AI-context files already ARE the spec") when §6 lists it
# in the Base minimum unconditionally, which would empty the one tier set that has teeth.
#
# `{a,b}` in a stem is expanded -- §6 writes `deployment/{deployment,rollback}-guide` for two files.
_TIER_STEMS_CACHE=""
_TIER_STEMS_RANK=""
_tier_substrate_stems() {
  # Cached per rank: five rules ask the same question of a fixed spec, and the answer costs an awk
  # plus a shell loop each time. Same cost model as _s2_tier_rows above -- walk once, then filter.
  [ "$_TIER_STEMS_RANK" = "$2" ] && { printf '%s\n' "$_TIER_STEMS_CACHE"; return; }
  _TIER_STEMS_RANK=$2
  _TIER_STEMS_CACHE=$(
    awk -v want="$2" '
      /^## /{h=$0; sub(/^## [^0-9]*/,"",h); sec=h+0}
      sec != 6 { next }
      /^\| \*\*Base\*\*/                    { r=1 }
      /^\| \*\*Backend/                     { r=2 }
      /^\| \*\*Medium/                      { r=3 }
      /^\| \*\*Multi-service\*\*/           { r=4 }
      /^\|/ && r == want+0 {
        i = index($0, "substrate-conditional")
        if (i == 0) { r=0; next }
        t = substr($0, i)
        while (match(t, /`[^`]+`/)) { print substr(t, RSTART+1, RLENGTH-2); t = substr(t, RSTART+RLENGTH) }
        r = 0
      }
    ' "$1" | while read -r _s; do
      case "$_s" in
        *"{"*)
          _pre=${_s%%\{*}; _mid=${_s#*\{}; _alts=${_mid%%\}*}; _post=${_mid#*\}}
          _old=$IFS; IFS=','
          for _a in $_alts; do IFS=$_old; printf '%s%s%s\n' "$_pre" "$_a" "$_post"; IFS=','; done
          IFS=$_old ;;
        *) printf '%s\n' "$_s" ;;
      esac
    done
  )
  printf '%s\n' "$_TIER_STEMS_CACHE"
}

# _tier_is_conditional <stems> <docs-relative-path> -- does a §2 row match one of §6's stems? Matched
# on the path with `docs/` and any extension stripped, so `docs/testing/testing-guide.md` meets
# `testing/testing-guide`, and a trailing `/` on a stem covers the tree beneath it (`database/`).
# Also matched on BASENAME, because §6 writes `authentication` for `architecture/authentication.md`.
_tier_is_conditional() {
  _cstems=$1; _cpath=$2
  _cnorm=${_cpath#docs/}; _cnorm=${_cnorm%.*}
  _cbase=${_cnorm##*/}
  for _st in $_cstems; do
    case "$_st" in
      */) case "$_cnorm/" in "$_st"*) return 0 ;; esac ;;
      *)  [ "$_cnorm" = "$_st" ] && return 0
          [ "$_cbase" = "$_st" ] && return 0 ;;
    esac
  done
  return 1
}
# _tier_assert <id> <rule-rank> <repo> -- the ONE check. Every one of the five rules is this function
# with a different rank; §2's `S2.F-TIER` passes the DECLARED rank, because §2 states the rule
# generically ("tier satisfaction is mechanical") rather than for one tier. The id is padded here, so
# a caller passes the bare rule id and the report's columns cannot drift apart per call site.
_tier_assert() {
  _tid=$(printf '%-20s' "$1"); _trank=$2; _trepo=$3
  _tdecl=$(_tier_declared "$_trepo")
  _tlabel=$(_tier_label "$_trank")

  case "$_tdecl" in
    UNKNOWN:*)
      bad "$_tid-- tier-declaration-unreadable: .conformance-tier says '${_tdecl#UNKNOWN:}', which is not one of §6's four tiers (base · backend · medium · multi-service). A declaration nobody can read is worse than none: it looks like an answer and selects no doc set (L-058)"
      return ;;
  esac

  _tdrank=$(_tier_rank_of_name "$_tdecl")
  if [ -z "$_tdecl" ]; then
    # Undeclared. Base needs no detection -- §6's trigger for it is *every dev repo* -- so it is the
    # one rule that still answers. The other three decline, and say which fact is missing.
    if [ "$_trank" -ne 1 ]; then
      note "$_tid-- not evaluated: this repository declares no tier (no .conformance-tier), and §6 marks tier detection JUDGED, not mechanical. $_tlabel's doc set is owed only once someone rules the repo is at that tier; guessing it here would report files against a repo that never owed them"
      return
    fi
  elif [ "$_tdrank" -lt "$_trank" ]; then
    note "$_tid-- not evaluated: this repository declares tier '$_tdecl', below $_tlabel. §6 moves a repo up a tier by EVENT, not by ceremony, so a lower-tier repo does not owe this row's docs"
    return
  fi

  _trows=$(_tier_rows_at "$spec" "$_trank" literal)
  _tpats=$(_tier_rows_at "$spec" "$_trank" pattern)
  if [ -z "$_trows" ]; then
    if [ -n "$_tpats" ]; then
      # Rows exist; every one of them names a FAMILY. `docs/adr/ADR-NNN-<slug>.md` and
      # `docs/flows/<slug>.md` cannot be "missing" the way a named file can -- a repo with no ADRs has
      # taken no qualifying decision, which §4 makes correct rather than incomplete. Distinguished from
      # the branch below because the two say opposite things about the STANDARD: this one says the spec
      # describes the tier and the description is not file-shaped, that one says the spec is silent.
      _tpats=$(printf '%s' "$_tpats" | tr '
' ' ')   # one line per rule: a note that wraps is two rules to a parser
      note "$_tid-- not evaluated: every §2 row at $_tlabel names a FAMILY ($_tpats), and a family cannot be missing. §6's own $_tlabel doc set also names \`DECISIONS.md\`, which §2 carries only inside a pattern row's File cell and this engine therefore cannot address -- filed rather than guessed at"
      return
    fi
    # No row at all. An empty required set passes every repository -- the false negative
    # assert_S2_F_FILE's own guard refuses. Here it is not a parse failure but a real hole in the
    # standard: §6 names Multi-service's three docs (service registry · cross-service dependency map ·
    # global decisions index) and §2's table carries a row for none of them, so "reduces to S2.F-FILE"
    # has nothing to reduce to. Named where a reader meets it (SPRINT-078 T2, owner-ruled).
    bad "$_tid-- tier-doc-set-underivable: §6 names a doc set for $_tlabel that §2's table carries not one row for, so no required set can be derived from the spec. §6 says every tier's satisfaction half reduces to S2.F-FILE; for this tier there is nothing to reduce to. This is a finding about the STANDARD, not about this repository"
    return
  fi

  _tstems=$(_tier_substrate_stems "$spec" "$_trank")
  _tmissing=0; _tpresent=0; _tskipped=""
  for _p in $_trows; do
    if _tier_is_conditional "$_tstems" "$_p"; then
      _tskipped="$_tskipped $_p"
      continue
    fi
    # §6's reasoned exemption. Consulted only for an ABSENT doc: a repo that declares a doc exempt and
    # then writes it anyway has not lied about anything, and reporting the present file as excluded
    # would be noise. Order matters against the substrate branch above -- a substrate-conditional row
    # is not owed by anyone and needs no local ruling, so it never reaches here.
    if [ ! -e "$_trepo/$_p" ]; then
      _xr=$(_exempt_reason "$_trepo" "$_p"); _xrc=$?
      if [ "$_xrc" -eq 0 ]; then
        # NAMED, never silently dropped (§6) -- with the reason, because the reason is the whole
        # difference between a ruling and a switched-off finding, and a reader cannot judge one it
        # cannot see (L-058).
        note "$_tid-- exempt by declaration (.conformance-exempt): $_p -- $_xr. §6 lets a repository rule a doc unnecessary and say why; this is that ruling, reported rather than dropped. It says nothing about what any other repository owes"
        continue
      elif [ "$_xrc" -eq 2 ]; then
        # A bare path is not a ruling. Same shape as `tier-declaration-unreadable`: a declaration
        # nobody can read is worse than none, because it looks like an answer. The doc stays owed --
        # the finding below still fires -- so this row ADDS a finding rather than replacing one.
        bad "$_tid-- exemption-reason-missing: $_p is declared in .conformance-exempt with no reason after \`--\`. §6 requires an exemption to state why the doc is not owed here; without one it is the finding turned off, not a decision, so the doc is still owed"
      fi
    fi
    if [ -e "$_trepo/$_p" ]; then
      _tpresent=$((_tpresent + 1))
    else
      _tmissing=$((_tmissing + 1))
      # `${v:+a}${v:-b}` emits BOTH when v is set -- `:-` yields the VALUE, not the fallback -- so
      # this read "declares tier 'medium'medium" on every finding. Computed once instead (T6).
      if [ -n "$_tdecl" ]; then _twho="declares tier '$_tdecl'"; else _twho="is a dev repo, which §6 makes Base by trigger"; fi
      bad "$_tid-- tier-doc-set-incomplete: $_p -- §6 places this file in $_tlabel's unconditional doc set and this repository $_twho, so it is owed. Absent, the reader §2 names for it has nowhere to look"
    fi
  done

  # The skipped rows are NAMED, never silently dropped: §6 says a substrate-conditional row is
  # "skipped, not owed" when the substrate is absent, and whether the substrate is present is judged.
  # Saying which rows were set aside is what lets a human rule on them; saying nothing would make a
  # skip indistinguishable from a pass.
  [ -n "$_tskipped" ] && note "$_tid-- substrate-conditional, skipped not owed (§6):$_tskipped. Each is owed only once its substrate exists, which §6 leaves to judgement"
  [ "$_tmissing" -gt 0 ] && return
  if [ "$_tpresent" -eq 0 ]; then
    note "$_tid-- no unconditional doc is owed at $_tlabel once §6's substrate-conditional rows are set aside. States that nothing was checkable here, never that the tier passed"
    return
  fi
  ok "$_tid-- all $_tpresent unconditional $_tlabel doc(s) present at their canonical §2 path"
}

# The five wrappers. Each is the tier, and nothing else -- which is the point the register made when
# it dispositioned this family as one check rather than four.
assert_S6_BASE()     { _tier_assert "S6.BASE"     1 "$1"; }
assert_S6_BACKEND()  { _tier_assert "S6.BACKEND"  2 "$1"; }
assert_S6_MEDIUM()   { _tier_assert "S6.MEDIUM"   3 "$1"; }
assert_S6_MULTISVC() { _tier_assert "S6.MULTISVC" 4 "$1"; }

# §2's own statement of the rule, and it answers the half §6's four rules do NOT. §14 marks it
# `split -- tier satisfaction is mechanical (reduces to S2.F-FILE); tier detection is judged (§6)`.
# Satisfaction is exactly what S6.BASE .. S6.MULTISVC above just reported, per tier. Repeating it here
# for the declared tier was the first shape tried and it was wrong: a backend repo missing
# `docs/api/openapi.yaml` collected the identical finding twice, under two rule ids, which is the
# double-counting § scope-out (a) of the register exists to prevent -- one constraint, one report.
#
# So this rule answers the DECLARATION: is the judged half recorded at all, and legibly? That is
# mechanical, it is §2's to ask, and nothing else asks it.
assert_S2_F_TIER() {
  _fdecl=$(_tier_declared "$1")
  case "$_fdecl" in
    UNKNOWN:*)
      bad "$(printf '%-20s' 'S2.F-TIER')-- tier-declaration-unreadable: .conformance-tier says '${_fdecl#UNKNOWN:}', which is not one of §6's four tiers (base · backend · medium · multi-service). A declaration nobody can read is worse than none: it looks like an answer and selects no doc set (L-058)"
      return ;;
  esac
  if [ -z "$_fdecl" ]; then
    note "$(printf '%-20s' 'S2.F-TIER')-- no tier declared (.conformance-tier absent), so only Base was evaluated above -- §6 makes Base every dev repo's by trigger and the other three need the judged half. Not a finding: §2 routes detection to §6, which marks it judged, and a repo is not obliged to write the ruling down. Declaring it is what turns three unevaluated rules into three checked ones"
    return
  fi
  ok "$(printf '%-20s' 'S2.F-TIER')-- tier declared as '$_fdecl' (.conformance-tier), so §6's judged half is recorded and S6.BASE .. S6.MULTISVC above could evaluate satisfaction against it"
}

# --- §13 attestation family (SPRINT-078 T1) -------------------------------------------------------
# Migrated from scripts/lib/check-attestation.sh (deleted this task), following the §9 gates-signed
# precedent exactly: the rule set was already the spec's, the assertion bodies move verbatim, and the
# finding text is unchanged -- established by diffing both tools' §13 lines before the old file was
# removed, never by reading them side by side (D2 · D3).
#
# WHY THE MIGRATION IS THE WHOLE POINT. These five assertions have worked and been fixture-guarded
# since SPRINT-074, and no adopter has ever seen one: check-attestation.sh was reachable only from
# scripts/qa-check.sh, this repository's own gate, while conformance.sh -- the consumer entry point --
# execs this engine alone. Five rules that fire correctly and are unreachable from the only door a
# stranger knows about are, from that stranger's side, indistinguishable from five rules nobody wrote.
#
# THE ONE REPORT-SHAPE CHANGE, stated rather than discovered later: check-attestation.sh closed with a
# §13-specific `level:` line of its own. It does not migrate -- this engine publishes ONE level line
# for the whole sweep, and §13's five rules are all Attested-level, so their findings already reach it
# through `attested_fail`. A second level line scoped to one section would state a level for a subset,
# which is exactly the "level as a score for part of the tree" reading §14 forbids. The per-rule lines
# below are byte-identical; the closing line is the engine's.
#
# THE GUARD THAT CHECK-ATTESTATION.SH DID NOT NEED. That script took a `<commit-ish>` and refused to
# run without a git repository -- correct for a checker only ever pointed at this repo's HEAD. The
# engine is pointed at anything, including the throwaway NON-git fixture directories its own harness
# builds, so the same refusal here would turn every existing engine fixture red over a git repository
# nobody asked for. §13 is defined over git objects: where there are none, these rules are NOT
# EVALUATED and say so. That is a note, never a pass and never a finding -- a directory that is not a
# git repository has not violated §13, and reporting that it has would be a finding no adopter can
# clear (§14), while passing it would be approval nothing earned.

_ATT_DONE=0
_ATT_REASON=""       # non-empty => §13 is not evaluable here, and this says why
_ATT_SHA=""; _ATT_SHORT=""
_ATT_SIGNER=""; _ATT_GATE=""; _ATT_EV=""
_ATT_GSIG=""; _ATT_NPARENTS=0
_ATT_EVPATH=""; _ATT_EVPIN=""
_ATT_PRESENT=0

# _att_fmv_stdin <key> -- the frontmatter value of <key> read from stdin. The file-taking sibling
# `_s9_gates_fmv` cannot serve here: §13b reads its record out of a GIT BLOB at a pinned sha, which
# has no path in the working tree to hand it. Same parse, different source; the near-duplicate is
# deliberate rather than refactored mid-migration, because D2 makes this task a move and a shared
# frontmatter reader is a change. Filed at close.
_att_fmv_stdin() {
  awk -v k="$1" 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} $0~"^"k":"{sub("^"k":[ ]*","");print;exit}'
}

# Gate names compared as a SET, not as a string: `Gate: G2,G1` and a record of `G1, G2` state the same
# fact, and a textual comparison would report a disagreement that is not one.
_att_norm_gates() {
  printf '%s' "$1" | tr -d '[:space:]' | tr ',' '\n' | sed '/^$/d' | sort | tr '\n' ',' | sed 's/,$//'
}

# ONE pass over the git objects, cached -- five assertions read the same six facts, and the engine's
# cost model is "walk once, then filter" (the lesson S2.R-PLACEMENT paid 29 seconds for).
#
# Deliberately absent from this block: %an %ae %cn %ce. Author and committer identity are never read,
# because §13e says they are not the attestation -- S13.NOTAUTHOR is honoured BY CONSTRUCTION here,
# never evaluated against the repository under test. That is why it needs no assertion and why the
# spec's own Mark column, not a skip list in this file, is what excludes it.
_att_scan() {
  [ "$_ATT_DONE" -eq 1 ] && return 0
  _ATT_DONE=1
  _att_repo=$1

  if ! command -v git >/dev/null 2>&1; then
    _ATT_REASON="git is not available on this host, and §13 is defined over git objects"
    return 0
  fi
  if ! git -C "$_att_repo" rev-parse --git-dir >/dev/null 2>&1; then
    _ATT_REASON="$_att_repo is not a git repository, and §13 is defined over git objects"
    return 0
  fi
  _ATT_SHA=$(git -C "$_att_repo" rev-parse --verify "$rev^{commit}" 2>/dev/null) || _ATT_SHA=""
  if [ -z "$_ATT_SHA" ]; then
    _ATT_REASON="'$rev' names no commit in this repository, and §13 is defined over git objects"
    return 0
  fi
  _ATT_SHORT=$(printf '%s' "$_ATT_SHA" | cut -c1-7)

  _ATT_SIGNER=$(git -C "$_att_repo" log -1 --format='%(trailers:key=Gate-Signed-By,valueonly)' "$_ATT_SHA" | sed '/^[[:space:]]*$/d')
  _ATT_GATE=$(git   -C "$_att_repo" log -1 --format='%(trailers:key=Gate,valueonly)'           "$_ATT_SHA" | sed '/^[[:space:]]*$/d')
  _ATT_EV=$(git     -C "$_att_repo" log -1 --format='%(trailers:key=Evidence,valueonly)'       "$_ATT_SHA" | sed '/^[[:space:]]*$/d')
  _ATT_GSIG=$(git   -C "$_att_repo" log -1 --format='%G?' "$_ATT_SHA")
  _att_parents=$(git -C "$_att_repo" log -1 --format='%P' "$_ATT_SHA")
  _ATT_NPARENTS=$(printf '%s' "$_att_parents" | wc -w | tr -d ' ')

  # `Evidence: <path> @ <sha>` -- split once, reused by S13.EVIDENCESHA and S13.AGREE.
  _ATT_EVPATH=$(printf '%s' "$_ATT_EV" | sed -n 's/^[[:space:]]*\(.*[^[:space:]]\)[[:space:]]*@.*/\1/p')
  _ATT_EVPIN=$(printf  '%s' "$_ATT_EV" | sed -n 's/.*@[[:space:]]*\([0-9a-f]\{7,40\}\).*/\1/p')
  [ -n "$_ATT_EVPATH" ] || _ATT_EVPATH=$(printf '%s' "$_ATT_EV" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')

  # How many of the three trailers are present -- S13.TRAILERS decides on this, and the other
  # assertions consult it so they never report a second finding about a trailer that is simply absent.
  _ATT_PRESENT=0
  [ -n "$_ATT_SIGNER" ] && _ATT_PRESENT=$((_ATT_PRESENT + 1))
  [ -n "$_ATT_GATE" ]   && _ATT_PRESENT=$((_ATT_PRESENT + 1))
  [ -n "$_ATT_EV" ]     && _ATT_PRESENT=$((_ATT_PRESENT + 1))
  return 0
}

# _att_unevaluable <id> -- the shared "no git objects to read" note, padded here so the id column lines
# up with every other line this engine prints. Returns 0 when it fired, so each assertion can `&& return`.
_att_unevaluable() {
  [ -n "$_ATT_REASON" ] || return 1
  note "$(printf '%-20s' "$1")-- not evaluated: $_ATT_REASON. Not a finding: a tree with no commits has not violated §13, and reporting one would be a finding no adopter can clear (§14)"
  return 0
}

assert_S13_TRAILERS() {
  _att_scan "$1"
  _att_unevaluable "S13.TRAILERS" && return
  if [ "$_ATT_PRESENT" -eq 0 ]; then
    note "S13.TRAILERS        -- no attestation claimed (none of the three trailers present). Reported, never read as approval"
    return
  fi
  if [ "$_ATT_PRESENT" -lt 3 ]; then
    _att_missing=""
    [ -n "$_ATT_SIGNER" ] || _att_missing="$_att_missing Gate-Signed-By:"
    [ -n "$_ATT_GATE" ]   || _att_missing="$_att_missing Gate:"
    [ -n "$_ATT_EV" ]     || _att_missing="$_att_missing Evidence:"
    bad "S13.TRAILERS        -- attestation-trailers-incomplete: missing$_att_missing. §13a requires all three together; a Gate: without a Gate-Signed-By: asserts a gate applied and declines to say who approved it, which is weaker than saying nothing"
    return
  fi
  ok "S13.TRAILERS        -- all three trailers present together"
}

assert_S13_OWNCOMMIT() {
  _att_scan "$1"
  _att_unevaluable "S13.OWNCOMMIT" && return
  [ "$_ATT_PRESENT" -gt 0 ] || { note "S13.OWNCOMMIT       -- not evaluated: no attestation claimed on $_ATT_SHORT"; return; }
  if [ "$_ATT_NPARENTS" -gt 1 ]; then
    bad "S13.OWNCOMMIT       -- attestation-not-on-task-commit: $_ATT_SHORT is a merge commit ($_ATT_NPARENTS parents). §13a puts the trailers on the task's own commit, not the merge"
    return
  fi
  _att_touched=$(git -C "$1" show --format= --name-only "$_ATT_SHA" 2>/dev/null | sed '/^[[:space:]]*$/d' | wc -l | tr -d ' ')
  if [ "$_att_touched" -eq 0 ]; then
    bad "S13.OWNCOMMIT       -- attestation-not-on-task-commit: $_ATT_SHORT changes no files, so it is a separate approval commit rather than the commit that implements the work (§13a)"
    return
  fi
  ok "S13.OWNCOMMIT       -- task's own commit ($_ATT_NPARENTS parent, $_att_touched file(s) changed)"
}

assert_S13_EVIDENCESHA() {
  _att_scan "$1"
  _att_unevaluable "S13.EVIDENCESHA" && return
  [ -n "$_ATT_EV" ] || { note "S13.EVIDENCESHA     -- not evaluated: no Evidence: trailer to read"; return; }
  if [ -z "$_ATT_EVPIN" ]; then
    bad "S13.EVIDENCESHA     -- evidence-path-unpinned: 'Evidence: $_ATT_EV' carries no '@ <sha>'. The path is not immutable even though the trailer is; planning records get archived and renamed, and a bare path silently stops resolving (§13a)"
    return
  fi
  if ! git -C "$1" cat-file -e "$_ATT_EVPIN:$_ATT_EVPATH" 2>/dev/null; then
    bad "S13.EVIDENCESHA     -- evidence-path-unpinned: '$_ATT_EVPATH' does not resolve at $_ATT_EVPIN ('git show $_ATT_EVPIN:$_ATT_EVPATH' fails). A pin that does not resolve is not a pin"
    return
  fi
  ok "S13.EVIDENCESHA     -- Evidence: pinned and resolving ($_ATT_EVPATH @ $_ATT_EVPIN)"
}

# Where the sprint-level record is READ, and why it is two places rather than one. `gates_signed:
# <GATES> @ <sha>` names the commit the gates were signed AT, so the field naming that sha is
# necessarily written in a LATER commit than the one it names. An Evidence: pin at the signing sha
# therefore resolves to a version of the sprint file that does not yet carry the record -- which is
# the normal, correct state of the first attested commit of every sprint, not a violation. Demanding
# the record at the pin would make that commit impossible to comply with, and a finding no adopter
# can clear is exactly what §14 forbids. So: read at the pin, fall back to the attesting commit's own
# tree (the repository state when the claim was made), and NAME which one answered. Absent from both
# is still a FAIL -- the trailer would be carrying a fact nothing in the repository records.
# Found by running this checker against this repository's own T1 commit rather than reasoned out.
assert_S13_AGREE() {
  _att_scan "$1"
  _att_unevaluable "S13.AGREE" && return
  { [ -n "$_ATT_GATE" ] && [ -n "$_ATT_EV" ]; } || { note "S13.AGREE           -- not evaluated: needs both Gate: and Evidence: to compare"; return; }
  if [ -n "$_ATT_EVPIN" ]; then _att_at=$_ATT_EVPIN; else _att_at=$_ATT_SHA; fi
  _att_blob=$(git -C "$1" show "$_att_at:$_ATT_EVPATH" 2>/dev/null) || _att_blob=""
  if [ -z "$_att_blob" ]; then
    note "S13.AGREE           -- not evaluated: the Evidence: target is unreadable at $_att_at; that is S13.EVIDENCESHA's finding, not a disagreement"
    return
  fi
  _att_recorded=$(printf '%s\n' "$_att_blob" | _att_fmv_stdin gates_signed)
  case "$_att_recorded" in "["*) _att_recorded="" ;; esac
  _att_readat="the Evidence: pin $_att_at"
  if [ -z "$_att_recorded" ] && [ "$_att_at" != "$_ATT_SHA" ]; then
    _att_blob=$(git -C "$1" show "$_ATT_SHA:$_ATT_EVPATH" 2>/dev/null) || _att_blob=""
    _att_recorded=$(printf '%s\n' "$_att_blob" | _att_fmv_stdin gates_signed)
    case "$_att_recorded" in "["*) _att_recorded="" ;; esac
    _att_readat="the attesting commit $_ATT_SHORT (the pin $_att_at predates the record, as it must)"
  fi
  if [ -z "$_att_recorded" ]; then
    bad "S13.AGREE           -- attestation-disagrees-with-sprint: '$_ATT_EVPATH' records no gates_signed: at the Evidence: pin $_att_at nor at the attesting commit $_ATT_SHORT, so the commit carries a sprint-level fact nothing in the repository records (§13b)"
    return
  fi
  _att_recgates=$(_att_norm_gates "$(printf '%s' "$_att_recorded" | sed -n 's/^\([^@]*\)@.*/\1/p')")
  [ -n "$_att_recgates" ] || _att_recgates=$(_att_norm_gates "$_att_recorded")
  _att_trgates=$(_att_norm_gates "$_ATT_GATE")
  if [ "$_att_recgates" != "$_att_trgates" ]; then
    bad "S13.AGREE           -- attestation-disagrees-with-sprint: trailer says 'Gate: $_att_trgates', the record at '$_ATT_EVPATH' says '$_att_recgates' (read at $_att_readat). §13b requires the two to agree -- the trailer carries the sprint-level fact, it does not restate it differently"
    return
  fi
  ok "S13.AGREE           -- trailer and sprint record agree ($_att_trgates), read at $_att_readat"
}

# The one finding in this engine that is reported, named, and deliberately NOT a failure. An unsigned
# commit carrying perfect trailers has genuinely reached Gated and genuinely has not reached Attested,
# and §14 says a report states that as a LEVEL, never as a defect. It therefore `hold`s rather than
# fails: the line reads exactly like a note and never touches the exit code, while `attested_hold`
# stops the level line stepping over it and printing Attested. Note alone would have been the silent
# downgrade the hold class was added to prevent -- see `hold` at the top of this file.
#
# Its fixture asserts the OUTPUT, not the status, because that is the only way to tell "reported
# honestly" from "silently passed" (L-103).
#
# This wording is also where S13.NOINFER is demonstrated rather than asserted: it says what the
# repository STATES and stops there, refusing to conclude that the named person approved anything.
assert_S13_UNSIGNEDCLAIM() {
  _att_scan "$1"
  _att_unevaluable "S13.UNSIGNEDCLAIM" && return
  [ "$_ATT_PRESENT" -gt 0 ] || { note "S13.UNSIGNEDCLAIM   -- not evaluated: no attestation claimed on $_ATT_SHORT"; return; }
  if [ "$_ATT_GSIG" = "G" ]; then
    ok "S13.UNSIGNEDCLAIM   -- commit signature is good (%G? = G); the trailer's contents are covered by it"
    return
  fi
  hold "S13.UNSIGNEDCLAIM   -- attestation-unsigned-claim-only: %G? = $_ATT_GSIG (no good signature). The repository STATES that '$_ATT_SIGNER' approved '$_ATT_GATE' and points at '$_ATT_EVPATH'; a verifier may NOT conclude from this that the named person approved anything (§13c)"
}

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
#   docs/adr/ADR-*.md  -- §3's **ADR exception**, stated in the standard as of spec 0.4.2. §4 ships an
#                         ADR template whose frontmatter is the ADR-009 knowledge metadata
#                         (id/tags/domain/status/related), and a decided ADR is append-only, so §3's
#                         last_updated/update_trigger describe a lifecycle it does not have. Ruled at
#                         SPRINT-075 T6 and enforced here from then; SPRINT-076 T5 moved the RULING
#                         into §3, so this comment now CITES the standard instead of carrying it. That
#                         direction matters: a rule a checker applies and the spec does not state is
#                         unreviewable, and a checker's silence is not where a spec question is settled.
#   a declared exploratory tree -- §3's **exploratory-tree exception** (spec 0.4.2): a tree whose own
#                         index/README frontmatter carries `governed: false`. Read from the SPEC's
#                         rule, never from a path this file remembers -- see _own_governed_off.
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

# _own_governed_off <repo> -- directories the repository DECLARES exploratory, one per line,
# repo-relative and with a trailing `/`. §3's exploratory-tree exception (spec 0.4.2): a tree is
# exempt when its own index or README frontmatter carries `governed: false`, and the exemption covers
# the tree, everything beneath it, and the declaring file itself.
#
# A DECLARATION, NOT A PATH -- deliberately. Hard-coding `docs/strategy/` here would exempt only
# repositories that happen to use lean-flow's directory names, which is precisely the repo-specific
# leak a generic checker must not carry (L-015). Opt-in, so silence still means governed: a tree that
# says nothing is checked exactly as before, and nothing is exempted by accident.
_own_governed_off() {
  for idx in "$1"/docs/*/README.md "$1"/docs/*/INDEX.md "$1"/docs/*/*/README.md "$1"/docs/*/*/INDEX.md; do
    [ -f "$idx" ] || continue
    # Frontmatter only -- a `governed: false` mentioned in prose is discussion, not a declaration.
    awk 'NR==1 && $0!="---"{exit} NR==1{next} $0=="---"{exit} /^governed:[ \t]*false([ \t]|#|$)/{found=1; exit} END{exit !found}' "$idx" || continue
    d=${idx%/*}
    printf '%s/\n' "${d#"$1"/}"
  done
}

# _own_docs <repo> -- the doc set above, repo-relative, one per line, sorted. Cached: the three
# assertions below each need it, and walking the tree once per rule was a third of the original cost.
_OWN_DOCS_CACHE=""
_OWN_DOCS_DONE=0
_own_docs() {
  if [ "$_OWN_DOCS_DONE" -eq 1 ]; then printf '%s' "$_OWN_DOCS_CACHE"; return; fi
  r=$1
  _own_off=$(_own_governed_off "$r")
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
      skip=0
      for off in $_own_off; do
        case "$rel" in "$off"*) skip=1; break ;; esac
      done
      [ "$skip" -eq 1 ] && continue
      printf '%s\n' "$rel"
    done
  } | sort)
  _OWN_DOCS_DONE=1
  printf '%s' "$_OWN_DOCS_CACHE"
}

# _own_report_exemptions <repo> -- named, never silent. An exemption applied without saying so is
# indistinguishable from a rule that never ran (L-103), and this one is a repository's own choice
# rather than the standard's, so it earns a line naming the tree and the count it covers.
_own_report_exemptions() {
  off=$(_own_governed_off "$1")
  [ -n "$off" ] || return
  for d in $off; do
    n=$(find "$1/$d" -type f -name '*.md' 2>/dev/null | wc -l | tr -d ' ')
    note "S3.SCHEMA           -- $n doc(s) under $d exempt: the tree declares \`governed: false\` (§3's exploratory-tree exception, spec 0.4.2). A declaration, not a path -- and named here rather than applied silently"
  done
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
  [ "$nadr" -gt 0 ] && note "S3.SCHEMA           -- $nadr docs/adr/ADR-*.md exempt: §4's template carries ADR-009 knowledge metadata (id/tags/domain/status/related) instead of §3's header. §3 states this exception in full as of spec 0.4.2 (SPRINT-076 T5); this line cites the standard rather than carrying the ruling"
  _own_report_exemptions "$repo"
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
# _repo_files <repo> -- every file in the tree, repo-relative, ONE walk, cached.
#
# PERFORMANCE, and it is a correctness story too. S2.R-PLACEMENT's first implementation ran a full
# `find` PER §2 row whose canonical path was absent. Against a bare fixture directory every one of the
# ~31 literal rows is absent, so a single engine run walked the tree 31 times: **29 seconds on a
# four-file directory**, against ~1s before. The gate invokes the engine roughly fifty times across
# its harnesses, which took it from ~4 minutes to over ten and got two runs killed before the tally
# printed. One walk, cached, and the per-row test becomes a grep over a string already in memory.
# (SPRINT-075 hit the identical shape in the ownership family -- ~2,800 awk processes, fixed the same
# way. Second sighting; the engine's cost model is "walk once, then filter".)
_REPO_FILES=""
_REPO_FILES_DONE=0
_repo_files() {
  if [ "$_REPO_FILES_DONE" -eq 1 ]; then printf '%s' "$_REPO_FILES"; return; fi
  _REPO_FILES=$(find "$1" \
      \( -name .git -o -name node_modules -o -name vendor -o -name .venv -o -name dist -o -name build \) -prune -o \
      -type f -print 2>/dev/null | sed "s|^$1/||")
  _REPO_FILES_DONE=1
  printf '%s' "$_REPO_FILES"
}

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

  # ONE awk pass over (rows × file list), not a pipeline per row.
  #
  # The first implementation ran a `find` per §2 row whose canonical path was absent; the second
  # replaced that with a cached file list but still spent a `while read` subshell plus two greps per
  # row. Against a bare fixture directory every one of the ~31 literal rows is absent, so that is
  # ~124 process spawns for a four-file tree -- 11 of the engine's 20 seconds, and the gate went from
  # ~4 minutes to over ten, getting two runs killed before the tally printed. Process creation is the
  # cost here, not the work, which is why the fix is fewer processes rather than less scanning.
  # SPRINT-075 hit the identical shape in the ownership family (~2,800 awk processes) and fixed it the
  # same way. Second sighting: this engine's cost model is **walk once, then decide in one pass**.
  #
  # Existence is membership in the cached file list rather than a `[ -e ]` per row -- same answer, no
  # extra stat, and it keeps the whole decision inside the single awk.
  # Every path §2 itself names, canonical and legacy alike. Two §2 rows can share a basename
  # (`CHANGELOG.md` at the root and `spec/CHANGELOG.md`), and without this the root file -- sitting
  # exactly where its own row puts it -- is reported as a misplaced copy of the other.
  _s2_named_paths=$(printf '%s\n' "$rows" | cut -d'|' -f2,3 | tr '|' '\n' | grep -v '^$' | LC_ALL=C sort -u)

  out=$(printf '%s\n' "$rows" | awk -v files="$(_repo_files "$repo")" -v named="$_s2_named_paths" '
    BEGIN {
      n = split(files, fa, "\n")
      for (i = 1; i <= n; i++) {
        if (fa[i] == "") continue
        have[fa[i]] = 1
        b = fa[i]; sub(/^.*\//, "", b)
        byname[b] = byname[b] fa[i] "\n"
      }
      split(named, na, "\n")
      for (i in na) if (na[i] != "") isnamed[na[i]] = 1
    }
    {
      split($0, r, "|")
      canon = r[2]; legacy = r[3]
      if (canon == "") next
      if (canon in have) { ncanon++; next }
      if (legacy != "" && (legacy in have)) { nlegacy++; print "LEGACY\t" legacy "\t" canon; next }
      base = canon; sub(/^.*\//, "", base)
      dir  = canon; sub(/\/[^\/]*$/, "/", dir); if (dir == canon) dir = ""
      hits = ""; k = 0
      m = split(byname[base], cand, "\n")
      for (i = 1; i <= m; i++) {
        c = cand[i]
        if (c == "") continue
        if (c in isnamed) continue                      # another §2 row sitting where IT belongs
        if (dir != "" && index(c, dir) == 1) continue   # under the canonical dir already
        if (k++ >= 3) break
        hits = hits (hits == "" ? "" : " ") c
      }
      if (hits != "") print "STRAY\t" canon "\t" hits
    }
    END { print "COUNT\t" ncanon+0 "\t" nlegacy+0 }
  ')

  n_canon=0; n_legacy=0
  saved_ifs2=$IFS
  IFS='
'
  for line in $out; do
    IFS=$saved_ifs2
    kind=${line%%	*}; rest=${line#*	}
    a=${rest%%	*}; b=${rest#*	}
    case "$kind" in
      LEGACY)
        note "S2.R-PLACEMENT      -- $a matched second: §2 names it as the legacy path for $b. Tolerated, not silent; the canonical path is where a reader is told to look"
        ;;
      STRAY)
        bad "file-outside-canonical-placement: $a -- §2 places it here, and the repository has a file of that name at: $b. Neither the canonical path nor a legacy path §2 names, so a reader following the standard will not find it"
        ;;
      COUNT)
        n_canon=$a; n_legacy=$b
        ;;
    esac
    IFS='
'
  done
  IFS=$saved_ifs2

  [ "$last_bad" -eq 1 ] && return
  if [ "$n_canon" -eq 0 ]; then
    note "S2.R-PLACEMENT      -- none of §2's core set is present; nothing is mis-placed, which is not the same as conformant"
  else
    ok "S2.R-PLACEMENT      -- $n_canon §2 file(s) at their canonical path$([ "$n_legacy" -gt 0 ] && printf ', %s at a legacy path matched second' "$n_legacy")"
  fi
}

# --- §9's sprint-file family (SPRINT-079 T4) ------------------------------------------------------
# Five rules, six findings. They share one input -- the ACTIVE sprint Plan and its Execution Log --
# so the discovery is factored out rather than repeated per assertion.
#
# THE GLOB IS NON-RECURSIVE, AND THAT IS LOAD-BEARING (§9, S9.LOGDIR). `docs/sprint/SPRINT-*.md`
# deliberately does not reach `docs/sprint/logs/` or `docs/sprint/archive/`: an archived sprint is
# closed history and must not be re-checked, and the log is uncapped by design, so a recursive glob
# would cap and schema-check the very file ADR-014 split out to escape the cap.
_sprint_plans() {   # <repo> -> one path per active Plan, repo-relative
  [ -d "$1/docs/sprint" ] || return 0
  for _sp in "$1"/docs/sprint/SPRINT-*.md; do
    [ -f "$_sp" ] || continue
    printf '%s\n' "docs/sprint/${_sp##*/}"
  done
}

# _fm <file> <key> -- a frontmatter value, empty when absent. An unfilled template placeholder
# (`[sha — set at promote]`) is ABSENCE, not a value -- §9 says so of gates_signed and the same
# reading is the only safe one for plan_commit: a placeholder that parsed as a sha would send every
# git query to a ref that does not exist and report the resulting silence as clean.
# _s2_cap_for <spec> <File-cell fragment> -- the integer in that §2 docs-tree row's Cap cell.
# Read rather than written: 400 hard-coded here is a second SSOT that drifts from the row it copied
# the moment §2 moves (L-097 - L-130). Docs-tree rows carry the extra Tier column, so Cap is c[5].
#
# THIS IS THE SIXTH INDEPENDENT §2 PARSER (TD-070 counted five at SPRINT-078). Adding it rather than
# hard-coding the figure is the lesser of the two costs, and it is recorded rather than slipped in:
# the row's case for a shared read-spec-files.sh gets stronger by exactly one caller.
_s2_cap_for() {
  awk -v want="$2" -v col="${3:-5}" '
    /^## §2/ { in2 = 1; next }
    /^## §/  { in2 = 0 }
    !in2 { next }
    /^\*\*Conformance/ { in2 = 0; next }
    /^\|/ {
      n = split($0, c, "|"); if (n < 7) next
      if (index(c[2], want) == 0) next
      cap = c[col]
      sub(/^[^0-9]*/, "", cap); sub(/[^0-9].*$/, "", cap)
      if (cap != "") { print cap; exit }
    }' "$1"
}

_fm() {
  awk -v k="$2" 'NR==1 && $0 != "---" { exit } NR==1 { next } $0 == "---" { exit }
    $0 ~ "^" k ":" { sub("^" k ":[ ]*", ""); print; exit }' "$1"
}
_fm_real() {   # <file> <key> -- the value only when it is not a bracketed placeholder
  _v=$(_fm "$1" "$2")
  case "$_v" in ""|\[*) printf '' ;; *) printf '%s' "$_v" ;; esac
}

assert_S9_TWOFILES() {
  repo=$1
  plans=$(_sprint_plans "$repo")
  [ -n "$plans" ] || { note "S9.TWOFILES         -- no active sprint Plan under docs/sprint/ -- nothing to verify. A repository between sprints is not in violation"; return; }
  n_ok=0
  for p in $plans; do
    n=$(wc -l < "$repo/$p" | tr -d ' ')
    # 400 is read from §2's cap cell for this row, not written here -- a figure a checker hard-codes
    # is a second SSOT that drifts from the row it copied (L-097, L-130).
    cap=$(_s2_cap_for "$spec" "sprint/SPRINT-NNN-<slug>.md")
    [ -n "$cap" ] || cap=400
    [ "$n" -gt "$cap" ] && bad "sprint-plan-over-hard-cap: $p is $n lines against §2's $cap hard -- the Plan's budget is what bounds how many tasks a sprint may hold, so a breach here is not cosmetic"
    log="docs/sprint/logs/${p##*/}"
    if [ -f "$repo/$log" ]; then
      n_ok=$((n_ok + 1)); continue
    fi
    # The log is created LAZILY at the first entry (§9), so its absence is only a finding once the
    # sprint has done work. A ticked DoD box is that substrate, and it is mechanical: a Plan with no
    # tick has nothing to have logged. Without this the check would fire on every sprint in the gap
    # between promote and the first task -- a finding about correct behaviour.
    if grep -q '^- \[x\]' "$repo/$p" 2>/dev/null; then
      bad "sprint-log-missing: $log -- $p has ticked DoD, so work has happened and the Execution Log is owed. The Log is the append-only record the Retro is written from; work with no log leaves the Retro sourced from memory"
    else
      note "S9.TWOFILES         -- $p has no ticked DoD, so its Execution Log is not yet owed (§9 creates it lazily at the first entry)"
      n_ok=$((n_ok + 1))
    fi
  done
  [ "$last_bad" -eq 1 ] && return
  ok "S9.TWOFILES         -- $n_ok active sprint Plan(s) within cap, each with its Execution Log or not yet owing one"
}

assert_S9_LOGDIR() {
  repo=$1
  [ -d "$repo/docs/sprint" ] || { note "S9.LOGDIR           -- no docs/sprint/ -- nothing to verify"; return; }
  found=0
  # A log parked BESIDE the Plan rather than under logs/ is the specific failure §9 names, because
  # the sprint-file checks glob docs/sprint/*.md non-recursively: a same-directory sibling gets
  # capped and schema-checked as if it were a Plan, which is exactly what ADR-014's split avoids.
  for f in "$repo"/docs/sprint/*-log.md "$repo"/docs/sprint/*Execution-Log*.md; do
    [ -f "$f" ] || continue
    found=1
    bad "sprint-log-outside-logs-dir: docs/sprint/${f##*/} -- an Execution Log beside the Plan instead of under docs/sprint/logs/. The sprint glob is non-recursive, so a same-directory log is capped and schema-checked as a Plan (§9 - ADR-014)"
  done
  [ "$found" -eq 1 ] && return
  ok "S9.LOGDIR           -- no Execution Log sits beside a Plan; logs/ is the only log location"
}

# _plan_section -- § Plan from a sprint file on stdin, up to the NEXT `## ` heading. Owner-action is
# optional in the template ("Omit if none"), so the end marker is the next heading of any name, never
# a named one: anchoring to `## Owner-action` would silently read the whole rest of the file on a
# sprint that omitted it, and two Plans would then differ over a Retro edit (L-108 -- match by
# position, not by a token that may not be there).
_plan_section() { awk '/^## Plan$/ { inp = 1; next } inp && /^## / { exit } inp { print }'; }

assert_S9_PLANFROZEN() {
  repo=$1
  plans=$(_sprint_plans "$repo")
  [ -n "$plans" ] || { note "S9.PLANFROZEN       -- no active sprint Plan -- nothing to verify"; return; }
  if ! git -C "$repo" rev-parse --git-dir >/dev/null 2>&1; then
    note "S9.PLANFROZEN       -- history unavailable: $repo is not a git repository, so whether § Plan changed after its freeze cannot be answered. Reported rather than passed -- the absence of a record is not evidence that nothing happened"
    return
  fi
  n_frozen=0; n_accounted=0
  for p in $plans; do
    pc=$(_fm_real "$repo/$p" plan_commit)
    if [ -z "$pc" ]; then
      note "S9.PLANFROZEN       -- $p records no plan_commit (absent, or still the promote-time placeholder), so there is no freeze point to measure against. Not a pass: an unmeasurable Plan is not a frozen one"
      continue
    fi
    if ! git -C "$repo" rev-parse --verify "$pc^{commit}" >/dev/null 2>&1; then
      bad "plan-edited-after-freeze: $p records plan_commit $pc, which is not a commit in this repository. A freeze point nobody can resolve cannot be compared against, and a record that looks like evidence and is not is worse than none (§9)"
      continue
    fi
    was=$(git -C "$repo" show "$pc:$p" 2>/dev/null | _plan_section)
    now=$(_plan_section < "$repo/$p")
    if [ "$was" = "$now" ]; then
      n_frozen=$((n_frozen + 1)); continue
    fi
    # § Plan CHANGED. That alone is not the finding: §9 permits a mid-sprint shift, provided it is
    # logged as a scope-change entry. So the mechanical question this rule can actually answer is
    # whether the change is ACCOUNTED FOR -- does the log carry such an entry at all. Reporting FAIL
    # on a properly-amended Plan would be a finding no adopter could clear, since the amendment was
    # the correct action (the same false-positive class §2's create-lazily rows raise).
    #
    # The split with S9.SCOPECHANGE is real and not a duplication: this asks DOES AN ENTRY EXIST,
    # that one asks WAS IT WRITTEN FIRST. An entry added after the edit satisfies this rule and
    # fails that one, which is exactly the case §9's "before" is there to catch.
    log="docs/sprint/logs/${p##*/}"
    if [ -f "$repo/$log" ] && grep -qi '| *scope-change *|' "$repo/$log"; then
      n_accounted=$((n_accounted + 1))
      note "S9.PLANFROZEN       -- $p: § Plan differs from its state at plan_commit $pc, and $log carries a scope-change entry accounting for it. §9 permits the amendment; whether the shift itself was right is judged, not decided here"
    else
      bad "plan-edited-after-freeze: $p -- § Plan differs from its state at plan_commit $pc and $log carries no scope-change entry. §9 freezes the Plan at promote; an unaccounted edit is a Plan nobody agreed to, and the DoD it changes is one nobody re-confirmed"
    fi
  done
  [ "$last_bad" -eq 1 ] && return
  [ $((n_frozen + n_accounted)) -gt 0 ] && ok "S9.PLANFROZEN       -- $n_frozen Plan(s) unchanged since plan_commit, $n_accounted amended with a scope-change entry accounting for it"
}

assert_S9_SCOPECHANGE() {
  repo=$1
  plans=$(_sprint_plans "$repo")
  [ -n "$plans" ] || { note "S9.SCOPECHANGE      -- no active sprint Plan -- nothing to verify"; return; }
  git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || {
    note "S9.SCOPECHANGE      -- history unavailable: $repo is not a git repository, so the order of the two commits cannot be read"
    return
  }
  n_checked=0
  for p in $plans; do
    pc=$(_fm_real "$repo/$p" plan_commit)
    [ -n "$pc" ] || continue
    git -C "$repo" rev-parse --verify "$pc^{commit}" >/dev/null 2>&1 || continue
    log="docs/sprint/logs/${p##*/}"
    # Every commit after the freeze that actually changed § Plan. A commit touching the file for a
    # DoD tick or a Files Changed row is NOT a Plan edit, so the diff is taken on the SECTION, never
    # on the file -- otherwise every sprint would report a scope change on its first tick.
    prev="$pc"
    for c in $(git -C "$repo" log --reverse --format=%H "$pc..HEAD" -- "$p" 2>/dev/null); do
      a=$(git -C "$repo" show "$prev:$p" 2>/dev/null | _plan_section)
      b=$(git -C "$repo" show "$c:$p" 2>/dev/null | _plan_section)
      prev=$c
      [ "$a" = "$b" ] && continue
      n_checked=$((n_checked + 1))
      # The log AS OF that commit must already carry a scope-change entry. Reading today's log would
      # accept one written afterwards, which is precisely the order §9 forbids: the entry exists to
      # be written BEFORE the Plan is edited, so that the reason survives the edit.
      if git -C "$repo" show "$c:$log" 2>/dev/null | grep -qi '| *scope-change *|'; then
        continue
      fi
      short=$(git -C "$repo" rev-parse --short "$c" 2>/dev/null)
      bad "scope-change-logged-after-plan-edit: $p -- § Plan changed at $short with no scope-change entry in $log as of that commit. §9 puts the entry first so the reason survives the edit; logged afterwards it is a justification written knowing the outcome"
    done
  done
  [ "$last_bad" -eq 1 ] && return
  if [ "$n_checked" -eq 0 ]; then
    note "S9.SCOPECHANGE      -- no § Plan edit after freeze in any active sprint, so there is no ordering to check. States that nothing was checkable, never that the rule passed"
  else
    ok "S9.SCOPECHANGE      -- $n_checked § Plan edit(s) after freeze, each with its scope-change entry already in the log at that commit"
  fi
}

assert_S9_VERIFYCLAUSE() {
  repo=$1
  plans=$(_sprint_plans "$repo")
  [ -n "$plans" ] || { note "S9.VERIFYCLAUSE     -- no active sprint Plan -- nothing to verify"; return; }
  n_named=0
  for p in $plans; do
    # ONLY TICKED CRITERIA. §9 says a criterion names its check "where a mechanical check exists" --
    # so demanding a *Verify:* clause on every criterion would fire on judgment criteria that
    # legitimately have none, and a false positive here is a false negative about the contract.
    # A TICKED box is different: the template requires `- [x] ... - <what proved it>`, so a claim of
    # done that names no evidence is checkable without judging whether a check exists.
    # READ THE TICKS FIRST, AND SKIP THE PLAN WHEN THERE ARE NONE (SPRINT-080 T0).
    # An empty command substitution inside a heredoc still yields ONE EMPTY LINE -- a `grep` matching
    # nothing feeds the loop below a single "" rather than nothing at all. That phantom matches
    # neither evidence form, so it fell through to `bad` and reported an evidence-less criterion on a
    # Plan with ZERO ticked boxes -- every sprint between promote and its first tick. It also made the
    # n_named==0 branch below unreachable, since `bad` returns before it: the branch written for
    # exactly this case was dead code. Guarded here rather than inside the loop, because the loop
    # cannot tell a real empty criterion from the phantom (L-058 -- a false positive here is a false
    # negative about the contract).
    ticked=$(grep '^- \[x\]' "$repo/$p" 2>/dev/null)
    [ -n "$ticked" ] || continue
    while IFS= read -r line; do
      case "$line" in
        *'*Verify:'*) n_named=$((n_named + 1)); continue ;;
        *'✓'*)        n_named=$((n_named + 1)); continue ;;
      esac
      crit=$(printf '%s' "$line" | cut -c7-96)
      bad "dod-criterion-names-no-check: $p -- ticked criterion names no evidence: \"$crit\". §9 wants a criterion to name how it was verified; a ticked box with neither a *Verify:* clause nor a stated proof is a claim with nothing behind it"
    done <<EOF
$ticked
EOF
  done
  [ "$last_bad" -eq 1 ] && return
  if [ "$n_named" -eq 0 ]; then
    note "S9.VERIFYCLAUSE     -- no ticked DoD criteria in any active sprint yet -- nothing to verify"
  else
    ok "S9.VERIFYCLAUSE     -- all $n_named ticked criterion(s) name their evidence"
  fi
}

# --- §10's learning-governance family (SPRINT-079 T5) ---------------------------------------------

# _s10_threshold <spec> -- the promotion threshold from §10's own prose ("**count >= 2**"), never a
# number written here. §10 is the section that says a figure inside a criterion is remembered rather
# than measured; hard-coding 2 in the checker for that rule would be the failure demonstrating itself
# (L-097 - L-130).
_s10_threshold() {
  awk '/^## §10/{in10=1} /^## §11/{in10=0} !in10{next}
       match($0, /count *(>=|\xe2\x89\xa5) *[0-9]+/) {
         s = substr($0, RSTART, RLENGTH); gsub(/[^0-9]/, "", s); if (s != "") { print s; exit } }' "$1"
}

# _dec <n> -- a decimal integer from a possibly zero-padded one. `$(( 079 - 075 ))` is a shell error,
# not a subtraction: a leading zero makes it an OCTAL literal and 079 has no octal reading. Sprint
# numbers are zero-padded by this standard's own convention (SPRINT-079), so every arithmetic on one
# has to strip the padding first. Found by the engine exiting mid-report on its own repository.
_dec() { _d=$(printf '%s' "$1" | sed 's/^0*//'); [ -n "$_d" ] || _d=0; printf '%s' "$_d"; }

assert_S10_FOURBUCKETS() {
  repo=$1
  plans=$(_sprint_plans "$repo")
  [ -n "$plans" ] || { note "S10.FOURBUCKETS     -- no sprint Plan under docs/sprint/ -- nothing to verify"; return; }
  git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || {
    note "S10.FOURBUCKETS     -- history unavailable: §10 routes the buckets IN the close commit, so without history there is nothing to read"
    return
  }
  n_closed=0
  for p in $plans; do
    [ "$(_fm "$repo/$p" status)" = "closed" ] || continue
    cc=$(_fm_real "$repo/$p" close_commit)
    [ -n "$cc" ] || { bad "retro-bucket-unrouted: $p is status: closed but records no close_commit, so where its Retro routed cannot be read. A close nobody can locate is a Retro nobody can audit"; continue; }
    git -C "$repo" rev-parse --verify "$cc^{commit}" >/dev/null 2>&1 || continue
    n_closed=$((n_closed + 1))
    touched=$(git -C "$repo" show --name-only --format= "$cc" 2>/dev/null)
    hit=""
    for f in CHANGELOG.md TECH-DEBT.md TODO.md docs/LEARNINGS.md; do
      printf '%s\n' "$touched" | grep -qx "$f" && hit="$hit $f"
    done
    # NONE of the four is the finding, not "fewer than four". A bucket can be legitimately empty --
    # a sprint that incurred no debt files no TD-NNN -- so demanding all four would fail a correct
    # close, the same false-positive class §2's create-lazily rows raise. A close that routed to
    # NOTHING is unambiguous: the Retro was written and left in the sprint file, which is exactly
    # what §10's "don't leave them in the sprint file" forbids.
    if [ -z "$hit" ]; then
      bad "retro-bucket-unrouted: $p -- its close commit $cc touched none of CHANGELOG.md, TECH-DEBT.md, TODO.md or docs/LEARNINGS.md. §10 routes each Retro bucket to a durable home; a Retro that reached none of them stayed in the sprint file, where nothing reads it again"
    else
      note "S10.FOURBUCKETS     -- $p routed to:$hit. Which buckets had content is judged, so the check reads that the close reached a durable home, never that all four were owed"
    fi
  done
  [ "$last_bad" -eq 1 ] && return
  if [ "$n_closed" -eq 0 ]; then
    note "S10.FOURBUCKETS     -- no closed sprint under docs/sprint/ (the glob is non-recursive, so an archived sprint is closed history and not re-checked). States that nothing was checkable, never that the rule passed"
  else
    ok "S10.FOURBUCKETS     -- $n_closed closed sprint(s), each routing its Retro to a durable home"
  fi
}

assert_S10_PROMOTION() {
  repo=$1
  led="docs/LEARNINGS.md"
  [ -f "$repo/$led" ] || { note "S10.PROMOTION       -- no $led -- a repository keeping no learnings ledger has no promotion rule to break"; return; }
  thr=$(_s10_threshold "$spec"); [ -n "$thr" ] || thr=2
  # Position-anchored, per §11's own instruction and L-108: promotion state is counted by the heading's
  # `[status: promoted]` field, NOT by a substring. This corpus is self-describing -- an entry whose
  # prose QUOTES `[status: promoted]` while explaining the collapse reads as promoted to a substring
  # scan, and does here: 42 by substring against 41 anchored.
  n_flag=0
  while IFS= read -r blk; do
    [ -n "$blk" ] || continue
    n_flag=$((n_flag + 1))
    bad "learning-recurred-unpromoted: $led $blk -- §10 promotes a learning at count >= $thr into a durable rule and marks it; a second occurrence left as a ledger line is the rot this rule exists to stop"
  done <<EOF
$(awk -v thr="$thr" '
    /^## L-[0-9]+ / {
      if (id != "" && cnt >= thr && prom == "no") print id
      id=""; cnt=0; prom=""
      if ($0 !~ /\[status: promoted\]/) { match($0, /L-[0-9]+/); id = substr($0, RSTART, RLENGTH) }
      next
    }
    id != "" && /^- count: /    { cnt = $3 + 0 }
    id != "" && /^- promoted: / { prom = $3 }
    END { if (id != "" && cnt >= thr && prom == "no") print id }
  ' "$repo/$led")
EOF
  [ "$n_flag" -gt 0 ] && return
  ok "S10.PROMOTION       -- no learning sits at count >= $thr unpromoted (threshold read from §10, not written here)"
}

assert_S10_TDAGING() {
  repo=$1
  led="TECH-DEBT.md"
  [ -f "$repo/$led" ] || { note "S10.TDAGING         -- no root $led -- no ledger to age"; return; }
  # The sprint counter comes from the active Plan's own frontmatter. Without one there is no "now" to
  # measure against, and guessing it from the highest TD row would make the ledger date itself.
  cur=""
  for p in $(_sprint_plans "$repo"); do cur=$(_fm "$repo/$p" sprint); break; done
  case "$cur" in ''|*[!0-9]*) note "S10.TDAGING         -- no active sprint frontmatter to read a sprint counter from, so \"unaddressed >= 3 sprints\" has no origin. Reported rather than passed"; return ;; esac
  # A row is REVIEWED if its id appears in the ledger's header region -- the block before the first
  # row, which is where the aging sweep records what it held and why. Read that way rather than by
  # demanding a per-row `updated:` field, because the sweep is a per-promote note about many rows and
  # §10 asks for a re-review PROMPT, not a per-row edit. Anchored to the region, not to the sweep's
  # wording, so a re-phrased sweep does not read as an absent one (L-108).
  first=$(grep -n '^- \*\*TD-[0-9]' "$repo/$led" | head -1 | cut -d: -f1)
  [ -n "$first" ] || { note "S10.TDAGING         -- $led holds no TD rows -- nothing to age"; return; }
  hdr=$(head -n $((first - 1)) "$repo/$led")
  n_aged=0; n_flagged=0
  while IFS= read -r row; do
    [ -n "$row" ] || continue
    tid=$(printf '%s' "$row" | grep -oE 'TD-[0-9]+' | head -1)
    case "$row" in *'status: open'*) : ;; *) continue ;; esac
    born=$(printf '%s' "$row" | sed -n 's/.*created: Sprint-\([0-9]*\).*/\1/p')
    seen=$(printf '%s' "$row" | sed -n 's/.*updated: Sprint-\([0-9]*\).*/\1/p')
    [ -n "$seen" ] && born=$seen
    case "$born" in ''|*[!0-9]*) continue ;; esac
    age=$(( $(_dec "$cur") - $(_dec "$born") ))
    [ "$age" -ge 3 ] || continue
    n_aged=$((n_aged + 1))
    if printf '%s\n' "$hdr" | grep -qF "$tid"; then continue; fi
    n_flagged=$((n_flagged + 1))
    bad "td-row-aged-unreviewed: $tid is $age sprints unaddressed and no aging sweep in $led names it. §10 makes >= 3 sprints a re-review prompt; a row nothing re-reviews is a cost nobody is deciding to keep"
  done <<EOF
$(grep '^- \*\*TD-[0-9]' "$repo/$led")
EOF
  [ "$n_flagged" -gt 0 ] && return
  ok "S10.TDAGING         -- $n_aged open row(s) at >= 3 sprints, each named in the ledger's aging sweep"
}

assert_S10_PROMOTEREVIEW() {
  repo=$1
  plans=$(_sprint_plans "$repo")
  [ -n "$plans" ] || { note "S10.PROMOTEREVIEW   -- no active sprint Plan -- nothing to verify"; return; }
  git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || {
    note "S10.PROMOTEREVIEW   -- history unavailable: the checklist is recorded at promote, and without history there is no promote record to read"
    return
  }
  n_ok=0
  for p in $plans; do
    pc=$(_fm_real "$repo/$p" plan_commit)
    [ -n "$pc" ] || { note "S10.PROMOTEREVIEW   -- $p records no plan_commit, so the promote record cannot be located. Not a pass"; continue; }
    git -C "$repo" rev-parse --verify "$pc^{commit}" >/dev/null 2>&1 || continue
    log="docs/sprint/logs/${p##*/}"
    # MECHANICAL HALF ONLY (§10 marks this `split`): the checklist's PRESENCE is readable; that it was
    # honestly run is not. Two records are accepted because §10 fixes the checklist's content and not
    # its location -- the plan-lock commit message, and the Execution Log's promote entry. Demanding
    # one specific home would fail repositories that record it in the other, which is a finding about
    # our convention rather than about the standard.
    body=$(git -C "$repo" log -1 --format='%B' "$pc" 2>/dev/null)
    [ -f "$repo/$log" ] && body="$body
$(cat "$repo/$log")"
    miss=""
    printf '%s\n' "$body" | grep -qiE 'L-promotion' || miss="$miss L-promotion"
    printf '%s\n' "$body" | grep -qiE 'TD[ -]aging|tech[ -]debt aging' || miss="$miss TD-aging"
    printf '%s\n' "$body" | grep -qiE 'doc[ -]aging' || miss="$miss doc-aging"
    if [ -z "$miss" ]; then
      n_ok=$((n_ok + 1))
    else
      bad "promote-checklist-absent: $p -- the promote record at $pc names no:$miss. §10 requires the governance scan emitted as an explicit checklist rather than silent prose, because that is what stops the review being skipped unnoticed"
    fi
  done
  [ "$last_bad" -eq 1 ] && return
  [ "$n_ok" -gt 0 ] && ok "S10.PROMOTEREVIEW   -- $n_ok promote record(s) carry all three governance checklist lines"
}

# ==================================================================================================
# §11 -- LEDGER RETENTION (SPRINT-080 T1). Four rules that read a repository's OWN ledgers, which is
# why every one was run against this repository before its fixture was written (D2): a fixture is
# built to the shape its author already has in mind, and real input is not.
#
# Every threshold is READ FROM THE SPEC, never written here -- the retention delay from §11's own
# S11.TDDELETE row, the TODO cap from §2's row, the collapse-exception markers from §11's exception
# clause. A figure a checker hard-codes is a second SSOT that drifts from the row it copied the
# moment the standard moves (L-097 - L-130).
#
# None of the four iterates with `while read` over a command substitution in a heredoc: an empty
# substitution there yields one EMPTY LINE, not nothing, which is the phantom T0 fixed in
# S9.VERIFYCLAUSE this same sprint. They split on IFS instead, where an empty string yields no
# iterations at all.
# ==================================================================================================

# _s11_sprint_max <repo> -- the highest sprint number the repo has EVER issued (active + archive).
# "N sprints ago" needs a scale and the archive holds most of it; counting only active sprints would
# make every closed sprint invisible and every resolved row look brand new.
_s11_sprint_max() {
  { ls "$1/docs/sprint" 2>/dev/null; ls "$1/docs/sprint/archive" 2>/dev/null; } |
    sed -n 's/^SPRINT-\([0-9][0-9]*\)-.*\.md$/\1/p' | sed 's/^0*//' | sort -n | tail -1
}

# _s11_note <spec> <rule-id> -- the Note cell of §11's Conformance row for one rule.
_s11_note() {
  awk -v want="$2" '
    /^## §11/ { in11 = 1; next }
    /^## §/   { in11 = 0 }
    !in11 { next }
    /^\|/ {
      n = split($0, c, "|"); if (n < 6) next
      t = c[2]; gsub(/[` ]/, "", t)
      if (t != want) next
      print c[5]; exit
    }' "$1"
}

# _s11_collapse_markers <spec> -- the backticked phrases in §11's deliberate-non-collapse clause.
# Derived, not restated: rewording the clause in the spec moves this check with it and needs no code
# edit, which is the property the DoD asks to see demonstrated. Scoped to the sentence after its own
# lead-in, because the LEARNINGS row carries other backticked spans that are not markers (L-108).
_s11_collapse_markers() {
  awk '
    /^## §11/ { in11 = 1 }
    /^## §12/ { in11 = 0 }
    !in11 { next }
    /^\| `docs\/LEARNINGS\.md`/ {
      i = index($0, "Deliberate non-collapse is recorded")
      if (i == 0) next
      s = substr($0, i)
      while (match(s, /`[^`]+`/)) {
        print substr(s, RSTART + 1, RLENGTH - 2)
        s = substr(s, RSTART + RLENGTH)
      }
      exit
    }' "$1"
}

assert_S11_TDDELETE() {
  repo=$1
  led="$repo/TECH-DEBT.md"
  [ -f "$led" ] || { note "S11.TDDELETE        -- no TECH-DEBT.md -- the ledger this rule retires rows from does not exist here"; return; }
  thr=$(_s11_note "$spec" "S11.TDDELETE" | sed -n 's/.*[>=≥] *\([0-9][0-9]*\) *sprints.*/\1/p')
  [ -n "$thr" ] || { bad "spec-table-unreadable: §11's S11.TDDELETE row states no '>= N sprints' delay, so no row's age can be judged against it"; return; }
  cur=$(_s11_sprint_max "$repo")
  [ -n "$cur" ] || { note "S11.TDDELETE        -- no SPRINT-NNN files, so 'N sprints ago' has no scale in this repository -- not judged"; return; }
  # Anchored at the row's own opening, never a substring: this ledger's legend and several row bodies
  # discuss resolved rows in prose, and a grep for `status: resolved` alone counts the LEGEND LINE as
  # a row -- the exact miss L-108 records against a TECH-DEBT census, in this same file.
  rows=$(grep '^- \*\*TD-' "$led" 2>/dev/null)
  n_over=0
  _oifs=$IFS; IFS='
'
  for ln in $rows; do
    IFS=$_oifs
    tid=$(printf '%s' "$ln" | sed -n 's/^- \*\*\(TD-[0-9][0-9]*\)\*\*.*/\1/p')
    [ -n "$tid" ] || { IFS='
'; continue; }
    case "$ln" in *'status: resolved'*) ;; *) IFS='
'; continue ;; esac
    cl=$(printf '%s' "$ln" | sed -n 's/.*closed: *[Ss]print-0*\([0-9][0-9]*\).*/\1/p')
    [ -n "$cl" ] || cl=$(printf '%s' "$ln" | sed -n 's/.*resolved[^(]*([Ss]print-0*\([0-9][0-9]*\).*/\1/p')
    if [ -n "$cl" ]; then
      age=$((cur - cl))
      if [ "$age" -ge "$thr" ]; then
        bad "resolved-td-row-past-retention: $tid resolved at SPRINT-$cl, $age sprints before the current SPRINT-$cur -- §11 deletes the row once it is $thr sprints old. The substance already lives in CHANGELOG.md, the sprint archive and git; ids stay monotonic, so deleting never frees $tid for reuse"
        n_over=$((n_over + 1))
      fi
    fi
    IFS='
'
  done
  IFS=$_oifs
  [ "$n_over" -eq 0 ] && ok "S11.TDDELETE        -- no resolved TECH-DEBT row has reached §11's $thr-sprint deletion trigger (current SPRINT-$cur)"
}

assert_S11_TODOCAP() {
  repo=$1
  f="$repo/TODO.md"
  [ -f "$f" ] || { note "S11.TODOCAP         -- no TODO.md -- §2 makes it substrate-conditional, so its absence is not a breach"; return; }
  # Column 4: TODO.md sits in §2's ROOT table, which has no Tier column, so its Cap is one cell left
  # of a docs-tree row's. Read as a LEADING integer, because this cell reads "320 soft (ADR-019)" and
  # taking every digit in it yields 320019 -- L-130's shape, inside a parser.
  cap=$(_s2_cap_for "$spec" "TODO.md" 4)
  [ -n "$cap" ] || { bad "spec-table-unreadable: §2 states no numeric cap for TODO.md, so 'over its cap' has nothing to compare against"; return; }
  n=$(awk 'END{print NR}' "$f")
  if [ "$n" -gt "$cap" ]; then
    bad "todo-over-cap-at-promote: TODO.md is $n lines against §2's cap of $cap -- §11 flags this in the promote governance review and prunes it with the user, never silently"
  else
    ok "S11.TODOCAP         -- TODO.md is $n lines, within §2's cap of $cap"
  fi
}

assert_S11_LEARNINGS() {
  repo=$1
  f="$repo/docs/LEARNINGS.md"
  [ -f "$f" ] || { note "S11.LEARNINGS       -- no docs/LEARNINGS.md -- nothing to collapse"; return; }
  mk=$(_s11_collapse_markers "$spec")
  [ -n "$mk" ] || { bad "spec-table-unreadable: §11 states no deliberate-non-collapse markers, so an entry held back on purpose cannot be told from one overdue -- and reporting both alike is a finding no adopter can clear"; return; }
  # ONE awk pass over the corpus. A per-entry shell loop with two greps apiece is the exact shape that
  # took a sibling family from ~1s to 29s: the dominant term is processes started, not work done (L-144).
  out=$(awk -v markers="$mk" '
    function emit(   i, clean) {
      if (id == "" || !promoted || collapsed) return
      clean = 1
      for (i = 1; i <= nm; i++) if (index(body, M[i]) == 0) clean = 0
      if (!clean) print id
    }
    BEGIN { nm = split(markers, M, "\n") }
    /^## L-[0-9]+ / {
      emit()
      id = $2
      # POSITION-ANCHORED, not a substring scan of the line. A heading here runs to several hundred
      # words and routinely QUOTES the markers -- L-114 is [status: active] whose narrative contains
      # the literal string [status: promoted], and an unanchored test read it as a promoted entry and
      # reported it. That is L-108 exactly: a self-describing corpus, where a grep eventually matches
      # prose about the search. The metadata is the segment before the first "]:", so split there and
      # judge status on that half only.
      _mi   = index($0, "]:")
      _meta = (_mi > 0 ? substr($0, 1, _mi + 1) : $0)
      _rest = (_mi > 0 ? substr($0, _mi + 2)    : "")
      promoted  = (_meta ~ /\[status: promoted\]/)
      # TWO stored forms satisfy the §11 action "collapse it to a pointer line -- `L-NNN → promoted:
      # <where>`", and checking only the first reported 39 CONFORMANT entries on this repository --
      # the artefact triage this task owes, by the SPRINT-076 T3 method. Form (a): the HEADING is
      # itself the pointer. Form (b): the heading keeps a one-line gist and the pointer is the first
      # body bullet, which is the literal §11 shape, id and all. Form (b) is anchored to the id of the
      # entry being scanned, which is what keeps it a structural test -- a neighbouring pointer quoted
      # in prose cannot satisfy it (L-108). L-144 has neither form: it still carries the PRE-collapse
      # field `promoted: yes → …`, which is why it is the one entry the exception clause speaks for.
      collapsed = (_rest ~ /^[ \t]*→[ \t]*promoted:/)
      ptr = id " → promoted:"
      body = ""
      next
    }
    { body = body "\n" $0; if (ptr != "" && index($0, ptr) > 0) collapsed = 1 }
    END { emit() }
  ' "$f")
  if [ -n "$out" ]; then
    for e in $out; do
      bad "promoted-learning-not-collapsed: $e is [status: promoted] but still carries its body and records no deliberate-non-collapse exception -- §11 collapses a promoted entry to 'L-NNN → promoted: <where>', because the durable rule is the record now"
    done
  else
    ok "S11.LEARNINGS       -- every [status: promoted] entry is collapsed to its pointer, or records its non-collapse per §11's exception clause"
  fi
}

assert_S11_BACKLOG() {
  repo=$1
  f="$repo/TODO.md"
  [ -f "$f" ] || { note "S11.BACKLOG         -- no TODO.md -- there is no Backlog to retain anything in"; return; }
  # SPLIT rule: whether an entry counts as "shipped/promoted" is judged, and this half does not judge
  # it. The MECHANICAL half is §11's own words -- "no shipped-in-SPRINT breadcrumb comments left in
  # TODO.md" -- so what is detected is the BREADCRUMB: a line ANNOUNCING the shipping, not a task that
  # merely cites a sprint. Anchored to a list item or an HTML comment and scoped to § Backlog, because
  # § Active Sprint names a sprint on every healthy repo and task bodies quote sprint ids constantly.
  # An unanchored corpus grep would report this file's prose about itself (L-108).
  out=$(awk '
    /^## / { inb = ($0 ~ /Backlog/); next }
    !inb { next }
    /^[ \t]*(-|<!--)/ {
      low = tolower($0)
      if (low ~ /shipped|delivered/ && low ~ /sprint-[0-9]/) printf "%d\n", NR
    }
  ' "$f")
  if [ -n "$out" ]; then
    for l in $out; do
      bad "shipped-backlog-entry-retained: TODO.md:$l is a shipped-in-SPRINT breadcrumb left in § Backlog -- §11 removes a shipped entry outright (propose→approve); its durable homes are root CHANGELOG.md and docs/sprint/archive/, so a pointer left here is a breadcrumb rather than a record"
    done
  else
    ok "S11.BACKLOG         -- § Backlog carries no shipped-in-SPRINT breadcrumb (the mechanical half; whether an entry is shipped stays judged)"
  fi
}

# ==================================================================================================
# §11 -- ARCHIVAL (SPRINT-080 T2). Four rules, five findings. Two are defined over HISTORY, not the
# tree: whether a log moved WITH its Plan, and whether a close-time trigger fired at close.
# ==================================================================================================

# _s11_archived_plans <repo> -- one repo-relative path per archived Plan.
_s11_archived_plans() {
  [ -d "$1/docs/sprint/archive" ] || return 0
  for _ap in "$1"/docs/sprint/archive/SPRINT-*.md; do
    [ -f "$_ap" ] || continue
    printf '%s\n' "docs/sprint/archive/${_ap##*/}"
  done
}

# _s11_archived_at <repo> <archive-path> -- the commit in which <archive-path> FIRST APPEARED, i.e.
# the commit that performed the archive.
#
# NOT `log -1 --follow`, which was the first draft and was wrong: that returns the NEWEST commit to
# touch the path, so an archived Plan resolved to a later release commit and its log to a later
# labelling commit -- neither of them the archive. It reported 24 sprints as split pairs, none of
# which were. Oldest-first `--diff-filter=A` names the appearance instead, which is the event §11
# actually constrains.
_s11_archived_at() {
  git -C "$1" log --diff-filter=A --format='%H' -- "$2" 2>/dev/null | tail -1
}

# _s11_log_predated_archive <repo> <commit> <basename> -- was the live log present in the archive
# commit's PARENT? Only then does "archive the pair together" bind.
#
# §11's logs/ sibling arrived with ADR-014 at SPRINT-047, so every sprint archived before it had no
# separate log to move, and its archived log was written later by that one-time migration. Comparing
# commits without this guard reports a decade of correct closes as split pairs -- a finding no
# adopter could act on, about a file that did not exist when the rule they are being judged against
# would have applied.
_s11_log_predated_archive() {
  git -C "$1" cat-file -e "$2^:docs/sprint/logs/$3" 2>/dev/null
}

assert_S11_SPRINT() {
  repo=$1
  # FINDING ONE: a closed sprint still sitting in the live directory.
  n_live=0
  for p in $(_sprint_plans "$repo"); do
    st=$(_fm "$repo/$p" status)
    case "$st" in
      closed) bad "closed-sprint-not-archived: $p is status: closed but still in docs/sprint/ -- §11 moves a closed sprint to docs/sprint/archive/ at close. Left here it keeps answering the globs that look for ACTIVE work, so every check reading 'the current sprint' reads a finished one" ;;
      *) n_live=$((n_live + 1)) ;;
    esac
  done
  # FINDING TWO: an archived sprint with no INDEX row. Separable from the first ON PURPOSE (L-058):
  # an unarchived sprint and a missing index row are different repairs -- one moves a file, the other
  # writes a line -- and one report line covering both tells the reader neither.
  idx="$repo/docs/sprint/INDEX.md"
  arch=$(_s11_archived_plans "$repo")
  if [ -n "$arch" ]; then
    if [ ! -f "$idx" ]; then
      bad "sprint-index-row-missing: docs/sprint/INDEX.md does not exist while docs/sprint/archive/ holds archived sprint(s) -- §11 creates it lazily at the first archive, and without it the archive is a directory nobody has an index into"
    else
      n_row=0; n_miss=0
      _oifs=$IFS; IFS='
'
      for a in $arch; do
        IFS=$_oifs
        base=${a##*/}
        # SPRINT-NNN. `${base%%-*}` stops at the FIRST hyphen and yields the bare word "SPRINT",
        # which matched no INDEX row and reported all 79 archived sprints as missing one. Caught by
        # running the rule against this repository before writing its fixture (D2) -- the finding
        # count was the tell, not the logic: a rule firing on every row is reporting itself.
        _srest=${base#SPRINT-}; sid="SPRINT-${_srest%%-*}"
        if grep -q "^- $sid " "$idx" 2>/dev/null; then
          n_row=$((n_row + 1))
        else
          bad "sprint-index-row-missing: $sid is archived but docs/sprint/INDEX.md carries no '- $sid ' row -- §11 pairs the move with one index line, and the row is the durable pointer the file is only the detail"
          n_miss=$((n_miss + 1))
        fi
        IFS='
'
      done
      IFS=$_oifs
      [ "$n_miss" -eq 0 ] && ok "S11.SPRINT          -- $n_row archived sprint(s), each with its INDEX row; $n_live live Plan(s), none closed"
    fi
  else
    [ "$last_bad" -eq 1 ] || note "S11.SPRINT          -- nothing archived yet -- §11 creates the archive at the first close, so its absence is not a breach"
  fi
}

assert_S11_LOGPAIR() {
  repo=$1
  arch=$(_s11_archived_plans "$repo")
  [ -n "$arch" ] || { note "S11.LOGPAIR         -- nothing archived yet -- there is no pair to split"; return; }
  has_git=0
  git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 && has_git=1
  n_pair=0; n_nolog=0; n_unjudged=0
  _oifs=$IFS; IFS='
'
  for a in $arch; do
    IFS=$_oifs
    base=${a##*/}
    stray="docs/sprint/logs/$base"
    archlog="docs/sprint/archive/logs/$base"
    if [ -f "$repo/$stray" ]; then
      # The Plan moved and its log did not. Readable from the TREE alone, so it is reported whether or
      # not history is available -- and it is the common shape, because the two files sit in different
      # directories and only one of them is what the closer is looking at.
      bad "sprint-log-archived-apart-from-plan: ${base%.md} -- the Plan is archived but its log is still at $stray. §11 archives the pair together because it is ONE record: the Retro was written from that log, and stranding it across the archive boundary leaves the evidence behind the conclusion"
      IFS='
'; continue
    fi
    if [ ! -f "$repo/$archlog" ]; then
      # No log anywhere. §11 creates the log LAZILY at the first Execution Log entry (ADR-014), so a
      # sprint that never logged has none to archive -- absence here is not a split pair, and treating
      # it as one would fail every sprint that closed without an entry.
      n_nolog=$((n_nolog + 1)); IFS='
'; continue
    fi
    if [ "$has_git" -eq 1 ]; then
      # Both archived. The remaining question is whether they moved TOGETHER -- §11 says "same
      # commit", and two archives a week apart satisfy every tree-shaped test while still having
      # stranded the evidence in between.
      cp_plan=$(_s11_archived_at "$repo" "$a")
      if [ -n "$cp_plan" ] && _s11_log_predated_archive "$repo" "$cp_plan" "$base"; then
        # The live log existed when the Plan moved, so the pair was there to be moved together and
        # §11 binds. Without this guard the check judges sprints that had no separate log to move.
        cp_log=$(_s11_archived_at "$repo" "$archlog")
        if [ -n "$cp_log" ] && [ "$cp_plan" != "$cp_log" ]; then
          bad "sprint-log-archived-apart-from-plan: ${base%.md} -- the live log existed when the Plan was archived at ${cp_plan%${cp_plan#???????}}, but the log only reached the archive at ${cp_log%${cp_log#???????}}. §11 requires the same commit: the pair is one record, and between those two commits a reader finds a Retro whose evidence is not beside it"
          IFS='
'; continue
        fi
      else
        # No live log at archive time -- nothing to split. Counted separately so the report never
        # implies these were verified.
        n_unjudged=$((n_unjudged + 1))
        IFS='
'; continue
      fi
    fi
    n_pair=$((n_pair + 1))
    IFS='
'
  done
  IFS=$_oifs
  [ "$last_bad" -eq 1 ] && return
  if [ "$has_git" -eq 1 ]; then
    ok "S11.LOGPAIR         -- $n_pair pair(s) archived together in one commit; $n_nolog never opened a log (§11 creates it lazily); $n_unjudged predate the logs/ sibling, so there was no pair to split and they are not counted as passing"
  else
    ok "S11.LOGPAIR         -- $n_pair pair(s) archived side by side; $n_nolog never opened a log. History unavailable, so the same-commit half was not read"
  fi
}

assert_S11_CHANGELOG() {
  repo=$1
  cl="$repo/CHANGELOG.md"
  [ -f "$cl" ] || { note "S11.CHANGELOG       -- no root CHANGELOG.md -- nothing to rotate"; return; }
  # DISTINCT MINOR SERIES held inline, newest first. Counting BLOCKS would fail a repo that shipped
  # three patches in one minor, which §11 explicitly permits -- the unit it names is the MINOR.
  minors=$(grep -oE '^## \[?v?[0-9]+\.[0-9]+\.[0-9]+' "$cl" 2>/dev/null | sed -e 's/^## \[\?v\?//' | awk -F. '{print $1 "." $2}' | awk '!seen[$0]++')
  n_minor=0
  [ -n "$minors" ] && n_minor=$(printf '%s\n' "$minors" | wc -l | tr -d ' ')
  rotdir="$repo/docs/changelog"
  n_rot=0
  if [ -d "$rotdir" ]; then
    for _r in "$rotdir"/*.md; do [ -f "$_r" ] && n_rot=$((n_rot + 1)); done
  fi
  n_bad=0
  # INVARIANT ONE -- current + previous inline, nothing older.
  if [ "$n_minor" -gt 2 ]; then
    bad "changelog-not-rotated-at-minor: CHANGELOG.md holds $n_minor minor series inline ($(printf '%s' "$minors" | tr '\n' ' ')) -- §11 keeps current + previous and moves older blocks verbatim to docs/changelog/CHANGELOG-<version>.md. The root file is the one a reader opens first, and it stops being readable long before it stops being correct"
    n_bad=$((n_bad + 1))
  fi
  # INVARIANT TWO -- the link line. §11 says the older blocks move "+ one link line", and it is the
  # half that makes rotation lossless rather than merely tidy: without it the rotated history is
  # unreachable from the only file anyone opens. Reported under the same finding because the register
  # names ONE for this rule, with the message saying WHICH invariant failed.
  if [ "$n_rot" -gt 0 ] && ! grep -q 'docs/changelog' "$cl" 2>/dev/null; then
    bad "changelog-not-rotated-at-minor: docs/changelog/ holds $n_rot rotated file(s) and CHANGELOG.md carries no link line to them -- §11 pairs the move with one pointer. Rotation without it does not compress the record, it hides it: the root file is the only entry point, and from it the older history cannot be reached at all"
    n_bad=$((n_bad + 1))
  fi
  [ "$n_bad" -eq 0 ] && ok "S11.CHANGELOG       -- $n_minor minor series inline (current + previous) and $n_rot rotated file(s) reachable by a link line"
}

assert_S11_WHENITRUNS() {
  repo=$1
  # SPLIT (§11 marks it so): the PHASE a retention action ran in is mechanical from history; whether
  # the RIGHT trigger fired is judged and is never decided here.
  #
  # Scoped to the one close-time trigger with an unambiguous mechanical boundary: the sprint archive.
  # §11 executes it "during close", and a sprint's own close_commit is recorded in its frontmatter, so
  # "archived before it was closed" is a fact about two commits and needs no interpretation. The
  # scan-based triggers are deliberately NOT phase-checked -- promote is a window rather than a
  # commit, and a rotation landing just outside it is a finding no adopter could act on (§14).
  #
  # NOT-RUN IS NOT THIS FINDING. A sprint never archived is `closed-sprint-not-archived` under
  # S11.SPRINT; here it is simply absent from the phase question. The two states need different
  # repairs -- one is "do the thing", the other is "you did it at the wrong moment" -- and a check
  # that reported them alike would emit a finding nobody can act on.
  git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || {
    note "S11.WHENITRUNS      -- history unavailable: a phase is a position in history, so without it there is nothing to read. Not a pass"
    return
  }
  arch=$(_s11_archived_plans "$repo")
  [ -n "$arch" ] || { note "S11.WHENITRUNS      -- no archived sprint, so no close-time retention has run yet -- absence is not a wrong phase"; return; }
  n_ok=0; n_unread=0
  _oifs=$IFS; IFS='
'
  for a in $arch; do
    IFS=$_oifs
    cc=$(_fm_real "$repo/$a" close_commit)
    ac=$(_s11_archived_at "$repo" "$a")
    if [ -z "$cc" ] || [ -z "$ac" ] || ! git -C "$repo" rev-parse --verify "$cc^{commit}" >/dev/null 2>&1; then
      n_unread=$((n_unread + 1)); IFS='
'; continue
    fi
    # The archive must not PRECEDE the close it belongs to. `merge-base --is-ancestor cc ac` is true
    # when the close is an ancestor of the archive, i.e. the archive came at or after it.
    if git -C "$repo" merge-base --is-ancestor "$cc" "$ac" 2>/dev/null; then
      n_ok=$((n_ok + 1))
    else
      bad "retention-trigger-ran-in-wrong-phase: ${a##*/} was archived at ${ac%${ac#???????}}, which does not descend from its own close_commit ${cc%${cc#???????}} -- §11 runs the sprint archive DURING close. Archived earlier, the file left the live directory while the sprint was still open, so everything reading 'the active sprint' stopped seeing it before it finished"
    fi
    IFS='
'
  done
  IFS=$_oifs
  [ "$last_bad" -eq 1 ] && return
  ok "S11.WHENITRUNS      -- $n_ok archived sprint(s) archived at or after their own close_commit; $n_unread could not be phased (no close_commit recorded, or the commit is unreachable) and are reported as unread rather than passed"
}

# ==================================================================================================
# §12 -- THE GIT BOUNDARY (SPRINT-080 T3). Four rules, and the most dangerous four in the epic.
#
# DETECTION SCOPE, RULED AT G2 AND RECORDED HERE WITH WHAT IT REFUSED.
# The register is explicit that a filename heuristic flagging `contract.md` in a repo about contract
# testing "is worse than no scan", which is why §12's six content categories are judgment-only. These
# four are the shape-detectable ones and they inherit that warning rather than escaping it. So a
# finding needs TWO signals that agree: a SHAPE (extension / filename / path) and a CONFIRMATION read
# from the file's content or its git state. One signal alone is the heuristic the register refused.
#
# REFUSED, deliberately:
#   - SIZE THRESHOLDS, for both BACKUPS and DESIGNSRC. §12 says "large" and "small" and states no
#     number anywhere. A figure written into this file would be a second SSOT drifting from a spec
#     that never had it (L-097 - L-130), and "large" is exactly the judgement §14 says not to fake.
#     Replaced by signals the spec DOES state: a dump-tool preamble, and the asset directories §12
#     names by path.
#   - BARE FILENAME MATCHING everywhere. `contract.md`, `.env.example`, `seed.sql`, `public/hero.mp4`
#     and a tracked `.vscode/extensions.json` are all benign shapes an adopter may legitimately hold,
#     and each is a retained control below.
#
# Every lookalike control was BUILT BEFORE its detector, so the detector was designed to clear a
# concrete benign file rather than judged against one afterwards.
# ==================================================================================================

# _s12_tracked <repo> -- tracked paths only. §12 constrains what is COMMITTED, not what happens to sit
# in a working tree, so an ignored build directory is not a finding and a tracked one is.
_s12_tracked() {
  git -C "$1" ls-files 2>/dev/null
}

# _s12_generated_classes <spec> -- the §12c .gitignore classes, read from the spec's own sentence.
# Derived rather than restated: adding a class to §12c moves this check with no code edit (L-146).
#
# The MAY-commit carve-out is named in this SAME sentence and BEFORE the permission, so it is emitted
# here too and subtracted by the caller against _s12_generated_allowed. Positional truncation was the
# first attempt and it silently kept the allowed path, which would have made the spec's one explicit
# permission fire as a finding -- an exclusion is checked by what it lets through, not by where it
# sits in a sentence (L-140).
_s12_generated_classes() {
  awk '
    /^\*\*c\. Generated\/temporary excludes/ { inc = 1 }
    inc {
      buf = buf " " $0
      if ($0 ~ /actually requires/) inc = 0
    }
    END {
      while (match(buf, /`[^`]+`/)) {
        t = substr(buf, RSTART + 1, RLENGTH - 2)
        if (t != "" && t != ".gitignore") print t
        buf = substr(buf, RSTART + RLENGTH)
      }
    }' "$1"
}

# _s12_generated_allowed <spec> -- the token §12c explicitly permits ("... MAY be committed").
_s12_generated_allowed() {
  awk '
    /MAY be committed/ {
      s = substr($0, 1, index($0, "MAY be committed"))
      while (match(s, /`[^`]+`/)) {
        last = substr(s, RSTART + 1, RLENGTH - 2)
        s = substr(s, RSTART + RLENGTH)
      }
      if (last != "") print last
    }' "$1"
}

# _s12_matches_class <path> <class> -- POSIX glob semantics for the three class shapes §12c uses:
# a directory prefix (`dist/`), an extension glob (`*.log`), or a literal path (`.DS_Store`).
_s12_matches_class() {
  case "$2" in
    */)   case "$1" in "$2"*|*/"$2"*) return 0 ;; esac ;;
    \**)  case "$1" in $2|*/$2) return 0 ;; esac ;;
    *)    case "$1" in "$2"|*/"$2") return 0 ;; esac ;;
  esac
  return 1
}

assert_S12_SECRETS() {
  repo=$1
  git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || { note "S12.SECRETS         -- not a git repository: §12 is about what is COMMITTED, and an untracked tree has committed nothing"; return; }
  n_seen=0
  for f in $(_s12_tracked "$repo"); do
    b=${f##*/}
    hit=""
    case "$b" in
      # `.env.example` / `.env.sample` / `.env.template` are the canonical benign shape and the reason
      # this is a case-by-case match rather than a `.env*` glob. A placeholder file is the CORRECT
      # artifact to commit -- flagging it teaches adopters to distrust the report.
      .env|.env.local|.env.production|.env.development|.env.staging) hit=env ;;
      *.pem|*.key) hit=pem ;;
      id_rsa|id_dsa|id_ecdsa|id_ed25519) hit=pem ;;
      service-account.json|serviceaccount.json) hit=sa ;;
    esac
    [ -n "$hit" ] || continue
    [ -f "$repo/$f" ] || continue
    n_seen=$((n_seen + 1))
    case "$hit" in
      env)
        # CONFIRMATION: an assignment carrying a real-looking value. A committed `.env` of empty keys
        # or `<placeholders>` is a template someone named badly, not a leaked secret.
        if awk -F= '
             /^[[:space:]]*#/ { next }
             /^[[:space:]]*[A-Za-z_][A-Za-z0-9_]*[[:space:]]*=/ {
               v = substr($0, index($0, "=") + 1)
               gsub(/^[[:space:]]*["\x27]?|["\x27]?[[:space:]]*$/, "", v)
               if (v == "") next
               lv = tolower(v)
               if (lv ~ /^<.*>$/ || lv ~ /changeme|your[-_]|placeholder|example|xxx+|todo|\.\.\./) next
               found = 1
             }
             END { exit(found ? 0 : 1) }' "$repo/$f"; then
          bad "secret-committed: $f carries at least one assignment with a real value -- §12 puts credentials in a secret manager, never in git. Even a private repo is treated as potentially exposed, and history keeps the value after the file is deleted"
        fi
        ;;
      pem)
        # CONFIRMATION: a PRIVATE key block. A `.pem` holding only a CERTIFICATE is a public artifact
        # that a TLS-verifying client legitimately ships, and the lookalike control pins that.
        if grep -q 'PRIVATE KEY' "$repo/$f" 2>/dev/null; then
          bad "secret-committed: $f contains a PRIVATE KEY block -- §12 puts credentials in a secret manager. A public certificate in the same file shape is fine; a private key is the thing that must never be committed"
        fi
        ;;
      sa)
        if grep -q '"private_key"' "$repo/$f" 2>/dev/null; then
          bad "secret-committed: $f is a service-account file carrying a \"private_key\" field -- §12 puts credentials in a secret manager. This one key is usually enough to reach production infrastructure"
        fi
        ;;
    esac
  done
  [ "$last_bad" -eq 1 ] && return
  ok "S12.SECRETS         -- no tracked file pairs a credential SHAPE with credential CONTENT ($n_seen shape-match(es) examined and cleared on content)"
}

assert_S12_BACKUPS() {
  repo=$1
  git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || { note "S12.BACKUPS         -- not a git repository: nothing is committed"; return; }
  n_seen=0
  for f in $(_s12_tracked "$repo"); do
    case "$f" in *.sql|*.dump|*.bak) ;; *) continue ;; esac
    [ -f "$repo/$f" ] || continue
    n_seen=$((n_seen + 1))
    # CONFIRMATION: a DUMP-TOOL PREAMBLE. §12 says in its own words that "small FAKE seed files are
    # fine in-repo", so the discriminator cannot be the extension and must not be a size -- §12 states
    # no number, and inventing one here would be a threshold the standard never set (L-097). What a
    # real dump has and a hand-written seed does not is the generator's own banner.
    if grep -qiE 'PostgreSQL database dump|MySQL dump|SQLite format|Dumped from database version|pg_dump|mysqldump|Server version.*Database:' "$repo/$f" 2>/dev/null; then
      bad "database-backup-committed: $f carries a database dump preamble -- §12 keeps backups in backup storage. A small FAKE seed file is fine in-repo and is not this: the file names its own generator, so it is an export of a real database"
    fi
  done
  [ "$last_bad" -eq 1 ] && return
  ok "S12.BACKUPS         -- no tracked .sql/.dump carries a dump-tool preamble ($n_seen examined; §12 permits small fake seed files, which these are)"
}

assert_S12_DESIGNSRC() {
  repo=$1
  git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || { note "S12.DESIGNSRC       -- not a git repository: nothing is committed"; return; }
  # The asset directories are §12's own words -- "only assets the app actually uses go in `public/` or
  # `src/assets/`" -- so the permitted PATH is read from the spec rather than listed here.
  allow=$(awk '/only assets the app actually uses go in/ {
                 s = $0
                 while (match(s, /`[^`]+`/)) { print substr(s, RSTART + 1, RLENGTH - 2); s = substr(s, RSTART + RLENGTH) }
               }' "$spec")
  n_seen=0
  for f in $(_s12_tracked "$repo"); do
    case "$f" in
      *.ai|*.psd|*.sketch|*.fig|*.xd|*.mp4|*.mov|*.avi|*.mkv) ;;
      *) continue ;;
    esac
    n_seen=$((n_seen + 1))
    # CONFIRMATION IS THE PATH, not a size. §12 says "large" and gives no number, and a threshold
    # written here would be a figure the standard never set. What §12 DOES state is where a legitimate
    # asset lives, so a design-source extension INSIDE an asset directory is the permitted case and
    # outside it is the source-of-truth the design tool should hold.
    inside=0
    for a in $allow; do
      case "$f" in "$a"*|*/"$a"*) inside=1; break ;; esac
    done
    [ "$inside" -eq 1 ] && continue
    bad "design-source-committed: $f is an editable design source outside the asset directories §12 names ($(printf '%s' "$allow" | tr '\n' ' ')) -- §12 keeps originals in the design tool and lets only the assets the app actually uses into the repo. Size was deliberately NOT used: §12 says \"large\" and states no number"
  done
  [ "$last_bad" -eq 1 ] && return
  if [ -z "$allow" ]; then
    bad "spec-table-unreadable: §12 names no asset directory, so a design source inside one cannot be told from one outside it -- and reporting both alike is a finding no adopter can clear"
  else
    ok "S12.DESIGNSRC       -- no editable design source outside the asset directories §12 names ($n_seen examined)"
  fi
}

assert_S12_GENERATED() {
  repo=$1
  git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || { note "S12.GENERATED       -- not a git repository: §12c is about what is COMMITTED, and an untracked build directory is exactly the compliant state"; return; }
  classes=$(_s12_generated_classes "$spec")
  [ -n "$classes" ] || { bad "spec-table-unreadable: §12c names no .gitignore classes, so nothing reproducible can be recognised"; return; }
  allowed=$(_s12_generated_allowed "$spec")
  # The carve-out is SUBTRACTED, not positionally trimmed. `.vscode/extensions.json` is named in the
  # same sentence as the classes and BEFORE the permission, so trimming at "MAY be committed" keeps
  # it -- which would fire on the one file §12c explicitly allows. An exclusion is judged by what it
  # lets through (L-140), and the retained control below is a tracked extensions.json.
  n_hit=0
  for f in $(_s12_tracked "$repo"); do
    skip=0
    for a in $allowed; do
      case "$f" in "$a"|*/"$a") skip=1; break ;; esac
    done
    [ "$skip" -eq 1 ] && continue
    for c in $classes; do
      if _s12_matches_class "$f" "$c"; then
        bad "generated-artifact-committed: $f is tracked and matches §12c's '$c' class -- §12 keeps anything reproducible by a command out of the repo. Present-but-ignored is the compliant state and is not reported; this file is COMMITTED"
        n_hit=$((n_hit + 1))
        break
      fi
    done
  done
  [ "$n_hit" -eq 0 ] && ok "S12.GENERATED       -- no tracked file matches a §12c reproducible class ($(printf '%s' "$classes" | wc -w | tr -d ' ') classes read from the spec, $(printf '%s' "$allowed" | wc -w | tr -d ' ') explicitly permitted)"
}
# ==================================================================================================
# ==================================================================================================
# DRIVER -- iterated WITHOUT a pipe, matching check-attestation.sh's documented reason: `printf |
# while read` runs the loop in a subshell, where every bad() would set a `fail` the parent never sees
# (a report disagreeing with its artifact -- this repo's own most-repeated failure class).
# ==================================================================================================
n_pass=0; n_judgment=0; n_impl=0; n_unclassified=0; n_reported=0; n_dispatchable=0
n_restated=0; n_stddir=0
struct_fail=0; gated_fail=0; attested_fail=0
struct_hold=0; gated_hold=0; attested_hold=0

saved_ifs=$IFS
IFS='
'
for row in $rules; do
  IFS=$saved_ifs
  # shellcheck disable=SC2086
  set -- $row
  id=$1; level=$2; mark=$3
  # SPAWN-FREE, and that is the whole of TD-073 (SPRINT-080). These two lines used to be
  # `fn="assert_$(printf '%s' "$id" | tr '.-' '__')"` and `pid=$(printf '%-20s' "$id")` -- two command
  # substitutions plus an external `tr` on EVERY rule. Measured on this host: 100 iterations of the
  # first cost 9,176ms and of the second 1,909ms, against a whole-engine run of 10,859ms. The driver's
  # own bookkeeping WAS the runtime; the spec reader is 150ms for all 100 rules and the assertions are
  # noise beside it. L-144 again, one level below where it was found: the dominant term is the number
  # of processes started, not the work done -- and here the processes did no work at all.
  #
  # Rewritten with parameter expansion only. Equivalence was proven over all 100 ids before the swap,
  # both transforms, zero mismatches -- including the 21 ids carrying a hyphen, which is the exact set
  # that produced a silent false negative when the mangling last changed (see the note below).
  #
  # `.` AND `-` both map to `_`. The hyphen half was missing until SPRINT-076 T3, and it was a silent
  # false negative of exactly the shape L-058 names: `S2.F-FILE` resolved to `assert_S2_F-FILE`, no
  # such function was ever defined, and the driver reported `rule-unimplemented` with the assertion
  # sitting right there in this file. Every rule covered before T3 happened to have no hyphen in its
  # id, so nothing surfaced it. **21 of the spec's 100 ids carry a hyphen**, so this was waiting under
  # a fifth of the rule set. Verified collision-free before changing: all 100 ids stay distinct under
  # the two-character mangling, so no two rules can now resolve to one assertion.
  _fnid=$id
  case $_fnid in *.*) _fnid="${_fnid%%.*}_${_fnid#*.}" ;; esac
  while :; do
    case $_fnid in *-*) _fnid="${_fnid%%-*}_${_fnid#*-}" ;; *) break ;; esac
  done
  fn="assert_$_fnid"
  pid=$id
  while [ ${#pid} -lt 20 ]; do pid="$pid "; done
  # The rule under assertion, for _cur_rid's attribution (T6). Set here rather than inside each
  # assertion so a NEW assertion inherits it without its author having to remember.
  _cur_rid=$id
  case "$mark" in
    implementation-directed)
      n_impl=$((n_impl + 1))
      note "$pid -- excluded by mark: implementation-directed (level: $level). Constrains a tool's inference, never a repository; evaluating it would emit a finding no adopter can ever clear (§14)"
      ;;
    judgment-only)
      n_judgment=$((n_judgment + 1))
      note "$pid -- judgment-required (mark: judgment-only, level: $level). Not checkable in principle -- the standard is choosing a human, and this is not debt (§14)"
      ;;
    restated)
      # §14: the constraint IS checked -- under the rule id named beside this one. Reporting it as a
      # gap would tell an adopter we owe them a check we have deliberately declined to write, and
      # counting it would state one constraint twice. This is §8's answer applied one level down.
      n_restated=$((n_restated + 1))
      note "$pid -- excluded by mark: restated (level: $level). The constraint is carried by another rule and checked under that id; asserting it here would state one constraint twice and inflate the denominator (§14)"
      ;;
    standard-directed)
      # §14: governs THIS document (or the plugin shipping it), never an adopter's tree. Same failure
      # implementation-directed prevents, one category out -- these are repository rules, just not an
      # arbitrary repository's.
      n_stddir=$((n_stddir + 1))
      note "$pid -- excluded by mark: standard-directed (level: $level). Governs this standard document or the plugin that ships it, never an adopter's repository; evaluating it would emit a finding no adopter can clear (§14)"
      ;;
    mechanical|split)
      last_bad=0
      last_ok=0
      last_gap=0
      last_hold=0
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
        # ...unless it HELD: a rule that named something preventing the next level without failing.
        # Still not a pass and still not a failure -- but the level line below may not step over it.
        if [ "$last_hold" -eq 1 ]; then
          case "$level" in
            Structural) struct_hold=$((struct_hold + 1)) ;;
            Gated)      gated_hold=$((gated_hold + 1)) ;;
            Attested)   attested_hold=$((attested_hold + 1)) ;;
          esac
        fi
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
# The HOLD rungs (SPRINT-078 T1). A held finding prevents its level without being a failure, so it
# cannot be read off the FAIL lines and it does not move the exit code -- which is exactly why the
# ladder has to consult it explicitly. `attestation-unsigned-claim-only` is the case: skip these three
# branches and the report certifies Attested over an attestation nobody signed. Ordered AFTER the
# failure rungs because a failure is the stronger statement about the same level; ordered by level for
# the same reason the failure rungs are.
elif [ "$struct_hold" -gt 0 ]; then
  note "level: none -- Structural not yet reached. $struct_hold finding(s) at Structural prevent it. None is a failure: each names a level honestly reached and not exceeded, so the exit code stands (§14)"
elif [ "$gated_hold" -gt 0 ]; then
  note "level: Structural -- $gated_hold finding(s) at Gated prevent Gated, the next level. None is a failure: each names a level honestly reached and not exceeded, so the exit code stands (§14)"
elif [ "$attested_hold" -gt 0 ]; then
  note "level: Gated -- $attested_hold finding(s) at Attested prevent Attested, the next level. None is a failure: each names a level honestly reached and not exceeded, so the exit code stands (§14)"
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
note "counts: $n_pass passed, $n_judgment judgment-required, $n_impl excluded (implementation-directed), $n_restated excluded (restated -- checked under another id), $n_stddir excluded (standard-directed), $n_gap unchecked (engine gap)$([ "$n_reported" -gt 0 ] && printf ', %s reported without a verdict' "$n_reported")$([ "$n_unclassified" -gt 0 ] && printf ', %s unclassified' "$n_unclassified")"

exit $fail
