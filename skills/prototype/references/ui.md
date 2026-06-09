# UI prototype (web projects only)

> **Scope:** this branch assumes a web frontend with a router and a component/styling system
> (React/Next/Tailwind/shadcn/MUI/plain CSS — whatever the project uses). For non-web projects, the
> UI branch doesn't apply; use the logic branch (`logic.md`) or a different tool.

Generate **several radically different UI variations** on a single route, switchable from a floating
bottom bar. The user flips between variants in the browser, picks one (or steals bits from each),
then throws the rest away. Use for "what should this page look like?" / "show me a few options before
I commit." If the question is about logic/state → wrong branch, use `logic.md`.

## Two sub-shapes — strongly prefer A

A variant is far easier to judge butting up against the real app (real header, sidebar, data,
density). An isolated route is a vacuum where every variant looks fine.

- **Sub-shape A — adjust an existing page (preferred).** Variants render on the same route, gated by a `?variant=` URL param; existing data fetching, params, and auth stay — only the rendering swaps. Something with no page yet but that *would live inside one* (a new dashboard section, a new card) is still A — mount the variants inside the host page.
- **Sub-shape B — a new throwaway route (last resort).** Only when there's genuinely no existing page to embed in. Follow the project's routing convention (don't invent a top-level structure); put `prototype` in the path/name; same `?variant=` pattern.

## Process

1. **State the question and pick N** — default **3** variants; cap at 5 (more stops being radically different). One-line plan at the top: *"Three variants of /settings, switchable via `?variant=`, on the existing route."*
2. **Generate radically different variants** — each held to the page's purpose + data and the project's component library. Export clear names (`VariantA`, …). They must be **structurally** different — different layout, hierarchy, primary affordance — not different colours. Two similar drafts → redo one with "do not reuse that layout".
3. **Wire them** — one switcher on the route: `variant = searchParams.get('variant') ?? 'A'`, render the matching component + `<PrototypeSwitcher>`. Sub-shape A keeps existing data fetching above the switcher; only the subtree changes.
4. **Floating switcher** — fixed bottom-centre bar: left arrow (prev, wraps) · variant label (`B — Sidebar layout`) · right arrow (next). Clicking updates the URL param via the framework router (shareable, reload-stable); `←`/`→` keys also cycle (not when an input/textarea/contenteditable is focused). Visually distinct from the page. **Hidden in production** (`NODE_ENV !== 'production'`) so a stray merge can't ship it. One shared component for both sub-shapes.
5. **Hand it over** — surface the URL + the `?variant=` keys. The gold feedback is usually "I want the header from B with the sidebar from C" — that's the real design.
6. **Capture + clean up** — record the winner + why (ADR / PRD snippet / `NOTES.md`). Sub-shape A → delete losing variants + switcher, fold the winner into the page. Sub-shape B → promote the winner to a real route, delete the throwaway route + switcher.

## Anti-patterns

- **Variants differing only in colour/copy** — that's a tweak; real variants disagree about structure.
- **Sharing too much** — a shared `<Header>` is fine; a shared `<Layout>` defeats the point.
- **Wiring variants to real mutations** — read-only, or point at a stub. The question is "what should this look like", not "does the backend work".
- **Promoting the prototype to production as-is** — it was written under prototype constraints (no tests, minimal error handling). Rewrite it properly when folding in.
