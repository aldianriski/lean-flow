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
Decided by the owner during the A1 setup run (2026-10-30); the same answers are given at A2's setup.
- Documentation tiers: backend/integration (an HTTP API and a database, no authentication, no external integrations), plus
  the medium/complex tier with the booking flow doc.
- First milestone proof goal: book and cancel work end to end.
- First milestone stopping condition: the full test suite is green.
- Integration boundary: live, against the local PostgreSQL.
- Main business-flow doc: the booking flow (book and cancel).
- License: a proprietary notice.
- Team size: one person (so no CONTRIBUTING or code-of-conduct file is required).
- Security reporting contact: aldian.mar@gmail.com.
- Where an unrecognized doc belongs: not decided yet.
- Owner role for documents, deployment target, release process: not decided yet.
