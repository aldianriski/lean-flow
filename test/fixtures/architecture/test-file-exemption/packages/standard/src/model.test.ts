import { test } from "bun:test";
import { readFileSync } from "node:fs";
test("x", () => { void readFileSync; });
