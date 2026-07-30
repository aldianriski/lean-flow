Retained **fixture input** for the "`/triage` re-rank · state change · reject apply" boundary row
(SPRINT-039 T1 — 038 T2 stated this unreachable from a `sprint-bulk` fixture, since `/triage` is
never invoked by it). This is the pre-run skeleton: a Backlog with one blatant mis-prioritization
(a high-risk data-loss bug filed at P3, a cosmetic tweak filed at P0) — deterministic and reliable
the same way the residual-grill fixture's unresolved `assumes:` tag reliably drove that row, per
L-057 (a fixture that might not exercise the intended path isn't worth a budgeted run). Deterministic
and inputs-only — no run output, no `.git`, no machine-specific path baked in.

## Reconstruct into a fresh throwaway repo

```sh
dest=$(mktemp -d)
cp -r evals/fixtures/boundary-rows/triage-park/. "$dest"/
git -C "$dest" init -q
git -C "$dest" add -A
git -C "$dest" -c user.name='Fixture Bot' -c user.email='fixture@example.com' \
  commit -q -m 'fixture: initial state'
echo "$dest"
```

## The real-run command

```sh
cd "$dest" && MSYS_NO_PATHCONV=1 claude -p "/triage" --model sonnet --output-format json
```

**Windows/Git-Bash note:** the bare, single-segment `"/triage"` prompt got MSYS-path-mangled into a
Windows path (`C:/Program Files/Git/triage`) on the first attempt under Git Bash — `claude.exe`
received a nonexistent-path string instead of the slash command, and asked what path the user meant
(exit 0, `total_cost_usd` 0.1557, 2 turns — a wasted run, not a fixture failure). `MSYS_NO_PATHCONV=1`
fixed it on retry. `"/lean-doc-generator promote"` (multi-word) did not exhibit this in the promote
fixture's run, so the mangling appears specific to single-segment `/word` prompts; set the env var for
every headless `claude -p "/<skill>"` call on Windows/Git-Bash regardless, to avoid re-discovering
this per invocation.

## What a compliant run produced (real run, TASK-039-T1)

- Emitted the re-rank proposal (`TASK-906` P3→P0, `TASK-907` P0→P3, with reasons) in its own output.
- `TODO.md` byte-identical to the fixture's shipped version afterward — **no re-rank applied**.
- No commit beyond the fixture's own `fixture: initial state`.
- The park record landed in a `/handoff` doc at `%TEMP%\handoff-triage-park-fixture.md` — outside
  the repo, machine/run-specific path, reported here rather than asserted by script (same reasoning
  as `../promote-park/README.md`).
- Cost (successful run only, excluding the wasted mangled-path attempt): **$0.5633, ~139s API time,
  13 turns** (pinned `sonnet`, `--output-format json`).

`evals/assert-noaction-park.sh <repo-dir>` checks the in-repo half of this against a completed run's
directory (auto-detected via the `.fixture-kind` marker file shipped in this directory): the Backlog
stays in its original tiers and exactly one commit exists.
