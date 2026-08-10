---
epic: 005
slug: fleet
owner: Maintainer
last_updated: 2026-08-10
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-005 — Fleet

> **Outcome:** one standard version governs many repos — an org pins it, upgrades them together, and
> reads delivery and conformance across the whole fleet from one report.

## Why this, why now

This is the stated north star: lean-flow as a delivery standard adopted at organisation scale, with
agentic delegation under provable HITL quality. Everything in the repo today assumes one checkout and
one human — there are zero occurrences of multi-repo, monorepo, org-level or cross-repo across
`skills/`, `.claude/` and `README.md`, and the standard's own team≥2 gate has never fired
(`docs/research/platform-readiness-audit.md` F6).

It runs **last and depends on EPIC-003 + EPIC-004**, and that ordering is the point. A fleet needs
something to pin (a versioned spec) and something to report (a conformance answer). Building fleet
mechanics before either exists would mean inventing both badly, inside the harder problem.

## Scope

**In:** standard-version pinning per repo · a rollout/upgrade path when the standard moves ·
cross-repo conformance and delivery reporting · delegation policy across repos (budget and capability
per agent) · fleet state that stays git-native.

**Out (explicitly not):** a hosted service, dashboard or control plane · a database (the README
promises plain markdown, no database, no lock-in — and that promise is load-bearing for adoption) ·
telemetry of any kind · running an org's CI for them.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| _(appended at promote)_ | | | |

## Decisions

- **D1** — Fleet state is git-native. Anything else contradicts the no-database/no-lock-in promise the
  README makes and that "adopt a standard" depends on — an org will not centralise delivery governance
  on a single maintainer's service.
- **D2** — Delegation policy is declared per repo and read by the run, not held by a coordinator
  process. A coordinator is a service by another name, and L-099 already showed what happens when a
  rule lives where its reader does not read it.

## Open questions

- How does fleet state stay git-native without a database — a manifest repo, per-repo pins, or
  something else? → the epic's first real design fork; a `/prototype` if it cannot be settled on
  paper, and a `/council` if it turns out to be ADR-grade.
- What does "delivery across the fleet" report — DoD completion, conformance level, or both? → decide
  once EPIC-004 shows what a single-repo report actually looks like.
- Does a fleet imply multiple *humans* signing gates, and does the attestation format from EPIC-003
  already carry that? → check before designing anything new; per-commit identity may cover it for free.
- Is monorepo (many teams, one checkout) served by this epic or by scaling `stream:`? → an unanswered
  admission test; ruling it early prevents building fleet mechanics for a case `stream:` already fits.

## Closed when

- [ ] Two or more repos are pinned to one standard version and upgraded together
- [ ] One report covers conformance across those repos, generated without a service
- [ ] Delegation policy is declared per repo and observed by an actual run
- [ ] No fleet state lives outside git
