---
sprint: 965
slug: drift-prose-mention
owner: Maintainer
last_updated: 2026-08-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-965 — Execution Log

<!-- CONTROL: must stay PASS (nothing to verify) even after T4 revise's normalisation
     (SPRINT-086 T4 revise, L-108). The paragraph below embeds the schema string, spelled with the
     exact same drift the new fixtures exercise (a double space, capitalised field names), inside an
     ordinary sentence rather than as its own line. Normalising leading/trailing whitespace and
     field-name case must NOT turn a sentence that merely mentions the schema into a match -- the
     line as a whole still has to equal the canonical form, and this sentence has words before and
     after the schema fragment that survive collapsing. If this ever starts failing, the anchor has
     been loosened into a substring match and TD-085's original defect (matching prose about a
     classification, not the classification itself) is back. -->

### 2026-08-25 | progress | T1 — documented the consequence-line schema

Updated review-scoping.md to describe the carrier format: a task records its consequence ·  Tn ·
Behaviour:low · Governance:high style line once per classification decision, never mid-sentence. This
paragraph is discussing the format, not recording one -- no task here is actually classified, and no
review line was ever needed.
