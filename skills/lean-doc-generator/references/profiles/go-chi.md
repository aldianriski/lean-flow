# Question set: Go + chi

**DETECT** — a `go.mod` requires `github.com/go-chi/chi` (v5 is `github.com/go-chi/chi/v5`). Read the
root `go.mod`; in a multi-module repo, each module's `go.mod`.

Ask a question only if its **marker** search of the tree finds no clear answer. A clear answer is one
choice found and used consistently; two or more, or none, leave the question open. Every answer is one
line in `## Conventions in use`.

1. **Layering** — what handlers may call, and where business rules and SQL live. Marker: packages named
   `handler(s)` / `service(s)` / `repository` / `store` under `internal/`, and whether handlers import the
   database package directly. Handlers reaching the store in some routes and a service in others → ask.
2. **Error to HTTP mapping** — one helper turns errors into status codes, or each handler decides. Marker:
   a shared function or middleware that switches on `errors.Is` / `errors.As` and writes the response,
   versus `http.Error(` / `w.WriteHeader(` repeated per handler.
3. **Request validation** — where input is checked. Marker: `github.com/go-playground/validator` or
   `ozzo-validation` in `go.mod`, or hand-written checks inside handlers; one shared decode step for all
   handlers or not.
4. **Context and timeouts** — how `context.Context` flows and who sets deadlines. Marker: handlers passing
   `r.Context()` down every call, `middleware.Timeout`, `context.WithTimeout` at the call site;
   `context.Background()` inside request paths means no clear answer.
5. **Logging** — the one logger new code uses. Marker: `log/slog`, `go.uber.org/zap`, `github.com/rs/zerolog`
   in imports. More than one in use → ask; the standard `log` package alone counts as an answer.
6. **Tests** — style, and whether database tests hit a real database. Marker: `*_test.go` files showing
   table-driven tests and `httptest.NewRecorder` / `httptest.NewServer`; a test database reached through
   `testcontainers`, a compose service or a `TEST_DATABASE` setting versus mocks or fakes of the store. No
   test files → ask.
