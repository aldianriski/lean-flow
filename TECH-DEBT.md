---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: Tech debt filed (Sprint Close), aged (Sprint Promote), or resolved
status: current
---

# lean-flow — Tech Debt Ledger

> Filed automatically by the Sprint Close Retro (`TD-NNN` rows) · aged at Sprint Promote
> (unaddressed ≥ 3 sprints → re-review; `severity: high` → auto-escalate to `TODO.md` Backlog P1) ·
> resolved → `status: resolved → TASK-NNN`; **≥ 3 sprints later the row is deleted outright** (§11).
> The delay is deliberate — a just-resolved debt is still context at the next promote — and the
> substance survives in `CHANGELOG.md`, the sprint archive and git, so what goes is a breadcrumb, not a
> record. **IDs stay monotonic: a deleted row never frees its id.** `severity` ∈ trivial · minor · medium · high.
>
> A row's **`Mitigation:` line is the filer's hypothesis, not a plan** — written while the cost was being
> felt, and after a few re-reads it starts to read as settled. Cite the evidence for the *problem*;
> re-derive the *fix* before a DoD is built on it (L-091 → DOCS_Guide §10). The same goes for a row's
> Summary: TD-036's was false the day it was filed.

---

## Tech Debt

- **TD-039** severity: minor | status: open | created: Sprint-052
  - Summary: `check-layers-completeness.sh`'s two completeness FAILs — `Layers completeness:
    DoD/Acceptance implies <file>, absent from Layers:` and its `Depends-on:` twin — never name the
    `Cites:` escape. The author who trips the gate is told only what the declaration is missing.
  - Impact: the obvious repair from that message is to add the token to `Layers:` — declaring a touch
    that is not one, which is exactly what the escape exists to prevent. Discovery is broken at the one
    moment it matters. TD-036 hunted this gap on the *authoring* surfaces (the SPRINT template, `QA.md`)
    and it was on neither, because the surface a failing author actually reads is the FAIL message.
  - Mitigation (not yet done) — a hypothesis, per this ledger's header: append the escape to the two
    messages (`scripts/lib/check-layers-completeness.sh:135` and `:149`). Re-derive before building —
    confirm a FAIL naming its own escape does not read as an invitation to silence the gate. The
    evidence for the cheap version is that the abuse is already guarded: a token in both `Cites:` and
    `Layers:` is a contradiction with its own named FAIL.

- **TD-038** severity: trivial | status: open | created: Sprint-050
  - Summary: `docs/research/mattpocock.md` sits at **117 lines against its 120 soft cap** with the
    corpus now fully mapped. TD-033 bought headroom by collapsing two scans to pointers; that lever is
    spent, and the next re-scan breaches on contact.
  - Impact: none today, and deliberately not pre-solved — the doc is *correct* at 117 and restructuring
    a correct doc against a hypothetical future scan is the shape TD-031 warned about. What makes this
    worth a row rather than nothing is that the breach is now **certain rather than possible**: the
    upstream repo grew 34 → 35 files between two scans, so a re-scan is a matter of when.
  - Mitigation (not yet done): at the next re-scan, split per-scan files behind an index — the option
    scan 3 rejected because one readable table was worth more than a lower line count. That trade
    reverses once the table stops fitting. Do **not** apply it before then.

- **TD-037** severity: minor | status: open | created: Sprint-049
  - Summary: attribution needs a commit to read, so **uncommitted work in progress is still tested
    against the all-task union** — the exact weakness TD-035 was filed about, surviving on the one
    path where nothing can be attributed.
  - Impact: bounded and arguably acceptable. The collision TD-035 describes happens between
    *committed* worktree branches at merge-back, and the coordinator's post-merge gate run sees
    everything committed — that path is now per-task. What stays uncovered is a single session's
    mid-flight edits, where "which task is this?" has no mechanical answer because the work has not
    been committed yet. Filed as its own row rather than left inside TD-035's resolution note, because
    that note is deleted three sprints after resolution (§11) and the residual would go with it.
  - Mitigation (not yet done): possibly none warranted — "unattributable because uncommitted" may
    simply be the honest boundary of a history-reading check. If it is ever worth closing, the lever
    is the sprint's own open-DoD state (exactly one task is usually in flight), which is a guess
    rather than a derivation and should be treated as one. **Do not narrow this by adding a rule that
    infers the current task** without evidence that a real miss occurred — that is TD-031's pattern
    starting over.
  - **Re-reviewed 2026-08-09 (SPRINT-052 promote, 3 sprints open) — deferral reaffirmed, deliberately.**
    The row's own trigger is *evidence of a real miss on the uncommitted path*, and none has appeared:
    every miss the redesign has caught since (SPRINT-050 T2's undeclared out-of-scope trail) came
    through the **committed** leg, which is the one attribution now covers. Acting now would mean
    inferring the in-flight task from open-DoD state — a guess this row already names as a guess — and
    guarding it would need its own negative test built against a failure nobody has observed. That is
    TD-031's pattern exactly: narrowing a working guard under no pressure. Held, with the trigger
    unchanged; a re-review that reaffirms is a decision, not a skipped line.

- **TD-036** severity: minor | status: closed-not-supported → SPRINT-052 T2 | created: Sprint-049
  - Summary: the `Cites:` escape shipped in `check-layers-completeness.sh` (SPRINT-049 T3) is
    documented **only inside the checker**. `templates/SPRINT.md.template` — the file an author
    actually writes a Plan from — never mentions it.
  - Impact: the only way to discover the escape exists is to trip the gate and read a checker's source
    comments, which is precisely the "reword the docs until it goes quiet" behaviour TD-032 was filed
    to stop. An author who does not know the escape exists will do the thing the escape was built to
    prevent. Same family as L-069 (a behavioural rule ships with its trigger, or it does not ship) —
    here the rule shipped and the *authoring surface* did not.
  - Mitigation (not yet done): one line in the SPRINT template's Plan comment block naming `Cites:`
    alongside the `Layers:`/`Depends-on:` requirements. Note the consumer question first (L-015): the
    checker is maintainer tooling (`scripts/`, ADR-008) that no consumer runs, so a template line
    would advertise a convention nothing enforces on their side. Decide which of the two surfaces the
    line belongs to before writing it.
  - **CLOSED — not supported (SPRINT-052 T2).** The consumer question was answered first (L-015) and it
    is not a tie: `check-layers-completeness.sh` lives in `scripts/` — maintainer tooling that ships to
    nobody (ADR-008) — so a `Cites:` line in `templates/SPRINT.md.template` would advertise to every
    consumer a convention nothing on their side enforces. Neither surface takes the line, and this row
    closes rather than staying open as a nag.
  - **The Summary was already false when it was filed.** `docs/QA.md`'s layers-completeness row
    documents the escape in full — its exemption, that absence changes nothing, and the
    `Cites:`/`Layers:` contradiction — added in `75e61a8`, *the SPRINT-049 close that filed this row*.
    The escape was never checker-only; the maintainer surface that owns it had it from the first day.
    A filed premise falsified at execution: L-091's shape, one level up from the Mitigation lines it
    was promoted about, and found by the task sent to act on it.
  - **Residual → TD-039.** What the row was reaching for survives on a surface neither it nor TASK-161
    named — the FAIL message an author actually trips.

- **TD-034** severity: trivial | status: resolved → SPRINT-051 T4 | created: Sprint-047
  - Summary: the archived `docs/sprint/archive/SPRINT-045-gate-precision.md` carries **duplicate
    `## Files Changed` and `## Retro` sections**, plus one `### 2026-08-01 | scope-change` Execution
    Log entry stranded inside the first Retro block rather than in the Log.
  - Impact: low but confusing — a reader gets two answers to "what changed" and "what did we learn",
    with no marker saying which supersedes. Verified pre-existing at HEAD before SPRINT-047 T1 touched
    the file, so the split did not cause it; T1 deliberately left it alone (clean up your own mess
    only). Most likely an L-009 structure-adjacent fusion during that sprint's close.
  - **RESOLVED (SPRINT-051 T4) — and the mitigation below was deliberately not followed.** This row
    proposed reconciling the two pairs "into one". Diffing them first (the owner ruling at the
    SPRINT-051 promote required it) showed they are **not duplicates**: the first table is the run's
    own snapshot, carrying per-row verification state, a parked-fixture row and steps the run could not
    execute; the second is the consolidated close-time table, with close-only rows the first cannot
    have. Merging would have meant choosing which of two honest records survives — in a closed archive.
    Shipped instead: both tables **labelled** `(during execution)` and `(final, at close)`, with a note
    on the first saying what supersedes it and why it is kept. That answers this row's actual
    complaint — "no marker saying which supersedes" — at zero content loss. The stray `## Retro`
    heading held no retro content, only a misplaced Execution Log entry; the heading is gone and the
    entry moved verbatim into `archive/logs/`, tagged with why it moved. L-091's shape again: a
    Mitigation line is the filer's hypothesis, and this one was wrong about the *cause* while right
    about the symptom.
  - Original mitigation (superseded): reconcile the two pairs into one, and move the stranded entry into
    `archive/logs/SPRINT-045-gate-precision.md` where it now belongs. Cheap, but it edits a closed
    archive record, so it wants an explicit decision rather than a drive-by fix.

- **TD-033** severity: trivial | status: resolved → SPRINT-050 T1 | created: Sprint-047
  - Summary: `docs/research/mattpocock.md` now runs **136 lines against its 120 soft cap** (DOCS_Guide
    §2), carrying two scans — the 2026-07-10 original and the 2026-08-09 re-scan.
  - Impact: none functional; research caps are soft and nothing lints them, which is exactly why this
    will otherwise go unnoticed. The structural question is real though: a doc accumulating one scan
    per revisit grows without bound, and scan 1's detail is now largely historical since all three of
    its keepers shipped.
  - Mitigation (not yet done): either collapse scan 1's shipped sections to pointers (the §11
    LEARNINGS-collapse pattern applied to research), or split per-scan files with an index. Note there
    is no automated scan for research-doc caps at promote — only TODO.md's ~150 line trigger exists —
    so this row is the only thing that will resurface it.
  - **RESOLVED (SPRINT-050 T1) — the first mitigation was taken.** Scan 1 and scan 2's narrative
    sections collapsed to pointer lines in the verdict block (their keepers all shipped, so the detail
    is historical and lives in git), and every skill examined now occupies one row of a single delta
    map rather than a per-scan prose section. 136 → **114 lines** against the 120 soft cap, while
    *adding* scan 3's 10 rows and 5 keepers. The split-per-scan-file option was rejected: the value of
    this doc is one table you can read top to bottom, and an index over three files would trade that
    for a lower line count in each.
  - **Residual, and it will bite T3:** the doc has ~6 lines of headroom and T3 adds 13 more delta-map
    rows. The compression available then is collapsing the 11 scan-1/scan-2 rows into two summary
    lines, since their verdicts are already stated in the header block. Recorded here rather than left
    for T3 to discover mid-task.


