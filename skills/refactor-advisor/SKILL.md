---
name: refactor-advisor
description: Use when code has become hard to change — surface deepening opportunities that turn shallow modules into deep ones (small interface, lots of behaviour) for testability and AI-navigability. Informed by the domain glossary (CONTEXT.md) and ADRs. Do not use to debug a failure (use /diagnose) or to build new behaviour (use /tdd); this finds and designs refactors, it doesn't chase bugs.
argument-hint: "[area / module to review, or blank for a sweep]"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
version: "0.1.0"
---

# refactor-advisor

Surface architectural friction and propose **deepening** — refactors that turn shallow modules into
deep ones. The aim is testability and AI-navigability. Markdown only, no agents, read-then-propose.

This is the home for `/diagnose`'s Phase-6 finding ("no good test seam = architecture preventing
lockdown") and `/tdd`'s "shallow module → deepen" candidates.

## Vocabulary (use these exactly — full definitions → `${CLAUDE_SKILL_DIR}/references/deepening.md`)

- **Module** — anything with an interface + an implementation (function, class, package, slice).
- **Interface** — everything a caller must know: types, invariants, ordering, error modes, config. Not just the signature.
- **Depth** — leverage at the interface: lots of behaviour behind a small interface. **Deep** = high leverage; **shallow** = interface nearly as complex as the implementation.
- **Seam** — where the interface lives; a place to alter behaviour without editing in place. (Say *seam*, not "boundary".)
- **Adapter** — a concrete thing satisfying an interface at a seam. **Leverage** = what callers get; **locality** = what maintainers get.

Three rules that do most of the work:
- **Deletion test** — imagine deleting the module. Complexity vanishes → it was a pass-through. Complexity reappears across N callers → it earned its keep.
- **The interface is the test surface** — callers and tests cross the same seam. Needing to test *past* the interface = wrong shape.
- **One adapter = a hypothetical seam; two = a real one.** Don't add a port unless something actually varies across it.

## Process

### 1. Explore
Read the domain glossary (`CONTEXT.md`) + ADRs in the area first — the glossary names good seams; ADRs record decisions not to re-litigate. Then walk the code, noting friction (don't follow rigid heuristics):
- Understanding one concept means bouncing between many small modules.
- Modules where the interface is nearly as complex as the implementation (**shallow**).
- Pure functions extracted only for testability, while the real bugs hide in how they're called (no **locality**).
- Tightly-coupled modules leaking across their seams; parts hard to test through the current interface.

Apply the **deletion test** to anything you suspect is shallow.

### 2. Present candidates (markdown)
For each: **Files** · **Problem** (one line) · **Solution** (one line) · **Wins** (in terms of locality / leverage / how tests improve) · **Before → After** (prose, or a small mermaid block if graph-shaped) · **Strength** (`Strong` / `Worth exploring` / `Speculative`) · **Dependency category** (in-process / local-substitutable / ports & adapters / mock — see reference). Flag an **ADR conflict** only when the friction is real enough to reopen the ADR. End with a **Top recommendation**. Use glossary vocab for the domain, deepening vocab for the architecture. Then ask which to explore — don't design interfaces yet.

### 3. Grill the chosen candidate
Walk the design tree with the user — constraints, dependency category, the shape of the deepened module, what sits behind the seam, which tests survive. Side effects happen inline as decisions crystallise:
- New concept named? → add the term to the glossary (`CONTEXT.md`), opinionated canonical + `_Avoid_`.
- Load-bearing rejection? → offer an ADR — *only* if a future explorer would otherwise re-suggest it (skip ephemeral/self-evident reasons).
- Want alternative interfaces? → **design it twice**, inline: sketch 2–3 *radically different* interfaces (minimal / flexible / common-case-trivial), compare by depth · locality · seam placement, then recommend one (or a hybrid). Be opinionated.

Actionable refactors become `TASK-NNN` (via `/task-decomposer`) or a `TD-NNN` tech-debt entry — never a silent in-place rewrite.

## Red flags

❌ **A single-adapter seam** — one adapter is indirection, not a seam; needs two (prod + test) to be real.
❌ **Testing past the interface** — if a test must reach behind the seam, the module is the wrong shape.
❌ **Layering new tests over old shallow-module tests** — replace them; the deepened interface is the test surface.
❌ **Re-litigating an ADR** — surface a conflict only when the friction warrants reopening it.
❌ **Refactoring in place from this skill** — it finds + designs; execution goes through a task, gated by `/orchestrator`.
