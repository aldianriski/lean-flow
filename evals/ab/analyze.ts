// Analysis report on slot data: bun evals/ab/analyze.ts (--fixture | --data <slots.json> --schedule <schedule.json>) [--out <report.md>] [--comparator <arm>]  (slots.json: bun evals/ab/build-slots.ts)
// Maintainer-only. --fixture uses deterministic fixture slots (not a measurement).
// Combined data (Amendment 6 item 7, A2 against A1 on S0's slots plus A2's): --data and --schedule each take a comma-separated list,
// paired by position (one build-slots output per log, each with its own schedule); slots and schedules are concatenated.
import fs from "node:fs";
import path from "node:path";
import type { SlotKey } from "./lib/validity.ts";
import { analyze, auditAnalysis, compareTo, renderComparison, renderReport, type Slot } from "./lib/analyze.ts";
import { fixtureSchedule, fixtureSlots } from "./lib/fixture-slots.ts";
import { analysisArm } from "./lib/log.ts";

const argv = process.argv.slice(2);
const flag = (n: string) => (argv.indexOf(`--${n}`) >= 0 ? argv[argv.indexOf(`--${n}`) + 1] : undefined);
const list = (n: string) => flag(n)!.split(",").map((f) => JSON.parse(fs.readFileSync(path.resolve(f), "utf8")));
// --data is build-slots output: {slots, voidedUsd} (a bare slot array is accepted too)
const datas: (Slot[] | { slots: Slot[]; voidedUsd?: number })[] = argv.includes("--fixture") ? [fixtureSlots()] : flag("data") ? list("data") : (console.error("need --fixture or --data <slots.json>"), process.exit(2));
const slots: Slot[] = datas.flatMap((d) => (Array.isArray(d) ? d : d.slots));
const comparator = flag("comparator");
if (argv.includes("--comparator") && (!comparator || comparator.startsWith("--"))) (console.error("--comparator needs an analysis arm label"), process.exit(2));
if (comparator !== undefined && !slots.some((s) => s.arm === comparator)) (console.error(`comparator arm ${comparator} is not in the data`), process.exit(2));
const voidedUsd = datas.reduce((n, d) => n + (Array.isArray(d) ? 0 : d.voidedUsd ?? 0), 0);
// the schedule is the frozen grid, passed separately from the data; --data needs --schedule <json of {arm,repo,task,trial}[]>
const schedules: SlotKey[][] = argv.includes("--fixture") ? [fixtureSchedule()] : flag("schedule") ? list("schedule") : (console.error("--data needs --schedule <schedule.json>"), process.exit(2));
if (schedules.length !== datas.length) (console.error(`--data names ${datas.length} file(s) but --schedule names ${schedules.length}; they pair by position`), process.exit(2));
const schedule: SlotKey[] = schedules.flat();
// the frozen schedule names arms as logged (workdoo-a1); the slots carry the analysis arm (A1, section 2): same rule on both sides
const scheduled = schedule.map((k) => ({ ...k, arm: analysisArm(k.arm) }));
const report = analyze(slots, scheduled);
const findings = auditAnalysis(slots, scheduled, report);
// usage-limit (voided) attempts: their notional spend is its own line of the total, in no D5 or scored figure
const voidedLine = voidedUsd > 0 ? `
## Voided attempts

Attempts voided, usage-limit or owner-ruled harness defect (notional, outside every figure above): ${voidedUsd.toFixed(4)} USD; total spend including them: ${((report.spend?.totalUsd ?? 0) + voidedUsd).toFixed(4)} USD.
` : "";
const comparison = comparator === undefined ? "" : renderComparison(compareTo(slots, report, comparator));
const text = renderReport(report) + comparison + voidedLine + (findings.length > 0 ? `\n## Audit findings\n\n${findings.map((f) => `- ${f}`).join("\n")}\n` : "");
if (flag("out")) fs.writeFileSync(path.resolve(flag("out")!), text);
else console.log(text);
console.log(`analysis: ${report.state}${findings.length > 0 ? `, ${findings.length} audit finding(s)` : ""}`);
process.exit(findings.length > 0 ? 1 : 0);
