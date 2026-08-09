#!/usr/bin/env sh
# check-manifest-lockstep.sh -- every plugin manifest carries the SAME version (SPRINT-056 T5).
#
# Four manifests carry the version -- .claude-plugin/plugin.json, .claude-plugin/marketplace.json,
# .codex-plugin/plugin.json, .kimi-plugin/plugin.json -- and qa-check.sh's leg 6 compared the README
# FOOTER against the first of them. So no two manifests were ever compared to each other, and
# .codex-plugin/ and .kimi-plugin/ drifted FIVE releases behind before v1.28.0 caught it by hand.
# The lockstep rule is a DoD line in .claude/CLAUDE.md; it had simply never had a check.
#
# The manifest set is DERIVED from the `*-plugin/` directories on disk, never hand-listed: a
# hardcoded sibling list is stale the moment someone adds a fifth manifest, and neither the author
# nor the reviewer can see it (L-066). Adding a directory enrolls it automatically.
#
# Deliberately NOT replacing leg 6: that compares a different pair (README footer vs plugin.json) and
# still catches a real drift this cannot see. Narrowing coverage while claiming to widen it is the
# failure mode T2 spent its whole DoD guarding against (L-076).
#
# Usage: sh check-manifest-lockstep.sh [<root-dir>]
# Prints one PASS/FAIL line per manifest compared; exits 1 if any FAIL line was printed.
# Dependency-free POSIX sh -- no jq, no bashisms.
set -u

root=${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}
fail=0

ver_of() { grep -oE '"version"[ ]*:[ ]*"[0-9]+\.[0-9]+\.[0-9]+"' "$1" 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n1; }

# Both dotted and undotted: every manifest in this repo lives in a DOT directory (.claude-plugin,
# .codex-plugin, .kimi-plugin) and a shell glob does not match a leading dot, so `*-plugin/*.json`
# alone found nothing. Caught on the checker's first live run -- which is the run that exists to find
# this (L-102). An undotted pattern is kept too so a consumer laying them out differently is covered.
manifests=$(cd "$root" 2>/dev/null && ls -d .*-plugin/*.json *-plugin/*.json 2>/dev/null | sort -u)
[ -n "$manifests" ] || { printf 'FAIL  manifest lockstep: no *-plugin/*.json manifests found under %s\n' "$root"; exit 1; }

# The reference is the canonical plugin manifest when present, else the first found. Named in every
# finding so a FAIL says what drifted FROM what, not merely that two numbers differ.
ref=".claude-plugin/plugin.json"
[ -f "$root/$ref" ] || ref=$(printf '%s\n' "$manifests" | head -n1)
refver=$(ver_of "$root/$ref")

if [ -z "$refver" ]; then
  printf 'FAIL  manifest lockstep: reference %s carries no parseable version -- a manifest that cannot be read is not a pass\n' "$ref"
  exit 1
fi

n=0
for m in $manifests; do
  v=$(ver_of "$root/$m")
  n=$((n + 1))
  if [ -z "$v" ]; then
    # A manifest with no version is reported, never skipped: silence here is exactly how three of
    # these drifted unnoticed for five releases.
    printf 'FAIL  manifest lockstep: %s carries no parseable version\n' "$m"
    fail=1
  elif [ "$v" = "$refver" ]; then
    printf 'PASS  manifest lockstep: %s (%s) == %s\n' "$m" "$v" "$ref"
  else
    printf 'FAIL  manifest lockstep: %s (%s) != %s (%s)\n' "$m" "$v" "$ref" "$refver"
    fail=1
  fi
done

# Comparing one manifest to itself is not lockstep. Zero or one manifest in scope means the check
# verified nothing, and a PASS over an empty comparison set is the defect T4 fixed elsewhere in this
# sprint -- so say so rather than exiting green (L-058).
[ "$n" -ge 2 ] || { printf 'FAIL  manifest lockstep: only %s manifest(s) in scope -- nothing was compared\n' "$n"; fail=1; }

exit $fail
