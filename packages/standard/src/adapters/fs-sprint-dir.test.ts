import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FsSprintDirPort } from "./fs-sprint-dir.ts";

function freshRepo(): string {
  return mkdtempSync(join(tmpdir(), "fs-sprint-dir-"));
}

describe("FsSprintDirPort — the real Bun adapter, against an actual filesystem", () => {
  test("no docs/sprint/ at all", () => {
    const repo = freshRepo();
    const port = new FsSprintDirPort(repo);
    expect(port.hasSprintDir()).toBe(false);
    expect(port.listSprintDirEntries()).toEqual([]);
  });

  test("lists direct file entries, sorted order not assumed", () => {
    const repo = freshRepo();
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x.md"), "# plan");
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x-log.md"), "log");
    const port = new FsSprintDirPort(repo);
    expect(port.hasSprintDir()).toBe(true);
    expect([...port.listSprintDirEntries()].sort()).toEqual(["SPRINT-001-x-log.md", "SPRINT-001-x.md"]);
  });

  test("a subdirectory (docs/sprint/logs/) is never listed as an entry — files only, non-recursive", () => {
    const repo = freshRepo();
    mkdirSync(join(repo, "docs", "sprint", "logs"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "logs", "SPRINT-001-x-log.md"), "log");
    const port = new FsSprintDirPort(repo);
    expect(port.listSprintDirEntries()).toEqual([]);
  });
});
