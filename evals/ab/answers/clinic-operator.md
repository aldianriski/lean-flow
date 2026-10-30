# Clinic: operator answers
Operator-only. Never copied into a trial.

## Stack
- Go API (chi router, pgx driver), PostgreSQL, Vue 3 + TypeScript web app (Vite, Vitest).
- The database holds doctors, patients and appointments.
- The page sends instants in RFC 3339; the time zone is applied on the server.

## Conventions in use
- Fault envelope: every non-2xx response body is `{"fault":{"code":"...","detail":"..."}}`. Fault codes are declared in exactly one place (`internal/faults/codes.go`) and mapped to HTTP statuses in exactly one place (`internal/http/verdicts.go`). The UI shows codes verbatim. A 204 success has no body.
- Verdicts, not errors: every business rule is a pure function in `internal/rules/` that takes an explicit `now` and returns a verdict (OK or a fault code), never an error. Handlers and stores never compare times or check rules.
- Store verbs: store methods are named `Fetch*`, `Persist*`, `Drop*` (never Get/Create/Delete), one store per aggregate.
- Gateway composables: Vue components never call `fetch`. All API calls go through `use<Aggregate>Gateway` composables in `web/src/gateway/`, which return `{ data, fault }` and never throw.

## Setup answers
- Which documentation tiers apply: the project has an HTTP API and a database, no authentication, and no external integrations (no payments, no notifications). Whether it counts as medium/complex (multi-developer, sustained) is not decided yet.
- First milestone proof goal: not decided yet.
- First milestone stopping condition: not decided yet.
- Integration boundary and allowed side effects: no external services are involved; the boundary level (none, simulated, live) is not decided yet.
- Main business-flow doc: the two flows are Book and Cancel; which one is the main flow, or whether to create one, is not decided yet.
- Team size and code-of-conduct enforcement contact: not decided yet.
- License (or private notice): not decided yet.
- Security reporting contact: not decided yet.
- Where an unrecognized doc belongs: not decided yet.
- Owner role for documents, deployment target, release process: not decided yet.
