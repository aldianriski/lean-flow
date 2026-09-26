// evals/run-gen-index-locale-fixtures.ts -- retained proof that scripts/gen-index.sh's ADR/research
// enumeration order is byte-order (C), regardless of the CALLER's locale (TASK-389, SPRINT-108 T2).
// Run by Bun: `bun evals/run-gen-index-locale-fixtures.ts`
//
// THE BUG THIS GUARDS. gen-index.sh's `for f in "$ROOT"/docs/adr/ADR-*.md "$ROOT"/docs/research/*.md
// "$ROOT"/docs/research/archive/*.md` used bare bash glob expansion, whose match order is the
// CALLER's locale collation, not byte order. The index committed to this repo was generated in a
// Linux container under C/byte order; a Windows host's default locale collates the SAME file set
// into a different order, so `sh scripts/gen-index.sh --check` reported STALE over a same-link-set,
// different-order diff. The fix pipes the glob matches through an explicit `LC_ALL=C sort` before
// the loop reads them, scoped to that one `sort` invocation only.
//
// WHY THESE ARE RETAINED. TD-012: deleting the fixtures with the prototype leaves the fix unguarded
// against a future edit that drops the `sort` (or re-widens its scope into a leaked `export
// LC_ALL=C`). Tier X (ADR-029, CLAUDE.md): gen-index.sh is a generator/emitter, not a guard, so the
// bar here is the retained fixture plus one motivating-artifact run, not a full discrimination proof
// -- but case (i) still needs to show the host CAN discriminate, or a false PASS on case (ii) would
// mean nothing.
//
// CASES.
//   locale-control            must PASS -- bash's OWN glob expansion order (not `sort`) for
//                              `docs/research/*.md` in a throwaway repo DIFFERS between
//                              `LC_ALL=C` and `LC_ALL=en_US.UTF-8` on THIS host. If it does not,
//                              this reports `INVALID  locale-control: host cannot discriminate` and
//                              scores the case a FAIL (never a silent pass) -- a locale-insensitive
//                              host would make case (ii)'s PASS vacuous.
//   byte-identical-index      must PASS -- generating the SAME fixture tree under `LC_ALL=C` and
//                              under `LC_ALL=en_US.UTF-8` (two separate temp repos, same seed
//                              content) produces a byte-identical `docs/knowledge-index.md`.
//   no-leak-subprocess        must PASS -- invoking `sh scripts/gen-index.sh --check` as a real
//                              subprocess (the ONLY way qa-check.sh's leg 4 ever invokes it -- see
//                              qa-check.sh line ~692, `sh scripts/gen-index.sh --check`) does not
//                              change the CALLING process's own LC_ALL/LC_COLLATE.
//   no-leak-vocab-grep        must PASS -- qa-check.sh's actual vocab-extraction mechanism (a plain
//                              `grep -E '^TAGS='`/`grep -E '^DOMAINS='` text read of gen-index.sh,
//                              never a shell `.`/`source` of it -- confirmed by inspection, no such
//                              sourcing exists anywhere in scripts/qa-check.sh) does not change the
//                              calling process's own LC_ALL/LC_COLLATE either.
//
// A `git init` (no commit) is used per throwaway repo, per the task's own build instruction and the
// evals/run-git-availability-fixtures.sh precedent for staying cheap: gen-index.sh's own
// `ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)` only needs a repo to EXIST, never a
// commit, so this harness never builds git history and stays cheap-and-git-free in TD-016's sense.
//
// Fixture seed content lives under evals/fixtures/gen-index-locale/ (TASK-389).

import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const FIXTURE_ROOT = fileURLToPath(new URL("fixtures/gen-index-locale/", import.meta.url));
const GEN_INDEX_SCRIPT = fileURLToPath(new URL("../scripts/gen-index.sh", import.meta.url));
const QA_CHECK_SCRIPT = fileURLToPath(new URL("../scripts/qa-check.sh", import.meta.url));

let pass = 0;
let fail = 0;

function report(name: string, ok: boolean, detail: string) {
  if (ok) {
    console.log(`PASS  gen-index-locale-fixture: ${name} -- ${detail}`);
    pass++;
  } else {
    console.log(`FAIL  gen-index-locale-fixture: ${name} -- ${detail}`);
    fail++;
  }
}

// stderr is captured alongside stdout (never left to inherit into this harness's own terminal) --
// a stale-fixture `sh scripts/gen-index.sh --check` genuinely prints a FAIL line to stderr on a
// freshly-seeded, not-yet-generated repo, and that is diagnostic noise for THIS harness's own
// PASS/FAIL accounting (which reads exit codes and file bytes, never the child's printed text),
// not a second verdict to relay.
function sh(args: string[], opts: { cwd: string; env?: NodeJS.ProcessEnv }): { stdout: string; code: number } {
  try {
    const stdout = execFileSync("sh", args, { cwd: opts.cwd, env: opts.env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { stdout, code: 0 };
  } catch (e) {
    const err = e as { stdout?: string; status?: number };
    return { stdout: err.stdout ?? "", code: err.status ?? 1 };
  }
}

// Builds one throwaway repo: `git init` (no commit -- see header comment) + the fixture's docs
// tree + a fresh copy of the gen-index.sh UNDER TEST (never the fixture's own stale copy, so an
// edit to the real script is always what gets exercised).
function buildTempRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), "gen-index-locale-"));
  execFileSync("git", ["init", "-q"], { cwd: dir });
  cpSync(join(FIXTURE_ROOT, "research"), join(dir, "docs", "research"), { recursive: true });
  cpSync(join(FIXTURE_ROOT, "knowledge-index-template.md"), join(dir, "docs", "knowledge-index.md"));
  cpSync(join(FIXTURE_ROOT, "LEARNINGS-template.md"), join(dir, "docs", "LEARNINGS.md"));
  cpSync(GEN_INDEX_SCRIPT, join(dir, "scripts", "gen-index.sh"));
  return dir;
}

function localeEnv(lc: string): NodeJS.ProcessEnv {
  return { ...process.env, LC_ALL: lc, LANG: lc };
}

// --- case (i): CONTROL -- bash's OWN glob order for docs/research/*.md differs between locales ---
{
  const dir = buildTempRepo();
  try {
    const probe = 'for f in docs/research/*.md; do basename "$f"; done';
    const underC = sh(["-c", probe], { cwd: dir, env: localeEnv("C") }).stdout.trim();
    const underEnUs = sh(["-c", probe], { cwd: dir, env: localeEnv("en_US.UTF-8") }).stdout.trim();
    const discriminates = underC !== underEnUs && underC.length > 0 && underEnUs.length > 0;
    if (!discriminates) {
      console.log("INVALID  locale-control: host cannot discriminate");
      report(
        "locale-control",
        false,
        `bash glob order for docs/research/*.md did NOT differ between LC_ALL=C ("${underC}") and ` +
          `LC_ALL=en_US.UTF-8 ("${underEnUs}") on this host -- reported INVALID and scored as a FAIL ` +
          `of the control (never a silent pass), because case (ii)'s PASS would be vacuous here`,
      );
    } else {
      report(
        "locale-control",
        true,
        `bash glob order for docs/research/*.md DIFFERS on this host -- LC_ALL=C gives "${underC}", ` +
          `LC_ALL=en_US.UTF-8 gives "${underEnUs}"`,
      );
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// --- case (ii): generating under LC_ALL=C and under LC_ALL=en_US.UTF-8 yields a byte-identical
// docs/knowledge-index.md. Two SEPARATE repos (same seed content) so neither run's write can affect
// the other.
{
  const dirC = buildTempRepo();
  const dirEnUs = buildTempRepo();
  try {
    const runC = sh(["scripts/gen-index.sh"], { cwd: dirC, env: localeEnv("C") });
    const runEnUs = sh(["scripts/gen-index.sh"], { cwd: dirEnUs, env: localeEnv("en_US.UTF-8") });
    const contentC = readFileSync(join(dirC, "docs", "knowledge-index.md"));
    const contentEnUs = readFileSync(join(dirEnUs, "docs", "knowledge-index.md"));
    const identical = runC.code === 0 && runEnUs.code === 0 && Buffer.compare(contentC, contentEnUs) === 0;
    report(
      "byte-identical-index",
      identical,
      identical
        ? `LC_ALL=C and LC_ALL=en_US.UTF-8 produced a byte-identical docs/knowledge-index.md ` +
          `(${contentC.length} bytes; both runs exited 0)`
        : `generated index DIFFERED -- LC_ALL=C exit ${runC.code} (${contentC.length} bytes), ` +
          `LC_ALL=en_US.UTF-8 exit ${runEnUs.code} (${contentEnUs.length} bytes)`,
    );

    // --- Sanity seed (Tier X -- CLAUDE.md's DoD, no full discrimination proof required): with the
    // `LC_ALL=C sort` removed, this SAME case must redden under a caller locale that actually
    // discriminates (case (i) already proved this host does). Proves the guard is reachable, not
    // merely well-formed.
    const original = readFileSync(GEN_INDEX_SCRIPT, "utf8");
    const broken = original.replace(/\s*\|\s*LC_ALL=C sort\n\)/, "\n)");
    if (broken === original) {
      report("sanity-seed (sort removal applied)", false, "replace() found no match -- seed did not land, cannot prove reachability");
    } else {
      const seedDirC = buildTempRepo();
      const seedDirEnUs = buildTempRepo();
      try {
        writeFileSync(join(seedDirC, "scripts", "gen-index.sh"), broken);
        writeFileSync(join(seedDirEnUs, "scripts", "gen-index.sh"), broken);
        const brokenRunC = sh(["scripts/gen-index.sh"], { cwd: seedDirC, env: localeEnv("C") });
        const brokenRunEnUs = sh(["scripts/gen-index.sh"], { cwd: seedDirEnUs, env: localeEnv("en_US.UTF-8") });
        const brokenContentC = readFileSync(join(seedDirC, "docs", "knowledge-index.md"));
        const brokenContentEnUs = readFileSync(join(seedDirEnUs, "docs", "knowledge-index.md"));
        const seededlyDiffer = Buffer.compare(brokenContentC, brokenContentEnUs) !== 0;
        report(
          "sanity-seed (case ii reddens with the sort removed)",
          seededlyDiffer && brokenRunC.code === 0 && brokenRunEnUs.code === 0,
          seededlyDiffer
            ? `with the LC_ALL=C sort removed, the two locales produced DIFFERENT index files as expected -- the guard is reachable, not merely well-formed`
            : `with the LC_ALL=C sort removed, the two locales STILL produced identical output -- the case cannot discriminate`,
        );
      } finally {
        rmSync(seedDirC, { recursive: true, force: true });
        rmSync(seedDirEnUs, { recursive: true, force: true });
      }
    }
  } finally {
    rmSync(dirC, { recursive: true, force: true });
    rmSync(dirEnUs, { recursive: true, force: true });
  }
}

// --- case (iii): no leak. Two sub-checks, both against THIS process's own inherited LC_ALL/
// LC_COLLATE (recorded once, before either sub-check runs).
{
  const before = { LC_ALL: process.env.LC_ALL, LC_COLLATE: process.env.LC_COLLATE };
  const dir = buildTempRepo();
  try {
    // (a) the ACTUAL invocation shape qa-check.sh leg 4 uses: `sh scripts/gen-index.sh --check` as
    // a real subprocess, with the CALLER's own environment (no LC_ALL override from the harness
    // side) -- exactly what a caller with its own ambient locale would run.
    sh(["scripts/gen-index.sh", "--check"], { cwd: dir, env: process.env });
    const afterSubprocess = { LC_ALL: process.env.LC_ALL, LC_COLLATE: process.env.LC_COLLATE };
    const noLeakSubprocess =
      afterSubprocess.LC_ALL === before.LC_ALL && afterSubprocess.LC_COLLATE === before.LC_COLLATE;
    report(
      "no-leak-subprocess",
      noLeakSubprocess,
      noLeakSubprocess
        ? `caller LC_ALL=${String(before.LC_ALL)}/LC_COLLATE=${String(before.LC_COLLATE)} unchanged ` +
          `after \`sh scripts/gen-index.sh --check\` -- the only invocation shape qa-check.sh's own leg 4 uses`
        : `caller locale CHANGED after invoking gen-index.sh --check: before=${JSON.stringify(before)}, ` +
          `after=${JSON.stringify(afterSubprocess)}`,
    );

    // (b) qa-check.sh's ACTUAL vocab-extraction mechanism: a plain `grep -E '^TAGS='`/
    // `grep -E '^DOMAINS='` text read (scripts/qa-check.sh lines ~755, ~772-773) -- never a shell
    // `.`/`source` of gen-index.sh (confirmed absent by inspection: no `. scripts/gen-index.sh` or
    // `source scripts/gen-index.sh` appears anywhere in scripts/qa-check.sh).
    const qaCheckText = readFileSync(QA_CHECK_SCRIPT, "utf8");
    const sourcesGenIndex = /(^|\s)\.\s+scripts\/gen-index\.sh|source\s+scripts\/gen-index\.sh/m.test(qaCheckText);
    execFileSync("sh", ["-c", "grep -E '^TAGS=' scripts/gen-index.sh; grep -E '^DOMAINS=' scripts/gen-index.sh"], {
      cwd: dir,
      env: process.env,
    });
    const afterGrep = { LC_ALL: process.env.LC_ALL, LC_COLLATE: process.env.LC_COLLATE };
    const noLeakGrep = afterGrep.LC_ALL === before.LC_ALL && afterGrep.LC_COLLATE === before.LC_COLLATE;
    report(
      "no-leak-vocab-grep",
      noLeakGrep && !sourcesGenIndex,
      noLeakGrep && !sourcesGenIndex
        ? `qa-check.sh's actual vocab read is a plain grep (never a \`.\`/source of gen-index.sh, ` +
          `confirmed absent) and leaves the caller's LC_ALL/LC_COLLATE unchanged`
        : `${!sourcesGenIndex ? "" : "scripts/qa-check.sh appears to `.`/source gen-index.sh, which this fixture does not model -- "}` +
          `${noLeakGrep ? "" : `caller locale changed after the vocab grep: before=${JSON.stringify(before)}, after=${JSON.stringify(afterGrep)}`}`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

console.log(`gen-index-locale-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
