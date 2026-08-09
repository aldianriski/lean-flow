---
owner: Maintainer
last_updated: 2026-08-09
status: current
id: mattpocock-scan3-keepers
tags: [process, tooling]
domain: governance
related: [mattpocock-adaptation]
---

# Research — mattpocock scan 3 keepers (detail)

> Split out of [`mattpocock.md`](mattpocock.md) at SPRINT-054 T4 (§7 growth rule — knowledge docs
> split, ledgers compress). The parent holds the question, the corpus, the delta map and the verdict
> status; this file holds scan 3's keeper detail. Moved verbatim, nothing compressed.

## Keepers — scan 3 (all micro; filed, never adopted in-scan)

- **K1 — redact secrets before showing captured artifacts** (`diagnosing-bugs`). `/diagnose` instructs
  capturing traces, HAR files, log dumps and replayed payloads, and says **nothing** about redaction —
  zero occurrences of redact/secret/credential across `SKILL.md` and `feedback-loops.md`. Captured
  artifacts routinely carry auth headers, and a debugging session is where they get pasted. Matt's
  rule is also the *right* mechanism, not just a warning: build loops against **env vars** so the
  credential stays in the environment rather than in what you show, and quote only the signal-carrying
  lines. → **TASK-156**.
- **K2 — scope a refactor scan by git hot-spots before scanning** (`improve-codebase-architecture`).
  `/refactor-advisor` has no scoping step at all: it scans, then ranks. Deepening only pays off where
  change is frequent, so walking `git log` for the files that keep reappearing is a YAGNI filter on
  the scan itself. → **TASK-158**.
- **K3 — retain a spent prototype on a throwaway branch instead of deleting it** (`prototype`).
  `/prototype` says "delete or absorb — never leave it rotting", which loses the artifact entirely;
  Matt commits it out of main and leaves a pointer, keeping it as a retrievable primary source at zero
  repo cost. TD-012 is our scar for exactly this (fixtures deleted with the prototype left a gate
  unguarded). → **TASK-158**.
- **K4 — recover each side's intent before resolving a merge conflict** (`resolving-merge-conflicts`).
  Read the commit messages / PRs behind each hunk, preserve both intents, never invent new behaviour,
  always resolve rather than `--abort`. Not a new skill — two lines in `dispatch.md`'s merge-back
  queue, which is where our conflicts actually arise. SPRINT-041's corrupted merge is why this is not
  theoretical. → **TASK-158**.
- **K5 — the tautological-test anti-pattern** (`tdd`). An assertion that recomputes the expected value
  the way the code does (`expect(add(a,b)).toBe(a+b)`, a hand-derived snapshot) passes **by
  construction** and can never disagree with the code. Absent from `/tdd` and `testability.md`, which
  carry implementation-coupled and horizontal-slicing but not this. Same family as L-058: a check that
  can only pass is the failure it exists to prevent. → **TASK-157**.
