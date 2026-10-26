---
id: TASK-498
title: "Re-sync the vendored humanizer catalog when blader/humanizer releases past 3.1.0"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: close-retro
state: blocked
depends-on: []
---

# TASK-498 — Re-sync the vendored humanizer catalog when blader/humanizer releases past 3.1.0

## Why
`skills/humanizer/references/patterns-en.md` is a verbatim snapshot of blader/humanizer 3.1.0 at `8c307f36`, with no
auto-sync (SPRINT-139, ADR-001 review). Keeping it verbatim is what makes a re-sync a clean file replacement, but only if
someone notices a new upstream release.

## Done when
- [ ] The catalog body is `cmp`-identical to the new upstream release's SKILL.md from `## Why AI text sounds the way it does`
      to the end, and the header names the new version and full commit sha.
- [ ] Every pattern that is new or changed upstream gets an ADR-001 review row (keep / adapt + reason), approved by the
      owner before the catalog commit.
- [ ] The Indonesian catalog's § mapping is re-checked against any renumbered upstream sections.
- [ ] CHANGELOG line.

## Assumes
- **blocked-by:** a blader/humanizer release after 3.1.0 (check the upstream repository's tags or CHANGELOG).
- **open:** pin the re-synced source by upstream commit (sha), not only the release version (`docs/research/codex-run-project-pipeline.md`, source-register row).

## Tracker
SPRINT-139 Retro (follow-up).
