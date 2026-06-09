# Logic prototype (stack-agnostic)

A tiny interactive terminal app that lets the user drive a state model by hand. Use when the question
is about **business logic, state transitions, data shape, or API surface** — the kind of thing that
looks fine on paper but only feels wrong once you push it through real cases ("does this state machine
handle X then Y?", "can this model even represent the case where…?").

If the question is "what should this look like" → wrong branch, use `ui.md`.

## Process

1. **State the question** — one paragraph at the top of the file / `NOTES.md`: the state model and what you're checking.
2. **Pick the language** — whatever the host project uses; don't add a new runtime or package manager just for the prototype. No obvious runtime (e.g. a docs repo) → ask.
3. **Isolate the logic in a portable pure module** — this is the part worth keeping. Put the logic answering the question behind a small, pure interface that could be lifted into the real codebase later:
   - a **pure reducer** `(state, action) => state` — discrete events, single state value;
   - an explicit **state machine** — when "which actions are legal right now" is part of the question;
   - a set of **pure functions** over a plain data type — no implicit current state, just transformations;
   - a **module with a clear method surface** — when the logic genuinely owns ongoing internal state.
   Keep it pure: no I/O, no terminal code, no `console.log` for control flow. The TUI imports it and calls in; nothing flows back. (This is why the prototype outlives itself — the validated module lifts in, the shell is deleted.)
4. **Build the smallest TUI that exposes the state** — on every tick, clear the screen and re-render the whole frame (one stable view, not growing scrollback). Each frame, in order: (1) **current state**, pretty-printed one field per line (bold field names, dim derived/IDs); (2) **keyboard shortcuts** at the bottom — `[a] add  [d] delete  [t] tick  [q] quit`. Read one keystroke → dispatch to a handler that mutates state → re-render. Loop until quit. Whole frame fits one screen.
5. **One command to run** — add a script to the project's existing task runner (`package.json` / `Makefile` / `justfile` / `pyproject.toml`). No task runner → put the command at the top of the prototype's README.
6. **Hand it over** — give the run command; the user drives it. The gold moments are "wait, that shouldn't be possible" — bugs in the *idea*. Add actions if they want; prototypes evolve.
7. **Capture the answer** — when done, the answer is the only keepable thing. Record it (ADR / PRD snippet / `NOTES.md`), then delete the shell or lift the validated module in.

## Anti-patterns

- **Tests** — a prototype that needs tests isn't a prototype.
- **The real database** — in-memory unless persistence is literally the question.
- **Generalising** — no "what if we support X later"; one question.
- **Blurring logic and TUI** — if the reducer/machine references `console.log`, prompts, or escape codes, it's no longer portable.
- **Shipping the TUI shell** — the shell is hand-driven scaffolding; only the pure module behind it is worth keeping.
