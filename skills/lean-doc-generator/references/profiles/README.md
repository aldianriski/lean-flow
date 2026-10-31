# Question sets — index

Init reads this index (step 1c), then each set file listed here, and checks each set's DETECT rule. A new set is
one file in this folder plus one line here. A set asks only about conventions a scan of the code cannot settle.

| Set file | Stack it detects |
|---|---|
| `react-vite.md` | React with the Vite React plugin, no framework that owns routing and build |
| `go-chi.md` | A Go module that directly requires chi (v5 included) |
| `postgres.md` | Any language with a Postgres driver or ORM dialect in a manifest, or a Postgres image the app connects to (never an env file) |
