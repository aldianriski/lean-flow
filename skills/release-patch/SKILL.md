---
name: release-patch
description: Use when releasing a patch on any project — auto-detects the manifest (plugin / npm / python / cargo / go / flat), or falls back to a changelog-only entry when no manifest exists; bumps the PATCH version, prepends a CHANGELOG entry, then HARD STOPS before push. Skips the bump entirely if only docs changed. Never runs git push; emits a ready-to-push message and exits. Self-contained.
argument-hint: ""
allowed-tools: Read, Write, Edit, Bash(git diff *), Bash(git log *), Bash(git tag *), Glob, Grep
user-invocable: true
version: "0.1.0"
---

# release-patch

Patch-release orchestrator. Auto-detects the project type via a manifest cascade. The last
step is a hard human gate before push — this skill never pushes.

## When to invoke

- A bug fix or hotfix has landed and you need a PATCH bump + changelog.

Do **not** use for MINOR (new feature/skill) or MAJOR (breaking) bumps — those are governance
decisions; bump those manifests by hand with an explicit changelog entry.

At **sprint close** the close step routes here **only for a fixes-only sprint** (PATCH); a sprint that
shipped new capabilities is a **MINOR by-hand** bump (it scans `plan_commit..HEAD` to tell — see step 1).

## Mode-detection cascade

First match wins. Priority: plugin > npm > python > cargo > go > flat.

| Detected file | Mode | Bump target |
|---|---|---|
| `.claude-plugin/plugin.json` | plugin | lockstep with `marketplace.json` (both must stay equal) |
| `package.json` | npm | `version` field |
| `pyproject.toml` | python | `[project]` or `[tool.poetry]` `version` |
| `Cargo.toml` | cargo | `[package] version` |
| `go.mod` | go | tag-based — prompt the user for the tag string |
| `VERSION` (flat file) | flat | overwrite with the new semver |
| none of the above | changelog-only | no manifest — prepend a dated CHANGELOG entry, **no** version bump (see below) |

## Steps

1. **Diff scan** — `git diff --name-only HEAD~1 HEAD` (or `HEAD` if uncommitted). **At sprint close → scan the whole sprint range `plan_commit..HEAD`** (read `plan_commit` from the just-closed sprint frontmatter) — else a multi-commit sprint is misjudged by its docs-only close commit. If every changed path is under `docs/`, abort: `[skip] docs-only diff — no version bump`. Exit.
2. **Mode detect** — run the cascade; save the mode + manifest path(s). No manifest → **changelog-only mode** (below); do not exit.
3. **PATCH bump** — increment the patch digit per mode. Plugin: verify both files are equal, then bump both. Single-manifest modes: read → bump → write. Go: prompt for the tag string.
4. **CHANGELOG entry** — detect root `CHANGELOG.md` (canonical placement, DOCS_Guide §2, ADR-012), else legacy `docs/CHANGELOG.md` / `CHANGES.md` / `HISTORY.md` (default root `CHANGELOG.md`). Prepend a new block matching the file's existing entry shape; if empty/missing, use Keep-a-Changelog format.
5. **Stale-doc clear** — any doc with `last_updated:` frontmatter that appears in the diff → bump it to today (`yyyy-MM-dd`).
6. **HARD STOP — push gate** — emit the message below and exit (if `docs/deployment/deployment-guide.md` exists — legacy `docs/DEPLOY.md` still matched — point to it for the push / deploy / verify / rollback steps). **This skill never invokes `git push`.**

```
=== READY TO PUSH ===
Mode:    <plugin|npm|python|cargo|go|flat>
Version: <old> → <new>
Run manually: git push origin <branch>
Deploy steps: docs/deployment/deployment-guide.md (push · verify; rollback → docs/deployment/rollback-guide.md — owned there, if present)
=====================
```

## Output format

```
=== RELEASE-PATCH ===
[mode]      <plugin | npm | python | cargo | go | flat>
[diff]      <N> files changed
[bump]      <manifest>: 2.3.0 → 2.3.1  (both paths if plugin)
[changelog] entry prepended for v2.3.1
[stale]     <N> docs touched; last_updated bumped
[push]      HARD STOP — manual git push required
======================
```

## Changelog-only mode (no manifest)

When the cascade finds **no version manifest**, there is nothing to bump — but a code change still
deserves a CHANGELOG line. So instead of skipping outright:

1. The step-1 **docs-only abort still wins** — a docs-only diff exits there (nothing to log).
2. For a code diff: prepend a dated entry to root `CHANGELOG.md` (legacy `docs/CHANGELOG.md`; Keep-a-Changelog format — a `[YYYY-MM-DD]` or `Unreleased` block), **no version line, no bump**.
3. Emit the push gate with `Version: n/a (changelog-only)` and exit. Still never pushes.

Gives manifestless repos (no `package.json` / `VERSION` / etc.) the changelog value without inventing a version scheme they don't use.

## Examples

- **Flat `VERSION`** — `cat VERSION` → `1.4.2`; bump → write `1.4.3`; prepend the `v1.4.3` block to root `CHANGELOG.md`; emit the push gate (`Version: 1.4.2 → 1.4.3`).
- **Changelog-only** (no manifest, code diff) — cascade finds nothing; prepend a dated root `CHANGELOG.md` entry summarising the change; emit the push gate (`Version: n/a (changelog-only)`).

## Constraints

- **Plugin lockstep**: `plugin.json` + `marketplace.json` versions MUST stay equal — never bump one without the other.
- CHANGELOG format follows the detected file's existing entries verbatim — never invent a new shape.
- The push gate is a hard text emit; exit immediately after.
- Run the cascade every invocation — never hardcode the mode.

## Red flags

❌ **Bumping `plugin.json` without `marketplace.json`** (or vice versa) — breaks the lockstep contract.
❌ **Skipping the diff check** — noisy version churn for docs-only commits.
❌ **MINOR / MAJOR bumps** — out of scope; those are governance-level decisions.
❌ **Invoking `git push`** — the skill stops at the gate, always.
