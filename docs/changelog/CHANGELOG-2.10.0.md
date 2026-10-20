---
owner: Maintainer
last_updated: 2026-10-20
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.10.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.12.0 release** (2026-10-20). §11 keeps the
> current and previous minor inline (2.12.x and 2.11.x), so cutting v2.12.0 pushed v2.10.x out.

## v2.10.0 — the reviewer judges against your repo's own standards and says what it skipped; a forced red must prove it landed (2026-10-19)

**MINOR** — ships SPRINT-129 (Honest Review and Tests). Installing the release is enough; no upgrade step. The standard is unchanged
(spec 0.18.0). Restart the session after installing.

### SPRINT-129 — Honest Review and Tests (2026-10-19)

Four keepers from the 2026-10-19 reference re-scans (mattpocock/skills scan 5 · obra/superpowers re-scan), each closing a gap on
the consumer path.

**Consumer-facing:**
- **The review brief carries your repo's standards docs.** The coordinator finds CONTRIBUTING, coding standards and style guides
  (and CLAUDE.md / AGENTS.md) and hands their paths and excerpts to the reviewer as the Standards comparand; the reviewer still
  gets a brief, never the repo. The Standards axis names the docs it judged against, or says none were supplied.
- **The reviewer lists what it declined to judge**, beside the Standards and Spec axes, with a one-line reason each ("none" when
  empty). Spec silence is no licence: an implied input the change leaves unhandled is a Spec finding. All three rules ride in the
  injected reviewer prompt, not only in the coordinator's text.
- **`/diagnose`: a forced red counts only once it is proven landed.** A mutation, fixture edit or reverted fix is diffed against a
  pristine copy first; a landed change that reddens nothing has tested nothing; the restore is proven the same way.
- **`/tdd`: a slice is done only when the whole suite passes.** The focused test drives each cycle and the whole suite runs once per
  slice; every failure is named, and one the slice did not cause goes to the owner, never counted as green. The per-cycle checklist
  adds "name the production change that would fail this test". `test-standard.md`'s regression gate points to the rule instead of
  restating it.

**Maintainer-side:**
- Research: mattpocock scan 5 (35 → 38 skills), the superpowers re-scan (14 → 15), and a loopcraft delta (nothing to adopt).
- TASK-322 and TASK-448–450 cancelled as superseded; TD-090 re-routed to TASK-367; §11 store prune of TASK-435–437.
- The adversarial-floor review pass caught the new reviewer rules missing from the injected prompt (L-020), fixed before merge.

---

