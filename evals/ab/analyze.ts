// Analysis report on slot data: bun evals/ab/analyze.ts (--fixture | --data <slots.json> --schedule <schedule.json>) [--out <report.md>]  (slots.json: bun evals/ab/build-slots.ts)
// Maintainer-only. --fixture uses deterministic fixture slots (not a measurement).
import fs from "node:fs";
import path from "node:path";
import type { SlotKey } from "./lib/validity.ts";
import { analyze, auditAnalysis, renderReport, type Slot } from "./lib/analyze.ts";
import { fixtureSchedule, fixtureSlots } from "./lib/fixture-slots.ts";
import { analysisArm } from "./lib/log.ts";

const argv = process.argv.slice(2);
const flag = (n: string) => (argv.indexOf(`--${n}`) >= 0 ? argv[argv.indexOf(`--${n}`) + 1] : undefined);
const slots: Slot[] = argv.includes("--fixture") ? fixtureSlots() : flag("data") ? JSON.parse(fs.readFileSync(path.resolve(flag("data")!), "utf8")) : (console.error("need --fixture or --data <slots.json>"), process.exit(2));
// the schedule is the frozen grid, passed separately from the data; --data needs --schedule <json of {arm,repo,task,trial}[]>
const schedule: SlotKey[] = argv.includes("--fixture") ? fixtureSchedule() : flag("schedule") ? JSON.parse(fs.readFileSync(path.resolve(flag("schedule")!), "utf8")) : (console.error("--data needs --schedule <schedule.json>"), process.exit(2));
// the frozen schedule names arms as logged (workdoo-a1); the slots carry the analysis arm (A1, section 2): same rule on both sides
const scheduled = schedule.map((k) => ({ ...k, arm: analysisArm(k.arm) }));
const report = analyze(slots, scheduled);
const findings = auditAnalysis(slots, scheduled, report);
const text = renderReport(report) + (findings.length > 0 ? `\n## Audit findings\n\n${findings.map((f) => `- ${f}`).join("\n")}\n` : "");
if (flag("out")) fs.writeFileSync(path.resolve(flag("out")!), text);
else console.log(text);
console.log(`analysis: ${report.state}${findings.length > 0 ? `, ${findings.length} audit finding(s)` : ""}`);
process.exit(findings.length > 0 ? 1 : 0);
