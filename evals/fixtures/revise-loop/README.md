# revise-loop — retained must-FAIL fixture (SPRINT-065 T3)

Guards the **revise loop** shipped in `skills/orchestrator/references/review-scoping.md` § The revise
loop — the wiring that feeds a scoped reviewer's single worst finding **per axis** back to the builder
for **one bounded retry** (attended modes only). Retained per L-058 (a gate is exercised once on input
that must FAIL, failing with its *named* finding) and TD-012 (fixtures survive the prototype).

`input/` is the material under review, framed as a two-file diff (both files newly added). It carries
one planted violation per axis, and **no "this is a fixture" tells** — the reviewer sees only
`input/` plus the standard brief:

- **Spec** — `SPRINT-940-quiet-index.md` renders against `skills/lean-doc-generator/templates/`
  `SPRINT.md.template` (comparand ladder rung 1) but silently drops two sections the template
  requires (the two after § Execution Log). Expected: **`template-sections-absent`** is the **worst
  Spec finding**.
- **Standards** — the second file's name violates the repo's stated naming convention
  (`CLAUDE.md` § Naming Conventions). Expected: **`naming-convention`** **surfaces as a violation**
  on the Standards axis. Not asserted as the *worst* there: an LLM reviewer legitimately finds other
  Standards angles on a deliberately imperfect doc (both real runs did), and pinning the ranking
  would make the fixture flake on reviewer mood — the contract is that the planted violation is
  *named*, never missed.

Per L-108, no path or slug in `input/` contains either finding token, and the planted sprint doc's
own text never names the sections it omits.

## Exercise recipe (in-session, attended — costs subagent tokens, not run by any script)

**Copy `input/` to a scratch directory first and run every step against the copy** — step 2's builder
renames a file, and doing that in place would strip the retained fixture of its planted violation
(the TD-012 shape, self-inflicted).

1. **Review** — dispatch one scoped `sonnet` reviewer with the standard brief from
   `review-scoping.md` § Scope every pass (diff = the two `input/` files as additions; comparand =
   rung 1, the SPRINT template; report Standards and Spec separately, close with the worst finding
   per axis). **Must-FAIL leg 1:** the two planted violations surface as the named worst finding on
   their respective axes. A pass that misses either is the silent false negative L-058 exists to catch.
2. **Retry (inadequate by script)** — hand both findings to a builder subagent whose brief is
   deliberately partial: *fix the Standards finding only (rename the file); decline the Spec finding
   as out of your remit.* This scripts the "builder does not clear the finding" arm without depending
   on model mood.
3. **Re-review** — same reviewer brief on the revised files. The Spec finding must still be named.
4. **Ceiling** — the coordinator must end the pass here: Spec → `still-open → owner`, Standards →
   `fixed`. **Must-FAIL leg 2:** a second retry, or a report that omits the `still-open` escalation,
   means the ceiling guard failed.

## What the real exercise produced (SPRINT-065 T3, 2026-08-15, in-session `sonnet` dispatches)

- **Leg 1 (detection):** both planted violations surfaced named. Spec: the missing template sections
  were the worst Spec finding. Standards: the filename violation surfaced as a violation — outranked
  in that run by an *accidental* second violation (a parked open question in the status file's own
  text, a real `CLAUDE.md` anti-pattern), which was then removed from the fixture so the retained
  input carries exactly one planted violation per axis. The `plan_commit` placeholder was likewise
  normalized after both runs flagged its fake-sha style as noise.
- **Leg 2 (ceiling):** the scripted-partial builder renamed the file and declined the Spec finding;
  re-review reported naming clean and re-flagged the missing sections as the worst Spec finding. The
  pass ended `Standards: naming-convention → fixed · Spec: template-sections-absent → still-open →
  owner` — one retry total, no second firing.

Full entries: `docs/sprint/logs/SPRINT-065-the-critic-loop.md` (T3, 2026-08-15).
