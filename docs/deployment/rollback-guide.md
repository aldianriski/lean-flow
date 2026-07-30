---
owner: Maintainer
last_updated: 2026-07-30
update_trigger: Rollback process changes
status: current
---

<!-- Companion to deployment-guide.md, which owns the forward deploy flow. -->

# lean-flow — Rollback Guide

> The standard rollback procedure — the one reliable way back when a release goes bad.

## Rollback process
lean-flow is a Claude Code plugin — markdown only, no server, no build, no runtime state. There is
nothing to migrate back.
1. Revert the `release:` commit (or re-point the marketplace entry to the prior tag).
2. Push. Users get the reverted version on their next `claude plugin install` / marketplace refresh.

## Rollback verification — by a real signal, not a proxy
- [ ] Confirm the prior version is *actually* live again — check `plugin.json` on the remote, **not**
  "it pushed"; a stale cache can still resolve the old install. [L-013]
- [ ] No data/state check needed — markdown-only, nothing to leave half-migrated.
