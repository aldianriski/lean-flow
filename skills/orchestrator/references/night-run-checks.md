---
owner: Maintainer
last_updated: 2026-08-01
update_trigger: capability-check mechanism changes (skill-freshness or worktree-usability probe logic, decision order, or fixtures)
status: current
---

# Night-run capability checks

Split from `night-run.md` Part 1 (SPRINT-044 T1 — TD-014) so the pre-flight pass stays readable.
Read `night-run.md` first; Part 1's pre-flight checklist points here.

### Capability checks (specified — the probing mechanism graduates to its own task)

The items above verify the *run's* readiness; these verify the **environment's**. They are separate
because each one **degrades** the run rather than stopping it — so the useful output is not
pass/fail but *which shape the run takes*. Specified behaviour-first on purpose: a documented check
a human runs at pre-flight is the floor, and automating the probe is a separate, separately-verified
step (a spec small enough to implement is still not implemented here).

| Capability | What's checked | If absent — degrade rule |
|---|---|---|
| **Agent dispatch** | the run can spawn sub-agents at all | execute **inline and sequentially**; a task that then can't finish inside the window **parks** with its unblock condition rather than half-landing |
| **Worktree isolation** | `git worktree` is usable *and* no leftover agent worktrees remain | run the wave **sequentially in the shared tree** — agents make no git writes, the coordinator commits; the same shape already prescribed for an unpushed base |
| **Ask channel** | *nothing to check — already settled.* Part 0 establishes headless has none, by construction | **park the HITL step** (Part 0 park protocol). Named here only so the set looks complete; a probe would re-derive a known fact |
| **Skill version** | the run is served the skill from the plugin **install cache**, not the working tree — so compare installed version against the repo manifest | **block the unattended run** |

**Why the version check earns its place** (the others are conveniences; this one is a correctness
trap). A night run executes the *installed* skill. Edit a skill, don't reinstall, fire the run, and
it faithfully executes the **previous** procedure — no error, no denial, and a morning diff that
looks like the run simply ignored the change. Nothing else in this pre-flight would catch it, and it
is most likely exactly when a maintainer is iterating on the procedure the run depends on. Blocking
is right rather than degrading: unlike the other rows there is no correct reduced shape, because the
run would be executing a procedure nobody approved.

**Skill-freshness check (implements the row above).** A version-string compare alone can't catch the
trap: edit a skill, forget to bump the version, and installed == repo while the cache still serves
the old content. So the check is content-first, in this decision order:

1. **No local plugin repo** (no manifest to diff the install against — every ordinary consumer) →
   **SKIP**. Consumer-safety leg: it must never fire on someone who only ran `plugin install`.
2. **Installed version ≠ repo manifest version** → **BLOCK**, finding `stale-release`.
3. **Installed cache's `skills/` differs from the repo's**, by content — not the `gitCommitSha`
   field below — → **BLOCK**, finding `cache-differs`. This is the leg that catches the unbumped edit.
4. Else → **PASS**.

**`gitCommitSha` is not usable here.** The field an install manifest records per plugin is written
at *registration* time, not re-synced on content change — it can sit on the commit from whenever
that plugin key was first added, arbitrarily far behind the version paired with it. It answers "when
was this key registered", never "does the cache match the repo now", so it plays no part above.

Optional snippet, dependency-free POSIX sh (`diff`, `grep`, `sed`, `awk`, `git` — no `jq`). Run it
bare — never piped into a formatter inside an `&&` chain; a pipeline's exit status is its last
command's, so `check | tail && fire` would fire through a real BLOCK (L-057). Every exit path prints
its named finding before returning a status, so a non-zero exit is never the probe's own plumbing —
a missing file, an unset var, a failed parse — misread as a real finding (L-059):

<!-- skill-freshness-check:start -->
```sh
#!/bin/sh
# check-skill-freshness.sh -- is the *installed* skill the same content as the repo's?
# Exit 0 = PASS or SKIP (run may proceed); exit 1 = BLOCK (do not fire the run).
# Usage: sh check-skill-freshness.sh [repo-root] [installed_plugins.json]
#   repo-root defaults to `git rev-parse --show-toplevel` (or cwd outside a repo)
#   installed_plugins.json defaults to $HOME/.claude/plugins/installed_plugins.json
set -u

repo_root="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
installed_json="${2:-$HOME/.claude/plugins/installed_plugins.json}"
plugin_json="$repo_root/.claude-plugin/plugin.json"

# --- leg 1: no local plugin repo -> SKIP (an ordinary consumer has no checkout) ---
[ -f "$plugin_json" ] || {
  echo "SKIP no-local-repo: no $plugin_json (nothing to compare the install against)"
  exit 0
}

name=$(grep -oE '"name": *"[^"]+"' "$plugin_json" | head -n1 | sed -E 's/.*"([^"]+)"$/\1/')
repo_version=$(grep -oE '"version": *"[0-9]+\.[0-9]+\.[0-9]+"' "$plugin_json" | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
[ -n "$name" ] && [ -n "$repo_version" ] || {
  echo "BLOCK unreadable-manifest: could not read name/version from $plugin_json"
  exit 1
}

[ -f "$installed_json" ] || {
  echo "SKIP no-local-install: no $installed_json ($name is not installed on this machine)"
  exit 0
}

# grab the first array entry for this plugin's key ("<name>@<marketplace>": [ ... ]).
block=$(awk -v pat="\"$name@" '
  $0 ~ pat { grab=1 }
  grab { print; if ($0 ~ /^ *\],?[[:space:]]*$/) exit }
' "$installed_json")
[ -n "$block" ] || {
  echo "SKIP no-matching-install: no \"$name@*\" entry in $installed_json ($name is not installed on this machine)"
  exit 0
}

installed_version=$(printf '%s\n' "$block" | grep -oE '"version": *"[^"]+"' | head -n1 | sed -E 's/.*"([^"]+)"$/\1/')
install_path=$(printf '%s\n' "$block" | grep -oE '"installPath": *"[^"]+"' | head -n1 | sed -E 's/.*"([^"]+)"$/\1/' | sed 's/\\\\/\//g')
[ -n "$installed_version" ] && [ -n "$install_path" ] || {
  echo "BLOCK unreadable-install-entry: could not parse version/installPath for $name from $installed_json"
  exit 1
}

# --- leg 2: installed version != repo manifest version -> BLOCK ------------------
if [ "$installed_version" != "$repo_version" ]; then
  echo "BLOCK stale-release: installed $installed_version != repo manifest $repo_version ($plugin_json)"
  exit 1
fi

# --- leg 3: installed cache's skills/ differs from the repo's -> BLOCK -----------
repo_skills="$repo_root/skills"
cache_skills="$install_path/skills"
[ -d "$repo_skills" ] || {
  echo "BLOCK repo-skills-missing: $repo_skills not found"
  exit 1
}
[ -d "$cache_skills" ] || {
  echo "BLOCK cache-path-missing: $cache_skills not found (installPath may be stale)"
  exit 1
}

# --strip-trailing-cr: a Windows plugin install can rewrite files CRLF while the repo checkout
# stays LF -- that's a line-ending artifact, not stale content, and must not false-BLOCK (GNU
# diff only; a BSD/busybox diff without this flag will over-report -- normalize line endings
# before diffing as a fallback there).
diffout=$(diff --strip-trailing-cr -rq "$repo_skills" "$cache_skills" 2>&1)
diffstatus=$?
case "$diffstatus" in
  0) : ;;
  1)
    echo "BLOCK cache-differs: installed cache skills/ differs from the repo working tree"
    printf '%s\n' "$diffout"
    exit 1
    ;;
  *)
    echo "BLOCK diff-tool-error: diff -rq exited $diffstatus comparing $repo_skills vs $cache_skills"
    printf '%s\n' "$diffout"
    exit 1
    ;;
esac

echo "PASS skill-freshness: installed $installed_version == repo $repo_version; cache skills/ matches working tree"
exit 0
```
<!-- skill-freshness-check:end -->

Exit 0 covers both `SKIP` and `PASS` (the run may proceed either way); exit 1 is `BLOCK`. Two legs
aren't spec'd above and are reported here rather than faked, each still exiting through its own named
finding (never a bare status): an installed manifest entry that fails to parse
(`unreadable-install-entry`, `unreadable-manifest`), and a local repo where the plugin simply isn't
installed on this machine (`no-local-install` / `no-matching-install`) — both degrade to a SKIP or a
conservative BLOCK, never a silent PASS. Cover the three spec'd legs with fixtures — one must-SKIP,
two must-BLOCK, each asserting its own named finding — and **keep them**: deleting a gate's fixtures
with the scaffolding that built them is what leaves the gate unguarded afterwards (L-058). Put yours
wherever the repo keeps maintainer-only checks; lean-flow's own sit in its `evals/` directory, which
is not part of the installed plugin.

**Agent-dispatch check — a judgement call, not a probe.** "Can this run spawn sub-agents at all" is a
property of the *agent runtime*, not the filesystem or the repo — no file, env var, or git state
answers it from a shell snippet. Inventing a proxy (an API key present, a config flag set, a process
count) would only ever report "available", which is worse than no probe at all: a gate that runs but
can't gate (the L-057 family). So this row stays what Part 1 already calls it — a pre-flight line the
human confirms by knowing what they launched into, same as the `unattended` signal itself. No fixture
accompanies it: a fixture would have to fake the one signal that can't be faked honestly.

**Worktree-isolation check (implements the row above).** Unlike dispatch, this one *is* filesystem-
observable — `git worktree list` is a real, read-only command. Decision order:

1. **Not a git working tree, or `git worktree list` errors** (old git, missing binary, an exotic
   setup) → **DEGRADE**, finding `no-worktree-support`.
2. **`git worktree list` reports more than the main tree** (a linked worktree left over from a prior
   run) → **DEGRADE**, finding `leftover-worktrees`, naming the extra path(s).
3. Else → **AVAILABLE**, finding `worktree-clean`.

Same discipline as the freshness check — run bare, never through a formatter ahead of an `&&` chain
(L-057); every exit path prints its named finding before returning a status (L-059). Neither outcome
here blocks, so exit 0 covers both `AVAILABLE` and `DEGRADE` — the only non-zero exit is the probe's
own plumbing failing to run at all (e.g. a bad fixture path), which must never be read as a finding:

<!-- worktree-usability-check:start -->
```sh
#!/bin/sh
# check-worktree-usability.sh -- is `git worktree` usable, and clean, for this run?
# Exit 0 = AVAILABLE or DEGRADE (either way the run proceeds -- see night-run.md Part 1);
# a non-zero exit means the PROBE ITSELF could not run (L-059: never read that as a finding).
# Usage: sh check-worktree-usability.sh [repo-root] [porcelain-listing-file]
#   repo-root defaults to `git rev-parse --show-toplevel`.
#   porcelain-listing-file, if given, replaces the live `git worktree list --porcelain` call with
#   its contents -- the fixture seam: same data shape a real run would see, no worktree ever
#   created or removed to produce it.
set -u

repo_root="${1:-$(git rev-parse --show-toplevel 2>/dev/null)}"
listing_file="${2:-}"

if [ -n "$listing_file" ]; then
  [ -f "$listing_file" ] || {
    echo "ERROR probe-harness: listing file $listing_file not found"
    exit 1
  }
  list=$(cat "$listing_file")
  gitstatus=0
else
  [ -n "$repo_root" ] || {
    echo "DEGRADE no-worktree-support: not inside a git working tree"
    exit 0
  }
  list=$(git -C "$repo_root" worktree list --porcelain 2>&1)
  gitstatus=$?
fi

[ "$gitstatus" -eq 0 ] || {
  echo "DEGRADE no-worktree-support: 'git worktree list' failed -- $(printf '%s' "$list" | head -n1)"
  exit 0
}

count=$(printf '%s\n' "$list" | grep -c '^worktree ')
if [ "$count" -gt 1 ]; then
  extra=$(printf '%s\n' "$list" | grep '^worktree ' | tail -n +2 | tr '\n' ';')
  echo "DEGRADE leftover-worktrees: $((count - 1)) linked worktree(s) beyond the main tree -- $extra"
  exit 0
fi

echo "AVAILABLE worktree-clean: git worktree usable, no leftover linked worktrees"
exit 0
```
<!-- worktree-usability-check:end -->

Cover both degrade legs with fixtures, same L-058 retention rule as above. The `leftover-worktrees`
leg is fed via the listing-file seam rather than a real second worktree — probing worktree usability
by *creating* one would be the exact hazard this file already warns unattended runs about (a
tree-wide git op reaching uncommitted work). Fixtures live beside the freshness ones, outside the
installed plugin.
