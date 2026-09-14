#!/bin/sh
# run-foreign-repo-fixtures.sh -- SPRINT-075 T3. The engine run against a repository that has never
# seen lean-flow, built here from scratch.
#
# EPIC-004's headline claim is that an adopter gets a named answer. Every other harness in this
# directory measures the engine against fixtures WE shaped, and all 43 `build` dispositions were
# judged against THIS repository by the people who wrote the standard. So the claim had never actually
# been tested against a tree that never agreed to any of it -- which is this file.
#
# --- the one rule this harness must not break -----------------------------------------------------
# NO lean-flow file is copied into the target. Every file below is written with printf, from nothing.
# Copying even a template in would quietly restore the conventions being tested for absence, and the
# run would measure our own shape wearing a stranger's name (L-015 · L-016: when the repo cannot
# dogfood a feature, verify on the CONSUMER path -- do not read "it works here" as either result).
# The spec is the exception and must be the real one: an adopter is measured against the shipped
# standard, not a reduced copy. That is also what makes this the suite's most honest run.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-foreign-repo-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
engine="$repo_root/scripts/lib/conformance-engine.sh"
spec="$repo_root/spec/STANDARD.md"
. "$here/lib/harness-common.sh"

[ -f "$engine" ] || { echo "FAIL harness: engine not found at $engine"; exit 2; }
[ -f "$spec" ]   || { echo "FAIL harness: spec not found at $spec"; exit 2; }

fail=0
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT INT TERM

# --- the stranger ---------------------------------------------------------------------------------
# A small JS library with a README, one source file, one doc, and a package.json. Nothing here follows
# any lean-flow convention: no TODO.md, no docs/sprint/, no ownership headers, no .claude/ directory.
foreign="$work/acme-widget"
mkdir -p "$foreign/src" "$foreign/docs"
printf '# acme-widget\n\nA small library that does one thing.\n\n## Install\n\n    npm i acme-widget\n' > "$foreign/README.md"
printf 'export const widget = () => 42;\n' > "$foreign/src/index.js"
printf '# Architecture\n\nThe widget talks to the store.\n' > "$foreign/docs/architecture.md"
printf '{"name":"acme-widget","version":"1.0.0"}\n' > "$foreign/package.json"

# Guard the rule above mechanically rather than trusting the code just above it to stay true: assert
# the target contains exactly the four files written here and nothing else. A future edit that copies
# a template in fails HERE, loudly, instead of quietly making the run meaningless (L-058).
n_files=$(find "$foreign" -type f | wc -l | tr -d ' ')
if [ "$n_files" -eq 4 ]; then
  echo "PASS fixture(built-from-scratch): the target holds exactly the 4 files this harness wrote; no lean-flow file was copied in"
else
  echo "FAIL fixture(built-from-scratch): target holds $n_files files, expected 4 -- something was copied in"
  find "$foreign" -type f
  fail=1
fi

out=$(sh "$engine" "$foreign" --spec "$spec" 2>&1); rc=$?

# --- DoD 2a: it emits a level, and named findings -------------------------------------------------
if printf '%s\n' "$out" | grep -qE '^ +level: ' &&
   printf '%s\n' "$out" | grep -qE '^FAIL  [a-z-]+: '; then
  echo "PASS fixture(level-and-named-findings): the report states a level and carries at least one named finding"
else
  echo "FAIL fixture(level-and-named-findings): expected a level line and a named finding -- got exit $rc:"
  printf '%s\n' "$out"; fail=1
fi

# --- DoD 2b: NOTHING for judgment-only / implementation-directed rules ----------------------------
# Read as "no VERDICT line", which is the reading §14 and EPIC-004 D1 both require: a conformant
# report names its judgment-required items, so emitting nothing at all about them would breach the
# epic's own definition while satisfying a literal reading of the word. What must never appear is a
# PASS/FAIL/GAP verdict against a rule no adopter could ever clear. Stated here rather than resolved
# silently, because reinterpreting a DoD to fit what was built is the failure L-088 names.
if printf '%s\n' "$out" | grep -qE '^(PASS|FAIL|GAP) +S[0-9]+\.[A-Z0-9]+ +-- +(judgment-required|excluded by mark)'; then
  echo "FAIL fixture(no-verdict-for-unevaluable-rules): a judgment-only / implementation-directed rule appeared as a verdict line:"
  printf '%s\n' "$out" | grep -E '^(PASS|FAIL|GAP) +S[0-9]+\.[A-Z0-9]+ +-- +(judgment-required|excluded by mark)'
  fail=1
else
  n_judg=$(printf '%s\n' "$out" | grep -c 'judgment-required')
  n_excl=$(printf '%s\n' "$out" | grep -c 'excluded by mark')
  echo "PASS fixture(no-verdict-for-unevaluable-rules): $n_judg judgment-required and $n_excl implementation-directed rule(s) reported as notes, none as a verdict"
fi

# --- the separation T3 bought: engine gaps are not the stranger's findings ------------------------
# Before this, the same run returned 58 FAIL lines -- 56 of them our own unimplemented rules -- under
# "level: none, 41 findings prevent Structural", against a repo with two actual defects. The assertion
# is not "few findings"; it is that the two axes are reported apart, which is what makes either
# number mean anything.
n_fail=$(printf '%s\n' "$out" | grep -c '^FAIL  ')
n_gap=$(printf '%s\n' "$out" | grep -c '^GAP   ')
# The level counts FAILING RULES, not finding LINES, and until T3 the two were the same number --
# every covered rule emitted at most one finding. `core-file-missing` emits one line per missing file
# (8 from a single rule), so asserting equality here started failing a correct report. Another
# criterion going stale under new coverage rather than a regression (L-088), and the fix keeps what
# the case was actually guarding: gaps must not enter the level.
lvl=$(printf '%s\n' "$out" | sed -n 's/^ *level: none -- Structural not yet reached\. \([0-9]*\) finding.*/\1/p')
if [ "$n_gap" -gt 0 ] && [ "$n_fail" -gt 0 ] && [ -n "$lvl" ] &&
   [ "$lvl" -ge 1 ] && [ "$lvl" -le "$n_fail" ] &&
   printf '%s\n' "$out" | grep -q 'coverage:'; then
  echo "PASS fixture(gaps-not-counted-against-the-stranger): $lvl failing rule(s) across $n_fail finding line(s) drive the level; $n_gap engine gap(s) are held off it and reported on their own coverage axis"
else
  echo "FAIL fixture(gaps-not-counted-against-the-stranger): expected a level counting failing rules (1..$n_fail) with $n_gap gaps held separate -- got:"
  printf '%s
' "$out"; fail=1
fi

# --- convention-aware FAIL-line sweep (TD-089 / L-186) ---------------------------------------------
# The engine emits findings under TWO shapes: kebab-leading ("FAIL  slug: path ...", e.g.
# core-file-missing) and rule-id-leading ("FAIL  RULEID          -- slug: path ...", e.g. S6.BASE /
# S2.R-README -- the rule id is padded to a fixed width by conformance-engine.sh's bad()/printf
# '%-20s'). A sweep keyed to only one shape silently drops the other's findings from whatever
# assertion runs over it -- that is exactly TD-089: 3 of 9 FAIL lines on the pre-remediation stranger
# were invisible to both cases below because they arrive under the second shape.
#
# A THIRD shape is not a finding at all: conformance-engine.sh's bad() also fires for its own
# bootstrap failures -- usage, repo-not-found, reader-missing, spec-table-unreadable -- and those hit
# the same `case ... S[0-9]*|conformance:*)` arm as a real rule id, printing "FAIL  conformance: ...".
# spec-table-unreadable and reader-missing are reachable for real (a spec that stops parsing, a moved
# read-spec-rules.sh), and convention 1's own pattern (`[a-z][a-z-]*: `) parses "conformance" as a
# slug and the next word as a "path" -- e.g. "conformance: spec-table-unreadable -- ..." reads as
# slug=conformance path=spec-table-unreadable, a fabricated finding about a path that was never in the
# target. That is the same mis-attribution TD-089 exists to remove, just from the other direction: an
# engine that never ran being reported as a finding about the STRANGER. So these lines are excluded
# from the finding population entirely, before either convention pattern ever sees them.
#
# One bootstrap site bypasses bad() outright: conformance-engine.sh:54 (`archive-path.sh` missing)
# `echo`s "FAIL conformance: ..." with a SINGLE space, not bad()'s two -- a known, filed, repo-wide
# one-space-emission issue (27 sites / 15 files) that is out of this file's Layers to fix; this file
# only has to stop the sweep from being blind to it. The engine-error DETECTOR below therefore matches
# one-OR-two spaces for this class ONLY; the two finding conventions stay anchored at exactly two
# spaces, matching bad()'s own `printf 'FAIL  %s\n'` -- widening THEM to tolerate one space would let a
# one-space PROSE line masquerade as a real finding, which is a different failure than this one.
#
# sweep_findings <report> sets, in the CALLING shell (never invoke it inside a `$(...)` -- that would
# run it in a subshell and lose every assignment below, the same trap CLAUDE.md names for `while read`):
#   _sweep_matched      -- "<slug>: <path>" for every FAIL FINDING line either shape parses
#   _sweep_total        -- total FAIL FINDING lines (== ^FAIL   lines MINUS `conformance: ` bootstrap
#                          lines) -- so total == reached keeps meaning "every finding was parsed",
#                          never conflating an engine that didn't run with one that did
#   _sweep_reached      -- finding lines the two convention patterns together accounted for
#   _sweep_unreached    -- the FAIL FINDING line(s), if any, NEITHER convention could parse
#   _sweep_engine_error -- the `FAIL conformance: ...` bootstrap line(s) (one OR two spaces), if any --
#                          never counted in total/reached/unreached, and never silently dropped either:
#                          sweep_gate below reports these BY NAME (engine-level-failure) before it ever
#                          looks at total/reached
# A mismatch between total and reached is the caller's job to report as its own named finding
# (sweep-population-unreconciled) -- a line shape neither arm parses must surface, never vanish.
sweep_findings() {
  report=$1
  _sweep_engine_error=$(printf '%s\n' "$report" | grep '^FAIL [ ]*conformance: ')
  _fail_findings=$(printf '%s\n' "$report" | grep '^FAIL  ' | grep -v '^FAIL  conformance: ')
  _c1=$(printf '%s\n' "$_fail_findings" | sed -n 's/^FAIL  \([a-z][a-z-]*\): \([^ ]*\) .*/\1: \2/p')
  _c2=$(printf '%s\n' "$_fail_findings" | sed -n 's/^FAIL  S[0-9][A-Za-z0-9._-]* *-- \([a-z][a-z-]*\): \([^ ]*\) .*/\1: \2/p')
  _sweep_matched=$(printf '%s\n%s\n' "$_c1" "$_c2" | sed '/^$/d')
  _sweep_total=$(printf '%s\n' "$_fail_findings" | grep -c .)
  _n1=$(printf '%s\n' "$_c1" | sed '/^$/d' | grep -c .)
  _n2=$(printf '%s\n' "$_c2" | sed '/^$/d' | grep -c .)
  _sweep_reached=$((_n1 + _n2))
  _sweep_unreached=$(printf '%s\n' "$_fail_findings" \
    | grep -v '^FAIL  [a-z][a-z-]*: [^ ]* ' \
    | grep -v '^FAIL  S[0-9][A-Za-z0-9._-]* *-- [a-z][a-z-]*: [^ ]* ')
}

# sweep_gate <label> -- call AFTER sweep_findings; must run as a plain statement in production (never
# inside `$(...)`, same reason as above), so its `fail=1` reaches the harness for real. Returns 1 (and
# prints the named FAIL) on an engine-level bootstrap failure OR an unreconciled population; returns 0
# silently on a clean sweep so the caller can run its own path-specific assertion. Shared by both
# production sweep sites below AND by this file's own retained fixtures, so a fixture exercises the
# SAME branch the production path runs rather than a re-implementation of it (L-165).
sweep_gate() {
  label=$1
  if [ -n "$_sweep_engine_error" ]; then
    echo "FAIL fixture($label): engine-level-failure -- the engine did not run cleanly; this is not a finding about the target and must never be swallowed into a PASS or a path complaint:"
    printf '%s\n' "$_sweep_engine_error" | sed 's/^/    /'
    fail=1
    return 1
  fi
  if [ "$_sweep_total" -ne "$_sweep_reached" ]; then
    echo "FAIL fixture($label): sweep-population-unreconciled -- swept $_sweep_reached of $_sweep_total FAIL finding(s); $((_sweep_total - _sweep_reached)) line shape(s) neither convention parses:"
    printf '%s\n' "$_sweep_unreached" | sed 's/^/    /'
    fail=1
    return 1
  fi
  return 0
}

# --- retained: the sweep mechanism's own fixtures (Tier G, ADR-029) ---------------------------------
# Built from CANNED engine output, never a real run: proves each shape reaches on its own (varying the
# SELECTION, not the verdict -- L-186), and that a THIRD shape reaching neither arm is caught as a
# named finding rather than silently dropped, with a reachable sibling alongside it in the same report
# so the case demonstrates discrimination, not a checker that reddens on anything.
canned_conv1="FAIL  core-file-missing: SECURITY.md -- §2 marks this file's create trigger \"always\" (S2.F-FILE)"
sweep_findings "$canned_conv1"
if [ "$_sweep_total" -eq 1 ] && [ "$_sweep_reached" -eq 1 ] && [ "$_sweep_matched" = "core-file-missing: SECURITY.md" ]; then
  echo "PASS fixture(sweep-reaches-convention-1): kebab-leading FAIL line swept to 'core-file-missing: SECURITY.md' (1/1)"
else
  echo "FAIL fixture(sweep-reaches-convention-1): expected 1/1 reaching 'core-file-missing: SECURITY.md' -- got $_sweep_reached/$_sweep_total: $_sweep_matched"
  fail=1
fi

canned_conv2="FAIL  S6.BASE             -- tier-doc-set-incomplete: docs/product/requirements.md -- §6 places this file in Base's unconditional doc set"
sweep_findings "$canned_conv2"
if [ "$_sweep_total" -eq 1 ] && [ "$_sweep_reached" -eq 1 ] && [ "$_sweep_matched" = "tier-doc-set-incomplete: docs/product/requirements.md" ]; then
  echo "PASS fixture(sweep-reaches-convention-2): rule-id-leading FAIL line swept to 'tier-doc-set-incomplete: docs/product/requirements.md' (1/1) -- TD-089's blind spot, now reachable"
else
  echo "FAIL fixture(sweep-reaches-convention-2): expected 1/1 reaching 'tier-doc-set-incomplete: docs/product/requirements.md' -- got $_sweep_reached/$_sweep_total: $_sweep_matched"
  fail=1
fi

# Must-FAIL (of the SWEEP, asserted as a harness PASS when it correctly fires -- same convention this
# file already uses for "no-verdict-for-unevaluable-rules" above): a shape neither arm parses, sitting
# beside a reachable sibling line in the SAME report, so the population check has something to
# discriminate against rather than reddening on an all-bad input.
canned_gap="FAIL  core-file-missing: SECURITY.md -- reachable sibling
FAIL  UNRECOGNISED-SHAPE with no colon at all and no rule-id lead-in"
sweep_findings "$canned_gap"
if [ "$_sweep_total" -eq 2 ] && [ "$_sweep_reached" -eq 1 ] && [ -n "$_sweep_unreached" ]; then
  echo "PASS fixture(sweep-population-unreconciled): reconciliation caught the gap -- swept 1/2, unreached: $_sweep_unreached"
else
  echo "FAIL fixture(sweep-population-unreconciled): expected the sweep to reach exactly 1 of 2 with a named unreached line -- got $_sweep_reached/$_sweep_total, unreached='$_sweep_unreached'"
  fail=1
fi

# A FOURTH shape: an engine-level bootstrap failure (conformance-engine.sh's own `bad "conformance:
# ..."` calls -- usage / repo-not-found / reader-missing / spec-table-unreadable). Reproduced live:
# `sh conformance-engine.sh <target> --spec <a spec with no parseable Conformance rows>` prints
# "FAIL  conformance: spec-table-unreadable -- no Conformance rows parsed ...". Convention 1's own
# pattern would happily parse that as slug=conformance path=spec-table-unreadable -- a fabricated
# finding about a path never in the target, attributing an engine failure to the stranger's repo. Run
# through sweep_gate (the SHIPPED gate, not a re-implementation) via `$(...)` here so the probe's own
# `fail=1`/echo stay sandboxed to this fixture's verdict rather than doubling as the harness's.
canned_engine_error="FAIL  conformance: spec-table-unreadable -- no Conformance rows parsed from FAKE-STANDARD.md. An engine that cannot read its rule source checks NOTHING"
sweep_findings "$canned_engine_error"
_probe_out=$(sweep_gate "probe-engine-error"); _probe_rc=$?
case "$_probe_out" in
  *engine-level-failure*)
    if [ "$_probe_rc" -eq 1 ] && [ "$_sweep_total" -eq 0 ] && [ -z "$_sweep_matched" ] && [ -z "$_sweep_unreached" ]; then
      echo "PASS fixture(sweep-excludes-engine-level-failure): a conformance: bootstrap FAIL line is named engine-level-failure by the gate and excluded from the finding population entirely (total 0, matched/unreached empty)"
    else
      echo "FAIL fixture(sweep-excludes-engine-level-failure): gate named engine-level-failure but population bookkeeping leaked it in -- total=$_sweep_total matched='$_sweep_matched' unreached='$_sweep_unreached'"
      fail=1
    fi
    ;;
  *)
    echo "FAIL fixture(sweep-excludes-engine-level-failure): expected sweep_gate to report engine-level-failure for a conformance: bootstrap line -- got: $_probe_out"
    fail=1
    ;;
esac

# Sibling control in the SAME run (L-186): a fully-reconciled, error-free report must pass the gate
# SILENTLY (exit 0, no output) -- the gate discriminates the bootstrap-failure shape, it does not
# redden on every input.
sweep_findings "$canned_conv1"
_probe_out2=$(sweep_gate "probe-clean"); _probe_rc2=$?
if [ "$_probe_rc2" -eq 0 ] && [ -z "$_probe_out2" ]; then
  echo "PASS fixture(sweep-gate-clean-passthrough): a clean, fully-reconciled report passes the gate silently -- sibling control for sweep-excludes-engine-level-failure"
else
  echo "FAIL fixture(sweep-gate-clean-passthrough): expected the gate to pass through silently on a clean report -- rc=$_probe_rc2 out='$_probe_out2'"
  fail=1
fi

# A FIFTH shape, still bucket THREE: conformance-engine.sh:54 (`archive-path.sh` missing) bypasses
# bad() and `echo`s "FAIL conformance: ..." with a SINGLE space. Reproduced live: copying the engine
# away from its archive-path.sh sibling makes it emit exactly this line and exit 2. Before this fixture
# existed, feeding that output through sweep_findings gave total=0 reached=0 engine_error=[]
# unreached=[] -- neither bucket saw it, and sweep_gate returned rc=0 SILENTLY: the exact outcome the
# docstring above forbids, masked in the real suite only by an unrelated fixture also reddening on that
# crash (an accident, not a guard). Same shipped-gate-via-`$(...)` shape as the two-space case above.
canned_engine_error_1sp="FAIL conformance: shared archive predicate not found at /repo/scripts/lib/archive-path.sh"
sweep_findings "$canned_engine_error_1sp"
_probe_out3=$(sweep_gate "probe-engine-error-one-space"); _probe_rc3=$?
case "$_probe_out3" in
  *engine-level-failure*)
    if [ "$_probe_rc3" -eq 1 ] && [ "$_sweep_total" -eq 0 ] && [ -z "$_sweep_matched" ] && [ -z "$_sweep_unreached" ]; then
      echo "PASS fixture(sweep-excludes-engine-level-failure-one-space): a ONE-space 'FAIL conformance: ...' bootstrap line (conformance-engine.sh:54's bad()-bypassing echo) is still named engine-level-failure and excluded from the finding population (total 0, matched/unreached empty)"
    else
      echo "FAIL fixture(sweep-excludes-engine-level-failure-one-space): gate named engine-level-failure but population bookkeeping leaked it in -- total=$_sweep_total matched='$_sweep_matched' unreached='$_sweep_unreached'"
      fail=1
    fi
    ;;
  *)
    echo "FAIL fixture(sweep-excludes-engine-level-failure-one-space): expected sweep_gate to report engine-level-failure for a one-space conformance: bootstrap line -- got: $_probe_out3 (this is TD-089's exact class recurring at one space instead of two: silently dropped into no bucket at all)"
    fail=1
    ;;
esac

# Sibling control in the SAME run: the two-space bootstrap fixture above must still be reached by the
# SAME detector (varying the SELECTION -- one space vs two -- not the verdict, per L-186), proving the
# widened detector did not trade one blind spot for another.
sweep_findings "$canned_engine_error"
_probe_out4=$(sweep_gate "probe-engine-error-two-space-still-caught"); _probe_rc4=$?
case "$_probe_out4" in
  *engine-level-failure*)
    echo "PASS fixture(sweep-engine-error-two-space-still-caught): the pre-existing two-space bootstrap shape is still caught alongside the new one-space arm -- sibling control for sweep-excludes-engine-level-failure-one-space"
    ;;
  *)
    echo "FAIL fixture(sweep-engine-error-two-space-still-caught): widening for one space broke the two-space case -- got: $_probe_out4"
    fail=1
    ;;
esac

# --- every finding is actionable BY THAT REPO'S OWNER ---------------------------------------------
# DoD 3's mechanical half. The written triage lives in the sprint's Execution Log; what is retained
# here is the property triage established.
#
# REVISED at SPRINT-076 T3, and the revision is the point. This case used to read "every FAIL names a
# file the target actually HAS", which was true when every rule here reported on a document that
# existed. `core-file-missing` names a file the target LACKS -- by definition -- so the old criterion
# would have failed a correct finding. That is a criterion going stale under new coverage, not a
# regression: logged as such rather than quietly re-read (L-088).
#
# The criterion that survives both shapes: a finding names a path the STANDARD owns. An
# ownership-header finding names a file in the tree; a core-file finding names a §2 canonical path.
# A finding naming neither is an artefact of dispositions written against our shape.
s2_paths=$(awk '
  /^## §2/ { in2 = 1; next }
  /^## §/  { in2 = 0 }
  !in2     { next }
  /^\*\*Conformance/        { in2 = 0; next }
  /^\*\*Root files/         { pfx = "";         next }
  /^\*\*AI context/         { pfx = ".claude/"; next }
  /^\*\*`docs\/` tree\*\*/  { pfx = "docs/";    next }
  /^\|/ {
    n = split($0, c, "|"); if (n < 5) next
    if (match(c[2], /`[^`]+`/)) p = substr(c[2], RSTART + 1, RLENGTH - 2); else next
    if (p ~ /[<>*]/) next
    print pfx p
  }' "$spec")

sweep_findings "$out"
if sweep_gate "findings-name-a-path-the-standard-owns"; then
  unactionable=""
  for f in $(printf '%s\n' "$_sweep_matched" | sed 's/^[^:]*: //'); do
    [ -e "$foreign/$f" ] && continue
    printf '%s\n' "$s2_paths" | grep -qxF "$f" && continue
    unactionable="$unactionable $f"
  done
  if [ -z "$unactionable" ]; then
    echo "PASS fixture(findings-name-a-path-the-standard-owns): every named finding points at a file the target has, or at a §2 canonical path it owes ($_sweep_reached/$_sweep_total FAIL line(s) swept)"
  else
    echo "FAIL fixture(findings-name-a-path-the-standard-owns): finding(s) name paths that are neither in the target nor named by §2 --$unactionable"
    echo "  (per the Plan this is evidence about docs/research/conformance-dispositions.md, not a reason to quieten the engine)"
    fail=1
  fi
fi

# --- acting on the ACTIONABLE findings, and what is left over -------------------------------------
# HISTORY, kept because the sequence is the evidence. SPRINT-075 applied every finding and asserted
# the repo went green. SPRINT-076 T3 could not keep that control honestly: 4 of the 8 core-file-missing
# findings were ARTEFACTS, because §2's unconditional set mixed repository-universal files with
# lean-flow's own loop surface (`TODO.md`, `AGENTS.md`, `.claude/CLAUDE.md`, `.claude/CONTEXT.md`).
# Telling a four-file JS library it owes a Claude Code context file is our shape wearing their repo's
# name. So the case was WEAKENED on purpose -- apply only the actionable findings, assert the
# remainder is exactly those four -- and retained, so that fixing the spec would redden it and force
# a re-triage rather than letting the artefacts quietly become permanent.
#
# SPRINT-077 T1 fixed the spec: §2 now names those four rows' substrate instead of saying `always`,
# so the engine no longer derives them as unconditional. This case reddened exactly as designed and is
# RE-TRIAGED here, not widened -- back to SPRINT-075's stronger form, which is now the honest one:
# every finding is actionable, so applying all of them must leave NOTHING. Re-derived at execution,
# not copied from the Plan (L-130): 8 core-file-missing -> 4, artefacts 4 -> 0, whole report 10 -> 6.
#
# The assertion is deliberately `-z` rather than a list. A remainder list can be quietly extended one
# row at a time; an empty-set assertion cannot absorb a new artefact without someone noticing.
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When the architecture changes\nstatus: current\n---\n\n# Architecture\n\nThe widget talks to the store.\n' > "$foreign/docs/architecture.md"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When the disclosure route changes\nstatus: current\n---\n\n# Security Policy\n\nReport vulnerabilities to security@acme.example.\n' > "$foreign/SECURITY.md"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: Every release\nstatus: current\n---\n\n# Changelog\n\n## 1.0.0\n\n- first release\n' > "$foreign/CHANGELOG.md"
mkdir -p "$foreign/docs/architecture" "$foreign/docs/development" "$foreign/docs/product"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When the architecture changes\nstatus: current\n---\n\n# Overview\n\nThe widget talks to the store.\n' > "$foreign/docs/architecture/overview.md"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When setup changes\nstatus: current\n---\n\n# Setup\n\n    npm i\n' > "$foreign/docs/development/setup.md"
# The two findings the pre-fix sweep never saw (TD-089): the README ownership footer and §6's two
# Base docs. Mirrors acme-widget-vcs's own remediated shape below byte-for-byte so the two targets do
# not drift.
printf '# acme-widget\n\nA small library that does one thing.\n\n## Install\n\n    npm i acme-widget\n\n<sub>Doc owner: Maintainer · last updated: 2026-08-20 · status: current</sub>\n' > "$foreign/README.md"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When requirements change\nstatus: current\n---\n\n# Requirements\n\nThe widget returns 42.\n' > "$foreign/docs/product/requirements.md"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When acceptance criteria change\nstatus: current\n---\n\n# Acceptance Criteria\n\n- widget() returns 42.\n' > "$foreign/docs/product/acceptance-criteria.md"

out2=$(sh "$engine" "$foreign" --spec "$spec" 2>&1)
sweep_findings "$out2"
if sweep_gate "every-finding-is-actionable-and-clears"; then
  left=$(printf '%s\n' "$_sweep_matched" | LC_ALL=C sort)
  if [ -z "$left" ]; then
    echo "PASS fixture(every-finding-is-actionable-and-clears): applying exactly what the report asked for takes the stranger's repo to no FAIL line; no artefact remains ($_sweep_reached/$_sweep_total FAIL line(s) swept -- SPRINT-077 T1, TD-089)"
  else
    echo "FAIL fixture(every-finding-is-actionable-and-clears): findings remain after applying every one of them."
    echo "  remainder:"; printf '%s\n' "$left" | sed 's/^/    /'
    echo "  (a remainder here is either a NEW artefact -- our shape leaking into a stranger's report, route it"
    echo "   to conformance-coverage.md § Artefacts -- or a finding whose fix above is incomplete. Triage"
    echo "   which, and record it; do NOT relax this assertion into a remainder list to make it green.)"
    fail=1
  fi
fi

# --- SPRINT-084 T4: the absent-attestation hold, exercised against a REAL git tree -----------------
# SPRINT-081 T4 added the hold; T3 could not exercise it, because the stranger above is built from
# printf's with NO `git init` -- so §13 always reports `not evaluated` and the new branch never runs
# against a foreign tree with real history (L-016's consumer-path gap; the rule IS exercised against
# this repository and by run-attestation-fixtures.sh, just never on a foreign one).
#
# A SEPARATE target rather than `git init`-ing the stranger above: that target's own assertions (the
# four-file invariant, the actionable-findings sweep, the every-finding-clears remediation) are
# already exercised and green above; layering git history and more remediation files onto it risks
# quietly changing what those assertions measure. This target owns exactly one property.
#
# The fixture is built FULLY REMEDIATED (mirroring the stranger's own remediated shape, which as of
# TD-089's fix now itself includes the README ownership footer and §6's Base doc set) so that no
# UNRELATED FAIL blocks the level ladder before it ever reaches §13: the ladder checks
# struct_fail/gated_fail/attested_fail before it ever consults a hold
# (conformance-engine.sh's level-line block), so one stray unrelated FAIL anywhere would keep this
# case from ever reaching `level: Gated` -- and silently prove nothing about §13 at all.
vcs="$work/acme-widget-vcs"
mkdir -p "$vcs/src" "$vcs/docs/architecture" "$vcs/docs/development" "$vcs/docs/product"
printf '# acme-widget\n\nA small library that does one thing.\n\n## Install\n\n    npm i acme-widget\n\n<sub>Doc owner: Maintainer · last updated: 2026-08-20 · status: current</sub>\n' > "$vcs/README.md"
printf 'export const widget = () => 42;\n' > "$vcs/src/index.js"
printf '{"name":"acme-widget","version":"1.0.0"}\n' > "$vcs/package.json"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When the architecture changes\nstatus: current\n---\n\n# Architecture\n\nThe widget talks to the store.\n' > "$vcs/docs/architecture.md"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When the disclosure route changes\nstatus: current\n---\n\n# Security Policy\n\nReport vulnerabilities to security@acme.example.\n' > "$vcs/SECURITY.md"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: Every release\nstatus: current\n---\n\n# Changelog\n\n## 1.0.0\n\n- first release\n' > "$vcs/CHANGELOG.md"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When the architecture changes\nstatus: current\n---\n\n# Overview\n\nThe widget talks to the store.\n' > "$vcs/docs/architecture/overview.md"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When setup changes\nstatus: current\n---\n\n# Setup\n\n    npm i\n' > "$vcs/docs/development/setup.md"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When requirements change\nstatus: current\n---\n\n# Requirements\n\nThe widget returns 42.\n' > "$vcs/docs/product/requirements.md"
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When acceptance criteria change\nstatus: current\n---\n\n# Acceptance Criteria\n\n- widget() returns 42.\n' > "$vcs/docs/product/acceptance-criteria.md"

# BEFORE -- the byte-identical tree, still NOT a git repository. This reproduces L-159's exact bug
# shape on this fixture: with no git-dir, §13 reports `not evaluated` for every rule (a note, never a
# hold), so NOTHING enters struct_hold/gated_hold/attested_hold and the ladder falls through to its
# final `else` -- `level: Attested`, over a tree that has made no attestation claim at all. Captured
# BEFORE `git init` so the ONLY variable between this and the AFTER measurement is the presence of
# git history -- every file on disk is identical.
out_before=$(sh "$engine" "$vcs" --spec "$spec" 2>&1); rc_before=$?

git -C "$vcs" init -q >/dev/null 2>&1 || { echo "FAIL harness: git init failed for $vcs"; exit 2; }
git -C "$vcs" -c user.name='Fixture Bot' -c user.email='fixture@example.com' -c commit.gpgsign=false \
  add -A >/dev/null 2>&1
printf 'chore: initial import of acme-widget\n' > "$work/vcs-msg"
git -C "$vcs" -c user.name='Fixture Bot' -c user.email='fixture@example.com' -c commit.gpgsign=false \
  commit -q -F "$work/vcs-msg" >/dev/null 2>&1
vcs_sha=$(git -C "$vcs" rev-parse HEAD 2>/dev/null)
[ -n "$vcs_sha" ] || { echo "FAIL harness: could not resolve HEAD for the git-ified stranger at $vcs"; exit 2; }

# Guard the fixture's own precondition mechanically, matching the four-file invariant guard above: HEAD
# must carry NONE of §13's three trailers, or this section is exercising the wrong branch (L-058).
head_body=$(git -C "$vcs" log -1 --format='%B' "$vcs_sha")
case "$head_body" in
  *"Gate-Signed-By:"*|*"Gate:"*|*"Evidence:"*)
    echo "FAIL fixture(attestation-absent-precondition): HEAD commit $vcs_sha carries a §13 trailer -- this section means to exercise attestation-ABSENT, not a claim"
    fail=1
    ;;
  *)
    echo "PASS fixture(attestation-absent-precondition): HEAD commit $vcs_sha carries none of Gate-Signed-By: / Gate: / Evidence:"

    # AFTER -- the same tree, now a real git repository with one real commit and no §13 trailers on
    # HEAD. This is the consumer path SPRINT-081 T3 could not reach.
    run_case_anywhere "attestation-absent-against-real-history" 0 "attestation-absent" -- \
      sh "$engine" "$vcs" --spec "$spec" --rev "$vcs_sha"
    run_case_anywhere "attestation-absent-caps-at-gated" 0 "level: Gated" -- \
      sh "$engine" "$vcs" --spec "$spec" --rev "$vcs_sha"

    out_after=$(sh "$engine" "$vcs" --spec "$spec" --rev "$vcs_sha" 2>&1); rc_after=$?

    # The DoD's third leg: the hold must never move the exit code (conformance-engine.sh: hold() calls
    # note() only, never bad() -- fail=1 is set nowhere on this path). Proven empirically here rather
    # than only cited: rc_before is the byte-identical tree pre-`git init` (§13 not evaluated, falls
    # through to a false level: Attested); rc_after is the same tree post-commit, where the hold
    # correctly caps it at level: Gated. The LEVEL claim is meant to change between the two; the exit
    # code is not.
    if [ "$rc_before" -eq "$rc_after" ] && [ "$rc_after" -eq 0 ]; then
      echo "PASS fixture(attestation-absent-exit-code-unmoved): exit $rc_before before git history existed (§13 not evaluated, level: Attested) == exit $rc_after after real history exists and the hold fires (attestation-absent, level: Gated) -- the hold changed the LEVEL claim, never the exit code"
    else
      echo "FAIL fixture(attestation-absent-exit-code-unmoved): exit $rc_before before vs $rc_after after (want both 0 and equal) -- the absent-attestation hold moved the exit code, which §13/§14 say it must never do"
      echo "  before:"; printf '%s\n' "$out_before" | grep -E '^(FAIL|      level:)'
      echo "  after:";  printf '%s\n' "$out_after"  | grep -E '^(FAIL|      level:)'
      fail=1
    fi
    ;;
esac

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "FOREIGN-REPO FIXTURES: all green"
else
  echo "FOREIGN-REPO FIXTURES: FAILURES ABOVE"
fi
exit $fail
