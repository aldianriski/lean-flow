A fixed input for judging the embedded humanizer pass over several runs (L-252), retained so a later change to
`skills/humanizer/references/embedded.md` can be measured on the same text (TD-274, TASK-511). It is not a gate leg:
nothing in qa-check runs it, because each run is a model call.

- `sample.md`: about 140 words with seeded tells (bold labels, three bold-label list items, significance inflation, em
  dashes, a "not just X" contrast, a triad, two closers) and eleven facts, including a range, a hedged number, a scope
  and an audience, the kinds SPRINT-140's runs lost. Each fact sits inside dressing the pass is tempted to cut: a first
  version with the facts in plain sentences lost nothing in 3 of 3 pre-fix runs, so it could not tell a fix from no fix
  (SPRINT-142, owner ruling R1).
- `facts.md`: the eleven facts, what counts as dressing, and what counts as an added claim.

Run: one separate headless process per run, in a trusted folder outside this repo (L-249), with the plugin directory
pinned to the commit under test: `claude -p --setting-sources local --plugin-dir <dir> --add-dir <dir>
--output-format stream-json --verbose < /dev/null`, where `<dir>` is an export of that commit (`git archive <sha> skills
.claude-plugin`), never the live checkout: the child reads `embedded.md` itself, so a live edit leaks into the run. The prompt is the embedded child brief assembled from `embedded.md` § Child path, items verbatim, with
`sample.md` as the text, the text itself as the voice sample, and format `markdown`.

Judge each run from its own transcript (L-248): its final result only for the text, never a tool result. For each fact,
kept or dropped; then any added claim. A run passes only with all eleven kept and nothing added. The returned final must
carry no fact list.

Recorded runs (SPRINT-142 T2): the baseline brief is `embedded.md` at `07f10d29` (before the fact list step); the
after brief is `embedded.md` at the commit that adds this fixture.
