// Caller supplies: worktree and JSON key with base, branch, merge selectors/sets, content and manual-repair predicates.
import { basename } from "node:path";
import { args, cli, git, gitResult, readJson, required } from "./lib";

export type OracleKey = {
  base: string; branch: string; excludePaths?: string[];
  merges: { name: string; include: string[]; exclude?: string[]; files: string[] }[];
  manualRepair: { after: string; paths: string[] };
  content: { name: string; path: string; includes?: string[]; matches?: string[]; rejects?: string[];
    select?: string; section?: { start: string; end: string }; unchanged?: boolean }[];
};
export function oracle(wt: string, key: OracleKey) {
  if (!key.base || !key.branch || !key.merges?.length || !key.manualRepair || !Array.isArray(key.content))
    throw new Error("key needs base, branch, merges, manualRepair and content");
  const base = git(wt, ["rev-parse", "--verify", `${key.base}^{commit}`]);
  const branch = git(wt, ["rev-parse", "--verify", `${key.branch}^{commit}`]);
  const lines = (s: string) => s.split(/\r?\n/).filter(Boolean);
  const excluded = (f: string) => key.excludePaths?.some(p => new RegExp(p).test(f));
  const merges = lines(git(wt, ["log", "--merges", "--reverse", "--format=%H", `${base}..${branch}`]));
  const files = new Map(merges.map(m => [m, lines(git(wt, ["diff", "--name-only", `${m}^1`, m]))
    .filter(f => !excluded(f)).sort()]));
  const failures: string[] = [], selected: Record<string, string | undefined> = {};
  let previous = -1;
  for (const spec of key.merges) {
    const m = merges.find(m => spec.include.every(f => files.get(m)!.includes(f)) &&
      !(spec.exclude ?? []).some(f => files.get(m)!.includes(f)));
    selected[spec.name] = m;
    if (!m) { failures.push(`no ${spec.name} merge found`); continue; }
    const actual = files.get(m)!;
    if (JSON.stringify(actual) !== JSON.stringify([...spec.files].sort()))
      failures.push(`${spec.name} files ${actual.join(",")} != ${spec.files.join(",")}`);
    if (git(wt, ["rev-list", "--parents", "-n1", m]).split(" ").length !== 3)
      failures.push(`${spec.name} not a two-parent merge`);
    if (merges.indexOf(m) <= previous) failures.push(`queue order: ${spec.name} merged out of order`);
    previous = merges.indexOf(m);
    const ancestor = gitResult(wt, ["merge-base", "--is-ancestor", base, `${m}^2`]);
    if (ancestor.code !== 0) failures.push(`${spec.name} branch does not descend from base`);
  }
  const after = selected[key.manualRepair.after];
  if (!key.merges.some(m => m.name === key.manualRepair.after)) throw new Error("unknown manualRepair.after selector");
  if (after) for (const c of lines(git(wt, ["log", "--first-parent", "--no-merges", "--format=%H", `${after}..${branch}`]))) {
    const hit = lines(git(wt, ["diff-tree", "--no-commit-id", "--name-only", "-r", c]))
      .filter(f => !excluded(f) && key.manualRepair.paths.includes(f));
    if (hit.length) failures.push(`manual repair? ${c.slice(0, 8)} touches ${hit.join(",")}`);
  }
  for (const spec of key.content) {
    const extract = (rev: string): string => {
      let text = git(wt, ["show", `${rev}:${spec.path}`]);
      if (spec.section) {
        const start = new RegExp(spec.section.start, "m").exec(text);
        if (!start) throw new Error("section missing");
        text = text.slice(start.index + start[0].length).split(new RegExp(spec.section.end, "m"))[0] ?? "";
      }
      if (spec.select) {
        const match = new RegExp(spec.select, "m").exec(text);
        if (!match) throw new Error("selection missing");
        text = match[1] ?? match[0];
      }
      return text;
    };
    try {
      const text = extract(branch);
      if ((spec.includes ?? []).some(s => !text.includes(s)) ||
          (spec.matches ?? []).some(p => !new RegExp(p, "im").test(text)) ||
          (spec.rejects ?? []).some(p => new RegExp(p, "im").test(text)) ||
          (spec.unchanged && text !== extract(base))) failures.push(spec.name);
    } catch (error) { failures.push(`${spec.name}: ${error instanceof Error ? error.message : error}`); }
  }
  const markers = gitResult(wt, ["grep", "-n", "-E", "^(<<<<<<<|>>>>>>>) ", branch]);
  if (markers.code === 0) failures.push(`conflict markers: ${lines(markers.out).length}`);
  else if (markers.code !== 1) throw new Error(markers.err || "conflict-marker scan failed");
  return { failures, selected };
}
const usage = "usage: bun --no-env-file scripts/trials/merge-oracle.ts --wt DIR --key JSON [--branch REF]";
if (import.meta.main) cli(usage, () => {
  const a = args(usage), wt = required(a, "--wt"), key = readJson<OracleKey>(required(a, "--key"));
  if (a["--branch"]) key.branch = required(a, "--branch");
  const result = oracle(wt, key);
  console.log(`merge-oracle ${basename(wt)}: ${Object.entries(result.selected).map(([name, sha]) => `${name} ${sha?.slice(0, 8)}`).join(" ")} · ${result.failures.length ? "BAD MERGE" : "PASS"}`);
  for (const f of result.failures) console.log(`  ${f}`);
  process.exitCode = result.failures.length ? 1 : 0;
});
