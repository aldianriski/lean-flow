---
id: ADR-049
tags: [tooling]
domain: governance
status: accepted
related: [ADR-043, ADR-045, ADR-046, ADR-047, ADR-032]
---

# ADR-049 — Checking a v2 tree requires `bun`; a v1 tree stays `sh`-only

- **Status:** accepted (2026-09-30)
- **Deciders:** Maintainer
- **Context driver:** SPRINT-110 T3 (`TASK-383`). The conformance engine must read sprint members on a
  by-reference (v2) sprint. The one member lookup the rest of the gate already uses is TypeScript on
  `bun`, and `conformance.sh` is an adopter-facing entry point that today needs only `sh`.

## Context

ADR-043 recorded that `conformance.sh` is a documented consumer contract, and it named three
properties any change to the engine must respect. The third is the one this decision takes: **today
the engine needs only `sh`, and adding a runtime is the step that cannot be walked back once adopters
install against it.** ADR-043 deferred that choice to "its own sprint with a consumer-facing design".

That design question is now forced. On a v2 tree (ADR-045), a sprint's work lives in its member task
files, and membership is `## Members` together with every `sprint:` stamp, resolved by id across six
status folders (ADR-047). The engine has seven rules (the TASK-383 hand-off list plus `S9.TWOFILES`)
that read that population. Otherwise they check nothing on a v2 sprint. The lookup already exists, once,
in `scripts/lib/sprint-members.ts`, and SPRINT-110 T4 put a shell-callable wrapper in front of it
(`sprint-members-cli.ts`). Every guard SPRINT-109 and SPRINT-110 retargeted reads members through it.

Two facts make now the right time rather than later:
- **2.0.0 is already breaking** (ADR-046: a hard cut, and every consumer migrates before using 2.x). A new
  requirement announced by the same MAJOR costs adopters one upgrade note, not a second break.
- **The runtime is already the repo's.** Executable logic here is TypeScript on `bun` (owner rule
  2026-09-09 · EPIC-017 D5). This repo's own gate already requires it: `qa-check.sh` FAILs without `bun`.

Measured on this host (Windows, 10-run mean per call): `sh` 33 ms · node 60 ms · `bun` 100 ms
(110 ms for the real CLI) · python3 159 ms. The engine calls the lookup a handful of times per sprint
file, so per-call startup is not the cost that matters. The engine's cost centre is its own shell
dispatch, about 26 ms per rule and 150–300 s of harness time (ADR-043 · TD-168).

## Decision

**On a v2 tree, the conformance engine reads members through `sprint-members-cli.ts`, and `bun` is a
requirement. On a v1 tree the engine stays `sh`-only, byte-for-byte as before.**

When the engine finds a v2 tree and `bun` is absent, it reports a named FAIL (`bun-required`, citing this
ADR). It never skips silently and never falls back to reading the Plan, because a skip on a gate is a
pass nobody examined (TD-042). The requirement is announced with 2.0.0, in README § Upgrading to 2.x
and in `CHANGELOG.md [Unreleased]`.

Why one lookup and not a second one in awk: two selectors for one population drift apart silently.
SPRINT-094 found three guards whose logic was sound over the wrong member set (L-186). A parity fixture
between an awk copy and the TS original would be guarding a duplication this decision can remove.

## Consequences

**Positive:**
- One member selector for every reader: the gate, `night-run.sh`, the engine and the TS guards.
- The v2 rules check what they claim to.
- The measured cost centre becomes portable. A TypeScript engine (TD-168) is now a design question,
  not a blocked one, and is filed as a backlog task sequenced after 2.0.0.

**Negative (trade-offs accepted):**
- An adopter checking a v2 tree must have `bun`, which ADR-043 called hard to walk back. It is taken
  deliberately, at the MAJOR that already breaks.
- An adopter running `conformance.sh` in CI without `bun` sees a red build on their first 2.x run
  until they install it. That is loud by design.
- `night-run.sh`'s v2 `reap()` carries the same requirement (SPRINT-110 T4). It is recorded as debt for
  the consumer-parity tasks (`TASK-372`/`373`) to confirm before release.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Resolve members in `sh`/`awk` inside the engine, with a parity fixture against the TS CLI | A second selector for one population: exactly the L-186 failure class. It would keep ADR-043's property 3 by duplicating the logic every other reader shares. |
| Call the CLI only when `bun` is present, and NOTE-skip the v2 rules otherwise | An adopter without `bun` gets a green run over rules that examined nothing, which is the vacuous pass the whole of EPIC-017's guard work exists to remove. |
| Python (stdlib) for the lookup | A second runtime beside `bun`, which this repo's gate still needs, and slower to start on the measured host (159 ms against 100 ms). No consumer precedent: the owner's Python project runs only on machines it controls. |
| Port the whole engine to TypeScript now | The larger performance win (TD-168), but a large Tier G task on the 2.0 critical path. Filed to follow 2.0 instead. |
