# Evidence record

One row per id in the diagram: components `N1, N2...`, edges `E1, E2...`. The table sits beside the
diagram; the diagram carries only ids, names and statuses.

| id | claim | source | revision | status |
|----|-------|--------|----------|--------|
| N1 | the HTTP server that receives requests | `src/server.ts:14` | `a1b2c3d` | called |
| E1 | N1 reads orders from N2 | `src/orders.ts:52` | `a1b2c3d` | called |
| E2 | N1 could send mail through N3 | `config/mail.yml:3` | `working-tree` | configured |
| E3 | N3 will publish events | `docs/plan.md:20` | `working-tree` | proposed |
| E4 | N2 is replicated | none found | `working-tree` | unknown |

## Columns

- **claim** - one sentence of what the id asserts, in the same words the diagram label uses.
- **source** - `path:line` (or `path:start-end`) of the line that supports it. An absolute path never
  appears; use a repo-relative one. For a non-code source, a heading or key name may follow the path.
- **revision** - the commit sha the line was read at; `working-tree` when the file has uncommitted
  edits or the repo has no git; a date works when there is no way to name a revision.
- **status** - exactly one of:
  - `called` - a call site, write or read of it was found in the source, not just a declaration
  - `configured` - declared, wired or imported, but no caller found
  - `proposed` - exists only in a plan, ticket or design, not in running code
  - `unknown` - no source supports it, or the source could not be opened

## How to decide status

- Look for the **caller**, not the definition. A client class, a dependency entry, an env var or an
  import proves `configured` at most.
- Two supporting lines for one edge: cite the stronger (the call site).
- An edge is never stronger than either end. A `called` edge needs both ends `called`; finding a call into a component makes that component `called`. An edge to an `unknown` component is `unknown`.
- Unsure between two statuses, take the weaker one and say why in the claim.
- A claim that came from the user or a README with nothing in code behind it is `unknown`, source `none found`.

## Self-check before delivering

1. Every id drawn has exactly one row, and every row has an id drawn.
2. Every `called` row cites a call site; open at least three cited lines and confirm each says what its claim says.
3. No solid `-->` touches an id that is not `called`; every dotted edge label names its status.
4. No `called` edge touches a component that is not `called`, and no edge outranks either end.
5. No credential, token or private address survives in a claim or source cell.
6. Table rows plus diagram fit the target slot's cap; otherwise split.

## Systems made of prose

For skills, runbooks and other text that directs a reader rather than running code, an edge is
`called` only when a line makes the step happen. A line that merely recommends or offers the next
step ("Next: run X") is `configured`; a loop drawn in a doc but directed by no source line is `unknown`.
