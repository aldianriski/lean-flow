// Caller supplies: transcript/exit directory, run name, worktree root and JSON stream predicates (including optional marker command).
import { streamCli } from "./lib";
if (import.meta.main) streamCli(import.meta.path);
