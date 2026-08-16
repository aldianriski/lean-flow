---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

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

---

## v1.46.0 — Conformance Baseline (2026-08-16)

MINOR — SPRINT-072, **17 of 17 DoD**, EPIC-004's first member sprint. Nothing you install behaves
differently: this sprint **measured** the standard against the tools that claim to check it, and the
measurement is the deliverable. It changed no checker, no fixture and no execution architecture, by
design and verified mechanically.

**What changed for you**

- **You can now see which parts of the standard are actually checkable, and which are deliberately
  not.** `docs/research/conformance-baseline.md` classifies all **96** normative rules in
  `spec/STANDARD.md` into four states — **8 covered · 39 uncovered-mechanical · 45 judgment-only · 6
  implementation-directed**. The four-way split is the point: `judgment-only` is the standard
  *choosing a human*, not a gap. Roughly half of this standard is not automatable at all, and of the
  half that is, most is unbuilt. Both facts were invisible before.
- **Stated as counts, never as a ratio — and that is a ruling, not a style choice.** A compliance
  percentage averages a deliberate judgment-only boundary together with a real gap, so the number goes
  *up* when the standard declines to automate something. lean-flow will not ship one.
- **If you were planning against "Attested is the hard level", re-plan.** §13 (git-history evidence) is
  the **most** mechanical section in the spec, 5 of 7 — a trailer is a literal string on a literal
  object. **Gated is the hard level**: §10 is 4-of-11, because "was the governance checkpoint honestly
  run?" is unobservable in principle rather than merely unimplemented.
- **Six rules constrain a *tool's inference*, not your repo.** Three of them are in §13 — *a verifier
  may not conclude approval from an unsigned trailer*, *author identity is not the attestation*. They
  are now marked `implementation-directed` so a future conformance engine cannot evaluate them against
  your repository and emit findings **you could never clear**.
- **The four inventory documents ship with the plugin** and are readable standalone: the criteria and
  §2, the structural sections, the git-boundary section, and Gated + Attested.

**Maintainer-facing**

- **The headline finding overturns EPIC-004's own opening premise.** The epic states that eleven
  checkers "already encode most of the rules". Measured two independent ways, they encode most of
  **lean-flow's project conventions**: only **3 of the standard's 13 sections** are referenced anywhere
  in `scripts/lib/` (§2 ×30 · §11 ×16 · §7 ×1), ten have zero, and five of eleven checkers cite no
  section at all. `gates-signed` is the sharpest case — it checks a real §9 rule that **§9 only
  acquired last sprint**, so the checker predates its own specification and nothing links them. Both
  stale claims are corrected in the epic *beside* the originals rather than overwritten.
- **EPIC-004 § Closed-when 2 is recorded PARTIAL and was deliberately not ticked.** It requires rules
  marked judgment-only *in the spec*; the marks live in a research doc, and moving them into
  `spec/STANDARD.md` is a spec change this sprint excluded. Ticking it would have been the exact
  stale-criterion failure the sprint's own DoD was written to prevent. → **TASK-227**.
- **A cap-breach remedy that the standard's own text recommends would have escaped the checker.**
  Splitting an over-cap research doc into `docs/research/<dir>/` produces **zero** rows from
  `check-doc-caps.sh` — the glob is non-recursive — so the tidy fix buys a green gate by hiding from
  the gate. Found by probing before adopting. → **TD-061**, **L-132**.
- **And the other wrong answer to the same breach was committed before it was caught**: three
  successive trims toward the cap, which §2 forbids in as many words (*cap-hit → split, never
  squeeze*) — while classifying the very section that names the anti-pattern. → **L-131**.
- **The promote census was wrong in both directions at once** — a table row is a parameter set rather
  than a rule (too high), and checkbox items, numbered items and fenced schema blocks were invisible to
  every pattern (too low; §3's entire normative content is a ```yaml block counted by nothing).
  Corrected 156 → **170** gross candidates. → **L-133**.

**Filed** — **TD-061** (the `docs/research/` subdirectory cap hole) · **L-131 · L-132 · L-133** ·
**TASK-227** (carry the classification into the spec — the engine's input, not a tidy-up) ·
**TASK-228** (the §13 attestation checker; §13 is entirely unchecked today) · **TASK-229** (rule on the
39 uncovered-mechanical rules, one at a time).

---

_Older releases (**v1.45.0** and earlier) → [`CHANGELOG-1.45.0.md`](docs/changelog/CHANGELOG-1.45.0.md) → [`CHANGELOG-1.44.0.md`](docs/changelog/CHANGELOG-1.44.0.md) → [`CHANGELOG-1.43.0.md`](docs/changelog/CHANGELOG-1.43.0.md) → [`CHANGELOG-1.42.0.md`](docs/changelog/CHANGELOG-1.42.0.md) → [`CHANGELOG-1.41.0.md`](docs/changelog/CHANGELOG-1.41.0.md) → [`CHANGELOG-1.40.0.md`](docs/changelog/CHANGELOG-1.40.0.md) → [`CHANGELOG-1.39.0.md`](docs/changelog/CHANGELOG-1.39.0.md) → [`CHANGELOG-1.38.0.md`](docs/changelog/CHANGELOG-1.38.0.md) → [`CHANGELOG-1.37.0.md`](docs/changelog/CHANGELOG-1.37.0.md) → [`CHANGELOG-1.36.0.md`](docs/changelog/CHANGELOG-1.36.0.md) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
