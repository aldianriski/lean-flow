// Arm config: every pin a trial runs under. Read from JSON, validated, then echoed in the run record.
import fs from "node:fs";
import path from "node:path";
import type { PluginPin } from "./pin.ts";

export type Arm = {
  id: string;
  /** full model id of the session, never an alias */
  sessionModel: string;
  /** tier name -> full model id; the `subagent` tier is exported as CLAUDE_CODE_SUBAGENT_MODEL (absent = subagents unpinned) */
  dispatch: Record<string, string>;
  /** extra model ids the run may use without invalidating it (the unpinned-subagent inventory set) */
  allowedModels?: string[] | undefined;
  /** "default" = no --effort flag, the CLI's own default */
  effort: string;
  /** Bash/tool permission patterns passed as --allowedTools; one list per repo, shared by its A0 and A1 */
  allowedTools: string[];
  /** always explicit: the CLI inherits the user's mode otherwise, and `auto` let outside reads through */
  permissionMode: string;
  auth: "subscription" | "api-key";
  /** absent for A0 (no plugin) */
  plugin?: PluginPin | undefined;
  /** absolute path of the frozen repo snapshot a trial copies from */
  snapshot?: string | undefined;
  /** repo-relative path of the JSON file (path -> git blob id) that freezes the snapshot */
  manifest?: string | undefined;
};

/** Pins every arm shares (model inventory, effort, permissions, auth), read from `inventory.json` beside the arm file. */
const INVENTORY_KEYS = ["sessionModel", "dispatch", "allowedModels", "effort", "permissionMode", "auth"] as const;

const EFFORTS = ["default", "low", "medium", "high", "xhigh", "max"];

type Inventory = Partial<Arm> & { allow?: Record<string, string[]> };

export function loadArm(file: string): Arm {
  const own = JSON.parse(fs.readFileSync(file, "utf8")) as Partial<Arm>;
  const invFile = path.join(path.dirname(file), "inventory.json");
  const inv = fs.existsSync(invFile) ? (JSON.parse(fs.readFileSync(invFile, "utf8")) as Inventory) : {};
  // the allow-list is keyed by the repo an arm id names (workdoo-a1 -> workdoo), so A0 and A1 of a repo cannot differ
  const repo = String(own.id ?? "").split("-")[0] ?? "";
  const allowedTools = [...(inv.allow?.common ?? []), ...(inv.allow?.[repo] ?? [])];
  const a = { allowedTools, ...Object.fromEntries(INVENTORY_KEYS.filter((k) => k in inv).map((k) => [k, inv[k]])), ...own } as Arm;
  const bad = (why: string): never => {
    throw new Error(`arm ${file}: ${why}`);
  };
  if (!a.id) bad("missing id");
  if (!/^claude-[a-z0-9-]+$/.test(a.sessionModel ?? "")) bad(`sessionModel must be a full model id (claude-...), got ${a.sessionModel}`);
  for (const [tier, m] of Object.entries(a.dispatch ?? {})) if (!/^claude-[a-z0-9-]+$/.test(m)) bad(`dispatch.${tier} must be a full model id, got ${m}`);
  for (const m of a.allowedModels ?? []) if (!/^claude-[a-z0-9-]+$/.test(m)) bad(`allowedModels entries must be full model ids, got ${m}`);
  if (!EFFORTS.includes(a.effort)) bad(`effort must be one of ${EFFORTS.join("|")}`);
  if (!a.permissionMode) bad("permissionMode must be explicit");
  if (a.auth !== "subscription" && a.auth !== "api-key") bad("auth must be subscription or api-key");
  if (a.plugin && !(a.plugin.path && a.plugin.sha && a.plugin.hash)) bad("plugin needs path, sha and hash");
  if (a.snapshot !== undefined && !path.isAbsolute(a.snapshot)) bad(`snapshot must be an absolute path, got ${a.snapshot}`);
  if (a.manifest !== undefined) {
    if (!a.snapshot) bad("manifest needs a snapshot");
    if (path.isAbsolute(a.manifest) || !a.manifest.endsWith(".json")) bad(`manifest must be a repo-relative .json path, got ${a.manifest}`);
  }
  return a;
}

/** Every model id the arm pins; a model outside this set in the run's usage invalidates the run. */
export function modelInventory(arm: Arm): Set<string> {
  return new Set([arm.sessionModel, ...Object.values(arm.dispatch), ...(arm.allowedModels ?? [])]);
}
