#!/bin/sh
# run-dispatch-preflight-fixtures.sh -- must-FAIL fixtures for the pre-dispatch preflight snippet
# shipped in skills/orchestrator/references/dispatch.md (cycle / shared-file-ownership / base-ref).
#
# TD-012: this snippet was negative-tested by three must-FAIL fixtures that lived in a scratch dir
# and were deleted with their prototype, leaving the shipped sh/awk block with no retained
# regression guard (L-058's exact worst case -- a gate that can degrade silently). This runner
# adopts the same fixture shape into the harness that TD-012 itself named as the natural carrier.
#
# Extraction note: this runner used extract_sole_fenced_block while dispatch.md had exactly ONE ```sh
# block and skills/** was frozen for the task that wrote it. SPRINT-070 T2 added a second ```sh block
# (the worktree-base guard), which is precisely the case that helper fails loud on -- so dispatch.md
# was retrofitted with the `<!-- name:start/end -->` anchor convention and this runner now extracts
# by name. Still the real shipped snippet, never a hand-copied duplicate; the anchors additionally
# make the extraction stable against any future third block.
#
# The snippet's git calls (`git rev-parse HEAD`, `git rev-parse <declared-base>`) are bare -- no
# `-C <repo>` flag -- so they resolve against the CALLER's cwd. Every case below runs the extracted
# script from this repo's own root; all three git calls are `rev-parse` (read-only, zero writes).
#
# Dependency-free POSIX sh. Run bare: sh evals/run-dispatch-preflight-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
dispatch_md="$repo_root/skills/orchestrator/references/dispatch.md"
. "$here/lib/harness-common.sh"

script_tmp=$(mktemp) || { echo "FAIL harness: mktemp failed"; exit 2; }
trap 'rm -f "$script_tmp"' EXIT
extract_between_anchors "$dispatch_md" \
  "<!-- dispatch-preflight:start -->" "<!-- dispatch-preflight:end -->" "$script_tmp"

live_head=$(git -C "$repo_root" rev-parse HEAD 2>/dev/null)
[ -n "$live_head" ] || { echo "FAIL harness: could not resolve live HEAD in $repo_root"; exit 2; }
# A declared base guaranteed to differ from live HEAD -- computed relative to HEAD (never a
# hardcoded sha) so the fixture stays valid as this repo's history grows.
drifted_base="${live_head}~5"

fail=0

# --- case 1: T1<->T2 depend on each other -> no valid dispatch order -> FAIL cycle-detected ------
run_case_anywhere "cycle" 1 "FAIL cycle-detected" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/cycle/sprint.md\" \"$live_head\""

# --- case 2: T1 and T2 both name shared.md, no Depends-on edge -> FAIL shared-file-unowned -------
run_case_anywhere "shared-file-unowned" 1 "FAIL shared-file-unowned" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/shared-file-unowned/sprint.md\" \"$live_head\""

# --- case 3: declared base != live HEAD -> FAIL base-ref-drift -----------------------------------
run_case_anywhere "base-ref-drift" 1 "FAIL base-ref-drift" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/base-ref-drift/sprint.md\" \"$drifted_base\""

# --- case 4 (TD-025): T1->T2->T3->T4 chain on night-run.md, replaying SPRINT-044's real case --
# no direct edge between non-adjacent pairs -> must PASS, naming the derived transitive order ----
run_case_anywhere "sprint-044-chain" 0 "PASS shared-file-owned-transitive" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/sprint-044-chain/sprint.md\" \"$live_head\""

# --- case 5: T1 and T3 share shared.md with DIFFERING ranks but no Depends-on path between them --
# guards TD-025's fix from ever mistaking rank divergence for ownership -> must still FAIL by name -
run_case_anywhere "shared-file-unowned-diverging-ranks" 1 "FAIL shared-file-unowned" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/shared-file-unowned-diverging-ranks/sprint.md\" \"$live_head\""

# --- case 6 (TD-040): shared.md sits on an INDENTED CONTINUATION of Layers: in both tasks --------
# Pre-fix the parser matched only lines beginning `Layers:`, so a wrapped declaration kept its first
# line and every path on the continuation was invisible -> PREFLIGHT: CLEAR over a real unowned
# overlap. Observed live at the SPRINT-053 and SPRINT-054 promotes; harmless both times only because
# the overlap happened to carry a Depends-on edge anyway (luck, not the check).
run_case_anywhere "wrapped-layers-unowned" 1 "FAIL shared-file-unowned: shared.md" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/wrapped-layers-unowned/sprint.md\" \"$live_head\""

# --- case 7 (TD-043): T1 declares a DIRECTORY token, T2 a file inside that tree ------------------
# Pre-fix the token pattern required a dot extension, so a token ending in "/" was extracted by
# nothing and compared against nothing. The rule "declare a directory only for a tree ONE task owns"
# was stated in a header comment -- a comment, not a check.
run_case_anywhere "directory-token-unowned" 1 "FAIL shared-file-unowned: evals/fixtures/ ~ " -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/directory-token-unowned/sprint.md\" \"$live_head\""

# --- case 8: PARSER PARITY -- one input, both parsers, same declarations seen --------------------
# The snippet re-implements a parser scripts/lib/check-layers-completeness.sh already has correct,
# and drifted from it twice (TD-040, TD-043). G2 ruled against removing the duplication -- dispatch.md
# publishes the snippet as dependency-free and runnable-verbatim, and pointing it at scripts/lib/
# would ship a maintainer-only path inside a consumer-facing reference (L-015). So the duplication is
# guarded instead of removed: one fixture, deliberately awkward in both ways that broke the snippet,
# driven through both tools.
#
# Asserted on OUTPUT CONTENT, never on exit status -- and that distinction is the whole case. Run
# against the pre-fix snippet this same fixture exits 0 and prints "PREFLIGHT: CLEAR" while silently
# reporting NEITHER overlap: the parser saw no shared files at all. Exit code identical, verdict
# empty. That is CLAUDE.md trap (c) in one line -- a status is evidence about the reporter, never
# about the artifact (L-060).
parity="$here/fixtures/dispatch-preflight/parser-parity/sprint.md"
parity_out=$(cd "$repo_root" && sh "$script_tmp" "$parity" "$live_head" 2>&1)
for want in "shared/tree/ ~ shared/tree/nested.md in T1,T2" "common.md in T1,T2"; do
  case "$parity_out" in
    *"$want"*) echo "PASS fixture(parser-parity/preflight): saw '$want'" ;;
    *) echo "FAIL fixture(parser-parity/preflight): '$want' missing -- the snippet stopped reading a declaration the full checker still reads:"
       printf '%s\n' "$parity_out"; fail=1 ;;
  esac
done
run_case_anywhere "parser-parity/completeness" 0 "### T2 Layers completeness" -- \
  sh -c "cd \"$repo_root\" && sh scripts/lib/check-layers-completeness.sh \"$parity\""

# --- cases 8-10 (TD-132): `Depends-on:` prose must not become dependency edges ------------------
# The `Layers:` side of this parser was anchored by TOK at TD-043; `Depends-on:` was left as a bare
# `grep -oE 'T[0-9]+'` over the whole line, so it harvested ids out of the field's own explanation
# and ignored the literal `none` in front of them. On SPRINT-094 -- four tasks, every one declaring
# `none` -- it built `T2 -> [T1,T2,T1,T2]`, a self-edge no topological sort resolves, and FAILed
# `cycle-detected` on an acyclic Plan while issuing three `shared-file-owned` PASSes off the
# invented edges. The false HALT is the loud half; the false PASS green-lights a wave with no
# ownership order at all.
#
# Asserted on OUTPUT CONTENT, not exit status: pre-fix, case 8 exits 1 carrying `FAIL
# cycle-detected`, so a status-only assertion cannot tell "this Plan has a cycle" from "the parser
# invented one".

# case 8 -- prose on the FIELD line (call site 1 of 2). Must NOT report a cycle.
run_case_anywhere "deps-prose-field" 0 "PASS wave-computation: T1=0 T2=0 T3=0" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-prose-field/sprint.md\" \"$live_head\""

# case 9 -- prose on an INDENTED CONTINUATION (call site 2 of 2). This is the arm a field-only fix
# leaves leaking, and SPRINT-094's explanations really did wrap onto continuation lines (L-058).
run_case_anywhere "deps-prose-continuation" 0 "PASS wave-computation: T1=0 T2=0" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-prose-continuation/sprint.md\" \"$live_head\""

# case 10 -- SIBLING CONTROL. Anchoring must not blind the parser to real edges: T3 declares
# `T1 . T2` and then explains itself, so exactly those two must still be read. Rank 1 is what
# distinguishes "parsed correctly" from "parsed nothing" -- an unparsed T3 would sit at rank 0.
run_case_anywhere "deps-ids-with-prose" 0 "PASS wave-computation: T1=0 T2=0 T3=1" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-ids-with-prose/sprint.md\" \"$live_head\""

# --- cases 11-12 (TD-132, SECOND design): a dropped edge is worse than an invented one -----------
# Independent review killed the first fix with two of this repo's OWN historical lines. Both cases
# below assert a RANK, not merely absence-of-cycle: rank is what distinguishes "the ids parsed" from
# "the ids vanished and the tasks collapsed into one wave". Absence of a FAIL proves nothing here --
# the whole defect was that the preflight printed CLEAR (L-058).

# case 11 -- an id annotated INLINE, mid-list. Field text copied from SPRINT-055:161; the `·`
# variant is SPRINT-063:83. Truncating at the first `(` kept only T1 and dropped T3/T4 silently.
run_case_anywhere "deps-inline-annotated-list" 0 "PASS wave-computation: T1=0 T3=1 T4=2 T5=3 T6=4" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-inline-annotated-list/sprint.md\" \"$live_head\""

# case 12 -- the first id is explained and the rest of the list WRAPS. The first fix stopped
# collecting continuations whenever the field carried prose, losing T2 and putting two dependent
# tasks in one wave under PREFLIGHT: CLEAR.
run_case_anywhere "deps-wrapped-list-after-prose" 0 "PASS wave-computation: T1=0 T2=1 T3=2" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-wrapped-list-after-prose/sprint.md\" \"$live_head\""

# --- cases 14-15 (TD-132, THIRD design): the two shapes round 2 of review killed design 2 on ------
# Both are real authoring styles from this repo's own archive, and they fail in OPPOSITE directions:
# one drops a declared edge, the other invents one from prose. A design that fixes only one of them
# is design 2, which is how this pair earned permanent fixtures.

# case 14 -- BARE-SPACE separated ids (SPRINT-050:111, SPRINT-053:107). Load-bearing: SPRINT-053's
# own D4 states `Depends-on: T1 T3` is what gives two files a single owner. Asserted on RANK -- T5
# at 1 instead of 2 is the silent drop, and it comes with no FAIL line at all.
run_case_anywhere "deps-space-separated" 0 "PASS wave-computation: T1=0 T3=1 T5=2" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-space-separated/sprint.md\" \"$live_head\""

# case 15 -- MUST-FAIL. Prose that merely names a task is not a dependency. The continuation style is
# SPRINT-066:63-64's (`T1-sanctioned gate is ...`), harmless there by luck; the form below denies the
# dependency in words while a leading-token parser reads one. T2 and T3 share shared.md with no edge,
# so an ownership PASS here means the guard invented the edge from prose -- TD-132's own failure
# class, which is why this is the retained must-FAIL rather than another must-PASS.
run_case_anywhere "deps-prose-names-task-unowned" 1 "FAIL shared-file-unowned: shared.md in T2 and T3" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-prose-names-task-unowned/sprint.md\" \"$live_head\""

# --- cases 16-18 (TD-132, round 3 hardening) -----------------------------------------------------
# Round 3 of review found no corpus defect but four latent silent-drop paths, all one root cause: an
# unrecognised token ENDED the id list and everything after it was discarded with no signal. Two are
# fixed by parsing correctly rather than warning; the third cannot be parsed and is reported loudly.

# case 16 -- `[...]` is an annotation, like `(...)`. A bracket token carries no `(`, so it used to
# hit the prose branch and drop the ids after it. Rank asserted: T3 at 1 would mean T2 was lost.
run_case_anywhere "deps-bracket-annotation" 0 "PASS wave-computation: T1=0 T2=1 T3=2" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-bracket-annotation/sprint.md\" \"$live_head\""

# case 17 -- markup is decoration. `**T1**` / `` `T1` `` matched neither test and so ended the list,
# discarding the wrapped id AND everything after it. This repo writes that style constantly in logs
# and commit messages, so it is one habit-slip from a real field.
run_case_anywhere "deps-markup-wrapped-id" 0 "PASS wave-computation: T1=0 T2=1 T3=2" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-markup-wrapped-id/sprint.md\" \"$live_head\""

# case 18 -- MUST-FAIL. An unclosed annotation leaves the depth counter above zero and swallows the
# rest of the line, real ids included. It is the one shape here that cannot be parsed correctly, so
# it is REPORTED rather than truncated silently -- and reported before waves or ownership are
# derived from a list the tool already knows is incomplete (L-058).
run_case_anywhere "deps-unbalanced-annotation" 1 "FAIL depends-on-unreadable: T2" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-unbalanced-annotation/sprint.md\" \"$live_head\""

# --- cases 19-23 (TD-132, round 4): two CRITICALs and the call-site-2 coverage matrix ------------
# Round 4 rejected the round-3 hardening with two more silent-drop/false-PASS paths, one of them
# introduced BY that hardening. Both get a retained fixture, plus the three cells L-186 named.

# case 19 -- MUST-FAIL. Global markup stripping WELDED `*T1*3` into `T13`, a real task, inventing a
# dependency and turning a genuinely unowned overlap into `PASS shared-file-owned`. Only wrapping
# markup is stripped now. A shared-file-owned PASS here means the id was welded back into existence.
run_case_anywhere "deps-markup-welds-id" 1 "FAIL shared-file-unowned: shared.md in T13 and T3" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-markup-welds-id/sprint.md\" \"$live_head\""

# case 20 -- MUST-FAIL. A token carrying a CLOSE with no OPEN (`1)`) has o==0, never enters
# depth-tracking, and so the end-of-line unbalanced check structurally cannot see it: the list
# simply ended and every id after it vanished with no signal. The fifth silent-drop path, found
# after the round that claimed to have closed them all.
run_case_anywhere "deps-close-without-open" 1 "FAIL depends-on-unreadable: T3" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-close-without-open/sprint.md\" \"$live_head\""

# cases 21-23 -- the CALL SITE 2 half of the matrix. Every round-3 hardening fixture put its trigger
# on the field line, leaving the indented-continuation arm unproven for all three mechanisms -- the
# seam this parser's own history says is where a field-only fix leaks (L-186: fixtures discriminate
# branches, never the SELECTION of inputs those branches run over).
run_case_anywhere "deps-cont-bracket" 0 "PASS wave-computation: T1=0 T2=1 T3=2" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-cont-bracket/sprint.md\" \"$live_head\""
run_case_anywhere "deps-cont-markup" 0 "PASS wave-computation: T1=0 T2=1 T3=2" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-cont-markup/sprint.md\" \"$live_head\""
run_case_anywhere "deps-cont-unbalanced" 1 "FAIL depends-on-unreadable: T2" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-cont-unbalanced/sprint.md\" \"$live_head\""

# --- cases 24-25 (round 5): the last two cells of the 3x2 call-site matrix -----------------------
# Round 5 found no CRITICAL but named these two cells unproven (L-186) and hand-verified the code
# already behaves correctly on both. These fixtures are what keep it that way -- the continuation
# arm is where this parser's own history says a field-only fix leaks.
run_case_anywhere "deps-cont-close-without-open" 1 "FAIL depends-on-unreadable: T3" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-cont-close-without-open/sprint.md\" \"$live_head\""
run_case_anywhere "deps-cont-markup-welds-id" 1 "FAIL shared-file-unowned: shared.md in T13 and T3" -- \
  sh -c "cd \"$repo_root\" && sh \"$script_tmp\" \"$here/fixtures/dispatch-preflight/deps-cont-markup-welds-id/sprint.md\" \"$live_head\""

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "DISPATCH-PREFLIGHT FIXTURES: all green"; else echo "DISPATCH-PREFLIGHT FIXTURES: at least one FAIL"; fi
exit $fail
