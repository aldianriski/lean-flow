A fixed input for judging the embedded humanizer pass on Indonesian domain text over several runs (L-252), retained so a
later change to `skills/humanizer/references/patterns-id.md` or `patterns-lf.md` can be measured on the same text
(TASK-525, TASK-526). It is not a gate leg: nothing in qa-check runs it, because each run is a model call.

- `sample.md`: a synthetic formal request memo (about 180 words, invented organisation and numbers, no client text) built
  from four corrections an owner made to a real humanizer pass on an Indonesian hardware request. Two terms of art are
  already English ("concurrent user", "write penalty") and three are written as the word-by-word Indonesian forms the
  owner corrected ("ruang kosong", "toleransi drive rusak", "serah terima" for the test). It also carries the TASK-526
  material: a "Yang perlu diputuskan" checkbox list of three open items, the hedges "di atas kertas" and "tetap harus
  dibuktikan dengan uji", and two label-first fragments.
- `facts.md`: the fifteen facts (each open item counted as one), the expected terms, what counts as dressing, and what
  counts as an added claim.

Run: one separate headless process per run, in a trusted folder outside this repo (L-249), with the plugin directory
pinned to an export of the commit under test (`git archive <sha> skills .claude-plugin`, never the live checkout, L-254):
`claude -p --setting-sources local --plugin-dir <dir> --add-dir <dir> --output-format stream-json --verbose < /dev/null`.
A document takes the embedded child path, so the prompt is `embedded.md` § Child path items 1 to 7, verbatim, then the
inputs: format `markdown`, the text itself as the voice sample, and `sample.md` inline as the text.

Judge each run from its own transcript's final result (L-248), by a reader that did not write the brief (L-259): per
run, each expected term of art in English, any listed general word anglicized, each fact kept, anything added.

Recorded runs (SPRINT-145 T1): baseline at `81a8ef87` (the 2.17.0 release; the three pattern catalogs are byte-identical
to SPRINT-145's `plan_commit`), three runs; all three kept "ruang kosong" and "serah terima" and wrote the fault
tolerance as Indonesian, so 3 of 5 terms of art were not English in 3 of 3 runs (the failure shows, L-255). After-change
at `86dbebd6`, three valid runs: 5 of 5 terms in English, no general word anglicized, all fifteen facts kept and nothing
added in 3 of 3. A fresh judge scored all six finals blind (labels shuffled): baseline 0 of 3 pass, after 3 of 3. One
after-run was discarded unjudged and re-run: its Skill call failed, it searched for the catalogs and read the baseline
export, which sat under the same `--add-dir`. Keep each export in a folder of its own.

Recorded runs (SPRINT-145 T2, TASK-526): judged by a fresh judge on the open items (recast, none dropped or decided),
the facts, the fragments, the hedging wording and the terms. At `5414fc86`, three runs: every open item recast as a
request to the recipient with a formal close, all fifteen facts kept, fragments gone, terms English in 3 of 3; two runs
swapped "di atas kertas" for "menurut perhitungan", so 1 of 3 passed. The one builder retry at `609cd9c9` named those
paraphrases in ID-18; three fresh runs passed 2 of 3 by the judge, the first writing "Menurut hitungan kami kapasitas
ini cukup". Owner ruling: "by our calculation" states the claim's basis, the real uncertainty the criterion keeps, not
a hedge, so that run passes and the retry set is 3 of 3; the judge's stricter reading is kept here as the record.
