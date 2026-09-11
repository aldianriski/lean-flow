---
epic: 914
slug: f
owner: Maintainer
last_updated: 2026-05-02
status: active
member_sprints: [SPRINT-914, TBD (workdoo]
update_trigger: fixture -- an unparsed entry must not reach the class (c) regex
---

# EPIC-914 — Unparsed Entry Poisons The Attribution Regex (fixture)

The second entry names no sprint number, so it is `unparsed`, and its text carries an unbalanced
`(`. `allmem` feeds every member token into `ticked_unattributed`, which interpolates each one into
a dynamic regex `("SPRINT-0*" arr[i] "([^0-9]|$)")`. Handed arbitrary prose, awk aborted mid-file
with `invalid regexp` -- class (c) never ran, this epic was reported PASS, and the run exited **0**
with the diagnostic buried among the PASS lines.

The tick below is deliberately attributed to NOTHING, so class (c) has a real finding to make. If
the unparsed entry reaches the regex, that finding is silently lost at a green exit -- the silent
false negative this whole sprint exists to remove, reintroduced by the branch added to close a
different review finding. `b255f87` had fixed this incidentally; `1e42c42` put it back.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-914](../sprint/archive/SPRINT-914-m.md) | Member | closed 2026-05-01 · `ccc111914` | did the thing |

## Closed when

- [x] The mechanism ships
- [ ] The mechanism is exercised on real input
