# Council Verdict — machine-state artifacts (execution graph · run-state · run events)

> SPRINT-035 T6 / TASK-111 · 2026-07-30 · base run: 5 advisors + 5 peer reviews + chairman (11 calls).
> Moderator pass: skipped (panel genuinely split — no groupthink risk). Fact-verify: skipped (pure judgment fork).

## Where the Council Agrees

- **The incident doesn't justify the proposal as written.** 4/5 advisors converged independently: the stale-HEAD failure is a missing branching *rule*, not a missing file format. A DAG with only nodes/edges/waves would not have prevented it. Any adoption of (a) that doesn't carry a per-task base-ref validated against live HEAD is theater.
- **(a) has an independent, legitimate job.** 4/5: cycle detection and shared-file single-owner checks are exactly what prose is bad at and code is good at; disposable/gitignored/compiled-from-markdown makes it a lockfile, not hidden state. The strongest case for (a) is *not* the incident.
- **(b) and (c) have no fired trigger.** Three advisors independently invoked the council-2 precedent (no derived machine views without a firing trigger). No night run has ever died needing idempotent resume; no stuck agent has escaped the Execution Log. "Actually used" is not met by imagination.
- **Second-source-of-truth is the live danger.** (b) is the only artifact proposing to be the thing you resume *from* rather than a derivation — the exact trap the system's identity forbids.

## Where the Council Clashes

- **(c): reject vs adopt-as-exhaust.** Reject camp: the Execution Log *is* the event log; JSONL duplicates it — council-2 replaying verbatim. Adopt camp (incl. the naive Outsider, who lacked the precedent): cheap, competes with nothing, first empirical dataset on lean-flow itself. Informed of council-2, the Outsider's own axis ("derived view, no firing trigger") points reject.
- **(b): defer vs reject.** Contrarian: reject outright — defer is a euphemism when the log already recovers runs. Majority: defer, with the Outsider supplying the graduation condition (run-state = cache of the log; log always wins). Peer review exposed the real gap: whether "defer with conditions" ever actually re-fires.
- **Scale ambition.** Expansionist alone argued from a future lean-flow (multi-day runs, fleets); all 5 reviews named this the biggest blind spot. But its question — is ambition capped at fixing one bad merge? — is a legitimate user-owned unknown.

## Blind Spots the Council Caught

- **No kill-switch for DEFER items:** without a written promotion trigger *and* expiry, "defer until X" quietly becomes "never" — or "adopted" by accretion.
- **Mid-run staleness:** the DAG is validated pre-dispatch only; HEAD moves between waves — the exact incident can recur in wave 2 with a *validated* DAG.
- **The cheaper rung was never tested:** could cycle/single-owner/base-ref checks be a bash/prose preflight with *no JSON at all*? Nobody verified markdown+script can't already do this (laziness ladder).
- **Unresolved decision-critical questions:** does the proposed DAG schema record base-commit per task? (never established — (a)'s conditional adopt hinges on it) · who validates a malformed model-written JSON before the next step trusts it? (currently nobody) · real appetite for scale? (only the owner can answer).

## The Recommendation

**(a) ADOPT, with three hard conditions.** (1) Schema MUST carry per-task/per-wave `base_ref`, validated against live HEAD at dispatch *and re-validated at each wave boundary*. (2) Stays disposable: compiled from the frozen sprint plan, gitignored, regenerated every run, never source of truth; malformed/missing → visibly halt and re-compile from markdown, never silently proceed. (3) Built as one step in the existing dispatch skill (compile → validate → spawn); only checks that would have caught real incidents. Ship the one-line branching rule in prose *regardless* — the rule is the cure; the DAG is the enforcement.

**(b) DEFER, with a written graduation contract.** Trigger: one real unattended run the Execution Log + handoff could not cleanly resume. Precondition: the reconciliation rule written first — *run-state is a cache of the Execution Log; the log always wins; rebuildable from the log alone.* Expiry: trigger unfired within 5 sprints → close as REJECTED, note in LEARNINGS.

**(c) REJECT.** Council-2's rejection replaying: derived machine view, no firing trigger, no first consumer. Revisit-if: a real consumer (insights/retro) concretely asks for task-class timing data on two separate occasions — re-enters with a named consumer, not as exhaust.

**Before building (a)'s JSON:** one hour on the cheaper rung — a bash/prose preflight doing cycles + single-owner + base-ref-vs-HEAD directly from the markdown plan. If it works reliably, the JSON is optional serialization, not architecture; adopt the *check*, keep the format decision honest.

## Pre-Mortem

1. **The DAG grew into (b) by drift** — `status`, then `attempts`, then a resume path read it after a crash; nothing governed (a) because the reconciliation rule was written for the never-built (b). Second source of truth by accretion.
2. **Wave-boundary re-validation never wired** — pre-dispatch check shipped, mid-run re-check stayed "phase 2"; a three-wave night run hit the stale-base incident in wave 3 with a "we fixed this" postmortem (L-020's half-shipped-wiring trap).
3. **Model-written JSON with no validator** — the model emitted a fused edge list, dispatch trusted it: *machine-confident* wrong wave order, strictly worse than prose a human would have eyeballed.

## Confidence & Dissent

**High on (a) and (c); medium on (b).** (a): five adopt-leaning verdicts with independently convergent conditions. (c): rests on a precedent the system already ratified. (b): the council genuinely spanned reject→defer→adopt, and defer's value depends on kill-switch discipline peer review showed nobody instinctively applies. Sole full dissent: Expansionist (adopt all) — named the blind spot by all five reviews, but its unanswered scale-appetite question is the one input that would legitimately reopen (b).

## The One Thing to Do First

Add the branching rule to the dispatch step — *"every worktree branches from the current wave's declared base commit, verified against live HEAD at spawn; mismatch halts dispatch"* — and trace it once against this session's incident. Root-cause fix, one line, and it defines exactly what the DAG's `base_ref` field must enforce before a byte of JSON is written.

> **Ceiling:** 5 personas on one model — reduces framing blind spots, not shared knowledge gaps. All five may share the same wrong belief about git worktree semantics or the proposed schema's contents (nobody verified it). Unanimity on (a) is a strong hypothesis to check against the actual spec, not independent confirmation.
