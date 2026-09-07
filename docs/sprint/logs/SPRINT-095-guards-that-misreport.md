---
sprint: 095
slug: guards-that-misreport
owner: Maintainer
last_updated: 2026-09-07
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-095 — Execution Log

> Append-only companion to [`../SPRINT-095-guards-that-misreport.md`](../SPRINT-095-guards-that-misreport.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-07 | promote | Plan locked at `2453678`, four tasks, 27 DoD

Promoted from a Backlog groomed the same day (`/triage` → `/task-decomposer` → promote). Single
stream, no `epic:` — checked at promote rather than assumed: T1–T4 trace to TD-125, TD-132,
SPRINT-094's close-Retro and TD-117/TD-128, none an EPIC-015 member.

### 2026-09-07 | surprise | the pre-dispatch preflight HALTs on this sprint's own Plan

Run at G2 sequencing, before any dispatch. Three findings, and **only one is a Plan defect**:

```
PASS base-ref: declared base matches live HEAD (18b9a0b)
FAIL cycle-detected: tasks unresolved -> T3 T4
FAIL shared-file-unowned: scripts/lib/check-layers-observed.sh ~ scripts/lib/ in T1 and T3
PASS shared-file-owned: scripts/qa-check.sh in T3,T4 order=T3->T4
PREFLIGHT: HALT
```

(a) **The cycle is TD-132 firing on the Plan written to fix it.** T3's and T4's `Depends-on:` fields
carry explanatory prose containing the literal `T3`/`T4`, which the unanchored `grep -oE 'T[0-9]+'`
harvests as edges, inventing self-edges no topological sort resolves. The real graph is
`T1:none T2:none T3:none T4:T3` — acyclic. Stripping the prose would silence the gate **and destroy
T2's motivating artifact**, which is gate-dodging (an orchestrator red flag), so the prose stands.

(b) **The shared-file FAIL is real and is mine** — see the `scope-change` entry below.

(c) The `shared-file-owned` PASS agrees with D1, but it is derived from a parser known to invent
edges, so it is **not** treated as evidence until T2 lands and the preflight is re-run.

### 2026-09-07 | surprise | TD-125 reproduced under control — and the signal it names does not discriminate

A1 required confirming before designing T1. Two flawed attempts preceded the good one, both recorded
because the flaws are the instructive part:

1. **Archived 092 and 093 together** — that is the documented *workaround*, not the defect: with both
   gone there is no active sibling for the re-attribution to land on. Measured nothing.
2. **Archived 093 alone but passed only `SPRINT-092-*.md` to the checker** — `sibling_sprints` is
   built from `"$@"`, so 092 had *no siblings at all* in that leg. The archive move and the argument
   set both changed; the result was confounded and its 85-pair figure unattributable.
3. **Controlled:** both legs invoke the checker with `ls docs/sprint/SPRINT-*.md`, exactly as
   `qa-check.sh:1013` does, so the archive move is the only variable.

| | 093 in place (4 files) | 093 archived alone (3 files) |
|---|---|---|
| PASS lines | 1 | 1 |
| FAIL lines | 4 | **4** |
| 092 blamed `commit:path` pairs | **3** | **85** |

**Neither the PASS nor the FAIL line count moves.** TD-125 records the *pass* count as "the second
signal and the one worth keeping" — true of the whole `qa-check` gate, where twelve checks stopped
being invoked, but **false at the checker level**, which is where T1 works. Here both red/green
figures are identical across the legs while 82 additional files are misattributed. The only
discriminating measurement is the blamed-pair count. T1's DoD is restated on that basis below.

Also measured: the gate is **already red in place** — 4 FAILs (`f717e9a` attributable to no task,
reported against 092/093/094; `fa061bc:TECH-DEBT.md`; `T1:TECH-DEBT.md` undeclared). All pre-existing,
all TD-107's class, none caused by this sprint.

### 2026-09-07 | scope-change | T1 DoD-2 restated — the criterion was unsatisfiable at freeze

**What broke:** DoD-2 read *"green in place AND green archived"*. The gate is not green in place and
was not at promote either — the four FAILs above predate this sprint. A criterion that cannot pass
however well the work is done is L-088's shape (a DoD frozen at promote against an unmeasured
premise) and L-185's (a criterion resting on a state that does not hold).

**Impact:** the Plan's § Plan is edited after freeze, so this entry precedes that edit. Scope is
unchanged — T1 still fixes the archived-sibling attribution and nothing more. What changes is how the
fix is *measured*, and the new measure is strictly stronger: pass/fail counts would have gone green
without discriminating anything.

**Re-confirm G2:** owner-ruled 2026-09-07 — measure the blamed-pair delta, and state explicitly in
the criterion that PASS/FAIL line counts do not discriminate this defect, so a later reader does not
substitute them back.

### 2026-09-07 | scope-change | T3 `Layers:` narrowed from a directory token to its file

**What broke:** T3 declared `scripts/lib/` — a **directory** token, which under the preflight's
`covers()` prefix arm swallows every path beneath it, including T1's
`scripts/lib/check-layers-observed.sh`. That produced `FAIL shared-file-unowned` between T1 and T3
for a file T3 never intended to touch. `dispatch.md`'s own boundary note rules this out: declare a
directory only for a tree **one** task owns.

**Impact:** a false overlap between T1 and T3, which would have forced them sequential for no reason.
No scope change — T3 always meant its own new checker.

**Re-confirm G2:** `Layers:` is a live declaration corrected per task, not a frozen prediction to
defend (L-100) — logged, declared, continue.

### 2026-09-07 | progress | two named-check FAILs overridden on recorded owner ruling (ADR-021)

Neither is ticked past silently; both are recorded here because that is what ADR-021 requires of a
named check's FAIL.

1. **`FAIL cycle-detected` (pre-dispatch preflight)** — overridden. It is TD-132, the defect T2 is in
   this sprint to fix, firing on prose the template sanctions. Evidence contradicting the halt: the
   declared graph is acyclic (`T1:none T2:none T3:none T4:T3`). **Re-run the preflight after T2 lands
   and treat *that* result as the binding one** — including the `shared-file-owned` PASS, which is
   currently derived from invented edges.
2. **`FAIL verify-does-not-reach-target` (`check-verify-reaches.sh`)** — overridden. It pairs
   `092/093` as target against `check-layers-observed.sh` as method and greps the script's text for
   that literal; the script reaches those files because they are **passed as arguments**. TD-087
   records this exact two-method-pairing shape as a known false positive, and it sits inside
   TASK-300's unresolved gate-accuracy cluster.

### 2026-09-07 | progress | G1 + G2 signed; execution order set to T2 → T1 → T3 → T4

G1: goal verifiable, sizes S/M/S/M (no `L`), blast radius mapped, out-of-scope named, assumptions
resolved. Full checklist run for all four — only T2 and T4 carry `origin: decomposer`, and a batch
sign-off never fast-paths the rest.

Assumption outcomes: **A1 confirmed** (measured above; figure corrected from TD-125's ~70 to 85, and
the discriminating signal corrected) · **A2 confirmed** by reading both parser call sites ·
**A3 confirmed with a caveat** — only **11 of 52** recent `sprint(` commits carry an `N of M DoD`
claim (~21%), so the claim-reconciliation half covers a fifth of commits and the *unattributed-tick*
half is the substantive one, exactly as T3's own narrowing clause anticipates · **A4 unconfirmed by
construction**, with the seeded-checkpoint fallback declared in T4's DoD · A5 confirmed.

**Order — T2 first, repair the gate before relying on it.** T2 is disjoint from T1/T3/T4, so nothing
is serialised by moving it up, and every dispatch decision taken before it lands would otherwise rest
on a preflight known to invent edges. Then T1 (unblocks three parked archivals), then T3 → T4 in D1's
order.

consequence · T1 · behaviour:material · governance:high
consequence · T2 · behaviour:material · governance:high
consequence · T3 · behaviour:material · governance:high
consequence · T4 · behaviour:material · governance:high

All four are Tier G guards whose false negative is silent by construction (D4), and T2 additionally
ships to consumers inside the plugin. Depth follows: each gets a worktree-isolated independent
reviewer (L-165 · L-168), not a self-pass.

### 2026-09-07 | surprise | all four `Layers:` declarations were being read as first-line-only

Found while re-running the preflight after the T3 narrowing: the `shared-file-owned` PASS for
`scripts/qa-check.sh` **disappeared**, which it should not have. Cause: the preflight (and the full
checker that mirrors it) treats an **indented** line as continuing a declaration and resets on a
column-0 line (`*) cur="" ;;`). Every `Layers:` in this Plan wrapped at column 0, so the ownership map
was built from each task's **first line only**:

| Task | captured | silently dropped |
|---|---|---|
| T1 | `check-layers-observed.sh` | fixtures + harness |
| T2 | `dispatch.md` | harness + fixtures |
| T3 | `check-dod-delta.sh` | `qa-check.sh`, fixtures |
| T4 | `qa-check.sh` | `qa-budget-check.sh`, harness, fixtures |

SPRINT-094 keeps each `Layers:` on one long line — that is **load-bearing, not house style**. All four
declarations here are collapsed to single lines (L-100 live correction, no scope change), after which
the preflight reports `PASS shared-file-owned: scripts/qa-check.sh in T3,T4 order=T3->T4` from
complete declarations and the T1↔T3 `shared-file-unowned` FAIL stays gone.

**Why it matters beyond this Plan, and a debt candidate (`TD-138`, id derived from a max of TD-137).**
A dropped `Layers:` continuation is a **silent false negative in the ownership map** — the dangerous
direction: two tasks that genuinely share a file can both come back unowned-but-unreported because
neither declared it where the parser looks. Nothing warns. This is `L-186`'s shape one level down —
the detection logic was sound; the **set of tokens it ran over** was not — and it was caught only
because a PASS line vanished between two runs, not by any check. Filing is left to the owner rather
than taken here.

consequence · plan-declarations · behaviour:material · governance:high
