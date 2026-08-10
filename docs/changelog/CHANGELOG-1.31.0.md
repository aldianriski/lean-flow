---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: a MINOR version rotates out of the root CHANGELOG
status: current
---

# lean-flow — Changelog v1.31.0

<!-- Rotated out of root CHANGELOG.md per DOCS_Guide §11 — moved verbatim, never edited. -->

---

## v1.31.0 — Prove the Guards (2026-08-10)

MINOR — SPRINT-057. The night-run protocol told you how to build its guards and never how to prove
one is live. Driven by a **field report from someone running lean-flow on their own project** — the
first outside evidence this protocol has had, on an OS and shell we don't use.

**What changed for you:**
- **Pre-flight now proves the allowlist is in effect, instead of assuming it.** A new probe item
  carries a deliberate **must-deny action**, because without one "every call succeeded" and "the
  allowlist was ignored entirely" produce identical output — and the second is exactly what an
  untrusted workspace does. A three-row table tells you how to read the two results together.
- **Workspace trust: check the key the headless launcher resolves.** Trust is recorded per resolved
  path key, and one directory can have more than one spelling, so the interactive session and the
  launcher can consult different records. The remedy the CLI itself prints — run interactively once
  and accept — **cannot** fix that, because the interactive session lands on the key already trusted.
- **File-tool permission forms are their own surface.** The measured rows were `Bash` only; a
  path-scoped `Write(<abs>/**)` was denied on a real host while the bare tool name matched. Measure
  them before relying on them, and note the trade: the working form is broader than a path fence.
- **DoD commands get executed once before the run fires.** A DoD command asserts a binary exists on
  the host, and when it doesn't, every task fails its gate for a reason unrelated to its work.
- **One output format, end to end.** The trigger now mandates `--output-format stream-json`, and the
  watchdog's stall signal and the cost row follow it. Previously three sections assumed three
  different formats, and `json` buffers until exit — which is how a healthy run once got reported
  dead.
- **The watchdog must be confirmed running.** One that dies at startup guards nothing and looks
  exactly like a healthy one, because silence is what both look like.
- **`gates_signed:` in sprint frontmatter.** An unattended run reads the sprint file and nothing
  else, so a G1/G2 sign-off held only in your session's transcript was invisible to it — the run
  re-ran both gates, couldn't ask, and parked every task. An **absent** field means *not signed*,
  never "assume it was fine".
- **`promote` refuses to freeze a `size: L`.** G1 already split an `L`, but it ran after the Plan was
  committed, so the split cost a scope-change. It's now checked where splitting is still free.
- **Doc line caps distinguish soft from hard.** A `~150 soft` cap in the standard now *reports* when
  exceeded instead of failing the gate, which is what §11 always said it should do; `400 hard` still
  fails. Coverage is unchanged.

**Housekeeping:** L-086 promoted into the pre-flight procedure on its second, independent sighting;
TD-038 deleted (resolved 3 sprints); TD-047 filed (the pre-flight checklist is becoming the doc's
centre of gravity). Gate 126 → 131 checks, with 10 retained fixture cases added.

---

