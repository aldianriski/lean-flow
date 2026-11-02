---
id: TASK-564
title: "Stop the README template's Quick start repeating the setup guide, and fix the integrations OpenAPI pointer"
sprint: SPRINT-155
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-564 — Stop the README template's Quick start repeating the setup guide, and fix the integrations OpenAPI pointer

## Why
Two template defects seen in SPRINT-153's init exercises. The README template's Quick start restates the steps the setup
guide owns, so an adopter gets two copies that drift (a second SSOT). The integrations template points to an OpenAPI file
that init never writes, so the pointer is dead on every repo without one.

## Done when
- [x] The README template's Quick start points to the setup guide instead of restating it. ✓ `b27727ae`: an app keeps only the setup link, a package one install line plus the link; the first-run-steps invitation is gone (Claude review CLEAN)
- [x] The integrations template names the OpenAPI file only when the repo has one (or drops the pointer). ✓ `b27727ae`: all three unconditional mentions of an OpenAPI file removed; the API-contract section is kept only when a contract file exists
- [x] A real `init` through the installed plugin on a fresh snapshot writes neither the duplicate nor a dead pointer. ✓ 2026-11-02:
  on the README-less clinic copy (`D:\Research\ab-proof-clinic-155b`, plugin pinned at `5a53c65d`) init wrote README.md from the
  template: its Quick start is one link to `docs/development/setup.md`, which alone holds the run commands. No integrations doc was
  written (clinic has none), so that template was not exercised; the only OpenAPI line is init's `docs/api/README.md` placement
  3-liner, an instruction where to commit the file, not a pointer to one

## Touches
`skills/lean-doc-generator/templates/README.md.template` · the integrations template

## Tracker
SPRINT-153 close Retro (T1 box 3, T2 run)
