# Workflow pack contract

A **workflow pack** is one proven procedure written down so that any capable agent, or a person, can follow it from this file
alone. Nothing needs to be installed, and no particular model or vendor is assumed. A pack is taken by copying its one file.

A pack is a **declaration** with eight fields, in this order. Each field below says what it must contain, then gives the line
a reader ticks when checking a pack against this contract. A pack passes when every line is ticked. A line that cannot be ticked
is a finding that names its field.

The required fields use general terms: *work item*, *artifact*, *requester*, *reviewer*. A pack for a particular domain uses
that domain's words in its own text, but nothing here requires them.

## The eight fields

1. **`purpose`** — the outcome the procedure produces, and the work it is *not* for.
   - [ ] States the outcome in one or two sentences and names at least one kind of work the pack does not cover.

2. **`inputs`** — what must exist before the procedure starts: the work item, the material it acts on, and who can answer
   questions about it.
   - [ ] Lists every input the procedure reads, and says what to do when one is missing.

3. **`procedure`** — the ordered steps. Each step names the action, what it produces, and the role it needs (see *Routing*).
   - [ ] Lists ordered steps, each naming what it produces and its role. A declaration-only skeleton may name its steps and
     their outputs without writing them out; a usable pack writes them out.

4. **`capabilities`** — what the agent must be able to do: read, write, run a command, ask a person. Stated as capabilities,
   never as a product, tool brand or model.
   - [ ] Every capability the steps rely on is listed, and none names a product, vendor or model.

5. **`output contract`** — the artifacts the procedure leaves behind, and the evidence that each is complete.
   - [ ] Lists each output and the observable sign that it is done, specific enough that a second reader could check it.

6. **`verification`** — how the follower confirms the outputs are right, and what counts as a failure.
   - [ ] Names the check, when it runs and what a failure looks like. "Looks correct" is not a check.

7. **`escalation`** — when to stop and ask, and whom: the questions only the requester can answer, and what to do when no one
   can be reached.
   - [ ] Names at least one stop-and-ask point, and what the follower does when no one is available.

8. **`risk policy`** — what the procedure must never do, and the boundaries it works within.
   - [ ] States at least one prohibited action or boundary that a careless follower would plausibly cross.

## Routing — by role, never by model

A pack never names a model or a vendor. Each step in `procedure` instead names the **role** it needs:

- **decision**: judgement under ambiguity or consequence, such as choosing, planning or ruling.
- **execution**: doing work from a clear specification, such as building, drafting or analysing.
- **mechanical-ingest**: high-volume, low-judgement work, such as extracting, formatting or validating.

Whoever runs the pack maps each role to whatever agent or person they have. One pack can run on a strong model for decisions and
a cheap one for mechanical steps, or entirely on one.

## Header

A pack starts with its name, its family, and a **source** line naming the procedure it was extracted from and the version of
that procedure, so a later change can be compared. It also has an **internal use** line naming the real runs that qualified it:
a pack is extracted from a procedure that has actually been used, never invented.
