#!/usr/bin/env sh
# check-ephemeral-intake.sh -- catches intake scaffolding that was committed instead of disposed of
# (SPRINT-055 T4, TASK-169).
#
# DOCS_Guide §2 lists two artifacts as ephemeral intake material with no durable home: a
# `BUG-<slug>.md` defect report, and the working feature PRD `/task-decomposer` synthesizes. Both are
# written to the OS temp dir. Their substance moves into something durable -- a TASK-NNN, a TD-NNN, a
# regression test, docs/product/requirements.md -- and the scaffolding is simply gone.
#
# Before T4, §2 said "routed away at /triage" about the BUG's CONTENT and nothing at all about the
# FILE, and listed it with no directory prefix while every sibling row carried one. Nothing said
# whether it was committed, deleted, or archived. "Undisposed" was not even expressible, so it could
# not be checked. Under the temp-dir rule it becomes mechanical: a committed report IS the failure.
#
# §11 has no row for either artifact, and that absence is the rule rather than a gap in it --
# retention acts on committed files.
#
# Usage: sh check-ephemeral-intake.sh <repo-root>
# Prints one PASS/FAIL line; exits 1 if any FAIL line was printed, 0 otherwise. Dependency-free POSIX sh.
set -u

root=${1:?usage: check-ephemeral-intake.sh <repo-root>}
[ -d "$root" ] || { echo "FAIL ephemeral-intake: repo root not found at $root"; exit 2; }

fail=0

# `BUG-*.md` is the report; `BUG.md.template` is the blank form that generates one and is a legitimate
# committed file -- the glob distinguishes them without needing an exception. Fixture trees are
# excluded: they exist to hold exactly the violation this checker looks for.
found=$(find "$root" -type f -name 'BUG-*.md' 2>/dev/null |
  sed "s#^$root/##" |
  grep -v '^evals/fixtures/' |
  sort)

if [ -n "$found" ]; then
  for f in $found; do
    fail=1
    printf 'FAIL  %s\n' "ephemeral-intake: $f is a committed BUG report -- a defect report is temp-dir intake scaffolding (DOCS_Guide §2), so once /triage routes it into a TASK/TD//diagnose brief there is nothing left to commit. Carry the repro into the destination instead of pointing back at this file"
  done
else
  printf 'PASS  %s\n' "ephemeral-intake: no committed BUG-*.md reports (temp-dir intake, DOCS_Guide §2)"
fi

exit $fail
