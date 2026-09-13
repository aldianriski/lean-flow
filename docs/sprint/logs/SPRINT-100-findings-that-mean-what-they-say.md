---
sprint: 100
slug: findings-that-mean-what-they-say
owner: Maintainer
last_updated: 2026-09-13
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-100 — Execution Log

> Append-only companion to [`../SPRINT-100-findings-that-mean-what-they-say.md`](../SPRINT-100-findings-that-mean-what-they-say.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-13 | progress | G1 + G2 batch pass; four Assumptions resolved against the tree

G1 ran the **full** checklist for all five tasks, not the fast-path: `TASK-338/339/340/341/343` are
every one `origin: close-retro`, and only `origin: decomposer` earns the one-line confirm.

Assumptions, derived rather than inherited (L-130):
- **A1 CONFIRMED** — `run-system-verify-fixtures.sh` IS registered in `eval_harnesses_always`
  (`scripts/qa-check.sh:1063`, placed at SPRINT-068 T2 per the comment at `:1094`), and the checker
  lives at `evals/lib/check-system-verify-block.sh`; `scripts/lib/` holds no such file. TD-086's
  Evidence half is stale in exactly the two ways T3's DoD 4 predicts. Its substance — fixtures only,
  never live logs — stands and is unaffected.
- **A2 CONFIRMED as a stale-figure risk.** TD-089's own tracker line already carries re-derived
  figures (195 `S<N>.<CODE>` occurrences vs 38 distinct kebab findings). They are a figure in a row
  and T5 re-derives both at build; neither is quoted forward from here.
- **A3 NOT YET CONFIRMED — deferred to T4's build-time measurement**, but its design was settled at
  G2 (see the scope-change below) so that it holds by construction rather than by assertion.
- **A4 CONFIRMED, and stronger than the Plan assumed.** The live corpus does not report
  "0 confirmed targets"; it short-circuits one step earlier — SPRINT-100 contains **zero**
  `*Verify:*` clauses, so `check-verify-reaches.sh` examines nothing at all on live input
  (`sh scripts/lib/check-verify-reaches.sh docs/sprint/SPRINT-*.md` → one note line, exit 0). T1's
  vacuity argument (L-156) is reinforced; DoD 4's requirement to vary the *selection* rather than the
  verdict is the only thing that can give T1 a non-empty denominator.

consequence · T1 · behaviour:material · governance:high
consequence · T2 · behaviour:material · governance:high
consequence · T3 · behaviour:material · governance:high
consequence · T4 · behaviour:material · governance:high
consequence · T5 · behaviour:low · governance:high

### 2026-09-13 | scope-change | `Layers:` narrowed on T1, T2, T4 — declaration granularity, not scope

**What broke.** The pre-dispatch preflight HALTed on three findings, all of one shape:

```
FAIL shared-file-unowned: evals/fixtures/ in T1 and T2 has no Depends-on edge, direct or transitive
FAIL shared-file-unowned: evals/fixtures/ ~ evals/fixtures/system-verify/ in T1 and T3 ...
FAIL shared-file-unowned: evals/fixtures/ ~ evals/fixtures/system-verify/ in T2 and T3 ...
```

The preflight is correct as written — its `overlaps()` prefix arm (TD-043) treats a directory token
as colliding with anything beneath it, deliberately, so that `evals/` and `evals/fixtures/foo/` do not
read as unrelated. The collision is in the **declaration**, not in the work: derived from the
harnesses themselves, T1 reads only `evals/fixtures/verify-reaches/`, T3 only
`evals/fixtures/system-verify/`, and T2's `run-conformance-engine-fixtures.sh` builds every fixture in
`mktemp -d` and touches no `evals/fixtures/` subdirectory at all. D3's ruling that T1 and T3 are
disjoint is substantively right; the Plan simply declared a parent directory none of the three owns.

**Impact.** No task's scope, acceptance or DoD changes — this narrows three `Layers:` lines to the
paths their own harnesses read, which L-100 names as the expected cost of declaring before the work.
A fourth `Layers:` edit follows from the T4 design ruling below. Logged here **before** § Plan is
edited, per ADR-014 and this file's own header.

**Re-confirm G2.** Owner-approved 2026-09-13 (AskUserQuestion, two-question frontier round). Waves
after the edit: `[T1 T2 T3] → [T4] → [T5]`; D1's `scripts/lib/conformance-engine.sh` ownership
(T2→T4) is untouched and still PASSes.

### 2026-09-13 | scope-change | T4's informational token is drawn gate-side, in leg 2f-ter

**What broke.** T4's `Layers:` names `scripts/lib/conformance-engine.sh` (finding emission) first, and
TD-146 names both the engine and the relay as Location. Building it engine-side does not work: the
engine cannot know the caller's policy. `gates-signed:` and `S13.*` findings are emitted by the *same*
`bad()` at `conformance-engine.sh:92` as every other finding, and which of them count is decided
downstream by two anchored greps in `qa-check.sh` leg 2f-ter (`^(PASS|FAIL)  gates-signed:` and
`^(PASS|FAIL)  S13\.[A-Z]+ `). "Informational" is a property of **this gate's policy**, not of the
finding — the engine already has a finding-level token for the other thing (`GAP`, for unbuilt rules).

**Impact.** The distinction is drawn where the policy lives: leg 2f-ter relabels only the **printed**
copy of `ce_out`, while the two fold-in greps continue to run over the unmodified capture. This makes
**A3 true by construction rather than by measurement** — the arithmetic cannot move, because the lines
it is derived from are not the lines that were rewritten. T4's build-time A3 assertion still runs, now
as confirmation rather than as the only evidence. Two further consequences: `conformance.sh`, the
ADR-027 consumer entry point whose exit code adopters may gate CI on, is untouched — correct, since for
a consumer every finding **is** gating (L-015); and T4's `Layers:` drops
`scripts/lib/conformance-engine.sh`, which dissolves its D1 shared-file edge with T2.

**Re-confirm G2.** Owner-approved 2026-09-13, same round. T4's `Depends-on: T2` is **retained** despite
the shared file disappearing: both tasks still change `evals/run-conformance-engine-fixtures.sh`, so
the ordering constraint survives on that file alone. The policy of which findings gate is unchanged —
a DoD that moved a count would have exceeded this task, and none does.
