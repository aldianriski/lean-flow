// ADR in-memory fixture factory (SPRINT-092 T1, EPIC-014 H14) -- pulls the §4 rule tests' own inline
// `new InMemoryAdrFamilyPort({...})` construction, and the retained-fixture-directory reader
// `adr-family-fixtures.test.ts` (SPRINT-091 T6) built for itself, into ONE shared place. Before this,
// "build an AdrFamilyPort" existed in two independently-typed forms scattered across five `*.test.ts`
// files; a factory that's easy to reach is a factory people actually reuse instead of re-deriving.
//
// THE GUARDRAIL (H14): "factory creates state, factory does not decide expected verdict." A factory
// that CAN decide a verdict makes every test using it vacuous -- the test would assert what the
// factory told it, not what the engine computed. Enforced STRUCTURALLY here, two independent ways:
//
//   1. RETURN side (the strong one). `adrFamilyPort`/`adrHistoryPort`/`loadAdrFamilyFixture` are all
//      typed to return the PORT INTERFACE (`AdrFamilyPort`/`AdrHistoryPort`) -- query methods only
//      (`hasAdrDir()`, `listAdrDirMdFiles()`, ...), zero data properties. A verdict, an
//      `expectedVerdict` field, or any assertion vocabulary has no member slot to occupy on the
//      DECLARED return type: a caller typed against the interface cannot read it without an explicit
//      unsafe cast (`as unknown as ...`), which is a visible, reviewable escape hatch, not a silent
//      one. This holds regardless of what a rogue implementation might smuggle onto the concrete
//      object underneath -- the type system erases it at the call site.
//
//   2. INPUT side. `adrFamilyPort`/`adrHistoryPort` take the PRE-EXISTING, already-sealed
//      `InMemoryAdrFamilyScenario`/`InMemoryAdrHistoryScenario` shapes (`adr-family-port.fake.ts` /
//      `adr-history-port.fake.ts`) -- reused here, not redefined, so there is exactly ONE state shape
//      to keep sealed rather than two drifting copies. TypeScript's excess-property check on an
//      OBJECT LITERAL passed directly to a typed parameter rejects any extra field (e.g.
//      `expectedVerdict: "fail"`) at COMPILE time -- stronger than a runtime throw or a lint rule,
//      because a verdict-deciding CALL SITE does not compile rather than merely being flagged.
//      `packages/standard/src/rules/adr-fixture-factory-guardrail.test.ts` seeds exactly that break
//      under `@ts-expect-error` and proves the check is load-bearing, not merely present.
//
//   Known limit of (2), CORRECTED after independent review -- the previous wording implied visibly
//   unsafe syntax (`any`, an `as` cast) was needed to bypass it; it is not. TypeScript's excess-
//   property check fires ONLY on a fresh object literal passed DIRECTLY as the call's argument.
//   Pulling that same literal into an intermediate `const` (or spreading it) defeats the check
//   SILENTLY -- no cast, no `any`, no diagnostic:
//
//     const state = { adrDirFiles: {}, expectedVerdict: "fail" };
//     const port = adrFamilyPort(state);           // 0 tsc errors
//     expect(state.expectedVerdict).toBe("fail");   // smuggled value readable, no cast anywhere
//
//   That is TypeScript's own well-known limit on excess-property checking (a check on a literal's
//   SHAPE at its construction site, not an exact/nominal type system) -- not a gap introduced by this
//   file -- but it IS reachable by the single most natural refactor a test author performs ("pull
//   shared setup into a const"), so it is named plainly rather than described as requiring visibly
//   unsafe syntax. (1) -- the RETURN-side interface sealing -- does NOT share this limit: a caller
//   typed against `AdrFamilyPort`/`AdrHistoryPort` cannot read a smuggled property off the RETURNED
//   port without an explicit, visible unsafe cast, no matter how the STATE that built it was
//   constructed (literal, const, or spread). Treat (1) as the mechanism to actually rely on; (2) is
//   best-effort and known-bypassable, not a closed guarantee.
//
// Domain-ADJACENT test helper, not domain code -- lives under `test/fixtures/`, outside
// `test/architecture/layers.ts`'s scanned roots (`checkLayers`'s default `roots: ["apps", "packages"]`
// never walks `test/`), so it is free to use `node:fs` the way `adr-family-fixtures.test.ts`'s own
// `loadFixtureScenario` already did before this file existed.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { ADR_CANONICAL_NAME_RE } from "../../packages/standard/src/rules/adr-family.ts";
import type { AdrFamilyPort } from "../../packages/standard/src/rules/adr-family-port.ts";
import {
  InMemoryAdrFamilyPort,
  type InMemoryAdrFamilyScenario,
} from "../../packages/standard/src/rules/adr-family-port.fake.ts";
import type { AdrHistoryPort } from "../../packages/standard/src/rules/adr-history-port.ts";
import {
  InMemoryAdrHistoryPort,
  type InMemoryAdrHistoryScenario,
} from "../../packages/standard/src/rules/adr-history-port.fake.ts";

/** Re-exported under this file's own name rather than forcing every call site to import the fake
 *  module directly -- ONE sealed state shape, not a second one invented here (Simplicity first). */
export type AdrFamilyState = InMemoryAdrFamilyScenario;
export type AdrHistoryState = InMemoryAdrHistoryScenario;

/** Builds an in-memory `AdrFamilyPort` from hand-authored STATE. Call with an object LITERAL (never a
 *  pre-typed variable spread through `...state`) so TypeScript's excess-property check stays active
 *  -- see this file's header, mechanism (2). */
export function adrFamilyPort(state: AdrFamilyState): AdrFamilyPort {
  return new InMemoryAdrFamilyPort(state);
}

/** Builds an in-memory `AdrHistoryPort` from hand-authored STATE -- S4.APPEND's other half, alongside
 *  `adrFamilyPort`. Same two guardrail mechanisms apply. */
export function adrHistoryPort(state: AdrHistoryState): AdrHistoryPort {
  return new InMemoryAdrHistoryPort(state);
}

const ADR_FAMILY_FIXTURES_ROOT = fileURLToPath(new URL("../../evals/fixtures/adr-family", import.meta.url));

/** Resolves one of the NINE RETAINED fixtures (TD-012) to its real directory on disk -- read, never
 *  modified, per this task's own briefing. */
export function adrFamilyFixtureDir(fixtureName: string): string {
  return join(ADR_FAMILY_FIXTURES_ROOT, fixtureName);
}

function walkForStrays(dir: string, repoRoot: string, adrDir: string, acc: Record<string, string>): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (full === adrDir) continue; // docs/adr/ itself is not a stray location
    const st = statSync(full);
    if (st.isDirectory()) {
      walkForStrays(full, repoRoot, adrDir, acc);
    } else if (st.isFile() && ADR_CANONICAL_NAME_RE.test(name)) {
      acc[relative(repoRoot, full).split(sep).join("/")] = readFileSync(full, "utf8");
    }
  }
}

/** Reads a REAL retained-fixture directory off disk into `AdrFamilyState` -- moved here VERBATIM from
 *  `adr-family-fixtures.test.ts`'s own `loadFixtureScenario` (SPRINT-091 T6), which built this for
 *  itself before a shared factory existed. Exported as STATE (not a port), so a row-by-row parity
 *  test can still see the raw shape when it needs to; the sealing lives on the CONSUMING factory
 *  (`adrFamilyPort`), not on reading real files. */
export function loadAdrFamilyState(fixtureDir: string): AdrFamilyState {
  const adrDir = join(fixtureDir, "docs", "adr");
  const hasAdrDir = existsSync(adrDir) && statSync(adrDir).isDirectory();

  const adrDirFiles: Record<string, string> = {};
  if (hasAdrDir) {
    for (const name of readdirSync(adrDir)) {
      const full = join(adrDir, name);
      if (statSync(full).isFile() && name.endsWith(".md")) adrDirFiles[name] = readFileSync(full, "utf8");
    }
  }

  const strayDocsFiles: Record<string, string> = {};
  const docsDir = join(fixtureDir, "docs");
  if (existsSync(docsDir)) walkForStrays(docsDir, fixtureDir, adrDir, strayDocsFiles);

  const strayRootFiles: Record<string, string> = {};
  for (const name of readdirSync(fixtureDir)) {
    const full = join(fixtureDir, name);
    if (statSync(full).isFile() && ADR_CANONICAL_NAME_RE.test(name)) strayRootFiles[name] = readFileSync(full, "utf8");
  }

  let indexFile: { readonly path: string; readonly text: string } | undefined;
  for (const cand of ["docs/DECISIONS.md", "DECISIONS.md"]) {
    const full = join(fixtureDir, cand);
    if (existsSync(full) && statSync(full).isFile()) {
      indexFile = { path: cand, text: readFileSync(full, "utf8") };
      break;
    }
  }

  return {
    hasAdrDir,
    adrDirFiles,
    strayDocsFiles,
    strayRootFiles,
    ...(indexFile !== undefined ? { indexFile } : {}),
  };
}

/** Reads a retained fixture straight to a port -- the common case that never needs the raw state.
 *  `loadAdrFamilyState` stays separate for the row-by-row parity suite, which ALSO needs the raw
 *  directory path to spawn the live Shell oracle against the same tree. */
export function loadAdrFamilyFixture(fixtureName: string): AdrFamilyPort {
  return adrFamilyPort(loadAdrFamilyState(adrFamilyFixtureDir(fixtureName)));
}
