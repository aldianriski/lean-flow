---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: a MINOR version rotates out of the root CHANGELOG
status: current
---

# lean-flow — Changelog v1.37.0

> Rotated out of the root `CHANGELOG.md` when **v1.39.0** landed (§11: keep current + previous minor
> inline). Older releases → [`CHANGELOG-1.36.0.md`](CHANGELOG-1.36.0.md).

## v1.37.0 — Headroom (2026-08-14)

MINOR — SPRINT-063, **4 of 4 units**, the second member sprint of **EPIC-002 Make Room**. SPRINT-062
built the procedure for ruling a cap and delivered no headroom; this one spent it. Every task mapped to
one of the epic's four Closed-when conditions, and in three of the four the tidy answer was available
and wrong.

**Governance caps — two ADRs, and neither moved a number by ceremony**
- **ADR-019** — `TODO.md`'s cap `~150 soft` → **`320 soft`**. Derived, not chosen: § Task entry shape's
  ten mandatory fields cost **~17.6 lines per entry** (measured 176 lines / 10 tasks), so the cap and
  the schema could not both hold. Kept **soft** deliberately — §11's response to this cap is a prune
  conversation with the owner, which needs the breach reported rather than the gate failed.
- **ADR-020** — `docs/research/<slug>.md`'s cap `120 soft` → **`130 soft`**, *and* a
  **`status: superseded` doc is FROZEN: the cap no longer applies to it.** A spent verdict's only legal
  future is §11 archival, and the one thing that can still grow on it is the annotation recording *why*
  it is spent — so the cap was asking for the supersession trail to be deleted.
- `.claude/CLAUDE.md` **80 → 61 lines** (24% headroom) with its cap **held at 80**. Its diet pass found
  real duplication: `## File Structure` was a hand-maintained codemap of `docs/architecture/overview.md`
  § Directory structure, which `CONTEXT.md` § Orientation already forbids. The five per-skill
  `references/` one-liners it uniquely held were **moved** to `overview.md` before the cut.
- `.claude/CONTEXT.md` **held at 150** — ADR-017's diet pass had already falsified the standing
  duplication hypothesis two sprints earlier, so re-running it would have re-derived a dead premise.

**Checkers**
- `check-doc-caps.sh` exempts frozen verdicts, **reported never silent** — `FROZEN (superseded): …`
  names the state *and* the exit condition. The matcher is position-anchored to the frontmatter window,
  and the retained fixture proves it: a `status: current` doc carrying the literal string
  `status: superseded` in prose is still caught. Two fixtures added
  (`evals/fixtures/doc-caps/frozen-spent/`), both retained per TD-012.
- **The 11 checkers stand alone; consolidation is deferred to EPIC-004** (EPIC-002 D3, with a one-line
  reason per checker). They share no input model — markdown tables, frontmatter, git history, JSON
  manifests and prose inference are five different parsing problems — so one engine today would be a
  dispatcher with eleven bodies. The deferral names its closing class of fact: EPIC-003's spec existing
  in a form a checker can read as its rule source.

**Retention**
- One §11 archive pass applied to `docs/research/` — **applied count 0**. All four `status: superseded`
  docs have live citers, each verified by reading the citing line rather than trusting a match.
- `TD-046` deleted per §11 (resolved three sprints prior); `TD-050` and `TD-049` re-reviewed and held
  with unblock conditions stated.

**Consumer-facing note:** `DOCS_Guide.md` §2 and §11 changed, and the standard ships inside the plugin —
adopters pick up the new research cap, the frozen-verdict rule and the `TODO.md` cap on upgrade.
