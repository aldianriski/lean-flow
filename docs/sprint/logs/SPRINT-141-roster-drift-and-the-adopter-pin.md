---
sprint: 141
slug: roster-drift-and-the-adopter-pin
owner: Maintainer
last_updated: 2026-10-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-141 — Execution Log

> Append-only companion to [`../SPRINT-141-roster-drift-and-the-adopter-pin.md`](../SPRINT-141-roster-drift-and-the-adopter-pin.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-25 | promote | plan locked, governance signed, three members: roster drift and the adopter pin
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: one due. L-249 (a headless exercise writes only in a trusted folder, never into a plugin manifest) at
  count 2 with `promoted: no`. Owner ruling: promote now, `disposition: merge`, joined to L-241's rule under LEARNINGS
  § Durable rules › consumer-side (`b9ccbbee`). Census, position-anchored on the header's first status field: 13 active +
  217 promoted + 1 superseded = 231, equal to the count of `## L-NNN` headers. A plain grep for `[status: active]` reads 14,
  because L-155's promoted header quotes the string. Each active entry's own `count:` line lists L-249 alone at 2.
- ☑ TD aging: 97 of 100 open rows aged against sprint 141. Second route: 103 rows − 3 resolved = 100 open = 97 aged + 3
  young (TD-272 · 273 · 274). Newly aged: TD-268 and 269 (trivial), TD-270 and 271 (low). None is `high`.
- ☑ doc-aging, §11 (owner-approved, applied in `7fbc09cd`): TD-222, 212 and 194 deleted (resolved at 138; ids stay
  retired). TASK-482, 485, 486, 487 and 488 (SPRINT-138) were pruned: no live `.md` citation by two routes (a scan of
  `git ls-files` `.md` paths with the §11 history paths filtered out, and ripgrep over the working tree), and both routes,
  run on TASK-473 as a control, hit `spec/CHANGELOG.md`. TASK-483 and 484 stay; each is still cited. The four
  never-scheduled `cancel/` files stay, as at SPRINT-140. No CHANGELOG rotation is due (2.16 and 2.15 are inline). No
  LEARNINGS collapse is due: the same six `promoted: yes` lines as at SPRINT-140.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` exits 0 with no FAIL line. `.claude/CLAUDE.md` 79/80,
  `.claude/CONTEXT.md` 149/150; the token budget reads ~12691 of 12691 (zero headroom, as SPRINT-140 T9 set it).
- ☑ epic rollup currency and epic coverage: no active epic (seven closed, one proposed). ☑ roadmap: none. ☑ handoff
  ledger: none.
Intake: the owner asked what can be promoted next; the ready set was TASK-489, 509 and 510, and the owner took all three.
Size check: 3 S, no `L`. All three are `origin: close-retro`. TASK-509 re-tiered P → G at promote (default-up, ADR-029):
it may extend a maintainer-only check. No epic.

### 2026-10-25 | scope-change | T1 also deletes the spent adlc-epic-sequencing.md baseline row
What broke: nothing. The G2 recon run of `check-prose-density.ts` printed "baseline row is spent, delete it" for two rows,
`.claude/CLAUDE.md 4` and `docs/research/adlc-epic-sequencing.md 1`; TASK-510 names only the first. Impact: T1 deletes both spent
rows from `scripts/lib/prose-density-baseline.txt`, already in T1's `Layers:`. No member's Done when changes. Owner ruling at
the G2 popup: include it.

### 2026-10-25 | scope-change | T3 Layers drops docs/research/learning-loop-architecture.md (owner ruled bump)
What broke: nothing. T3 declared the research doc for the decline branch only. The owner ruled bump to 2.16.0 at G2, so the
token would match nothing at close (L-240). Impact: T3's `Layers:` loses that token; no member's Done when changes. Edit:
T3's `Layers:` line.

### 2026-10-25 | gate | G1 + G2 signed by the owner by popup; three builder checks settled; three owner rulings
G1: all three members are `origin: close-retro`, so each took the full checklist (goal · size S · touches · out of scope ·
assumptions), shown in the popup's table. G2: no file is shared, so the order is T1 → T2 → T3, sequential in the main tree.
Owner rulings:
- **R1 (T2 route):** extend `check-count-claims.sh` with `check_claim "skills" … SECURITY.md 'Of the ([0-9]+)'` and a
  must-FAIL `security-drift` fixture. The choice and its reason go in a comment beside that line and in the CHANGELOG
  line (box 2). Checking the table's rows and grant classes is out of scope. Tier stays G (other G).
- **R2 (T1):** delete both spent rows (scope-change above).
- **R3 (T3):** bump workdoo to lean-flow 2.16.0. The owner updates the plugin dir and `LEANFLOW_PLUGIN_VERSION_PIN` on
  the VPS and notes it in workdoo's active sprint log (SPRINT-013). Box 2's evidence is a post-bump workdoo run record
  showing `leanflowVersion` 2.16.0, read through a non-secret route or pasted by the owner; never `/etc/workdoo/*.env`.
  T3 stays open until that record exists.
Settled facts (coordinator):
- SECURITY.md also misfiles `triage` (`Bash(git *)`) under "No shell at all". Box 1's "real `allowed-tools`" covers the
  fix: 6 unscoped · 3 scoped · 6 no shell = 15.
- No shipped skill or template names `check-count-claims`, so the new line cannot FAIL an adopter's repo. The existing
  fixtures carry no SECURITY.md and skip it.
- The T1 reader said the baseline holds one data row. It holds 28; line 27 is the second spent row.
builder-check · T1 · 1 contradictions · 1 questions · settled by reading the baseline (28 rows; reader misread); design unchanged
builder-check · T2 · 1 contradictions · 3 questions · box-2 record placed in a checker comment + CHANGELOG; consumer reach and regex settled from the repo
builder-check · T3 · 2 contradictions · 4 questions · evidence moved to workdoo's run record, log = its SPRINT-013 log; version and timing by owner ruling R3

### 2026-10-25 | progress | T1 done: both spent prose-density baseline rows deleted (TASK-510)
Inline, not dispatched: two line deletions in one file, where a brief would cost more than the work. `126844bc` deletes
`.claude/CLAUDE.md 4` and `docs/research/adlc-epic-sequencing.md 1` (51 → 49 lines). `check-prose-density.ts .` prints
`prose-density: 26 pass, 0 fail` (28 before; the two dropped rows were PASS lines) and no line for either file.
`run-prose-density-fixtures.ts` (the only other reader of the baseline, per L-251): 10 pass, 0 fail. Self-review only.
consequence · T1 · behaviour:low · governance:low

### 2026-10-25 | progress | T3 ruling recorded; waiting on the owner's bump and a post-bump workdoo run (TASK-489)
TASK-489 gains a `## Decision` section (outside `## Done when`) recording R3: bump to 2.16.0. Box 1 ticked against it. Box 3
(decline) ticked `n/a` against the same section. Box 2 stays open until two things exist: a workdoo run record after the
bump whose `leanflowVersion` reads 2.16.0, and the owner's note in workdoo's SPRINT-013 log. Owner action: bump the
plugin dir and `LEANFLOW_PLUGIN_VERSION_PIN` on the VPS, then trigger or wait for one run.
consequence · T3 · behaviour:low · governance:low
