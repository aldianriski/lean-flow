---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: Install steps, environment variables, or dev tooling changed
status: current
---

# lean-flow — Setup

Two audiences, and they need different things. **Consumers** install the plugin and never clone this
repo. **Maintainers** clone it, edit markdown, and run the QA gate. Everything below the first section
is maintainer-only.

## Install (consumers)

```bash
claude plugin marketplace add https://github.com/aldianriski/lean-flow
claude plugin install lean-flow@lean-flow
```

Per-tool variants (Codex, Kimi Code CLI) → [`README.md`](../../README.md) § Quickstart.

Skills auto-discover from `skills/`. Nothing else is required — there is no build, no runtime, and no
configuration file to create.

**A live session keeps whichever installed copy it started with.** A plugin updated mid-session does
not take effect until the session restarts, and the old procedure keeps running with no error — the
diff simply reads as if the change were ignored. Check the freshness row `/prime` emits (base-dir
version vs `plugin.json`), or the base-dir version printed in every skill's invocation header. Never
trust `/plugin`'s "already at the latest version" report for this — it describes the marketplace, not
the session (L-021).

## Prerequisites (maintainers)

- **git**
- **POSIX `sh`** — on Windows, Git Bash. Every script under `scripts/` is dependency-free POSIX shell;
  there is no Node, Python, or package manager anywhere in this repo.

## Install (maintainers)

```bash
git clone https://github.com/aldianriski/lean-flow
cd lean-flow
```

No install step. No `.env` — this repo has no environment configuration and therefore no
`.env.example`.

## Validate

```bash
sh scripts/qa-check.sh              # the gate: line caps, frontmatter, ownership headers,
                                    # roster/template counts, sprint schema, eval harnesses
QA_FULL=1 sh scripts/qa-check.sh    # the above plus the slow opt-in selftests (TD-016)
sh scripts/gen-index.sh             # regenerate docs/knowledge-index.md (derived, never hand-edited)
```

Run the gate **bare**. Piping it into a formatter inside an `&&` chain returns the *formatter's* exit
status, so a real FAIL sails through; a failed redirect reports non-zero before the gate ever ran. An
exit code is evidence about the reporter, never about the artifact (L-045 · L-057 · L-089).

Some eval fixtures cost real API calls and stay a manual step — see `evals/README.md`.

## Environment variables

| Variable | Required | Description |
|:---------|:---------|:------------|
| `QA_FULL` | no | `1` runs the slow opt-in selftests inside `qa-check.sh`; unset runs the always-on checks only |

**Scope any shell workaround to the one command that needs it.** An exported variable is inherited by
every child process, including ones it was never meant to reach, and the resulting failure surfaces far
from where it was set. `MSYS_NO_PATHCONV=1` — set so a `/skill` argument would not be path-rewritten —
propagated into the QA gate, broke `git -C`, and produced a red gate on correct code that survived two
wrong diagnoses. When a check behaves differently in two places, diff the environments before the code
(L-067 · L-081).
