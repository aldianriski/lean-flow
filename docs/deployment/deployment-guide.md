---
owner: Maintainer
last_updated: 2026-11-02
update_trigger: Release process or environment changes
status: current
---

# lean-flow — Deploy / Release Runbook

> How a lean-flow version ships. lean-flow is a Claude Code plugin (markdown only) — "deploy" = a
> versioned git release of the marketplace source; users pull it via `claude plugin install`. No
> server, no build. These are the operational steps that aren't in code. `/release-patch` bumps the
> version + CHANGELOG and **stops before push** — everything from the push on lives here.

## Pre-flight
- [ ] **Lockstep check** — every versioned manifest (derive the set: `grep -l '"version"' .*-plugin/*.json`) and the
  README footer carry the **same** version. This is *the* recurring gotcha — they must never drift (release-patch
  checks the manifests; nothing checks the footer).
- [ ] CHANGELOG entry for the version written; the sprint is closed (Retro routed per §10).
- [ ] Consistency grep clean — skill count, the loop diagram, version strings agree across README /
  CONTEXT / manifests (the v1.0 checklist, TASK-017).

## Release steps
1. **Version bump** — `/release-patch` for a PATCH (auto-detects the plugin manifests, bumps them in
   lockstep, prepends `CHANGELOG.md`) — *it stops before push*. For a MINOR/MAJOR (new skill or
   breaking change), bump every manifest and the README footer by hand with an explicit CHANGELOG entry.
2. Commit the release (`release: X.Y.Z <PATCH|MINOR> -- <summary>`).
3. Push `main` to the GitHub remote — **that repo is the marketplace source**.
4. Propagation — users get it via `claude plugin install lean-flow@lean-flow` (or a marketplace refresh).

## Verify — by a real signal, not a proxy
- [ ] Every manifest's version on the remote == the CHANGELOG head (the real signal — not "it pushed"; this
  repo does not tag releases). [L-013]
- [ ] A fresh `claude plugin install` (or a cold `/prime` in a test repo) resolves the new version.

Rollback process → [`docs/deployment/rollback-guide.md`](rollback-guide.md).

## Ops traps
- **The live trap is lockstep version drift** (pre-flight above) — the one footgun this project actually has.
- The server-snapshot reconcile (L-010) and bulk-LLM / watcher footguns (L-030) in the template are
  **N/A here** — lean-flow has no server or batch step; they stay in the template for host projects that do.
