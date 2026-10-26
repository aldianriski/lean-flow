# Customer-review demo

> **Use when** the question is "will a customer understand and want this?" — not "does the logic feel right?"
> (`logic.md`) and not "what should this look like?" (`ui.md`). The demo exists to be shown to real target users,
> watched, and then retired. It answers its question only through a recorded session.

## Write the contract first

Before any code, write these at the top of the demo's `NOTES.md`. Each is a decision; leave a field marked
*undecided* rather than guessing it. An undecided field blocks the build: ask it now, or record the demo as blocked
with that question as its unblock condition. Never build past it.

- **Audience** — who will sit in front of it (role, not name) and the job they come to do.
- **Proof goal** — the one thing the session must show: that they finish the job, understand a term, choose a path.
- **Interaction depth** — *visual-only* (screens and planned controls) or *deterministic simulation* (controls work
  against fixed fixtures). A demo never needs a functioning backend.
- **State and reset** — seeded fixtures held in memory, a one-step reset to the starting state, and the same state
  after a reload. Nothing persists between sessions.
- **Integration boundary** — *none* or *simulated*, with every allowed side effect named. A simulated action never
  sends, charges, books or commands anything real.
- **Identity** — any role switcher is a demo device, not authentication; say so on screen.

## Exceptions to the shared rules

The demo keeps rules 1, 2 and 6 as written and departs from three, because a customer sees it:

- **Rule 3 (no persistence)** — state still lives in memory, but it is *seeded* and *resettable* (above), so every
  session starts from the same place.
- **Rule 4 (skip the polish)** — content is believable and every label reads as the product would; still no tests,
  no abstractions, no real error handling beyond what the tasks touch.
- **Rule 5 (surface the state)** — the full state goes in a presenter panel the facilitator can open, never on the
  customer's screen, where it would answer the questions the session is asking.

## Honest claims

- Label every simulated action where the customer meets it ("simulated — nothing was sent").
- Mark fixtures as sample data. Never present invented customers, testimonials, statistics, savings or live data as
  real; a factual value with no real source shows `[REAL DATA]` or stays empty, as in `ui.md`.
- Name the limits in the script: what is simulated, what is out of scope, what the demo does not prove.

## The task script

Write it before the session, beside the contract:

1. **Starting state** — what is on screen and which fixtures are loaded when the participant sits down.
2. **Three to five tasks**, each phrased as the participant's goal, never as instructions ("You need to …", not
   "Click …").
3. **Expected observable outcome** per task — what the facilitator should see happen if the design works.
4. **Non-leading questions** for after each task ("What did you expect there?"), none that suggest the answer.
5. **What to capture** — where they hesitated, errors, whether they finished, and any workaround they invented.

## Claims ladder

- **Ready for walkthrough** — the contract, the demo and the task script exist. Nothing has been observed yet.
- **Validated** — only after a recorded session with real target users, and only for the tasks observed. A session
  with the owner or the team keeps it at *ready for walkthrough*. A model's critique of the demo is never customer
  evidence.

## Lifecycle

Build the demo on its own throwaway branch from the start, so it never sits on the working branch while it waits for
its session. After the recorded session, capture the observations (SKILL.md § Capture the answer), leave a pointer to
the branch beside them, and retire the demo. A design the session changed goes back through the plan, never by
promoting the demo's code.
