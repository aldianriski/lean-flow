---
owner: Maintainer
last_updated: 2026-08-20
update_trigger: Rotated out of root CHANGELOG.md at a new MINOR (§11)
status: current
---

# lean-flow — Changelog v1.47.0

> Rotated out of root `CHANGELOG.md` at v1.49.0 (§11: keep current + previous inline).

## v1.47.0 — The Spec as Rule Source (2026-08-16)

MINOR — SPRINT-073, **15 of 15 DoD**, EPIC-004's second member sprint. **`spec/STANDARD.md` 0.3.0 →
0.4.0.** The standard now tells you, in the file itself, which of its rules a tool can check — which is
what makes "build a conformance checker from the spec" possible rather than aspirational.

**What changed for you**

- **Every normative rule carries its conformance level and whether it is checkable, in the spec.** Each
  `## §N` ends with a **Conformance.** table listing that section's rules by a stable id (`S13.TRAILERS`,
  `S2.F-CAP`, …), its level (Structural · Gated · Attested) and its mark. A new **§14** defines the
  model. **Nothing existing was reworded, removed or renumbered** — the prose you pinned at 0.3.0 reads
  identically; this adds a layer beside it (`+300 / −1`, and the one deletion is the version line).
- **Four marks, and the middle two are not the same thing.** `mechanical` · `judgment-only` (**not
  checkable in principle** — the standard is choosing a human) · `split` · `implementation-directed`. A
  `judgment-only` rule is **not debt and never will be**; a `mechanical` rule with no checker is a gap
  someone can close. Collapsing them reports the standard's deliberate boundaries as failures.
- **Five rules must never be evaluated against your repository**, marked `implementation-directed` —
  two of them §13's inference constraints (*a verifier may not conclude approval from an unsigned
  trailer* · *author identity is not the attestation*). They bind a tool, not a repo. A checker reading
  them as repo rules emits findings **you could never clear**.
- **No percentage, no score, no grade — now stated normatively in §14**, so it binds your tools rather
  than living in our notes. A ratio *improves* when the standard declines to automate something.
- **Rule ids are stable across versions and are what a finding names**, so a report stays comparable as
  the standard evolves. An id is retired, never reused. **A `?` mark is a real state** — two rules
  (`S4.INDEX`, `S5.DISCARDLOG`) are stated but unclassified, and a tool reporting on them says so.
- **`spec/STANDARD.md` carries no line cap, and §2 now says so** ([ADR-026]). If you were wondering why
  the standard was absent from its own cap table: it is a ruling, not an oversight.

**Maintainer-facing**

- **The frozen baseline could not reproduce its own total.** SPRINT-072's `conformance-baseline.md`
  states **96** rules while its `rules` column sums to **99** and its bucket columns to **98**. T1 halted
  rather than pick one, and the owner ruling split the constraint: **transcribe the marks, re-derive the
  count**. Re-derived from the spec: **98 classified + 2 unclassified**. Five divergences recorded in
  `conformance-dispositions.md`. → **L-134**.
- **Dispositions are 54, not 39** — 42 `build` (each naming the finding its check will fire) and 12
  `scope-out` (each with its reason). Reconciled mechanically: no checkable rule is left undispositioned.
- **A category expected to be large came out empty.** `scope-out` reason (c) — "mechanical but not worth
  the false-positive rate" — has **zero** members; every candidate was already `judgment-only` and never
  checkable. Uncounted, they would have been double-counted as scoped-out work. → **L-135**.
- **TD-058 resolved after four sprints**, because T2 was ordered immediately downstream of the evidence
  it needed rather than by priority.
- **A cap cell will eat any digits you put in it.** `no numeric cap (ADR-026)` was parsed as a cap of
  **26** — `FAIL cap spec/STANDARD.md (943 > 026)`. Caught only because the DoD required *running* the
  checker. → **TD-062**.
- **A commit went through a red gate**, because the line was `qa-check | tail && git commit` and `&&`
  read `tail`'s status. Second sighting → **L-120 promoted** to `CLAUDE.md` edit-safety (c), which
  already carried the caution and did not fire; the promotion adds the *action* form.

[ADR-026]: docs/adr/ADR-026-standard-carries-no-line-cap.md

