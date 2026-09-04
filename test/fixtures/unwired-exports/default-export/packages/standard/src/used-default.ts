// Fixture: a WIRED default export (anonymous class form), imported and used by
// apps/cli/src/main.ts under a locally-chosen name -- proving the checker does not require the
// importer's local binding name to match anything.

export default class {
  value(): number {
    return 2;
  }
}
