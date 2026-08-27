// Pure extraction of §12's own prose lists (SPRINT-087 T3) -- transliterations of the Shell oracle's
// own awk helpers (`scripts/lib/conformance-engine.sh`: `_s12_generated_classes`,
// `_s12_generated_allowed`, and the inline awk inside `assert_S12_DESIGNSRC`), so the permitted asset
// directories and the §12c class/carve-out lists are DERIVED from spec/STANDARD.md's own sentence,
// never restated as a literal here -- adding a class to §12c moves both sides with no code edit (L-146).
//
// Domain layer (V3 §2.1). Takes already-read spec TEXT (a string) -- no filesystem, no Bun. The
// adapter (`../adapters/fs-git-boundary.ts`) is the one thing that reads spec/STANDARD.md off disk and
// hands this module the text.
//
// `test/architecture/dependency-direction.test.ts` enforces the no-I/O rule mechanically.

/** Every backticked token inside the FIRST §12c paragraph -- from the line starting "**c. Generated/
 *  temporary excludes" through the line containing "actually requires", inclusive -- excluding the
 *  literal word `.gitignore` (named in prose, not itself a class). Mirrors `_s12_generated_classes`'s
 *  awk exactly: a multi-line `inc` flag collects the paragraph into one buffer, then every backtick
 *  pair in it is a class. Includes `.vscode/extensions.json` -- the one explicit carve-out is named in
 *  the SAME sentence, and the caller subtracts it via `extractGeneratedAllowed`, never trims it here
 *  (L-140: an exclusion is judged by what it lets through, not by where it sits in a sentence).
 */
export function extractGeneratedClasses(specText: string): readonly string[] {
  let collecting = false;
  let buf = "";
  for (const line of specText.split("\n")) {
    if (/^\*\*c\. Generated\/temporary excludes/.test(line)) collecting = true;
    if (!collecting) continue;
    buf += " " + line;
    if (/actually requires/.test(line)) collecting = false;
  }

  const tokens: string[] = [];
  const re = /`([^`]+)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(buf))) {
    // `exec` types every capture group as `string | undefined`, even a non-optional one.
    const t = m[1];
    if (t !== undefined && t !== "" && t !== ".gitignore") tokens.push(t);
  }
  return tokens;
}

/** The LAST backticked token before the FIRST "MAY be committed" on each matching line -- §12c's own
 *  explicit permission ("... `.vscode/extensions.json` MAY be committed"). Mirrors `_s12_generated_
 *  allowed`'s awk: only the token immediately preceding the phrase counts (an earlier sibling token on
 *  the same line, e.g. `.vscode/settings.json`, is a CLASS, never a permission). */
export function extractGeneratedAllowed(specText: string): readonly string[] {
  const out: string[] = [];
  const marker = "MAY be committed";
  for (const line of specText.split("\n")) {
    const idx = line.indexOf(marker);
    if (idx === -1) continue;
    const s = line.slice(0, idx + marker.length);
    let last = "";
    const re = /`([^`]+)`/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(s))) {
      const g = m[1];
      if (g !== undefined) last = g;
    }
    if (last !== "") out.push(last);
  }
  return out;
}

/** Every backticked token on a line containing "only assets the app actually uses go in" -- §12's own
 *  words for where a legitimate design ASSET (not a design SOURCE) belongs. Mirrors the inline awk
 *  inside `assert_S12_DESIGNSRC`: single-line, every matching line contributes every token on it (in
 *  practice one line, one sentence, two tokens: `public/`, `src/assets/`). */
export function extractAllowedAssetDirs(specText: string): readonly string[] {
  const out: string[] = [];
  const marker = "only assets the app actually uses go in";
  for (const line of specText.split("\n")) {
    if (!line.includes(marker)) continue;
    const re = /`([^`]+)`/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line))) {
      const g = m[1];
      if (g !== undefined) out.push(g);
    }
  }
  return out;
}
