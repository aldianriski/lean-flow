// Arm config: every pin a trial runs under. Read from JSON, validated, then echoed in the run record.
import fs from "node:fs";
import type { PluginPin } from "./pin.ts";

export type Arm = {
  id: string;
  /** full model id of the session, never an alias */
  sessionModel: string;
  /** tier name -> full model id; the `subagent` tier is exported as CLAUDE_CODE_SUBAGENT_MODEL */
  dispatch: Record<string, string>;
  effort: string;
  /** always explicit: the CLI inherits the user's mode otherwise, and `auto` let outside reads through */
  permissionMode: string;
  auth: "subscription" | "api-key";
  /** absent for A0 (no plugin) */
  plugin?: PluginPin;
};

const EFFORTS = ["low", "medium", "high", "xhigh", "max"];

export function loadArm(file: string): Arm {
  const a = JSON.parse(fs.readFileSync(file, "utf8")) as Arm;
  const bad = (why: string): never => {
    throw new Error(`arm ${file}: ${why}`);
  };
  if (!a.id) bad("missing id");
  if (!/^claude-[a-z0-9-]+$/.test(a.sessionModel ?? "")) bad(`sessionModel must be a full model id (claude-...), got ${a.sessionModel}`);
  for (const [tier, m] of Object.entries(a.dispatch ?? {})) if (!/^claude-[a-z0-9-]+$/.test(m)) bad(`dispatch.${tier} must be a full model id, got ${m}`);
  if (!EFFORTS.includes(a.effort)) bad(`effort must be one of ${EFFORTS.join("|")}`);
  if (!a.permissionMode) bad("permissionMode must be explicit");
  if (a.auth !== "subscription" && a.auth !== "api-key") bad("auth must be subscription or api-key");
  if (a.plugin && !(a.plugin.path && a.plugin.sha && a.plugin.hash)) bad("plugin needs path, sha and hash");
  return a;
}

/** Every model id the arm pins; a model outside this set in the run's usage invalidates the run. */
export function modelInventory(arm: Arm): Set<string> {
  return new Set([arm.sessionModel, ...Object.values(arm.dispatch)]);
}
