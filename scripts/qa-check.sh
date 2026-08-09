#!/usr/bin/env sh
# qa-check.sh -- lean-flow structural QA check (mechanical rules only).
# Pairs with docs/QA.md, which carries the judgment rules a script cannot check.
# See docs/adr/ADR-008 for why this is the plugin's first executable code.
# Exit 0 = every mechanical rule passes; exit 1 = at least one FAIL.
#
# Usage:  sh scripts/qa-check.sh          (runs from anywhere; resolves the repo root via git)
#         QA_FULL=1 sh scripts/qa-check.sh  (also runs the 3 opt-in selftest-assert-* harnesses;
#                                             see leg 12, TD-016)

set -u

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT" || exit 2

fail=0
pass=0
note() { printf '      %s\n' "$1"; }
ok()   { pass=$((pass + 1)); printf 'PASS  %s\n' "$1"; }
bad()  { fail=$((fail + 1)); printf 'FAIL  %s\n' "$1"; }

# --- 1. Line caps (DOCS_Guide section 2) ------------------------------------
cap() { # <file> <maxlines>
  f=$1; max=$2
  [ -f "$f" ] || { note "skip (missing): $f"; return; }
  n=$(wc -l < "$f" | tr -d ' ')
  if [ "$n" -le "$max" ]; then ok "cap $f ($n <= $max)"; else bad "cap $f ($n > $max)"; fi
}

for s in skills/*/SKILL.md; do cap "$s" 140; done
cap .claude/CLAUDE.md 80
cap .claude/CONTEXT.md 130
for sp in docs/sprint/SPRINT-*.md; do [ -f "$sp" ] && cap "$sp" 400; done

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

# --- 2b. Epic retention (DOCS_Guide section 11, both directions) -------------------------------
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

# --- 2c. Research retention (DOCS_Guide section 11) ---------------------------------------------
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

# README.md carries ownership as a FOOTER LINE, not YAML frontmatter (DOCS_Guide exception).
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
  st=$(fmv "$sp" status)
  [ "$st" = "active" ] || continue
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
eval_harnesses_always="run-skill-freshness-fixtures.sh run-worktree-usability-fixtures.sh run-dispatch-preflight-fixtures.sh run-layers-completeness-fixtures.sh run-sprint-log-layout-fixtures.sh run-count-claims-fixtures.sh run-epic-archive-fixtures.sh run-research-archive-fixtures.sh"
eval_harnesses_optin="selftest-assert-boundary-park.sh selftest-assert-noaction-park.sh selftest-assert-judgement-retry.sh run-layers-observed-fixtures.sh"
# run-layers-observed-fixtures.sh joins the opt-in set, not the always-on one: unlike
# run-layers-completeness-fixtures.sh (pure text diff, no git), it builds throwaway git repos via
# mktemp -d + git init -- the exact cost TD-016 named as the selftest-assert-* boundary (~4s for 4
# repos on this host). Cheap-and-git-free stays always-on; git-repo-building stays opt-in (SPRINT-043 T1).
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
      ok "layers completeness ($lc_n block-check(s) verified against DoD/Acceptance prose)"
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
      ok "layers observed ($lo_n sprint file(s) verified against actual git diff since plan_commit)"
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
