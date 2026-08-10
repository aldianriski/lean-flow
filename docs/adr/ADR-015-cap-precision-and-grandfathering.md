---
id: ADR-015
tags: [docs, tooling]
domain: governance
related: [ADR-006, ADR-007, ADR-012]
---

# ADR-015 — A stated cap is a real number, and the grandfather file is for hard caps only

- **Status:** accepted (2026-08-10)
- **Deciders:** Maintainer
- **Context driver:** clearing the four grandfathered cap breaches (TASK-177) surfaced two that no
  diet can honestly clear, because the defect is in how the cap is stated, not in the file.

## Context

DOCS_Guide §2 writes some caps approximately — `~10` for `AGENTS.md`, `120 soft` for
`research/<slug>.md`, `~150 soft` for `TODO.md`. `check-doc-caps.sh` reads the column and compares
`actual <= cap` as exact integers; the only thing "soft" changes is whether a breach FAILs the gate or
merely reports. So an approximate cap is enforced to the line while reading as a tolerance, and the
gap only shows up on files sitting one or two lines over.

Measured blast radius, taken at this sprint rather than recalled (L-097). Four rows were
grandfathered. Two were genuine mega-docs and took the diet: `loop-hygiene-prd.md` 214 → 118 and
`graphify-daily-value.md` 157 → 107, both by moving whole sections into flat siblings, nothing
compressed (§7). The other two cannot:

- **`AGENTS.md` is 11 against `~10`** — 9 lines of content plus the two-line ownership footer §3
  makes mandatory. The cap never budgeted for the footer it requires, so `~10` was unreachable from
  the day the row was written. There is nothing to remove that the file exists to say.
- **`graph-engineering.md` is 122 against `120 soft`** — no whole section is movable (Findings is 62
  of its 122 lines; moving it guts the doc), and it has no whitespace slack: no consecutive blanks,
  no trailing blank. The only way to reach 120 is re-wrapping prose, which drops two physical lines
  without changing a word. That is gaming the metric, and it is worse than the breach because it
  leaves the number green and the doc unchanged.

Deleting either grandfather row instead would leave the soft branch still reporting the breach but
forfeit the growth ratchet (`recorded && n > rec` → FAIL), so it is a weakening dressed as a
completion — the L-088 shape, a criterion met by re-reading it.

## Decision

Two rules, both about precision rather than permissiveness.

1. **A cap stated in §2 is a real number.** `AGENTS.md` moves from `~10` to **12** — its content plus
   the footer §3 mandates, with one line of headroom for the thin pointer it is supposed to be. An
   approximate cap is not a tolerance the checker can honour; it is a number that has not been decided
   yet, and leaving it approximate pushes the decision onto whoever next trips it.
2. **The grandfather file records hard-cap breaches only.** A soft cap already has a route: the
   checker's soft branch reports the breach every run and §11 routes it to the promote governance
   review for a prune-with-the-owner. Recording it a second time in the grandfather file adds only the
   ratchet, and buys it at the price of a permanent row in a file whose whole purpose is to empty.
   `graph-engineering.md`'s row is removed under this rule and it keeps reporting as `OVER-CAP (soft)`.

Why this over raising the research cap to fit `graph-engineering.md`: §7 forbids exactly that, and it
would move the cap for 27 research docs to accommodate one that is two lines over.

## Consequences

**Positive:** the grandfather file can actually reach empty, which is what makes it a report rather
than a permanent exclusion list. `AGENTS.md` gets a cap it can satisfy. A future reader trips a stated
number instead of an approximation and knows immediately whether they are over.

**Negative (trade-offs accepted):** soft-cap breaches lose the growth ratchet — `graph-engineering.md`
can now drift from 122 upward and the report stays the same shape, where the grandfather row would have
FAILed on growth. This is a real coverage reduction and it is accepted because the soft branch names
the doc on every run and §11 forces the prune question at every promote, so the drift is visible even
though it is not blocked. **Nothing enforces rule 2 yet** — no check rejects a soft row added to the
grandfather file, so today the rule is prose. That guard is a follow-up task, and per L-058 it ships
with its own must-FAIL fixture.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Raise the research cap to 125 | §7 forbids raising a limit to fit content; moves the cap for 27 docs to accommodate one that is 2 lines over |
| Re-wrap `graph-engineering.md` to 120 | Same words, fewer physical lines — the number goes green and the doc is unchanged. Metric-gaming, and it teaches the next reader that the cap is about formatting |
| Trim 2 lines of its content | Deleting content from someone else's research doc to satisfy a 1.7% overshoot; the cap is not the thing that is wrong, but neither is the doc |
| Trim `AGENTS.md` to 10 | Costs the only line telling an agent where commands and validation live, to satisfy a cap that never accounted for the mandatory footer |
| Leave both grandfathered | The file never empties, so every run prints two rows nobody can act on — which is how a report becomes wallpaper |
