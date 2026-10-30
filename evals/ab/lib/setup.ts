// Setup sessions (the A1 init, A2's setup) run on the owner-ruled setup model at the CLI's default effort, apart from the trial inventory.
import fs from "node:fs";
import path from "node:path";
import type { Arm } from "./arm.ts";

export function setupModel(): string {
  const inv = JSON.parse(fs.readFileSync(path.join(import.meta.dir, "..", "arms", "inventory.json"), "utf8")) as { setup?: { model?: string } };
  const m = inv.setup?.model;
  if (!m || !/^claude-[a-z0-9-]+$/.test(m)) throw new Error(`inventory.json setup.model must be a full model id, got ${m}`);
  return m;
}

/** The interactive command: the setup model, no --effort flag, the inventory's permission mode, only the pinned plugin. */
export function setupCommand(arm: Pick<Arm, "permissionMode" | "plugin">): string[] {
  if (!arm.plugin) throw new Error("setup needs a pinned plugin");
  return ["claude", "--plugin-dir", arm.plugin.path, "--model", setupModel(), "--permission-mode", arm.permissionMode];
}
