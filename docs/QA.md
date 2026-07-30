---
owner: Maintainer
last_updated: 2026-07-30
update_trigger: A QA rule added/changed, the check script changes, or a release-checklist gap is found
status: current
---

# lean-flow — QA checklist

The release-time consistency check for the plugin's own docs + skills. **Hybrid (ADR-008):** the
mechanical rules are enforced by `scripts/qa-check.sh`; the judgment rules need a human/agent pass.
Run both before cutting a release or closing a sprint.

## Mechanical — `sh scripts/qa-check.sh` (exit 0 = clean)

| Rule | What it checks |
|---|---|
| Line caps | `SKILL.md` <=110 · `CLAUDE.md` <=80 · `CONTEXT.md` <=130 · active `SPRINT-*` <=400 |
| Skill count | disk count of `skills/*/SKILL.md` == the number claimed in CLAUDE.md / CONTEXT.md / ARCHITECTURE.md |
| Template count | `templates/*.md.template` files == claimed core + 2 non-core (DESIGN, QA-TESTCASE); claim in CLAUDE.md + ARCHITECTURE.md |
| Frontmatter | every `SKILL.md` has `---`/`name`/`description`; every core ledger has `owner`/`last_updated`/`status` |
| Task schema | active-sprint `### Tn` Plan blocks carry `class:` + an autonomy tag (HITL/AFK) in header meta, plus `Depends-on:`/`Layers:`/`**Acceptance:**` — else FAIL (TASK-110) |

Non-zero exit = fix before release. Watch the near-cap files the run prints — one edit can breach
them.

## Judgment — manual / agent pass (a script can't decide these)

- [ ] **No HOW content** — every doc passes the WHY/WHERE filter (DOCS_Guide §5); HOW belongs in code comments.
- [ ] **Cross-ref sanity** — `/skill` references and `references/` paths resolve; no dangling links.
- [ ] **Description-trigger quality** — each `SKILL.md` `description:` fires on the right intents, not the wrong ones (deep pass → TASK-012, `skill-creator` eval).
- [ ] **Lockstep versions** — `plugin.json` == `marketplace.json`.
- [ ] **DoD met** — the CLAUDE.md Definition of Done for any changed skill / loop.

## When to run

At **sprint close** and before any **release** — and any time a count or cap might have drifted (after
adding a skill or template). The mechanical pass is the gate; the judgment pass is the floor.
