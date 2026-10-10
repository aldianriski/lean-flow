---
sprint: 121
slug: cover-what-is-open
owner: Maintainer
last_updated: 2026-10-10
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-121 — Execution Log

> Append-only companion to [`../SPRINT-121-cover-what-is-open.md`](../SPRINT-121-cover-what-is-open.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-10 | promote | plan locked at `4d82a8f`, governance signed, seven members: give every open item a home, run as EPIC-015 Dogfood 1
The backlog held nothing promotable until a full scan, which the owner asked for after a backlog-only triage, found four EPIC-015
conditions with no tasks and four workdoo epics filed in this repository. Two Codex review rounds ranked the work. The owner ruled the
grill (CW6 via a ruling task; CW5 and Dogfood 2 in one overnight run; this sprint as Dogfood 1; the re-armed freeze widened to
governance) and the governance checklist (aging sweep `448641e`; §11 deletion of TD-122/124). TASK-404 was split at size-check so
only its profile (TASK-421) joins. `promote-check.ts` returned 22 pass, 0 fail after two member files' bare filenames were written
as full paths.

System verify at promote (`QA_FULL=1`, VPS fresh clone of `7679f3f6`): `301 pass, 3 fail`, 116 s. That run had two causes.
(1) **This log was absent**: the sprint file said "created lazily", but the night-run rollup leg treats an active sprint without a
log as a FAIL, so this entry creates the log. (2) **The fresh clone had no `node_modules`**, so `typecheck` and
`typecheck-population` could not find `tsc`. That is a property of the run environment, not of the tree, and the re-run installs
dependencies first.

### 2026-10-10 | progress | system verify at promote is green after the log fix
`QA_FULL=1` on a VPS fresh clone of `d38a4f71`, with `bun install --frozen-lockfile` run first: `QA-CHECK: 303 pass, 0 fail`, rc 0,
120 s, read from the run's own `gate121.rc` and `gate121.secs` files. The two typecheck FAILs from the first run were the
environment (no `node_modules` on a fresh clone). The rollup FAIL was the missing log, which the promote entry above created.
