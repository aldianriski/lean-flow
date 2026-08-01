---
owner: Maintainer
last_updated: 2026-08-01
update_trigger: A new denial shape is observed, or a probe contradicts a finding here
status: current
id: headless-permission-surface
tags: [tooling, process]
domain: governance
related: L-077, L-084, TD-027, TD-028
---

# Research — what actually governs command denial in a headless run?

> **Question.** SPRINT-045 recorded commands denied *after* the same forms had succeeded earlier in the
> session, and a permission rule that never matched. Both were anecdotes with a plausible story
> attached. Which is real?
> **Verdict.** **The rule-form question is answered; the "mid-session degradation" is not supported.**
> A directory-prefix rule genuinely never matches. Denial correlates with **redirects**, not with
> elapsed time or turn count — which makes it an instance of the *existing* form rule (L-077), not a
> new phenomenon.

## Why this matters

TD-027 claimed the permission surface narrows mid-run, which would mean pre-flight allowlist derivation
is necessary but never sufficient — a structural limit on unattended runs. That is a large claim to
build defences on, and it was resting on one run's self-observation. TD-024 was filed twice on
plausible-but-wrong stories before being root-caused; the cost of guessing here is a mitigation shipped
against a mechanism that does not exist.

## Options considered

- **A — mid-session degradation** — the surface narrows with elapsed time, turn count, or a budget.
  *Trade-off:* if true, no static allowlist can protect a long run; the fix is structural.
- **B — form failure** — the denied commands differed in *shape* from the ones that succeeded, and the
  matcher reads the literal invocation (L-077). *Trade-off:* mundane, already-known rule; fix is
  guidance, not architecture.
- **C — rules never loaded** — the permission entries were not in effect at all. *Trade-off:* would
  invalidate every denial reading taken from that session.

## Findings

- **A directory-prefix rule does not match.** With one rule loaded at a time against the identical
  command `sh sub/probe.sh`: `Bash(sh sub/probe.sh:*)` → 0 denials · `Bash(sh:*)` → 0 · `Bash(sh *)` →
  0 · **`Bash(sh sub/:*)` → 1 denial**, reproduced twice. → **answers TD-028**, favours **B**.
- **An untrusted workspace's `permissions.allow` is ignored entirely** — emitted as
  `Ignoring 1 permissions.allow entry from .claude/settings.json: this workspace has not been trusted`.
  A correct, character-exact rule produced a denial purely because the file was never honoured. → **C
  is real as a failure mode**, and it is silent apart from that one line.
- **Degradation did not reproduce.** A single session running a known-good form 25 times in sequence:
  **26 turns, $0.73, 65s, zero denials.** → does not support **A**.
- **The discriminator is the redirect.** Same session, same loaded rules: relative path → 0 denials ·
  **absolute** path → 0 denials · relative **+ `> file`** → 1 denial, reproduced. SPRINT-045's denied
  commands were `git show … > file` and `awk … > /tmp/file`. → **B**, decisively.
- **Two confounds were hit while probing, and both produced readings that looked like findings.** A
  probe workspace was untrusted, so its rules were silently ignored — the resulting denial read as
  "even exact-file rules fail". And `MSYS_NO_PATHCONV=1` stopped `--settings /d/tmp/…` resolving, so a
  session errored before running anything and reported zero denials — which read as success. Both were
  caught only by inspecting the actual output rather than a counter (L-067 / CLAUDE.md trap (d),
  promoted the same day it caught me).

## Recommendation

**Treat TD-027 as not supported and close it without a mitigation.** The observed denials are explained
by redirects — already covered by the bare-invocation rule (L-077) — and by rules that were never
loaded. No structural defence is warranted for a mechanism with no evidence behind it.

**Extend the existing form rule with what is now measured**, since this is the one place the DoD permits
a guidance change: prefer **exact-file** or **bare-command** rule forms; treat a **directory-prefix**
form as non-functional; and add the workspace-trust precondition, because an untrusted workspace makes
every rule in the file inert.

Not promoted to an ADR: nothing here is hard-to-reverse, and there is no real trade-off — a form that
does not match is simply a defect to route around.

## Out of scope / open questions

- **Whether degradation exists at longer horizons.** 26 turns is well short of a real sprint run. This
  establishes that it does not appear *early*, not that it never appears. A future long run that hits
  the same shape should re-open it — but with the redirect explanation excluded first.
- **Why `sh /tmp/pf-045.sh` was denied in SPRINT-045**, given absolute paths probe clean here. The
  logged command was truncated at 80 characters, so its full form is unknown; it may have carried a
  redirect or arguments that are not visible in the record. **Not established.**
- **Probe cost:** ~$4 across 12 sessions, the largest single one being the 26-turn degradation probe at
  $0.73. Recorded so the next investigation of this class can be budgeted rather than guessed.
