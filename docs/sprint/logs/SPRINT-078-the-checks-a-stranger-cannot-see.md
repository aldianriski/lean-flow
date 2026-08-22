---
sprint: 078
slug: the-checks-a-stranger-cannot-see
owner: Maintainer
last_updated: 2026-08-22
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-078 — Execution Log

> Append-only companion to [`../SPRINT-078-the-checks-a-stranger-cannot-see.md`](../SPRINT-078-the-checks-a-stranger-cannot-see.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-22 | scope-change | three DoD verify-methods were unsatisfiable as frozen; corrected, substance unchanged

**What broke.** A1 instructed the run to re-derive the register's counts rather than copy them, and
doing so at G1 surfaced that two different numbers had been conflated at promote. The register's
**19 covered** counts rules covered by *any* checker; the engine's own `coverage:` line counts only
rules with an assertion **in the engine**, and reads **13**. The 6-rule difference is exactly the four
standalone checkers — `check-doc-caps.sh` (`S2.F-CAP` · `S7.MEGA` · `S7.SPRINT400`) ·
`check-ephemeral-intake.sh` (`S2.R-TEMPDIR`) · `check-epic-archive.sh` (`S11.EPIC`) ·
`check-research-archive.sh` (`S11.RESEARCH`). Cross-checked two ways before acting: 13 `assert_*`
functions are defined in the engine, and the engine's own two counts reconcile as 13 + 49 GAP = 62.

Three criteria attributed the register's figures to the engine's line, and one asked for an
impossible comparison:

| Where | Frozen text | Why it cannot be met |
|---|---|---|
| T2 DoD 1 | *coverage line moves 24 → 29* | the line reads 13 today, 18 after T1 |
| T3 DoD 1 | *coverage line moves 29 → 30* | same conflation, one task later |
| T1 DoD 2 | *`diff` of both tools' output returns empty* | the engine emits 62 rules' lines to `check-attestation.sh`'s 5, and pads ids to 20 chars against its 18 — the two outputs can never be equal |

**Impact.** Substance and the register-side arithmetic are untouched: covered still moves
19 → 24 → 29 → 30 of 62, which is what § Theme promised. Only the *verification methods* change:

- T1 DoD 2 → the §13 **finding text** is byte-identical, established by diffing the text portion of
  both tools' §13 lines — diffed, never eyeballed. The claim D2 makes is about findings, not padding.
- T2 DoD 1 → the engine's `coverage:` line moves **18 → 23**.
- T3 DoD 1 → the engine's `coverage:` line moves **23 → 24**.
- T1 DoD 6 is unchanged and was already correct — the register does reconcile to 24 / 27 / 11 = 62.

Owner also ruled the register's own header sentence in scope: *"19 + 32 + 11 = 62, which is what
`conformance.sh` reports"* reads as if 19 were the reported figure. 62 is. Corrected there too, so the
next reader cannot re-derive this sprint's mistake from the register.

**This is L-130's third grain, caught by its own guard.** A1 was written *because* SPRINT-071 and
SPRINT-074 froze a query result into a Plan; it fired here exactly as intended, at the moment of
execution rather than at close.

**Re-confirm G2.** Re-signed with the correction folded in. Nothing in D1 · D2 · D3 moves.

### 2026-08-22 | scope-change | A4 does not hold — T2's acceptance rested on two decisions G2 had not taken

**What broke.** A4 asserted that no criterion in the Plan rests on a decision G2 has yet to take.
Reading §6 against §2 at the gate found two that do, both inside T2.

**(a) Tier detection is judged, and the engine is already on record refusing to guess it.** All four
§6 rules are marked `split — detection judged`, and `assert_S2_F_FILE`'s own comment rules that
requiring a tier-gated row *"would be this engine guessing a tier the standard explicitly declines to
infer, and telling a four-file JS library it owes `docs/database/erd.md`"*. T2's acceptance — *a repo
at any one of the four tiers* — presumes a tier the engine may not infer. Only **Base** escapes: §6's
trigger for it is *every dev repo*, so it is owed unconditionally.

*Ruling:* a repo **declares** its tier in `.conformance-tier`, mirroring the `.conformance-roles`
precedent this same engine already ships for §1's role vocabulary. Undeclared, Base is still checked
and the other three report *not evaluated — detection is judged (§6)*. One new consumer-facing
surface, documented in the register (L-015).

**(b) `S6.MULTISVC` has no §2 rows to reduce to.** §6 says every tier's satisfaction half *"reduces to
`S2.F-FILE`"*, but the three docs it names for multi-service — service registry · cross-service
dependency map · global decisions index — have **no row anywhere in §2's tables**. Verified two ways:
a case-insensitive sweep of §2 for all four names returns nothing, and enumerating the distinct values
of §2's Tier column yields `base · backend/integration · backend, or overview cap-split · medium+ ·
API exists · auth exists · DB exists · lean loop · as needed · ephemeral` — no multi-service value
exists. Deriving the required set therefore yields the **empty set**, and an empty required set passes
every repository — the precise false negative `assert_S2_F_FILE`'s own guard was written to refuse
(L-058).

*Ruling:* `S6.MULTISVC` fires a distinct `tier-doc-set-underivable`, naming the spec gap where a
reader meets it, rather than folding into `tier-doc-set-incomplete` (a missing file and a hole in the
standard are not the same finding) and rather than being re-dispositioned `scope-out` mid-sprint
(which would move three of the register's counts). The §2 gap is filed as a follow-up at close.

**Impact.** T2's DoD is unchanged in count and in finding name; what changes is that
`tier-doc-set-incomplete` is now specified against a *declared* tier, and a fifth outcome
(`tier-doc-set-underivable`) exists for the tier §2 cannot describe. Coverage arithmetic is untouched.

**Re-confirm G2.** Both rulings signed off at the batch gate before T1 began. A4 is recorded here as
**not held** rather than quietly re-read — which is what L-111 asks of a criterion that turns out to
rest on an undecided fork.

### 2026-08-22 | progress | T1 complete — §13's five rules are reachable from the consumer entry point

**Acceptance, on a repository that never installed lean-flow.** A throwaway git repo (two files, one
commit carrying `Gate: G1,G2` and nothing else) run through `sh conformance.sh <dir>`: all five §13
rules named, `attestation-trailers-incomplete` fired for the two missing trailers, and
`attestation-unsigned-claim-only` reported. Before this task that repo's report contained no §13 line
at all, because `conformance.sh` execs the engine and the engine had never heard of §13.

**Four things execution found that the Plan could not have.**

**(a) The engine's level ladder only demotes on FAILs, so the migration needed a fourth verdict class.**
`attestation-unsigned-claim-only` must not fail — §13c calls it a level honestly reached. The deleted
checker could say so because it published its own §13-scoped `level:` line; this engine publishes one
ladder for the whole sweep. Carrying the finding across as a plain `note` would therefore have printed
`level: Attested` over an attestation nobody signed — same finding text, same exit code, opposite
headline. Hence `hold`: prevents a level, never fails, never touches the exit code. Three rungs added
(`struct_hold` · `gated_hold` · `attested_hold`), ordered after the failure rungs.

**(b) `--rev`.** The deleted checker took a commit-ish; the engine took a repo-dir only. Migrating
without it would have quietly cost an adopter the ability to attest any commit but HEAD, and would
have forced the retained fixtures off the exact commits they were built around. Default `HEAD`; rules
that read the working tree ignore it.

**(c) Two fixture expectations changed, and DoD 4's *"pass unchanged"* is ticked with that qualified.**
The fixture *repos* and the five finding names they assert are untouched. Two harness assertions moved,
both because the engine's ruling supersedes the checker's:
- `unsigned-level-line-says-gated` asserted the literal `level: Gated (not Attested)`. The engine
  phrases the same claim through the hold rung. The claim was re-asserted, not dropped — plus a new
  `unsigned-hold-is-not-a-failure` case, so the suite grew 16 → 17 assertions.
- `rule-unimplemented` expected exit 1. The engine rules a gap a statement about *itself*, entering
  neither level nor exit code (SPRINT-075 T3, after a stranger's repo came back with 58 FAIL lines of
  which 56 were our own missing assertions). The case now asserts exit 0 **and** a `GAP` line naming
  the rule — strictly more specific than what it replaced.

**(d) `TECH-DEBT.md` and three docs joined T1's `Layers:` (L-100).** `docs/QA.md` described a file
about to stop existing; `evals/run-spec-reader-fixtures.sh` named it as this reader's consumer;
TD-065 was the standing record of the very divergence DoD 6 closes. Declared, not smuggled.

**The suite's first green run was not trusted.** Seeding the rejected design — `hold` reverted to
`note` — reddened exactly `unsigned-level-line-says-gated`, `unsigned-hold-is-not-a-failure` and
`unsigned-never-attested`, while 14 sibling controls stayed green; `unsigned-reports-gated` correctly
held, since the finding *string* survives the downgrade and only the *level claim* does not. Guards
run before the verdict was read: seed landed (`cmp`), still parsed (`sh -n`), targeted (line count
identical, 18 assertions before and after, 2 changed lines), and the engine restored under a checked
`sha256` (`fb6524c6…`).

### 2026-08-22 | surprise | this sprint's `Layers:` declared nothing, and it failed green

`check-layers-observed.sh` reads declared tokens with `grep -oE '` + "`" + `[^` + "`" + `]+` + "`" + `'` — **backtick-quoted only**. All three of
SPRINT-078's `Layers:` lines were promoted without backticks, so the union of declared tokens was
**empty** and every file this task touched, including the five the Plan explicitly named, reported as
`changed but undeclared`. SPRINT-077's lines are backticked; the shape is right there in the archive.

It failed green until the first file changed, which is the whole shape of the thing: between promote
and the first edit there is nothing to compare, so a declaration guarding zero files is
indistinguishable from one guarding everything. Fixed by backticking all three (a `Layers:` correction
is a live declaration, not a Plan amendment — L-100). **Learning candidate:** a `Layers:` line is
consumed by a checker with a parse, so promote should render it in the form that checker reads — or
the checker should report an unreadable declaration as a named finding rather than as an empty set,
which is L-058 applied to its own input.
