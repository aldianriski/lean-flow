// evals/fixtures/member-anomalies/tree.ts -- SPRINT-128 T3 (TASK-445, TD-188 / TD-190): the retained
// fixture trees for the member resolver's anomalies, shared by every caller's test (authority,
// completeness, observed) so each asserts the SAME population. Trees are built in a temp dir per case,
// not committed: a duplicate task id or a stray task file committed under evals/ would be read by every
// repo-wide store scan, which is the very population defect these fixtures exist to name.
//
// Sprint 950 lists TASK-951 (clean, governed by T1, J1, `g.ts` declared) in every case; the rest of the
// tree is what varies:
//   clean               -- nothing else: the control, resolves with no anomaly
//   ambiguous           -- TASK-951 also exists in done/ (two files for one id)
//   missing             -- ## Members also lists TASK-952, which has no file
//   misplaced-nested    -- an unlisted TASK-953 two levels down (docs/work/todo/sub/)
//   misplaced-root      -- an unlisted TASK-954 directly in docs/work/
//   misplaced-unknown   -- an unlisted TASK-955 in a folder that is not one of the six (docs/work/parked/)
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export type AnomalyCase = "clean" | "ambiguous" | "missing" | "misplaced-nested" | "misplaced-root" | "misplaced-unknown";

export const ANOMALY_CASES: readonly AnomalyCase[] = [
  "clean",
  "ambiguous",
  "missing",
  "misplaced-nested",
  "misplaced-root",
  "misplaced-unknown",
];

const task = (id: string, extra = ""): string =>
  `---\nid: ${id}\nsprint: SPRINT-950\nauthority: J1\n${extra}---\n## Done when\n\n- [ ] \`g.ts\` changes\n`;

function put(root: string, rel: string, text: string): void {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, text);
}

/** Writes the tree for `kind` under `root`; returns the sprint file path (`<root>/docs/sprint/...`). */
export function buildAnomalyTree(root: string, kind: AnomalyCase): string {
  const members = ["docs/work/todo/TASK-951-ok.md"];
  if (kind === "missing") members.push("docs/work/todo/TASK-952-ghost.md");
  const sprint = join(root, "docs/sprint/SPRINT-950-fx.md");
  put(
    root,
    "docs/sprint/SPRINT-950-fx.md",
    `---\nsprint: 950\nslug: fx\nstatus: active\n---\n\n# SPRINT-950 -- member-anomalies fixture\n\n## Members\n\n${members.map((m) => `- ${m}`).join("\n")}\n\n## Plan\n\n### T1 -- the only block \`[size: S · risk: low · class: execution · AFK · J1]\`\nLayers: \`g.ts\`\nDepends-on: none\nCites: \`TASK-951\`\n`,
  );
  put(root, "docs/work/todo/TASK-951-ok.md", task("TASK-951"));
  if (kind === "ambiguous") put(root, "docs/work/done/TASK-951-dup.md", task("TASK-951"));
  if (kind === "misplaced-nested") put(root, "docs/work/todo/sub/TASK-953-nested.md", task("TASK-953"));
  if (kind === "misplaced-root") put(root, "docs/work/TASK-954-loose.md", task("TASK-954"));
  if (kind === "misplaced-unknown") put(root, "docs/work/parked/TASK-955-odd.md", task("TASK-955"));
  return sprint;
}

/** The named finding each non-clean case must produce, and the evidence it must carry. */
export const EXPECTED: Record<Exclude<AnomalyCase, "clean">, { name: string; evidence: string[] }> = {
  ambiguous: { name: "member-ambiguous", evidence: ["TASK-951", "docs/work/done/TASK-951-dup.md", "docs/work/todo/TASK-951-ok.md"] },
  missing: { name: "member-missing", evidence: ["TASK-952"] },
  "misplaced-nested": { name: "member-misplaced", evidence: ["docs/work/todo/sub/TASK-953-nested.md", "nested 1 level(s) below docs/work/todo/"] },
  "misplaced-root": { name: "member-misplaced", evidence: ["docs/work/TASK-954-loose.md", "directly in docs/work/"] },
  "misplaced-unknown": { name: "member-misplaced", evidence: ["docs/work/parked/TASK-955-odd.md", "unknown folder 'parked'"] },
};
