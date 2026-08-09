---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: A learning confirmed at Sprint Close, or a learning promoted to a durable rule
status: current
---

# lean-flow — Learnings Ledger

Append-only record of confirmed corrections and patterns surfaced at Sprint Close. A learning that
**recurs (count ≥ 2)** is promoted into a *durable* rule — a `CLAUDE.md` anti-pattern, a `CONTEXT.md`
rule, or a skill red-flag — and marked below. Reviewed at every **Sprint Promote** before planning.

<!-- Newest first. Never edit a past entry except to bump `seen` / `count` or set `promoted`. -->

<!-- Per-entry metadata (schema, ADR-009): the heading carries `[tags: <tag>] [status: active|promoted|superseded]`;
     the body keeps `seen · count · promoted · related`. Tags: process · docs · tooling · edit-safety · sprint-model.
     The by-tag index is GENERATED corpus-wide into docs/knowledge-index.md — `sh scripts/gen-index.sh`. -->

> **By-tag index** → [`docs/knowledge-index.md`](knowledge-index.md) — generated corpus-wide by
> `scripts/gen-index.sh` (LEARNINGS + ADRs + research). This file is the LEARNINGS SSOT; the index is derived.

> **Id policy — monotonic, never reused:** a pruned/promoted entry's id retires forever; the next
> new id continues from the highest id **ever issued** (currently **L-094**), not the highest visible.
> `L-001`–`L-021` above stay valid as-is — this rule starts now, not retroactively.
> **Retired ids:** `L-022`–`L-042` pruned/promoted → durable rule in `CLAUDE.md` anti-patterns ·
> skill red-flags · sprint archive. `L-016`/`L-017` were briefly reused pre-policy — the ORIGINAL
> 016/017 content is retired; today's `L-016`/`L-017` above are the current, legitimate entries.

---

## L-094 [tags: process] [status: active]: **Before deferring a question for lack of evidence, check what *kind* of question it is — a capability question wearing a cost question's clothes will never accumulate the evidence it is waiting for.** "Is skill self-fork worth the per-run fork cost over runtime invocation?" sat open across three consecutive research scans, each closing with "no new evidence either way". The framing made that inevitable: nobody keeps a fork-cost measurement lying around, and taking one needs a paid dispatch run, so every scan correctly observed that nothing had changed and moved on. The question was never about cost. Claude Code **serializes concurrent invocations of the same forked skill**, and lean-flow's fan-out runs one procedure skill across N tasks at once — so the mechanism removes the concurrency it was being considered for, and one documentation read settles it. What made the deferral self-perpetuating is that each scan re-examined the *evidence* and never the *shape of the question*. The check is cheap and belongs at the moment of deferral, not the third revisit: ask what class of fact would close this — a measurement, a documented behaviour, a judgement call — and if it is a documented behaviour, go read the documentation instead of writing "no new evidence". A deferral with a written kill-switch (L-068) stops a question drifting toward never; this stops one drifting toward *unanswerable* when it was never hard.
- seen: Sprint-050
- count: 1
- promoted: no
- related: L-068 (a deferral needs a written kill-switch) · L-087 (test the mechanism, don't infer it) · L-017 (delta over existing surface) · `.out-of-scope/skill-self-fork.md`

---

## L-093 [tags: docs] [status: active]: **An entry leaves an explicit boundary list by a written verdict, never by an assumed coverage — and a shared name is a hypothesis, not a finding.** A research doc's § Not scanned list was created precisely so a gap would be "a recorded boundary rather than an implied all-clear". It then quietly shed five entries — `diagnosing-bugs` · `prototype` · `tdd` · `triage` · `handoff` — every one of which shares a name with a lean-flow skill, so each *looked* obviously covered. The list granted the implied all-clear it existed to prevent, inside the mechanism built to stop it. SPRINT-050 checked all five at a cost of one line each and **two produced keepers**: `/diagnose` had no redaction rule despite instructing the capture of HAR files and traces, and `/tdd` was missing the tautological-test anti-pattern. So the assumption was not merely unverified — it was wrong, and it had been hiding the two most substantive findings of the scan. The general shape: a boundary list's value is entirely in its being *complete*, and the entries most likely to be dropped from one are the entries that look most obviously fine, because that is what makes dropping them feel safe. The rule is mechanical — nothing leaves the list without a sentence saying what covers it, and "we have one with the same name" is not that sentence, since L-017's whole point is that the delta lives in behaviour, not in the label.
- seen: Sprint-050
- count: 1
- promoted: no
- related: L-017 (delta over standalone merit) · L-058 (a gate's silent false-negative) · L-016 (verify on the consumer path rather than assuming) · `docs/research/mattpocock.md`

---

## L-092 [tags: process] [status: active]: **A promoted learning fires only inside the skill it was filed into — promotion needs the same wiring check a capability gets.** L-087 ("a symptom is observed, the mechanism welded to it is inferred") was promoted at SPRINT-048 close into `skills/diagnose/SKILL.md` § Red flags. One sprint later, at the SPRINT-049 *promote*, a gate FAIL was met by attaching TD-032's prose-mention mechanism to it without testing, and an Acceptance line was reworded on that wrong diagnosis — precisely the failure L-087 exists to prevent. The rule never fired because the flow was `/lean-doc-generator promote`, not `/diagnose`. The §10 promotion rule says to route a recurring learning into "a CLAUDE.md anti-pattern, a CONTEXT.md rule, **or** a skill red-flag" and stops there, as though the three were interchangeable homes; they are not — a skill red-flag is scoped to that skill's flow, and a mis-diagnosis is not a `/diagnose`-only event. This is L-020 (shipped ≠ wired) applied to *rules* rather than capabilities: ask of any promotion **which flows can hit this failure**, and place it where all of them read, or accept it will fire in exactly one.
- seen: Sprint-049, **Sprint-051**
- count: 2
- promoted: no — **due now**, the `count ≥ 2` trigger fired at SPRINT-051 close
- Sprint-051's occurrence is the cleanest possible statement of it: `/handoff` has carried a redaction rule — in its body *and* as a red flag — for sprints, while `/diagnose` had **zero** occurrences of redact/secret/credential despite being the skill that instructs capturing HAR files, traces and log dumps. The repo *held* the rule; it simply lived in the file where it was learned rather than every file that needs it. Nobody had to fail to know it — the surface was inconsistent with itself, and only an external scan (SPRINT-050 T3, comparing `handoff` to `handoff`) surfaced it.
- related: L-020 (wire a capability into every triggering job) · L-087 (the rule that failed to fire) · L-002 (a rule that only fires inside skill flows) · L-015 (the consumer-facing surface check) · DOCS_Guide §10

---

## L-091 [tags: process] [status: active]: **A tech-debt row's Mitigation line is a hypothesis written under time pressure, not a plan — test it before building it.** TD-032 proposed narrowing the prose derivation to "DoD/Acceptance lines only, excluding the free-text rationale paragraph". That line was written at the moment of filing, when the cost of the false positives was being felt and the fix seemed obvious, and it was carried unquestioned into SPRINT-049 T1's DoD at promote. Replaying the checker across all 11 revisions of the SPRINT-048 Plan showed every false positive sitting **inside a DoD checkbox item** — the narrowing would have fixed none of them, because the discriminator is the token's *role in the sentence*, not its location in the block. The row was right about the problem and wrong about the cure, which is the normal condition of a mitigation written while annoyed. What makes it dangerous is that by the time it reaches a Plan it has been re-read several times and reads as settled. Treat `Mitigation (not yet done):` as the filer's best guess: cite the evidence for the *problem*, re-derive the *fix*.
- seen: Sprint-049, **Sprint-051**
- count: 2
- promoted: no — **due now**, the `count ≥ 2` trigger fired at SPRINT-051 close
- Sprint-051's occurrence: **TD-034**'s Mitigation said "reconcile the two pairs into one". Diffing them first — required by the sprint's own A2 confirm step — showed they were never duplicates but two honest snapshots at different times, so the proposed cure would have destroyed one of them inside a closed archive. Same shape as TD-032: right about the symptom (a reader gets two answers with no marker), wrong about the cause (duplication) and therefore wrong about the cure. Both rows had been re-read across multiple promotes without anyone re-deriving the fix, which is exactly what makes a Mitigation line read as settled.
- related: L-087 (mechanism inferred rather than tested) · L-088 (a DoD premise invalidated by execution — this is where the stale premise came from) · TD-032 · TD-034

---

## L-090 [tags: tooling] [status: active]: **A gate's new must-FAIL fixture proves nothing until it is run against the code from *before* the fix.** SPRINT-049 T1 replaced the observed check's all-task union with per-task attribution, closing TD-035 — a task editing a file only a sibling declared. The fixture failed on the new checker, which is necessary and not sufficient: a fixture can fail for a reason unrelated to the change, or test a path the old code never reached, and either way "this case used to pass" stays unverified. So the same fixture repo was driven twice, `git show HEAD:scripts/lib/check-layers-observed.sh` versus the working copy: **old → `PASS`, exit 0 · new → `FAIL … T1:bar.txt`, exit 1.** That two-line result is the whole claim. L-058 establishes that a gate needs a must-FAIL fixture per check; this sharpens *when* that fixture becomes evidence — a red result on new code is a test of the new code, while the red-on-new/green-on-old **pair** is a test of the change. Cheap to do (one `git show` into a temp file) and the only thing that distinguishes a closed hole from a fixture that was always going to be red.
- seen: Sprint-049
- count: 1
- promoted: no
- related: L-058 (a gate's must-FAIL bar) · L-007 (exercised once on real input) · TD-012 (retain the fixtures) · TD-035

---

## L-089 [tags: tooling] [status: active]: **A gate is only as good as the last time you ran it — and the edit most likely to go unverified is the one you make *after* it passes.** SPRINT-048 committed a red gate: T4's work was green, then its DoD checkboxes were ticked, then the log was appended, then it was committed — and the tick had introduced a `layers-completeness` FAIL. Nothing in that sequence felt like a code change; ticking boxes and writing a log entry read as clerical bookkeeping, which is exactly why the gate was not re-run. It surfaced only because `night-run.sh`'s pre-flight refuses to fire on a red gate and reported it while an unrelated task was being reproduced — the tooling caught what the author did not, two tasks later. This is the same family as L-057/L-059 (a verdict about the wrong thing) with the axis rotated: not *which command* the status came from, but *when* it was taken. The practical rule: **re-run the gate immediately before `git commit`, after the final edit, not after the last edit that felt substantive** — and treat DoD-ticking and log-appending as edits, because they are.
- seen: Sprint-048
- count: 1
- promoted: no
- related: L-057 · L-059 (status from the wrong command) · L-060 (inspect the artifact) · L-088

---

## L-088 [tags: sprint-model] [status: promoted]: a DoD frozen at promote carries numbers and premises execution can invalidate — amend it through a `scope-change` and an owner ruling, never a quiet reinterpretation.
- **L-088 → promoted: `skills/orchestrator/SKILL.md` § Red flags** — the durable rule is the record now (§11 collapse, SPRINT-049 T2). Body: git. Placed beside the scope-change red flag and explicitly distinguished from it: that one covers a *pivot*, this one a criterion that went stale while the scope held. seen Sprint-047/048 (×3), count 2. It then fired a fourth time in the sprint that promoted it — SPRINT-049 T1's own DoD carried TD-032's narrowing mitigation, falsified by replaying the check across 11 revisions of the SPRINT-048 Plan, and was ruled rather than reinterpreted.

---

## L-087 [tags: process] [status: promoted]: a symptom is observed, the mechanism welded to it is inferred — treat the symptom as data and the mechanism as the first thing to test.
- **L-087 → promoted: `skills/diagnose/SKILL.md` § Red flags** — the durable rule is the record now (§11 collapse, SPRINT-048 promote). Body: git; TD-024 (three mechanisms, two wrong) · TD-027 (falsified by a 26-turn probe). seen Sprint-044/045/046, count 3.
- **Promotion was overdue**: it reached count 3 and sat unpromoted, because the SPRINT-047 promote scan matched `count` and `promoted:` on the same line while this ledger puts them on separate ones. The scan, not the rule, was the failure.
- related: L-078 (a green result from a broken setup) · L-085 (hand the verification forward) · L-060 (inspect the artifact, not the report) · TD-024 · TD-027

---

## L-086 [tags: tooling] [status: active]: **A permission rule can be present, correct, and completely inert — presence is not effect.** Measured directly, one variable at a time (SPRINT-046 T1). **(1) Workspace trust is a precondition for the whole file**: an untrusted workspace has its `permissions.allow` *ignored entirely*, announced in a single line and otherwise silent, so a character-exact rule produced a denial purely because the file was never honoured. **(2) Rule form decides matching**: against one identical command, exact-file (`Bash(sh path/x.sh:*)`), bare-command (`Bash(sh:*)`) and space-glob (`Bash(sh *)`) all matched, while **directory-prefix (`Bash(sh dir/:*)`) denied**, reproduced. **(3) The command's own shape still governs**: relative → permitted, absolute → permitted, but adding `> file` → **denied**, reproduced — which is L-077's rule, and is what actually explains the denials once blamed on mid-session degradation (L-084, now superseded). Three independent ways for a correct-looking allowlist to do nothing, none of which announce themselves as a rule problem. The habit worth keeping: **verify a rule *matched*, never that it exists** — the failure modes all look identical from the settings file.
- seen: Sprint-046
- count: 1
- promoted: no
- related: L-077 (the matcher reads the literal invocation) · L-084 (superseded by this) · L-083 (a precondition that silently stopped holding) · TD-028 · `docs/research/headless-permission-surface.md`

---

## L-085 [tags: process] [status: active]: **An agent that *cannot* verify should hand the verification forward as a named command, not quietly accept review as proof.** SPRINT-045's unattended run could not execute either task's fixture harness — five `denied-tool` findings blocked it — so it had a choice between three things: claim the tasks verified on the strength of a careful diff review, drop the question silently, or say what it could not do. It said so: *"That is strong but not equivalent to an end-to-end run"*, and wrote an **owner verification item** naming the exact command and the exact precondition (`run this with MSYS_NO_PATHCONV cleared before treating TD-025 as closed`). At close that item took one command and passed, converting an unverifiable claim into a verified one at near-zero cost. What makes this worth keeping is the asymmetry: review-as-verification is *usually* right, which is exactly why accepting it silently is dangerous — the times it is wrong are indistinguishable from the times it is not, unless someone recorded that the real check never ran. The durable form: when a verification step is blocked, the deliverable is not the reviewed artifact, it is the artifact **plus the named command the next person must run**. A gap that is written down is a five-minute task; the same gap unwritten is a false green.
- seen: Sprint-045
- count: 1
- promoted: no
- related: L-078 (a green result from a broken setup) · L-058 (a guard needs a must-FAIL leg) · L-060 (inspect the artifact, not the report) · TD-025

---

## L-084 [tags: tooling] [status: superseded]: **A permission surface can narrow *mid-session* — so allowlist derivation, a static exercise done once at pre-flight, cannot fully protect a long run.** SPRINT-045's run had `awk … > file` and `sh <path>` denied *after* those exact command forms had already succeeded earlier in the same session; they were how its own wave-start preflight had been extracted and executed minutes before. The dispatched T1 agent independently reported the same shape inside its own sandbox — every `sh` and `awk -f <file>` invocation denied regardless of allowlist match, while inline `awk '…'` kept working. Two observers, one run, same signature. This is materially different from the form-failure story (L-077: the matcher reads the literal invocation), and it partly undercuts the fix built on it: a perfectly derived, perfectly formed allowlist still degrades if the surface itself changes under the run. Consequence for the unattended contract — pre-flight can no longer be treated as *sufficient* for a long run, only necessary; a run that suddenly cannot execute a command it ran an hour ago is not misconfigured, and diagnosing it as a rule gap sends the next person to the wrong file. **Reproduce before theorising** (TD-024's lesson, applied here in advance): nobody has yet established whether the trigger is elapsed time, turn count, or a budget.
- seen: Sprint-045
- count: 1
- promoted: no — **SUPERSEDED by L-086** (SPRINT-046 T1 falsified the degradation hypothesis; the discriminator is the redirect, an instance of L-077). Retained rather than deleted: the observation was real and the wrong inference is the instructive part.
- related: L-077 (form failures — the *static* half of the same surface) · L-072 (the terminal step is the shared choke point) · TD-027 · TD-028

---

## L-083 [tags: tooling] [status: active]: **A check that watches for a side effect is only as valid as the output format that produces it — verifying it under one format does not verify it under another.** SPRINT-044's launcher defines `ALIVE` as "process up **and** observable progress", deliberately, because a live PID can mean a rejected prompt. It was verified against the default output format and worked. SPRINT-045 fired the same launcher with `--output-format json`, which **buffers everything until exit** — so no progress can appear by construction, and a healthy run that went on to land both units was reported `DEAD-ON-ARRIVAL`. The check's logic was never wrong; its precondition silently stopped holding. Two things follow. The narrow one: `night-run.md` Part 3 already names `stream-json` as the format whose lines signal liveness, and I reached past that for `json` because it is what exposes `total_cost_usd` — a **retrieval miss against our own doc**, and the two needs genuinely pull opposite ways. The general one: when a guard infers state from an observable, the *shape of the observable* is part of its contract. Ask what makes the signal appear, and whether every supported invocation still produces it — otherwise the guard keeps returning confident verdicts about a channel that has gone silent for reasons unrelated to the thing being watched.
- seen: Sprint-045
- count: 1
- promoted: no
- related: L-065 (a check whose comment asserts more than its code tests) · L-076 (demonstrate what a narrowed gate no longer catches) · L-081 (a precondition changed by the environment) · TD-029

---

## L-082 [tags: process] [status: active]: **When a guard flags its own file, the one fix never available is exempting it.** SPRINT-044's observed-layers check FAILed on a generated index nobody declares — a genuine gap, fixed by adding it to the checker's exclusion list with a stated reason. Editing the checker then made *it* undeclared, and the check FAILed again naming its own source file. The obvious move was another exclusion line; it would have taken ten seconds and turned the guard into one that cannot see changes to itself. Rejected: the checker is hand-authored source, exactly the category the check exists to watch, and the only thing the second exclusion would have bought is one convenient commit. The discriminator is cheap and worth applying every time an exclusion is tempting: **would I add this exclusion if the change were someone else's?** For the generated index, yes — it is derived, and no author could ever have declared it. For the checker, obviously not. An exclusion list stays honest exactly as long as each entry answers that question the same way regardless of who is asking.
- seen: Sprint-044
- count: 1
- promoted: no
- related: L-058 (a gate's worst failure is the silent false-negative — this is how one gets created deliberately) · L-076 (narrowing coverage carries an extra proof obligation) · TD-022

---

## L-081 [tags: tooling] [status: active]: **An environment workaround is inherited — it applies to every child process, so it can cause a second bug far from where it was set, in a component that never heard of it.** `MSYS_NO_PATHCONV=1` is exported on Git-Bash hosts so a leading-slash prompt isn't rewritten into a Windows path before reaching `claude.exe` (L-067). Because it is *exported*, it also reached the QA gate and every fixture harness the gate spawns, where it disabled path translation and broke `git -C` on a POSIX path. Symptom: `72 pass, 1 fail` from inside the launcher against `73 pass, 0 fail` standalone, repeatably — and the failing message, `could not resolve live HEAD`, was the exact string a tech-debt row had been carrying for two sprints under two different wrong diagnoses. What made it near-invisible is the distance: the variable is set at the *trigger*, the failure appears in an *unrelated gate two layers down*, and nothing in either place mentions the other. Two rules: **scope an env workaround to the single invocation that needs it** rather than exporting it, and when a check behaves differently in two contexts, **diff the environments before diffing the code** — the answer was never in the harness.
- seen: Sprint-044
- count: 1
- promoted: no
- related: L-067 (its first occurrence — same variable, narrower blast radius) · L-078 (a green result from a broken setup) · TD-024 (the row it root-caused)

---

## L-080 [tags: process] [status: active]: **A `Depends-on` edge orders the work, not the reading — a later task can contradict the change it was sequenced behind.** SPRINT-044's T3 depended on T2 precisely so it would land after T2 moved the allowlist from a CLI string into settings permissions. It landed after, and still shipped a launcher that hard-required `--allowedTools` — rejecting the exact invocation T2 had just made canonical. The dependency did its job perfectly; nothing about it makes the second implementer *read* the first's change, and a dispatched agent starts from the brief plus the repo, not from the sibling task's diff. Generalisation: an edge guarantees ordering, never context transfer. When task B depends on task A because A **changes a contract B consumes** — as opposed to merely touching the same file — B's brief has to state the new contract explicitly. Cheap tell at planning time: if you can describe the edge as "B must not contradict A", the edge alone will not achieve it.
- seen: Sprint-044
- count: 1
- promoted: no
- related: L-020 (shipping ≠ wiring — this is its sequencing form) · L-071 (a declaration cannot carry what its author did not know) · dispatch.md § Hand the sub-agent its procedure skill

---

## L-079 [tags: process] [status: active]: **Making a command satisfy a permission matcher can remove what was anchoring it — command *safety* and command *anchoring* are different properties, and fixing one can silently break the other.** SPRINT-043 found that `dontAsk` denies a permitted command when it is wrapped in `cd X && … 2>&1` (L-077), so the run's natural correction was to issue everything bare. That stripped the `cd` prefix which — unnoticed — had been the only thing pinning each command to the main tree. The shell's cwd persists across calls, an earlier verification had left it inside an agent worktree, and the next three "bare, therefore safe" commands ran there: the integration worktree was created nested inside an agent worktree, and `git merge --ff-only` advanced an agent's branch instead of `main`. Nothing was lost, and nothing detected it either — it surfaced only by reading the command's actual output and noticing a sha (`Updating c94a8c0..`) that had no business appearing. The durable form: when you change *how* a command is issued to satisfy one constraint, re-ask what the old form was silently providing. Anchor explicitly instead (`git -C <abs-path>`), so the property survives the rewrite rather than riding on a prefix.
- seen: Sprint-043
- count: 1
- promoted: no
- related: L-077 (the constraint that forced the rewrite — same run) · L-060 (caught by inspecting the output, not the status) · TD-023

---

## L-078 [tags: tooling] [status: active]: **A fixture harness that builds its own environment can fail to build it and still report green — the setup failure routes every case into a *different* check that passes its assertion for the wrong reason.** SPRINT-043 T1 shipped a harness whose fixtures create throwaway git repos via `mktemp -d` + `git init`. On this Windows/MSYS host `git -C` cannot resolve the `/d/tmp/...` path `mktemp -d` returns, so every setup commit silently failed, every fixture sprint kept its placeholder `plan_commit:`, and cases written to exercise a real git diff instead tripped the checker's *`plan_commit not recorded`* branch. Some assertions still matched, so the harness printed all-green while never once running the check it existed to guard. This is L-058's worst case reached from a new direction — not a missing must-FAIL fixture, but a present one that never got to fail — and it is invisible to exit codes, which is why it survived the implementing agent's own verification and was caught only by an independent pre-merge review. The general rule: a harness that constructs its fixtures must assert the **construction** succeeded, not just that the assertions matched. A green test whose setup failed is not a weaker signal than no test — it is a worse one, because it is trusted.
- seen: Sprint-043
- count: 1
- promoted: no
- related: L-058 (must-FAIL fixtures — this is the "fixture never ran" case) · L-075 (its mirror: validate the fixture holds the violation) · L-060 (the artifact, not the report) · TD-024

---

## L-077 [tags: process] [status: active]: **An allowlist derivation answers *which* commands the run may issue, never *in what form* — and a permission matcher reads the literal invocation, so a correctly-derived list still denies the landing path.** SPRINT-042 T1 fixed night-run allowlists by deriving them from four sources instead of one, closing the gap that stranded SPRINT-041's merge-back on a denial. SPRINT-043 tested that fix and it held: `git worktree add` · `merge --no-ff` · `worktree remove` · `prune` were all authorized and both units landed. But the same command was *denied* when issued as `cd X && git worktree add … 2>&1 && echo …` and *permitted* issued bare — character-for-character the same operation, matched differently. So a run can derive its allowlist perfectly from all four sources and still lose the shared landing path, which is the exact failure the four-source rule exists to prevent, reached by a different route. Two rules now point the same way for unrelated reasons: L-057 says never pipe a gate because a pipeline's status is its last command's; this says never chain a permitted command because the matcher stops recognizing it. One command per invocation, anchored with `git -C <abs-path>` rather than a `cd` prefix (L-079).
- seen: Sprint-043
- count: 1
- promoted: no
- related: L-072 (scope the terminal step hardest — same choke point) · L-057 (never pipe a gate — converging rule) · L-079 (what the fix for this broke) · TD-023 · night-run.md Part 1

---

## L-076 [tags: process] [status: active]: **When a gate's coverage is deliberately narrowed, demonstrate the newly-uncovered case passing silently — otherwise the trade is described rather than measured.** SPRINT-042 T4 moved three slow harnesses behind an opt-in flag, cutting the always-on gate 84s → 57s. The DoD asked to prove the *retained* checks still fail correctly, and they do; but the decision-relevant fact is the other half — what a bare run now misses. Breaking a selftest's subject leaves the bare gate at a clean **70 pass, 0 fail**, and only `QA_FULL=1` catches it. That number is what makes the trade legible: a reviewer can weigh "33% faster" against "this specific class is now invisible by default" instead of against an adjective. The general move: a change that *removes* coverage carries an extra proof obligation its additive sibling does not — the must-FAIL fixture shows what the gate still catches, and a **must-not-catch demonstration** shows what it no longer does. Skipping the second is how a narrowing ships as a pure win and is remembered as one, right up until the uncovered case fires.
- seen: Sprint-042
- count: 1
- promoted: no
- related: L-058 (a gate's worst failure is the silent false-negative — this is its coverage-reduction case) · L-065 (a check's comment as a claim to be tested) · TD-016

---

## L-075 [tags: process] [status: active]: **A negative test that fails to fail is indistinguishable from a broken fixture — validate that the fixture holds the violation before concluding the guard missed it.** Verifying SPRINT-042 T3, an adversarial case appeared to expose a false negative: a file named in a DoD line, absent from `Layers:`, went unreported. The guard was fine. My `sed` had targeted `- [x]` while that DoD was still unticked, so the injection silently never landed and the checker correctly passed a clean file — a green result from an empty test, which looks exactly like a green result from a blind test. Caught only by grepping the scratch file for the string I thought I had injected, one step before filing a defect against working code. The symmetry is the lesson: L-058 says do not trust a guard you have not seen fail, and this is its mirror — do not trust a *failure to fail* you have not seen the input for. Both reduce to the same discipline as CLAUDE.md's trap (c): inspect the artifact, not the report about it. A test's artifact is its fixture, and mine was never inspected until it had already produced a conclusion.
- seen: Sprint-042
- count: 1
- promoted: no
- related: L-058 (must-FAIL fixtures) · L-065 (construct the violation adversarially — the pass that produced this fixture) · L-045 · CLAUDE.md Edit-safety trap (c)

---

## L-074 [tags: process] [status: active]: **A second source derived from *authored* text closes the forgetting gap, not the inventing gap — only an *observed* source closes both.** SPRINT-042 T3 fixed TD-020 by cross-checking a sprint Plan's hand-written `Layers:` against the files named in each task's own DoD prose, negative-tested against SPRINT-041's real recorded miss. It works, and it was defeated on the day it shipped: T3 created a new implementation file, that file is absent from T3's own `Layers:`, and the check passes the Plan regardless — because a DoD written at promote cannot name a file invented during implementation. Both sources are *predictions* by the same author at the same moment, so they share a failure mode no amount of cross-checking between them removes. The distinguishing question for any "add a second source" fix: are the two sources independent in **origin**, or only in **location**? Two documents written by one person at one time are one source in two places. The escape is an observation — here, the actual touched-file set at commit time, which reads what happened instead of what was foreseen.
- seen: Sprint-042
- count: 1
- promoted: no
- related: L-071 (its direct parent — consistency vs completeness) · L-066 (derived-from-disk beats hand-maintained) · TD-020 · TD-022

---

## L-073 [tags: process] [status: active]: **State an autonomous run's own cost at pre-flight, separately from the cost of verifying its tasks.** SPRINT-041 was framed at promote as "zero API cost" — true of the *tasks*, whose acceptance needed no paid behavioural fixtures, and false of the *run*, which spent **$6.60** on two ~25-line changes (coordinator plus two worktree agents, 15 turns) doing work a live session would have done for a fraction of it. The two budgets are unrelated and were conflated in a single reassuring phrase, which is what let the number arrive as a surprise afterwards rather than as an input to the decision to fire. Two consequences: fan-out cost scales with **branch-count × substrate-size** (every branch re-pays the full CLAUDE.md + tool context before doing any work — ADR-010's addendum, now with a measured figure attached), so parallel dispatch is a poor trade on small surgical tasks however disjoint they are; and this is the **first real calibration datum** for what an unattended run costs per unit of work — one point, so treat any extrapolation to a full-night window as an estimate, not a budget.
- seen: Sprint-041
- count: 1
- promoted: no
- related: ADR-010 (dispatch doctrine + the fan-out cost addendum) · L-072 (same run) · night-run.md Part 1 (pre-flight — where the run's own cost belongs)

---

## L-072 [tags: process] [status: promoted]: the terminal step is the choke point every unit shares — scope its permissions harder than the per-task ones.
- **L-072 → promoted: `.claude/CONTEXT.md` § Gates, Unattended block ("Scope the terminal step hardest")** — the durable rule is the record now (§11 collapse, SPRINT-042 close). Body: SPRINT-041 + git history. Shipped as SPRINT-042 T1.

---

## L-071 [tags: process] [status: active]: **A mechanical check over a hand-written declaration validates that declaration's consistency, never its completeness.** SPRINT-041's dispatch preflight ran its shared-file single-owner check and reported CLEAR; both tasks then edited `TECH-DEBT.md` concurrently in separate worktrees, because neither task's `Layers:` listed it — even though each task's DoD explicitly required marking its own TD resolved. The check's logic is sound and was negative-tested; the *input* was an author's memory at promote time, and the guard inherited its blind spot silently. They merged clean only because the hunks sat ~19 lines apart. The distinguishing property: a gate that reads a manifest cannot detect an **omission** from that manifest, because omission looks identical to absence — so the only fix is a second, independently-derived source to diff against (here: the touched-file set implied by each task's own DoD prose). Ask of any declaration-driven gate: *what would a forgotten entry look like?* If the answer is "a pass", the gate is guarding the honest case only.
- seen: Sprint-041
- count: 1
- promoted: no
- related: L-058 (a gate's worst failure is the silent false-negative) · L-065 (a check whose comment asserts more than its code tests) · L-066 (a hardcoded sibling list goes stale mid-wave — same family: derived-from-disk beats hand-maintained) · TD-020

---

## L-070 [tags: tooling] [status: active]: In a session holding **two shells** (PowerShell primary, Bash also available), the *tool* decides the syntax — and a here-string that is valid in one is inert text in the other. `git commit -m @'…'@` sent through the Bash tool stored a commit whose subject was a lone `@`, at **exit 0**: git received the literal `@` as the message's first line, so `git log --oneline` read `@ docs(triage): …`. Nothing failed; only the artifact was wrong. Fix that removes the class rather than the instance: **write any multi-line message to a file and pass `-F <file>`** — no quoting dialect, no shell-boundary transformation to get wrong. Caught because the commit's stored text was inspected (`git log --format=%B | cat -A`) rather than the command's exit code, which is CLAUDE.md's trap (c) working as intended.
- seen: Sprint-040
- count: 1
- promoted: no
- related: L-067 (MSYS path translation — same family: a shell boundary that succeeds loudly and produces the wrong artifact quietly) · L-045 · L-060 · CLAUDE.md Edit-safety trap (c)

---

## L-069 [tags: process] [status: active]: **A behavioural rule ships with its trigger, or it does not ship.** SPRINT-040 T2 wired "write a park record when headless" into `migrate`/`init` and it did not fire — twice, for two different reasons, each visible only on a real run. First attempt: the rule went into the § Sprint lifecycle paragraph, which a `migrate` run never reads (it routes `## Migrate` → `references/migration-map.md`) — L-020's shape, committed *while fixing a TD of that class*. Second attempt: correctly placed in `## Migrate`/`## Init`, it stated **what to do when headless** but never **how the run knows it is** — and since waiting in prose is correct when a human is watching, the clause was unreachable by construction. What made both entry points comply immediately was the **detection cue**: probe `ToolSearch select:AskUserQuestion`. That also explains the SPRINT-039 result nobody had explained — `promote` and `/triage` complied while `migrate`/`init` didn't, because their text *names the observable*, which prompts the probe. Generalisation: a conditional instruction needs its condition's **observable** shipped beside it; without one the branch is dead text that reads as complete. Cost of establishing this: 4 real headless runs, $2.10 — inspection passed both defects.
- seen: Sprint-040
- count: 1
- promoted: no
- related: L-020 (wire a capability into every triggering job — this is its sharper form: wiring the *trigger*, not just the location) · L-007 (spec-only debt) · L-016 (verify on the consumer path) · TD-017

---

## L-068 [tags: process] [status: active]: A **deferral with a written kill-switch** closes itself without re-litigation — and that is the whole value. ADR-013 deferred the checkpointed run-state file behind a named promotion trigger plus a dated expiry ("unfired by SPRINT-040 promote → auto-close as rejected"). At SPRINT-040 triage the decision took no debate: the trigger provably never fired (SPRINT-039 T1's five real headless fixtures all completed or parked with a readable trail), so the pre-agreed answer applied and TASK-120 routed to `.out-of-scope/` in one step. Contrast the default shape — an open `blocked` task with no expiry, which is re-argued at every promote and drifts toward "never" without anyone deciding it. The pattern to reuse: when deferring, write **what would have to happen** and **by when**, so the null result is itself a verdict rather than an absence of one.
- seen: Sprint-040
- count: 1
- promoted: no
- related: ADR-013 (graduation contract) · `.out-of-scope/checkpointed-run-state.md` · `.out-of-scope/run-event-log.md` (sibling option, rejected outright)

---

## L-067 [tags: tooling] [status: promoted]: `MSYS_NO_PATHCONV=1` disables path translation for every argument — and is inherited by every child.
- **L-067 → promoted: `.claude/CLAUDE.md` Edit-safety trap (d)** — the durable rule is the record now (§11 collapse, SPRINT-045 promote). Body: git + L-081, which carries the second occurrence and the TD-024 root cause.

---

## L-066 [tags: process] [status: active]: In a parallel wave, a task that hardcodes a list of its siblings' artifacts is stale the moment a concurrent task adds one — and **neither agent can see it**. SPRINT-039 W2: T3 wired a 5-entry list of zero-API eval harnesses into `qa-check`; T2, running concurrently, landed a 6th. T3's list was correct when written and wrong when merged, leaving a harness that exists but is never reached — TD-013's exact shape, recreated the same day TD-013 was resolved. Only the coordinator's post-merge interaction check could catch it, because per-branch review sees one side. Fix the class, not the instance: have the list **check itself against disk** and FAIL on anything neither included nor *explicitly* excluded-with-a-reason. Note the rejected alternative — globbing everything would auto-enroll a future *paid* harness into an always-on gate, which is worse than the gap.
- seen: Sprint-039
- count: 1
- promoted: no
- related: L-047 (a derived view regenerated mid-wave is stale on arrival — same wave-timing class) · L-020 · TD-013

---

## L-065 [tags: tooling] [status: active]: A check whose **comment asserts more than its code tests** is a false-negative already written — and the must-FAIL leg that would expose it is the one exercising the **named** violation, not an adjacent one. SPRINT-039 T1's `originals-untouched` said "still present, **untouched**" but tested only `[ -f ]` existence; its must-FAIL leg tested *deletion*, so *mutation* was never probed. An unauthorized content edit folded via `git commit --amend` (commit count 1, tree clean) produced a full **exit-0 all-PASS**, and the neighbouring commit-count check did not backstop it. Found only by an adversarial reviewer who constructed the violation rather than reading the code. Two rules: when a check cannot inspect its subject (missing baseline, unverifiable remote), that is a **named FAIL**, never a pass; and read every gate's comment as a *claim to be tested*, since the gap between what it promises and what it executes is invisible to a green run.
- seen: Sprint-039
- count: 1
- promoted: no
- related: L-058 (must-FAIL fixture per check — this is its sharp edge) · L-062 (review a subagent's reasoning) · L-056 (the author cannot see their own class)

---

## L-064 [tags: process] [status: active]: The unattended contract's refusal was about **destructiveness**, not about the gate. SPRINT-038 twice failed to induce a violating run and recorded the ambiguity as L-061; SPRINT-039 T2 isolated the variable by swapping the gated action from a file deletion to a **pure judgement/approval call with no data loss**, reusing the identical weakening mechanism. The model **self-approved** — resolved the open question, wrote the file, committed, ticked the DoD, no park record — and then, *within the same run*, correctly **parked** a later genuinely lossy step. The split therefore holds **inside one run**, which is far stronger than any number of separate refusals. Consequences: the eval suite has now caught a real violation (labelled strength raised, still short of "catches every future violation"), and a HITL gate guarding a **non-destructive** step should not be assumed self-enforcing by model priors — that is exactly where the written contract has to carry the weight. Method note: the answer only counts because *both* outcomes were pre-declared as successes and forcing a violation was banned up front.
- seen: Sprint-039
- count: 1
- promoted: no
- related: L-061 (**narrowed by this, not repeated** — a `count` bump would have erased the correction) · L-053 (isolate the variable) · L-052

---

## L-063 [tags: docs] [status: active]: In a repo that **documents a standard**, a repo-wide path rename cannot be a find/replace — every occurrence is either a link to our own file (rewrite) or a description of the standard itself (must NOT change). Migrating `docs/CHANGELOG.md` → root would have rewritten the migration map's own **source column** (it maps *from* the legacy path, so that path must stay named), DOCS_Guide's "still matched, second" note, `release-patch`'s legacy-detection fallback, and `prime`'s legacy read-order row — i.e. corrupted the very standard consumers rely on to migrate. Append-only files (ADRs) add a third class: their stale link is stale *by design*. Classify every occurrence before touching one, and **assert the prohibited paths were untouched afterwards** (`git diff --name-only`) rather than trusting intent.
- seen: Sprint-038
- count: 1
- promoted: no
- related: L-015 (consumer-leak class) · ADR-012

---

## L-062 [tags: process] [status: active]: "Retain the fixtures" needs a **three-way** split, or it gets argued away: the fixture **input** (deterministic, retain), the **assertions** over a finished run's artifacts (deterministic, retain), and the **run itself** (nondeterministic + costly, correctly on-demand). SPRINT-038 T2a declared behavioural fixtures unretainable *as a class* by conflating all three, and checked in nothing; T2b then followed that precedent and also checked in nothing — one task after the retention rule was promoted into CLAUDE.md. Salvage cost nothing (the scratch repos were intact) and the retained assertion script immediately caught a silent false-negative. **Mechanism worth naming: a framing one subagent asserts, and the coordinator commits without challenge, becomes binding on the next subagent.** Review a subagent's *reasoning*, not just its diff.
- seen: Sprint-038
- count: 1
- promoted: no
- related: L-058 · TD-012 · L-007

---

## L-061 [tags: process] [status: active]: A safety contract written as **prose in a doc** cannot be negative-tested by weakening that doc — the model's own priors hold the line independently of what the procedure says. Two attempts to induce a real violating run (Part 0's park protocol inverted, loaded via `--plugin-dir`, all "this is a fixture" tells removed) both failed: the model declined to self-approve the destructive step *even though the loaded procedure explicitly authorised it*, citing its own priors rather than the doc. Two consequences: (a) a behavioural eval suite over such a contract can validate its **observable artifacts** but cannot prove it catches a violation — say so rather than implying regression-gate strength; (b) the doc may be getting credit for behaviour that would happen anyway, so "the agent honoured our contract unprompted" is **weak evidence** the contract caused it. The contract still earns its place by fixing *which* artifact gets written and where — that part is real and testable.
- seen: Sprint-038
- count: 1
- promoted: no
- related: L-016 (verify on the consumer path) · L-057 · ADR-013 · **L-064 (SPRINT-039 T2 narrowed this: the refusal was about destructiveness, not the gate — read L-064 before citing this entry)**

---

## L-060 [tags: tooling] [status: promoted]: match the quoting form to the tool actually executing — and when a command's job is to *record* text, inspect the stored text, not the exit code.
- **L-060 → promoted: `.claude/CLAUDE.md` Edit-safety trap (c)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; promoted as part of the 5-entry cluster (L-045 · L-049 · L-057 · L-059 · L-060, 4 sprints).

---

## L-059 [tags: tooling] [status: promoted]: a non-zero status with no report behind it is not a verdict — the failure can be the plumbing rather than the gate.
- **L-059 → promoted: `.claude/CLAUDE.md` Edit-safety trap (c)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; a failed redirect reported EXIT=1 while qa-check never ran. Part of the 5-entry cluster (4 sprints).

---

## L-058 [tags: tooling] [status: promoted]: A gate's worst failure is the silent false-negative — only a must-FAIL fixture per check exposes it, and the fixtures must be retained.
- L-058 → promoted: `.claude/CLAUDE.md` anti-patterns (folded into the spec-only-debt bullet, whose
  "exercised once on real input" bar it completes for gates) · seen Sprint-036 · Sprint-037 · count 2
- related: L-007 · L-057 · L-059 · TD-012 (the retention leg, still open)

---

## L-057 [tags: tooling] [status: promoted]: a gate piped into a formatter stops gating — POSIX pipeline status is the last command's, so run the gate bare or gate on its captured status.
- **L-057 → promoted: `.claude/CLAUDE.md` Edit-safety trap (c)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; part of the 5-entry cluster (4 sprints). See L-045 for why `count` never fired on this pair.

---

## L-056 [tags: process] [status: active]: A defect *class* fixed in one file recurs in text newly written the same sprint — and the author cannot see it. SPRINT-035 T3 resolved TD-010 (repo-local path leaked into shipped skill text, the L-015 class); two tasks later T5 wrote a fresh instance of the same class into the shipped SPRINT template (`qa-check.sh` cited as an authoritative enforcer consumers don't have). Only the fresh-context reviewer caught it. Fixing an instance doesn't inoculate the sprint against the class: when writing NEW shipped text, grep for the class just fixed, and keep the isolated review pass even in the sprint that is busy fixing that very class.
- seen: Sprint-035
- count: 1
- promoted: no
- related: L-015 (the class) · L-006 (fresh-context review as the catch mechanism) · L-009

---

## L-055 [tags: tooling] [status: active]: Agent-tool worktrees branch from the SESSION-START commit, not current main — every mid-session commit before dispatch diverges the fleet's base. SPRINT-035 wave 1: four parallel worktree agents all branched from pre-promote HEAD; merges became cherry-picks, and one agent reported "TASK entries missing" because its tree predated the promote commit — undetected until merge-back. Treat the branch point as *declared state, verified at spawn*, never assumed: tell the agent what base it should see, have it verify, halt on mismatch (→ TASK-118 / ADR-013's `base_ref` condition; the same check must re-run at every wave boundary, since HEAD moves as waves land).
- seen: Sprint-035
- count: 1
- promoted: no
- related: L-044 (worktree mechanics) · L-020 (wire the check at the entry point, not inside) · ADR-013

---

## L-054 [tags: process] [status: active]: A guard that runs *inside* the process it protects cannot stop the decision to start that process. `sprint-bulk` step 0 asked exactly the right question — "is there a promoted sprint?" — but it executes inside the spawned headless run, where there is no ask channel: it can halt, never prevent or ask. So "run a night run for `<un-promoted intent>`" spawned first and discovered the problem second, in the one context that cannot report it. The entry-side check has to live in the session doing the spawning. Generalization: when a rule protects a boundary crossing, ask which *side* of the boundary the check runs on — a correct check on the wrong side reads as coverage and provides none. Corollary on L-020: the promoted wiring-check enumerates a capability's trigger points and downstream consumers, which is why this passed review — the *entry path into* the capability was never read as one of its trigger points.
- seen: Sprint-034
- count: 1
- promoted: no
- related: L-020 (shipped ≠ wired — this is its entry-side blind spot) · L-016 (the consumer path is where it surfaced) · L-007

---

## L-053 [tags: process] [status: active]: A new rule's value can sit *after* the decision it appears to be about — and a control that shares an independent stop-reason proves nothing. SPRINT-033 encoded "never self-approve a HITL step unattended", then tested it: a pre-contract control (worktree at the prior release) refused the unapprovable step in near-identical terms to the post-contract HEAD. The refusal instinct was already there; what only HEAD produced was the *protocol* after refusing — park record, `parked-hitl` rollup line, continue disjoint work, clean halt. The first comparison was also confounded (an open DoD gave both arms a second reason to stop) and had to be re-scoped to isolate the variable. Before claiming a change caused a behaviour: isolate the variable, and check whether the real gap is the decision or what follows it.
- seen: Sprint-033
- count: 1
- promoted: no
- related: L-007 (exercising on real input is what exposed it) · L-052 (same sprint, same test pass)

---

## L-052 [tags: process] [status: active]: A spec's inaccurate mechanism becomes agent reasoning verbatim — so platform facts get *run*, not inferred. SPRINT-033's contract stated that under `--permission-mode dontAsk` a gate `AskUserQuestion` "comes back denied, not answered" (inferred from the permission-mode docs). A real headless run showed the tool is **not registered in a headless session at all** — no ask channel to deny — and the session is flagged non-interactive; the observed pressure is therefore an agent that *cannot* ask reasoning the answer out and proceeding. A later run then quoted the wrong mechanism straight back out of the spec. Any platform behaviour a rule depends on is verified by executing it once; documentation-derived mechanism is a hypothesis until then.
- seen: Sprint-033
- count: 1
- promoted: no
- related: L-007 (spec-only debt — the same "exercise it once" discipline) · L-053 (same test pass)

---

## L-051 [tags: docs] [status: active]: A placement-standard row without a full explicit path invites a mis-scaffold — DOCS_Guide §2 listed the ADR index as bare "`DECISIONS.md`" (no `docs/` prefix), and the T7 three-tier exercise scaffolded it at fixture root before catching the ambiguity by cross-inference from README.md.template's docs-map link (SPRINT-032). A generation standard is executed literally by cold-context agents: every §2-class row states its full path from repo root; disambiguation-by-sibling-inference is a trap. Fixed same-sprint (row now says "both under `docs/`").
- seen: Sprint-032
- count: 1
- promoted: no
- related: L-001 (the original no-placement-defined gap — same failure class at standard scale) · L-007 (exercising on real input is what surfaced it)

---

## L-050 [tags: docs] [status: active]: A shipped template carried a repo-local task ID — `SPRINT.md.template`'s Retro line and DOCS_Guide §10 both pointed at lean-flow's own `TASK-040`, surviving multiple L-015 consumer-leak sweeps because those sweeps grep for repo-specific PATHS (`scripts/…`, `docs/knowledge-index.md`), not repo-local IDs (SPRINT-031: found only when the referenced task was archived and the pointer dangled). Consumer-leak sweeps must also match ID namespaces (`TASK-`/`TD-`/`L-`/`ADR-` + repo names) inside `skills/**/templates/` + `references/`.
- seen: Sprint-031
- count: 1
- promoted: no
- related: L-015 (consumer-leak class — promoted) · L-048 (same shape for version strings: the sweep only finds what its pattern names)

---

## L-049 [tags: process] [status: promoted]: in a fan-out the per-unit output FILE is the success signal — a killed subagent can report failure over valid work already on disk.
- **L-049 → promoted: `.claude/CLAUDE.md` Edit-safety trap (c), fan-out leg** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; part of the 5-entry cluster (4 sprints). Related surface: dispatch.md § Merge-back queue · night-run.md per-task commit checkpoint.

---

## L-048 [tags: tooling] [status: active]: release-patch bumps only the manifest cascade — a version string echoed OUTSIDE the manifests (README footer `v1.14.1`) shipped stale in the same release commit; qa-check's footer↔manifest lint caught it one step later (SPRINT-030 batch: v1.14.2 released, footer fixed in a trailing commit). Version echoes live outside the skill's step-5 stale-doc clear (which only sees `last_updated:` frontmatter) — at release, grep the OLD version string repo-wide before emitting the push gate.
- seen: Sprint-030
- count: 1
- promoted: no
- related: L-013 (a check is only real if it runs — qa-check ran and caught it, but post-release)

---

## L-047 [tags: process] [status: active]: A derived view regenerated mid-wave is stale on arrival — `gen-index.sh` ran while two parallel agents were still writing their research docs, so the very next `qa-check` FAILed "knowledge index STALE" (SPRINT-028: the coordinator regenerated after T1's notification but before T2/T3 landed). The coordinator owns not just the regen but its *timing*: regenerate derived views (index, graph view, any generated artifact) only after the whole wave settles, immediately before the gate that checks them.
- seen: Sprint-028
- count: 1
- promoted: no
- related: L-013 (a check is only real if read) · TASK-040 guardrail (ii) (read-time staleness must fail LOUD — it did, working as designed)

---

## L-046 [tags: tooling] [status: active]: Agent worktrees fork from the REMOTE default branch, not local HEAD (unless `worktree.baseRef: "head"`) — a wave dispatched over unpushed local commits hands every agent a tree missing them (SPRINT-026: both agents lacked the very research docs they were briefed on; both correctly fell back to `git show main:<path>`). Brief the read-fallback explicitly, or set baseRef; the three-way merge reconciles the stale base as long as agents touch only their own files. Encoded in dispatch.md § Worktree dispatch protocol (base-ref caveat).
- seen: Sprint-026
- count: 1
- promoted: no
- related: L-044 · L-043 · dispatch.md base-ref caveat

---

## L-045 [tags: process] [status: promoted]: a piped quality gate masks its exit code — and at close, check whether a "new" learning is an existing entry's second sighting, or `count` never reaches its trigger.
- **L-045 → promoted: `.claude/CLAUDE.md` Edit-safety trap (c)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; first of the class, recurred ten sprints later as L-057, which is how the promotion miss was itself found.

---

## L-044 [tags: tooling] [status: promoted]: leave a worktree directory before removing it, and retry from a fresh shell — the Windows handle-lock caveat.
- **L-044 → promoted: dispatch.md § Merge-back queue** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; seen Sprint-025 + Sprint-026.

---

## L-043 [tags: edit-safety] [status: active]: Parallel-dispatched subagents must NEVER run tree-wide git state ops (`stash` / `checkout` / `restore` / `reset`) — one agent's `git stash` mid-wave swept a sibling task's uncommitted edits into the stash (SPRINT-024 W1: T8's work looked destroyed for two turns; restored on `pop` — pure luck the window didn't interleave with a write). Fixture-test lints via scratchpad copies or inject-and-immediately-revert with an editing tool; compare baselines via `git show REF:file`, never by mutating the shared tree. Ban stated verbatim in every parallel-wave dispatch brief from W2 on.
- seen: Sprint-024
- count: 1
- promoted: no
- related: L-010 (repo source vs cache) · the retired per-hunk-staging rule (now a CLAUDE.md anti-pattern)

---

## L-021 [tags: tooling] [status: promoted]: a live session keeps the skill version it started with — read the base-dir version in each invocation header, never `/plugin`'s report.
- **L-021 → promoted: `.claude/CLAUDE.md` install-cache anti-pattern** (folded into L-010's bullet: *running* from the cache is the sibling of *editing* it) — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; Sprint-023 read it as a code gap, Sprint-039 ran a whole sprint stale and survived only by reading references from the repo. Related: TD-015 (nothing guards the interactive path).

---

## L-020 [tags: process] [status: promoted]: shipping ≠ wiring — a new capability must fire end-to-end through every job that triggers or chains it.
- **L-020 → promoted: CLAUDE.md anti-pattern + DoD wiring check** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; seen Sprint-022 + Sprint-024.

---

## L-019 [tags: process] [status: active]: Same-provider model tiers don't decorrelate *factual* errors — cross-tier ≠ cross-provider. Probe (TASK-065, SPRINT-021 T2): one factual claim with knowable ground truth run across Haiku/Sonnet/Opus/Fable — the base dispatch tier (Sonnet) was already correct, so Opus/Fable *confirmed* rather than corrected, and Haiku honestly abstained (no hallucination). No divergence → no shared crack exposed to decorrelate. Pattern: model-diversity that shares a training lineage buys confirmation, not error-correction; genuine factual decorrelation needs a *cross-provider* model — the exact dependency that gates the multi-model backend (TASK-047). A cheap probe can only fail to find a crack, never prove absence (N=1, can't manufacture a shared-blind-spot case).
- seen: Sprint-021
- count: 1
- promoted: no
- related: L-018 (framing diverges, factual untestable on a judgment fork) · L-014 (fact-verify) · TASK-047

---

## L-018 [tags: process] [status: active]: A single-model `/council` diverges on *framing* but not (testably) on shared *factual* priors — so "5 personas = theater" is false for framing. Measured (TASK-048, SPRINT-020 T4): on a judgment fork the 5 personas surfaced 5 *distinct* decision dimensions (First Principles strongest 3/5; the lone build-lens flagged biggest blind-spot 5/5) — genuine framing divergence, matching council-improvements finding #4 (single-model reduces framing blind spots). But a judgment fork has no external-facts surface, so it CANNOT test shared knowledge/factual gaps — the real ceiling. Pattern: measure council divergence on the axis you actually doubt; framing divergence is demonstrable and real, the shared-factual-priors crack needs a FACTUAL decision to expose (→ TASK-065).
- seen: Sprint-020
- count: 1
- promoted: no
- related: L-014 (adversarial fact-verify catches shared-prior misattribution) · council-improvements.md finding #4

---

## L-017 [tags: process] [status: promoted]: an adoption scan judges the DELTA over the existing surface, not a tool's standalone merit — map each candidate to what we already have first; only the remainder is a keeper.
- **L-017 → promoted: CLAUDE.md anti-pattern (adoption = delta over existing surface)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; Sprint-014 (bmad → 5 keepers) + Sprint-016 (structarmed → 0 · brainstorming → ~90% owned).

---

## L-016 [tags: process] [status: promoted]: when the repo lacks a feature's substrate and cannot dogfood it, verify on the consumer path — "didn't fire here" means neither broken nor fine.
- **L-016 → promoted: CLAUDE.md anti-pattern (L-015 extension)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; seen Sprint-015 + Sprint-020.

---

## L-015 [tags: process] [status: promoted]: evaluate every change against the CONSUMER who installs the plugin, not only our own dogfooding — no leaked repo-specific path, and README/CHANGELOG reflect user-visible changes.
- **L-015 → promoted: CLAUDE.md anti-pattern + DoD item ("consumer-facing surface checked")** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; SPRINT-013 leaked gen-index refs into generic skills, SPRINT-014 extended the leak and shipped a stale README.

---

## L-014 [tags: process] [status: active]: Adversarial fact-verify catches misattribution that reasoning-review — and author judgment — miss. SPRINT-014 T3's new `/council` fact-verify pass found `arXiv:2604.03173` is a REAL paper whose *cited figures* were fabricated; the sprint author had earlier dismissed the ID itself as fake — wrong on both counts. A reasoning-only critique cannot catch a claim whose source EXISTS but doesn't say what's claimed; only fetching the primary source does. Pattern: when a decision/doc rests on external citations, verify the source *says the thing*, not merely that a source exists.
- seen: Sprint-014
- count: 1
- promoted: no
- related: L-007 (exercise on real input) · L-006 (fresh eyes catch author-blind gaps)

---

## L-013 [tags: tooling] [status: active]: Convention isn't enforcement — a field/rule called "required" is only required if a check enforces it. SPRINT-013 T1's `[tags][status]` schema was "required" only via template + skill prose until an assume-guilty self-review flagged it; a `qa-check.sh` metadata-completeness lint made it real (a missing/typo'd tag now FAILs, instead of silently dropping from the generated index). Pattern: back any "required" field with a lint, or it silently rots.
- seen: Sprint-013
- count: 1
- promoted: no
- related: L-007 (spec/convention isn't trusted until exercised on real input)

---

## L-012 [tags: docs] [status: active]: References-first under a SKILL cap — when a skill is near its ≤110 cap, add behaviour via `references/` (uncounted, ADR-006) or reword existing lines in place, rather than append a section. SPRINT-012 landed 5 behaviours with `orchestrator/SKILL.md` held at 109/110; a naive "append per task" would have busted the cap. Pattern: at G2, choose the landing spot (references vs body) before editing a near-cap skill.
- seen: Sprint-012
- count: 1
- promoted: no
- related: L-008 (SSOT dedup near cap) · ADR-006 (references uncounted)

---

## L-011 [tags: tooling] [status: active]: A committed shell script must be pinned to LF (`*.sh eol=lf` in `.gitattributes`). On a Windows checkout with `autocrlf`, git rewrites the file to CRLF and the `#!/usr/bin/env sh` shebang gains a trailing `\r` — the interpreter becomes `sh\r` and the script fails to run. Caught only by git's "LF will be replaced by CRLF" warning, not by any test. Pattern: when a markdown/config repo gains its first executable script, add the `eol=lf` attribute in the same change.
- seen: Sprint-008
- count: 1
- promoted: no
- related: L-005 (edit-mechanism discipline — text round-trips corrupt files)

---

## L-010 [tags: tooling] [status: promoted]: when editing an installed plugin the target is the repo source (`skills/…`), never the install cache — a cache Read does not satisfy read-before-edit.
- **L-010 → promoted: CLAUDE.md install-cache anti-pattern** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; seen Sprint-007 + Sprint-009 + **Sprint-047 (count 3)**. L-021 carries the *running*-from-cache sibling.
- Sprint-047's sighting is a **retrieval miss, not a knowledge gap**: the rule was promoted, in context, and still broken — `SPRINT.md.template` was edited in the cache before being caught and redone against the source. A promoted rule that keeps getting broken needs a different intervention than another promotion.

---

## L-009 [tags: edit-safety] [status: promoted]: structure-adjacent edits — table rows, list entries — silently fuse or corrupt neighbours; re-read the whole structure afterwards.
- **L-009 → promoted: CLAUDE.md Edit-safety trap (b)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; Sprint-007 + Sprint-028 + a third at 029 promote (a TODO.md heading fused into a neighbouring task block).

---

## L-008 [tags: docs] [status: promoted]: an SSOT doc accretes duplication of its satellites until it nears its cap — run a periodic dedup pass at promote.
- **L-008 → promoted: CLAUDE.md anti-pattern + TD-006** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; Sprint-006 + Sprint-008, when CONTEXT.md hit 129/130.

---

## L-007 [tags: process] [status: promoted]: a new behaviour's final DoD must be exercised once on real input — the spec-only-debt trap.
- **L-007 → promoted: CLAUDE.md anti-pattern** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; Sprint-003 (TD-001) + Sprint-004 (T3/T5). L-058 completes it for gates with the must-FAIL fixture bar.

---

## L-006 [tags: process] [status: promoted]: cold-context review surfaces author-blind spec gaps the author cannot see — 7 in one fresh-install run.
- **L-006 → promoted: orchestrator § Review (the fresh-context Review pass)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; Sprint-003 + Sprint-007. It is what caught L-009's fused table rows.

---

## L-005 [tags: edit-safety] [status: active]: PowerShell `Get-Content`→`Set-Content` round-trips corrupt UTF-8 markdown (em-dashes → mojibake) — edit files with the Write/Edit tools, never shell text pipelines
- seen: Sprint-002
- count: 1
- promoted: no

---

## L-004 [tags: sprint-model] [status: active]: Append-only-forever ledgers contradict LAW 3 — no archive trigger exists anywhere, so TODO.md / CHANGELOG.md bloat in a long agentic loop → fix: TASK-012 (§11 Retention)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-003 [tags: sprint-model] [status: active]: The sprint model assumes a single work stream — one Active Sprint pointer + the "one sprint at a time" rule make two parallel streams in one repo collide on TODO/ledgers → fix: TASK-011 (stream concept)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-002 [tags: process] [status: active]: The detailed grill never fires on the conducted path — task-decomposer's "don't re-interview" escape hatch + sprint-bulk's batch-G2 collapse it to one pass, and G2 is too late anyway (tasks already written) → fix: TASK-010 (grill at intake)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-001 [tags: docs] [status: active]: DOCS_Guide §2 defines no placement — generated docs pile up at the host-repo root, and the standard contradicts lean-flow's own repo (docs/ARCHITECTURE, docs/CHANGELOG) → fix: TASK-009 (placement column + prime/migrate alignment)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no
