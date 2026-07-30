# Night-run — pre-flight + trigger recipe for unattended `sprint-bulk`

Read before firing `sprint-bulk` unattended overnight. The mechanism is already decided — headless
`claude -p`, OS-scheduled, `--permission-mode dontAsk` + a pre-built scoped allowlist, never
`--dangerously-skip-permissions` (it removes every guardrail for a run nobody is watching to catch —
an unacceptable risk unattended). This file is the operational procedure, not a re-decision.

## Part 0 — The unattended contract (read first)

What the run may do when nobody is watching. Everything below Part 0 is procedure; this part is the
rule the procedure serves.

**Mode signal — declared, never inferred.** The trigger prompt carries the word `unattended`
(`claude -p "/orchestrator sprint-bulk unattended" …`). No signal → the run treats itself as
interactive. There is no reliable in-session test for "is a human watching", and a wrong guess is
unsafe in *both* directions — a false AFK self-approves, a false HITL stalls — so it is an explicit
input, never a deduction.

**Absence ≠ consent.** A headless session has **no ask channel at all** — `AskUserQuestion` is not even
registered there (verified: `ToolSearch select:AskUserQuestion` → *"No matching deferred tools found"*,
session flagged non-interactive), and under `dontAsk` any tool call that would prompt is auto-denied
without waiting. So a gate question cannot be asked, let alone answered. **A missing channel, a denial,
or a timeout is a BLOCK.** Never a default-yes, never "proceed with the recommended option", never
self-approval. Note the real pressure this creates: unable to ask, an agent's natural next move is to
*reason out the answer itself and carry on* — that is the failure this contract exists to stop. It is
the invariant the rest of this file protects; if anything here appears to conflict with it, this wins.

**The derivation rule** — the boundary is *derived*, not memorized, so a step that never made the
table below still resolves:

> **AFK-safe** = additive **+** reversible **+** already-approved-in-scope
> **HITL** = approval · judgement · lossy/destructive · scope-changing

**Boundary table** (the rule's worked output — not its definition):

| Step | Unattended | Why |
|---|---|---|
| G1 / G2 sign-off | ✅ **only if** pre-signed at pre-flight over the frozen Plan | already-approved-in-scope |
| Residual grill · any `AskUserQuestion` | ⛔ park | approval |
| `promote` governance sign-off | ⛔ park | judgement + scope-changing (it *forms* the Plan) |
| `promote` sprint render · `plan locked` commit | ⛔ park | downstream of the sign-off above |
| Per-task Implement → self-review → commit → tick DoD | ✅ | additive, inside the approved Plan |
| Execution Log append | ✅ | additive |
| `close` Retro + four-bucket auto-file + `close_commit` | ✅ | additive bookkeeping, no approval gate |
| `close` §11 retention (archive · move · prune · compact) | ⛔ park | lossy |
| `close` doc-freshness propose→approve | ⛔ park | approval |
| `/triage` re-rank · state change · reject apply | ⛔ park | approval |
| `migrate` / `init` per-item approvals | ⛔ park | approval + lossy |
| Mid-sprint `scope-change` re-confirm G2 | ⛔ park | scope-changing |
| `release-patch` push | ⛔ never (unchanged) | outward-facing, owner-reserved |

**Pre-authorization rule.** A gate is pre-signable only if its **subject exists and is frozen** at
pre-flight time. G1/G2 over a promoted Plan qualify — the Plan froze at `promote`. Nothing whose
content the *run itself* produces qualifies: a Retro not yet written cannot be approved in advance.
That is precisely why the charter is **execute-only** — a night run executes a promoted Plan; it does
not decide what the Plan should be, and it does not dispose of what the Plan produced.

**Park protocol.** On reaching a ⛔ step:

1. **Don't ask** (there is no channel) and — the harder half — **don't decide**.
2. **Write the park record** — one rollup line (Part 4) in the sprint Execution Log. No sprint file to
   write into (e.g. parked at `promote`) → the record goes in the `/handoff` doc instead.
3. **Continue disjoint AFK work** — anything with no shared file and no `depends-on` against the
   parked unit, per the G2 overlap map. Same-owner, shared-file, or dependent work parks *with* it.
4. **Clean halt** when no AFK work remains — finish through `/handoff` so the morning `/prime` reads
   it in. Never idle-spin waiting for an input that cannot arrive.
5. **Never work around the park** — rewriting, splitting, or narrowing a task so it dodges the gate is
   itself scope-changing, and therefore HITL. Park it as-is.

## Part 1a — Entry path (you were asked to *start* a night run)

Everything from Part 1 on assumes a promoted Plan already exists. This part covers the case where it
doesn't — the request arrives as intent, a PRD, or a backlog item rather than an active sprint.

**"Run a night run for `<X>`" is a compound instruction — prepare *and* execute.** The interactive
session is the *launcher*, not the run. It does the preparing; the headless run only executes. Collapsing
that to the launch half is the failure this part exists to stop: a background run is spawned against no
approved Plan, and the guard that would catch it (`sprint-bulk` step 0) lives *inside* the spawned
process, where there is no ask channel to halt into.

**Ordered entry path** — do these interactively, in order, before any spawn:

| # | If… | Then run | Gate |
|---|---|---|---|
| 1 | `<X>` is raw intent / a PRD / a ticket | `/task-decomposer` → `TASK-NNN` in the Backlog | human `approve` |
| 2 | the Backlog is ungroomed, or nothing is `state: ready` | `/triage` | human sign-off |
| 3 | no active sprint holds the work | `/lean-doc-generator promote` | governance checklist sign-off |
| 4 | a sprint exists but G1/G2 are unsigned | `sprint-bulk` steps 1–2, interactively | human G1 + G2 |
| 5 | all of the above are green | Part 1 pre-flight → Part 2 trigger | — |

A step whose gate the human declines **stops the launch**. Report what's outstanding and let them
decide; do not narrow, re-slice, or defer the work to get past it (that's scope-changing → HITL, and
the same dodge Part 0 forbids the run itself from making).

**Mode note.** Preparing is *not* an unattended activity — it is the interactive work that makes an
unattended run legitimate. Steps 1–4 are exactly the items Part 0's derivation rule makes HITL
(approval · judgement · scope-changing): steps 2–3 hit explicit ⛔ rows; step 1 has no dedicated row
but is judgement work; step 4's G1/G2 row is ✅ only-if-pre-signed — and unsigned means not yet
approved, i.e. still HITL. All four are legal here precisely *because* a human is present. That is the whole asymmetry: prepare with
a human, execute without one.

## Part 1 — Pre-flight pass (run interactively, the evening before)

All items must pass or the night-run does not fire:

- [ ] Charter confirmed **execute-only**: this run executes a promoted Plan. Anything needing
      `promote`-, `close`-retention-, or `triage`-class approval is parked by design (Part 0), not
      attempted — if the sprint isn't promoted yet, promote it *now*, interactively, or don't fire.
- [ ] Trigger carries the explicit `unattended` signal (Part 0).
- [ ] Active sprint exists; § Plan is frozen (true since `promote`); every task in the run is
      AFK-class — none needs a human mid-execution.
- [ ] Batch G1 + G2 already signed off by the human (per `sprint-bulk` steps 1–2).
- [ ] Zero open `assumes:` / `needs-info` tasks in the run — G2 already blocks on this; pre-flight
      re-verifies it still holds at trigger time (state can drift between G2 and the evening run).
- [ ] Scoped allowlist built from the tasks' `touches:` files plus the commit/review/lint commands
      the run will need, in `--allowedTools` permission-rule syntax (e.g. `Bash(git commit *)`).
      The `fewer-permission-prompts` skill's transcript-scan approach is a candidate builder.
      `dontAsk` **denies** anything outside the list rather than pausing for it — an under-scoped
      allowlist silently fails tasks instead of asking, so this step is load-bearing; over-denial
      shows up in the morning report, never as a bypass.
- [ ] Allowlist includes the **`/handoff` skill invocation** *and* the write of its output doc to the
      OS temp dir. The clean halt (Part 0 step 4) and the watchdog's recovery call (Part 3) are tool
      calls like any other, so `dontAsk` denies them unless listed — and a run that cannot halt
      cleanly is the one case where the failure lands after all the work is done. Observed on a real
      probe: the run parked every HITL task correctly, then `Skill(/handoff)` was refused as
      out-of-list and the protocol stopped one step short. Confirm the matcher your builder actually
      emits rather than assuming the form — that denial record is the only evidence so far, and the
      next real headless run is what proves the rule is right.
      **Belt, not replacement.** The fallback stays: a denied or unavailable `/handoff` still halts
      cleanly by appending its rollup line (Part 4) to the sprint Execution Log, which the morning
      `/prime` reads. Never let an allowlisted `/handoff` become the run's only exit.
- [ ] `bypassPermissions` is off the table — never the fallback for a lazy allowlist. The safety
      default stays OFF; flipping it is an owner decision, not a night-run convenience.

### Capability checks (specified — the probing mechanism graduates to its own task)

The items above verify the *run's* readiness; these verify the **environment's**. They are separate
because each one **degrades** the run rather than stopping it — so the useful output is not
pass/fail but *which shape the run takes*. Specified behaviour-first on purpose: a documented check
a human runs at pre-flight is the floor, and automating the probe is a separate, separately-verified
step (a spec small enough to implement is still not implemented here).

| Capability | What's checked | If absent — degrade rule |
|---|---|---|
| **Agent dispatch** | the run can spawn sub-agents at all | execute **inline and sequentially**; a task that then can't finish inside the window **parks** with its unblock condition rather than half-landing |
| **Worktree isolation** | `git worktree` is usable *and* no leftover agent worktrees remain | run the wave **sequentially in the shared tree** — agents make no git writes, the coordinator commits; the same shape already prescribed for an unpushed base |
| **Ask channel** | *nothing to check — already settled.* Part 0 establishes headless has none, by construction | **park the HITL step** (Part 0 park protocol). Named here only so the set looks complete; a probe would re-derive a known fact |
| **Skill version** | the run is served the skill from the plugin **install cache**, not the working tree — so compare installed version against the repo manifest | **block the unattended run** |

**Why the version check earns its place** (the others are conveniences; this one is a correctness
trap). A night run executes the *installed* skill. Edit a skill, don't reinstall, fire the run, and
it faithfully executes the **previous** procedure — no error, no denial, and a morning diff that
looks like the run simply ignored the change. Nothing else in this pre-flight would catch it, and it
is most likely exactly when a maintainer is iterating on the procedure the run depends on. Blocking
is right rather than degrading: unlike the other rows there is no correct reduced shape, because the
run would be executing a procedure nobody approved.

**Skill-freshness check (implements the row above).** A version-string compare alone can't catch the
trap: edit a skill, forget to bump the version, and installed == repo while the cache still serves
the old content. So the check is content-first, in this decision order:

1. **No local plugin repo** (no manifest to diff the install against — every ordinary consumer) →
   **SKIP**. Consumer-safety leg: it must never fire on someone who only ran `plugin install`.
2. **Installed version ≠ repo manifest version** → **BLOCK**, finding `stale-release`.
3. **Installed cache's `skills/` differs from the repo's**, by content — not the `gitCommitSha`
   field below — → **BLOCK**, finding `cache-differs`. This is the leg that catches the unbumped edit.
4. Else → **PASS**.

**`gitCommitSha` is not usable here.** The field an install manifest records per plugin is written
at *registration* time, not re-synced on content change — it can sit on the commit from whenever
that plugin key was first added, arbitrarily far behind the version paired with it. It answers "when
was this key registered", never "does the cache match the repo now", so it plays no part above.

Optional snippet, dependency-free POSIX sh (`diff`, `grep`, `sed`, `awk`, `git` — no `jq`). Run it
bare — never piped into a formatter inside an `&&` chain; a pipeline's exit status is its last
command's, so `check | tail && fire` would fire through a real BLOCK (L-057). Every exit path prints
its named finding before returning a status, so a non-zero exit is never the probe's own plumbing —
a missing file, an unset var, a failed parse — misread as a real finding (L-059):

<!-- skill-freshness-check:start -->
```sh
#!/bin/sh
# check-skill-freshness.sh -- is the *installed* skill the same content as the repo's?
# Exit 0 = PASS or SKIP (run may proceed); exit 1 = BLOCK (do not fire the run).
# Usage: sh check-skill-freshness.sh [repo-root] [installed_plugins.json]
#   repo-root defaults to `git rev-parse --show-toplevel` (or cwd outside a repo)
#   installed_plugins.json defaults to $HOME/.claude/plugins/installed_plugins.json
set -u

repo_root="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
installed_json="${2:-$HOME/.claude/plugins/installed_plugins.json}"
plugin_json="$repo_root/.claude-plugin/plugin.json"

# --- leg 1: no local plugin repo -> SKIP (an ordinary consumer has no checkout) ---
[ -f "$plugin_json" ] || {
  echo "SKIP no-local-repo: no $plugin_json (nothing to compare the install against)"
  exit 0
}

name=$(grep -oE '"name": *"[^"]+"' "$plugin_json" | head -n1 | sed -E 's/.*"([^"]+)"$/\1/')
repo_version=$(grep -oE '"version": *"[0-9]+\.[0-9]+\.[0-9]+"' "$plugin_json" | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
[ -n "$name" ] && [ -n "$repo_version" ] || {
  echo "BLOCK unreadable-manifest: could not read name/version from $plugin_json"
  exit 1
}

[ -f "$installed_json" ] || {
  echo "SKIP no-local-install: no $installed_json ($name is not installed on this machine)"
  exit 0
}

# grab the first array entry for this plugin's key ("<name>@<marketplace>": [ ... ]).
block=$(awk -v pat="\"$name@" '
  $0 ~ pat { grab=1 }
  grab { print; if ($0 ~ /^ *\],?[[:space:]]*$/) exit }
' "$installed_json")
[ -n "$block" ] || {
  echo "SKIP no-matching-install: no \"$name@*\" entry in $installed_json ($name is not installed on this machine)"
  exit 0
}

installed_version=$(printf '%s\n' "$block" | grep -oE '"version": *"[^"]+"' | head -n1 | sed -E 's/.*"([^"]+)"$/\1/')
install_path=$(printf '%s\n' "$block" | grep -oE '"installPath": *"[^"]+"' | head -n1 | sed -E 's/.*"([^"]+)"$/\1/' | sed 's/\\\\/\//g')
[ -n "$installed_version" ] && [ -n "$install_path" ] || {
  echo "BLOCK unreadable-install-entry: could not parse version/installPath for $name from $installed_json"
  exit 1
}

# --- leg 2: installed version != repo manifest version -> BLOCK ------------------
if [ "$installed_version" != "$repo_version" ]; then
  echo "BLOCK stale-release: installed $installed_version != repo manifest $repo_version ($plugin_json)"
  exit 1
fi

# --- leg 3: installed cache's skills/ differs from the repo's -> BLOCK -----------
repo_skills="$repo_root/skills"
cache_skills="$install_path/skills"
[ -d "$repo_skills" ] || {
  echo "BLOCK repo-skills-missing: $repo_skills not found"
  exit 1
}
[ -d "$cache_skills" ] || {
  echo "BLOCK cache-path-missing: $cache_skills not found (installPath may be stale)"
  exit 1
}

# --strip-trailing-cr: a Windows plugin install can rewrite files CRLF while the repo checkout
# stays LF -- that's a line-ending artifact, not stale content, and must not false-BLOCK (GNU
# diff only; a BSD/busybox diff without this flag will over-report -- normalize line endings
# before diffing as a fallback there).
diffout=$(diff --strip-trailing-cr -rq "$repo_skills" "$cache_skills" 2>&1)
diffstatus=$?
case "$diffstatus" in
  0) : ;;
  1)
    echo "BLOCK cache-differs: installed cache skills/ differs from the repo working tree"
    printf '%s\n' "$diffout"
    exit 1
    ;;
  *)
    echo "BLOCK diff-tool-error: diff -rq exited $diffstatus comparing $repo_skills vs $cache_skills"
    printf '%s\n' "$diffout"
    exit 1
    ;;
esac

echo "PASS skill-freshness: installed $installed_version == repo $repo_version; cache skills/ matches working tree"
exit 0
```
<!-- skill-freshness-check:end -->

Exit 0 covers both `SKIP` and `PASS` (the run may proceed either way); exit 1 is `BLOCK`. Two legs
aren't spec'd above and are reported here rather than faked, each still exiting through its own named
finding (never a bare status): an installed manifest entry that fails to parse
(`unreadable-install-entry`, `unreadable-manifest`), and a local repo where the plugin simply isn't
installed on this machine (`no-local-install` / `no-matching-install`) — both degrade to a SKIP or a
conservative BLOCK, never a silent PASS. Cover the three spec'd legs with fixtures — one must-SKIP,
two must-BLOCK, each asserting its own named finding — and **keep them**: deleting a gate's fixtures
with the scaffolding that built them is what leaves the gate unguarded afterwards (L-058). Put yours
wherever the repo keeps maintainer-only checks; lean-flow's own sit in its `evals/` directory, which
is not part of the installed plugin.

**Agent-dispatch check — a judgement call, not a probe.** "Can this run spawn sub-agents at all" is a
property of the *agent runtime*, not the filesystem or the repo — no file, env var, or git state
answers it from a shell snippet. Inventing a proxy (an API key present, a config flag set, a process
count) would only ever report "available", which is worse than no probe at all: a gate that runs but
can't gate (the L-057 family). So this row stays what Part 1 already calls it — a pre-flight line the
human confirms by knowing what they launched into, same as the `unattended` signal itself. No fixture
accompanies it: a fixture would have to fake the one signal that can't be faked honestly.

**Worktree-isolation check (implements the row above).** Unlike dispatch, this one *is* filesystem-
observable — `git worktree list` is a real, read-only command. Decision order:

1. **Not a git working tree, or `git worktree list` errors** (old git, missing binary, an exotic
   setup) → **DEGRADE**, finding `no-worktree-support`.
2. **`git worktree list` reports more than the main tree** (a linked worktree left over from a prior
   run) → **DEGRADE**, finding `leftover-worktrees`, naming the extra path(s).
3. Else → **AVAILABLE**, finding `worktree-clean`.

Same discipline as the freshness check — run bare, never through a formatter ahead of an `&&` chain
(L-057); every exit path prints its named finding before returning a status (L-059). Neither outcome
here blocks, so exit 0 covers both `AVAILABLE` and `DEGRADE` — the only non-zero exit is the probe's
own plumbing failing to run at all (e.g. a bad fixture path), which must never be read as a finding:

<!-- worktree-usability-check:start -->
```sh
#!/bin/sh
# check-worktree-usability.sh -- is `git worktree` usable, and clean, for this run?
# Exit 0 = AVAILABLE or DEGRADE (either way the run proceeds -- see night-run.md Part 1);
# a non-zero exit means the PROBE ITSELF could not run (L-059: never read that as a finding).
# Usage: sh check-worktree-usability.sh [repo-root] [porcelain-listing-file]
#   repo-root defaults to `git rev-parse --show-toplevel`.
#   porcelain-listing-file, if given, replaces the live `git worktree list --porcelain` call with
#   its contents -- the fixture seam: same data shape a real run would see, no worktree ever
#   created or removed to produce it.
set -u

repo_root="${1:-$(git rev-parse --show-toplevel 2>/dev/null)}"
listing_file="${2:-}"

if [ -n "$listing_file" ]; then
  [ -f "$listing_file" ] || {
    echo "ERROR probe-harness: listing file $listing_file not found"
    exit 1
  }
  list=$(cat "$listing_file")
  gitstatus=0
else
  [ -n "$repo_root" ] || {
    echo "DEGRADE no-worktree-support: not inside a git working tree"
    exit 0
  }
  list=$(git -C "$repo_root" worktree list --porcelain 2>&1)
  gitstatus=$?
fi

[ "$gitstatus" -eq 0 ] || {
  echo "DEGRADE no-worktree-support: 'git worktree list' failed -- $(printf '%s' "$list" | head -n1)"
  exit 0
}

count=$(printf '%s\n' "$list" | grep -c '^worktree ')
if [ "$count" -gt 1 ]; then
  extra=$(printf '%s\n' "$list" | grep '^worktree ' | tail -n +2 | tr '\n' ';')
  echo "DEGRADE leftover-worktrees: $((count - 1)) linked worktree(s) beyond the main tree -- $extra"
  exit 0
fi

echo "AVAILABLE worktree-clean: git worktree usable, no leftover linked worktrees"
exit 0
```
<!-- worktree-usability-check:end -->

Cover both degrade legs with fixtures, same L-058 retention rule as above. The `leftover-worktrees`
leg is fed via the listing-file seam rather than a real second worktree — probing worktree usability
by *creating* one would be the exact hazard this file already warns unattended runs about (a
tree-wide git op reaching uncommitted work). Fixtures live beside the freshness ones, outside the
installed plugin.

## Part 2 — Trigger recipe (consumer-generic)

> **Precondition — do not fire this until Part 1a's entry path and Part 1's pre-flight are both green.**
> The command below is the *last* step, never the first. An agent handed "run a night run" reaches this
> section with the trigger already copy-pasteable; that convenience is exactly how the prepare half gets
> skipped. If any pre-flight item is unchecked, the correct action is to go do it interactively — or to
> report what's blocking — not to fire and let the run discover the problem with no way to ask.

The one-liner, fired by an OS-level scheduler (outside lean-flow's own surface — it ships no hooks):

```
claude -p "/orchestrator sprint-bulk unattended" --permission-mode dontAsk --allowedTools "<built list>"
```

The `unattended` word is the Part 0 mode signal — without it the run behaves interactively and will
stop at the first gate instead of parking it.

Scheduling variants — the machine must stay on for either:

- **cron (POSIX)**: `0 1 * * * cd /path/to/project && claude -p "/orchestrator sprint-bulk unattended" --permission-mode dontAsk --allowedTools "<built list>" >> night-run.log 2>&1`
- **Windows Task Scheduler**: `schtasks /Create /TN "night-run" /TR "claude -p \"/orchestrator sprint-bulk unattended\" --permission-mode dontAsk --allowedTools \"<built list>\"" /SC DAILY /ST 01:00`

Checkpointing is inherited free from `sprint-bulk` steps 4–5 — no new mechanism: per-task commit +
Execution Log append is the checkpoint; first-blocker-halt parks the blocked task with its unblock
condition and lets disjoint work continue per the G2 parallel map.

**Base verification carries into the run.** If the run fans work out to parallel workers (worktrees
or sub-agents), each one branches from the wave's declared base commit, verified against live HEAD
at spawn, re-checked at every later wave boundary — a mismatch halts that wave, not the whole run.
This binds unattended runs the same as interactive ones, for the same reason the rest of Part 0
exists: nobody is watching to catch a silent divergence before it reaches a commit.

**Morning.** Read the sprint file's Execution Log + DoD state — that's the report; no new artifact.
Stall/kill/resume path: Part 3. Rollup line format: Part 4.

## Part 3 — Watchdog (OS-level pattern, ships outside lean-flow's own surface)

A small wrapper the OS scheduler runs alongside Part 2's `claude -p` call — no plugin code, no hook.

- **Stall signal**: no new `stream-json` line and no new commit for N minutes (default ≈20–30 min,
  scaled to the run's task size — raise for large/slow tasks, lower for small ones).
- **On stall**: SIGTERM the `claude -p` process — it runs `SessionEnd` then exits 143 (verified by
  testing), the same clean-exit path a closed terminal triggers.
- **Recovery**: the kill handler fires one final `claude -p --resume <session-id> "/handoff"` so the
  handoff doc lands in the OS temp dir exactly as a human-ended session would.
- **Shape** (pseudo): `every K min → if idle > N min → SIGTERM → wait for exit 143 → claude -p
  --resume <session-id> "/handoff"`.
- **Resume**: next session opens with `/prime`, which already reads a referenced handoff doc — no
  new resume mechanism.

## Part 4 — Morning rollup (rides the Execution Log, no new artifact)

The first thing the morning human reads: one line per non-green task, appended as the run's last
Execution Log entry — written by the run itself on a clean finish, or by the watchdog's `/handoff`
on a stall.

```
Tn · state (done | blocked | parked-hitl | denied-tool | stalled) · unblock condition / next action
```

`parked-hitl` = the run reached a step only a human may take (Part 0) — the line names *which* step
and what resolves it (next: do that one step interactively; the rest of the run already completed
around it). `denied-tool` = `dontAsk` refused a call outside the pre-flight allowlist (next: extend
allowlist, re-run). `stalled` = the watchdog fired (next: resume via `/prime` + the handoff path).
`done` tasks need no line — the rollup is for non-green tasks only.

Distinguish `parked-hitl` from `denied-tool` in the morning: a park is the contract working as
designed and needs a decision; a denial is an under-scoped allowlist and needs a config fix.
