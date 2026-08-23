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

# close_at <file> <dir> -- stamp status: closed + close_commit INTO THE FRONTMATTER of <file>.
# The frontmatter is the point: appending `close_commit:` to the END of the file leaves it
# outside the header _fm_real reads, so the value is invisible and the rule reports the sprint
# as unphaseable rather than judging it. That is how the S11.WHENITRUNS must-FAIL case failed to
# fire AND its control passed vacuously in the same run -- both were reading nothing (L-142).
close_at() {  # <file> <dir>
  _cc=$(git -C "$2" rev-parse --short HEAD)
  sed -i 's/^status: active$/status: closed/' "$1"
  awk -v c="$_cc" '/^update_trigger:/ { print "close_commit: " c } { print }' "$1" > "$2/.tmp.md"
  mv "$2/.tmp.md" "$1"
}

close_the_sprint() {  # <dir> -- stamp status: closed + close_commit for HEAD
  close_at "$1/docs/sprint/SPRINT-900-fixture.md" "$1"
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


echo "=== §11 ledger-retention fixtures (SPRINT-080 T1) ==="

# Every case below builds a repo that carries a SPRINT-900 Plan, because "N sprints ago" needs a
# scale to be judged against -- _s11_sprint_max reads it from docs/sprint/. A ledger fixture with no
# sprint numbering is a different (and correct) verdict: not judged.

# ledger_repo <dir> -- a minimal conformant repo: one active sprint, a short TODO with an empty
# Backlog, an empty TECH-DEBT ledger and a LEARNINGS file with one collapsed promoted entry.
# Built conformant so each case below breaks exactly ONE thing, which is what makes the case a
# discrimination rather than a demolition (L-142).
ledger_repo() {
  mkdir -p "$1/docs"
  sprint_plan "$1" "" '- [ ] a thing'; sprint_log "$1"
  printf '# TODO\n\n## Active Sprint\n\n> **SPRINT-900 --- Fixture** -> docs/sprint/SPRINT-900-fixture.md\n\n## Backlog\n\n- [ ] TASK-001 --- a thing to do\n' > "$1/TODO.md"
  printf -- '---\nowner: Maintainer\nlast_updated: 2026-01-01\nstatus: current\nupdate_trigger: debt filed or resolved\n---\n\n# TECH-DEBT\n\n> resolved rows are deleted 3 sprints later.\n' > "$1/TECH-DEBT.md"
  printf -- '---\nowner: Maintainer\nlast_updated: 2026-01-01\nstatus: current\nupdate_trigger: a learning is confirmed or promoted\n---\n\n# Learnings\n\n## L-001 [tags: process] [status: promoted]: → promoted: CLAUDE.md § Anti-Patterns\n\n- count: 2\n' > "$1/docs/LEARNINGS.md"
}

# --- S11.TDDELETE: a resolved row older than the spec's own retention delay --------------------
# closed at Sprint-880 against a current Sprint-900 is 20 sprints, past any plausible delay. The
# THRESHOLD is not written here: the check reads ">= N sprints" out of §11's own S11.TDDELETE row,
# and the scratch-spec case below proves that by moving it.
d="$work/tddelete"; mkdir -p "$d"; ledger_repo "$d"
printf -- '- **TD-001** severity: minor | status: resolved → TASK-009 | created: Sprint-870 | closed: Sprint-880\n' >> "$d/TECH-DEBT.md"
assert_finding "s11-td-past-retention" "$d" "resolved-td-row-past-retention"

# Control: resolved LAST sprint. §11 delays deliberately -- a just-resolved debt is still context at
# the next promote -- so firing here would report a repository doing exactly the right thing.
d="$work/tddelete-ok"; mkdir -p "$d"; ledger_repo "$d"
printf -- '- **TD-001** severity: minor | status: resolved → TASK-009 | created: Sprint-870 | closed: Sprint-899\n' >> "$d/TECH-DEBT.md"
assert_absent "s11-td-past-retention-control-recent" "$d" "resolved-td-row-past-retention"

# Control: an OPEN row of any age. The trigger is `resolved`, not age alone.
d="$work/tddelete-ok2"; mkdir -p "$d"; ledger_repo "$d"
printf -- '- **TD-002** severity: major | status: open | created: Sprint-800\n' >> "$d/TECH-DEBT.md"
assert_absent "s11-td-past-retention-control-open" "$d" "resolved-td-row-past-retention"

# --- The threshold is READ, not written: move it in a scratch spec and the verdict follows -------
# This is the DoD's mechanism test, and it is the whole reason the delay is parsed out of §11 rather
# than typed into the checker. Same repository, same code -- only the spec changes.
d="$work/tddelete-spec"; mkdir -p "$d"; ledger_repo "$d"
printf -- '- **TD-001** severity: minor | status: resolved → TASK-009 | created: Sprint-870 | closed: Sprint-898\n' >> "$d/TECH-DEBT.md"
assert_absent "s11-td-threshold-read-baseline" "$d" "resolved-td-row-past-retention"
scratch_spec="$work/spec-loosened.md"
sed 's/`resolved` ≥ 3 sprints ⇒ the row is gone/`resolved` ≥ 2 sprints ⇒ the row is gone/' "$spec" > "$scratch_spec"
if cmp -s "$spec" "$scratch_spec"; then
  echo "FAIL fixture(s11-td-threshold-read): the scratch spec is byte-identical to the shipped one -- the seed did not land, so a green result below would prove nothing (L-137)"
  fail=1
else
  _o=$(sh "$engine" "$d" --spec "$scratch_spec" 2>&1)
  if printf '%s\n' "$_o" | grep -qF "resolved-td-row-past-retention"; then
    echo "PASS fixture(s11-td-threshold-read): lowering §11's delay to 2 in a SCRATCH SPEC made the same repository fire, with no code edit"
  else
    echo "FAIL fixture(s11-td-threshold-read): the delay is not being read from the spec -- the same repo did not change verdict when §11 did"
    fail=1
  fi
fi

# --- S11.TODOCAP: over §2's cap for TODO.md -----------------------------------------------------
# The cap is read from §2's ROOT-table row, whose cell says "320 soft (ADR-019)". Padding to a size
# that clears whatever that row says, rather than to a number written here (L-146: a fixture that
# restates a value the spec owns decays the moment the spec moves).
d="$work/todocap"; mkdir -p "$d"; ledger_repo "$d"
i=0; while [ "$i" -lt 400 ]; do printf 'padding line %s\n' "$i" >> "$d/TODO.md"; i=$((i + 1)); done
assert_finding "s11-todo-over-cap" "$d" "todo-over-cap-at-promote"

d="$work/todocap-ok"; mkdir -p "$d"; ledger_repo "$d"
assert_absent "s11-todo-over-cap-control" "$d" "todo-over-cap-at-promote"

# --- S11.BACKLOG: a shipped-in-SPRINT breadcrumb left in § Backlog -------------------------------
d="$work/backlog"; mkdir -p "$d"; ledger_repo "$d"
printf -- '- ~~TASK-002~~ --- shipped in SPRINT-880, kept here for reference\n' >> "$d/TODO.md"
assert_finding "s11-shipped-backlog-retained" "$d" "shipped-backlog-entry-retained"

# Control, and the load-bearing one: § Active Sprint names a sprint on EVERY healthy repo, and task
# bodies cite sprint ids constantly. An unanchored corpus grep would report both. ledger_repo already
# carries the pointer; this adds a task that cites a sprint in its own body.
d="$work/backlog-ok"; mkdir -p "$d"; ledger_repo "$d"
printf -- '      tracker:    SPRINT-870 --- the design this task implements was shipped there\n' >> "$d/TODO.md"
# ...and a § Changelog release note, which is where a shipped line legitimately lives. Without
# this line the control passes VACUOUSLY: every other candidate sits inside § Backlog already,
# so deleting the section scoping changes no verdict and the scoping goes untested. Caught by
# seeding exactly that break and watching the case stay GREEN -- a break that does not redden
# its case has tested nothing (L-142).
printf -- '
## Changelog (current sprint only)

- shipped TASK-002 in SPRINT-880 --- the release note, in its own section
' >> "$d/TODO.md"
assert_absent "s11-shipped-backlog-retained-control" "$d" "shipped-backlog-entry-retained"

# --- S11.LEARNINGS: a promoted entry still carrying its body, with no exception recorded ---------
learn_entry() {  # <dir> <heading-tail> [body-lines...]
  shift_dir=$1; shift
  printf '\n## L-002 [tags: tooling] [status: promoted]: %s\n' "$1" >> "$shift_dir/docs/LEARNINGS.md"
  shift
  for b in "$@"; do printf -- '%s\n' "$b" >> "$shift_dir/docs/LEARNINGS.md"; done
}

d="$work/learnings"; mkdir -p "$d"; ledger_repo "$d"
learn_entry "$d" '**A full record still sitting where a pointer belongs.** Several sentences of evidence that the durable rule is supposed to have replaced, kept verbatim.' '- count: 2' '- promoted: yes → CLAUDE.md § Anti-Patterns'
assert_finding "s11-promoted-not-collapsed" "$d" "promoted-learning-not-collapsed"

# Control (a): the heading IS the pointer -- the shorter of the two stored forms.
d="$work/learnings-ok-a"; mkdir -p "$d"; ledger_repo "$d"
printf '\n## L-002 [tags: tooling] [status: promoted]: → promoted: CLAUDE.md § Anti-Patterns\n- count: 2\n' >> "$d/docs/LEARNINGS.md"
assert_absent "s11-promoted-not-collapsed-control-form-a" "$d" "promoted-learning-not-collapsed"

# Control (b): a one-line gist in the heading with the pointer as the first body bullet. This is the
# form 39 conformant entries in THIS repository use, and the form the first draft of the check
# reported as a violation -- which is why it is retained rather than treated as a fixed bug (L-140).
d="$work/learnings-ok-b"; mkdir -p "$d"; ledger_repo "$d"
learn_entry "$d" 'a one-line gist of the durable rule.' '- **L-002 → promoted: `CLAUDE.md` § Anti-Patterns** --- the durable rule is the record now (§11 collapse).' '- count: 2'
assert_absent "s11-promoted-not-collapsed-control-form-b" "$d" "promoted-learning-not-collapsed"

# Control (c): uncollapsed ON PURPOSE, with §11's exception recorded. The markers are read out of the
# spec, so this control also pins that the clause and the checker still agree.
d="$work/learnings-ok-c"; mkdir -p "$d"; ledger_repo "$d"
learn_entry "$d" '**A full record deliberately held back.** The durable rule has not taken hold yet and the body is the evidence a later entry cites.' '- count: 3' '- promoted: yes → CLAUDE.md § Anti-Patterns' '- **§11 collapse deliberately NOT applied** --- ruled on the record. **Re-collapse when** the recurrence has a durable home.'
assert_absent "s11-promoted-not-collapsed-control-exception" "$d" "promoted-learning-not-collapsed"

# Control (d): an ACTIVE entry whose narrative quotes the promoted marker. This is the case that was
# actually wrong in the first draft -- L-114 in this repository is [status: active] and its body text
# contains the literal string the status test was grepping for, so an unanchored test reported it.
# Retained because a false positive here is a false negative about the contract (L-108 · L-140).
d="$work/learnings-ok-d"; mkdir -p "$d"; ledger_repo "$d"
printf '\n## L-003 [tags: process] [status: active]: **A long narrative that discusses promotion.** Entries reaching [status: promoted] are collapsed, and grepping for `promoted: yes` returns zero on a healthy corpus.\n- count: 1\n- promoted: no\n' >> "$d/docs/LEARNINGS.md"
assert_absent "s11-promoted-not-collapsed-control-prose" "$d" "promoted-learning-not-collapsed"

echo "=== §11 archival fixtures (SPRINT-080 T2) ==="

# archive_repo <dir> -- a git repo with one CLOSED sprint properly archived: Plan and log moved in
# ONE commit, an INDEX row, and a two-minor CHANGELOG with its link line. Conformant on all five
# findings, so each case below breaks exactly one thing (L-142).
archive_repo() {
  d=$1
  mkdir -p "$d/docs/sprint/logs" "$d/docs/sprint/archive/logs" "$d/docs/changelog"
  git -C "$d" init -q >/dev/null 2>&1
  sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
  printf '# Changelog\n\n> older → [docs/changelog/](docs/changelog/)\n\n## v2.1.0 --- current (2026-01-02)\n\n## v2.0.0 --- previous (2026-01-01)\n' > "$d/CHANGELOG.md"
  printf '# stale\n' > "$d/docs/changelog/CHANGELOG-1.9.0.md"
  commit_msg "$d" "sprint(900): plan locked"
  cc=$(git -C "$d" rev-parse HEAD)
  # close: record close_commit, then archive Plan AND log in one commit
  close_at "$d/docs/sprint/SPRINT-900-fixture.md" "$d"
  commit_msg "$d" "sprint(900): record close_commit"
  git -C "$d" mv docs/sprint/SPRINT-900-fixture.md docs/sprint/archive/SPRINT-900-fixture.md >/dev/null 2>&1
  git -C "$d" mv docs/sprint/logs/SPRINT-900-fixture.md docs/sprint/archive/logs/SPRINT-900-fixture.md >/dev/null 2>&1
  printf -- '---\nowner: M\nlast_updated: 2026-01-01\nstatus: current\nupdate_trigger: a sprint is archived\n---\n\n# Index\n\n- SPRINT-900 --- Fixture --- closed 2026-01-02 · %s\n' "$cc" > "$d/docs/sprint/INDEX.md"
  commit_msg "$d" "sprint(900): close --- archive the pair, index the row"
}

d="$work/arch-ok"; mkdir -p "$d"; archive_repo "$d"
assert_absent "s11-archive-control-not-archived"  "$d" "closed-sprint-not-archived"
assert_absent "s11-archive-control-index-row"     "$d" "sprint-index-row-missing"
assert_absent "s11-archive-control-logpair"       "$d" "sprint-log-archived-apart-from-plan"
assert_absent "s11-archive-control-changelog"     "$d" "changelog-not-rotated-at-minor"
assert_absent "s11-archive-control-whenitruns"    "$d" "retention-trigger-ran-in-wrong-phase"

# --- S11.SPRINT finding 1: a closed sprint still in the live directory --------------------------
d="$work/arch-live"; mkdir -p "$d"; archive_repo "$d"
git -C "$d" mv docs/sprint/archive/SPRINT-900-fixture.md docs/sprint/SPRINT-900-fixture.md >/dev/null 2>&1
commit_msg "$d" "put the closed sprint back in the live directory"
assert_finding "s11-closed-not-archived" "$d" "closed-sprint-not-archived"

# --- S11.SPRINT finding 2: archived, but no INDEX row. SEPARABLE from the first on purpose ------
# The two are different repairs -- one moves a file, one writes a line -- so this case leaves the
# archive intact and removes only the row, proving the findings do not share a trigger (L-058).
d="$work/arch-noindex"; mkdir -p "$d"; archive_repo "$d"
grep -v '^- SPRINT-900 ' "$d/docs/sprint/INDEX.md" > "$d/docs/sprint/INDEX.tmp" && mv "$d/docs/sprint/INDEX.tmp" "$d/docs/sprint/INDEX.md"
commit_msg "$d" "drop the index row, leave the archive alone"
assert_finding "s11-index-row-missing" "$d" "sprint-index-row-missing"
assert_absent  "s11-index-row-missing-separable" "$d" "closed-sprint-not-archived"

# --- S11.LOGPAIR (a): the Plan moved and the log did not. Tree-readable, the common shape ---------
d="$work/arch-strand"; mkdir -p "$d"; archive_repo "$d"
git -C "$d" mv docs/sprint/archive/logs/SPRINT-900-fixture.md docs/sprint/logs/SPRINT-900-fixture.md >/dev/null 2>&1
commit_msg "$d" "strand the log outside the archive"
assert_finding "s11-logpair-stranded" "$d" "sprint-log-archived-apart-from-plan"

# --- S11.LOGPAIR (b): both archived, but in DIFFERENT commits ------------------------------------
# Needs real history: two archives a week apart satisfy every tree-shaped test while still leaving a
# window where the Retro cites evidence that is not beside it.
d="$work/arch-split"; mkdir -p "$d"
mkdir -p "$d/docs/sprint/logs" "$d/docs/sprint/archive/logs" "$d/docs/changelog"
git -C "$d" init -q >/dev/null 2>&1
sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
printf '# Changelog\n\n> older → [docs/changelog/](docs/changelog/)\n\n## v2.1.0 --- current\n' > "$d/CHANGELOG.md"
commit_msg "$d" "sprint(900): plan locked"
close_at "$d/docs/sprint/SPRINT-900-fixture.md" "$d"
commit_msg "$d" "sprint(900): record close_commit"
git -C "$d" mv docs/sprint/SPRINT-900-fixture.md docs/sprint/archive/SPRINT-900-fixture.md >/dev/null 2>&1
printf -- '---\nowner: M\nlast_updated: 2026-01-01\nstatus: current\nupdate_trigger: a sprint is archived\n---\n\n# Index\n\n- SPRINT-900 --- Fixture --- closed 2026-01-02 · deadbee\n' > "$d/docs/sprint/INDEX.md"
commit_msg "$d" "sprint(900): archive the PLAN only --- the log stays live"
git -C "$d" mv docs/sprint/logs/SPRINT-900-fixture.md docs/sprint/archive/logs/SPRINT-900-fixture.md >/dev/null 2>&1
commit_msg "$d" "sprint(900): archive the log, a commit later"
assert_finding "s11-logpair-different-commits" "$d" "sprint-log-archived-apart-from-plan"

# Control: a sprint archived BEFORE the logs/ sibling existed has no pair to split. Without this
# guard the rule reported 24 correct closes in this repository, because their archived logs were
# written by ADR-014's one-time migration rather than by their own close (L-140: retain the case).
d="$work/arch-nolog-predate"; mkdir -p "$d"
mkdir -p "$d/docs/sprint/archive/logs" "$d/docs/changelog"
git -C "$d" init -q >/dev/null 2>&1
sprint_plan "$d" "" '- [ ] a thing'
printf '# Changelog\n\n> older → [docs/changelog/](docs/changelog/)\n\n## v2.1.0 --- current\n' > "$d/CHANGELOG.md"
commit_msg "$d" "sprint(900): plan locked --- no logs/ sibling exists yet"
close_at "$d/docs/sprint/SPRINT-900-fixture.md" "$d"
commit_msg "$d" "sprint(900): record close_commit"
git -C "$d" mv docs/sprint/SPRINT-900-fixture.md docs/sprint/archive/SPRINT-900-fixture.md >/dev/null 2>&1
printf -- '---\nowner: M\nlast_updated: 2026-01-01\nstatus: current\nupdate_trigger: a sprint is archived\n---\n\n# Index\n\n- SPRINT-900 --- Fixture --- closed 2026-01-02 · deadbee\n' > "$d/docs/sprint/INDEX.md"
commit_msg "$d" "sprint(900): archive the Plan --- there was never a separate log"
printf '# migrated later\n' > "$d/docs/sprint/archive/logs/SPRINT-900-fixture.md"
commit_msg "$d" "migration: backfill archived logs long after the fact"
assert_absent "s11-logpair-control-predates-logs-dir" "$d" "sprint-log-archived-apart-from-plan"

# --- S11.CHANGELOG, invariant one: more than current + previous held inline ----------------------
# Three MINOR series, not three blocks: §11's unit is the minor, and a repo shipping three patches
# inside one minor is conformant. Counting blocks would fail it.
d="$work/arch-cl3"; mkdir -p "$d"; archive_repo "$d"
printf '\n## v1.9.0 --- far too old to still be here (2025-01-01)\n' >> "$d/CHANGELOG.md"
commit_msg "$d" "leave a third minor inline"
assert_finding "s11-changelog-three-minors" "$d" "changelog-not-rotated-at-minor"

# Control: three BLOCKS inside two minors is conformant, and this is the boundary that separates
# "counts minors" from "counts headings".
d="$work/arch-cl-patches"; mkdir -p "$d"; archive_repo "$d"
printf '\n## v2.1.1 --- a patch in the current minor (2026-01-03)\n' >> "$d/CHANGELOG.md"
commit_msg "$d" "add a patch release inside the current minor"
assert_absent "s11-changelog-control-patches-in-minor" "$d" "changelog-not-rotated-at-minor"

# --- S11.CHANGELOG, invariant two: rotated files with no link line ------------------------------
# The half this repository was actually failing when the rule was first run against it: 38 rotated
# files and no pointer from the only file a reader opens.
d="$work/arch-cl-nolink"; mkdir -p "$d"; archive_repo "$d"
grep -v 'docs/changelog/' "$d/CHANGELOG.md" > "$d/CHANGELOG.tmp" && mv "$d/CHANGELOG.tmp" "$d/CHANGELOG.md"
commit_msg "$d" "remove the link line, keep the rotated files"
assert_finding "s11-changelog-no-link-line" "$d" "changelog-not-rotated-at-minor"

# Control: no rotation has happened yet, so no link line is owed. Without this the rule would fire on
# every young repository, which is a finding about age rather than about conformance.
d="$work/arch-cl-norot"; mkdir -p "$d"; archive_repo "$d"
rm -f "$d/docs/changelog/CHANGELOG-1.9.0.md"
grep -v 'docs/changelog/' "$d/CHANGELOG.md" > "$d/CHANGELOG.tmp" && mv "$d/CHANGELOG.tmp" "$d/CHANGELOG.md"
commit_msg "$d" "nothing rotated yet"
assert_absent "s11-changelog-control-nothing-rotated" "$d" "changelog-not-rotated-at-minor"

# --- S11.WHENITRUNS: archived BEFORE its own close --------------------------------------------
# The phase question, and the only close-time trigger with an unambiguous mechanical boundary. Here
# the archive commit does not descend from close_commit, so the Plan left the live directory while
# the sprint was still open.
d="$work/arch-phase"; mkdir -p "$d"
mkdir -p "$d/docs/sprint/logs" "$d/docs/sprint/archive/logs" "$d/docs/changelog"
git -C "$d" init -q >/dev/null 2>&1
sprint_plan "$d" "" '- [ ] a thing'; sprint_log "$d"
printf '# Changelog\n\n> older → [docs/changelog/](docs/changelog/)\n\n## v2.1.0 --- current\n' > "$d/CHANGELOG.md"
commit_msg "$d" "sprint(900): plan locked"
git -C "$d" mv docs/sprint/SPRINT-900-fixture.md docs/sprint/archive/SPRINT-900-fixture.md >/dev/null 2>&1
git -C "$d" mv docs/sprint/logs/SPRINT-900-fixture.md docs/sprint/archive/logs/SPRINT-900-fixture.md >/dev/null 2>&1
printf -- '---\nowner: M\nlast_updated: 2026-01-01\nstatus: current\nupdate_trigger: a sprint is archived\n---\n\n# Index\n\n- SPRINT-900 --- Fixture --- closed 2026-01-02 · deadbee\n' > "$d/docs/sprint/INDEX.md"
commit_msg "$d" "archive the sprint EARLY, while it is still open"
ec=$(git -C "$d" rev-parse HEAD)
printf '\n# a later, unrelated commit\n' >> "$d/CHANGELOG.md"
commit_msg "$d" "sprint(900): close --- recorded AFTER the archive already happened"
close_at "$d/docs/sprint/archive/SPRINT-900-fixture.md" "$d"
commit_msg "$d" "sprint(900): record close_commit, later than the archive"
assert_finding "s11-retention-wrong-phase" "$d" "retention-trigger-ran-in-wrong-phase"

# The DoD's load-bearing distinction: DID NOT RUN is a different state, and only one of the two is
# this finding. A closed sprint never archived must report closed-sprint-not-archived (S11.SPRINT)
# and must NOT report a wrong phase -- the repairs differ ("do it" vs "you did it at the wrong
# moment"), and a check conflating them emits a finding nobody can act on.
d="$work/arch-notrun"; mkdir -p "$d"; archive_repo "$d"
git -C "$d" mv docs/sprint/archive/SPRINT-900-fixture.md docs/sprint/SPRINT-900-fixture.md >/dev/null 2>&1
git -C "$d" mv docs/sprint/archive/logs/SPRINT-900-fixture.md docs/sprint/logs/SPRINT-900-fixture.md >/dev/null 2>&1
commit_msg "$d" "the close never archived anything"
assert_finding "s11-notrun-is-not-wrong-phase-a" "$d" "closed-sprint-not-archived"
assert_absent  "s11-notrun-is-not-wrong-phase-b" "$d" "retention-trigger-ran-in-wrong-phase"
echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "SPRINT-FAMILY FIXTURES: all green"
else
  echo "SPRINT-FAMILY FIXTURES: FAILURES ABOVE"
fi
exit $fail
