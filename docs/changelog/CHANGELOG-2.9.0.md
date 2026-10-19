---
owner: Maintainer
last_updated: 2026-10-19
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.9.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.11.0 release** (2026-10-19). §11 keeps the
> current and previous minor inline (2.11.x and 2.10.x), so cutting v2.11.0 pushed v2.9.x out.

## v2.9.0 — one Plan parser; the member resolver names what it cannot resolve (2026-10-19)

**MINOR** — ships SPRINT-128 (Planning Debt), and closes EPIC-022. **Upgrade step:** a task store with a duplicate task id, a listed
member with no file, or a task file outside `docs/work/<folder>/` now FAILs by name (`member-ambiguous` · `member-missing` ·
`member-misplaced`), where it was skipped silently. Run `sh conformance.sh <repo>` once and fix any it names. The standard is
unchanged (spec 0.18.0). Restart the session after installing.

### SPRINT-128 — Planning Debt (2026-10-19)

EPIC-022's last slice: a Plan has one parser, and nothing that reads it drops what it cannot place.

**Consumer-facing:**
- **`conformance.sh` reads CRLF frontmatter itself.** Every Shell field reader strips a trailing CR, so a verdict no longer depends
  on whether the host's awk folds Windows line endings.
- **The members reader names store anomalies.** A duplicate id, a missing listed member or a misplaced task file is a named FAIL;
  the CLI exits 2 with the anomaly after its unchanged first line.
- **The dispatch preflight names a column-0 wrapped `Layers:` line** ("indent it, or separate prose with a blank line"), instead of
  building the ownership map from the first line only.

**Maintainer-side:**
- One shared Plan parser (`parsePlan`) replaces about eight heading regexes and six `Cites:` readers; a `Cites:` task id governs a
  member only in the leading run that opens the line.
- The Shell twins of the layers-observed and authority checkers, and the reaper's v1 Plan counting, are retired.
- `layers-token-matches-nothing` names a `Layers:` token that matched no file once its task is done; a member `## Done when` edit
  is covered only by a scope-change logged before it.
- TD-049 · 131 · 138 · 177 · 178 · 188 · 190 · 198 · 199 · 205 · 215 · 248 resolved; 8 rows closed at promote; TD-255 · 256 · 257 ·
  258 filed. EPIC-022 closed (8 of 8).

---

