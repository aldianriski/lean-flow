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

# Coordinator close-bookkeeping: files a sprint's own tasks never declare in Layers: because they
# are edited at close by convention/decision (D1/D3 across SPRINT-042/SPRINT-043), never by a task.
# Excluded WITH this stated reason, never silently -- the list stays auditable in this file.
is_excluded() {
  case "$1" in
    docs/sprint/*) return 0 ;;                 # sprint file + archive/ + INDEX.md: coordinator-owned (D3)
    TECH-DEBT.md) return 0 ;;                   # TD marking moved to close (D1)
    TODO.md) return 0 ;;                        # backlog bookkeeping, written at close
    .claude/settings.json|.claude/settings.local.json) return 0 ;;
                                                # PRE-FLIGHT bookkeeping: the unattended allowlist is
                                                # derived and written AFTER the Plan freezes, so no task
                                                # can declare it — undeclarable by construction, not by
                                                # omission. Same category as the close-time rows above.
    CHANGELOG.md) return 0 ;;                   # release bookkeeping, written at close
    docs/LEARNINGS.md) return 0 ;;              # retro bucket routing, written at close
    docs/knowledge-index.md) return 0 ;;        # GENERATED, never hand-authored: regenerated whenever
                                                # any metadata-carrying doc (LEARNINGS/ADR/research)
                                                # changes, so declaring it would mean naming it in every
                                                # task that touches one. Its sources are already excluded
                                                # or declared; a derived view is not a coordination
                                                # concern, which is what Layers: exists to manage.
    .claude-plugin/plugin.json) return 0 ;;     # version bump, owned by release-patch
    .claude-plugin/marketplace.json) return 0 ;; # lockstep with plugin.json, same owner
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
  st=$(fmv "$sp" status)
  [ "$st" = "active" ] || continue

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

  # Observed changed-file set: tracked diff since plan_commit (staged + unstaged) UNION untracked
  # new files -- a file never `git add`ed is exactly SPRINT-042 T3's real recorded shape.
  tracked=$(git diff --name-only "$plan_commit" -- . 2>/dev/null)
  untracked=$(git ls-files --others --exclude-standard -- . 2>/dev/null)
  changed=$(printf '%s\n%s\n' "$tracked" "$untracked" | grep -v '^$' | sort -u)

  miss=""
  for f in $changed; do
    is_excluded "$f" && continue
    case " $layers_all " in
      *" $f "*) ;;
      *) miss="$miss $f" ;;
    esac
  done

  if [ -n "$miss" ]
  then bad "$sp layers observed: changed but undeclared in any task's Layers::$miss"
  else ok  "$sp layers observed (all changed files declared, base $plan_commit)"
  fi
done

exit $fail
