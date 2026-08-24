---
id: ADR-033
tags: [process, tooling]
domain: skills
status: accepted
related: [ADR-031, ADR-021, ADR-022, ADR-011]
---

# ADR-033 — Gate discovery gains a declared rung, and a missing gate routes on risk

- **Status:** accepted (2026-08-24)
- **Deciders:** Maintainer
- **Context driver:** the discovery order reported *no gate* about a repository that runs one on every
  commit — this one — so the pass most responsible for proving a run finished could not find its own
  proof.

## Context

`/orchestrator`'s System verify pass discovers the host's gate command rather than assuming it, in three
rungs: a package manifest's `test`/`check`/`verify` script, a `Makefile`/`justfile` target, then a CI
config's test step. That refusal to hard-code is right and is not in question here.

What went wrong is the **completeness** of the rungs and the **meaning** of their failure.

**Measured blast radius, on this repository:** no `package.json`, `Makefile`, `justfile`,
`pyproject.toml`, `Cargo.toml`, and no `.github/workflows/`; `.claude-plugin/plugin.json` carries no
`scripts` block. All three rungs miss — every time, on every run — while `sh scripts/qa-check.sh` gates
every commit and is invoked ~50 times across the eval harnesses. `dispatch.md` asserted in as many words
that lean-flow "dogfoods this as `sh scripts/qa-check.sh`". That sentence was true of the *repository*
and false of the *procedure*: the command existed, was used constantly, and the discovery order could
not reach it. A procedure that claims to discover a thing it structurally cannot find is L-119's shape —
a guard whose condition is computed from a source that excludes the case.

The second half is worse, because it is silent. Reaching the end of the rungs emitted
`no-gate-discovered` and **continued to close**, on the stated reasoning that there is "nothing to block
on". That reads absence of evidence as evidence of absence. A behavioural change could close having
proved nothing, and the record showed no trace that nothing had been proved — the exact silent
false-negative ADR-021 exists to prevent, arriving through the one door ADR-021 left open.

The two halves are one decision because fixing either alone is worse than fixing neither. Route on risk
without adding a rung, and this repository parks its own runs on every material change. Add the rung
without routing on risk, and every repo that legitimately has no gate keeps closing unproven.

## Decision

**Discovery gains a fourth rung — a root `.gate-command` file whose first non-blank, non-`#` line is the
command — and it is last.** A declaration is the weakest evidence available here: it is written *for*
this pass, and can go stale against a repo that later grows a real manifest. Anything discoverable wins
over it. A file present but unreadable is `gate-declaration-unreadable` and does **not** count as a
discovered gate, on ADR-031's reasoning: a declaration nobody can read is worse than none, because it
looks like an answer. Absence of the file is not a finding.

**`no-gate-discovered` routes on the risk class of what the run changed, not on the absence of a gate.**
Low-risk / non-behavioural work records the finding and continues, exactly as before. Material work —
behaviour change, auth/permission, input validation, data write or migration, API contract, integration,
deployment, security surface, financial or business calculation — cannot reach a silent close: attended
it draws a recorded owner ruling on *closing unproven*, unattended it parks. When the class is genuinely
unclear it is material; defaulting down reinstates the failure.

**This is not new policy, and that is the point.** night-run.md Part 0's execute-only charter already
parks *decisions*. "Is this proven enough to close?" is a decision. The charter simply never reached this
case, because `no-gate-discovered` had been classified as a non-event rather than as a question. Framing
it as an application of the existing charter is what keeps ADR-011 intact: nothing here enforces a gate
on anyone, and lean-flow still ships no hook.

**The rollup line carries the class** — `no-gate-discovered(low|material)`, reusing `FAIL(...)`'s
existing parenthesis — because a verdict a checker cannot read is not enforceable. An unmarked line
followed by a close is `no-gate-risk-unmarked`: the marker's absence is not a claim of low risk, on the
same reasoning that makes an absent ask channel a BLOCK rather than a default-yes.

## Consequences

**Positive:** the pass can find the gate on a repo that has one and declares it, so its verdict means
what it says. A material change can no longer close on an unexamined absence, and the log now records
*which* class was ruled — so the decision is auditable after the fact instead of living in the run's
head. The classifier is stated once and is the single definition of material risk for both this pass and
Review's depth routing.

**Negative (trade-offs accepted):** a fourth root dot-file, and a consumer-facing one — the surface this
project deliberately keeps small. It can also lie: `.gate-command` is self-reported, and a repo that
declares a command which does not gate it gets a confident false PASS that no rung above would have
produced. Ranking it last limits the exposure without removing it. Risk classification is a **judgement**
made per run, so it will sometimes be wrong; the default-to-material rule makes the wrong direction the
expensive-but-safe one, at the cost of parking some runs that did not need parking. And material work in
a repo that genuinely has no gate now stops where it used to sail through, which is the intended cost.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Add the rung, leave `no-gate-discovered` permissive | Fixes only the repos that adopt the file. Every other repo keeps closing material work having proved nothing — the silent half, untouched |
| Route on risk, no new rung | This repository, and any like it, would park its own runs on every material change while a working gate sat one directory away. A correct rule made unusable by an incomplete discovery order |
| Hard-code a conventional path (`scripts/qa-check.sh`, `make test`) | The exact assumption the pass was written to refuse — it silently runs nothing, or the wrong thing, and reports a false PASS. Also leaks a maintainer path into a consumer-facing skill (L-015) |
| Read the gate from `AGENTS.md` / `CLAUDE.md` prose | No parseable shape, so it fails green and unpredictably. `.conformance-tier` and `.conformance-exempt` already set the precedent that a ruling a tool must act on lives in a file shaped for reading (L-151) |
| Treat an unmarked `no-gate-discovered` as low risk | Silently reinstates the defect for every run that forgets the marker, and does it invisibly — absence read as consent |
| Block on `no-gate-discovered` unconditionally | Punishes prose, config and doc repos that correctly have no gate, and would have parked most of this repository's own history. The cost lands on exactly the changes that carry no risk |
