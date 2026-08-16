---
owner: Maintainer
last_updated: 2026-08-16
update_trigger: §12 of spec/STANDARD.md changes
status: current
id: conformance-inventory-git-boundary
tags: [process, docs]
domain: governance
related: [conformance-inventory-structural]
---

# Conformance inventory — §12, the Git boundary

SPRINT-072 T2, split out of `conformance-inventory-structural.md` under §2's growth rule
(**cap-hit → split, never squeeze**) rather than trimmed to fit. §12 is a coherent unit: it governs
what may live in the repo at all, where the other structural sections govern how docs are shaped.
Classified under the test in `conformance-inventory-criteria.md`.

## §12 — The Git boundary (11 rules + data + 1 implementation-directed)

| Rule | Level | Mark |
|---|---|---|
| §12a — clears the boundary on **content, not format** | Structural | judgment-only (its 10 rows are data) |
| §12b — never commit, ×9 categories | Structural | **split by category** — mechanical for pattern-matchable classes (`.env` · `*.pem` · `id_rsa` · `service-account.json` · `backup.sql`), judgment-only for meeting notes · pricing · drafts · design sources |
| §12c — generated/temporary excludes | Structural | mechanical |
| §12d — the clean separation | — | **data** |
| "even a private repo is potentially exposed" | — | **rationale** |
| `**Wiring.**` — binds `init` / `migrate` | — | **implementation-directed** (Gap B) |

