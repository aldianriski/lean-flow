# Question set: React + Vite

**DETECT** — `react` and `@vitejs/plugin-react` (or `@vitejs/plugin-react-swc`) appear in
`package.json` dependencies or devDependencies, and none of `next`, `@remix-run/*`,
`@react-router/dev`, `@tanstack/react-start`, `astro`, `vike`, `waku` is present (those own routing
and build). Read the root `package.json`; in a workspace, each workspace package.

Ask a question only if its **marker** search of the tree finds no clear answer. A clear answer is one
choice found and used consistently; two or more, or none, leave the question open. Every answer is one
line in `## Conventions in use`.

1. **Server state** — where fetched data lives and with what. Marker: `@tanstack/react-query`, `swr`,
   `@apollo/client` in `package.json`, or RTK Query (`createApi` usage, not `@reduxjs/toolkit` alone);
   or `fetch(` / `axios` / a client SDK called inside components or hooks.
2. **Component folders** — by feature or by type. Marker: top-level `src/` folders named
   `features/` or `modules/` (feature) versus `components/` + `hooks/` + `pages/` (type). Mixed → ask.
3. **Styling** — the one approach new components follow. Marker: `tailwindcss`, `styled-components`,
   `@emotion/*`, `*.module.css`, or plain `.css` imports; ignore the single global entry stylesheet
   (e.g. `index.css`, `main.css`) when counting approaches.
4. **Forms and validation** — form library and schema choice. Marker: `react-hook-form` or `formik`,
   or hand-written `useState` forms; `zod` / `yup` alone does not settle the form library.
5. **Component tests** — the expected level. Marker: existing `*.test.*` files beside components show
   it; an installed test library (`@testing-library/react`, `vitest`, `jest`, `playwright`, `cypress`)
   does not. No such files → ask.
6. **Env and config** — how runtime config is read. Marker: `import.meta.env` reads, through one
   config module or scattered across files.
7. **Client/global state** — where app-wide UI state lives, apart from server state. Marker: `zustand`,
   `jotai`, `redux`/`@reduxjs/toolkit`, `recoil`, `mobx` in `package.json`, or a top-level Context
   provider holding app state. None of these and only local `useState` → settled as local state only.
8. **Routing and data loading** — the router, and whether data loads in route loaders or in components.
   Marker: `react-router(-dom)` (`createBrowserRouter`, `loader`), `@tanstack/react-router`, `wouter`
   in `package.json`; loader functions versus fetches in component effects.
9. **UI error handling** — error boundaries, and how failed requests reach the user. Marker:
   `ErrorBoundary` components or `react-error-boundary`; `sonner`, `react-hot-toast`, `react-toastify`;
   inline error states in components.
