---
owner: Maintainer
last_updated: 2026-08-16
update_trigger: §9 §10 §11 or §13 of spec/STANDARD.md changes
status: current
id: conformance-inventory-gated-attested
tags: [process, docs]
domain: governance
related: [conformance-inventory-criteria]
---

# Conformance inventory — Gated and Attested sections

SPRINT-072 T3. §9 · §10 · §11 (planning-record evidence) and §13 (git-history evidence), under the
test in `conformance-inventory-criteria.md` plus T2's proposed fourth bucket
**`implementation-directed`** — which this group needs far more than T2's did.

Each rule names **the artifact a tool actually reads**. "The sprint file" is not an answer; the field
or the git object is.

## §9 — Sprint file (10 rules)

| Rule | Level | Mark | Artifact a tool reads |
|---|---|---|---|
| the active sprint is two files — Plan (400 **hard**) + Log (append-only) | Structural | mechanical | both paths exist; `wc -l` on the Plan |
| the Log lives in the `logs/` subdirectory | Structural | mechanical | path shape (load-bearing: the sprint glob is non-recursive) |
| `gates_signed: <GATE>[,<GATE>] @ <sha>` is well-formed | Gated | mechanical | the frontmatter field |
| its **absence means NOT SIGNED** and is never approval | Gated | mechanical | field absent ⇒ negative answer |
| the record lives in the sprint file, not the approving session | Gated | mechanical | same field — a session transcript is unreadable to any tool, which is the point |
| a **malformed** record is reported, never defaulted either way | — | **implementation-directed** | constrains the *reader*, not the repo |
| the Plan is frozen at promote | Gated | **split** — mechanical via git (does the Plan change after `plan_commit`?), judgment as to whether a change was legitimate |
| a scope shift is logged as `scope-change` **before** § Plan is edited | Gated | **split** — the two commits' order is mechanical; "was this a scope shift?" is not |
| a DoD criterion names its check (`*Verify: …*`) where one exists | Gated | mechanical | the clause's presence on the criterion line |
| a criterion naming no check is a **judgment tick** and says so | Gated | judgment-only | — |

## §10 — Continuous learning governance (11 rules)

| Rule | Level | Mark | Artifact |
|---|---|---|---|
| Retro routes four buckets — Shipped→CHANGELOG · debt→`TD-NNN` · follow-ups→`TASK-NNN` · learnings→`L-NNN` | Gated | mechanical | the four target files gained entries in the close commit |
| the retrieval-miss check runs at close | Gated | judgment-only | — |
| promotion at **count ≥ 2** | Gated | mechanical | the `count:` and `promoted:` fields |
| the **placement test** — place a rule where every flow that can hit the failure reads it | Gated | judgment-only | — |
| **every hygiene rule gets a matcher** | — | **implementation-directed** | binds lean-flow's own gate, not an adopter |
| a `Mitigation:` line is a hypothesis, not a plan | Gated | judgment-only | — |
| a number inside a criterion is remembered, not measured | Gated | judgment-only | — |
| **re-derive a stated figure before acting on it** (promote · TD re-review · decompose) | Gated | judgment-only | — |
| tech-debt aging — any `TD-NNN` unaddressed ≥ 3 sprints triggers re-review | Gated | mechanical | `created:` / last re-review vs sprint counter |
| the promote governance checkpoint runs before planning | Gated | **split** — the checklist's presence in the record is mechanical; that it was *honestly* run is not |
| doc-aging has two sources; §11 is only one | — | **data** |

## §11 — Retention (9 ledger rules + 3 statements)

The nine ledger rows share one shape: **trigger → action**, where the action is a move or a deletion.
All nine are **mechanical on the action** (is the file in `archive/`? is the row gone?) and **split on
the trigger** where the trigger is itself judged. Two deserve singling out:

| Rule | Level | Mark | Note |
|---|---|---|---|
| an epic archives only when **every** member sprint is closed **and** all Closed-when are `[x]` | Structural | mechanical | a genuine two-part test; exercised live at SPRINT-071's close |
| a `docs/research/<slug>.md` archives when `superseded` **and** nothing live still cites it | Structural | mechanical | the citation half is a corpus scan, not a field read |
| retention is always **propose → approve**, never silent | Gated | judgment-only | no artifact records that approval was sought |
| "doc-aging is not bounded by this table" | — | **rationale** | |

## §13 — HITL attestation (7 rules)

| Rule | Level | Mark | Artifact |
|---|---|---|---|
| three trailers — `Gate-Signed-By:` · `Gate:` · `Evidence:` — required **together** | Attested | mechanical | `git log --format=%(trailers)` |
| they sit on the **task's own commit**, not a separate approval commit or the merge | Attested | mechanical | which commit carries them |
| `Evidence:` should carry `@ <sha>` | Attested | mechanical | the trailer value's shape |
| the trailer and the sprint-level `gates_signed:` must **agree** | Attested | mechanical | both, compared |
| an **unsigned trailer is a claim, not proof** | Attested | mechanical *on the fact* | `%G?` |
| …therefore a verifier **may not** conclude approval from an unsigned trailer | — | **implementation-directed** | constrains the verifier's inference, not the repo |
| author / committer identity is **not** the attestation | — | **implementation-directed** | forbids a derivation, does not constrain a repo |

## Reconciliation

**Candidate census, re-derived at execution:** §9 **9** (3 rows + 2 bold + 3 bullets + **1 checkbox**,
the checkbox invisible to the promote pattern — Gap A again) · §10 **16** · §11 **13** · §13 **8** =
**46**. The promote figure was 45; the difference is exactly that one checkbox.

**Rules identified: 39** — §9 10 · §10 11 · §11 12 · §13 7 (rules ≠ candidates, per T2).

**Two things that look alike and must not be merged (T3 DoD 3).** A rule marked **judgment-only** is
*not checkable in principle* — no tool will ever decide whether the placement test was applied well,
and that is the standard choosing a human judgement on purpose. A rule marked **mechanical** with no
checker behind it is *uncovered* — a gap someone could close. Only the second is work. Collapsing them
into one "not covered" number would report the standard's deliberate boundaries as debt, which is the
same error D1 rejected the percentage for. **T4 owns the second column; this file owns the first.**

| Mark | count |
|---|---|
| mechanical | 18 |
| judgment-only | 9 |
| split | 5 |
| **implementation-directed** | **6** |
| data / rationale | 2 |

**The finding this group exists to produce: `implementation-directed` is not a rare edge case.** T2
found one instance and proposed the bucket tentatively. Here there are **six** — and they cluster in
exactly the sections a conformance engine would lean on hardest. Three are in §13, the *Attested*
section, and they are the semantically load-bearing ones: *a verifier may not conclude approval from
an unsigned trailer* and *author identity is not the attestation* are rules about **what a tool may
infer**. An engine that ingested §13 as repo rules would either skip them (losing the entire
claim-vs-proof boundary ADR-025 exists to state) or emit them as findings an adopter cannot clear.

**Second finding: Attested is the most mechanical level in the standard.** §13 is 5 mechanical of 7,
against §9's 6-of-10 and §10's 4-of-11. That inverts the intuition that git-history evidence is the
exotic one — it is the *cleanest*, because a trailer is a literal string on a literal object, while
"was the governance checkpoint honestly run?" is unobservable in principle. The hard level to check is
**Gated**, not Attested.
