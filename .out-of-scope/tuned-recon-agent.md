# Out of scope — a tuned `recon` agent (was TASK-007)

**Decided 2026-06-12.** Rejected: the built-in **`Explore`** agent is the universal recon agent — every
flow uses it, and it is sufficient. The real lever is *optimal usage* (a tight, diff / blast-radius-scoped
brief), which is already wired:

- tier-routing dispatches recon → cheap-tier `Explore` **with a self-contained brief** (`.claude/CONTEXT.md` § Model tiers);
- `task-decomposer` step 1 + `orchestrator` G1 both call recon via `Explore` in its own context.

A custom recon agent would duplicate a built-in for no proven gain — against **ADR-002** (leverage
built-ins, ship no agents) and the agent-free-core principle.

**Reopen if:** a concrete case shows `Explore`'s brief falling short in real use (then it becomes an
*optimal-usage* tweak, not a new agent).
