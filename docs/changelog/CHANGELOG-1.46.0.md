---
owner: Maintainer
last_updated: 2026-08-18
update_trigger: Rotated out of root CHANGELOG.md at a new MINOR (§11)
status: current
---

# lean-flow — Changelog v1.46.0

> Rotated out of root `CHANGELOG.md` at v1.48.0 (§11: keep current + previous inline).

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

_Older releases (**v1.45.0** and earlier) → [`CHANGELOG-1.45.0.md`](CHANGELOG-1.45.0.md)._
