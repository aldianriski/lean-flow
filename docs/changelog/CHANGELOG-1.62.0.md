---
owner: Maintainer
last_updated: 2026-09-13
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v1.62.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v1.65.0 release** (2026-09-13), together with
> v1.63.x — both were overdue, because v1.64.0 was written at the SPRINT-098 close without a version
> bump and so fired no rotation. Reachable only from the root `CHANGELOG.md`.

## v1.62.0 — Full Run and the First Family (2026-08-29)

SPRINT-091, closed at **41 of 41 DoD**. EPIC-014's fourth member sprint, completing **§ Closed-when 2**:
the TypeScript engine runs *whole*, and the first rule family evaluates at parity with Shell.

**The gate is not faster, and that is the promise kept rather than broken.** § Scope said so from the
start: the conversion that turns this capability into a faster gate is SPRINT-092's, travelling with the
measurement that proves it. Shipping a saving apart from its evidence is how an unmeasured claim gets
recorded as fact.

| Shipped | What |
|---|---|
| **A type checker, admitted and gated** | The repo stated guarantees "enforced by a TYPE" while nothing evaluated one. `tsc --noEmit` now runs as its own gate leg and FAILs on the exact case TD-101 recorded. An absent toolchain **FAILs rather than skips** — a skip is indistinguishable from a pass (ADR-037) |
| **Full Standard traversal in TypeScript** | Mark-driven dispatch, gap and hold reporting, full-run level arithmetic, at parity with the Shell engine. `--section` composes through the *same* multi-family seam the flagless run uses (ADR-038) |
| **The §4 ADR-governance family, migrated whole** | All five rules — `S4.ONEFILE` · `S4.INDEX` · `S4.SECTIONS` · `S4.NEGATIVE` · `S4.APPEND` — evaluating in TS and agreeing with Shell on nine retained fixtures. S4.APPEND reads real git history behind a port, with an in-memory fake |
| **`--spec <path>`** | **User-visible.** `leanflow` now evaluates a caller-supplied spec instead of the one shipped beside it, composing with `--section` and the flagless run. Threaded to *every* spec-consuming port, including the §12 prose reader — verified by doctoring the prose itself, not by reading the code |
| **`hold` renders distinctly, and the level reaches the CLI** | `hold` no longer prints identically to a plain note at any of the three render sites, and `leanflow <repo-dir>` prints a conformance level matching Shell's |

**Consumer note.** `--spec` is additive; every existing invocation behaves exactly as before, defaulting
to the bundled Standard. The one behaviour that *changed* for an existing invocation is that
`leanflow <repo-dir>` and `--section 4` now actually evaluate §4 rather than reporting five
`rule-unimplemented` gaps — so a repository with an ADR-governance violation will now be told about it.
That is slower: S4.APPEND spawns git per ADR, and a full run on a 38-ADR repo went 0.689s → 6.948s.
Correct behaviour billed at a real price, tracked as **TD-120** and to be paid down before §4 authority
moves off Shell.

**The sprint's own worst defect was structural, not a bug: three capabilities shipped that nothing
called.** `attachLevel` (fixed by T11), the two §4 registries (fixed by T12), and TD-103's pair before
them. Each builder was blameless — the seam sat outside every task's declared `Layers:`, so no task
owned it and no diff-scoped reviewer could see it. **`L-020` was already promoted and live in the DoD as
a "Wiring check", and the class shipped three times anyway**, because a prose DoD asking *"is it wired?"*
is answered by the one person who cannot see the seam. `TASK-318` proposes detecting it mechanically.

**Found only by independent review, never by recalling the rule:** the §4 registries composed into
nothing (which, because `gap` never moves the level counter, laundered a real `S4.INDEX` violation into
`level: Attested`); two DoD that reviewers **weakened rather than confirmed** — T12's level match being
over-determined, T7's plugin-installer framing being asserted; and a `check-layers-completeness` FAIL
caused by the tick evidence itself, three times. Every one was caught by a guard firing, a disagreeing
second number, or an outside pass.

`TD-117`–`TD-120` filed · `TASK-318` filed `origin: close-retro` · `L-170` bumped to `count: 2` after
recurring **inside this sprint's own close** — the identical worktree-contaminated `grep` returning
`L-999` against a real maximum of `L-180`.

