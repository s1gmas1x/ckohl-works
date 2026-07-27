# CKohl Works Agent Guide

## Project shape

This is a Vue 3 + Quasar + Vite application with two contact-profile delivery paths:

- The Quasar SPA renders reviewed profiles through `ProfilePage.vue` and
  `ContactProfileCard.vue`.
- `scripts/static-profile-renderer.mjs` renders the same profile contract into canonical,
  clean-URL HTML under `dist/static-profiles`.

The generated profile artifact is the production path for
`/card/ckohl-works/<profile-slug>/`. Treat SPA and static-profile behavior as one product surface.

## Important locations

- `src/data/profileFixtures.js`: versioned profile schema, reviewed fixtures, vCard data, and action
  URL handling.
- `src/data/publishedProfiles.js`: published-profile allowlist and lookup.
- `src/components/profile/`: shared contact-profile UI.
- `src/pages/ProfilePage.vue`: route lookup and profile metadata.
- `src/layouts/ProfileLayout.vue`: isolated profile route shell.
- `src/css/app.scss`: global semantic tokens and site-wide accessibility styles.
- `scripts/static-profile-renderer.mjs`: clean-route HTML, metadata, structured data, and static
  profile presentation.
- `scripts/build-static-profiles.mjs`: selected-profile build and atomic promotion.
- `scripts/verify-static-profiles.mjs`: generated-profile and fixture-isolation verification.
- `public/contacts/`: downloadable vCard artifacts.
- `src/assets/images/mockup/crt-mock-up.png`: amber CRT contact-card visual reference.
- `docs/`: product boundaries, hosting decisions, and NFC/QR operating notes.

## Working rules

- Inspect the working tree before editing. Preserve unrelated and user-authored changes.
- Keep profile content in the reviewed profile contract. Do not add customer-provided HTML,
  JavaScript, CSS, font URLs, animation values, or arbitrary layout definitions.
- Keep important identity, status, and contact controls in semantic HTML. Decorative canvas or
  motion must never own navigation, layout, or an important action.
- Preserve ordinary `tel:`, `sms:`, `mailto:`, HTTPS, and vCard behavior. Enhancements must fail
  back to usable links.
- Do not claim that dynamic redirects, analytics, dashboards, or other deferred platform features
  are active. Status copy must be derived from real configured capabilities or omitted.
- Preserve selected-profile isolation. A selected build must not expose unselected fixture content
  in generated pages, vCards, or SPA bundles.
- Preserve clean routes, hash-route development behavior, metadata, JSON-LD, build revision,
  deterministic content hashes, and atomic static-profile promotion.
- Keep the canonical static profile useful without application JavaScript. If an enhancement is
  added to both renderers, share the contract and behavior where practical and document any
  intentional difference.

## CRT and motion constraints

- Treat the CRT presentation as a code-owned theme selected by an approved key, not as Chad-specific
  markup or globally active site styling.
- Preserve the contact profile as a full-viewport, full-bleed terminal on desktop. Do not wrap it in
  a centered, floating card; express depth with restrained inset screen edges and internal panels.
- Keep scanlines, glow, bloom, particles, pointer response, and Three.js content restrained and
  decorative.
- Lazy-load substantial visual dependencies. Show a lightweight fallback immediately and keep it
  usable when JavaScript, WebGL, or motion is unavailable.
- Respect `prefers-reduced-motion`, pause off-screen work, stop hidden or unmounted render loops,
  cap device pixel ratio, and handle WebGL context loss without affecting the contact card.
- Do not add device-orientation permissions, tracking, or sensor collection without a separate,
  explicitly approved requirement.

## Code conventions

- Use Vue single-file components with `<script setup>` and the Composition API.
- Use the `@/` alias for imports from `src`.
- Prefer small profile components and framework-neutral helpers over expanding one monolithic card.
- Use scoped SCSS for component layout and semantic CSS custom properties for approved theme
  tokens.
- Follow `.prettierrc.json`: no semicolons, single quotes, and a 100-character print width.
- Reuse existing Quasar components when they preserve native semantics; plain HTML controls are
  preferred when they make contact behavior or static-renderer parity clearer.

## Responsive and accessibility expectations

- Support a 320 px minimum viewport and verify the profile-specific 560 px breakpoint plus wider
  tablet and desktop layouts.
- Test long names, roles, organizations, descriptions, action labels, and translated-looking text
  for wrapping and reflow.
- Maintain logical heading and landmark structure, visible focus, keyboard access, 44–48 px touch
  targets, sufficient contrast, zoom/reflow, and readable screen-reader names.
- Decorative visuals should be hidden from assistive technology unless they communicate a real,
  non-duplicated status.

## Validation

Use checks proportional to the change. For contact-profile, routing, dependency, or static-renderer
work, run at least:

```bash
npx prettier --check <changed-files>
npx eslint -c ./eslint.config.js <changed-js-and-vue-files>
npm run build
npm run build:profiles
npm run verify:profiles
```

`npm run lint` writes formatting and fixes. The current `lint:check` script invokes Prettier without
`--check`, so use the explicit non-mutating commands above when validating a focused change.

There is not yet a committed browser/unit test suite. Add focused automated coverage when a change
introduces reusable data normalization, lifecycle behavior, WebGL fallbacks, or critical action
handling. Record manual desktop/mobile/browser checks until equivalent automation exists.

## Documentation and issue discipline

- Read the relevant file in `docs/` before changing hosting, profile publication, NFC/QR behavior,
  analytics claims, or customer-facing scope.
- Keep implementation issues independently reviewable, with explicit dependencies, acceptance
  criteria, accessibility notes, performance notes, and static-renderer implications.
- Do not broaden an issue into accounts, an editor, backend publishing, redirect management,
  analytics, billing, or arbitrary theming unless that expansion is explicitly approved.
