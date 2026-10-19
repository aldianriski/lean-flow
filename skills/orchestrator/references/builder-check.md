# Builder check — a fresh reader at G2

Loaded by `/orchestrator` at the G2 design gate, before sign-off. Goal: catch a defect in *what to build* while it is still
a sentence. The usual failure is a design that has drifted from the frozen Done-when it claims to satisfy. Caught after
the build, it costs a builder retry and a re-review. The author cannot see that drift, because they read the design as
what they meant. A reader who cannot ask the author has only the text.

## Procedure

1. **One reader per task design**, each a fresh sub-agent with no session context, on the `execution` tier
   (`dispatch.md`). In sprint-bulk, spawn every reader in one message so they run in parallel.
2. **Hand it three things:** the design text for that task (sprint-bulk: the coordinator's G2 design for that `Tn`;
   mvp: the drafted design), the task's frozen `## Done when` read from its own file, and the paths of the code or text
   the design touches. Write them to one file and point the reader at it with the prompt below.
3. **Settle the report before the G2 popup.** You answer the **factual** questions yourself by reading the repo or the
   records; facts are never the owner's job. You settle a **contradiction** before sign-off. Either fix the design, or,
   when the Done-when itself is wrong, log a `scope-change` and get a recorded owner ruling: this is the SKILL.md red flag
   *quietly reinterpreting a DoD*, met before the build instead of after it. Only **intent** questions reach the owner,
   inside the G2 popup.
4. **Record one line per task.** Sprint-bulk puts it in the Execution Log; mvp, which has no log, puts it in the task's
   `## Approved design` paragraph:
   `builder-check · Tn · <c> contradictions · <q> questions · <how settled>`.
   A G2 without its lines counts as unsigned. A pre-signed G2 (an overnight run) is checked for them at pre-flight.

"Nothing important left" is a result, not a skipped step: record it the same way.

## The reader prompt

```text
You are a talented engineer. You have been handed a design and asked to build what it describes. You will not be able to
talk to the person who wrote it, and nobody will answer questions once you start.

Read the design file named below. It contains the design, the task's frozen **Done when** (the acceptance criteria the
work is judged against — they cannot change without the owner's ruling), and the paths of the files or text it touches.
You may read those touched files, read-only, to check the design against them. Open nothing else.

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
