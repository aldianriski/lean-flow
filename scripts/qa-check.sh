#!/usr/bin/env sh
# qa-check.sh -- lean-flow structural QA check (mechanical rules only).
# Pairs with docs/QA.md, which carries the judgment rules a script cannot check.
# See docs/adr/ADR-008 for why this is the plugin's first executable code.
# Exit 0 = every mechanical rule passes; exit 1 = at least one FAIL.
#
# Usage:  sh scripts/qa-check.sh          (runs from anywhere; resolves the repo root via git)
#         QA_FULL=1 sh scripts/qa-check.sh  (also runs the 4 opt-in selftest-assert-* harnesses;
#                                             see leg 12, TD-016)

set -u

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT" || exit 2

fail=0
pass=0
note() { printf '      %s\n' "$1"; }
ok()   { pass=$((pass + 1)); printf 'PASS  %s\n' "$1"; }
bad()  { fail=$((fail + 1)); printf 'FAIL  %s\n' "$1"; }

# --- 1. Line caps (STANDARD section 2) ------------------------------------
cap() { # <file> <maxlines>
  f=$1; max=$2
  [ -f "$f" ] || { note "skip (missing): $f"; return; }
  n=$(wc -l < "$f" | tr -d ' ')
  if [ "$n" -le "$max" ]; then ok "cap $f ($n <= $max)"; else bad "cap $f ($n > $max)"; fi
}

# DERIVED from STANDARD §2, not hand-listed (SPRINT-056 T2, TD-041). The four globs that used to
# sit here covered 17 files; §2 states a cap on far more rows than that, and every unlisted row was a
# cap with nothing behind it. `docs/research/` drifted 39 lines unnoticed across four sprints in
# exactly that gap. Adding one more glob would have fixed that file and left the mechanism intact.
# The one cap §2 does NOT state -- skills/*/SKILL.md at 140 (ADR-006) -- is retained inside the
# checker as an explicit allowlist naming its authority, so deriving does not silently drop it (L-076).
# Relayed verbatim so the report reads as it did inline. `cap()` above is still used by nothing else;
# it is kept because the checker's own output format matches it.
doccaps=$(sh scripts/lib/check-doc-caps.sh); doccaps_rc=$?
printf '%s\n' "$doccaps"
pass=$((pass + $(printf '%s\n' "$doccaps" | grep -c '^PASS' || true)))
[ "$doccaps_rc" -eq 0 ] || fail=$((fail + $(printf '%s\n' "$doccaps" | grep -c '^FAIL' || true)))

# --- 2. Count consistency (claims-vs-disk) ----------------------------------
# Delegates to a retained checker (scripts/lib/check-count-claims.sh, itself covered by
# evals/run-count-claims-fixtures.sh). Extracted at SPRINT-055 T1: the block was inline and bound to
# this repo's own paths, so it could never be pointed at a fixture -- meaning the check that catches
# drift had itself never been exercised on input that must FAIL (L-058). Every PASS/FAIL/note line
# the checker prints is relayed verbatim so the report reads exactly as it did inline.
cc_script="scripts/lib/check-count-claims.sh"
if [ ! -f "$cc_script" ]; then
  bad "count claims: checker not found at $cc_script"
else
  cc_out=$(sh "$cc_script" "$ROOT" 2>&1); cc_code=$?
  printf '%s\n' "$cc_out"
  cc_pass=$(printf '%s\n' "$cc_out" | grep -cE '^PASS')
  cc_fails=$(printf '%s\n' "$cc_out" | grep -cE '^FAIL')
  pass=$((pass + cc_pass))
  if [ "$cc_code" -ne 0 ]; then
    if [ "$cc_fails" -gt 0 ]; then
      fail=$((fail + cc_fails))
    else
      bad "count claims: checker exited $cc_code without reporting a FAIL line"
    fi
  fi
fi

# --- 2b. Epic retention (STANDARD section 11, both directions) -------------------------------
# The §11 epic-archive row shipped with the epic layer and `close` never executed it, so the rule
# had never run once: EPIC-001 sat closed and fully ticked in docs/epic/ across five sprints with
# every gate green (SPRINT-055 T2). Delegates to scripts/lib/check-epic-archive.sh, covered by
# evals/run-epic-archive-fixtures.sh. Checks BOTH directions -- archived without earning it, and
# earned it but never moved -- because a retention rule that silently stops running is the failure
# actually observed here, not the hypothetical one.
ea_script="scripts/lib/check-epic-archive.sh"
if [ ! -f "$ea_script" ]; then
  bad "epic archive: checker not found at $ea_script"
else
  ea_out=$(sh "$ea_script" "$ROOT" 2>&1); ea_code=$?
  printf '%s\n' "$ea_out"
  ea_pass=$(printf '%s\n' "$ea_out" | grep -cE '^PASS')
  ea_fails=$(printf '%s\n' "$ea_out" | grep -cE '^FAIL')
  pass=$((pass + ea_pass))
  if [ "$ea_code" -ne 0 ]; then
    if [ "$ea_fails" -gt 0 ]; then
      fail=$((fail + ea_fails))
    else
      bad "epic archive: checker exited $ea_code without reporting a FAIL line"
    fi
  fi
fi

# --- 2c. Research retention (STANDARD section 11) ---------------------------------------------
# close's compaction sweep pointed at an "or archive" target §11 never defined (SPRINT-055 T3).
# Delegates to scripts/lib/check-research-archive.sh, covered by evals/run-research-archive-
# fixtures.sh. Conservative by design: supersession alone does not license archiving, because a spent
# verdict is usually the WHY-trail for whatever replaced it.
ra_script="scripts/lib/check-research-archive.sh"
if [ ! -f "$ra_script" ]; then
  bad "research archive: checker not found at $ra_script"
else
  ra_out=$(sh "$ra_script" "$ROOT" 2>&1); ra_code=$?
  printf '%s\n' "$ra_out"
  ra_pass=$(printf '%s\n' "$ra_out" | grep -cE '^PASS')
  ra_fails=$(printf '%s\n' "$ra_out" | grep -cE '^FAIL')
  pass=$((pass + ra_pass))
  if [ "$ra_code" -ne 0 ]; then
    if [ "$ra_fails" -gt 0 ]; then
      fail=$((fail + ra_fails))
    else
      bad "research archive: checker exited $ra_code without reporting a FAIL line"
    fi
  fi
fi

# --- 2d. Ephemeral intake artifacts (STANDARD section 2 temp-dir rule) -------------------------
# A BUG-<slug>.md report is temp-dir intake scaffolding, never committed (SPRINT-055 T4). §2 used to
# describe the report's CONTENT as "routed away at /triage" and say nothing about the file, so
# "undisposed" was not expressible and could not be checked. Under the temp-dir rule a committed
# report IS the failure. Covered by evals/run-ephemeral-intake-fixtures.sh.
ei_script="scripts/lib/check-ephemeral-intake.sh"
if [ ! -f "$ei_script" ]; then
  bad "ephemeral intake: checker not found at $ei_script"
else
  ei_out=$(sh "$ei_script" "$ROOT" 2>&1); ei_code=$?
  printf '%s\n' "$ei_out"
  ei_pass=$(printf '%s\n' "$ei_out" | grep -cE '^PASS')
  ei_fails=$(printf '%s\n' "$ei_out" | grep -cE '^FAIL')
  pass=$((pass + ei_pass))
  if [ "$ei_code" -ne 0 ]; then
    if [ "$ei_fails" -gt 0 ]; then
      fail=$((fail + ei_fails))
    else
      bad "ephemeral intake: checker exited $ei_code without reporting a FAIL line"
    fi
  fi
fi

# --- 2e. Task origin (G1 fast-path provenance) --------------------------------------------------
# G1 fast-paths a "decomposer-approved task"; until SPRINT-055 T6 no field recorded whether a task
# had met the intake grill, so the clause was unverifiable prose and a close-Retro follow-up looked
# identical to a grilled entry. This is the mechanical half -- no task reaches G1 unstamped. G1's own
# clause is the procedural half. Covered by evals/run-task-origin-fixtures.sh.
to_script="scripts/lib/check-task-origin.sh"
if [ ! -f "$to_script" ]; then
  bad "task origin: checker not found at $to_script"
else
  to_out=$(sh "$to_script" "$ROOT" 2>&1); to_code=$?
  printf '%s\n' "$to_out"
  to_pass=$(printf '%s\n' "$to_out" | grep -cE '^PASS')
  to_fails=$(printf '%s\n' "$to_out" | grep -cE '^FAIL')
  pass=$((pass + to_pass))
  if [ "$to_code" -ne 0 ]; then
    if [ "$to_fails" -gt 0 ]; then
      fail=$((fail + to_fails))
    else
      bad "task origin: checker exited $to_code without reporting a FAIL line"
    fi
  fi
fi

# --- 2f-bis. §13 attestation on HEAD, read from the spec rather than from this script -------------
# The first checker here that learns its rule set from spec/STANDARD.md §13's Conformance table
# instead of hard-coding it (SPRINT-074 T2, EPIC-004 D1). Run against HEAD so the repository is
# measured against the standard it publishes, on every gate -- a checker that never fires on its own
# repo is half-shipped (L-020).
#
# Cheap and always-on by the declared rule: it reads git objects that already exist and builds
# nothing. Its FIXTURE HARNESS is the part that spins up throwaway repos, and that is what sits in
# eval_harnesses_optin below (TD-016 -- cheap-and-git-free always-on, git-repo-building opt-in).
#
# Green on a commit that makes no attestation (absence is not a failure and is not approval) and
# green on a well-formed one over an unsigned commit (that is Gated, an honestly reached level, not
# a defect). It fails only on an attestation that contradicts itself or its own sprint record.
# Covered by evals/run-attestation-fixtures.sh.
at_script="scripts/lib/check-attestation.sh"
if [ ! -f "$at_script" ]; then
  bad "attestation: checker not found at $at_script"
elif ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  note "attestation: skip -- no HEAD commit to read (§13 is defined over git objects)"
else
  at_out=$(sh "$at_script" . HEAD 2>&1); at_code=$?
  printf '%s\n' "$at_out"
  at_pass=$(printf '%s\n' "$at_out" | grep -cE '^PASS')
  at_fails=$(printf '%s\n' "$at_out" | grep -cE '^FAIL')
  pass=$((pass + at_pass))
  if [ "$at_code" -ne 0 ]; then
    if [ "$at_fails" -gt 0 ]; then
      fail=$((fail + at_fails))
    else
      bad "attestation: checker exited $at_code without reporting a FAIL line"
    fi
  fi
fi

# --- 2f-ter. The conformance engine, run against THIS repo -- mostly informational, not yet gating -
# SPRINT-075 T2. "This repo becomes its own first consumer" -- so the engine runs here, against `.`,
# on every gate, and its full report is relayed exactly like every other leg's. Almost all of that
# report does NOT add its PASS/FAIL counts into this gate's own pass/fail tally.
#
# Why not, when attestation above does: attestation only ever evaluates §13's five rules, and all
# five have real assertions -- it is fully covered, so gating on it reports a real regression. This
# engine sweeps EVERY section's rules, and most are still unbuilt: 34 of 43 `build` dispositions
# remain after T4/T6 land their six this same sprint (docs/research/conformance-dispositions.md).
# Gating THIS gate on all of that would turn qa-check.sh permanently red over tracked, scheduled-
# for-later-sprints coverage gaps -- not a regression -- for as long as those dispositions stay
# unbuilt, which is many sprints (§ Scope explicitly defers the remaining 34 past this one). A
# rule-unimplemented finding is exactly the report's most useful content right now (DoD 3); the exit
# code the engine itself hands back is the CI-usable signal once a consumer's coverage is adequate to
# gate on -- this repo's own qa-check gets there once T4/T6 (and later families) have shrunk the gap
# enough that the residue is worth blocking on, not before. Revisit as a follow-up once that's true.
#
# The ONE exception (SPRINT-075 T4): S9.GATESWELLFORMED / S9.GATESABSENT are FULLY covered here --
# real assertions, not a rule-unimplemented gap -- migrated off the now-deleted
# scripts/lib/check-gates-signed.sh, which used to run as its own gating leg (night-run Part 1
# required batch G1/G2 to be "already signed off" and never said the sign-off had to live in the
# sprint artifact; a run reading only the sprint file saw nothing, re-ran both gates, reached for
# AskUserQuestion (unregistered headless) and parked every task -- SPRINT-057 T5, L-099). Rather than
# invoke the engine a second time just for two ids, this leg pulls their verdict lines out of the ONE
# full run below and folds only those into the tally -- the guarded failure (a MISSING field read as
# approval) still gates this script exactly as it did as a standalone checker.
# Covered by evals/run-gates-signed-fixtures.sh, repointed at the engine.
ce_script="scripts/lib/conformance-engine.sh"
if [ ! -f "$ce_script" ]; then
  bad "conformance engine: checker not found at $ce_script"
else
  ce_out=$(sh "$ce_script" . 2>&1); ce_code=$?
  printf '%s\n' "$ce_out"
  gs_lines=$(printf '%s\n' "$ce_out" | grep -E '^(PASS|FAIL)  gates-signed:')
  gs_pass=$(printf '%s\n' "$gs_lines" | grep -cE '^PASS')
  gs_fails=$(printf '%s\n' "$gs_lines" | grep -cE '^FAIL')
  pass=$((pass + gs_pass))
  fail=$((fail + gs_fails))
  note "conformance engine: informational only this sprint except S9.GATESWELLFORMED/S9.GATESABSENT above (exit $ce_code overall; $gs_pass gates-signed PASS, $gs_fails gates-signed FAIL folded into this gate's own tally) -- see the comment above this leg for why the rest is not"
fi

# --- 2g. A recorded completed run carries its rollup ---------------------------------------------
# A headless sprint-bulk loop can end mid-Plan and still exit `success` -- 4 of 7 units on a
# consumer's host, every commit correct, three tasks never begun and nothing written about them.
# Part 4 mandates a rollup at every exit; ADR-016 moves the writing of it into the launcher's
# wrapper so the model cannot drop it. This is the enforcement half of that pair (SPRINT-059 T3).
# Covered by evals/run-night-run-rollup-fixtures.sh.
nr_script="scripts/lib/check-night-run-rollup.sh"
if [ ! -f "$nr_script" ]; then
  bad "night-run rollup: checker not found at $nr_script"
else
  # Each log is DERIVED from its Plan rather than globbed on its own. Two reasons, both
  # load-bearing: ADR-014 requires this file to carry exactly one sprint pattern (the
  # non-recursive one), enforced by run-sprint-log-layout-fixtures.sh case 1; and deriving
  # means the Plan and its log cannot drift apart -- the pair is one record (§11).
  nr_files=""
  for nr_sp in $(ls docs/sprint/SPRINT-*.md 2>/dev/null); do
    nr_lg="docs/sprint/logs/$(basename "$nr_sp")"
    [ -f "$nr_lg" ] && nr_files="$nr_files $nr_lg"
  done
  if [ -z "$nr_files" ]; then
    note "night-run rollup: skip -- no Execution Log alongside an active sprint"
  else
    nr_out=$(sh "$nr_script" $nr_files 2>&1); nr_code=$?
    printf '%s\n' "$nr_out"
    nr_pass=$(printf '%s\n' "$nr_out" | grep -cE '^PASS')
    nr_fails=$(printf '%s\n' "$nr_out" | grep -cE '^FAIL')
    pass=$((pass + nr_pass))
    if [ "$nr_code" -ne 0 ]; then
      if [ "$nr_fails" -gt 0 ]; then
        fail=$((fail + nr_fails))
      else
        bad "night-run rollup: checker exited $nr_code without reporting a FAIL line"
      fi
    fi
  fi
fi

# --- 3. Frontmatter / ownership presence ------------------------------------
has_field() { grep -qE "^$2:" "$1"; }

for s in skills/*/SKILL.md; do
  if head -n1 "$s" | grep -q '^---$' && has_field "$s" name && has_field "$s" description
  then ok "frontmatter $s"; else bad "frontmatter $s (need ---/name/description)"; fi
done

for d in TODO.md .claude/CLAUDE.md .claude/CONTEXT.md docs/architecture/overview.md docs/LEARNINGS.md docs/DECISIONS.md CHANGELOG.md docs/knowledge-index.md; do
  [ -f "$d" ] || { note "skip (missing): $d"; continue; }
  if has_field "$d" owner && has_field "$d" last_updated && has_field "$d" status
  then ok "ownership $d"; else bad "ownership $d (need owner/last_updated/status)"; fi
done

# README.md carries ownership as a FOOTER LINE, not YAML frontmatter (STANDARD exception).
if [ -f README.md ]; then
  if grep -qE '^<sub>.*Doc owner:.*last updated.*status:.*</sub>$' README.md
  then ok "ownership README.md (footer line)"
  else bad "ownership README.md (footer line needs Doc owner:/last updated/status:)"; fi
else
  note "skip (missing): README.md"
fi

# --- 4. Knowledge metadata: index freshness + dangling refs + completeness (ADR-009) --
# Covers the whole corpus: LEARNINGS (in-file `## L-NNN` entries) + per-file frontmatter on
# docs/adr/*.md and docs/research/*.md. Vocab (tags/domains) sourced from gen-index.sh (single origin).

# frontmatter field extractor (first match in the leading --- block)
fmv() { awk -v k="$2" 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} $0~"^"k":"{sub("^"k":[ ]*","");print;exit}' "$1"; }

if [ -f scripts/gen-index.sh ]; then
  if sh scripts/gen-index.sh --check >/dev/null 2>&1
  then ok "knowledge index current"
  else bad "knowledge index STALE (run: sh scripts/gen-index.sh)"; fi
fi

# Corpus = git-tracked ADR + research .md; stray untracked working-tree files are ignored so a WIP
# research doc never fails the gate. Glob fallback outside a git work tree. (TASK-060)
corpus_files=$(git ls-files -- docs/adr docs/research 2>/dev/null | grep -E '^docs/adr/ADR-[0-9]+.*\.md$|^docs/research/[^/]+\.md$')
[ -n "$corpus_files" ] || corpus_files=$(ls docs/adr/ADR-*.md docs/research/*.md 2>/dev/null)

# id universe (everything a related/supersedes ref may point at)
lids=$(grep -oE '^## L-[0-9]+' docs/LEARNINGS.md 2>/dev/null | grep -oE 'L-[0-9]+' | sort -u)
adrids=$(printf '%s\n' $corpus_files | grep '/adr/' | grep -oE 'ADR-[0-9]+' | sort -u)
resids=$(for f in $corpus_files; do case "$f" in */research/*) [ -f "$f" ] && fmv "$f" id;; esac; done | sort -u)
allids=$(printf '%s\n%s\n%s\n' "$lids" "$adrids" "$resids" | sort -u | grep -v '^$')

# 4a. LEARNINGS in-file refs + metadata shape (unchanged rules)
if [ -f docs/LEARNINGS.md ]; then
  refs=$(grep -iE '^- (related|supersedes|superseded-by):' docs/LEARNINGS.md | grep -oE '(L|ADR)-[0-9]+' | sort -u)
  dangling=""
  for r in $refs; do printf '%s\n' "$allids" | grep -qx "$r" || dangling="$dangling $r"; done
  if [ -z "$dangling" ]; then ok "learnings refs resolve (no dangling related/supersedes)"
  else bad "learnings dangling refs:$dangling"; fi

  KNOWN=$(grep -E '^TAGS=' scripts/gen-index.sh 2>/dev/null | sed -E 's/^TAGS="?([^"]*)"?/\1/')
  badmeta=""
  for id in $(grep -oE '^## L-[0-9]+' docs/LEARNINGS.md | grep -oE 'L-[0-9]+'); do
    hl=$(grep -E "^## $id[ []" docs/LEARNINGS.md | head -n1)
    if ! printf '%s' "$hl" | grep -qE '\[tags: [^]]+\] \[status: (active|promoted|superseded)\]'
    then badmeta="$badmeta $id(shape)"; continue; fi
    t=$(printf '%s' "$hl" | sed -E 's/.*\[tags: ([^]]*)\].*/\1/')
    for one in $t; do printf '%s' "$KNOWN" | grep -qw "$one" || badmeta="$badmeta $id(tag:$one)"; done
  done
  if [ -z "$badmeta" ]; then ok "learnings metadata complete (tags+status, known vocab)"
  else bad "learnings metadata:$badmeta"; fi
fi

# 4b. ADR + research frontmatter: dangling refs + completeness
KNOWN_TAGS=$(grep -E '^TAGS=' scripts/gen-index.sh 2>/dev/null | sed -E 's/^TAGS="?([^"]*)"?/\1/')
KNOWN_DOMAINS=$(grep -E '^DOMAINS=' scripts/gen-index.sh 2>/dev/null | sed -E 's/^DOMAINS="?([^"]*)"?/\1/')
KNOWN_STATUS="accepted current superseded deprecated"
cdang=""; cmeta=""
for f in $corpus_files; do
  [ -f "$f" ] || continue
  b=$(basename "$f")
  reftoks=$(awk 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} /^(related|supersedes|superseded-by):/{print}' "$f" \
            | grep -oE '\[[^]]*\]' | tr -d '[]' | tr ',' ' ')
  for r in $reftoks; do [ -n "$r" ] && { printf '%s\n' "$allids" | grep -qx "$r" || cdang="$cdang $b:$r"; }; done
  id=$(fmv "$f" id);     [ -n "$id" ]  || cmeta="$cmeta $b(id)"
  dom=$(fmv "$f" domain); [ -n "$dom" ] || cmeta="$cmeta $b(domain)"
  st=$(fmv "$f" status);  [ -n "$st" ]  || cmeta="$cmeta $b(status)"
  tags=$(fmv "$f" tags | tr -d '[],'); [ -n "$tags" ] || cmeta="$cmeta $b(tags)"
  for one in $tags; do printf '%s' "$KNOWN_TAGS" | grep -qw "$one" || cmeta="$cmeta $b(tag:$one)"; done
  [ -z "$dom" ] || printf '%s' "$KNOWN_DOMAINS" | grep -qw "$dom" || cmeta="$cmeta $b(domain:$dom)"
  [ -z "$st" ]  || printf '%s' "$KNOWN_STATUS"  | grep -qw "$st"  || cmeta="$cmeta $b(status:$st)"
done
if [ -z "$cdang" ]; then ok "corpus refs resolve (ADR/research related/supersedes)"
else bad "corpus dangling refs:$cdang"; fi
if [ -z "$cmeta" ]; then ok "corpus metadata complete (id+tags+domain+status, known vocab)"
else bad "corpus metadata:$cmeta"; fi

# --- 5. TODO.md hygiene: no shipped-task breadcrumb comments (D1, SPRINT-024) ----------
# Scoped to HTML comment lines only — live task prose (done-when/decision fields) legitimately
# references sprint/changelog numbers and must never false-positive.
if [ -f TODO.md ]; then
  crumbs=$(grep -E '<!--' TODO.md | grep -iE 'shipped in SPRINT-|done .*(→|->).*(SPRINT|CHANGELOG)|promoted (→|->) SPRINT')
  if [ -z "$crumbs" ]; then ok "TODO.md hygiene (no shipped-task breadcrumb comments)"
  else bad "TODO.md hygiene: breadcrumb comment(s) found — $(printf '%s' "$crumbs" | tr '\n' ';')"; fi
else
  note "skip (missing): TODO.md"
fi

# --- 6. README footer version lint (footer vX.Y.Z == plugin.json version) --
if [ -f README.md ] && [ -f .claude-plugin/plugin.json ]; then
  footer=$(grep -E '^<sub>.*status:.*v[0-9]+\.[0-9]+\.[0-9]+</sub>$' README.md | tail -n1)
  rv=$(printf '%s' "$footer" | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' | tail -n1 | tr -d 'v')
  pv=$(grep -oE '"version": *"[0-9]+\.[0-9]+\.[0-9]+"' .claude-plugin/plugin.json | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
  if [ -n "$rv" ] && [ -n "$pv" ] && [ "$rv" = "$pv" ]
  then ok "README footer version ($rv = plugin.json $pv)"
  else bad "README footer version (footer=$rv, plugin.json=$pv)"; fi
else
  note "skip (missing): README.md or .claude-plugin/plugin.json"
fi

# --- 6b. Manifest lockstep (every *-plugin manifest carries the same version) --------------------
# Leg 6 above compares the README FOOTER against plugin.json, so until now no two MANIFESTS were ever
# compared to each other -- and .codex-plugin/ + .kimi-plugin/ drifted five releases behind before
# v1.28.0 caught it by hand. The lockstep rule is a DoD line in .claude/CLAUDE.md and had no check
# (SPRINT-056 T5). Leg 6 is kept, not replaced: it catches a different drift this cannot see.
# Delegated to scripts/lib/check-manifest-lockstep.sh, covered by evals/run-manifest-lockstep-fixtures.sh.
ml_script="scripts/lib/check-manifest-lockstep.sh"
if [ ! -f "$ml_script" ]; then
  bad "manifest lockstep: checker not found at $ml_script"
else
  ml_out=$(sh "$ml_script" "$ROOT" 2>&1); ml_code=$?
  printf '%s\n' "$ml_out"
  ml_pass=$(printf '%s\n' "$ml_out" | grep -cE '^PASS')
  ml_fails=$(printf '%s\n' "$ml_out" | grep -cE '^FAIL')
  pass=$((pass + ml_pass))
  if [ "$ml_code" -ne 0 ]; then
    if [ "$ml_fails" -gt 0 ]; then
      fail=$((fail + ml_fails))
    else
      bad "manifest lockstep: checker exited $ml_code without reporting a FAIL line"
    fi
  fi
fi

# --- 7. TD aging: open TD >=3 sprints behind Active Sprint, no re-review ----
if [ -f TODO.md ]; then
  active=$(awk '/^## Active Sprint/{f=1;next} /^## /{f=0} f' TODO.md)
  cur_raw=$(printf '%s' "$active" | grep -oE 'SPRINT-[0-9]+' | head -n1 | grep -oE '[0-9]+')
  if [ -z "$cur_raw" ]; then
    note "TD aging: no Active Sprint pointer found — skipping (no reference point)"
  else
    cur=$((10#$cur_raw))
    tdbad=$(grep -E '^- \*\*TD-[0-9]+\*\* severity:.*status: open' TODO.md | while IFS= read -r tl; do
      id=$(printf '%s' "$tl" | grep -oE 'TD-[0-9]+' | head -n1)
      craw=$(printf '%s' "$tl" | grep -oiE 'created: *Sprint-[0-9]+' | grep -oE '[0-9]+')
      [ -n "$craw" ] || continue
      created=$((10#$craw))
      age=$((cur - created))
      if [ "$age" -ge 3 ] && ! printf '%s' "$tl" | grep -q 're-reviewed:'
      then printf '%s ' "$id"; fi
    done)
    if [ -z "$tdbad" ]; then ok "TD aging (no stale open TD missing re-review)"
    else bad "TD aging: stale >=3 sprints behind, no re-review: $tdbad"; fi
  fi
else
  note "skip (missing): TODO.md"
fi

# --- 8. Temp-tracker lint: TODO.md tracker: lines ---------------------------
if [ -f TODO.md ]; then
  trkbad=$(grep -E '^ *tracker:' TODO.md | while IFS= read -r tl; do
    reason=""
    printf '%s' "$tl" | grep -q '(temp)' && reason="temp"
    stripped=$(printf '%s' "$tl" | sed -E 's#docs/[A-Za-z0-9_./-]*verdict-[A-Za-z0-9_-]+\.md##g')
    printf '%s' "$stripped" | grep -qE 'verdict-[A-Za-z0-9_-]+\.md' && reason="${reason:+$reason+}bare-verdict"
    [ -n "$reason" ] && printf '[%s:%s] ' "$(printf '%s' "$tl" | sed -E 's/^ *tracker: *//' | cut -c1-30)" "$reason"
  done)
  if [ -z "$trkbad" ]; then ok "TODO.md trackers (no (temp) or bare verdict-*.md refs)"
  else bad "TODO.md trackers: $trkbad"; fi
else
  note "skip (missing): TODO.md"
fi

# --- 9. QA.md hygiene: no hand-written live cap snapshot --------------------
# Checked over a sliding 2-line window so a prose-wrapped "currently ... NN/MM" (the
# clause split across a line break) is still caught, not just a same-line match.
if [ -f docs/QA.md ]; then
  if awk 'NR>1{print prev $0} {prev=$0}' docs/QA.md | grep -qE 'currently.*[0-9]+/[0-9]+'
  then bad "QA.md hand-written cap snapshot found (drift risk — use qa-check output instead)"
  else ok "QA.md hygiene (no hand-written cap snapshot)"; fi
else
  note "skip (missing): docs/QA.md"
fi

# --- 10. L-NNN citation lint: skills/ cites must resolve or be labeled -----
# Every L-0[0-9][0-9] cited under skills/ must (a) exist as a docs/LEARNINGS.md entry heading,
# (b) fall inside the LEARNINGS.md Retired-ids ledger range, or (c) have "promoted" on the
# citing line — guards id-reuse collisions after pruning (SPRINT-024 T9).
if [ -f docs/LEARNINGS.md ]; then
  lheadids=$(grep -oE '^## L-[0-9]+' docs/LEARNINGS.md | grep -oE 'L-[0-9]+' | sort -u)
  retline=$(grep -E '\*\*Retired ids:\*\*' docs/LEARNINGS.md | head -n1)
  rlo=$(printf '%s' "$retline" | grep -oE 'L-[0-9]+' | sed -n '1p' | grep -oE '[0-9]+' | sed 's/^0*//')
  rhi=$(printf '%s' "$retline" | grep -oE 'L-[0-9]+' | sed -n '2p' | grep -oE '[0-9]+' | sed 's/^0*//')
  [ -n "$rlo" ] || rlo=0
  [ -n "$rhi" ] || rhi=0
  citebad=$(grep -rnoE 'L-[0-9]{3}' skills/ 2>/dev/null | while IFS=: read -r cf cl cid; do
    line=$(sed -n "${cl}p" "$cf")
    printf '%s' "$line" | grep -qi 'promoted' && continue
    printf '%s\n' "$lheadids" | grep -qx "$cid" && continue
    n=$(printf '%s' "$cid" | grep -oE '[0-9]+' | sed 's/^0*//'); [ -n "$n" ] || n=0
    [ "$n" -ge "$rlo" ] && [ "$n" -le "$rhi" ] && continue
    printf '%s:%s(%s) ' "$cf" "$cl" "$cid"
  done)
  if [ -z "$citebad" ]; then ok "L-NNN citations under skills/ resolve or are labeled"
  else bad "L-NNN citation unresolved: $citebad"; fi
else
  note "skip (missing): docs/LEARNINGS.md"
fi

# --- 11. Active-sprint task schema: class + autonomy + Depends-on mandatory (TASK-110) -----
# Every `### Tn` Plan block in an ACTIVE sprint (status: active) must carry: class: (one of the
# three values) + an autonomy tag (HITL|AFK) in its header meta · a `Depends-on:` line ·
# `Layers:` · `**Acceptance:**`. Missing any → FAIL naming the block.
for sp in docs/sprint/SPRINT-*.md; do
  [ -f "$sp" ] || { note "skip (missing): docs/sprint/SPRINT-*.md"; continue; }
  # Location-scoped, not status-scoped (SPRINT-056 T4, TD-042): a sprint stops being checked when
  # §11 MOVES it to archive/, which is a separate later commit -- not when its status flips, which
  # happens in the same commit as the Retro and the close bookkeeping.
  case "$sp" in */archive/*) continue ;; esac
  plan=$(awk '/^## Plan/{f=1;next} /^## /{f=0} f' "$sp")
  tid=""; blk=""
  check_block() {
    [ -n "$tid" ] || return
    m=""
    printf '%s' "$blk" | grep -qE 'class: (decision|execution|mechanical-ingest)' || m="$m class"
    printf '%s' "$blk" | tr '\n' ' ' | grep -qE '\[[^]]*\b(HITL|AFK)\b[^]]*\]' || m="$m autonomy"
    printf '%s' "$blk" | grep -qE '^Depends-on:' || m="$m Depends-on"
    printf '%s' "$blk" | grep -qE '^Layers:' || m="$m Layers"
    printf '%s' "$blk" | grep -qE '\*\*Acceptance:\*\*' || m="$m Acceptance"
    if [ -n "$m" ]; then bad "$sp $tid missing:$m"; else ok "$sp $tid schema complete"; fi
  }
  while IFS= read -r line; do
    case "$line" in
      "### "*)
        check_block
        tid=$(printf '%s' "$line" | grep -oE '^### T[0-9]+')
        blk="$line"
        ;;
      *)
        blk="$blk
$line"
        ;;
    esac
  done <<PLANEOF
$plan
PLANEOF
  check_block
done

# --- 12. Zero-API eval harnesses wired into the gate (TD-013, split TD-016/SPRINT-042 T4) ---
# TD-012 retained fixtures + assertion scripts for shipped snippets/checks, but nothing ran them
# automatically -- TD-013 named that gap. Only the zero-API harnesses belong here: qa-check is fast
# and always-on, while the behavioural real-run fixtures (evals/README.md "Real-run fixtures") cost
# API tokens and stay a manual `sh evals/run-...` step. Each harness's own exit status is captured
# directly via command substitution -- never through a pipe or a redirect whose own failure (e.g. an
# unset $TMPDIR) could masquerade as the harness's verdict (CLAUDE.md Edit-safety trap (c)). A
# harness that can't even be found or that exits non-zero for any reason is its own named FAIL,
# never a silent skip.
#
# TD-016 split: the 3 selftest-assert-* harnesses each spin up many throwaway git repos and are the
# slow part of this leg, so they moved behind an opt-in flag (QA_FULL=1) instead of running bare.
# TD-016's own row phrased the cut as "snippet runners vs selftests" -- but that phrasing is a proxy
# for the real axis, which is runtime. run-layers-completeness-fixtures.sh is maintainer-facing like
# the selftests, yet it stays always-on: it's cheap (extracts + diffs, no throwaway repos), and
# putting a cheap check behind a flag buys nothing while its false-negative is a corrupted merge
# (leg 14 below, TD-020). Where the proxy and the cost disagree, cost wins.
#
# run-spec-reader-fixtures.sh (SPRINT-075 T1) is always-on by that same cost rule: pure awk over the
# spec plus a few mktemp copies of it -- no git, no throwaway repos. It guards the ENGINE's rule
# source, so its false negative is every rule silently unchecked at once (L-058): the cheapest
# possible check standing in front of the most expensive possible miss.
#
# run-conformance-engine-fixtures.sh (SPRINT-075 T2) joins by the same rule: no git, throwaway
# directories only via mktemp -d, doctored spec copies via awk. It guards the engine's driver -- mark-
# driven dispatch, the registry lookup, and the level/report arithmetic -- which is what leg 2f-ter
# above runs on every gate (informationally; see that leg's own comment for why not yet gating).
#
# run-ownership-header-fixtures.sh (SPRINT-075 T6) joins by the same cost rule: no git, mktemp -d
# fixture dirs and one awk-derived spec copy. It guards the engine's FIRST new coverage -- the §1/§3
# ownership-header family -- whose five published finding names are a contract the engine must keep
# firing exactly (L-058 · TD-012), and whose exclusion list is the part that fails GREEN when it is
# wrong (a nested README dropped by a too-broad glob, caught only by a census disagreeing by one).
#
# run-foreign-repo-fixtures.sh (SPRINT-075 T3) joins by the same cost rule and guards the claim the
# whole epic rests on: that a repository which never installed lean-flow gets an answer it can act on.
# It is the only harness here whose target is built from nothing -- no lean-flow file is copied in --
# and it asserts that property mechanically, because a future edit that copies a template in would
# run-adr-family-fixtures.sh (SPRINT-076 T2) is a DELIBERATE EXCEPTION to the cost rule above, ruled
# by the owner at T2 rather than assumed. It BUILDS GIT REPOSITORIES -- three of them, for S4.APPEND's
# must-FAIL, marker-passes and shallow-clone cases -- which is the property that put the 34s
# run-attestation-fixtures.sh in the opt-in set below. It costs 27s. It is always-on anyway because
# the §4 family is the engine's first coverage whose correctness this repo can check against ITSELF:
# 27 real ADRs, two of them (ADR-008 · ADR-027) carrying legitimate post-decision markers that a
# wrong S4.APPEND would redden. A rule that fails on our own correctly-amended ADRs is unusable
# before it ever reaches an adopter, and finding that out only when someone remembers to run an
# opt-in harness is how a shipped gate goes unguarded (TD-012 · L-058).
# make the run measure our own shape wearing a stranger's name without failing anything (L-015 · L-016).
# run-s2-placement-fixtures.sh (SPRINT-076 T3) joins the always-on set by the ORIGINAL cost rule, not
# by T2's exception: no git, mktemp -d fixture repos built with printf, one awk-derived spec copy. It
# guards §2's placement pair, whose required set is derived from the spec's own `Create ←` cells --
# so a §2 row that stops saying "always" changes the engine and this harness together, and neither
# can drift from the other silently.
eval_harnesses_always="run-skill-freshness-fixtures.sh run-worktree-usability-fixtures.sh run-dispatch-preflight-fixtures.sh run-layers-completeness-fixtures.sh run-sprint-log-layout-fixtures.sh run-count-claims-fixtures.sh run-epic-archive-fixtures.sh run-research-archive-fixtures.sh run-ephemeral-intake-fixtures.sh run-task-origin-fixtures.sh run-doc-caps-fixtures.sh run-sprint-close-fixtures.sh run-manifest-lockstep-fixtures.sh run-gates-signed-fixtures.sh run-night-run-rollup-fixtures.sh run-system-verify-fixtures.sh run-spec-reader-fixtures.sh run-conformance-engine-fixtures.sh run-ownership-header-fixtures.sh run-foreign-repo-fixtures.sh run-adr-family-fixtures.sh run-s2-placement-fixtures.sh"
eval_harnesses_optin="selftest-assert-park-revisit.sh selftest-assert-boundary-park.sh selftest-assert-noaction-park.sh selftest-assert-judgement-retry.sh run-layers-observed-fixtures.sh run-worktree-base-fixtures.sh run-attestation-fixtures.sh"
# run-attestation-fixtures.sh (SPRINT-074 T2, TASK-228) joins the opt-in set by the same rule: it
# builds 6 throwaway repos via mktemp -d + git init, measured at ~2s on this host. Real git history
# is not optional -- §13 is DEFINED over git objects (trailers, parent count, %G?), and a merge
# commit and a resolving-vs-dead Evidence pin cannot be faked with hand-passed strings without
# testing this harness instead of the checker. Note the split: the CHECKER itself is always-on at
# leg 2f-bis above, because reading HEAD's existing objects builds nothing and is cheap.
# run-worktree-base-fixtures.sh (SPRINT-070 T2, TD-054) joins the opt-in set by the same rule, and it
# is the case where the rule costs something: the leg it guards -- a dispatched worktree silently
# branching from origin/main -- went unnoticed for six sprints, which is an argument for always-on.
# It loses to the rule anyway, because its two load-bearing cases cannot be made git-free: `stale`
# needs a worktree genuinely behind a shared ancestor, `divergent` needs an unrelated root, and
# hand-passed shas would test the harness rather than the guard. Costed rather than assumed: ~1.5s
# for 3 repos + 2 worktrees on this host. Revisit if the guard ever gains a git-free leg.
# run-layers-observed-fixtures.sh joins the opt-in set, not the always-on one: unlike
# run-layers-completeness-fixtures.sh (pure text diff, no git), it builds throwaway git repos via
# mktemp -d + git init -- the exact cost TD-016 named as the selftest-assert-* boundary (~4s for 4
# repos on this host). Cheap-and-git-free stays always-on; git-repo-building stays opt-in (SPRINT-043 T1).
# run-system-verify-fixtures.sh (SPRINT-068 T2, promoted from a nested harness -- see evals/README.md
# "fixtures/system-verify/") joins the always-on set: it's dependency-free POSIX sh over 5 static
# fixture logs, no git, no mktemp, measured at ~0.66s on this host -- well inside the cheap-and-git-free
# rule above, not the throwaway-repo cost TD-016 gated behind QA_FULL.
# Harnesses deliberately NOT gated at all (neither always-on nor opt-in). Empty is a valid state --
# but a paid/non-deterministic harness is excluded by being NAMED here with a reason, never by being
# left out of the lists above.
eval_harnesses_excluded=""

eval_harnesses="$eval_harnesses_always"
if [ "${QA_FULL:-0}" = "1" ]; then
  eval_harnesses="$eval_harnesses_always $eval_harnesses_optin"
  note "eval harnesses: QA_FULL=1 -- running opt-in selftests too"
else
  note "eval harnesses: bare run -- opt-in selftests skipped (set QA_FULL=1 to run them)"
fi
for h in $eval_harnesses; do
  hp="evals/$h"
  if [ ! -f "$hp" ]; then
    bad "eval harness $h: script not found at $hp"
    continue
  fi
  hout=$(sh "$hp" 2>&1); hcode=$?
  if [ "$hcode" -eq 0 ]; then
    ok "eval harness $h"
  else
    hfind=$(printf '%s\n' "$hout" | grep -E '^FAIL' | tr '\n' ';' | sed 's/;$//')
    [ -n "$hfind" ] || hfind="no FAIL line in output -- harness exited $hcode without reporting one"
    bad "eval harness $h (exit $hcode): $hfind"
  fi
done
# Completeness: a harness added to evals/ but never listed above is silently un-gated -- TD-013's
# exact shape, recreated. SPRINT-039 produced this live: W2 ran T2 and T3 in parallel, T2 landed a
# 6th zero-API harness, and T3's list (written before it existed) could not know. So the list is
# checked against disk rather than trusted. `assert-*.sh` are correctly outside this glob: they take
# a completed run's directory as an argument and have nothing to check standalone. Checked against
# the union of always-on + opt-in + excluded -- independent of whether QA_FULL is set this run, so a
# harness dropped from every list still FAILs on a bare run, not only under the flag.
for hp in evals/run-*.sh evals/selftest-*.sh; do
  [ -f "$hp" ] || continue
  h=${hp##*/}
  case " $eval_harnesses_always $eval_harnesses_optin $eval_harnesses_excluded " in
    *" $h "*) ;;
    *) bad "eval harness $h: in evals/ but neither gated (always-on or opt-in) nor explicitly excluded -- add it to eval_harnesses_always/eval_harnesses_optin, or to eval_harnesses_excluded with a reason" ;;
  esac
done

# --- 13. Headless park-record cue: migrate + init procedures (TD-019, SPRINT-041 T1) -------
# The ask-channel probe (`ToolSearch select:AskUserQuestion`) and the park-record instruction
# (write the halt into a `/handoff` doc) are one prose line each inside migrate and init's
# procedures. Their absence is invisible to every other check here -- a prose-only decline also
# writes nothing, so the in-repo park assertions keep passing either way (the silent-false-negative
# shape L-058 names). This leg reads the two procedure files directly and FAILs by name if either
# cue is missing from either file.
headless_procs="skills/lean-doc-generator/references/migration-map.md skills/lean-doc-generator/references/init.md"
for hp in $headless_procs; do
  if [ ! -f "$hp" ]; then
    bad "headless park-record cue $hp: file not found"
    continue
  fi
  if grep -qE 'ToolSearch select:AskUserQuestion' "$hp"
  then ok "headless park-record cue $hp: ask-channel probe present"
  else bad "headless park-record cue $hp: ask-channel probe (ToolSearch select:AskUserQuestion) missing"
  fi
  if grep -qE '/handoff` doc' "$hp"
  then ok "headless park-record cue $hp: park-record instruction (/handoff doc) present"
  else bad "headless park-record cue $hp: park-record instruction naming the /handoff doc missing"
  fi
done

# --- 14. Layers/Depends-on completeness vs DoD prose (TD-020, L-071, SPRINT-042 T3) --------
# The dispatch preflight's shared-file check reads a hand-written `Layers:` declaration -- sound
# logic, unvalidated input (L-071): a check over a manifest cannot detect an omission from that
# manifest, because omission looks identical to absence. SPRINT-041 is the real recorded miss: both
# T1 and T2's DoDs required marking a TD resolved, neither declared TECH-DEBT.md in Layers:, the
# preflight passed on the incomplete input, and two agents edited the file concurrently in separate
# worktrees -- merging clean only by ~19 lines of luck. This leg delegates to the retained checker
# (scripts/lib/check-layers-completeness.sh, itself covered by evals/run-layers-completeness-
# fixtures.sh) which derives a second, independently-sourced candidate set from each task block's
# own DoD+Acceptance prose and diffs it against Layers:/Depends-on:. Fails toward over-reporting by
# design (TD-020): a false positive costs a glance, the false negative above cost a corrupted merge.
lc_script="scripts/lib/check-layers-completeness.sh"
if [ ! -f "$lc_script" ]; then
  bad "layers completeness: checker not found at $lc_script"
else
  lc_files=$(ls docs/sprint/SPRINT-*.md 2>/dev/null)
  if [ -z "$lc_files" ]; then
    note "layers completeness: skip (missing): docs/sprint/SPRINT-*.md"
  else
    lc_out=$(sh "$lc_script" $lc_files 2>&1); lc_code=$?
    if [ "$lc_code" -eq 0 ]; then
      lc_n=$(printf '%s\n' "$lc_out" | grep -cE '^PASS')
      # Zero verified is a SKIP, never a PASS (TD-042). A green line over an empty input set is the
      # L-058 family in its purest form: the check cannot fail, so its PASS says nothing -- and the
      # only reason anyone noticed was comparing pass COUNTS across two runs.
      if [ "$lc_n" -eq 0 ]; then
        note "layers completeness: SKIP (0 block-checks verified -- nothing in scope)"
      else
        ok "layers completeness ($lc_n block-check(s) verified against DoD/Acceptance prose)"
      fi
    else
      lc_find=$(printf '%s\n' "$lc_out" | grep -E '^FAIL' | sed -E 's/^FAIL +//' | tr '\n' ';' | sed 's/;$//')
      [ -n "$lc_find" ] || lc_find="no FAIL line in output -- checker exited $lc_code without reporting one"
      bad "layers completeness: $lc_find"
    fi
  fi
fi

# --- 15. Layers observed vs actual git diff since plan_commit (TD-022, L-074, SPRINT-043 T1) ------
# Leg 14's second source is derived from DoD/Acceptance prose written at promote time -- and
# SPRINT-042 T3 defeated it the day it shipped: the task created scripts/lib/check-layers-
# completeness.sh, a file its own DoD prose never named, because a DoD written at promote cannot
# name a file invented during implementation (TD-022). Two documents written by one author at one
# moment are one source in two places (L-074) -- a second *authored* source closes the forgetting
# gap, not the inventing gap. This leg delegates to a third, OBSERVED checker
# (scripts/lib/check-layers-observed.sh, covered by evals/run-layers-observed-fixtures.sh) that
# diffs the actual git state since the sprint's recorded `plan_commit:` against the union of every
# task's declared `Layers:` -- it reads history rather than intent, so it cannot be forgotten the
# way a second sentence can. Fails toward over-reporting, same as leg 14.
lo_script="scripts/lib/check-layers-observed.sh"
if [ ! -f "$lo_script" ]; then
  bad "layers observed: checker not found at $lo_script"
else
  lo_files=$(ls docs/sprint/SPRINT-*.md 2>/dev/null)
  if [ -z "$lo_files" ]; then
    note "layers observed: skip (missing): docs/sprint/SPRINT-*.md"
  else
    lo_out=$(sh "$lo_script" $lo_files 2>&1); lo_code=$?
    if [ "$lo_code" -eq 0 ]; then
      lo_n=$(printf '%s\n' "$lo_out" | grep -cE '^PASS')
      # A sprint with uncommitted work now reports SKIP rather than PASS, because the WIP leg checks
      # a weaker rule than the committed one (SPRINT-074 T3, TD-037). Counting only PASS would read
      # that as "0 verified -- nothing in scope", which is both wrong and the silence T3 removed; and
      # this leg does not echo lo_out on success, so an unprinted SKIP would be invisible here even
      # though the checker said it. Both halves of the wiring, or the cure does not reach a reader
      # (L-020).
      lo_s=$(printf '%s\n' "$lo_out" | grep -cE '^SKIP')
      [ "$lo_s" -gt 0 ] && printf '%s\n' "$lo_out" | grep -E '^SKIP|^      '
      if [ "$((lo_n + lo_s))" -eq 0 ]; then
        note "layers observed: SKIP (0 sprint files verified -- nothing in scope)"
      elif [ "$lo_s" -gt 0 ]; then
        ok "layers observed ($lo_n fully verified against git diff since plan_commit; $lo_s with uncommitted work checked against the all-task union only -- see SKIP above)"
      else
        ok "layers observed ($lo_n sprint file(s) verified against actual git diff since plan_commit)"
      fi
    else
      lo_find=$(printf '%s\n' "$lo_out" | grep -E '^FAIL' | sed -E 's/^FAIL +//' | tr '\n' ';' | sed 's/;$//')
      [ -n "$lo_find" ] || lo_find="no FAIL line in output -- checker exited $lo_code without reporting one"
      bad "layers observed: $lo_find"
    fi
  fi
fi

# --- Summary ----------------------------------------------------------------
printf '\n----------------------------------------\n'
printf 'QA-CHECK: %s pass, %s fail\n' "$pass" "$fail"
[ "$fail" -eq 0 ] || exit 1
