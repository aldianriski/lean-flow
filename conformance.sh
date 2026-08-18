#!/usr/bin/env sh
# conformance.sh -- top-level CLI entry point for the conformance engine (SPRINT-075 T2).
#
# D1 (settled at EPIC-004 intake): standalone-capable AND plugin-bundled, ONE implementation with
# TWO entry points. This file is the standalone one -- an adopter, or anyone at this repo's own
# root, runs `sh conformance.sh <repo-dir>` with no other setup. scripts/qa-check.sh is the other
# entry point, for this repo's own gate. Both call the same scripts/lib/conformance-engine.sh; this
# file is a thin `exec`, never a second copy of the driver.
#
# The engine resolves spec/STANDARD.md relative to ITSELF (scripts/lib/conformance-engine.sh's own
# directory), not to the repo under test -- so the <repo-dir> being measured needs no copy of the
# standard it is being measured against (check-attestation.sh's proven approach, SPRINT-074 T2).
#
# Usage: sh conformance.sh <repo-dir> [--spec <path/to/STANDARD.md>]
set -u
here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
exec sh "$here/scripts/lib/conformance-engine.sh" "$@"
