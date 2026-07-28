# Amber CRT Contact Profile Style System

## Presentation decision

The contact profile remains a full-viewport, full-bleed terminal on desktop and mobile. It must not
be placed inside a centered or floating card. The outer theme surface fills the route, while a thin
inset screen edge and internal modular controls provide structure and depth.

This decision applies to the responsive layout work that follows this issue. Wider viewports may
rearrange internal regions, but they must not introduce a desktop card shell or arbitrary maximum
width around the themed profile.

## Shared source

`src/css/_contact-profile-crt.scss` is the single build-owned source for the approved `crt-amber`
tokens and screen effects. `src/css/_contact-profile-layout.scss` is the shared structural source
for the terminal regions, panel geometry, responsive ordering, and touch-target sizes.

- `ContactProfileCard.vue` includes both sources in the lazy Vue profile route.
- `scripts/static-profile-renderer.mjs` reads and inlines both files for the canonical generated
  route.
- Both files must stay valid plain CSS even though their `.scss` extensions let the application
  include them with Sass.
- Profile data can select `crt-amber`; it cannot alter token values, fonts, effects, or selectors.

Renderer-specific styles retain only the document baseline and consume the shared sources. The
static renderer keeps black and white declarations solely as a legible no-theme baseline if the
approved CSS cannot be applied.

## Semantic roles

The theme defines these groups:

- surfaces for the page, screen, panels, raised regions, and control states;
- solid foregrounds for strong identity, body copy, actions, muted labels, accent, ready status, and
  focus;
- screen, panel, subtle, hover, and focus borders;
- identity, terminal label, body, action, and numeric/data typography;
- border width, panel spacing, padding, and radius;
- inset screen depth, panel depth, identity glow, scanlines, and vignette.

Raw color values belong only in the scoped theme source. Components and renderers should reference a
semantic token instead of copying amber or near-black values.

## Contrast guarantees

Automated tests calculate WCAG contrast from the solid token values. Against both the screen and
panel surfaces:

- meaningful text tokens are at least 4.5:1;
- the muted amber token remains above 7:1;
- the screen/control border and focus indicator are at least 3:1;
- the focus color is separate from the hover border and uses a three-pixel, offset outline.

Glow and shadows never count toward these ratios. Removing text shadows, custom fonts, gradients, or
screen effects leaves the solid color hierarchy intact.

## Typography and fallback

Share Tech Mono remains the approved terminal face and only its regular weight is loaded. Identity,
labels, body copy, actions, and data fields use semantic typography tokens rather than requesting
synthetic customer-configured fonts.

The fallback stack is:

```text
ui-monospace, Cascadia Code, SFMono-Regular, Consolas, monospace
```

The static renderer embeds the self-hosted Latin WOFF2 with `font-display: swap`. If it fails, the
fallback stack renders immediately without affecting layout or contact behavior.

## Effect limits

- Scanlines and the vignette are static CSS gradients behind content.
- Decorative pseudo-elements use `pointer-events: none`.
- There is no flicker, strobe, distortion, keyframe animation, filter, or blend mode.
- Glow is limited to a small identity text shadow and restrained inset depth.
- `prefers-contrast: more` removes scanlines, vignette, and identity glow.
- Forced-colors mode removes decorative effects and maps surfaces, text, borders, and focus to
  system colors.

These constraints take priority over closer mockup imitation when an effect would reduce
readability, increase paint cost, or make focus harder to identify.

## Performance observation

A local headless Chromium trace at 375 × 812 with effects enabled recorded 10 initial `Paint`
events totaling 1.763 ms during load and no active document animations. This is a development
baseline rather than a cross-device performance guarantee. Later layout and Three.js work should
repeat the trace and preserve the static CSS-only fallback.

## Verification

Run:

```bash
npm run test:themes
npm run build
npm run build:profiles
npm run verify:profiles
npm run audit:profiles:a11y
```

Visual checks cover 320, 375, 768, and desktop widths in both the Vue hash route and canonical
generated output. The full-viewport root, visible focus, forced colors, font failure, effect removal,
and lack of active CSS animations are part of the issue acceptance review. The detailed automated
and manual matrix lives in `docs/contact-profile-accessibility-audit.md`.
