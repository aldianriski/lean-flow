# Deepening — vocabulary, dependency categories, design-it-twice

Companion to `/refactor-advisor`. Shared language for every suggestion — use these terms exactly,
don't drift into "component / service / API / boundary". Consistent language is the whole point.

## Vocabulary

| Term | Means | Avoid |
|---|---|---|
| **Module** | anything with an interface + an implementation; scale-agnostic (function → package) | unit, component, service |
| **Interface** | everything a caller must know: signature **+ invariants, ordering, error modes, config, perf** | API, signature (too narrow) |
| **Implementation** | the code inside the module | — |
| **Depth** | leverage at the interface — behaviour exercised per unit of interface learned. Deep = much behind a small interface; shallow = interface ≈ implementation | — |
| **Seam** (Feathers) | where you can alter behaviour without editing in place; *where* the interface lives | boundary (DDD-overloaded) |
| **Adapter** | a concrete thing satisfying an interface at a seam (role, not substance) | — |
| **Leverage** | what callers get from depth | — |
| **Locality** | what maintainers get — change, bugs, knowledge concentrate in one place | — |

## Principles

- **Depth is a property of the interface, not the implementation.** A deep module can be internally composed of small, swappable parts — they just aren't part of the interface (internal seams ≠ the external seam).
- **Deletion test** — delete the module: complexity vanishes → pass-through; complexity reappears across N callers → it earned its keep.
- **The interface is the test surface** — callers and tests cross the same seam. Testing *past* the interface = wrong shape.
- **One adapter = a hypothetical seam; two = a real one.** Don't add a port unless something varies across it.
- Depth-as-**leverage**, NOT Ousterhout's impl-lines ÷ interface-lines (that rewards padding the implementation).

## Dependency categories (determines how the deepened module is tested)

1. **In-process** — pure computation / in-memory, no I/O. Always deepenable; merge and test through the new interface directly. No adapter.
2. **Local-substitutable** — has a local test stand-in (PGLite for Postgres, in-memory FS). Deepenable; test with the stand-in. Seam is internal — no port at the external interface.
3. **Remote but owned (ports & adapters)** — your own services across the network. Define a **port** at the seam; logic lives in the deep module, transport is an injected **adapter** (in-memory for tests, HTTP/gRPC/queue for prod).
4. **True external (mock)** — third-party you don't control (Stripe, Twilio). Injected port; tests provide a mock adapter.

## Testing strategy: replace, don't layer

- Old unit tests on the shallow modules become waste once tests at the deepened interface exist — **delete them**.
- Write new tests at the deepened module's interface; assert on observable outcomes, not internal state.
- A test that must change when the implementation changes is testing past the interface — rewrite it.

## Design it twice (inline — no agent fan-out)

Your first interface idea is rarely the best (Ousterhout). For a chosen candidate, sketch **2–3
radically different** interfaces, each under a different constraint:

- **Minimal** — 1–3 entry points; maximise leverage per entry point.
- **Flexible** — support many use cases + extension.
- **Common-case-trivial** — make the default caller's path trivial.

For each: the interface (types/methods **+ invariants, ordering, error modes**) · a usage example ·
what it hides behind the seam · dependency strategy + adapters · trade-offs (where leverage is thin).
Then compare by **depth · locality · seam placement** and recommend one — or a hybrid. Be opinionated.
Name things with both this vocabulary and the project's domain glossary (`CONTEXT.md`).
