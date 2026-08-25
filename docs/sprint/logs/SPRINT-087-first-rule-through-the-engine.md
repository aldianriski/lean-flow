---
sprint: 087
slug: first-rule-through-the-engine
owner: Maintainer
last_updated: 2026-08-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-087 — Execution Log

> Append-only companion to [`../SPRINT-087-first-rule-through-the-engine.md`](../SPRINT-087-first-rule-through-the-engine.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-25 | surprise | A5 attributes the six marks to ADR-036; they are STANDARD §14's

Found while confirming assumptions at Batch G1, before any task started. A5 reads *"The six marks are
frozen by ADR-036. Confirm: ADR-036 § Decision"* — and § Decision freezes the **verdict vocabulary**
`PASS` · `FAIL` · `GAP`, deferring severity to H15. It names no marks. The same attribution repeats in
§ Scope "Out", **D6**, and **T2's DoD 3** — four sites.

The *count* is correct: `spec/STANDARD.md` §14 defines exactly six marks — `mechanical` ·
`judgment-only` · `split` · `implementation-directed` · `restated` · `standard-directed`.

**Why it is bounded:** T2 DoD 3's `Verify:` clause already names *"the Standard's own"* mark set, so
the check reaches §14 and the criterion stays satisfiable as written. What breaks is the reader — an
implementer following the citation lands on an ADR that cannot answer the question (L-151). Noted for
the Retro: this is the failure **ADR-036 itself codifies** — *"point at the artifact; a row that can
point at nothing is a design intention wearing a contract's clothes"* — reproduced inside the sprint
that cites it.

**Owner ruling (G1):** citation defect, **not** a scope change — no criterion becomes unreachable, so
§ Plan is not edited and no `scope-change` is owed. Filed as **TD-096** (id derived from the ledger
max, not incremented from memory — L-143) and execution proceeds.

consequence · pre-T1 · behaviour:low · governance:low

### 2026-08-25 | progress | Owner-action closed at G2 — first rule family is F12 (§12 git boundary)

The Plan deferred this to G2 by **D4** precisely so it could not be absorbed silently into T3.
Recorded as **D7** in § Decisions, which is where T3's DoD 1 requires it (*"a D-row names the family
and which criterion selected it; an unrecorded pick is the L-151 shape"*) — the Execution Log alone
would not have satisfied it.

**The evidence inverts the obvious reading.** Round 5's recommendation ranks families
*expensive-first* per V3 §43 — but § Scope assigns §43 to families **2..n**, and the Owner-action's
criterion for family 1 is *cheap + representative*. Ranking by §43 here would have selected F11
(84.7 s) or F6 (72.1 s), the opposite of what this sprint wants. Chosen instead on the stated
criterion: **F12**, 2,240 ms real-scale (8th of 12), four rules, Structural level, one filesystem
port. Reasoning and runners-up in D7.

consequence · pre-T1 · behaviour:low · governance:high

### 2026-08-25 | surprise | G2 pre-screen FAILs on T4 — the guard is wrong, not the criterion

`sh scripts/lib/check-verify-reaches.sh` on the Plan emits `verify-method-absent` for T4 DoD 1, which
names `read-spec-rules.sh --section N`. **The finding is false.** `scripts/lib/read-spec-rules.sh` is
present, offers `--section`, and ADR-034 §64 records a working invocation. The guard extracts the
`*.sh` token and tests `[ -f ]` against CWD, so a **bare basename** — this repo's dominant convention —
resolves to nothing and is reported as *"does not exist in this repository"*.

**Why five sprints of green did not catch it.** The checker exempts `*/archive/*` (line ~55), so it
only ever inspects the active sprint. Archived Verify clauses carry **17 bare-basename references**
(`conformance.sh` ×8, `check-manifest-lockstep.sh` ×3, `check-doc-caps.sh` ×3, `check-epic-archive.sh`
×2, `qa-check.sh` ×1) — every one would trip this. The convention and the guard have disagreed since
the guard shipped at Sprint-082 T3; the disagreement was structurally invisible.

Worth recording for the Retro: my first control run — the checker against five archived sprints —
returned silence and I read it as *"they pass"*. It was **vacuous**: the archive exemption meant nothing
was examined. A negative control proves a query fires on rows it reaches, never that it reached them
(L-108). The real discriminator was grepping the archived clauses directly for path style.

**Ruled:** false positive on a Tier G guard, same class as TD-095 — filed **TD-097**. § Plan is not
edited; T4 is wave 2, and its DoD 1 will need an explicit ADR-021 owner ruling at tick time, since its
named check FAILs for a reason unrelated to what the criterion asserts. T1 and T8 are unaffected.

consequence · T4 · behaviour:low · governance:high
