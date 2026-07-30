Retained **fixture input** for the "Residual grill · any `AskUserQuestion`" boundary row (Part B,
SPRINT-038 T2 salvage of TD-012 — the real headless run lived only in a scratch dir and would have
been lost). This is the pre-run skeleton: two disjoint tasks, T1 carrying an unresolved `assumes:`
(A1, the summary-line format) that a batch G2 sign-off explicitly did not cover, T2 fully specified.
Deterministic and inputs-only — no run output, no `.git`, no machine-specific path baked in.

## Reconstruct into a fresh throwaway repo

```sh
dest=$(mktemp -d)
cp -r evals/fixtures/boundary-rows/residual-grill/. "$dest"/
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

- T2 (`status.md`, FIX-102) done: DoD ticked `[x]`, committed, no open question.
- T1 (`notes.md`, FIX-101) **parked-hitl**: DoD stays `[ ]`, `notes.md` never created, a park record
  matching Part 4's `Tn · state · next-action` shape names T1, no commit claims FIX-101/T1 complete.

`evals/assert-boundary-park.sh <repo-dir>` checks exactly this against a completed run's directory.
