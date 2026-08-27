// Shared §4 ADR-document vocabulary (SPRINT-091 T6): what a "canonical" ADR filename looks like, and
// how to read the six-section template's own bullets/headings out of one ADR's text. Consumed by
// `s4-index.ts`, `s4-sections.ts` and `s4-negative.ts`; `s4-onefile.ts` owns the noncanonical-naming
// judgment itself, since that IS its rule (mirrors `git-boundary-spec.ts` being the shared parsing
// layer several `s12-*.ts` evaluators pull from, not a rule of its own).
//
// Domain layer (V3 §2.1). Imports only `./adr-family-port.ts`'s type -- no Bun, no `node:fs`.

import type { AdrFamilyPort } from "./adr-family-port.ts";

/** `ADR-NNN-<slug>.md` -- three digits, a hyphen, at least one more character, `.md`. Mirrors the
 *  Shell oracle's own glob `ADR-[0-9][0-9][0-9]-?*.md` case pattern exactly (the `?*` is "one or more
 *  of any character"). */
export const ADR_CANONICAL_NAME_RE = /^ADR-\d{3}-.+\.md$/;

export function isCanonicalAdrName(basename: string): boolean {
  return ADR_CANONICAL_NAME_RE.test(basename);
}

/**
 * Repo-relative paths of every canonically-NAMED ADR sitting directly in `docs/adr/`, sorted
 * ascending -- mirrors the Shell oracle's own `_adr_canonical`. A duplicated number is NOT resolved
 * here: both files sharing a number are still canonically named, so both are included once each --
 * S4.ONEFILE alone judges the duplicate, and INDEX/SECTIONS/NEGATIVE each independently see (and can
 * independently flag) every canonically-named file, exactly as the Shell oracle's own
 * `duplicate-number` fixture demonstrates (S4.INDEX fires a SECOND time there, for the unindexed
 * duplicate, not just S4.ONEFILE).
 */
export function canonicalAdrs(port: AdrFamilyPort): readonly string[] {
  if (!port.hasAdrDir()) return [];
  return port
    .listAdrDirMdFiles()
    .filter(isCanonicalAdrName)
    .map((basename) => `docs/adr/${basename}`)
    .slice()
    .sort();
}

/** Does any line start with `## <heading>` -- matched as a PREFIX of the heading text, so
 *  `"## Alternatives considered"` answers to `"Alternatives"`. Mirrors the Shell oracle's own
 *  `grep -qE "^## $s"` (no trailing anchor, so a longer heading still matches at its start). */
export function hasHeadingSection(text: string, heading: string): boolean {
  const prefix = `## ${heading}`;
  return text.split("\n").some((line) => line.startsWith(prefix));
}

/** Does any line open a `## <heading>` heading OR a `- **<heading>:**`/`- **<heading>**` bullet --
 *  §4's template renders Status/Deciders as header BULLETS, not headings. Mirrors the Shell oracle's
 *  own `grep -qE "^- \*\*$s:?\*\*|^## $s"`. */
export function hasBulletOrHeadingSection(text: string, heading: string): boolean {
  const bulletRe = new RegExp(`^- \\*\\*${heading}:?\\*\\*`);
  const headingPrefix = `## ${heading}`;
  return text.split("\n").some((line) => bulletRe.test(line) || line.startsWith(headingPrefix));
}

/**
 * The body of a `## <heading>` section -- every line after it up to (not including) the next `## `
 * heading, matched as a PREFIX the same way `hasHeadingSection` does. Mirrors the Shell oracle's own
 * `_adr_section` awk function byte-for-byte in behaviour: `inside` flips to a fresh prefix test at
 * every `## ` line, so a section with no following `## ` heading runs to the end of the text.
 */
export function sectionBody(text: string, heading: string): string {
  const prefix = `## ${heading}`;
  const out: string[] = [];
  let inside = false;
  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) {
      inside = line.startsWith(prefix);
      continue;
    }
    if (inside) out.push(line);
  }
  return out.join("\n");
}
