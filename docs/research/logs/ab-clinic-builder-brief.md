---
owner: Maintainer
last_updated: 2026-10-29
update_trigger: The clinic repo's builder brief is re-issued
status: active
id: ab-clinic-builder-brief
tags: [process]
domain: governance
---

# Clinic repo — builder brief (retained verbatim)

> Retained as evidence for TASK-534: this is the exact brief the builder received, and it is checked for what it leaves
> out. Everything below the rule is the brief.

---

You are building a small, realistic clinic appointment-booking application from scratch, test-first. Work only in
`D:\Research\clinic-ab\` (the application) and `D:\Research\clinic-ab-spec\` (a separate specification folder). Do not
read, write or run anything anywhere else on the machine, apart from installing dependencies through the normal Go and
npm toolchains. Never open `.env`, `.env.*`, key or credential files.

## What to build in this slice

A clinic books appointments for patients with doctors. This slice delivers **booking an appointment**, end to end:
a Vue page → an HTTP handler → PostgreSQL.

Two business invariants, each enforced and tested through that path:
- **No double booking:** a doctor cannot have two appointments starting at the same slot. Enforce it with a database
  unique constraint on (doctor, slot start) and a rule check that returns a coded fault.
- **Per-doctor working hours:** each doctor has working hours stored in the database; booking outside them returns a coded
  fault. Test the boundaries: the start of the window is bookable, the end of the window is not.

## Stack and layout

- `go.mod`: Go 1.26, `github.com/go-chi/chi/v5`, `github.com/jackc/pgx/v5`. `cmd/api/` is the HTTP server. `cmd/migrate/`
  applies `db/migrations/*.sql` in filename order. Application code lives under `internal/`.
- `web/`: Vue 3 + Vite + TypeScript, type-checked with `vue-tsc`, linted with ESLint (flat config), tested with Vitest.
  npm scripts: `typecheck`, `lint`, `test`, `build`. Pin current stable versions and commit the lockfile.
- Database: Docker is not available on this machine. Create a local PostgreSQL 18 cluster with `initdb` in a gitignored
  `.pgdata/` folder, and start it with `pg_ctl` on a non-default port. Your **first step** is to check that `initdb` works
  here; if it does not, stop and report that as a blocker rather than working around it.
- Go tests read `DATABASE_URL` and must **fail, never skip**, when it is unset or the database is unreachable.
- A plain `README.md` explains how to create and start the database, migrate, test and run. It says nothing about the
  conventions or the business rules below.

## Conventions this codebase follows (apply them everywhere)

- **C1 Fault envelope.** Every non-2xx response body is `{"fault":{"code":"SLOT_TAKEN","detail":"…"}}`. Fault codes are
  declared in exactly one place, `internal/faults/codes.go`.
- **C2 Verdicts, not errors.** Every business rule lives in `internal/rules/` as a pure function that takes an explicit
  `now time.Time` and returns a `Verdict{OK bool; Fault faults.Code}` value, never an `error`. Handlers translate verdicts
  into HTTP responses through one table in `internal/http/verdicts.go`. Handlers and stores never compare times or check
  rules themselves.
- **C3 Store verbs.** Store methods are named `Fetch*`, `Persist*` and `Drop*` (never Get/Create/Delete), one store per
  aggregate in `internal/store/`.
- **C4 Gateway composables.** Vue components never call `fetch`. All API calls go through composables in
  `web/src/gateway/`, each named `use<Aggregate>Gateway`, returning `{ data, fault }` and never throwing.

## How to work

- **Test first, and make it visible in git.** For each invariant, commit the failing test first, then commit the code
  that makes it pass. Commit small steps with plain messages. The repository must be git-initialised.
- Tests that must exist:
  - Go: an HTTP integration test (`httptest` against the real router and a real database) that books an appointment, plus
    a test for each invariant, through the HTTP path.
  - Vitest: a component test that the booking page submits through its gateway composable, and an integration test of the
    gateway against the running API on the test database.
- The page `web/src/pages/BookAppointment.vue` books an appointment through the gateway.

## The specification folder

Write `D:\Research\clinic-ab-spec\spec.md` (not inside the application repo): the product goal in one paragraph · the
booking flow · the two invariants · each convention C1–C4 with the exact files where it shows in the code. Mark it
"partial: booking slice only". Keep everything about conventions and rules out of the application repo itself.

## Done when

- A fresh clone of `D:\Research\clinic-ab\`, following only its README to set up the database, passes `go test ./...`,
  `go vet ./...`, and `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` in `web/`.
- Both invariants are enforced and tested through the HTTP path, each with its failing-test commit before its
  implementation commit.
- `spec.md` records C1–C4 with where each shows in code, and the repo itself carries no document describing them.

## Report back

The exact commands you ran from a fresh clone and their exit codes · the names of the tests for each invariant, with the
commit hashes of the failing-test and implementation commits · each convention's file locations · the pinned Vue, Vite,
ESLint and Vitest versions · anything you could not do, as a named blocker.
