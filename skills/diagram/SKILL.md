---
name: diagram
description: Use when asked to draw, map or explain how a system fits together - architecture, workflow, sequence, data flow, state or ERD - and every box and arrow must be provably real. Triggers - "diagram", "draw the architecture", "map how X calls Y", "show the data flow", "ERD of this schema", "sequence diagram for". Produces Mermaid plus an evidence table that ties each component and edge to a source line. Do not use for a decorative picture, a chart of numbers, or prose that needs no diagram.
argument-hint: "[what to draw - e.g. the request path, the loop, the schema]"
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
user-invocable: true
version: "0.1.0"
---

# diagram

Draw one relationship as Mermaid, and back every id on it with a source. A diagram written from
memory looks the same whether it is true or invented; the evidence table is what makes it checkable.
Bash is for read-only git only (`git rev-parse HEAD`, `git status --short`).

## Steps

1. **Frame it.** State the question, the audience, the scope, and whether the diagram shows the
   system as it is (**actual**) or as it should be (**proposed**). Ask only if that is genuinely unclear.
2. **Read the sources.** Entry points, config, call sites, persistence, deploy files. Runtime
   evidence is a call, a write or a read that you can point at, not a name or a description.
3. **Write the evidence table** before drawing - one row per component or edge id. Columns,
   statuses and examples: `references/evidence-record.md`. No source found means status `unknown`.
4. **Draw the Mermaid** from the table only. Status goes in the label text of every id, since style
   alone is lost in some viewers; dotted lines are a secondary cue.
   - Node: `N1["api - called"]`. Edge: `A -->|E1 called| B`; otherwise `A -.->|E2 configured| B`
     (also `proposed`, `unknown`).
   - Sequence: `A->>B: E1 called`. ER: status in the relationship label,
     e.g. `CUSTOMER ||--o{ ORDER : "E3 called"`.
5. **Place it** (map below) and report the unknowns last.

## Rules

- A configured adapter that nothing calls is `configured`, never `called`, and never joined by a solid `-->`.
- Never add a service, control, tenant or throughput figure you did not read. Missing means `unknown`.
- Draw the edge where the call actually happens: if a server owns the storage, the client gets no arrow to it.
- Uncommitted edits are `working-tree` facts, not facts about the last commit.
- Redact credentials, tokens and private addresses in labels, rows and quoted lines.
- Mermaid text only; no generated pictures.
- Pick the view by the question: runtime ownership - architecture; ordering and failure - workflow;
  calls over time - sequence; where data moves or rests - dataflow; allowed transitions - state;
  entities - ERD.
- Too dense for one canvas? Draw an overview plus targeted views; never drop an edge to make it fit.

## Where the output goes

If the repo already has the standard doc slots, use them and keep each within its line cap, with
diagram and table together. Over the cap: split into an overview and targeted views.

| View | Path | Cap |
|---|---|---|
| workflow, sequence, state | `docs/flows/<slug>.md` | 100 |
| dataflow | `docs/architecture/data-flow.md` | 120 |
| cross-service calls | `docs/architecture/service-dependencies.md` | 120 |
| ERD | `docs/database/erd.md` | 120 |
| whole system | a section of `docs/architecture/overview.md` | 150 |

No such docs, or the user names a path: output inline or at that path. Create no folder layout.

## Degrades gracefully

- No git: revision is `working-tree`, or today's date.
- No docs, no sprint files, no lean-flow layout: the skill reads whatever source exists and needs nothing else.
- Source you cannot open (generated, remote, binary): the row is `unknown`, with the reason.

## Finish

Run the self-check in `references/evidence-record.md` (every id has exactly one row; every
`called` row has a cited call site; no solid edge touches a non-`called` id; no edge outranks either end), then show the diagram,
the table, and a one-line list of unknowns and what would resolve each.
