#!/usr/bin/env sh
# qa-check.sh -- lean-flow structural QA check (mechanical rules only).
# Pairs with docs/QA.md, which carries the judgment rules a script cannot check.
# See docs/adr/ADR-008 for why this is the plugin's first executable code.
# Exit 0 = every mechanical rule passes; exit 1 = at least one FAIL.
#
# Usage:  sh scripts/qa-check.sh   (runs from anywhere; resolves the repo root via git)

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

for s in skills/*/SKILL.md; do cap "$s" 110; done
cap .claude/CLAUDE.md 80
cap .claude/CONTEXT.md 130
for sp in docs/sprint/SPRINT-*.md; do [ -f "$sp" ] && cap "$sp" 400; done

# --- 2. Count consistency (claims-vs-disk) ----------------------------------
# Extract the first integer matching <pattern> in <file>.
num() { grep -oE "$2" "$1" 2>/dev/null | grep -oE '[0-9]+' | head -n1; }

skills_actual=$(ls -d skills/*/SKILL.md 2>/dev/null | wc -l | tr -d ' ')
tmpl_files=$(ls skills/lean-doc-generator/templates/*.md.template 2>/dev/null | wc -l | tr -d ' ')
noncore=2   # canonical-but-non-core templates (outside the doc-generation loop): DESIGN, QA-TESTCASE
tmpl_core=$((tmpl_files - noncore))

check_claim() { # <label> <actual> <file> <pattern>
  lbl=$1; act=$2; file=$3; pat=$4
  [ -f "$file" ] || { note "skip (missing): $file"; return; }
  claim=$(num "$file" "$pat")
  if   [ -z "$claim" ];      then bad "$lbl: no claim found in $file"
  elif [ "$claim" = "$act" ]; then ok  "$lbl: $file claims $claim = disk $act"
  else                            bad "$lbl: $file claims $claim != disk $act"
  fi
}

check_claim "skills"    "$skills_actual" .claude/CONTEXT.md    'Skill roster \(([0-9]+)'
check_claim "skills"    "$skills_actual" docs/ARCHITECTURE.md  '([0-9]+) skills'
check_claim "skills"    "$skills_actual" .claude/CLAUDE.md     '([0-9]+) SKILL\.md'
check_claim "tmpl-core" "$tmpl_core"     .claude/CLAUDE.md     '([0-9]+) canonical doc templates'
check_claim "tmpl-core" "$tmpl_core"     docs/ARCHITECTURE.md  '([0-9]+) canonical doc templates'
note "templates: $tmpl_files files = $tmpl_core core + $noncore non-core (DESIGN, QA-TESTCASE)"

# --- 3. Frontmatter / ownership presence ------------------------------------
has_field() { grep -qE "^$2:" "$1"; }

for s in skills/*/SKILL.md; do
  if head -n1 "$s" | grep -q '^---$' && has_field "$s" name && has_field "$s" description
  then ok "frontmatter $s"; else bad "frontmatter $s (need ---/name/description)"; fi
done

for d in TODO.md .claude/CONTEXT.md docs/ARCHITECTURE.md docs/LEARNINGS.md docs/DECISIONS.md docs/CHANGELOG.md docs/knowledge-index.md; do
  [ -f "$d" ] || { note "skip (missing): $d"; continue; }
  if has_field "$d" owner && has_field "$d" last_updated && has_field "$d" status
  then ok "ownership $d"; else bad "ownership $d (need owner/last_updated/status)"; fi
done

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

# --- Summary ----------------------------------------------------------------
printf '\n----------------------------------------\n'
printf 'QA-CHECK: %s pass, %s fail\n' "$pass" "$fail"
[ "$fail" -eq 0 ] || exit 1
