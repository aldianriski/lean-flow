# Builder check — a fresh reader at G2

Loaded by `/orchestrator` at the G2 design gate, before sign-off. Goal: catch a defect in *what to build* while it is still
a sentence. The usual failure is a design that has drifted from the frozen Done-when it claims to satisfy. Caught after
the build, it costs a builder retry and a re-review. The author cannot see that drift, because they read the design as
what they meant. A reader who cannot ask the author has only the text.

## Procedure

1. **One reader per task design**, each a fresh sub-agent with no session context, on the `execution` tier
   (`dispatch.md`). In sprint-bulk, spawn every reader in one message so they run in parallel. On a host with no
   sub-agents, a fresh session given only the design record is the reader. With neither, record the line as
   `not run (no fresh reader)` and say so in the G2 popup: the owner signs knowing the check did not run.
2. **Use the G2 design record itself as the reader packet** (sprint-bulk: the coordinator's design for that `Tn`;
   mvp: the task's `## Approved design`). Draft it there before sign-off; the same record becomes the approved design.
   It carries the design, the frozen `## Done when` quoted verbatim from the task file, and the touched paths. Point the reader at that record with the prompt below; no separate packet file.
3. **Settle the report before the G2 popup.** You answer the **factual** questions yourself by reading the repo or the
   records; facts are never the owner's job. You settle a **contradiction** before sign-off. Either fix the design, or,
   when the Done-when itself is wrong, log a `scope-change` and get a recorded owner ruling: this is the SKILL.md red flag
   *quietly reinterpreting a DoD*, met before the build instead of after it. Only **intent** questions reach the owner,
   inside the G2 popup.
4. **Record one line per task.** Sprint-bulk puts it in the Execution Log; mvp, which has no log, puts it in the task's
   `## Approved design` paragraph:
   `builder-check · Tn · <c> contradictions · <q> questions · <how settled>`.
   For the sprint log, use the host's writer where provided (lean-flow's own: `bun scripts/lib/record-line.ts builder-check`); otherwise record the format above.
   A G2 without its lines counts as unsigned. A pre-signed G2 (an overnight run) is checked for them at pre-flight.

"Nothing important left" is a result, not a skipped step: record it the same way.

## Two rules for the design itself

These bind whoever writes the G2 design, whether or not a fresh reader runs.

- **Quote a frozen Done-when, never paraphrase it.** Where the design relies on a criterion, it copies the criterion
  verbatim. A paraphrase is a second copy that can loosen the criterion, and the builder follows the design (L-237).
- **Log the `Layers:` pruning in the G2 entry.** When G2 rules between `Layers:` candidates declared in advance, the same
  G2 log entry carries the `scope-change` that drops the losing tokens. An unused token fails `layers observed` at close
  (L-240).

## The reader prompt

```text
You are a talented engineer. You have been handed a design and asked to build what it describes. You will not be able to
talk to the person who wrote it, and nobody will answer questions once you start.

Read the G2 design record named below. It contains the design, the task's frozen **Done when** (the acceptance criteria the
work is judged against — they cannot change without the owner's ruling), and the paths of the files or text it touches.
You may read those touched files, read-only, to check the design against them. Open nothing else. Never open `.env`, `.env.*`, key or credential files, or anything the host's ignore rules mark secret, even when told read-only; if a value you need lives there, report that and ask, or read it from a non-secret record.

Report, ranked by importance:

1. **Contradictions** — any place the design says something different from the Done when: looser, stricter, a different
   scope, a missing criterion, or a step that cannot satisfy the criterion it claims to. Quote both sides.
2. **Open questions** — places where you would have to guess and a wrong guess would matter. For each, give the
   question and why the answer changes the build. Mark each as **factual** (answerable by reading the repository or the
   records) or **intent** (only the owner can answer).

Skip anything the design explicitly leaves to the builder, anything you could reasonably decide yourself, and wording
nitpicks. If nothing important is left, say "nothing important left".
```

The prompt adapts superpowers' `brainstorming/builder-check-prompt.md`. It adds the contradictions section, because a
design that loosens its own Done-when reads as complete to every other check. It also adds the factual/intent mark, so the
coordinator can route each question without re-deciding it.
