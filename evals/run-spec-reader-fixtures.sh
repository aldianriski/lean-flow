#!/bin/sh
# run-spec-reader-fixtures.sh -- fixtures for scripts/lib/read-spec-rules.sh (SPRINT-075 T1).
#
# The reader is the engine's rule source, which makes its failure mode the one every rule inherits: a
# reader that returns nothing checks nothing and exits clean, and the engine built on it reports a
# clean repository (L-058). So every case below that *can* fail is a must-FAIL case asserting its own
# NAMED finding -- a suite of PASS controls alone would go green on a reader that had stopped reading.
#
# Retained deliberately: these outlive the task that wrote them. Deleting a gate's fixtures with the
# prototype that motivated them is TD-012 exactly, and it leaves the rule unguarded.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-spec-reader-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
reader="$repo_root/scripts/lib/read-spec-rules.sh"
spec="$repo_root/spec/STANDARD.md"
. "$here/lib/harness-common.sh"

fail=0
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT INT TERM

# --- case 1 (PASS control): the real spec reconciles against its OWN published counts --------------
# The strongest single statement this suite makes. §14 publishes a per-section counts row; the reader
# parses the tables independently. Agreement across all 13 sections means no section was silently
# dropped -- which a total-only check could not tell you, since a section read twice would mask one
# read zero times.
run_case_anywhere "reconciles-with-section-14" 0 "reconciled" -- \
  sh "$reader" "$spec" --reconcile

# --- case 2 (PASS control): §13 still yields the rows its shipped consumer expects -----------------
# conformance-engine.sh consumes this reader instead of carrying its own copy of the parse (it took
# over §13 from the deleted check-attestation.sh at SPRINT-078 T1). If §13's rows ever stop matching,
# the engine's whole §13 rule set changes silently.
out=$(sh "$reader" "$spec" --section 13 2>&1); rc=$?
n13=$(printf '%s\n' "$out" | grep -c '^S13\.')
if [ "$rc" -eq 0 ] && [ "$n13" -eq 7 ] &&
   printf '%s\n' "$out" | grep -q '^S13\.TRAILERS Attested mechanical$' &&
   printf '%s\n' "$out" | grep -q '^S13\.NOINFER . implementation-directed$'; then
  echo "PASS fixture(s13-rows-intact): 7 rows, levels and marks as the spec states them"
else
  echo "FAIL fixture(s13-rows-intact): exit $rc, $n13 rows -- output:"; printf '%s\n' "$out"; fail=1
fi

# --- case 3 (PASS control): a section §14 says has NO rules exits 0 and says nothing ---------------
# §8 is a projection and introduces no rules; §14 records that as 0. Reporting a finding here would be
# a false positive against a perfectly good spec, and the engine hits §8 on every full sweep. This
# case is why the reader consults §14's count instead of treating zero rows as unreadable.
out=$(sh "$reader" "$spec" --section 8 2>&1); rc=$?
if [ "$rc" -eq 0 ] && [ -z "$out" ]; then
  echo "PASS fixture(zero-rule-section-is-not-a-finding): §8 exits 0 silently -- §14 publishes 0 for it"
else
  echo "FAIL fixture(zero-rule-section-is-not-a-finding): exit $rc -- output:"; printf '%s\n' "$out"; fail=1
fi

# --- case 4 (must-FAIL): spec-table-unreadable, whole spec -----------------------------------------
# The case without which the engine degrades silently.
printf '# not a standard\n\nNo conformance tables here.\n' > "$work/empty-spec.md"
run_case_anywhere "spec-table-unreadable-whole" 1 "spec-table-unreadable" -- \
  sh "$reader" "$work/empty-spec.md"

# --- case 5 (must-FAIL): spec-table-unreadable, one section whose rules were dropped ---------------
# §13's table is stripped from a copy of the REAL spec, leaving §14's count saying 7. Zero rows against
# a published 7 is a dropped rule set, and must be named rather than returned as an empty list.
awk '/^## §13 /{w=1} /^## §14 /{w=0} w && /^[|] *`S13[.]/ {next} {print}' "$spec" > "$work/spec-no-s13.md"
# Guarded by ROW COUNT, not by substring: `S13.TRAILERS` survives the strip because §14's prose names
# it as its worked example of reading a rule id -- the same trap this suite's case 9 exists to catch.
n_left=$(grep -c '^[|] *`S13[.]' "$work/spec-no-s13.md")
[ "$n_left" -eq 0 ] || { echo "FAIL harness: $n_left §13 table rows survived the strip -- the must-FAIL case is not testing what it claims"; fail=1; }
run_case_anywhere "spec-table-unreadable-section" 1 "spec-table-unreadable" -- \
  sh "$reader" "$work/spec-no-s13.md" --section 13

# --- case 6 (must-FAIL): section-rows-mismatch -- a section short of its published count -----------
# One §2 row is removed. The total still moves, but the point is the PER-SECTION line: this is the
# finding that catches a table whose shape diverged in one section while the rest kept parsing.
awk 'BEGIN{d=0} /^[|] *`S2[.]F-CAP` *[|]/ && d==0 {d=1; next} {print}' "$spec" > "$work/spec-short-s2.md"
run_case_anywhere "section-rows-mismatch" 1 "section-rows-mismatch" -- \
  sh "$reader" "$work/spec-short-s2.md" --reconcile

# --- case 7 (must-FAIL): spec-counts-unreadable -- §14's own counts row is gone --------------------
# Without §14's row the reader cannot tell a dropped section from a section with no rules, so it
# refuses rather than falling back to the ambiguous reading.
awk '!/^[|] *classified *[|]/' "$spec" > "$work/spec-no-counts.md"
run_case_anywhere "spec-counts-unreadable" 1 "spec-counts-unreadable" -- \
  sh "$reader" "$work/spec-no-counts.md" --reconcile

# --- case 8 (must-FAIL): spec-not-found ------------------------------------------------------------
run_case_anywhere "spec-not-found" 1 "spec-not-found" -- \
  sh "$reader" "$work/no-such-spec.md"

# --- case 9: the match is anchored by POSITION, not by substring (L-108) ---------------------------
# §14 names S13.NOINFER and S13.NOTAUTHOR in PROSE when it explains the implementation-directed
# category, and §8 names seven ids from other sections in prose when it explains that it restates
# them. A substring-matching reader ingests that prose as rules and inflates every count. The
# reconciliation in case 1 would catch it -- this case says so explicitly, so a future reader that
# loosens the anchor fails with the reason rather than with an arithmetic surprise.
#
# Asserting the EXACT emitted row count against §14's published total is what makes this case bite. An
# earlier version checked only S13.NOINFER's row count and the per-section reconciliation; a seeded
# loosening of the anchor passed both, because the spurious rows were prose mentions inside OTHER
# sections' windows and bucketed nowhere. The count of what was actually emitted is the discriminating
# assertion -- verified by seeding that break and watching this case redden (L-137).
n_prose=$(grep -c 'S13\.NOINFER' "$spec")
n_rows=$(sh "$reader" "$spec" 2>/dev/null | grep -c '^S13\.NOINFER ')
n_all=$(sh "$reader" "$spec" 2>/dev/null | wc -l | tr -d ' ')
n_pub=$(awk '/^## /{h=$0; sub(/^## [^0-9]*/,"",h); s=h+0} s==14 && /^[|] *classified *[|]/ {n=split($0,f,"|"); v=f[n-1]; gsub(/[*` ]/,"",v); print v; exit}' "$spec")
if [ "$n_prose" -gt 1 ] && [ "$n_rows" -eq 1 ] && [ "$n_all" -eq "$n_pub" ]; then
  echo "PASS fixture(position-anchored-not-substring): $n_all rows emitted = §14's published $n_pub; S13.NOINFER appears $n_prose times, once as a rule"
else
  echo "FAIL fixture(position-anchored-not-substring): $n_all rows emitted vs §14's $n_pub; $n_prose prose mentions, $n_rows rule rows -- the anchor is matching text, not table position (L-108)"
  fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "SPEC READER FIXTURES: all green"
else
  echo "SPEC READER FIXTURES: FAILURES ABOVE"
fi
exit $fail
