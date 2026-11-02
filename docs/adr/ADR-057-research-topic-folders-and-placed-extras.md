---
id: ADR-057
tags: [docs, process]
domain: governance
status: accepted
related: [ADR-020, ADR-056, ADR-053]
---

<!-- One ADR per file · append-only (never edit a decided ADR — mark it deprecated/superseded) · WHY only. -->

# ADR-057 — Research series get topic folders, and five kinds of doc adopters already keep get a place

- **Status:** accepted (2026-11-02, owner, at SPRINT-159 intake and G2)
- **Deciders:** Maintainer
- **Context driver:** the owner found `docs/research/` too flat to use; SPRINT-159's adopter audit
  (`docs/research/adopter-folder-audit.md`) found five kinds of file kept outside §2's placement.

## Context

`docs/research/` held 59 docs in one folder, including series that read as one topic each (`conformance-*`, `guard-audit*`,
`mattpocock*`). §2 placed only `research/<slug>.md` and `research/logs/`, and the knowledge-index generator, the research corpus
check and the archive check all read the folder flat, so a doc moved into a subfolder would silently drop out of them. The audit
also found migrate's own `docs/archive/`, a QA folder with its checklist, the generated knowledge index, data files beside
research logs and per-feature sibling docs with no §2 row, though skills write or rely on each.

## Decision

- **Topic folders by row.** A series of three or more research docs sharing a prefix gets its own folder, and §2 gets one row per
  folder (`research/<topic>/<slug>.md`), so the cap check derives an exact glob and nothing matches `logs/`, `archive/` or a
  folder of non-research files. Three folders now: `conformance/`, `guard-audit/`, `mattpocock/`. Filenames and ids are kept.
- **The readers follow.** The generator, the research corpus and the archive check read a topic folder (a subfolder other than
  `logs/` and `archive/` whose docs carry a research `id:`); `archive/` stays flat.
- **Five placed extras.** §2 rows for `archive/` (migrate's moved history), `qa/` with `QA.md`, the generated
  `knowledge-index.md`, and data files beside research logs (never `.log`); a prose rule places per-feature sibling docs beside a
  core file (header owed, linked from the core file).
- **Spec 0.19.0**, the same MINOR as ADR-056.

## Consequences

- Live links to the moved docs are updated; frozen history (archived sprints, changelogs, decided ADRs, closed task files) keeps
  its old paths, which still resolve through git history.
- High-citation docs and the superseded `loop-hygiene-*` series stay flat: moving them would break frozen citations for little gain.

## Alternatives considered

- **Stay flat, fix only the index.** Rejected by the owner: the folder stays unreadable.
- **A wildcard row `research/*/<slug>.md`.** Rejected: its glob also matches `logs/`, `archive/` and folders of non-research files.
- **Move every series, including high-citation docs.** Rejected: frozen ADRs and logs cite them and must not be rewritten.
