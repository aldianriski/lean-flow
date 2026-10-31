# Question set: PostgreSQL

**DETECT** — any language. A Postgres driver or ORM dialect in a manifest, for example:
`github.com/jackc/pgx`, `github.com/lib/pq` (`go.mod`); `pg`, `postgres`, `pg-promise`, or Drizzle / Prisma /
TypeORM / Sequelize / Knex configured for postgres (`package.json` plus its config); `psycopg`, `psycopg2`,
`asyncpg`, or SQLAlchemy with a postgres URL (Python manifests). Other ecosystems: Ruby (`pg` gem,
`adapter: postgresql` in `config/database.yml`), JVM (`org.postgresql:postgresql`), .NET (`Npgsql`), Rust
(`sqlx` / `tokio-postgres` / `diesel` with the postgres feature), Elixir (`postgrex`); hosted clients
(`@neondatabase/serverless`, `@vercel/postgres`, `@supabase/supabase-js` when the project keeps SQL
migrations). Or a Postgres-family image in a docker-compose file (`postgres`, `postgis/postgis`,
`bitnami/postgresql`, `pgvector/pgvector`), counted only when the app connects to it, not when it only backs
another service such as Keycloak or Metabase. Never an env file: init does not open `.env*`, examples included.

Ask a question only if its **marker** search of the tree finds no clear answer. A clear answer is one
choice found and used consistently; two or more, or none, leave the question open. Every answer is one
line in `## Conventions in use`.

1. **Migrations** — the tool, and whether migrations are SQL files or code. Marker: a `migrations/`
   folder (`*.sql` versus `*.ts` / `*.go` / `*.py`); `goose`, `golang-migrate`, `atlas`, `drizzle-kit`,
   `prisma migrate`, `alembic`, `knex` in manifests or scripts. Two tools, or none → ask.
2. **Table naming** — snake_case, and plural or singular. Marker: `CREATE TABLE` statements or ORM
   table names across migrations and models. Mixed forms → ask.
3. **Deletes** — soft or hard. Marker: `deleted_at` / `is_deleted` columns and queries filtering them,
   versus `DELETE FROM` statements. Both in use → ask which tables get which.
4. **Timestamps and time zones** — column type and the zone stored. Marker: `timestamptz` versus
   `timestamp` in migrations; ORM defaults; UTC set at the connection or in code.
5. **Transactions** — which layer opens them. Marker: `BeginTx` / `Begin(` / `.transaction(` calls in
   handlers, services or the data layer. Spread over layers → ask.
6. **Connection pooling** — the pool in use. Marker: `pgxpool`, `database/sql` pool settings, `pg.Pool`,
   an external pooler such as PgBouncer in compose or config. A driver default left untouched is the one
   case where finding no pool setting settles it.
