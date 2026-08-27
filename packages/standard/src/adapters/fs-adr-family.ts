// The real Bun/Node adapter for `AdrFamilyPort` (SPRINT-091 T7) -- T6 left this adapter unbuilt,
// deliberately, because a production adapter sat outside T6's own Layers; building it is explicitly
// in scope here, alongside the git adapter S4.APPEND itself needs (T7's task brief). `node:fs` for
// docs/adr/'s own listing, the ADR-shaped strays elsewhere under docs/, the root strays, the decision
// index, and any of those files' own text.
//
// Adapters layer (V3 §2.1 · `test/architecture/layers.ts`'s `/^packages\/[^/]+\/src\/adapters\//`
// rule) -- this is the one place in this family allowed to reach for `node:fs` directly.
// `../rules/adr-family-port.fake.ts` is this port's other implementation. NOT wired into
// `apps/cli/src/main.ts` by this task -- `apps/cli/src/` is T5's Layers, running concurrently; the
// gap is reported, not closed, here.
//
// Mirrors `scripts/lib/conformance-engine.sh`'s own §4 helpers exactly: `_adr_canonical` (docs/adr/'s
// own listing), `assert_S4_ONEFILE`'s strays search (scoped to the doc tree plus the repo root, never
// the whole checkout -- an adopter's own fixtures/vendored copies must not turn into noise), and the
// `docs/DECISIONS.md`-then-`DECISIONS.md` index lookup.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import type { AdrFamilyPort } from "../rules/adr-family-port.ts";
import { ADR_CANONICAL_NAME_RE } from "../rules/adr-family.ts";

export class FsAdrFamilyPort implements AdrFamilyPort {
  private readonly repoRoot: string;

  constructor(repoRoot: string) {
    this.repoRoot = repoRoot;
  }

  private adrDir(): string {
    return join(this.repoRoot, "docs", "adr");
  }

  hasAdrDir(): boolean {
    const d = this.adrDir();
    return existsSync(d) && statSync(d).isDirectory();
  }

  listAdrDirMdFiles(): readonly string[] {
    if (!this.hasAdrDir()) return [];
    const dir = this.adrDir();
    return readdirSync(dir).filter((name) => name.endsWith(".md") && statSync(join(dir, name)).isFile());
  }

  listStrayAdrPathsUnderDocs(): readonly string[] {
    const docsDir = join(this.repoRoot, "docs");
    if (!existsSync(docsDir)) return [];
    const adrDir = this.adrDir();
    const acc: string[] = [];
    const walk = (dir: string): void => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (full === adrDir) continue; // docs/adr/ itself is not a stray location
        const st = statSync(full);
        if (st.isDirectory()) {
          walk(full);
        } else if (st.isFile() && ADR_CANONICAL_NAME_RE.test(name)) {
          acc.push(relative(this.repoRoot, full).split(sep).join("/"));
        }
      }
    };
    walk(docsDir);
    return acc;
  }

  listStrayAdrNamesAtRoot(): readonly string[] {
    return readdirSync(this.repoRoot).filter(
      (name) => ADR_CANONICAL_NAME_RE.test(name) && statSync(join(this.repoRoot, name)).isFile(),
    );
  }

  findIndexPath(): string | null {
    for (const cand of ["docs/DECISIONS.md", "DECISIONS.md"]) {
      const full = join(this.repoRoot, ...cand.split("/"));
      if (existsSync(full) && statSync(full).isFile()) return cand;
    }
    return null;
  }

  readFile(path: string): string | null {
    const full = join(this.repoRoot, ...path.split("/"));
    if (!existsSync(full)) return null;
    try {
      return readFileSync(full, "utf8");
    } catch {
      return null;
    }
  }
}
