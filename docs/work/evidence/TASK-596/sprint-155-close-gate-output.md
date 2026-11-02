# TASK-596 evidence — SPRINT-155 close, LOG-REWRITTEN on an append-only log

Redacted: the gate host's user, address and working directory are replaced with `<gate-host>` / `<gate-dir>`.
No auth headers, tokens or secrets were present in the excerpt.

## 1. Remote gate output at the SPRINT-155 close (excerpt, as reported 2026-11-01)

```
gate-remote: host <gate-host> dir <gate-dir> ... FAIL  freeze ... LOG-REWRITTEN docs/sprint/logs/SPRINT-155-consumer-docs-codex-built.md ... QA-CHECK: 352 pass, 2 fail
```

Shows: the close went red on a `LOG-REWRITTEN` freeze finding against the SPRINT-155 Execution Log.

## 2. The log was only appended to (re-run at triage, 2026-11-02)

```
$ git diff --numstat 2ea2af75 16f28eaa -- docs/sprint/logs/SPRINT-155-consumer-docs-codex-built.md
109	0	docs/sprint/logs/SPRINT-155-consumer-docs-codex-built.md
$ git diff 2ea2af75 16f28eaa -- docs/sprint/logs/SPRINT-155-consumer-docs-codex-built.md | grep -c '^-[^-]'
0
```

Shows: 109 lines added and none removed, so the finding names a rewrite that did not happen.

## 3. `git log --follow` links the SPRINT-155 log to SPRINT-154's (re-run at triage, 2026-11-02)

```
$ git log --follow --name-only --format='%h' 16f28eaa -- docs/sprint/logs/SPRINT-155-consumer-docs-codex-built.md | grep -E '^docs' | sort -u
docs/sprint/logs/SPRINT-154-a2-migrate-arm.md
docs/sprint/logs/SPRINT-155-consumer-docs-codex-built.md
```

Shows: the rename-following history of the SPRINT-155 log includes SPRINT-154's log path. This is consistent with the
reporter's suspected cause; it does not yet prove that the checker took its baseline from that path (left to /diagnose).
