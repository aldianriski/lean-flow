# Question set: Vue + Vite

**DETECT** — `vue` and `@vitejs/plugin-vue` appear in `package.json` dependencies or
devDependencies, and none of `nuxt`, `@nuxt/*`, `quasar`, `@quasar/*`, `astro`, `vike` is present
(those own routing and build). Read the root `package.json`; in a workspace, each workspace package.

Ask a question only if its **marker** search of the tree finds no clear answer. A clear answer is one
choice found and used consistently; two or more, or none, leave the question open. Every answer is one
line in `## Conventions in use`.

1. **Component API** — Composition or Options API for new components. Marker: `<script setup>` /
   `setup()` versus `export default { data(), methods }` across `*.vue` files. Mixed → ask.
2. **App state** — where app-wide state lives. Marker: `pinia` or `vuex` in `package.json`, a
   `stores/` folder, or shared composables holding module-level `ref`s. None of these and only local
   `ref`s → settled as local state only.
3. **Server state** — how fetched data is held. Marker: `@tanstack/vue-query`, `swr-vue` in
   `package.json`; or `fetch(` / `axios` called inside composables or components.
4. **Component folders** — by feature or by type. Marker: top-level `src/` folders named
   `features/` or `modules/` (feature) versus `components/` + `composables/` + `views/` (type).
   Mixed → ask.
5. **Styling** — the one approach new components follow. Marker: `<style scoped>`, `tailwindcss`,
   `*.module.css`; ignore the single global entry stylesheet (e.g. `style.css`, `main.css`) when
   counting approaches.
6. **Forms and validation** — form approach and schema choice. Marker: `vee-validate` or
   `@vuelidate/core`, or hand-written `ref` forms; `zod` / `yup` alone does not settle the form
   approach.
7. **Router data loading** — where route data is fetched. Marker: `vue-router` navigation guards
   (`beforeEach`, `beforeEnter`) or route `meta` driving loads, versus fetches in `onMounted` /
   composables inside the view.
8. **Env and config** — how runtime config is read. Marker: `import.meta.env` reads, through one
   config module or scattered across files.
9. **Component tests** — the expected level. Marker: existing `*.spec.*` / `*.test.*` files beside
   components show it; an installed test library (`@vue/test-utils`, `vitest`, `playwright`,
   `cypress`) does not. No such files → ask.
10. **UI error handling** — how failures reach the user. Marker: `app.config.errorHandler`, an
    `onErrorCaptured` boundary component; `vue-toastification`, `vue-sonner`, `sweetalert2`; inline
    error states in components.
