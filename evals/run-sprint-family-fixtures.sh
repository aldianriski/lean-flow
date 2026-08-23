#!/usr/bin/env sh
# run-sprint-family-fixtures.sh -- retained fixtures for the two families defined over git history:
# §9 sprint-file (SPRINT-079 T4) and §10 learning-governance (T5). §9: S9.TWOFILES · S9.LOGDIR ·
# S9.PLANFROZEN · S9.SCOPECHANGE · S9.VERIFYCLAUSE, six findings. §10: FOURBUCKETS · PROMOTION ·
# TDAGING · PROMOTEREVIEW, four findings.
#
# WHY ITS OWN HARNESS. run-conformance-engine-fixtures.sh states in its header that it needs no git,
# and two of these rules are defined over history -- PLANFROZEN diffs § Plan against `plan_commit`,
# SCOPECHANGE reads the ORDER of two commits. Bolting git onto that suite would falsify its own
# contract and add minutes to a harness already past six; the repo's convention for a git-backed
# family is a sibling file (run-attestation-fixtures.sh, run-layers-observed-fixtures.sh).
#
# WHY THE SHIPPED SPEC, NOT A REDUCED ONE. The attestation suite hands the engine a cut-down spec so
# ~44 unimplemented ids do not drown its assertions. That is unnecessary here because every case
# below asserts on a NAMED FINDING STRING rather than on the exit code alone -- other rules may fire
# freely without touching the claim. Testing against the shipped spec is strictly better: a §9 row
# that moves breaks these cases, which is the point.
#
# Retained deliberately: these outlive the task that wrote them (TD-012, L-058). Every case is
# must-FAIL on input that MUST produce the finding, and each has a control proving it does not fire
# on the correct shape -- a check that always fires is as useless as one that never does.

set -u
fail=0
root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
engine="$root/scripts/lib/conformance-engine.sh"
spec="$root/spec/STANDARD.md"
[ -f "$engine" ] || { echo "FAIL harness: engine not found at $engine"; exit 2; }
[ -f "$spec" ]   || { echo "FAIL harness: spec not found at $spec"; exit 2; }

work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'chmod -R u+w "$work" 2>/dev/null; rm -rf "$work"' EXIT

commit_msg() {  # <dir> <subject>
  git -C "$1" add -A >/dev/null 2>&1
  git -C "$1" -c user.name='Fixture Bot' -c user.email='fixture@example.com' \
    -c commit.gpgsign=false commit -q -m "$2" >/dev/null 2>&1
}

# plan_body <extra-DoD-line> -- a minimal but SHAPE-ACCURATE sprint Plan. Written to match the real
# template rather than a convenient stub: a stub would test this harness's idea of a sprint file.
sprint_plan() {  # <dir> <plan_commit-value> <dod-line>
  mkdir -p "$1/docs/sprint/logs"
  { printf -- '---\n'
    printf 'sprint: 900\nslug: fixture\nowner: Maintainer\nlast_updated: 2026-01-01\nstatus: active\n'
    printf 'plan_commit: %s\n' "$2"
    printf 'update_trigger: sprint execute/close events\n'
    printf -- '---\n\n# SPRINT-900 --- Fixture\n\n## Plan\n\n'
    printf '### T1 --- a task `[size: S / risk: low / class: execution / AFK]`\n'
    printf 'Layers: `a.md`\nDepends-on: none\n\n**Acceptance:** it is done\n\n**DoD:**\n'
    printf -- '%s\n' "$3"
    printf '\n## Retro\n'
  } > "$1/docs/sprint/SPRINT-900-fixture.md"
}
sprint_log() {  # <dir> [scope-change-entry]
  mkdir -p "$1/docs/sprint/logs"
  { printf -- '---\nsprint: 900\nslug: fixture\nowner: Maintainer\nlast_updated: 2026-01-01\nstatus: active\nupdate_trigger: an entry is appended\n---\n\n'
    printf '# SPRINT-900 --- Execution Log\n\n'
    printf '### 2026-01-01 | progress | did a thing\nsomething happened.\n'
    [ "$#" -ge 2 ] && printf '\n### 2026-01-02 | scope-change | the Plan had to move\nwhat broke, impact, re-confirm G2.\n'
  } > "$1/docs/sprint/logs/SPRINT-900-fixture.md"
}
edit_plan() {  # <dir> -- change § Plan itself, not a tick or a Files Changed row
  sed -i 's/^\*\*Acceptance:\*\* it is done$/**Acceptance:** it is done, differently/' \
    "$1/docs/sprint/SPRINT-900-fixture.md"
}

# assert_finding <name> <dir> <finding-substring> -- must-FAIL: the finding MUST appear.
assert_finding() {
  _n=$1; _d=$2; _f=$3
  _o=$(sh "$engine" "$_d" --spec "$spec" 2>&1)
  if printf '%s\n' "$_o" | grep -qF "$_f"; then
    echo "PASS fixture($_n): finding fired -- '$_f'"
  else
    echo "FAIL fixture($_n): expected finding '$_f' and it did not fire -- §9 lines were:"
    printf '%s\n' "$_o" | grep -E 'S9\.|sprint-|plan-edited|scope-change|dod-criterion' | sed 's/^/    /'
    fail=1
  fi
}
# assert_absent <name> <dir> <finding-substring> -- the CONTROL: it must NOT fire on a correct repo.
assert_absent() {
  _n=$1; _d=$2; _f=$3
  _o=$(sh "$engine" "$_d" --spec "$spec" 2>&1)
  if printf '%s\n' "$_o" | grep -qF "$_f"; then
    echo "FAIL fixture($_n): '$_f' fired on a repository that satisfies the rule -- a false positive is a false negative about the contract"
    printf '%s\n' "$_o" | grep -F "$_f" | sed 's/^/    /'
    fail=1
  else
    echo "PASS fixture($_n): '$_f' correctly silent on the compliant shape"
  fi
}

echo "=== §9 sprint-family fixtures ==="

# --- S9.TWOFILES (a): the Plan's 400 hard cap ----------------------------------------------------
# The cap is read from §2's own row, so this fixture must exceed whatever that row says rather than
# a number written here. 420 padding lines clear 400 with room, and would still clear a raised cap
# only if §2 raised it above 420 -- at which point this case failing is correct information.
d="$work/cap"; mkdir -p "$d"; sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
i=0; while [ "$i" -lt 420 ]; do printf 'padding line %s\n' "$i" >> "$d/docs/sprint/SPRINT-900-fixture.md"; i=$((i + 1)); done
assert_finding "s9-plan-over-cap" "$d" "sprint-plan-over-hard-cap"

d="$work/cap-ok"; mkdir -p "$d"; sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
assert_absent "s9-plan-over-cap-control" "$d" "sprint-plan-over-hard-cap"

# --- S9.TWOFILES (b): the log is owed once work has happened -------------------------------------
# The substrate is a TICKED DoD box. §9 creates the log lazily at the first entry, so its absence
# before any tick is correct -- and the control below is the half that matters: without it this
# check would fire on every sprint in the gap between promote and the first task.
d="$work/nolog"; mkdir -p "$d"; sprint_plan "$d" "" '- [x] a thing --- *Verify: it*'
assert_finding "s9-log-missing" "$d" "sprint-log-missing"

d="$work/nolog-ok"; mkdir -p "$d"; sprint_plan "$d" "" '- [ ] a thing'
assert_absent "s9-log-missing-control-lazy" "$d" "sprint-log-missing"

# --- S9.LOGDIR: a log beside the Plan, not under logs/ -------------------------------------------
d="$work/logdir"; mkdir -p "$d"; sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
printf '# stray log\n' > "$d/docs/sprint/SPRINT-900-fixture-log.md"
assert_finding "s9-log-outside-logs-dir" "$d" "sprint-log-outside-logs-dir"

d="$work/logdir-ok"; mkdir -p "$d"; sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
assert_absent "s9-log-outside-logs-dir-control" "$d" "sprint-log-outside-logs-dir"

# --- S9.VERIFYCLAUSE: a ticked criterion naming no evidence --------------------------------------
d="$work/verify"; mkdir -p "$d"; sprint_plan "$d" "" '- [x] a thing with nothing behind it'; sprint_log "$d"
assert_finding "s9-dod-names-no-check" "$d" "dod-criterion-names-no-check"

# Two controls, because the rule admits TWO forms of evidence and passing only one would leave the
# other unguarded: an italic *Verify:* clause, and a stated proof marker on the ticked line.
d="$work/verify-ok1"; mkdir -p "$d"; sprint_plan "$d" "" '- [x] a thing --- *Verify: the check that proves it*'; sprint_log "$d"
assert_absent "s9-dod-names-no-check-control-verify" "$d" "dod-criterion-names-no-check"

d="$work/verify-ok2"; mkdir -p "$d"; sprint_plan "$d" "" '- [x] a thing  ✓ proved by the run above'; sprint_log "$d"
assert_absent "s9-dod-names-no-check-control-evidence" "$d" "dod-criterion-names-no-check"

# The control the family was missing, and the reason the phantom shipped (SPRINT-080 T0): both
# controls above hand the rule a Plan that HAS a ticked box, so neither could ever exercise the
# zero-tick path. A freshly-promoted sprint has no ticks at all, and `$(grep ...)` matching nothing
# inside a heredoc still yields one empty line -- so the rule reported an evidence-less criterion
# against a Plan containing none. This case pins the state every sprint passes through.
d="$work/verify-ok3"; mkdir -p "$d"; sprint_plan "$d" "" '- [ ] a thing not done yet'; sprint_log "$d"
assert_absent "s9-dod-names-no-check-control-zero-ticks" "$d" "dod-criterion-names-no-check"

# --- S9.PLANFROZEN: § Plan edited after the freeze with nothing accounting for it -----------------
# Needs real history: the rule diffs § Plan at plan_commit against the working tree.
d="$work/frozen"; mkdir -p "$d"
git -C "$d" init -q >/dev/null 2>&1 || { echo "FAIL harness: git init failed"; exit 2; }
sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
commit_msg "$d" "sprint(900): plan locked"
pc=$(git -C "$d" rev-parse --short HEAD)
sprint_plan "$d" "$pc" '- [ ] a thing'; sprint_log "$d"
commit_msg "$d" "sprint(900): record plan_commit"
edit_plan "$d"
commit_msg "$d" "sprint(900) T1: quietly widen the Plan"
assert_finding "s9-plan-edited-after-freeze" "$d" "plan-edited-after-freeze"

# Control: the SAME edit, with a scope-change entry accounting for it, must NOT fire. §9 permits a
# mid-sprint amendment -- reporting one is a finding no adopter can clear, since amending was the
# correct action. This control is what separates "the Plan moved" from "the Plan moved unaccounted".
d="$work/frozen-ok"; mkdir -p "$d"
git -C "$d" init -q >/dev/null 2>&1
sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
commit_msg "$d" "sprint(900): plan locked"
pc=$(git -C "$d" rev-parse --short HEAD)
sprint_plan "$d" "$pc" '- [ ] a thing'; sprint_log "$d"
commit_msg "$d" "sprint(900): record plan_commit"
sprint_log "$d" scope-change
commit_msg "$d" "sprint(900): log the scope-change"
edit_plan "$d"
commit_msg "$d" "sprint(900) T1: amend the Plan, accounted for"
assert_absent "s9-plan-edited-after-freeze-control" "$d" "plan-edited-after-freeze"

# --- S9.SCOPECHANGE: the entry written AFTER the edit it justifies --------------------------------
# The ordering rule, and the reason it is a separate rule from PLANFROZEN: an entry added later
# SATISFIES "an entry exists" and fails "it was written first". §9 puts the entry first so the reason
# survives the edit; written afterwards it is a justification composed knowing the outcome.
d="$work/order"; mkdir -p "$d"
git -C "$d" init -q >/dev/null 2>&1
sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
commit_msg "$d" "sprint(900): plan locked"
pc=$(git -C "$d" rev-parse --short HEAD)
sprint_plan "$d" "$pc" '- [ ] a thing'; sprint_log "$d"
commit_msg "$d" "sprint(900): record plan_commit"
edit_plan "$d"
commit_msg "$d" "sprint(900) T1: edit the Plan first"
sprint_log "$d" scope-change
commit_msg "$d" "sprint(900): log the scope-change afterwards"
assert_finding "s9-scope-change-after-edit" "$d" "scope-change-logged-after-plan-edit"

# Control: the entry committed BEFORE the edit. Same two commits, opposite order -- which is the
# whole of what this rule measures, so proving the order is what flips it is the assertion.
assert_absent "s9-scope-change-after-edit-control" "$work/frozen-ok" "scope-change-logged-after-plan-edit"

echo "=== §10 governance-family fixtures ==="

# §10's four rules join this harness rather than the engine suite for the same reason §9's did: two of
# them are defined over history (FOURBUCKETS reads the close commit, PROMOTEREVIEW reads the promote
# record), and the engine suite states in its header that it needs no git.

learn_entry() {  # <dir> <count> <heading-status>
  mkdir -p "$1/docs"
  { printf -- '---\n'
    printf 'owner: Maintainer\nlast_updated: 2026-01-01\nupdate_trigger: a learning lands\nstatus: current\n'
    printf -- '---\n\n# Learnings\n\n---\n'
    printf '## L-001 [tags: process] [status: %s]: a thing that happened\n' "$3"
    printf -- '- seen: Sprint-001 - Sprint-002\n'
    printf -- '- count: %s\n' "$2"
    printf -- '- promoted: no\n'
  } > "$1/docs/LEARNINGS.md"
}

td_ledger() {  # <dir> <created-sprint> [any third arg = the sweep names it]
  { printf -- '---\n'
    printf 'owner: Maintainer\nlast_updated: 2026-01-01\nupdate_trigger: debt filed\nstatus: current\n'
    printf -- '---\n\n# Tech Debt\n\n'
    if [ "$#" -ge 3 ]; then printf '> Aging sweep -- SPRINT-900 promote. Held, with reasons: TD-001.\n\n'; fi
    printf -- '- **TD-001** severity: minor | status: open | created: Sprint-%s\n' "$2"
    printf '  - Summary: a cost somebody is carrying.\n'
  } > "$1/TECH-DEBT.md"
}

close_the_sprint() {  # <dir> -- stamp status: closed + close_commit for HEAD
  _cc=$(git -C "$1" rev-parse --short HEAD)
  _f="$1/docs/sprint/SPRINT-900-fixture.md"
  sed -i 's/^status: active$/status: closed/' "$_f"
  awk -v c="$_cc" '/^update_trigger:/ { print "close_commit: " c } { print }' "$_f" > "$1/.tmp.md"
  mv "$1/.tmp.md" "$_f"
}

# --- S10.PROMOTION: a recurrence left unpromoted --------------------------------------------------
d="$work/promo"; mkdir -p "$d"; sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"; learn_entry "$d" 2 active
assert_finding "s10-learning-unpromoted" "$d" "learning-recurred-unpromoted"

# Control (a): a one-off is context, not law -- §10 says don't promote on a single occurrence, and
# without this the check could be firing on every entry rather than on recurrences.
d="$work/promo-ok1"; mkdir -p "$d"; sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"; learn_entry "$d" 1 active
assert_absent "s10-learning-unpromoted-control-oneoff" "$d" "learning-recurred-unpromoted"

# Control (b): the SAME count, already promoted. This is the case a substring scan gets wrong. The
# corpus is self-describing -- an entry whose prose quotes the promoted marker while explaining the
# collapse reads as promoted to a substring scan -- so state is read from the heading field,
# position-anchored (L-108). On the real ledger that difference is 42 by substring against 41 anchored.
d="$work/promo-ok2"; mkdir -p "$d"; sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"; learn_entry "$d" 2 promoted
assert_absent "s10-learning-unpromoted-control-promoted" "$d" "learning-recurred-unpromoted"

# --- S10.TDAGING: an aged row no sweep names -----------------------------------------------------
# The Plan's frontmatter says sprint 900, so a row created at Sprint-800 is far past §10's three.
d="$work/aging"; mkdir -p "$d"; sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"; td_ledger "$d" 800
assert_finding "s10-td-aged-unreviewed" "$d" "td-row-aged-unreviewed"

# Control (a): the same aged row, named in the ledger's aging sweep. §10 asks for a re-review PROMPT,
# not a per-row edit, so a row the sweep held is a cost somebody decided to keep.
d="$work/aging-ok1"; mkdir -p "$d"; sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"; td_ledger "$d" 800 swept
assert_absent "s10-td-aged-unreviewed-control-swept" "$d" "td-row-aged-unreviewed"

# Control (b): a row younger than three sprints and unswept. Without it the must-FAIL above cannot
# distinguish "fires on aged rows" from "fires on every open row".
d="$work/aging-ok2"; mkdir -p "$d"; sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"; td_ledger "$d" 899
assert_absent "s10-td-aged-unreviewed-control-young" "$d" "td-row-aged-unreviewed"

# --- S10.PROMOTEREVIEW: a promote record naming no checklist --------------------------------------
d="$work/review"; mkdir -p "$d"
git -C "$d" init -q >/dev/null 2>&1
sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
commit_msg "$d" "sprint(900): plan locked"
pc=$(git -C "$d" rev-parse --short HEAD)
sprint_plan "$d" "$pc" '- [ ] a thing'; sprint_log "$d"
commit_msg "$d" "sprint(900): record plan_commit"
assert_finding "s10-promote-checklist-absent" "$d" "promote-checklist-absent"

# Control: the same shape whose plan-lock commit carries the three lines. §10 fixes the checklist's
# CONTENT and not its location -- the record may be the commit message or the log's promote entry --
# so demanding one home would fail a repository that used the other.
d="$work/review-ok"; mkdir -p "$d"
git -C "$d" init -q >/dev/null 2>&1
sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
{ printf 'sprint(900): plan locked\n\n'
  printf 'L-promotion: none\n'
  printf 'TD aging: none\n'
  printf 'doc-aging: none\n'
} > "$work/pmsg"
git -C "$d" add -A >/dev/null 2>&1
git -C "$d" -c user.name='Fixture Bot' -c user.email='fixture@example.com' \
  -c commit.gpgsign=false commit -q -F "$work/pmsg" >/dev/null 2>&1
pc=$(git -C "$d" rev-parse --short HEAD)
sprint_plan "$d" "$pc" '- [ ] a thing'; sprint_log "$d"
assert_absent "s10-promote-checklist-absent-control" "$d" "promote-checklist-absent"

# --- S10.FOURBUCKETS: a close that routed to nothing ----------------------------------------------
d="$work/buckets"; mkdir -p "$d"
git -C "$d" init -q >/dev/null 2>&1
sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
commit_msg "$d" "sprint(900): plan locked"
printf 'the Retro stayed in the sprint file\n' > "$d/scratch.txt"
commit_msg "$d" "sprint(900): close"
close_the_sprint "$d"
assert_finding "s10-retro-bucket-unrouted" "$d" "retro-bucket-unrouted"

# Control: the same close, reaching ONE durable home. Deliberately not all four -- a bucket can be
# legitimately empty (a sprint that incurred no debt files no TD-NNN), so demanding four would fail a
# correct close. Reaching NONE is the unambiguous case, and this control fixes that boundary.
d="$work/buckets-ok"; mkdir -p "$d"
git -C "$d" init -q >/dev/null 2>&1
sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
commit_msg "$d" "sprint(900): plan locked"
printf '# Changelog\n\n## v1 -- what this sprint shipped\n' > "$d/CHANGELOG.md"
commit_msg "$d" "sprint(900): close"
close_the_sprint "$d"
assert_absent "s10-retro-bucket-unrouted-control" "$d" "retro-bucket-unrouted"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "SPRINT-FAMILY FIXTURES: all green"
else
  echo "SPRINT-FAMILY FIXTURES: FAILURES ABOVE"
fi
exit $fail
