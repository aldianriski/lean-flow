# Question set: React + Vite

**DETECT** — `react` and `vite` both appear in `package.json` dependencies or devDependencies, and none
of `next`, `@remix-run/*`, `astro` is present (those own routing and build).

Ask a question only if its **marker** search of the tree finds no clear answer. Every answer is one
line in `## Conventions in use`.

1. **Server state** — where fetched data lives and with what. Marker: `@tanstack/react-query`, `swr`,
   `@apollo/client`, `@reduxjs/toolkit` (RTK Query) in `package.json`; or `fetch(` / `axios` / a
   client SDK called inside components or hooks.
2. **Component folders** — by feature or by type. Marker: top-level `src/` folders named
   `features/` or `modules/` (feature) versus `components/` + `hooks/` + `pages/` (type). Mixed → ask.
3. **Styling** — the one approach new components follow. Marker: `tailwindcss`, `styled-components`,
   `@emotion/*`, `*.module.css`, or plain `.css` imports. More than one present → ask.
4. **Forms and validation** — form library and schema choice. Marker: `react-hook-form`, `formik`,
   `zod`, `yup`, or hand-written `useState` forms.
5. **Component tests** — the expected level. Marker: `@testing-library/react`, `vitest`, `jest`,
   `playwright`, `cypress`, and existing `*.test.*` files beside components.
6. **Env and config** — how runtime config is read. Marker: `import.meta.env` reads, through one
   config module or scattered across files.
