Deliberately empty of `.claude-plugin/plugin.json` — stands in for an ordinary consumer's project
directory, which has no local checkout of the plugin's source repo. Point `check-skill-freshness.sh`
at this directory as `repo-root` to exercise the `SKIP no-local-repo` leg.
