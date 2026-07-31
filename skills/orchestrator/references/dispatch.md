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
   ordering. A `Depends-on:` edge between the two tasks (either direction) makes it a PASS, with
   ownership order derived from the edge; no edge between them is a FAIL — an unowned overlap, the
   exact hazard concurrent dispatch creates.
3. **Base-ref check** — the wave's declared base commit (stated up front, never assumed) must equal
   live HEAD; drift means unrelated work landed since declaration (L-055's root cause).
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
inplan=0; tid=""; layers=""; deps=""
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
      layers=""; deps=""
      ;;
    "Layers:"*)
      layers=$(printf '%s' "$line" | grep -oE '[A-Za-z0-9_./-]+\.[A-Za-z0-9]+' | tr '\n' ',')
      ;;
    "Depends-on:"*)
      deps=$(printf '%s' "$line" | grep -oE 'T[0-9]+' | tr '\n' ',')
      ;;
  esac
done < "$sprint"
flush

# --- cycle check + wave computation (topological rank) + shared-file check
awk -F'\t' '
{ order[NR]=$1; layers[$1]=$2; deps[$1]=$3; n=NR }
END {
  fail=0
  for (i=1;i<=n;i++) rank[order[i]]=-1
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
          if (fi[a]==fj[b]) {
            edge=0
            if (index(","deps[tj]",", ","ti",")>0) { edge=1; first=ti; second=tj }
            else if (index(","deps[ti]",", ","tj",")>0) { edge=1; first=tj; second=ti }
            if (edge) print "PASS shared-file-owned: "fi[a]" in "ti","tj" order="first"->"second
            else { print "FAIL shared-file-unowned: "fi[a]" in "ti" and "tj" has no Depends-on edge"; fail=1 }
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
dispatch brief). It never touches a file the overlap map marks shared — those stay coordinator-owned.

Claude-only v1 — external CLI agents are out of scope until a real consumer signal; the
pre-decided shape (BYO opt-in + AGENTS.md brief carrier) is parked, not built.

Guardrail: stale-branch reuse on agent-id collision is an open harness issue (#51596). Before
dispatch, `git worktree list` should show no leftover agent worktrees — clean any first.

**Declared-base rule** (ADR-013 · L-055): every worktree/agent branches from the current wave's
declared base commit — stated up front, then verified against live HEAD at spawn, never assumed.
Mismatch halts dispatch for the wave. Re-run the check at every wave boundary, not just once at the
start — HEAD moves as waves land, so a base verified for wave 1 is stale by wave 2.

Base-ref caveat (observed on the first real wave): agent worktrees fork from the **remote default
branch**, not local HEAD (unless `worktree.baseRef: "head"` is set) — unpushed local commits are
invisible in an agent's tree. Brief agents to read newer docs via `git show main:<path>` (read-only,
L-043-safe); the three-way merge reconciles the old base cleanly as long as only the task's own
files changed on its branch. **Corollary: a task EDITING a file that exists only in unpushed
commits must not be worktree-dispatched** — the merge becomes add/add on that file. Fall back to
shared-tree parallel dispatch (disjoint files, agents run no git writes, coordinator commits
sequentially), or push / set `baseRef: "head"` first.

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

A broken or incomplete worktree never merges — return the task to backlog with an unblock
condition, salvage any doc/research artifacts, drop the code.

Cleanup (coordinator-only): leave the worktree directory **before** removing it — Windows holds a
handle-lock on any worktree a shell has `cd`'d into, so removal from inside it fails
Permission-denied mid-way (admin entry gone, directory left) (L-044). Retry `git worktree remove`
from a fresh shell, `rm` any stray directory, `git worktree prune`, verify with `git worktree list`.

L-042's per-hunk staging rule (`git add -p` on a shared file) still binds **intra-tree only** —
sequential tasks sharing one tree, or the coordinator staging conflict resolutions here. Worktree
isolation obsoletes it at the cross-worktree boundary: disjoint tasks never share a tree to begin with.

## Escalation

Execution fails twice, or a fork is genuinely ADR-grade → escalate by hand to your strongest model
(optionally `/council`). No automated ladder — that's agent behaviour a no-hooks plugin can't own (ADR-010).

## The ceiling (honest)

This is a **prompt-driven** skill: it makes dispatch the strong *default*, but can't *guarantee* the model
spawns. For large disjoint fan-out where determinism matters, use `/batch` (one worktree sub-agent per unit)
or `/workflows` — the deterministic path lean-flow deliberately keeps out of core (agent-free, ADR-002).
