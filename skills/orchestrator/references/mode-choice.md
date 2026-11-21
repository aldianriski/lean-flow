# Mode choice — one recommendation at each hand-off

## Entry-point facts

Read facts once at the entry point; pass them with the result, never reconstruct a second chooser in a caller.

- Decomposer: the `state: ready` tasks just written, their count, size/risk, `## Touches`, `depends-on:`, open `needs-info` / `## Assumes`, and declared `autonomy:` / `authority:`. Advice is **provisional — after promote the Plan decides**; there are no frozen `Layers:` yet.
- Promote, orchestrator intake and flow entering Build cold: resolve active members by id (`dispatch.md` § Members by reference); read member size/risk, state, open `## Assumes`, autonomy/authority, and the frozen Plan's `Layers:` overlap + `Depends-on:` chain. Count the members in the proposed run, not completed members.
- Prime: use only the member frontmatter and open-DoD counts it already reads (count, size/risk, autonomy, authority, state); do not load Plan bodies or Assumes for advice. Missing facts remain unknown; say which confirmation execution needs.

An open assumption is marked `**open:**` or asks for confirmation; informational bullets are not open. Absent authority is **J2**, never inferred from AFK. Unknown readiness cannot establish “nothing open”; unknown overlap/dependencies get no parallelism claim.

## Recommendation and options

Apply this order; advice never selects a mode or signs a gate:

1. Every member in the proposed run is **AFK and explicitly J0/J1**, with no `needs-info` or open assumptions → recommend `overnight` first. Label it **preparation — pre-flight not yet run** until `night-run.md` Part 1's full pre-flight passes. TD-109 STRICT: any declared J2 blocks launch, even if another task is AFK/J1.
2. Otherwise, one member, size S, risk low, nothing open → `quick`.
3. Otherwise, one member → `mvp`; two or more → attended `sprint-bulk`.

No open members → advise sprint close, not an execution mode. Unknown facts prevent the optimistic quick/overnight recommendation; prime's advice names the available attended mode pending intake confirmation.

| Option | One-line reason from the entry facts |
|---|---|
| `quick` (single small low-risk member with nothing open) | Name its size/risk and G1 scope; use the promoted-member procedure below when applicable. |
| `mvp one-by-one` (always offered for a sprint; invokes `mvp`) | Owner-paced G1/G2 for one member, then stop; name the dependency/ownership order it must respect. |
| `sprint-bulk` (multi-member offer) | Name the count and HITL/AFK/J mix; overlap/dependencies require sequencing, disjoint units allow parallel dispatch. |
| `overnight` preparation | Name the AFK/J mix and any open readiness facts; pre-flight still gates launch, and a J2 member cannot launch unattended. |

Put the recommendation first, give **every** option a fact-based reason, and put **Stop here** last (keeps the current artifacts, runs nothing). Offer quick only for the eligible singleton and sprint-bulk for multiple members, leaving at most four options including stop. Explicit mode invocations still use normal routing + gates.

## Offer and return

Attended means the trigger did not say unattended and the `ToolSearch select:AskUserQuestion` probe succeeds. Otherwise, at a hand-off or a mode-less intake, return `stop` with one `Next:` recommendation: no popup, no promotion/execution. Before promotion, that line names `/lean-doc-generator promote` with provisional mode advice; afterwards it names `/orchestrator <mode>`. A denied or unanswered offer is not a pick. This does not stop a named, already-approved unattended execution from following its run contract.
Each offer returns `promote` · `stop` · `<mode>` with its task/sprint and entry facts. `stop` ends the chain; emit `Next:` advice only. Never ask the same transition twice.

- Standalone: decomposer consumes `promote` by invoking `/lean-doc-generator promote` for those tasks; promote consumes `<mode>` by invoking `/orchestrator <mode>` once.
- Under `/flow`: return to flow; only flow invokes the next stage. Under orchestrator intake: return to that orchestrator; it consumes `promote`, then treats the returned `<mode>` as named. A mode already explicitly named is carried through promotion and skips its mode chooser.
- Delegated intake/promote: the worker returns its completed result as `ready`, never offers or invokes the next stage; the coordinator raises the offer and passes its result to the caller above.

## Promoted member

For quick/mvp, use the member the owner names; with none named, take the first unfinished member in frozen Plan order whose `Depends-on:` predecessors are done. Before starting, check that Plan chain and G2's shared-file ownership/commit order. An open dependency or ownership predecessor keeps that member queued: report and stop, never silently choose another. If no member qualifies, report the blockers and stop; an ownership order not yet settled is resolved at the normal gates before dispatch, never guessed.
Run only that member through normal routing and gates and `dispatch.md` § Members by reference: coordinator-owned transitions, evidence-backed ticks, review/commit and sprint Execution Log progress. Then stop after the member; `mvp one-by-one` never silently loops the sprint. Close still sees its `done/` file via the shared membership resolver.
