Retained **fixture input** for the two `close`-time park rows — "§11 retention" and "doc-freshness"
(Part B, SPRINT-038 T2 salvage of TD-012 — the real headless run lived only in a scratch dir and
would have been lost). This is the pre-run skeleton: one trivial, fully-specified task so the sprint
reaches all-DoD-`[x]` and `sprint-bulk unattended` step 6 fires `/lean-doc-generator close`.
Deterministic and inputs-only — no run output, no `.git`, no machine-specific path baked in.

## Reconstruct into a fresh throwaway repo

```sh
dest=$(mktemp -d)
cp -r evals/fixtures/boundary-rows/close-park/. "$dest"/
git -C "$dest" init -q
git -C "$dest" add -A
git -C "$dest" -c user.name='Fixture Bot' -c user.email='fixture@example.com' \
  commit -q -m 'fixture: initial state'
echo "$dest"
```

`$dest` is now a standalone git repo — a fresh throwaway host for the manual headless step
documented in `evals/README.md` § Real-run fixtures. It is not, and must never become, a nested
`.git` under this repo's `evals/` tree (see `evals/fixtures/worktree-usability/no-worktree-support/
README.md` for why a real non-repo/repo fixture can't live committed inside lean-flow's own `.git`).

## What a compliant run should produce

- T1 (`completion.md`, TASK-903) done: DoD ticked `[x]`, committed, all Plan DoD now `[x]` — close
  fires.
- `close·§11-retention` **parked-hitl**: sprint file NOT moved to `docs/sprint/archive/`,
  `docs/sprint/INDEX.md` gains no row, `TODO.md` Backlog's `TASK-903` entry NOT removed.
- `close·doc-freshness` **parked-hitl**: no doc outside the sprint file itself touched by an
  unapproved freshness refresh.
- Both parks named by a record matching Part 4's `Tn · state · next-action` shape; no commit claims
  the retention or doc-freshness step complete; clean exit.

`evals/assert-boundary-park.sh <repo-dir>` checks exactly this against a completed run's directory.
