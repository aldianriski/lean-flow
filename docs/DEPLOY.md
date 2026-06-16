---
owner: Maintainer
last_updated: 2026-06-16
update_trigger: Release process, environment, or rollback procedure changes
status: current
---

# lean-flow — Deploy / Release Runbook

> How a lean-flow version ships. lean-flow is a Claude Code plugin (markdown only) — "deploy" = a
> versioned git release of the marketplace source; users pull it via `claude plugin install`. No
> server, no build. These are the operational steps that aren't in code. `/release-patch` bumps the
> version + CHANGELOG and **stops before push** — everything from the push on lives here.

## Pre-flight
- [ ] **Lockstep check** — `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` carry the
  **same** version. This is *the* recurring gotcha — they must never drift (release-patch enforces it).
- [ ] CHANGELOG entry for the version written; the sprint is closed (Retro routed per §10).
- [ ] Consistency grep clean — skill count, the loop diagram, version strings agree across README /
  CONTEXT / manifests (the v1.0 checklist, TASK-017).

## Release steps
1. **Version bump** — `/release-patch` for a PATCH (auto-detects the plugin manifest, bumps both files
   lockstep, prepends `docs/CHANGELOG.md`) — *it stops before push*. For a MINOR/MAJOR (new skill or
   breaking change), bump both manifests by hand with an explicit CHANGELOG entry.
2. Commit the release: `release: vX.Y.Z`.
3. Push `main` to the GitHub remote — **that repo is the marketplace source**.
4. Propagation — users get it via `claude plugin install lean-flow@lean-flow` (or a marketplace refresh).

## Verify — by a real signal, not a proxy
- [ ] `plugin.json` version on the remote == the release tag == `marketplace.json` (the real signal —
  not "it pushed"). [L-013]
- [ ] A fresh `claude plugin install` (or a cold `/prime` in a test repo) resolves the new version.

## Rollback
- Revert the `release:` commit (or re-point the marketplace entry to the prior tag). Markdown-only, so
  rollback is a plain git revert — there is no data or runtime state to migrate.

## Ops traps
- **The live trap is lockstep version drift** (pre-flight above) — the one footgun this project actually has.
- The server-snapshot reconcile (L-010) and bulk-LLM / watcher footguns (L-030) in the template are
  **N/A here** — lean-flow has no server or batch step; they stay in the template for host projects that do.
