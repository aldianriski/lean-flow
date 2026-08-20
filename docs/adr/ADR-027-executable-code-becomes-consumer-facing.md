---
id: ADR-027
tags: [tooling, process]
domain: governance
status: accepted
related: [ADR-008, ADR-011, ADR-023, ADR-024]
---

<!-- One ADR per file · append-only (never edit a decided ADR — mark it deprecated/superseded) · WHY only. -->

# ADR-027 — Executable code becomes consumer-facing; the exit code is the contract, the pipeline is not

- **Status:** accepted (2026-08-20)
- **Deciders:** Maintainer
- **Context driver:** EPIC-004 ships a conformance engine an adopter runs against *their* repo — ADR-008 admitted executable code on the opposite premise

## Context

ADR-008 (2026-06-21) admitted the first executable code into a prose-only plugin, and scoped it
narrowly on purpose: `scripts/qa-check.sh` guards **this** repository, run by hand at sprint-close.
It closed the CI question in one sentence — *"wiring it into CI stays out of scope (ARCHITECTURE
boundary: lean-flow does not own CI/CD)"*. That reasoning was sound and remains sound for what it
decided; it simply predates the standard having consumers.

Four sprints later the premise no longer describes the code. `spec/STANDARD.md` was extracted and
versioned independently (ADR-018 · ADR-023), SPRINT-074 shipped the first checker that reads the
standard as its **rule source** rather than hard-coding it, and SPRINT-075 turns that into an engine
with a standalone entry point (`conformance.sh`) taking a repo-dir — usable from a clone alone, by a
repository that never installed the plugin. EPIC-004's § Scope promises adopters "CI-friendly exit
codes"; that promise and ADR-008's sentence are reconcilable, but the sentence is broad enough to
read either way, and an unstated reading is what a later sprint trips over. EPIC-004 § Closed-when 5
requires this be **formally amended, not silently outgrown** — which is what four sprints of using
the checkers consumer-ward already was.

Blast radius is small and countable: **11 checkers** under `scripts/lib/` plus the engine and its rule-source reader, **one**
new root entry point, and **zero** CI configuration files in the repo today.

## Decision

**Executable code in this repository is now consumer-facing, and ADR-008 is amended — not superseded
— to say so.** ADR-008's actual decision (hybrid: a dependency-free POSIX-sh script for the
mechanical rules, a checklist for the judgment rules) is untouched and still governs; only its
*scope premise* — that the code targets this repo alone — is replaced. Superseding would discard a
live decision nobody is revisiting.

**The CI sentence is ruled explicitly.** The reading that now holds is *"lean-flow does not own your
pipeline"*, **not** *"lean-flow emits nothing a pipeline can use"*. Concretely:

**What this commits lean-flow to** — the engine documents an exit-code contract an adopter may gate
on: **non-zero if and only if at least one `FAIL` line was printed, zero otherwise**, with
`rule-unimplemented` gaps counted as FAIL because a gap the engine cannot answer is not a pass
(L-058). Named findings stay a published contract (EPIC-002 D3 · TD-012). The standalone entry point
keeps working from a clone with no plugin install.

**What it does not commit lean-flow to** — no workflow file, no marketplace action, no pipeline
config, no hosted service, and no obligation to keep any adopter's build green. lean-flow's own
`qa-check.sh` does **not** gate on the engine's findings (SPRINT-075 T2 ruling: they are relayed, not
counted, while 34 deferred `build` dispositions remain); ADR-011's no-enforcement stance and
EPIC-004 D3's *"conformance reports; it never blocks"* are unchanged. Whether to fail a build on the
exit code is the adopter's call, made in the adopter's pipeline.

## Consequences

**Positive:** the standalone entry point becomes honestly usable — an adopter can gate on a stable,
documented signal instead of scraping report text; EPIC-004's published claim and the repo's own
architecture boundary stop contradicting each other; and § Closed-when 5's *"not silently outgrown"*
is satisfied by a record rather than by practice.

**Negative (trade-offs accepted):** the exit-code semantics become a compatibility surface — changing
what counts as FAIL is now a breaking change for an adopter's pipeline, so it belongs to the spec's
own versioning discipline (ADR-023), not to a convenient refactor. Consumer-facing code also raises
the bar on every checker in `scripts/lib/`: a crash or a false positive now reaches strangers, and
`scripts/`'s "maintainer tooling, nobody outside invokes it" framing in
`docs/architecture/overview.md` is narrower than the truth from here on.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Supersede ADR-008 entirely | its hybrid decision is still live and unrevisited; superseding re-states it for no gain and demotes the 2026-06-21 reasoning from rule to history |
| Read the CI sentence literally — exit code informational, no promise | safest against ADR-008's wording, but contradicts EPIC-004's published "CI-friendly exit codes" and leaves the standalone entry point half-useful: a report an adopter must parse by eye |
| Admit full CI ownership (ship a reference workflow/action) | maximally useful, but reverses the ARCHITECTURE boundary and pulls maintenance of someone else's pipeline into scope — beyond anything EPIC-004 promised |
| Leave it implicit; the practice already changed | exactly what § Closed-when 5 forbids, and the reason it was written as a condition rather than a note |
