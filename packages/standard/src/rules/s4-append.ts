// S4.APPEND (spec/STANDARD.md §4 -- Gated, mechanical via git history) -- SPRINT-091 T7. §4's only
// rule answerable from the RECORD rather than the tree: a decided ADR's own § Decision body is
// compared against the same section at its DECIDING commit (the first revision, oldest-first, whose
// Status reads accepted). Everything §4 explicitly permits after a decision -- deprecated/superseded
// markers, a `Scope amended by:` bullet -- lands in the HEADER, leaving § Decision untouched, so the
// permitted path passes without needing to be enumerated (mirrors the Shell oracle's own comment:
// this repo's own ADR-008/ADR-027 carry exactly such markers and must not redden here).
//
// Net-effect semantics, stated rather than hidden (mirrors the Shell oracle exactly): an edit later
// reverted reads as unedited -- the alternative, walking every intermediate revision, would report a
// defect that no longer exists in a file whose current text is exactly what was decided.
//
// History that cannot answer is REPORTED, never guessed at, and "no history" (not a git repo) stays
// distinct from "truncated history" (a shallow clone) -- they mean different things to an adopter, and
// collapsing them into one note is the false negative A3 exists to prevent.
//
// Domain layer (V3 §2.1). Imports only `../model.ts`, `../result.ts`, `./adr-family-port.ts`,
// `./adr-history-port.ts`, `./adr-family.ts` -- no Bun, no `node:fs`, no `node:child_process`. The
// port is the intersection `AdrFamilyPort & AdrHistoryPort` (T7's own choice, recorded in the sprint
// report): `AdrFamilyPort` stays exactly as T6 left it, unedited -- extending it would force every
// tree-only rule's fake/adapter to grow git methods it never calls.

import { makeRuleId } from "../model.ts";
import type { Finding, RuleEvaluation } from "../result.ts";
import type { AdrFamilyPort } from "./adr-family-port.ts";
import type { AdrHistoryPort } from "./adr-history-port.ts";
import { canonicalAdrs, sectionBody } from "./adr-family.ts";

export const RULE_ID = makeRuleId("S4.APPEND");

/** The named finding this rule raises -- matches the Shell oracle's own `bad()` prefix byte-for-byte. */
export const ADR_EDITED_AFTER_DECISION = "adr-edited-after-decision";

/** `^status: *accepted` or `^- **Status:** *accepted`, case-insensitive, anchored at line start --
 *  mirrors the Shell oracle's own `grep -qiE '^status: *accepted|^- \*\*Status:\*\* *accepted'`. */
const ACCEPTED_STATUS_RE = /^(?:status: *accepted|- \*\*status:\*\* *accepted)/im;

function isAcceptedStatus(text: string): boolean {
  return ACCEPTED_STATUS_RE.test(text);
}

/** Strips ALL trailing newlines -- mirrors `$(...)` command substitution's own trimming, which is
 *  what both `then_body` and `now_body` pass through in the Shell oracle before `[ = ]` compares
 *  them. Without this, a section ending in blank lines would read as "edited" on whitespace alone. */
function trimTrailingNewlines(text: string): string {
  return text.replace(/\n+$/, "");
}

/** Normalizes `\r\n` to `\n` before a content comparison -- a committed blob (git's own `core.
 *  autocrlf` normalizes to LF on `add`) and a CHECKED-OUT working-tree file (CRLF on a Windows clone
 *  with autocrlf on) are the SAME content in two line-ending representations, and the Shell oracle's
 *  own MSYS/git-bash toolchain already treats them as equal (verified live: an unedited ADR checked
 *  out with CRLF passes the Shell oracle). Without this, every ADR on a CRLF checkout would read as
 *  "edited" on whitespace alone -- discovered live during T7's own oracle-parity run, not assumed. */
function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

export function evaluate(port: AdrFamilyPort & AdrHistoryPort): RuleEvaluation {
  const adrs = canonicalAdrs(port);
  if (adrs.length === 0) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      findings: [],
      detail: "no canonical ADR files -- nothing to verify",
    };
  }

  if (!port.isGitRepo()) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      findings: [],
      detail:
        "history unavailable: this repo is not a git repository, so whether a decided ADR was " +
        "edited cannot be answered. Reported rather than passed -- the absence of a record is not " +
        "evidence that nothing happened",
    };
  }

  if (port.isShallowClone()) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      findings: [],
      detail:
        "history truncated: this repo is a shallow clone, so a deciding commit older than the fetch " +
        "depth is unreachable. Distinct from having no repository at all, and reported rather than " +
        "passed: a truncated history that reads as clean is the false negative this rule exists to prevent",
    };
  }

  const findings: Finding[] = [];
  let nClean = 0;
  let nUndecided = 0;

  for (const a of adrs) {
    // Oldest-first, so the FIRST revision carrying an accepted status is the deciding one. A file
    // proposed first and accepted later is measured from the acceptance, not from creation.
    const revs = port.revisionsTouching(a);
    if (revs.length === 0) continue; // untracked/added since the last commit -- nothing to compare

    let deciding: string | undefined;
    let decidingText: string | undefined;
    for (const r of revs) {
      const text = port.readAtRevision(r, a);
      if (text !== null && isAcceptedStatus(text)) {
        deciding = r;
        decidingText = text;
        break;
      }
    }
    if (deciding === undefined || decidingText === undefined) {
      nUndecided++;
      continue;
    }

    const thenBody = trimTrailingNewlines(sectionBody(normalizeLineEndings(decidingText), "Decision"));
    const nowBody = trimTrailingNewlines(sectionBody(normalizeLineEndings(port.readFile(a) ?? ""), "Decision"));
    if (thenBody === nowBody) {
      nClean++;
      continue;
    }

    const short = port.shortRevision(deciding);
    findings.push({
      name: ADR_EDITED_AFTER_DECISION,
      detail:
        `adr-edited-after-decision: ${a} -- § Decision differs from the text accepted at ${short}. ` +
        `§4 is append-only: a decided ADR is marked deprecated or superseded, never rewritten, ` +
        `because the record of what was decided is the only thing that makes the reasoning ` +
        `auditable later. A post-decision MARKER in the header is the supported path and does not trip this`,
    });
  }

  if (findings.length > 0) {
    return {
      ruleId: RULE_ID,
      verdict: "fail",
      findings,
      detail: `${findings.length} ADR(s) edited after their deciding commit -- §4 is append-only`,
    };
  }

  if (nClean === 0) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      findings: [],
      detail:
        `no ADR has reached an accepted status yet (${nUndecided} still proposed); there is no ` +
        `decision to have been edited`,
    };
  }

  return {
    ruleId: RULE_ID,
    verdict: "pass",
    findings: [],
    detail:
      `${nClean} ADR(s) unedited since their deciding commit` +
      (nUndecided > 0 ? ` (${nUndecided} not yet accepted)` : ""),
  };
}
