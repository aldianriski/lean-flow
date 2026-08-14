---
owner: Maintainer
last_updated: 2026-08-14
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

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

## v1.36.0 — Room to Write (2026-08-10)

MINOR — SPRINT-062, **3 of 3 units**, the first member sprint of **EPIC-002 Make Room**. Three
governance signals, and in each case the question was whether anything was listening: a cap that could
not be met, a report with a matcher and no consumer, and a count that turned out to be measuring its
own query.

**What changed for you:**

- **A new doc-kind: `docs/research/logs/<slug>.md`.** When a research question accretes a second
  measurement round, the series now splits into an append-only, uncapped sibling and the decision doc
  keeps the cap. This is ADR-014's sprint Plan/log mechanism applied outside `docs/sprint/` for the
  first time — and it works for the same structural reason: the cap check derives its globs from §2's
  own File cells, and `docs/research/*.md` is non-recursive, so a `logs/` sibling is excluded for free.
  Placement rule only, no template; never name it as a `related:` id, or it dangles the corpus-ref check.
- **§2's Growth rule now tells you how to rule a cap breach, not just to split.** A breach sorts into
  **drift** (removable content past a reachable cap → trim or split) or **a cap that was never
  reachable** (the standard mandates content the number never budgeted for, or the growth is an
  append-only series). They need opposite actions and the report cannot tell them apart. The tell is a
  breach where every route back under the cap runs through deleting signal or re-wrapping prose.
- **The promote governance check now reports cap breaches.** `doc-aging` reads **two** sources — §11's
  retention triggers *and* every §2 cap breach — where it previously enumerated only §11's four
  triggers. If you run `promote`, you will now see breaches you were never shown before. §11's ledger
  owns retention; §2 owns caps; restating a §2 cap figure inside the checklist is now prohibited,
  because a copied number is a second SSOT that drifts from the row it copied.
- **§11's LEARNINGS row documents a trap that had been silently misleading readers.** The collapse
  *consumes the trigger it fires on*: a promoted entry becomes `[status: promoted]` plus a pointer, so
  `promoted: yes` is never the stored form. Grepping for it returns zero on a perfectly healthy corpus.
  Count by `[status: promoted]`, position-anchored.
- **`docs/research/qa-gate-timing.md` went 223 → 87 lines** with all three measurement rounds preserved
  verbatim in its new log. No measurement was deleted to meet a number.

**Fixed:** `.claude/CONTEXT.md` claimed **32** core templates against 33 on disk — the count-claim
checker matches the phrase `N canonical doc templates`, which CONTEXT does not use, so no matcher ever
reached it.

**Known gaps, named rather than closed:** the promote doc-aging fix is procedural text, and nothing in
`evals/` exercises skill prose — so it has no retained must-FAIL fixture and a future edit that
re-narrows it goes uncaught (`TD-052`; the same gap covers every procedural gate: G1, G2, the promote
checklist, close's §11 pass). `TODO.md` (210) and two research docs remain over their soft caps,
scoped to `TASK-196` and `TASK-199`.

---

_Older releases (**v1.35.0** and earlier) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
