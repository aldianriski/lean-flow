// Fixture: a TEST caller of orphanWidget. Proves a test caller does not count as wiring -- the
// checker must still report orphanWidget unwired even though this file imports and calls it.

import { test } from "bun:test";
import { orphanWidget } from "./gadget.ts";

test("orphanWidget", () => {
  orphanWidget();
});
