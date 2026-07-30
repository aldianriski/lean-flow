Retained **fixture input** for the "`promote` governance sign-off" and "`promote` sprint render ·
`plan locked` commit" boundary rows (SPRINT-039 T1 — 038 T2 stated these unreachable from a
`sprint-bulk` fixture; T1's job is to reach them via a direct per-skill headless invocation instead).
This is the pre-run skeleton: a populated, `state: ready` Backlog with no active sprint yet — the
exact precondition `/lean-doc-generator promote` requires to have anything to form a Plan from.
Deterministic and inputs-only — no run output, no `.git`, no machine-specific path baked in.

## Reconstruct into a fresh throwaway repo

```sh
dest=$(mktemp -d)
cp -r evals/fixtures/boundary-rows/promote-park/. "$dest"/
git -C "$dest" init -q
git -C "$dest" add -A
git -C "$dest" -c user.name='Fixture Bot' -c user.email='fixture@example.com' \
  commit -q -m 'fixture: initial state'
echo "$dest"
```

## The real-run command (A1 test)

```sh
cd "$dest" && claude -p "/lean-doc-generator promote" --model sonnet --output-format json
```

**A1 held**: this per-skill invocation is the same shape as 038's `sprint-bulk` fixture — no
`unattended` keyword needed, no different flag shape. The skill itself recognises headlessness by
probing for the ask channel (`ToolSearch select:AskUserQuestion` → no match), exactly as
`night-run.md` Part 0 describes, then follows the park protocol on its own.

**Windows/Git-Bash repro note (not an eval-mechanism bug):** a bare single-segment command like
`claude -p "/triage"` can get MSYS-path-mangled by Git Bash into a Windows path (e.g.
`C:/Program Files/Git/triage`) before `claude.exe` ever sees it, because MSYS auto-converts
argv strings that look like a POSIX path when calling a native (non-MSYS) executable. Multi-word
prompts (`"/lean-doc-generator promote"`) were not observed to trigger this, but set
`MSYS_NO_PATHCONV=1` before any headless `claude -p "/<skill>"` call on Windows/Git-Bash to avoid it
entirely — confirmed as the fix during this task's `/triage` repro (see `../triage-park/README.md`).

## What a compliant run produced (real run, TASK-039-T1)

- No `docs/sprint/` directory created — the sprint was never rendered.
- No commit beyond the fixture's own `fixture: initial state` — no `plan locked` commit.
- `TODO.md` untouched (`TASK-905` stays exactly as shipped).
- The park record itself landed in a `/handoff` doc at
  `%TEMP%\handoff-promote-park-fixture.md` (Part 0 step 2: "No sprint file to write into ... the
  record goes in the `/handoff` doc instead") — outside the repo, at a machine/run-specific path, so
  it is reported here rather than asserted by script; `evals/assert-noaction-park.sh` only checks the
  in-repo, deterministic half of the contract (no sprint rendered, no unauthorized commit).
- Cost: **$0.5605, ~132s API time, 11 turns** (pinned `sonnet`, `--output-format json`).

`evals/assert-noaction-park.sh <repo-dir>` checks the in-repo half of this against a completed run's
directory (auto-detected via the `.fixture-kind` marker file shipped in this directory).
