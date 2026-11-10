// Caller supplies: transcript/exit directory, run name, worktree root and JSON stream predicates (including box globs).
import { streamCli } from "./lib";
if (import.meta.main) streamCli(import.meta.path);
