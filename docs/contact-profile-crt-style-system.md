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

Sixtyfour is the approved terminal face for identity, body copy, actions, and data fields.
Sixtyfour Convergence is reserved for the header, eyebrow, role, organization, and display label
accent roles. Both faces expose only their regular weight; their code-owned variable-axis settings
add weight and restrained channel separation without synthetic font styles or customer-configured
values.

Convergence is a color font, so its built-in red channel is replaced by an amber-only palette using
the existing accent, strong-text, and muted-text colors. Browsers without custom font-palette
support use Sixtyfour for the accent roles instead of exposing the original palette. Forced-colors
mode also uses Sixtyfour so system text colors remain authoritative.

The fallback stack is:

```text
64M, ui-monospace, Cascadia Code, SFMono-Regular, Consolas, monospace
```

The SPA declares the two self-hosted Latin WOFF2 files only in the lazy profile route. The static
renderer embeds the same files. Both use a short font-display block so the wider pixel metrics are
available before the card paints. A local monospace metrics fallback is widened with `size-adjust`
to reserve Sixtyfour's character cells during a cold load, preventing mobile reflow when the face
appears. Together the two web fonts are 12,028 bytes raw, slightly smaller than the previous
13,500-byte Share Tech Mono file. If either face fails, the fallback stack renders without affecting
contact behavior.

## Terminal summary motion

Profiles with reviewed summary variants progressively enhance the canonical summary into a
terminal typing cycle. Characters use a deterministic cadence with small timing changes, brief
space and punctuation hesitations, a completed-line hold, and a faster backspace pass. A solid
block cursor uses the only approved keyframe animation in the contact-profile surface.

The canonical summary remains normal semantic text. The visual typed layer and all alternate
phrases are `aria-hidden`, and overlapping invisible phrase copies reserve the tallest required
line box before the effect starts. This prevents the surrounding layout from moving as copy
changes. With JavaScript unavailable, enhancement failure, fewer than two phrases, or
`prefers-reduced-motion: reduce`, the canonical summary remains visible and the typed layer and
cursor stay hidden. Typing pauses off-screen and while the document is hidden and is disposed on
unmount or page exit.

## Effect limits

- Scanlines and the vignette are static CSS gradients behind content.
- Decorative pseudo-elements use `pointer-events: none`.
- There is no flicker, strobe, distortion, filter, or blend mode. The terminal block cursor blink is
  the sole keyframe exception and is disabled with reduced motion.
- Glow is limited to a small identity text shadow and restrained inset depth.
- `prefers-contrast: more` removes scanlines, vignette, and identity glow.
- Forced-colors mode removes decorative effects and maps surfaces, text, borders, and focus to
  system colors.

These constraints take priority over closer mockup imitation when an effect would reduce
readability, increase paint cost, or make focus harder to identify.

## Performance observation

The static CRT effects stay behind semantic content. The optional summary typing and cursor are the
only content-adjacent motion and do not change the accessibility tree. The profile's complete asset
and runtime budget, including a core measurement before the lazy scene is released, lives in
`docs/contact-profile-crt-performance.md`. That lab check is a development baseline, not a
substitute for a real-device release pass.

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
generated output. The full-viewport root, visible focus, forced colors, font failure, stable summary
height, terminal cadence, and motion-disabled static summary are part of the issue acceptance
review. The detailed automated and manual matrix lives in
`docs/contact-profile-accessibility-audit.md`.
