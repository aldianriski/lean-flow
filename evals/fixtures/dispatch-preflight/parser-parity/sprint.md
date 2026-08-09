---
sprint: 900
slug: parser-parity
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: 0000000
close_commit: [sha — set at close]
update_trigger: fixture — never a real sprint
---

# SPRINT-900 — Parser parity fixture (TD-040 · TD-043)

> Not a real sprint. This file is driven through **both** parsers that read `Layers:`/`Depends-on:` —
> the preflight snippet in `dispatch.md` and `scripts/lib/check-layers-completeness.sh` — because the
> duplication between them is what drifted twice. Neither tool is asked for the other's verdict; each
> is asked whether it *saw the same declarations*, which is the only thing they genuinely share.
>
> Every declaration here is deliberately awkward in both of the ways that broke the snippet: the
> shared file `common.md` sits on an **indented continuation** in both tasks, and the shared tree is
> declared as a **directory token** by T1 and as a file inside it by T2. A parser that regresses on
> either one stops reporting an overlap it used to report, and this fixture goes red.

## Plan

### T1 — Alpha `[size: S · risk: low · class: execution · AFK]`
Layers: `alpha/one.md` · `alpha/two.md` ·
        `shared/tree/` · `common.md`
Depends-on: none
Declares the shared tree as a directory token, and the shared file on a continuation line.

**Acceptance:** both parsers read the continuation and the directory token.

**DoD:**
- [ ] Edit `alpha/one.md` and `common.md`

### T2 — Beta `[size: S · risk: low · class: execution · AFK]`
Layers: `beta/one.md` ·
        `shared/tree/nested.md` · `common.md`
Depends-on: T1
Declares a file inside T1's tree, plus the same shared file, also on a continuation line.

**Acceptance:** the tree overlap is reported as owned via the T1 edge, not missed.

**DoD:**
- [ ] Edit `beta/one.md` and `common.md`
