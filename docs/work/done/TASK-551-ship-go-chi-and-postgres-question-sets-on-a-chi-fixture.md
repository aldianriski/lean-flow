---
id: TASK-551
title: "Ship the Go/chi and Postgres question sets on a chi fixture"
epic: EPIC-023
sprint: SPRINT-153
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-549]
---

# TASK-551 — Ship the Go/chi and Postgres question sets on a chi fixture

## Why
D12's backend profiles. No non-A/B repo on this machine uses chi, so the task builds a minimal fixture (I-5). Not frozen
under ADR-053. G2 review-round cap: 2.

## Done when
- [x] Short curated Go/chi and Postgres question sets ship; the Postgres set loads on any repo with a Postgres substrate, ✓ 99d8aeec: go-chi.md and postgres.md; postgres detects drivers or ORM dialects across Go, npm, Python, Ruby, JVM, .NET, Rust, Elixir and hosted clients, or a Postgres image the app uses
  whatever its language.
- [x] A minimal Go chi + pgx + SQL-migrations fixture repo exists in D:\Research, written fresh, not copied from clinic-ab. ✓ D:\Research\chi-fixture written fresh (chi v5 + pgx v5 + SQL migrations + postgres compose, no env file); independent review found it unlike clinic-ab
- [x] A real `init` through the installed plugin on that fixture loads both sets, and on the portfolio-sveltekit snapshot loads ✓ headless init (build b341d47d): the chi fixture loaded go-chi and postgres; portfolio-sveltekit loaded postgres only (it has Postgres), not go-chi
  neither unless it detects Postgres.

## Touches
the profiles folder in the lean-doc-generator references · a new fixture repo outside this repo

## Assumes
- **blocked-by:** TASK-549 (the set mechanism).
- Questions stay within the seven profile topics (I-6).
- The fixture shares no code with clinic-ab, so the Go/chi set is not tuned to a measured repo (I-2, I-5).

## Tracker
EPIC-023 Closed-when S1 · research §5 D12 · S1 intake I-2, I-5, I-6 (2026-10-30)
