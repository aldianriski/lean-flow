// Real git-repo fixture factory (SPRINT-092 T1, EPIC-014 H14) -- pulls `s4-append-oracle.test.ts`'s
// own `gitRepoFromClean`/`gitConfig`/`commitAll`/inline shallow-clone construction (SPRINT-091 T7)
// into one shared factory, generalised beyond the single "clean" fixture it was written against, so a
// git-repo §4 case is built the same way wherever S4.APPEND needs a REAL git history instead of the
// in-memory `AdrHistoryPort` fake `adr-family-factory.ts`'s `adrHistoryPort` builds.
//
// THE GUARDRAIL (H14), same shape as `adr-family-factory.ts`: every function here returns either
// `void` or a bare directory `string` (a real filesystem path) -- there is no data SHAPE here a
// verdict could ever occupy, so a caller cannot read an "expected outcome" off the return value even
// in principle. The input side takes only construction options (a fixture name, a temp-dir prefix, a
// commit subject, a text transform) --
// `packages/standard/src/rules/adr-fixture-factory-guardrail.test.ts` proves the same excess-property
// rejection `adr-family-factory.ts` relies on applies here too, on `gitRepoFromFixture`'s own options.
//
// `execFileSync`/`cpSync`/`mkdtempSync`/`writeFileSync`/`readFileSync` stay HERE, mirroring
// `s12-secrets.test.ts`'s and `s4-append-oracle.test.ts`'s own convention of keeping node:fs/
// node:child_process out of the domain layer -- `test/fixtures/` sits outside
// `test/architecture/layers.ts`'s scanned roots the same way `adr-family-factory.ts` does.

import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { adrFamilyFixtureDir } from "./adr-family-factory.ts";

function gitConfig(repo: string): void {
  execFileSync("git", ["-C", repo, "config", "user.email", "fx@example.invalid"]);
  execFileSync("git", ["-C", repo, "config", "user.name", "Fixture"]);
}

export interface GitRepoFromFixtureOptions {
  /** One of the NINE RETAINED fixtures under `evals/fixtures/adr-family/` (TD-012) -- read, never
   *  modified. */
  readonly fixtureName: string;
  /** A temp-dir prefix, so a leftover directory from a failing run names its own test -- mirrors the
   *  convention every §4 git test already used before this factory existed. */
  readonly tmpPrefix: string;
  /** The deciding commit's subject. Defaults to "the deciding commit" -- S4.APPEND's own vocabulary
   *  for the commit every later edit is measured against. */
  readonly commitSubject?: string;
}

/** Copies a retained fixture into a fresh temp git repo and commits it as the deciding commit --
 *  moved here verbatim from `s4-append-oracle.test.ts`'s own `gitRepoFromClean` (SPRINT-091 T7),
 *  generalised to take ANY retained fixture name rather than hard-coding "clean". Returns the repo
 *  directory -- STATE, not a verdict. */
export function gitRepoFromFixture(options: GitRepoFromFixtureOptions): string {
  const dest = mkdtempSync(join(tmpdir(), options.tmpPrefix));
  cpSync(adrFamilyFixtureDir(options.fixtureName), dest, { recursive: true });
  execFileSync("git", ["-C", dest, "init", "-q"]);
  gitConfig(dest);
  execFileSync("git", ["-C", dest, "add", "-A"]);
  execFileSync("git", ["-C", dest, "commit", "-q", "-m", options.commitSubject ?? "the deciding commit"]);
  return dest;
}

/** Stages and commits everything currently sitting in `repo` -- the SECOND commit a test needs after
 *  editing a file post-`gitRepoFromFixture`, so a divergence between "deciding" and "current" text
 *  exists for S4.APPEND to catch. */
export function commitAll(repo: string, subject: string): void {
  execFileSync("git", ["-C", repo, "add", "-A"]);
  execFileSync("git", ["-C", repo, "commit", "-q", "-m", subject]);
}

/** Reads `repo/relPath`, applies `transform`, writes it back -- the common "edit one ADR" shape every
 *  S4.APPEND oracle case needs before its own `commitAll`. `transform` is a pure text function, never
 *  a place to encode an expected verdict. */
export function editFile(repo: string, relPath: string, transform: (text: string) => string): void {
  const full = join(repo, relPath);
  writeFileSync(full, transform(readFileSync(full, "utf8")));
}

export interface ShallowCloneOptions {
  /** The source repository -- a local path or a remote URL. */
  readonly source: string;
  readonly tmpPrefix: string;
  /** `--no-local` forces the normal transport instead of git's local hardlink fast path, which
   *  silently IGNORES `--depth` for a plain filesystem source (discovered live during SPRINT-091 T7's
   *  own build) -- defaults to `true` for exactly that reason. */
  readonly noLocal?: boolean;
}

/** A real `--depth 1` clone of `source` -- the other half of "real git-repo fixture" S4.APPEND's
 *  shallow-clone case needs. Returns the clone's directory; does NOT itself assert `isShallow` --
 *  that check stays in the TEST, against the engine's own `AdrHistoryPort.isShallowClone()` or a live
 *  `git rev-parse --is-shallow-repository`, never decided in here. */
export function shallowCloneOf(options: ShallowCloneOptions): string {
  const dest = mkdtempSync(join(tmpdir(), options.tmpPrefix));
  const args = ["clone", "-q"];
  if (options.noLocal ?? true) args.push("--no-local");
  args.push("--depth", "1", options.source, dest);
  execFileSync("git", args);
  return dest;
}
