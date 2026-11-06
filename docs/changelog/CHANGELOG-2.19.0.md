---
owner: Maintainer
last_updated: 2026-11-06
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.19.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.21.0 release** (2026-11-06). §11 keeps the
> current and previous minor inline (2.21.x and 2.20.x), so cutting v2.21.0 pushed v2.19.x out.

## v2.19.1 — three guards report only what they saw (2026-10-28)

**PATCH** — ships SPRINT-146 (Say What They Saw), a fixes-only sprint. No new skill; the roster stays at 15. Installing the
release is enough; no upgrade step. The standard is unchanged (spec 0.18.1). Restart the session after installing.

### SPRINT-146 — Say What They Saw (2026-10-28)

**Consumer-facing:**
- `orchestrator/references/night-run.md` names a new rollup line, `TASK-NNN · uncovered · …`, for a member's open
  `## Done when` box that no Plan `Tn` cites. It also adds that case to the `HARD_FAILURE` row: such a run can no longer
  end `PLAN_EXHAUSTED`.

**Maintainer-side:**
- **Fixed** — the night-run reaper no longer ends `PLAN_EXHAUSTED` over a member's open `## Done when` box that no Plan `Tn` cites (TD-201): it writes a `TASK-NNN · uncovered · …` rollup line and the terminal becomes `HARD_FAILURE`, replacing only the clean ending. `sprint-members-cli.ts` gains an `uncovered` mode; `counts` output is unchanged.
- **Fixed** — the revise-loop ceiling verdict no longer overclaims (TD-152): its `PASS` line keeps its prefix and now states how many `Tn · retry ·` lines it read, that they are model-reported, and that an unlogged retry is undetectable. FAIL paths are unchanged.
- **Fixed** — `qa-verdict.ts` now says so when its non-zero exit skips a stage chained after it with `&&` (TD-155): under `bun run test` it prints that `bun test` will not run; nothing new prints on a pass, under `gate`, or on a direct run. Exit codes are unchanged.
- TD-128 and TD-166 closed (fixed in code earlier, rows never closed); TASK-527 cancelled under ADR-053; TASK-513…522
  (six files) pruned (§11); L-258 promoted to LEARNINGS § Durable rules › edit-safety; L-260 and TD-279 filed.

## v2.19.0 — English terms of art kept in Indonesian domain text, and a working list recast as requests (2026-10-27)

**MINOR** — ships SPRINT-145 (Keep the Terms, Recast the List), a feature sprint drawn from an owner's corrections to a
real Indonesian request memo. No new skill; the roster stays at 15. Installing the release is enough; no upgrade step.
The standard is unchanged (spec 0.18.1). Restart the session after installing.

### SPRINT-145 — Keep the Terms, Recast the List (2026-10-27)

**Consumer-facing:**
- The Indonesian humanizer catalog keeps English terms of art in domain text: a spec name, column header, capacity term
  or test name stays English even when a plain Indonesian phrase exists (concurrent user, acceptance test, write
  penalty, free space, fault tolerance), and the Keep Indonesian list now says it covers general vocabulary only.
  Measured on a new retained fixture of a synthetic Indonesian request memo (TASK-525).
- A sixth overlay pattern, LF-6: an internal list of open decisions inside text addressed to someone else is recast as
  numbered requests or questions to the recipient, every item kept and none decided for them. The Indonesian catalog
  gains ID-18 (hedges such as "di atas kertas" go, while the claim's basis, "menurut perhitungan", and any testing
  obligation stay) and a label-first fragment example under ID-2 (TASK-526).

**Maintainer-side:**
- A retained fixture, `evals/fixtures/humanizer/term-of-art/`: a synthetic memo that fails on the 2.17.0 pass (0 of 3)
  and passes after (3 of 3), with every run recorded and judged by a reader that did not write the brief.
- L-257 promoted; L-258 to count 2; TASK-512 pruned (§11); v2.17.x rotated to `docs/changelog/CHANGELOG-2.17.0.md`.

---

