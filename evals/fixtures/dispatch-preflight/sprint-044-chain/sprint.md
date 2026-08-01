# Fixture — sprint-044-chain

Replays the real case that exposed TD-025 (`docs/sprint/archive/SPRINT-044-night-run-ergonomics.md`).
That sprint chained four tasks (T1-T4) that all touch
`skills/orchestrator/references/night-run.md`, each naturally depending only on its immediate
predecessor: T2->T1, T3->T2, T4->T3 -- unambiguously ordered by the chain, with no *direct* edge
between non-adjacent pairs (T1/T3, T1/T4, T2/T4). The shipped sprint file worked around the old
pairwise-only check by adding those redundant direct edges (T3 depending on T1 *and* T2, T4 on
T1, T2 *and* T3) -- noise the check no longer needs. This fixture uses the natural minimal chain
the workaround existed to avoid, so it must PASS via the derived transitive order rather than a
direct edge, for the non-adjacent pairs.

## Plan

### T1 — Split the capability checks out of the unattended-run reference
Layers: skills/orchestrator/references/night-run.md, skills/orchestrator/references/night-run-checks.md
Depends-on: none

### T2 — Derive the allowlist into the project settings permissions
Layers: skills/orchestrator/references/night-run.md, .claude/settings.json
Depends-on: T1

### T3 — Ship a launcher that fires detached and confirms the run is alive
Layers: scripts/night-run.sh, skills/orchestrator/references/night-run.md
Depends-on: T2

### T4 — Find and cut the dominant cost driver
Layers: docs/research/night-run-cost.md, skills/orchestrator/references/night-run.md
Depends-on: T3
