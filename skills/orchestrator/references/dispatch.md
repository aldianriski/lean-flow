# Dispatch — how /orchestrator hands work to sub-agents

Loaded by `/orchestrator` at any Implement step. The orchestrator is the `decision` tier: it **coordinates**
(plan · gate · grill · design · synthesis · merge results) — it does **not** do execution work inline. Work
is dispatched to sub-agents **by each task's classification**. (Doctrine: route by NATURE, not size —
ambiguity/consequence up, volume/repetition down; ADR-010.)

## Route by classification (nature, not size)

Each task carries a persisted `class:` field (advisory default set at decompose / G1). Dispatch reads it as
the default — task *size* is irrelevant — but may override at dispatch time; ADR-010's dispatch-time
classification stays authoritative:

| Classification | Tier (default map) | Dispatched? | Runs on |
|---|---|---|---|
| `decision` — ambiguity/consequence (gates · grill · design · synthesis) | session model (Opus) | no — stays inline | the orchestrator itself |
| `execution` — code from a spec · recon · analysis · drafting | Sonnet | **yes, by default** | a `general-purpose` sub-agent + its procedure skill |
| `mechanical-ingest` — extraction · validation · formatting · high-volume | Haiku | **yes, by default** | a `general-purpose` sub-agent |

**Default-spawn, not always-spawn.** A `decision`-nature or genuinely trivial step (a one-line edit, a quick
judgment call) stays inline — but only with a *stated reason*. The failure this prevents: the coordinator
doing `execution`/`mechanical` work itself instead of dispatching it (the observed "orchestrator never spawns" bug).

## Hand the sub-agent its procedure skill (not a re-described brief)

Dispatch on a `general-purpose` sub-agent (NOT `Explore`/`Plan` — those skip CLAUDE.md, losing project
context) with the relevant **procedure skill** invoked at runtime via the Skill tool: new behaviour →
`/tdd` · bug → `/diagnose` · hard-to-change → `/refactor-advisor`. The skill is the maintained procedure; a
paraphrased brief drifts from it (ADR-010 skill-dispatch amendment, mechanism C).

## Implement routing (which procedure the dispatched agent runs)

Pick the routed skill from the **work type**, then hand that skill to the sub-agent (above):

| Work type | Routes to |
|---|---|
| NEW testable behaviour | `/tdd` — **the default**, test-first red-green-refactor in vertical slices; test type → `tdd/references/test-strategy.md` |
| a bug / failing test | `/diagnose` — it already writes the regression test first |
| code that's hard to change (shallow modules, leaky seams) | `/refactor-advisor` |
| docs · config · spikes | implement directly, no routed skill |

**Declining `/tdd` needs a stated reason** — the owner opts out, or the repo has no harness. Either way,
note a manual verification step in its place; a silent skip is how spec-only debt enters (L-007).

**Drive with `/goal`.** Set a `/goal` equal to the task's done-when / acceptance so execution keeps working
across turns until it is verifiably met (Goal-Driven Execution, native), then clear it at task end.

## Pre-dispatch preflight (cycle · ownership · base-ref · waves)

Runs before any wave-shape decision below — the Parallel-vs-sequential call is only as good as the
tokens it's read from, so read them mechanically first. Derives four things from the three markup
tokens every active-sprint Plan task already carries mandatorily (`### Tn` · `Layers:` ·
`Depends-on:`) — no new file format, no second source of truth (ADR-013: a no-JSON preflight over
this markup proved sufficient; a compiled DAG was rejected as a needless second SSOT):

1. **Cycle check** — the `Depends-on` graph must be acyclic; a cycle means no valid dispatch order exists.
2. **Shared-file single-owner check** — a file named in more than one task's `Layers:` needs an
   ordering. A `Depends-on:` path between the two tasks — a direct edge, or a chain through
   intermediate tasks — makes it a PASS, with ownership order derived from that edge or chain; no
   path between them either direction is a FAIL — an unowned overlap, the exact hazard concurrent
   dispatch creates. (TD-025: sequential execution can't collide, so a transitive chain already
   satisfies the check's intent — derived from the same `Depends-on:` markup, no new field.)
3. **Base-ref check** — the wave's declared base commit (stated up front, never assumed) must equal
   live HEAD; drift means unrelated work landed since declaration (L-055's root cause). **This leg is
   coordinator-side only — it says nothing about the base a spawned worktree actually gets**, and the
   two were assumed to be the same thing for six sprints (TD-054). The worktree's own base is checked
   after spawn by the **worktree-base guard** in § Worktree dispatch protocol; a CLEAR here is not a
   statement about any worktree.
4. **Wave computation** — topological rank over the `Depends-on` DAG; rank 0 dispatches in parallel,
   higher ranks wait behind a barrier.

Any FAIL halts the wave and reports its own named finding — a bare "FAIL" doesn't tell a morning
rollup which check tripped (L-058: a gate needs a must-FAIL fixture per check, proven on this one).

Optional snippet, dependency-free POSIX sh, runnable verbatim on a sprint file (`$1`) and the
declared base commit (`$2`). Run it bare — never piped into a formatter inside an `&&` chain; a
POSIX pipeline's exit status is its last command's, so `check | tail && dispatch` would dispatch
through a real FAIL (L-057). Its Plan-parsing loop is guarded (`read … || [ -n "$line" ]`) because an
unguarded `while read` silently drops the file's last line — degrading check 2 to a false PASS on a
real overlap (L-058's own finding):

<!-- dispatch-preflight:start -->
```sh
#!/bin/sh
# Dispatch preflight -- derives cycle / shared-file-ownership / base-ref / wave-rank
# from a sprint's Plan (### Tn, Layers:, Depends-on:). Exit 0 = clear; exit >0 = halt.
sprint="${1:?usage: preflight.sh <sprint.md> <declared-base-ref>}"
declared_base="${2:?usage: preflight.sh <sprint.md> <declared-base-ref>}"
[ -f "$sprint" ] || { echo "FAIL sprint-not-found: $sprint"; exit 1; }

fail=0
records=$(mktemp)
trap 'rm -f "$records"' EXIT

# --- base-ref check: declared base must equal live HEAD -----------------
declared_sha=$(git rev-parse --verify -q "${declared_base}^{commit}" 2>/dev/null)
live_sha=$(git rev-parse HEAD 2>/dev/null)
if [ -z "$declared_sha" ] || [ "$declared_sha" != "$live_sha" ]; then
  echo "FAIL base-ref-drift: declared base ($declared_base -> ${declared_sha:-unresolved}) != live HEAD ($live_sha)"
  fail=1
else
  echo "PASS base-ref: declared base matches live HEAD ($live_sha)"
fi

# --- parse the Plan section: one guarded pass over the raw file ---------
# Guard note (L-058): `read` on the file's last line returns non-zero if that
# line has no trailing newline -- `|| [ -n "$line" ]` still lets the body run
# once more for it, so a single-file Layers: entry on the final line survives.
# TOK (TD-043): a token is file-shaped (carries a .ext) OR directory-shaped (ends in "/"). The
# directory arm matters because `Layers: evals/fixtures/` carries no dot at all, so a file-only
# pattern skipped it silently and two tasks could declare the same tree with no overlap reported.
TOK='[A-Za-z0-9_./-]+\.[A-Za-z0-9]+|[A-Za-z0-9_.-][A-Za-z0-9_./-]*/'
inplan=0; tid=""; layers=""; deps=""; cur=""
flush() { [ -n "$tid" ] && printf '%s\t%s\t%s\n' "$tid" "$layers" "$deps" >>"$records"; }
while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in
    "## Plan"*) inplan=1; continue ;;
    "## "*) inplan=0 ;;
  esac
  [ "$inplan" = 1 ] || continue
  case "$line" in
    "### T"*)
      flush
      tid=$(printf '%s' "$line" | grep -oE '^### T[0-9]+' | sed 's/^### //')
      layers=""; deps=""; cur=""
      ;;
    "Layers:"*)
      cur=L; layers="$layers$(printf '%s' "$line" | grep -oE "$TOK" | tr '\n' ',')"
      ;;
    "Depends-on:"*)
      cur=D; deps="$deps$(printf '%s' "$line" | grep -oE 'T[0-9]+' | tr '\n' ',')"
      ;;
    "Cites:"*)
      cur=C
      ;;
    [[:blank:]]*)
      # An INDENTED line CONTINUES the declaration above it (TD-040), matching how the full
      # checker and TODO.md entries already wrap. Previously only column-0 `Layers:` lines were
      # read, so a wrapped declaration kept its first line and every path on the continuation was
      # invisible -- a silent false PASS on a real overlap, observed live at the SPRINT-053 and
      # SPRINT-054 promotes. A `Cites:` continuation is deliberately NOT collected: those tokens
      # are cited, not touched, so folding them into Layers: would invent overlaps.
      case "$cur" in
        L) layers="$layers$(printf '%s' "$line" | grep -oE "$TOK" | tr '\n' ',')" ;;
        D) deps="$deps$(printf '%s' "$line" | grep -oE 'T[0-9]+' | tr '\n' ',')" ;;
      esac
      ;;
    *) cur="" ;;
  esac
done < "$sprint"
flush

# --- cycle check + wave computation (topological rank) + shared-file check
awk -F'\t' '
# find_chain(tgt, anchor): walks the Depends-on graph back from tgt to anchor and returns the
# derived order as "anchor -> ... -> tgt" (TD-025 -- names the chain, not just the two endpoints,
# so a PASS reads as ownership-by-chain rather than ownership-by-direct-edge). visited guards
# against runaway recursion if this is ever reached alongside an undetected cycle.
# overlaps(x,y): two declared tokens collide when they are the same path, OR when one is a
# directory token (trailing "/") that prefixes the other (TD-043). Without the prefix arm `evals/`
# and `evals/fixtures/dispatch-preflight/` read as unrelated files and a genuinely shared tree
# dispatches unowned -- the same silent false PASS the equality-only test was already producing.
function overlaps(x, y) {
  if (x == y) return 1
  if (substr(x, length(x), 1) == "/" && substr(y, 1, length(x)) == x) return 1
  if (substr(y, length(y), 1) == "/" && substr(x, 1, length(y)) == y) return 1
  return 0
}
function find_chain(tgt, anchor, visited,   d, m, darr, j, chainsub, v2) {
  if (tgt == anchor) return tgt
  if (index(","visited",", ","tgt",") > 0) return ""
  v2 = visited","tgt
  if (index(","deps[tgt]",", ","anchor",") > 0) return anchor" -> "tgt
  m = split(deps[tgt], darr, ",")
  for (j=1; j<=m; j++) {
    d = darr[j]; if (d == "") continue
    if (index(reach[d], ","anchor",") > 0) {
      chainsub = find_chain(d, anchor, v2)
      if (chainsub != "") return chainsub" -> "tgt
    }
  }
  return ""
}
{ order[NR]=$1; layers[$1]=$2; deps[$1]=$3; n=NR }
END {
  fail=0
  for (i=1;i<=n;i++) rank[order[i]]=-1

  # --- transitive closure of Depends-on (TD-025) ---------------------------
  # reach[t] holds every task t transitively depends on (direct or chained), computed by
  # fixed-point expansion over the same Depends-on markup already parsed above -- no new field,
  # no second source of truth (ADR-013). Used below so the shared-file check recognises a
  # dependency CHAIN as ownership, not only a direct edge.
  for (i=1;i<=n;i++) { t=order[i]; reach[t]="," }
  for (i=1;i<=n;i++) {
    t=order[i]; dl=deps[t]; if (dl=="") continue
    m=split(dl,darr,",")
    for (j=1;j<=m;j++) { d=darr[j]; if (d=="") continue; if (index(reach[t],","d",")==0) reach[t]=reach[t] d "," }
  }
  for (iter=1; iter<=n; iter++) {
    for (i=1;i<=n;i++) {
      t=order[i]
      nr=split(reach[t],rarr,",")
      for (k=1;k<=nr;k++) {
        a=rarr[k]; if (a=="") continue
        na=split(reach[a],aarr,",")
        for (kk=1;kk<=na;kk++) {
          e=aarr[kk]; if (e=="") continue
          if (index(reach[t],","e",")==0) reach[t]=reach[t] e ","
        }
      }
    }
  }

  for (iter=1; iter<=n+1; iter++) {
    progress=0
    for (i=1;i<=n;i++) {
      t=order[i]
      if (rank[t] != -1) continue
      dl=deps[t]; ok=1; mx=-1
      if (dl != "") {
        m=split(dl,darr,",")
        for (j=1;j<=m;j++) {
          d=darr[j]; if (d=="") continue
          if (rank[d]==-1) { ok=0; break }
          if (rank[d]>mx) mx=rank[d]
        }
      }
      if (ok) { rank[t]=mx+1; progress=1 }
    }
    if (!progress) break
  }
  cyc=""
  for (i=1;i<=n;i++) { t=order[i]; if (rank[t]==-1) cyc=cyc" "t }
  if (cyc != "") { print "FAIL cycle-detected: tasks unresolved ->" cyc; fail=1 }
  else { line="PASS wave-computation:"; for (i=1;i<=n;i++) line=line" "order[i]"="rank[order[i]]; print line }

  for (i=1;i<=n;i++) {
    ti=order[i]; li=layers[ti]; if (li=="") continue
    ni=split(li,fi,",")
    for (j=i+1;j<=n;j++) {
      tj=order[j]; lj=layers[tj]; if (lj=="") continue
      nj=split(lj,fj,",")
      for (a=1;a<=ni;a++) { if (fi[a]=="") continue
        for (b=1;b<=nj;b++) { if (fj[b]=="") continue
          if (overlaps(fi[a],fj[b])) {
            # name BOTH tokens when they collide by prefix rather than by equality, so the finding
            # reads as the tree it is and not as a file neither task declared.
            lbl = (fi[a]==fj[b]) ? fi[a] : fi[a]" ~ "fj[b]
            edge=0; direct=0; first=""; second=""; chain=""
            if (index(","deps[tj]",", ","ti",")>0) { edge=1; direct=1; first=ti; second=tj }
            else if (index(","deps[ti]",", ","tj",")>0) { edge=1; direct=1; first=tj; second=ti }
            else if (index(reach[tj], ","ti",")>0) { edge=1; direct=0; first=ti; second=tj; chain=find_chain(tj,ti,"") }
            else if (index(reach[ti], ","tj",")>0) { edge=1; direct=0; first=tj; second=ti; chain=find_chain(ti,tj,"") }
            if (edge && direct) print "PASS shared-file-owned: "lbl" in "ti","tj" order="first"->"second
            else if (edge) print "PASS shared-file-owned-transitive: "lbl" in "ti","tj" derived-order="chain
            else { print "FAIL shared-file-unowned: "lbl" in "ti" and "tj" has no Depends-on edge, direct or transitive"; fail=1 }
          }
        }
      }
    }
  }
  exit fail
}' "$records"
[ $? -ne 0 ] && fail=1

[ "$fail" -eq 0 ] && echo "PREFLIGHT: CLEAR" || echo "PREFLIGHT: HALT"
exit $fail
```
<!-- dispatch-preflight:end -->

## Parallel vs sequential

Decide from the **G2 overlap-ownership map** — the same map that assigns shared-file single-owner + order:

- **Parallel** — a task with **no shared file AND a persisted `Depends-on: none`** is independent. Dispatch
  independent tasks concurrently by issuing **multiple Agent calls in a single assistant message** (they run
  as background sub-agents). This is the speed win of `sprint-bulk`.
- **Sequential** — a task that **shares a file** (per the overlap map) or has a persisted `Depends-on:` list
  runs after its predecessor, in the ownership/commit order; stage shared files per-hunk (`git add -p`) —
  promoted rule.

Group the Plan into **parallel batches separated by sequential barriers**: fan out each batch of independent
tasks in one message, await it, then the next. Worktree isolation for a parallel batch is **first-class —
the protocol below**; `/batch` (one worktree sub-agent per unit → PR each; `/workflows` watches) remains the
escalation for very large fan-out where scripted determinism matters.

**Cost term** — fan-out cost scales with **branch-count × substrate-size, not call-count**: every branch
re-pays the full base substrate (CLAUDE.md + tool context) before doing any work; weigh it before fanning
out many trivial steps (ADR-010 addendum 2026-07-29).

## Worktree dispatch protocol (parallel fleet)

Fires at **sprint-bulk** when the G2 overlap map marks a batch's tasks disjoint (no shared file,
no `depends-on`): dispatch one `Agent(isolation: "worktree")` call per disjoint task, all in a
**single message**. Soft cap **3–5 concurrent** — no first-party concurrency limit is published
(folklore only); revisit if one ships. Rationale/decisions: the lean-flow repo's `docs/research/fog-fleet-orchestration.md`.

Each agent gets its own branch + working tree; it commits only its own files there and **never**
runs a tree-wide git state op (`stash` / `checkout` / `restore` / `reset`) — a state op on a shared
tree can sweep a sibling's uncommitted work (L-043; state this ban verbatim in every worktree
dispatch brief). It never touches a **coordinator-owned** file — and two kinds qualify, only one of
which the map can see:

- **(a) Files the overlap map marks shared.** Derived from `Layers:`, so the map sees them by design.
- **(b) Sprint infrastructure** — the sprint **Plan file** (its DoD ticks and § Files Changed) and its
  **Execution Log** sibling. Every task writes these; **no task declares them**, so they are in no
  `Layers:` and the map cannot mark them *by construction*. `check-layers-observed.sh` already excludes
  `docs/sprint/*` on exactly this reasoning and already calls it coordinator-owned — the protection
  exists in the checker and was missing from the brief.

**A dispatched agent returns its Execution Log entry inside its report; the coordinator appends it at
merge-back.** The agent does not create or edit the Log, tick a DoD box, or touch § Plan.

Proven live and this is why the clause is split: SPRINT-063 dispatched one agent whose brief correctly
banned editing § Plan and ticking DoD **and said nothing about the Log** — so the coordinator and the
agent each created `docs/sprint/logs/SPRINT-063-headroom.md`, and the two versions were merged by hand.
The brief enumerated the members it could think of rather than the class; naming only (a) leaves (b)
unguarded (SPRINT-064 T3).

Claude-only v1 — external CLI agents are out of scope until a real consumer signal; the
pre-decided shape (BYO opt-in + AGENTS.md brief carrier) is parked, not built.

Guardrail: stale-branch reuse on agent-id collision is an open harness issue (#51596). Before
dispatch, `git worktree list` should show no leftover agent worktrees — clean any first.

**Declared-base rule** (ADR-013 · L-055): every worktree/agent branches from the current wave's
declared base commit — stated up front, then verified against live HEAD at spawn, never assumed.
Mismatch halts dispatch for the wave. Re-run the check at every wave boundary, not just once at the
start — HEAD moves as waves land, so a base verified for wave 1 is stale by wave 2.

### The stale base is a pin, and the pin is documented default behaviour

Agent worktrees fork from the **remote default branch**, not local HEAD. This is not drift, not a
harness bug, and not something that varies run to run: `worktree.baseRef` defaults to `"fresh"`,
which branches from `origin/HEAD`. A repo whose local branch runs ahead of its remote — anywhere push
is deliberate rather than continuous — therefore hands **every** agent the same stale sha, sprint
after sprint, and the sha only looks arbitrary until you resolve `origin/HEAD` and find it staring
back. Measured here: four worktrees across two sprints all branched from `622f420`, which was exactly
`origin/main` while local `main` sat 31 commits ahead (TD-054 · L-046, first recorded SPRINT-026).

Two details worth knowing before you reason about a base you did not check:

- On a `"fresh"` base, `origin/HEAD` is refreshed by a fetch if the repo has not been fetched in 24h
  (capped ~5s, falling back to the cached ref). "Current" therefore means *current to the remote*,
  which is not a claim about your tree at all.
- With **no remote configured**, or an `origin/HEAD` that is neither cached nor fetchable, the
  worktree silently falls back to local HEAD — so the same setting produces opposite bases in two
  repos, and a run that "worked last time" proves nothing about this one.

**Cure, in this order.** Set `worktree.baseRef: "head"` in `.claude/settings.json` so worktrees carry
unpushed work — that removes the pin at its cause. Then keep the guard below, because the setting is
per-repo, silently absent in a fresh clone, and reverts to `"fresh"` the moment someone drops the
key. Do **not** reach for `git push` as the fix: it makes the base current exactly once and re-breaks
on the next unpushed commit, which is a coincidence wearing a fix's clothes.

```json
{ "worktree": { "baseRef": "head" } }
```

**Corollary that survives either setting: a task EDITING a file that exists only in unpushed commits
must not be worktree-dispatched under a `"fresh"` base** — the merge becomes add/add on that file.
Fall back to shared-tree parallel dispatch (disjoint files, agents run no git writes, coordinator
commits sequentially). Where the stale base is merely inconvenient rather than disqualifying, brief
agents to read newer docs via `git show main:<path>` (read-only, L-043-safe); the three-way merge
reconciles the old base as long as only the task's own files changed on its branch.

### Worktree-base guard (runs after spawn, before the agent does real work)

The preflight's base-ref leg is coordinator-side and cannot see this — it compares the *declared*
base to live HEAD, both in the main checkout. This guard compares the base the worktree **actually
got** against the coordinator's HEAD, and halts naming what it found rather than leaving it to
surface as a merge conflict two hours later. Run it per spawned worktree; a non-zero exit halts that
dispatch, not the wave's other agents.

<!-- worktree-base-guard:start -->
```sh
#!/bin/sh
# Worktree-base guard -- the base a SPAWNED worktree actually got must equal the coordinator's HEAD.
# Complements the pre-dispatch preflight's base-ref leg, which only ever compares the declared base
# to live HEAD in the main checkout and is silent about worktrees (TD-054, six sprints).
# Exit 0 = clear; exit >0 = halt this dispatch.
wt="${1:?usage: worktree-base-guard.sh <worktree-path> <coordinator-sha>}"
coord="${2:?usage: worktree-base-guard.sh <worktree-path> <coordinator-sha>}"

# Resolve the coordinator's side FIRST. An unresolvable expectation is a broken invocation, not a
# stale worktree -- reporting it as drift would name the wrong culprit and send the reader to the
# wrong fix (L-091: a guard against the wrong cause guards nothing).
coord_sha=$(git rev-parse --verify -q "${coord}^{commit}" 2>/dev/null)
[ -n "$coord_sha" ] || { echo "FAIL worktree-base-unresolved: coordinator ref '$coord' does not resolve"; exit 2; }

[ -d "$wt" ] || { echo "FAIL worktree-base-missing: no worktree at '$wt'"; exit 2; }
wt_sha=$(git -C "$wt" rev-parse --verify -q HEAD 2>/dev/null)
[ -n "$wt_sha" ] || { echo "FAIL worktree-base-unreadable: cannot read HEAD in '$wt'"; exit 2; }

if [ "$wt_sha" != "$coord_sha" ]; then
  # Name the gap in commits, not just the two shas: "3 behind" is actionable, two hex strings are a
  # puzzle. Count only when the worktree's base is an ancestor -- an unrelated base has no count.
  if git merge-base --is-ancestor "$wt_sha" "$coord_sha" 2>/dev/null; then
    behind=$(git rev-list --count "$wt_sha..$coord_sha" 2>/dev/null)
    echo "FAIL worktree-base-stale: worktree '$wt' is at $wt_sha, $behind commit(s) behind coordinator HEAD $coord_sha -- set worktree.baseRef to \"head\" (see the cure above); do NOT push to close the gap"
  else
    echo "FAIL worktree-base-divergent: worktree '$wt' is at $wt_sha, which is not an ancestor of coordinator HEAD $coord_sha -- unrelated base, do not merge"
  fi
  exit 1
fi
echo "PASS worktree-base: '$wt' branched from coordinator HEAD ($coord_sha)"
exit 0
```
<!-- worktree-base-guard:end -->

**Record the result in the Execution Log either way.** A PASS is the observation that keeps TD-054
closed; a silent PASS is indistinguishable from never having run the guard, which is the state the
row spent six sprints in.

**Capture the base from inside the worktree, or you will not capture it at all.** A subagent worktree
that finishes *without changes* is removed automatically the moment the agent returns — **and its
branch goes with it**. There is then nothing left to point the guard at: the path is gone, the ref
does not resolve, and a coordinator that planned to verify the base after the report finds only its
own tree. Observed exactly this way on the first dispatch after the pin was cured. So put
`git rev-parse HEAD` **in the agent's brief** and have it report the sha in its own output, and run
the guard while the agent is live. A read-only measurement agent leaves no changes by construction,
which makes it the *most* likely to be swept before you can check it.

## Merge-back queue (coordinator-only)

Once a wave completes, merge on a **separate integration worktree** — never switch the main tree,
which may hold the coordinator's own WIP. Merge sequentially in **G2-ownership order**, one
`--no-ff` commit per task (clean per-task revert via `git revert -m 1`).

**Unattended runs must have these commands pre-authorized.** Integration-worktree creation, the merge,
and the cleanup below are the run's landing path — every task's output funnels through them, so a
permission denial here strands an entire successful wave on its branches. They are source 2 of the
allowlist derivation in `night-run.md` Part 1; that list is built from this section, so a step added
here is a step to add there.

Review two-tier: **pre-merge** — full scoped review of each branch's diff, against that task's own
branch (the primary pass). **Post-merge** — an interaction-only smoke check per wave (lint/verify),
catching what per-branch review can't: cross-task interaction.

Conflicts: **expected** (overlap map named this file) → re-dispatch that agent to rebase onto the
new tip. **Surprise** (map missed it) → halt that task only, kick back to G2 — the map was
incomplete. Resolution is coordinator-owned, never a blind sub-agent. First-blocker-halt is
per-task; a whole wave halts only on a transitive dependency.

**Resolving a hunk: recover both intents first.** Read the commit messages (and the task blocks) behind
each side before choosing — a conflict is two authors who each had a reason, and the diff shows neither.
Preserve both intents where they compose; where they genuinely cannot, keep the one matching the merge's
stated goal and note the trade-off in the merge commit. **Never invent new behaviour** to bridge them,
and **always resolve rather than `--abort`** — abandoning the merge strands the wave that was the whole
point of the fan-out. SPRINT-041's corrupted merge is why this is written down.

A broken or incomplete worktree never merges — return the task to backlog with an unblock
condition, salvage any doc/research artifacts, drop the code.

Cleanup (coordinator-only): leave the worktree directory **before** removing it — Windows holds a
handle-lock on any worktree a shell has `cd`'d into, so removal from inside it fails
Permission-denied mid-way (admin entry gone, directory left) (L-044). Retry `git worktree remove`
from a fresh shell, `rm` any stray directory, `git worktree prune`, verify with `git worktree list`.

L-042's per-hunk staging rule (`git add -p` on a shared file) still binds **intra-tree only** —
sequential tasks sharing one tree, or the coordinator staging conflict resolutions here. Worktree
isolation obsoletes it at the cross-worktree boundary: disjoint tasks never share a tree to begin with.

### System verify (the final-wave full gate)

This upgrades the "interaction-only smoke check per wave" above from a lint/verify skim to one named
**full-gate pass**. It fires **once** — after the run's **FINAL** wave has merged back, never per-wave
— against the fully integrated tree, because that is the only point where cross-task interaction is
complete and there is nothing later to invalidate the verdict.

**The gate command is DISCOVERED, never hard-coded.** A dispatched builder or the coordinator has no
business assuming what "the tests" means in a host repo it doesn't own — the wrong assumption silently
runs nothing, or runs the wrong thing, and reports a false PASS. Discover in this order and stop at the
first hit: **(1)** the host's package manifest — a `test` / `check` / `verify` script (`package.json`
"scripts", `pyproject.toml`, `Cargo.toml`, etc., whichever the repo's manifest actually is); **(2)** a
`Makefile` or `justfile` target of the same names; **(3)** the test step of a CI config in the repo
(`.github/workflows/*`, etc.) — read its command, don't re-derive one; **(4)** a `.gate-command` file
at the repo root — its first non-blank, non-`#` line is the command, run from the root.

**Why rung 4 exists, and why it is last.** The first three read artifacts a repo keeps for other
reasons, which is what makes them trustworthy — nobody writes a `package.json` to satisfy this pass.
But all three can miss on a repo that genuinely has a gate, and then the discovery order reports *no
gate* about a repo that runs one on every commit. That is not hypothetical: **lean-flow itself is such
a repo** — no package manifest, no `Makefile`, no `justfile`, no CI workflow, while `sh
scripts/qa-check.sh` gates every commit. Until SPRINT-082 this file claimed lean-flow "dogfoods this as
`sh scripts/qa-check.sh`", which was true of the repository and false of the procedure: the command
existed and the discovery order could not reach it (ADR-033). Rung 4 is last because a declaration is
the weakest evidence here — it is written *for* this pass and can go stale against a repo that later
grows a real manifest, so anything discoverable wins over it.

A `.gate-command` that is present but declares nothing readable is **`gate-declaration-unreadable`**
and does **not** count as a discovered gate — a declaration nobody can read is worse than none,
because it looks like an answer (ADR-031's reasoning · L-058). Absence of the file is not a finding.

**Nothing found on any rung** → the run is in the `no-gate-discovered` case, and **what happens next
depends on the change's risk class, not on the mere absence of a gate** — see below. Any command that
*is* discovered is still stated as the discovery *output* one host happens to produce, never as a path
a consumer's skill should assume or inherit (L-015): a different host discovers a different command
through the same four rungs.

**`no-gate-discovered` is not a verdict of "nothing to block on" — that reading was the defect.**
Absence of evidence was being read as evidence of absence: a behavioural change could close having
proved nothing, leaving no trace that nothing had been proved. Route on the risk class of what the run
actually changed:

| Risk class of the change | Attended | Unattended |
|---|---|---|
| **low / non-behavioural** (docs, comments, pure rename) | record the finding, continue to close — unchanged | record the finding, continue to close — unchanged |
| **material** (behaviour change · auth/permission · input validation · data write or migration · API contract · integration · deployment · security surface · financial or business calculation) | ask for a **recorded owner ruling on closing unproven** — not the discovery question "what gates this repo", which asks the owner to supply a gate rather than to accept its absence | **PARK the close** (Part 0 boundary table). "Is this proven enough to close?" is a *decision*, and the execute-only charter already parks decisions — this applies that charter to a case that slipped through it, rather than inventing new policy |

**The classifier is declared once**, in the table above, and is the single definition of *material* for
this pass and for Review's depth routing — two definitions of risk in one repo would be a second SSOT
that drifts from the one it copied. **When the class is genuinely unclear, it is material**: defaulting
down is what produces the silent close this rule exists to stop.

**The rollup line carries the class, because a verdict a checker cannot read is not enforceable.**
`no-gate-discovered(low)` / `no-gate-discovered(material)` — the parenthesis matching `FAIL(...)`'s
existing shape (night-run.md Part 4). An **unmarked** `no-gate-discovered` followed by a close is
`no-gate-risk-unmarked`: the marker's absence must never be read as *low*, for the same reason absence
of an ask channel is never consent.

**Verdict semantics.** PASS → one rollup line, run continues to close. FAIL → **blocks the silent
close** (ADR-021): surface the FAIL and its named finding, never tick past it quietly. Attended → get
a recorded owner ruling (override or fix-and-rerun) before closing. Unattended → the charter is
execute-only (night-run.md Part 0), so a FAIL **parks the close** per the Part 0 boundary table rather
than deciding anything — the rollup line names the finding, and whether a retry fires on it is governed
entirely by ADR-022's three conditions (mechanical trigger, one-shot ceiling, declared repo policy);
this pass decides nothing new about that.

**Recording the ruling — the one shape, so a checker can assert on it rather than on prose.** The owner's
ruling goes in the sprint's Execution Log as its own line, immediately below the `system-verify ·
FAIL(...)` line it resolves:

```
owner-ruling: system-verify — <ruling + reason>
```

`<ruling>` is `overridden` (close proceeds despite the FAIL) or `fixed-and-rerun` (the gate was fixed
and reissued a PASS); `<reason>` is the one-line why. This is the only recorded-ruling shape any
mechanical check may assert against — a park record (unattended) never needs this line, since Part 0
blocks the close before a ruling exists to record.

**Read the gate's OUTPUT, never only its exit code** (CLAUDE.md edit-safety (c)) — a gate piped through
a formatter, or a redirect that failed before the gate ran, can report a verdict about the wrong thing
entirely. Capture what the command actually printed and name the real finding from it.

**TD-053 caveat.** Run this pass only **after** worktree cleanup (`dispatch.md` § Merge-back queue,
Cleanup) — a `find`-based gate walking `.claude/worktrees/<id>/` sees a second, stale copy of the
whole tree and reports its contents as live violations. If the gate cannot be deferred past cleanup for
some reason, exclude `.claude/worktrees/` from its scope explicitly rather than trusting the gate's own
exclusions to reach a path they were never anchored against.

## Escalation

Execution fails twice, or a fork is genuinely ADR-grade → escalate by hand to your strongest model
(optionally `/council`). No automated ladder — that's agent behaviour a no-hooks plugin can't own (ADR-010).

## The ceiling (honest)

This is a **prompt-driven** skill: it makes dispatch the strong *default*, but can't *guarantee* the model
spawns. For large disjoint fan-out where determinism matters, use `/batch` (one worktree sub-agent per unit)
or `/workflows` — the deterministic path lean-flow deliberately keeps out of core (agent-free, ADR-002).
