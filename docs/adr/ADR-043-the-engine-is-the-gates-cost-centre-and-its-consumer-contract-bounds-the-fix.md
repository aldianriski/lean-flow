---
id: ADR-043
tags: [tooling, process]
domain: governance
status: accepted
related: [ADR-027, ADR-008, ADR-029, ADR-039]
---

# ADR-043 — The conformance engine is the gate's cost centre, and its consumer contract bounds how it may be made faster

- **Status:** accepted (2026-09-20)
- **Deciders:** Maintainer
- **Context driver:** SPRINT-103 T3 (`J2`). Round 16 named five hotspots worth 63% of the gate; measuring them found that three of the five are the same program, and that program is the one file lean-flow ships to other repositories.

## Context

SPRINT-103 set out to port Round 16's measured top five. Measuring them first — the whole point of
the sprint, after SPRINT-102 ported five checkers chosen from a model and moved the gate by nothing
— produced a result the Plan did not anticipate.

**Three of the five targets are one program.** `run-sprint-family-fixtures.sh` (305 s),
leg 2f-ter's sweep (139 s) and `run-conformance-engine-fixtures.sh` (98 s) are **542 s — 71% of the
top five — and all three are `scripts/lib/conformance-engine.sh`.**

**They are not the same cost, and that distinction is the useful part**
(`docs/research/logs/qa-gate-timing.md` Rounds 17–18):

| | what it pays | measured |
|---|---|---|
| T1 | **fixed per-rule dispatch**, 68× against tiny fixture dirs | engine vs an *empty* dir: 2.93 s at 100 rules, 0.35 s at 0 — ~26 ms/rule paid whether or not anything is checked |
| T3 | **per-file spawns over a large corpus**, once | engine vs this repo: 173.1 s real / 53.8 user / **81.1 sys** — fixed dispatch is 2.9 s of it, **1.7%** |

T1's cost is removable by handing the engine a spec reduced to the rules its assertions actually
need — a technique already shipped here three times. **T3's is not.** At 60% of CPU time in the
kernel, the engine is shelling out per file per rule and paying `fork()` emulation on every one; no
spec reduction reaches that without dropping rules, and dropping rules is a coverage change D6
forbids. The instrument that *would* reach it is a port to an in-process implementation.

## Decision

**The engine is portable in principle and is not ported here. The port is its own sprint, and this
ADR records the constraint that sprint inherits rather than the deferral.**

`conformance-engine.sh` is **consumer-facing**. ADR-027 amended ADR-008 to make it answer for *any*
repository through the root `conformance.sh`, and **its exit code is a documented contract an
adopter may gate CI on.** A port is therefore not an internal refactor, and three properties bind it:

1. **Exit code parity** — byte-identical across the full corpus, not just fixtures. An adopter gating
   CI on it sees any divergence as their build breaking.
2. **Report text parity** — adopters diff and grep this output. Reformatting is a breaking change
   even when every verdict is correct.
3. **A new runtime requirement on the adopter's machine.** Today `conformance.sh` needs only `sh`. A
   TypeScript port needs `bun`. **This is the property no parity test inside this repo can surface**,
   because every test here runs on a host that already has `bun` — it is a change in what the product
   demands of someone who has not adopted our toolchain (L-015).

Property 3 is why this is an ADR and not a ledger row. Exit-code and report parity are reversible —
a wrong port is fixed by fixing it. **Shipping a `bun` requirement is not**: once adopters install
against it, withdrawing it breaks them, so the trade-off is taken once and is hard to walk back.

## Consequences

- **T1 proceeds independently and is unblocked by this.** Its lever is the reduced spec, which
  touches no consumer surface — the harness is ours, the engine is not.
- **T4 is unblocked on the engine side:** the engine is read-only for the remainder of SPRINT-103.
  Its harness may still be examined on its own terms.
- **The port is filed as `TD-168`** and needs its own sprint with a consumer-facing design: parity
  over the real corpus, and an explicit decision on the `bun` requirement — which may mean shipping
  both implementations, or shipping the port only for this repo's internal legs and leaving
  `conformance.sh` on `sh`.
- **The default profile is already protected.** SPRINT-084 T1 made leg 2f-ter hand the engine a
  reduced spec by default; the 139–173 s full sweep runs only under `QA_FULL=1` — which is promote,
  close, and any full-profile run (ADR-039). The cost is real but it is not on every gate run.
- **What is not decided:** whether an in-process implementation actually recovers the 81 s of `sys`.
  That is a prototype's question. Nothing here should be read as a promise of the size of the win.

## Alternatives considered

- **Port it inside SPRINT-103.** Rejected: it converts a five-task performance sprint into a
  shipped-interface rewrite, and would have T1 and T4 queue behind the riskiest item.
- **Rule it untouchable and stop.** Rejected: it is the largest single porting opportunity in the
  gate, and the measurement showing why is exactly what this sprint exists to produce. Declining to
  act on it is not the same as declining to record it.
- **Reduce the spec for leg 2f-ter further.** Rejected: fixed dispatch is 1.7% of the leg, so there
  is nothing there to win, and going further means dropping rules — a coverage change (D6).
