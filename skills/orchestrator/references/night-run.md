---
owner: Maintainer
last_updated: 2026-08-01
update_trigger: night-run mechanism changes (pre-flight, trigger, watchdog, or rollup logic)
status: current
---

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
| 1 | `<X>` is raw intent / a PRD / a ticket / **a slice of an open epic** | `/task-decomposer` (`--prd <path>` · `--epic <id\|name>` — decompose only the slice named, never the whole epic) → `TASK-NNN` in the Backlog | human `approve` |
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
- [ ] Scoped allowlist derived from **four sources, not one**, and written into your project's
      **settings permissions** rather than assembled inline. Enumerating only the first source is the
      recurring failure:
      1. **Per-task commands and the tools that carry them** — each task's `touches:` files, plus the
         commit / review / lint commands its routed procedure runs. Authorize **tools, not only
         commands**: a host offering more than one shell needs each one listed, or the run silently
         loses the unauthorized one and its work with it. Observed — a run on a two-shell host had
         every `Bash` rule it needed and no `PowerShell` rule at all.
      2. **The landing path** — how the run's output becomes committed history. If the run fans work
         out, that is the coordinator's merge-back: integration-worktree creation, the merge itself,
         and the worktree removal/prune after it. Read the steps off `dispatch.md` § Merge-back queue
         rather than recalling them.
      3. **The gate's own subprocesses** — any always-on check that shells out and *writes*. A
         harness that creates throwaway repos or temp dirs is doing git writes like any other, and
         `dontAsk` denies them, so a gate that is green interactively can still fail unattended.
      4. **The exit path** — the `/handoff` invocation and its temp-dir write (next item).

      **Scope 2 and 4 hardest.** A denial in a per-task command costs that task; a denial in the
      shared landing or exit path costs the **whole run**, however many units already succeeded,
      because every unit funnels through it. Both have now failed for real: a probe parked every task
      correctly and then could not `/handoff`, and a later run stranded two complete, reviewed
      branches on a denied merge-back — delivering nothing after doing everything right.

      **Where the rules live.** Put them in your project's settings permissions, not in a command-line
      string rebuilt from memory each run — a file is diffable, reviewable, and survives the next
      person. Split it the way a repo already splits config: **repo-generic rules in the tracked
      settings file** (they are the reviewed, shared set) and **owner-reserved or machine-specific
      rules in the gitignored local one** — which is exactly where a `git push` rule belongs, if you
      grant one at all. *If your project has no settings file, derive into one; nothing here creates it
      for you, and no lean-flow skill writes one.*

      **Two preconditions, both measured — a rule can be perfectly written and still do nothing:**
      1. **The workspace must be trusted, under the key the *headless launcher* resolves.** An
         untrusted one has its `permissions.allow` **ignored entirely**, announced in a single line
         (`Ignoring N permissions.allow entry … not been trusted`) and otherwise silent. Every rule
         in the file is inert; denials then look exactly like form failures.
         **Check the record, not the directory.** Trust is stored per *resolved path key*, and one
         directory can have more than one canonical spelling — separator style, symlinks, case,
         mount points, a trailing slash. When the interactive session and the headless launcher
         resolve differently they consult **different records**, and the sharp part is that the
         remedy the CLI itself prints — *run interactively once and accept the dialog* — **provably
         cannot fix it**: the interactive session lands on the key that is already trusted, so
         following the printed advice produces no change and no error. Verify the key the launcher
         will actually use. Observed on a consumer's host: two entries for one directory,
         interactive trusted, headless not, all 57 rules ignored.
      2. **A directory-prefix rule form does not match.** Measured one rule at a time against one
         command: exact-file (`Bash(sh path/to/x.sh:*)`), bare-command (`Bash(sh:*)`) and space-glob
         (`Bash(sh *)`) all matched; **`Bash(sh dir/:*)` denied**, reproduced. Prefer exact-file or
         bare-command; treat a directory prefix as non-functional, and any unverified spelling as
         suspect until you have watched it match.
         **The rows above are `Bash` only — file tools are their own surface.** The natural
         extrapolation from them, a path-scoped glob mirroring the exact-file form, is **not** safe
         to assume for `Read` / `Edit` / `Write`: measured on a consumer's host,
         `Write(<abs-path>/**)` **denied** while the bare tool name `Write` allowed. The transferable
         claim is *measure the file-tool forms on your host before relying on them*, never a spelling
         — one host is one data point and the spellings may differ per platform. **Name the trade
         when you land on the broad form**: a bare tool name is wider than a path fence, so
         containment moves onto the deny list and the task scope rather than onto the allow rule. A
         run that cannot write is a run that completes every task and produces nothing.

      Evidence for both, plus what turned out **not** to be true, → `docs/research/headless-permission-surface.md`.

      **Issue the commands bare — one per invocation.** The matcher reads the **literal invocation**,
      not the operation you meant, so a permitted command wrapped in a prefix stops being recognised:
      no `cd X && …`, no `VAR=y …` prefix, no `&&` chain, no redirect. Anchor with `git -C <abs-path>`
      instead of changing directory. This is not style — of one run's **25 denials, 23 were form
      failures on commands that were individually permitted** (21 behind a `cd`, 2 behind a variable
      assignment). It converges with L-057's never-pipe-a-gate rule from the opposite direction: that
      one protects the exit status, this one protects the permission match.

      **A settings file changes ergonomics, not form-sensitivity.** Moving the rules out of the command
      line makes them reviewable; it does nothing about the paragraph above. Both are needed.

      `dontAsk` **denies** anything outside the list rather than pausing for it — an under-scoped
      allowlist silently fails work instead of asking, so this step is load-bearing; over-denial shows
      up in the morning report, never as a bypass. The `fewer-permission-prompts` skill's
      transcript-scan approach is a candidate builder, with one blind spot worth naming: a transcript
      only holds commands some run already reached, so it cannot suggest a landing-path command that
      no run has yet got far enough to attempt — which is precisely how source 2 stays missing.
- [ ] **The allowlist is PROVEN live by a probe carrying a negative control.** Everything above says
      how to *build* the rules; this is the only item that says how to know they are *in effect*. Run
      a short throwaway `claude -p` against the same settings, permission mode and working directory
      the real run will use, exercising one command from each source above — **plus one action you
      have deliberately NOT allowed.**

      **The must-deny action is the whole method.** Without it, "every call succeeded" and "the
      allowlist was ignored in its entirety" produce *identical* output — and the second is exactly
      what an untrusted workspace does (precondition 1). A probe with no negative control cannot tell
      a working configuration from an absent one, so its green verdict is a vibe rather than
      evidence. Read the two results together:

      | Permitted calls | The must-deny call | Verdict |
      |---|---|---|
      | succeed | **denied** | the allowlist is live and scoped — the only green worth acting on |
      | succeed | **also succeeds** | rules are not being enforced at all; suspect trust (precondition 1) or the mode, never the spellings |
      | denied | denied | a real gap — a form failure or a missing rule; fix one thing, re-probe |

      **Fix one thing per probe and re-measure.** A probe that changes two variables cannot say which
      one mattered. A consumer's three probes went: *all 57 rules ignored* → *`Write` denied,
      everything else allowed* → *all green*, each isolating a single cause — and the middle one
      "looked like a success right up until the single denial that mattered".

      **Cost it once and stop deciding.** Those three probes totalled **$1.77** against a run
      estimated at $40–150 — roughly **two per cent**, and they caught two independent total-loss
      configurations. Framed as a ratio, probing is not a judgement call each evening; it is
      unconditional, and the line item to compare it against is the run's own cost stated two items
      below.
- [ ] Allowlist includes the **`/handoff` skill invocation** *and* the write of its output doc to the
      OS temp dir. The clean halt (Part 0 step 4) and the watchdog's recovery call (Part 3) are tool
      calls like any other, so `dontAsk` denies them unless listed — and a run that cannot halt
      cleanly is the one case where the failure lands after all the work is done. Observed on a real
      probe: the run parked every HITL task correctly, then `Skill(/handoff)` was refused as
      out-of-list and the protocol stopped one step short. Confirm the matcher your builder actually
      emits rather than assuming the form. This was the first of two recorded denials of a shared
      terminal step — the merge-back denial behind source 2 above is the second, which is why that
      pair is called out as the pre-flight's load-bearing half rather than left as one anecdote.
      **Belt, not replacement.** The fallback stays: a denied or unavailable `/handoff` still halts
      cleanly by appending its rollup line (Part 4) to the sprint Execution Log, which the morning
      `/prime` reads. Never let an allowlisted `/handoff` become the run's only exit.
- [ ] `bypassPermissions` is off the table — never the fallback for a lazy allowlist. The safety
      default stays OFF; flipping it is an owner decision, not a night-run convenience.
- [ ] **The run's own expected cost is stated** — as its own line, and explicitly *not* the cost of
      verifying its tasks. These are unrelated budgets and conflating them is how a bill arrives as a
      surprise instead of as an input to firing: a sprint whose tasks need no paid fixtures is not a
      free sprint, because the run itself is never free. Estimate from the calibration rows in Part 4
      (units × the per-unit cost observed there), and say which shape you are paying for — a
      coordinator plus N dispatched agents costs multiples of the same work done inline, since **every
      branch re-pays the full substrate** (project instructions + tool context) before it does anything.
      Measured on this repo: ~$0.22 for a single-turn agent that does no work at all. Fan-out earns
      that overhead on long or genuinely parallel tasks; on a handful of small edits it does not.

### Capability checks

Environment-readiness checks (skill freshness, worktree usability, agent dispatch) moved to
`skills/orchestrator/references/night-run-checks.md` (SPRINT-044 T1 — TD-014) — read it as part of
this pre-flight pass.

## Part 2 — Trigger recipe (consumer-generic)

> **Precondition — do not fire this until Part 1a's entry path and Part 1's pre-flight are both green.**
> The command below is the *last* step, never the first. An agent handed "run a night run" reaches this
> section with the trigger already copy-pasteable; that convenience is exactly how the prepare half gets
> skipped. If any pre-flight item is unchecked, the correct action is to go do it interactively — or to
> report what's blocking — not to fire and let the run discover the problem with no way to ask.

The one-liner, fired by an OS-level scheduler (outside lean-flow's own surface — it ships no hooks):

```
claude -p "/orchestrator sprint-bulk unattended" --permission-mode dontAsk
```

(Permissions come from your settings file per Part 1; `--allowedTools "<built list>"` still works if you
prefer them inline.)

### Firing it so you can walk away

Fired bare from a terminal, the run is a **child of that terminal** — closing the window signals it dead,
however healthy it looked a second earlier. And for the first ~20 minutes a run that died instantly and
one working normally are indistinguishable, because the Part 3 watchdog only reacts to a *stall*.

A launcher closes both gaps: it re-checks the mechanically-verifiable half of Part 1, fires **detached**,
watches for a couple of minutes, and prints exactly one verdict. lean-flow ships one at
`scripts/night-run.sh` as a working reference — the pattern matters more than the file:

```
sh scripts/night-run.sh -- claude -p "/orchestrator sprint-bulk unattended" --permission-mode dontAsk
```

| Verdict | Meaning |
|---|---|
| `ALIVE` | process is up **and** producing observable progress — a log line or a new commit. You can close the terminal. |
| `DEAD-ON-ARRIVAL: <reason>` | it never got going, and the line names why (missing mode signal · wrong permission mode · no allowlist · the gate blocked · exited early). Nothing was left running. |
| `UNKNOWN: <reason>` *(exit 2)* | the process is **up**, but nothing observable happened inside the window — no log line, no commit. **Indeterminate, not dead.** A silent-but-working run is externally identical to a stalled one, and with `--output-format json` — which buffers until exit — an empty log is *expected*, so its absence of content proves nothing. The run is detached and continues either way; check the log later or widen `--wait-seconds`. Before TD-029 this case was reported as `DEAD-ON-ARRIVAL … the prompt may have been rejected`, an inference the launcher cannot support and which SPRINT-045 acted on while the run was working normally and went on to land both units. |

**A live PID is not progress.** A process can sit up and idle because its prompt was rejected, so the
verdict requires *output*, never just a heartbeat — which is also why the window defaults to ~150s
rather than a few seconds. Too short a window reports a healthy slow starter as dead.

**Environment caveat, learned the hard way.** On Git-Bash/MSYS hosts `MSYS_NO_PATHCONV=1` is often
exported so a leading-slash prompt isn't rewritten into a Windows path — but it is **inherited**, and it
disables path translation for every child, breaking any check that hands a POSIX path to a native `git`.
A gate that is green in your shell then blocks the launcher for reasons unrelated to the repo. Clear it
around the gate, not globally.

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

**On a denial, record it once and move on — never re-attempt the same operation in a different
wrapper.** Re-wrapping (adding a `cd`, splitting into a chain, redirecting elsewhere) does not make a
refused operation permitted, and each attempt costs a full turn. Measured: one run spent ~40% of its
64 turns on 25 denials, and a turn costs roughly the same whether it accomplishes anything or not,
because every turn re-reads the whole accumulated context (→ `docs/research/night-run-cost.md`). A
denied operation is a `denied-tool` rollup line and a morning config fix, not something to solve
in-flight.

### The calibration row (one per run, always — green or not)

The per-task lines above say what happened; this one says **what it cost**. Append it beside them:

```
run · <actual cost> · <turns> · <wall-clock> · <units completed / attempted> · <shape>
```

`shape` is what you paid for — `inline`, or `coordinator + N agents`, since the same work costs
multiples in the second form. Read the numbers off the harness rather than estimating: a headless
`claude -p --output-format json` result carries `total_cost_usd`, `num_turns`, and `duration_api_ms`
(with a per-model breakdown under `modelUsage`), so this is a transcription, not a judgement.
**Degrade rule** — where cost is not exposed, record the fields that are (turns · wall-clock · units)
and **say the cost was unavailable**. A row with a stated gap still calibrates; a silently omitted row
is what leaves the next person estimating from nothing.

**Rows so far** — this is a series being started, not a budget. One row is an anecdote; do not size a
window from it:

| Sprint | Cost | Turns | Wall-clock | Units | Shape |
|---|---|---|---|---|---|
| SPRINT-041 | $6.60 | 15 | — | 2 built, **0 landed** | coordinator + 2 worktree agents |
| SPRINT-043 | $16.54 | 64 | 22 min | 2 built, **2 landed** | coordinator + 3 agents (2 worktree + 1 follow-up) |
| SPRINT-045 | $10.84 | 25 | 17 min | 2 built, **2 landed** | coordinator + 2 worktree agents |

Read those rows honestly. SPRINT-041 *built* both units and landed neither, because the merge-back was
denied — $6.60 bought two stranded branches, and cost per unit **delivered** was undefined. SPRINT-043
ran the same shape after the allowlist fix and landed both: **$8.27 per unit delivered**, against a
predecessor where that number did not exist. Note the floor underneath both: a single-turn agent doing
no work at all measured ~$0.22 on this repo, the substrate every branch re-pays before starting.

**The third row is the one that pays for the table.** SPRINT-045 ran the same shape as SPRINT-043 — two
tasks, two worktree agents — after a rule change aimed squarely at wasted turns, and came in at **25
turns against 64, 3 denials against 25, $10.84 against $16.54**: $5.42 per unit delivered where the
previous row was $8.27. That is the cost hypothesis (cost ≈ turns × accumulated context, and denials
are the cheapest turns to eliminate) surviving a real test rather than being asserted. Do not read it
as a fixed rate — it is one comparison between two runs of one shape.

Two cautions the second row buys, which the first could not:

- **A finished run costs multiples of a stranded one.** SPRINT-043 spent 2.5× SPRINT-041 for the same
  two tasks, because a run that dies at merge-back never pays for merging, reviewing, or closing. When
  estimating from a row, check whether that row's run actually *finished* — a cheap row may just be a
  run that failed early.
- **Estimate from turns, not task count.** Both sprints held two tasks; SPRINT-043 took 64 turns to
  SPRINT-041's 15. Task count predicted nothing.
