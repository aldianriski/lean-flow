---
id: ADR-031
tags: [process, tooling]
domain: governance
status: accepted
related: [ADR-028, ADR-024, ADR-027, ADR-023]
---

# ADR-031 — A reasoned doc exemption is declared, not condition-gated

- **Status:** accepted (2026-08-24)
- **Deciders:** Maintainer
- **Context driver:** a repository that had ruled two Base-tier docs unnecessary, with reasons, collected two permanent findings it could never clear — because the ruling lived where the engine could not read it.

## Context

§6 makes every dev repo **Base** by trigger, and Base's *unconditional* doc set includes
`docs/product/requirements.md` and `docs/product/acceptance-criteria.md`. This repository ruled both
unnecessary at SPRINT-054 T1 — what they would hold is owned by `.claude/CONTEXT.md` and
`.claude/CLAUDE.md`, and a third copy would be a second SSOT, which LAW 4 forbids — and recorded the
ruling in `docs/architecture/overview.md`.

The engine does not read that file. So the ruling behaved **exactly as if it had never been taken**:
two `tier-doc-set-incomplete` findings on every run, and a conformance level capped at `none` by a
decision the repository had already made and written down. That is L-151's shape a fifth time — a
decision recorded where its reader cannot reach it — and it is the same failure ADR-028 fixed for the
eleven `scope-out` rules by moving the disposition into the artifact the tool parses.

It is **not** this repository's problem alone (L-015). §2's `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`
exemptions work because the *standard's own* condition (team ≥ 2, or on request) never fires, and the
engine skips them correctly. A **local** reasoned exemption had no such mechanism at all: any adopter
whose requirements live in a ticket tracker, a product wiki or an AI-context file collected two
permanent findings with no declaration available to them.

## Decision

**A repository may declare a per-doc exemption, with a reason, in a root `.conformance-exempt` file.**
One row per line, `<path> -- <reason>`. Three properties make it a ruling rather than a loophole:

- **A reason is mandatory.** A row carrying a bare path fires `exemption-reason-missing` **and the doc
  stays owed** — the finding is added, never replaced. A bare path is the finding switched off, which
  is what the mechanism exists to refuse.
- **Every accepted exemption is named on the report, with its reason.** An exclusion nobody can see is
  indistinguishable from a pass (L-058).
- **The path is matched whole.** `docs/` does not exempt the tree; a blanket exemption is not sayable.

The file joins `.conformance-roles` and `.conformance-tier` as the third **declared** file — the
established class for a fact the standard marks *judged* and only the repository can state. The spec
states the rule (§6); the engine owns the vocabulary that reads it; the README documents it for
adopters. That division is the existing convention, not a new one.

## Alternatives considered

**Condition-gate §6's Base rows** — make `requirements` and `acceptance-criteria` substrate-conditional,
the way `coding-standards` and `testing-guide` already are. Rejected, and the rejection was **measured,
not argued**: seeding this design into a scratch spec and running the engine against a repository that
declares *nothing* makes both findings disappear, and the engine then reports *"no unconditional doc is
owed at Base"* — the entire tier goes vacuous. The check would be dropped for **every** adopter in order
to serve the one that ruled the docs out.

The deeper objection is that the analogy does not hold. Every substrate-conditional row gates on a
**material fact about the repository** — has code · publishes an artifact · has a DB · has auth — which
is why the standard can gate it for everyone. "Has requirements" is not such a fact: every dev repo has
requirements, and the only question is whether they live *here, as a doc*. That is a local judgement
call, and a judgement call belongs in a declaration, not in the standard's table.

**Extend `.conformance-tier` to carry both facts** — one declared file instead of two. Rejected: its
parser reads a single token by `head -1`, deliberately, because a tier is one fact about a repository.
Turning it into a multi-line key/value file would break the contract shipped at SPRINT-078 for any
adopter already using it, to save one file.

**Teach the engine to read `docs/architecture/overview.md`** — where the ruling already lived. Rejected:
it binds the mechanism to one repository's chosen directory names, which is the mistake §3's
exploratory-tree exception avoided by keying on a **declaration rather than a path** (L-015).

## Consequences

**Positive**

- A repository can clear a finding by **deciding**, on the record, instead of by writing a doc it has
  judged unnecessary — and the decision is auditable, because the reason ships beside it.
- The finding survives for repositories that simply have not written the doc. That is the whole point:
  exempting is a statement, and silence is not one.
- An exemption says nothing about what other repositories owe, so nothing here changes the standard's
  general obligation. Removing the declaration restores the finding exactly.

**Negative**

- **The standard now has a sanctioned way to make a finding go away, and nothing checks whether the
  reason is any good.** The engine verifies a reason is *present*, never that it is *sound* — that half
  is judged, and by design. A repository can write `docs/product/requirements.md -- we do not want to`
  and get a clean report. What stops it is review by a human reading the report, which is the same thing
  that stops a bogus `owner:` or a placeholder `update_trigger:`; but this rule is the first one whose
  whole purpose is to *suppress* a finding, so the failure mode is more attractive here than elsewhere.
  Mitigated only by the exemption being printed on every run, in full, with its reason attached.
- **A third declared file is a third thing an adopter must know exists.** The declaration convention now
  spans `.conformance-roles`, `.conformance-tier` and `.conformance-exempt`, none of which the standard
  names — they are documented in the README alone. That division is deliberate and pre-existing, but each
  addition raises the cost of the adopter never finding the page that lists them.
- **Reports get longer by one line per exemption**, and a repository with many exemptions produces a
  report where the exclusions crowd the findings. Accepted deliberately: the alternative is a silent
  exclusion, which is the failure the whole decision exists to prevent (L-058).
- The mechanism is **only as good as the path matching**, and a path is a string. A repository that
  renames a doc silently loses its exemption and the finding returns — correct behaviour, but it will
  read as a regression to whoever meets it.
- **Retained fixtures** guard the family (Tier **G**, ADR-029): the reason-less must-FAIL and its
  still-owed half, a control that reports its own denominator, the whole-path match, the inert-when-
  absent control, and the present-doc case. Each was shown to discriminate by a seeded break that
  reddened it while its siblings stayed green.
