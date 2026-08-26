#!/usr/bin/env sh
# check-layers-observed.sh -- derives a third, OBSERVED touched-file set for the declaration
# cross-check: the actual git diff since a sprint's recorded plan commit, diffed against the union
# of every task block's declared `Layers:` (TD-022, L-074, SPRINT-043 T1).
#
# check-layers-completeness.sh (qa-check.sh leg 14) derives its second source from DoD/Acceptance
# prose -- text an author wrote at promote time. SPRINT-042 T3 shipped that checker and, in the same
# task, created scripts/lib/check-layers-completeness.sh -- a file its own DoD prose never named,
# because a DoD written at promote cannot name a file invented during implementation (TD-022, the
# fix carrying a residual of TD-020's own shape). Two documents written by one author at one moment
# are one source in two places (L-074): a second source drawn from authored text closes the
# *forgetting* gap, not the *inventing* gap. Only an OBSERVED source -- what a git diff says actually
# changed -- closes both, because it reads history rather than intent and cannot be forgotten the
# way a second sentence can.
#
# Comparison base: the sprint file's own frontmatter `plan_commit:` (set by a commit that lands
# AFTER the plan-locked commit it names -- see docs/sprint/SPRINT-043-proof-run.md's own history),
# diffed against the current state: tracked changes (staged + unstaged) PLUS untracked new files, so
# a file created during implementation and never `git add`ed is still caught. "Changed this sprint"
# therefore needs no second source of truth beyond the plan commit itself.
#
# Coordinator close-bookkeeping files are excluded from "undeclared" -- see is_excluded() below,
# which states the reason inline per file rather than hiding a silent skip list (CLAUDE.md
# Anti-Patterns: "a silent exclusion list is how the observed source drifts back toward being an
# authored one").
#
# Usage: sh check-layers-observed.sh <sprint-plan.md> [<sprint-plan.md> ...]
# Only files whose frontmatter `status:` is `active` are checked; a non-active file is silently
# skipped (not a FAIL) -- same convention as check-layers-completeness.sh. A missing file or a
# `plan_commit:` that doesn't resolve to a commit is its own named FAIL, never a silent skip --
# those are input the checker cannot proceed without.
#
# plan_commit: has THREE distinguishable states, not two (TD-026, SPRINT-045 T2). The repo's
# two-commit sprint convention (see lock_plan() in evals/run-layers-observed-fixtures.sh) always
# lands "plan locked" before the follow-up commit that patches the sprint file's own `plan_commit:`
# field -- so a window always exists where the field still holds its promote-time placeholder
# (`[sha -- set at promote]` or similar). That is a known-good, expected transient state, not a
# defect, and reporting it as a FAIL is a guaranteed false alarm baked into the convention itself --
# exactly the kind of cry-wolf a checker earns by naming its finding, then loses credibility by
# firing on a state that always exists. So:
#   - field genuinely empty (frontmatter never carried the key, or carried it with no value) --
#     FAIL by name. This is real missing input the checker cannot proceed without.
#   - field holds the bracketed placeholder literal (non-empty, contains `[`) -- named SKIP, never
#     a bare `skip` and never a FAIL. Real commit shas are bare hex and never contain `[`, so
#     emptiness-vs-bracketed-non-empty is a clean, reliable split between "never filled in" and
#     "known placeholder, not yet promoted" -- no case has been found where the two are ambiguous.
#   - field holds a non-empty, non-bracketed value that still doesn't resolve to a real commit --
#     FAIL by name (existing `git rev-parse` guard below), unchanged.
# Prints one PASS/FAIL/SKIP line per sprint file checked; exits 1 if any FAIL line was printed, 0
# otherwise (a SKIP never flips the exit code). Dependency-free POSIX sh -- no jq, no bashisms. Must
# run inside a git work tree.
set -u

fmv() { awk -v k="$2" 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} $0~"^"k":"{sub("^"k":[ ]*","");print;exit}' "$1"; }

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
skip() { printf 'SKIP  %s\n' "$1"; }   # never flips $fail -- a SKIP is not a FAIL (TD-026)
note() { printf '      %s\n' "$1"; }

# A bare invocation (no sprint files) previously fell straight into `for sp in "$@"` over an empty
# list: zero output, exit 0 -- reading as a silent pass rather than "nothing was checked" (TD-056,
# one of exactly two check-*.sh sharing this shape). Cure matches check-gates-signed.sh's note-line.
[ "$#" -gt 0 ] || { note "layers observed: no sprint files given -- nothing verified"; exit 0; }

# --- attribution: who changed this path (SPRINT-049 T1, TD-031 · TD-035) ------------------------
# The check used to ask "did SOME task declare this file?" against one union of every task's
# Layers:. That question is wrong in both directions. It is too weak -- a file declared by ANY task
# satisfies the check for ALL tasks, so a task editing a file it never declared passes silently
# provided some sibling declared it (TD-035, observed in SPRINT-048 T6, and precisely the shape that
# corrupted SPRINT-041's merge). And it is too blunt -- every class of legitimate non-task change
# arrives as a false positive and gets answered with another exclusion entry, one per sprint for four
# sprints (TD-031).
#
# Both dissolve once the real question is asked: WHO changed it. A commit is attributed to a task by,
# in order:
#   1. a `Task: T<n>` git trailer                     -- the convention going forward, unambiguous
#   2. subject `sprint(NN) T<n>: ...`                 -- sequential inline execution (SPRINT-047/048)
#   3. subject `merge(...): T<n> ...`                 -- coordinator merge-back of an agent branch
#   4. subject `... (SPRINT-NNN T<n>)`                -- trailing parenthetical (SPRINT-042/046)
#   5. subject `sprint(NN): ...` with no task id      -- COORDINATOR bookkeeping, exempt by role
#   6. anything else                                  -- UNATTRIBUTED, its own named FAIL
#
# Rule 6 is the load-bearing one. Five real task commits across the sprints surveyed carry no id at
# all (`c87e9e2` `29ae7cb` `aeadc78` `c94a8c0` `ba393a3`), reachable only through the merge-back
# commit that absorbed them. Defaulting those to "coordinator" would pass their files silently --
# rebuilding TD-035's false negative one layer down. So an unattributable commit is reported, never
# absorbed: the author adds a trailer or uses the naming convention.
#
# Merge commits contribute no files here (`git diff-tree` on a merge lists none). That is correct
# rather than a gap: the underlying commits are in the same range and are attributed individually.
# A commit whose ENTIRE file set is governance bookkeeping belongs to no sprint task -- backlog
# grooming, epic authoring, debt filing, research. Before this, such a commit landing while a sprint
# was active reported as `attributable to no task`: correct by the letter, useless in practice, and
# it fires exactly when parallel work makes the gate most worth reading. Governance normally lands
# BETWEEN sprints, outside any plan_commit..HEAD window, which is why this went unseen until two
# workstreams overlapped.
#
# Detected by CONTENT, never by subject prefix: this repo carries 15+ prefixes and `plan(` covers 6
# of 895 commits, while feat/fix/docs/chore are ordinary work that must stay attributed -- and a
# message-based rule would be gameable by writing a different subject.
#
# ALL-OR-NOTHING is the safety property, and the retained fixture pair exists to hold it: one code
# file anywhere in the commit keeps the WHOLE commit attributed, so a src/ edit cannot ride along
# beside a TODO.md tweak. Note the arms below fall through (`;;`) rather than returning early --
# returning on the first governance file would silently make this ANY-of instead of ALL-of, which is
# the mutation `governance leg B` is built to redden.
#
# Deliberately narrower than is_excluded_closetime, which excludes these PATHS outright at close:
# here the path is never excluded, only a commit that touches nothing else (TD-044, in reverse). An
# empty commit is NOT governance (_any stays 0), so it still falls through to UNATTRIBUTED.
is_governance_commit() {   # <sha> -> 0 if EVERY changed file is a governance artifact
  _any=0
  for _gf in $(git diff-tree --no-commit-id --name-only -r "$1" 2>/dev/null); do
    _any=1
    case "$_gf" in
      TODO.md|TECH-DEBT.md|CHANGELOG.md|docs/LEARNINGS.md) ;;
      # GENERATED, and listed here for the same reason it is already excluded twice below (see
      # is_excluded_committed and is_excluded): it is regenerated whenever ANY metadata-carrying doc
      # changes, so it rides along with essentially every real governance commit -- LEARNINGS routing
      # at close, ADR writes, research. Omitting it made the classifier miss the very commits it
      # exists to catch: 7fb32ca (docs/LEARNINGS.md + docs/knowledge-index.md) was reported as
      # `attributable to no task` on a live run. A derived view is not a coordination concern, which
      # is the same argument the two exclusions below already make.
      docs/knowledge-index.md) ;;
      # ASSUMPTION, stated because it is load-bearing and unenforced: both trees are doc-only by
      # convention -- every file under them is `.md` today except docs/research/storm/report-
      # template.html. The prefix is safe only while that holds. If an executable or a checker ever
      # lands under either tree, a real code change could ride along beside it in one commit and be
      # exempted. Narrow these arms (or add a guard) at that point, not before -- tightening now
      # would only add noise, and noise is what this change exists to remove.
      docs/epic/*|docs/research/*) ;;
      *) return 1 ;;
    esac
  done
  [ "$_any" = 1 ]
}

# Which SPRINT a commit belongs to, read from its subject. Mirrors attribute()'s patterns but keeps
# the sprint number rather than the task token. Returns "" when the subject names no sprint.
#
# This is the axis stream scoping must use. An earlier attempt scoped by PATH -- skipping anything a
# sibling sprint's Layers: declared -- and an independent review produced three cases where that
# silently swallowed real defects: a commit by THIS sprint's own task touching a sibling-declared
# path never reached the per-task check; a sibling declaring a directory token (`scripts/`) swallowed
# every undeclared file beneath it; and the same on the WIP leg. Ownership cannot do any of that,
# because it never consults a path: a commit saying `sprint(920)` is sprint 920's work no matter
# which files it touches.
commit_sprint() {   # <sha> -> "<NNN>" | ""
  _cs=$(git log -1 --format='%s' "$1" 2>/dev/null)
  # ANCHORED PATTERNS ONLY -- deliberately narrower than attribute()'s set, which also accepts an
  # unanchored `.*(SPRINT-NNN Tn).*`. That third form is safe for finding a TASK but catastrophic for
  # deciding OWNERSHIP, because it matches PROSE: a commit whose subject merely mentions another
  # sprint ("port the fix already applied over there (SPRINT-921 T2)") was read as belonging to 921,
  # skipped from 920's check entirely, and its real undeclared file surfaced against the WRONG sprint
  # under a task number that does not exist. Verified as a live defect on this branch before the fix.
  # This is L-108's family -- a guard matched by substring rather than by shape, failing GREEN.
  #
  # Consequence of narrowing, and it is the correct direction: a commit using only the parenthetical
  # form is never skipped, so it stays attributed and may over-report. Noise is visible; a swallow is
  # not.
  printf '%s' "$_cs" | sed -n \
    -e 's/^sprint(\([0-9]\{1,\}\)).*/\1/p' \
    -e 's/^merge(\([0-9]\{1,\}\)).*/\1/p' | head -n1
}

attribute() {   # <sha> -> "T<n>" | "COORD" | "GOVERNANCE" | "UNATTRIBUTED"
  a_t=$(git log -1 --format='%(trailers:key=Task,valueonly)' "$1" 2>/dev/null | tr -d ' \r\n')
  case "$a_t" in T[0-9]*) printf '%s' "$a_t"; return ;; esac
  a_s=$(git log -1 --format='%s' "$1" 2>/dev/null)
  a_m=$(printf '%s' "$a_s" | sed -n \
        -e 's/^sprint([0-9]\{1,\})[ ]\{1,\}\(T[0-9]\{1,\}\):.*/\1/p' \
        -e 's/^merge([^)]*):[ ]*\(T[0-9]\{1,\}\)[^0-9].*/\1/p' \
        -e 's/.*(SPRINT-[0-9]\{1,\}[ ]\{1,\}\(T[0-9]\{1,\}\)).*/\1/p' | head -n1)
  [ -n "$a_m" ] && { printf '%s' "$a_m"; return; }
  printf '%s' "$a_s" | grep -qE '^sprint\([0-9]+\):' && { printf 'COORD'; return; }
  # Consulted LAST, deliberately: a `sprint(NNN) T1:` commit that happens to touch only TODO.md is
  # still T1's work and must stay attributed to T1. Only a commit no task claims reaches here.
  is_governance_commit "$1" && { printf 'GOVERNANCE'; return; }
  printf 'UNATTRIBUTED'
}

# Per-task declarations: emits one "T<n> <path>" line per declared token, so a task's Layers: can be
# tested on its own instead of being melted into a union. Reads indented continuation lines, matching
# check-layers-completeness.sh (SPRINT-049 T3) -- both checkers read the same declaration, so a
# parsing rule that differed between them would make one of the two lie.
task_decls() {   # <plan-text> -> lines "T<n> <path>"
  printf '%s\n' "$1" | awk '
      /^### T[0-9]+/ { if (match($0, /T[0-9]+/)) cur=substr($0,RSTART,RLENGTH); inl=0; next }
      /^Layers:/ { inl=1; l=$0; sub(/^Layers:[ \t]*/,"",l); print cur "\t" l; next }
      inl && /^[ \t]+[^ \t]/ { l=$0; sub(/^[ \t]+/,"",l); print cur "\t" l; next }
      { inl=0 }
    ' | while IFS=$(printf '\t') read -r t rest; do
        [ -n "$t" ] || continue
        printf '%s' "$rest" | grep -oE '`[^`]+`' | tr -d '`' | while read -r tok; do
          [ -n "$tok" ] && printf '%s %s\n' "$t" "$tok"
        done
      done
}

# Structural exclusions for the ATTRIBUTED (committed) path -- what attribution genuinely cannot
# cover, because a TASK commit legitimately touches these by convention. Everything the old list
# carried for coordinator-role reasons (TECH-DEBT.md · TODO.md · CHANGELOG.md · LEARNINGS.md ·
# settings · plugin manifests) is gone: attribution answers those directly via COORD, which is the
# whole point of TD-031's redesign. What survives, re-justified individually:
is_excluded_committed() {
  case "$1" in
    docs/sprint/*) return 0 ;;                  # the Plan's own DoD ticks and its Execution Log are
                                                # appended INSIDE task commits by convention, so a
                                                # task commit always touches them; declaring the file
                                                # a task is writing its progress into is circular.
    docs/knowledge-index.md) return 0 ;;        # GENERATED, never hand-authored; regenerated whenever
                                                # any metadata-carrying doc changes. Derived views are
                                                # not a coordination concern -- a textual conflict is
                                                # resolved by re-running the generator, not by owner.
    .claude/worktrees/agent-*) return 0 ;;      # created by the dispatch protocol at fan-out, AFTER
                                                # the Plan freezes: undeclarable by construction.
    *) return 1 ;;
  esac
}

# Coordinator close-bookkeeping: files a sprint's own tasks never declare in Layers: because they
# are edited at close by convention/decision (D1/D3 across SPRINT-042/SPRINT-043), never by a task.
# Excluded WITH this stated reason, never silently -- the list stays auditable in this file.
#
# This list still applies to UNCOMMITTED work (see the two-path split below). Attribution needs a
# commit to read; while the coordinator is mid-close with TECH-DEBT.md, TODO.md and CHANGELOG.md
# edited but not yet committed, there is nothing to attribute them to, and the gate runs in exactly
# that state. So the list shrinks on the committed path and stays whole on the WIP path.
# --- the phase split (TD-044, SPRINT-056 T3) -----------------------------------------------------
# The reasons on this list were never all the same KIND, and that is what let a real edit through.
# Read them: "backlog bookkeeping, written at close", "TD marking moved to close", "release
# bookkeeping, written at close" are statements about a PHASE. "GENERATED, never hand-authored",
# "undeclarable by construction", "created AFTER the Plan freezes" are statements about STRUCTURE.
# The list was implemented uniformly -- keyed on the file -- so a close-time reason silently held
# during execution too. A task whose actual work IS editing TODO.md therefore passed its whole run
# unreported, and the finding surfaced during a LATER task, attributed to one already finished and
# pushed (SPRINT-055 T6/T7). By then the only remedies are amending closed history or correcting a
# frozen Plan.
#
# So the close-time rows now apply ONLY at close, detected as "the sprint has zero open DoD" -- state
# this checker already reads. Note what is NOT being inferred: TD-037 warns against guessing WHICH
# task is in flight, and this guesses nothing of the kind. It reads a phase, and the phase is a fact
# on the page. The committed path (is_excluded_committed) is untouched: its stricter list is
# deliberate, documented, and answers attribution by role (TD-031/TD-035/TD-037 lineage).
#
# Direction of the change is widening, not narrowing -- more edits get reported, never fewer. The
# sibling checker states it fails toward over-reporting by design, and a false positive costs a
# glance while the false negative here cost a correction to pushed history.
is_excluded_closetime() {
  case "$1" in
    TECH-DEBT.md) return 0 ;;                   # TD marking moved to close (D1)
    TODO.md) return 0 ;;                        # backlog bookkeeping, written at close
    CHANGELOG.md) return 0 ;;                   # release bookkeeping, written at close
    docs/changelog/*) return 0 ;;               # the SAME bookkeeping, one file over: at a new MINOR
                                                # §11 rotates the older blocks verbatim into
                                                # docs/changelog/CHANGELOG-<version>.md, same actor and
                                                # same commit as the CHANGELOG.md row above. The row
                                                # was never added when the rotation convention shipped,
                                                # so every MINOR close since has gone red on its own
                                                # bookkeeping -- found at SPRINT-068's close, and
                                                # SPRINT-067's CHANGELOG-1.39.0.md tripped the same leg
                                                # unnoticed (L-020: the convention shipped, its
                                                # exclusion row did not). CLOSE-TIME ONLY, same
                                                # reasoning as README.md below: a task that genuinely
                                                # edits a rotated file is doing task work and stays
                                                # reported.
    docs/LEARNINGS.md) return 0 ;;              # retro bucket routing, written at close
    README.md) return 0 ;;                      # footer version line, bumped with the manifests at
                                                # close. CLOSE-TIME ONLY, deliberately: README is a
                                                # large file and the only thing close touches in it is
                                                # `v<X.Y.Z>` in the footer, so a general exclusion
                                                # would silence every real README edit during
                                                # execution -- the over-broad-reason failure TD-044
                                                # was filed about, in the opposite direction.
    *) return 1 ;;
  esac
}

# $1 = path, $2 = 1 when the sprint is at close (zero open DoD), 0 otherwise.
is_excluded() {
  [ "${2:-0}" = 1 ] && is_excluded_closetime "$1" && return 0
  case "$1" in
    docs/sprint/*) return 0 ;;                 # sprint file + archive/ + INDEX.md: coordinator-owned (D3)
    .claude/settings.json|.claude/settings.local.json) return 0 ;;
                                                # PRE-FLIGHT bookkeeping: the unattended allowlist is
                                                # derived and written AFTER the Plan freezes, so no task
                                                # can declare it — undeclarable by construction, not by
                                                # omission. Same category as the close-time rows above.
    docs/knowledge-index.md) return 0 ;;        # GENERATED, never hand-authored: regenerated whenever
                                                # any metadata-carrying doc (LEARNINGS/ADR/research)
                                                # changes, so declaring it would mean naming it in every
                                                # task that touches one. Its sources are already excluded
                                                # or declared; a derived view is not a coordination
                                                # concern, which is what Layers: exists to manage.
    .claude-plugin/plugin.json) return 0 ;;     # version bump, owned by release-patch
    .claude-plugin/marketplace.json) return 0 ;; # lockstep with plugin.json, same owner
    .codex-plugin/plugin.json) return 0 ;;      # same: a lockstep manifest, bumped by the same actor
    .kimi-plugin/plugin.json) return 0 ;;       # same. Added SPRINT-061: the repo grew from two
                                                # manifests to four, check-manifest-lockstep.sh was
                                                # taught all four, and THIS list was not -- so a
                                                # correct MINOR bump failed attribution (L-020,
                                                # shipping != wiring). If a fifth manifest appears,
                                                # it belongs here in the same commit.
    .claude/worktrees/agent-*) return 0 ;;      # worktree dispatch protocol: agent worktrees are
                                                # created INSIDE the repo, by the dispatch protocol
                                                # itself, at fan-out time -- AFTER the Plan freezes. No
                                                # task can declare a path that doesn't exist yet when
                                                # Layers: is written. Undeclarable by construction, not
                                                # by omission -- same category as the settings.json rows
                                                # above (TD-030).
    *) return 1 ;;
  esac
}

for sp in "$@"; do
  [ -f "$sp" ] || { bad "layers observed: file not found: $sp"; continue; }
  # Scoped by LOCATION, not by `status:` -- see the same note in check-layers-completeness.sh
  # (SPRINT-056 T4, TD-042). A closed sprint leaves docs/sprint/ in §11's retention commit, which is
  # separate from and later than the close commit, so the close commit itself stays covered.
  case "$sp" in */archive/*) continue ;; esac

  plan_commit=$(fmv "$sp" plan_commit)
  case "$plan_commit" in
    '')
      bad "$sp layers observed: plan_commit not recorded in frontmatter"
      continue
      ;;
    *'['*)
      skip "$sp layers observed: plan_commit still holds the promote-time placeholder ($plan_commit) -- not recorded yet, skipping until the follow-up commit patches it in (TD-026)"
      continue
      ;;
  esac
  if ! git rev-parse --verify -q "${plan_commit}^{commit}" >/dev/null 2>&1; then
    bad "$sp layers observed: plan_commit '$plan_commit' does not resolve to a commit"
    continue
  fi

  # Union of every task block's declared Layers: tokens (backtick-quoted paths), single-line
  # space-separated so a `case " $layers_all " in *" $f "*)` word match works below.
  #
  # A declaration continues onto INDENTED following lines (SPRINT-049 T3). Reading only `^Layers:`
  # silently kept the first line of a wrapped declaration and treated every path after it as
  # undeclared -- the same truncation defect as in check-layers-completeness.sh, which is where the
  # rule and its must-FAIL fixtures live. Kept in sync deliberately: both checkers read the same
  # declaration, so a parsing rule that differs between them would make one of the two lie.
  plan=$(awk '/^## Plan/{f=1;next} /^## /{f=0} f' "$sp")
  layers_all=$(printf '%s\n' "$plan" | awk '
      /^Layers:/ { inl=1; print; next }
      inl && /^[ \t]+[^ \t]/ { print; next }
      { inl=0 }
    ' | grep -oE '`[^`]+`' | tr -d '`' | tr '\n' ' ')

  # Per-task declarations as "T<n> <path>" lines -- the union is only kept for the WIP path below,
  # where no attribution is possible.
  decls=$(task_decls "$plan")

  # ---- STREAM SCOPING by OWNERSHIP (TASK-299). The sprint NUMBERS of the other active sprints in
  # this same invocation. A commit naming one of them is that stream's work and is not this sprint's
  # undeclared change; a commit naming a CLOSED sprint's number is not a sibling and stays attributed.
  # Deliberately NOT applied to the WIP leg below: uncommitted work carries no attribution, so there
  # is no honest way to tell which stream made it, and reporting it is the correct behaviour.
  # Compared by NUMBER, not by path. Two sprint files declaring the same `sprint:` -- a copy-paste
  # template error at promote, or the same file passed twice under different path spellings -- would
  # otherwise make a sprint its OWN sibling, and every one of its own `sprint(NNN) Tn:` commits would
  # be skipped. That is a total guard bypass, not a narrow miss, and it was verified live before this
  # guard existed: both sprint files reported PASS while a real undeclared file sat in the tree.
  # Skipping the path check alone is NOT enough, which is why the number is what gets compared.
  my_sprint=$(fmv "$sp" sprint)
  sibling_sprints=""
  for _osp in "$@"; do
    [ "$_osp" = "$sp" ] && continue
    [ -f "$_osp" ] || continue
    case "$_osp" in */archive/*) continue ;; esac
    _on=$(fmv "$_osp" sprint)
    [ -n "$_on" ] || continue
    [ "$_on" = "$my_sprint" ] && continue
    sibling_sprints="$sibling_sprints $_on"
  done

  # A declared token ending in "/" is a DIRECTORY prefix covering every path beneath it (SPRINT-055
  # T1). Before that, such a token was accepted and matched nothing, so it read as a declaration
  # while guarding zero files -- exactly the silent false-negative L-058 is about; T1's own 24-file
  # fixture tree is what surfaced it. Mirrored verbatim in check-layers-completeness.sh.
  #
  # BOUNDARY, deliberate: the dispatch preflight extracts only dot-bearing tokens from Layers:, so a
  # directory token is invisible to its shared-file overlap check. Declare a directory only for a
  # tree ONE task owns; any path two tasks could both touch must still be named in full.
  covers() { # <space-separated declared tokens> <path>
    _toks=$1; _f=$2
    case " $_toks " in *" $_f "*) return 0 ;; esac
    for _t in $_toks; do
      case "$_t" in
        */) case "$_f" in "$_t"*) return 0 ;; esac ;;
      esac
    done
    return 1
  }

  # ---- path 1: COMMITTED changes -- attributed, checked PER TASK -----------------------------
  miss_attr=""; unattr=""
  for c in $(git rev-list "$plan_commit..HEAD" 2>/dev/null); do
    # Skipped WHOLE, per commit -- never per file. A per-file test is what let the path-based design
    # leak: the unit of ownership is the commit, so the unit of exclusion must be too.
    c_sprint=$(commit_sprint "$c")
    if [ -n "$c_sprint" ]; then
      case " $sibling_sprints " in *" $c_sprint "*) continue ;; esac
    fi
    who=$(attribute "$c")
    for f in $(git diff-tree --no-commit-id --name-only -r "$c" 2>/dev/null); do
      is_excluded_committed "$f" && continue
      case "$who" in
        COORD|GOVERNANCE) ;;
        UNATTRIBUTED) unattr="$unattr $(git rev-parse --short "$c" 2>/dev/null):$f" ;;
        *) who_toks=$(printf '%s\n' "$decls" | awk -v w="$who" '$1==w{print $2}' | tr '\n' ' ')
           covers "$who_toks" "$f" || miss_attr="$miss_attr $who:$f" ;;
      esac
    done
  done

  # ---- path 2: UNCOMMITTED work in progress -- unattributable, checked against the union ------
  # Attribution needs a commit. While a task is mid-flight its edits belong to no commit yet, so the
  # union is the only bound available and this leg behaves exactly as the check always did. Stated
  # rather than hidden: the per-task strictness that closes TD-035 applies to committed history --
  # which is the collision-relevant set, since worktree agents commit before merge-back and the
  # coordinator's post-merge gate run sees everything committed.
  tracked=$(git diff --name-only HEAD -- . 2>/dev/null)
  untracked=$(git ls-files --others --exclude-standard -- . 2>/dev/null)
  wip=$(printf '%s\n%s\n' "$tracked" "$untracked" | grep -v '^$' | sort -u)

  # Zero open DoD in the Plan == the sprint is at close, which is when the close-bookkeeping
  # exclusions are true. During execution they are not, and a file on that list being edited is task
  # work that has to be declared like any other.
  at_close=0
  [ "$(awk '/^## Plan/{f=1;next} /^## /{f=0} f && /^- \[ \]/{n++} END{print n+0}' "$sp")" -eq 0 ] && at_close=1

  # n_wip counts what this leg ACTUALLY union-checked -- i.e. after exclusions, not the raw dirty
  # list. The difference is the whole meaning of the SKIP below: a tree whose only uncommitted files
  # are excluded ones (an agent worktree, close-time bookkeeping) had no weaker rule applied to
  # anything, so it earns a plain PASS. Counting the raw list instead would fire the caveat on almost
  # every tree, and a caveat that always fires is read as furniture and stops being read at all.
  miss=""
  n_wip=0
  for f in $wip; do
    is_excluded "$f" "$at_close" && continue
    n_wip=$((n_wip + 1))
    covers "$layers_all" "$f" || miss="$miss $f"
  done

  hit=0
  if [ -n "$unattr" ]; then
    bad "$sp layers observed: commit attributable to no task and not coordinator bookkeeping:$unattr"
    hit=1
  fi
  if [ -n "$miss_attr" ]; then
    bad "$sp layers observed: changed by a task that never declared it:$miss_attr"
    hit=1
  fi
  if [ -n "$miss" ]; then
    bad "$sp layers observed: changed but undeclared in any task's Layers::$miss"
    hit=1
  fi
  # ---- the verdict, and why the WIP leg no longer gets to say PASS (SPRINT-074 T3, TD-037) --------
  # The two legs above apply DIFFERENT rules: committed history is attributed per task, uncommitted
  # work is only bounded by the all-task union, because attribution needs a commit to read. Until
  # now both fed one `ok`, so a coordinator running the gate mid-flight read a PASS that the very
  # same tree would FAIL once committed -- the strictness change was invisible at exactly the moment
  # someone was deciding whether to commit.
  #
  # The cure is NOT to make the legs agree; it is to stop them disagreeing SILENTLY. Two candidates
  # were priced and rejected at the gate: attributing by staged-vs-unstaged infers intent rather than
  # deriving it, and breaks precisely where it is needed -- L-042 prescribes `git add -p` for a
  # shared file, so the staged set spans tasks by design in the only case attribution matters for;
  # and documenting the boundary in this header alone leaves the output a bare PASS, which is the
  # thing a coordinator actually reads. Inferring the in-flight task from open-DoD state stays
  # forbidden by TD-037's standing warning and was not on the table.
  #
  # Note what is NOT weakened: `miss` (declared by no task at all) still FAILs from the WIP leg. Only
  # the all-clear is renamed, because only the all-clear was overstating itself.
  if [ "$hit" -eq 0 ]; then
    if [ "$n_wip" -gt 0 ]; then
      skip "$sp layers observed [WIP, unattributed] -- committed history since $plan_commit IS attributed per task; $n_wip uncommitted file(s) are not"
      note "  the uncommitted files were checked against the ALL-TASK UNION only. Per-task attribution needs a commit, so the committed run applies a stricter rule and may FAIL where this leg does not -- commit, then re-run, before reading this as clear"
      note "  still enforced here: a file declared by NO task is reported from this leg as a FAIL, exactly as before"
    else
      ok "$sp layers observed (all changed files declared and attributed, base $plan_commit)"
    fi
  fi
done

exit $fail
