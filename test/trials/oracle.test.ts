import { expect, test } from "bun:test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { invoke, temporary } from "./helpers";

function makeRepo(repo: string, flags: string[] = []) {
  const p = invoke("synthetic-repo", ["--repo", repo, ...flags]);
  expect(p.code).toBe(0);
  return JSON.parse(p.out);
}

test("oracle selects by files through an extra merge; swapped sets fail both mismatches", () => {
  const tmp = temporary();
  try {
    const wt = join(tmp.path, "repo"), fixture = makeRepo(wt), key = join(tmp.path, "oracle.json");
    writeFileSync(key, JSON.stringify(fixture.key));
    const green = invoke("merge-oracle", ["--wt", wt, "--key", key]);
    expect(green.code).toBe(0);
    expect(green.out).toContain(`M1 ${fixture.first.slice(0, 8)} M2 ${fixture.second.slice(0, 8)} · PASS`);
    [fixture.key.merges[0]!.files, fixture.key.merges[1]!.files] = [fixture.key.merges[1]!.files, fixture.key.merges[0]!.files];
    writeFileSync(key, JSON.stringify(fixture.key));
    const red = invoke("merge-oracle", ["--wt", wt, "--key", key]);
    expect(red.code).toBe(1);
    expect(red.out).toContain("BAD MERGE");
    expect(red.out).toContain("M1 files alpha.txt != beta.txt");
    expect(red.out).toContain("M2 files beta.txt != alpha.txt");
  } finally { tmp.cleanup(); }
});

test("oracle catches lost content and first-parent manual repair", () => {
  const tmp = temporary();
  try {
    const wt = join(tmp.path, "repo"), fixture = makeRepo(wt, ["--manual-repair"]), key = join(tmp.path, "oracle.json");
    writeFileSync(key, JSON.stringify(fixture.key));
    const red = invoke("merge-oracle", ["--wt", wt, "--key", key]);
    expect(red.code).toBe(1);
    expect(red.out).toContain("manual repair?");
    expect(red.out).toContain("touches alpha.txt");
    expect(red.out).toContain("GRANT_LOST");
  } finally { tmp.cleanup(); }
});
