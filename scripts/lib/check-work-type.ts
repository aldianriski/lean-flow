// Optional work-item types (SPRINT-159 T2 / TASK-591).
// Usage: bun scripts/lib/check-work-type.ts <repo-root>
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { FOLDERS, frontmatterField, section } from "./sprint-members.ts";

const root = process.argv[2];
if (!root) {
  console.error("usage: bun scripts/lib/check-work-type.ts <repo-root>");
  process.exit(2);
}
if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.log(`FAIL  work-type: repo root not found at ${root}`);
  process.exit(2);
}

let pass = 0;
let fail = 0;
function bad(message: string): void {
  console.log(`FAIL  ${message}`);
  fail++;
}

// Enumerate only immediate task files in the six status folders, never evidence/.
for (const folder of FOLDERS) {
  const dir = join(root, "docs/work", folder);
  if (!existsSync(dir)) continue;
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !/^TASK-.*\.md$/.test(entry.name)) continue;
    const path = `docs/work/${folder}/${entry.name}`;
    const content = readFileSync(join(dir, entry.name), "utf8");
    const type = frontmatterField(content, "type") ?? "feature";
    if (!["feature", "bug", "debt"].includes(type)) {
      bad(`work-type-unknown ${path}: type '${type}' is not feature, bug or debt`);
    } else if (type === "bug" && section(content, "Repro") === null) {
      bad(`bug-item-missing-repro ${path}: a type: bug item has no '## Repro' section`);
    } else if (type === "debt" && !/\bTD-\d+\b/.test(content)) {
      bad(`debt-item-missing-td ${path}: a type: debt item cites no TD-NNN`);
    } else {
      console.log(`PASS  work-type ${path}: type '${type}'`);
      pass++;
    }
  }
}

console.log(`WORK-TYPE: ${fail ? "FAIL" : "PASS"} (${pass} PASS, ${fail} FAIL)`);
process.exit(fail ? 1 : 0);
