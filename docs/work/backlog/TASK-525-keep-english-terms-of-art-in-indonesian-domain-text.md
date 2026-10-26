---
id: TASK-525
title: "Keep English terms of art in Indonesian domain text, and scope the Keep Indonesian list to general vocabulary"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: needs-info
depends-on: []
---

# TASK-525 — Keep English terms of art in Indonesian domain text

## Why
A real writing job (a formal Indonesian hardware-request memo on server and storage sizing) needed three owner
corrections after the humanizer pass. The pass wrote plain Indonesian for infra terms of art ("pengguna aktif
bersamaan", "serah terima", "penalti tulis", "ruang kosong", "toleransi drive rusak"), which the owner called
non-standard. These are ordinary Indonesian words, not KBBI coinages, so the term policy's "Keep the English term" table
cannot catch them, and the "Keep Indonesian" list pushed the pass toward over-translating. Owner rulings at intake: a
rule plus the five rows as examples, in a subsection of its own; the fixture is a sanitized excerpt of the memo.

## Done when
- [ ] `patterns-id.md` § Term policy gains a "Domain terms of art" subsection: in domain or technical text, a spec
      name, column header or capacity term that is an English term of art stays English even when a plain Indonesian
      phrase exists; the tell is a word-by-word translation of a spec name. The five rows (concurrent · acceptance test ·
      write penalty · free space · fault tolerance) are its examples, each with the Indonesian form it replaces.
- [ ] "Keep Indonesian (common and natural)" states it covers general vocabulary, not domain terms of art.
- [ ] A sanitized excerpt of the memo is retained under `evals/fixtures/humanizer/` with its expected terms and a fact
      list that already counts each open item of its to-do list as a fact (owner-reviewed before commit); the 2.17.0
      baseline shows the failure on it (L-255).
- [ ] Three embedded runs on the fixture after the change keep every term of art in English, translate none of the
      general vocabulary back, and keep every fact, judged by a reader that did not write the brief (L-252, L-259).
- [ ] CHANGELOG `[Unreleased]` line.

## Touches
`skills/humanizer/references/patterns-id.md` · `evals/fixtures/humanizer/<new fixture>/` · CHANGELOG.md

## Assumes
- **open:** the memo excerpt with its original, pre-correction text, from the BNPT session or the owner. `/triage`
  readies this task once it is received; the owner's review of the sanitized version is box 3's own step, and client
  content never lands unsanitized.
- The term-of-art rule applies to domain or technical text (sizing, infra, specs); general prose keeps the "Keep
  Indonesian" words, and the existing KBBI table is unchanged.
- Per L-255 the 2.17.0 baseline must reproduce the owner's corrections on the sample, or the sample is strengthened
  before the fix is judged.

## Tracker
Peer session feedback from a BNPT memo, items 1 and 2 (2026-10-26); intake draft Codex-reviewed, R2 CLEAR.
