# CRT wireframe display

The CRT contact profile progressively enhances its decorative display panel with an isolated
Three.js scene. Identity content, contact actions, routing, and layout remain normal HTML and do
not depend on WebGL.

## Composition

The scene uses a near-black background, amber perspective terrain grid, a distinct fixed horizon,
and sparse stars distributed around a large striped synthwave sun. The sun is approximately 3.5
times its original diameter, sits partly behind a low mountain ridge, and is followed by three
subtle wireframe pyramids on fine-pointer desktop displays. Transverse grid bands and pyramids move
slowly toward the viewer. Independent, long camera pan, tilt, and slight roll cycles create subtle
parallax between the terrain, pyramids, mountains, sun, and stars without changing the initial
composition. Mobile uses approximately half the camera movement. The pyramids begin beyond the
ridge clearance, so their entrance never intersects the mountain mask. The shooting-star
implementation is retained but disabled pending a later visual-refinement pass.

The scene is deterministic and contains no models, textures, lights, shadows, physics,
postprocessing, audio, or sensor input.

## Loading and lifecycle

The Vue route and canonical generated route use the same framework-neutral display host. A
responsive WebP fallback is present in the initial HTML and stays underneath the canvas for the
entire display lifetime. The host checks reduced-motion preferences, displays `INITIALIZING
DISPLAY`, waits for idle time (with a 600 ms maximum wait), and only then imports the exact Three.js
scene module. The canvas crossfades over the fallback after the first successful render.

Initialization has an 8 second timeout. Import, initialization, render, and WebGL failures are
contained inside the decorative display: the host removes or hides the canvas and silently retains
the fallback while the rest of the profile stays usable.

The scene controller reports these events through its `onEvent` callback:

- `ready` after the first successful render
- `error` when rendering fails
- `context-lost` and `context-restored` for WebGL recovery
- `disposed` after animation and resource cleanup

The returned controller exposes `start()`, `pause()`, `renderOnce()`, `resize()`, `getState()`, and
`dispose()`. Disposal cancels animation, disconnects observers, removes listeners and the canvas,
disposes scene resources, and releases the WebGL context.

`ContactProfileDisplayPanel.vue` owns the Vue integration.
`public/contact-profile/crt-wireframe-static-enhancement.js` progressively enhances only the
canonical HTML and imports the shared typing effect, display host, and scene by their generated
asset paths. Its generated URL includes the build revision so phones and browsers cannot retain a
pre-typing cached enhancement after deployment. It is kept outside the SPA bundle so a direct card
never initializes the marketing router.
`displayHost.js` owns the shared state machine and failure policy, while
`createCrtWireframeScene.js` remains isolated from routing, contact data, and controls.

Generated clean URLs and hash routes expose a neighboring status field so test and support work can
identify the active renderer without overloading link behavior:

- `VIEW MODE: CANONICAL` for generated clean-route HTML;
- `VIEW MODE: APP` for the Vue hash route.

`LINK MODE` remains reserved for the contact link delivery model (`DIRECT` today).

## Accessibility and motion

The canvas is decorative, unfocusable, and hidden from assistive technology. Reduced-motion mode
skips Three.js and leaves the static fallback visible. No scene input changes content, navigation,
or focus order.

Rendering pauses while the display is off-screen or the document is hidden. Ambient camera motion
is reduced on mobile. Pointer response and pyramids are limited to fine-pointer desktop devices.

With JavaScript disabled, WebGL unavailable, the scene chunk unavailable, or the context lost, the
fallback remains visible and all important controls remain ordinary HTML links.

## Performance budgets

| Tier          | DPR cap | Grid divisions | Particles | Maximum FPS | Pointer           |
| ------------- | ------: | -------------: | --------: | ----------: | ----------------- |
| Desktop       |     1.5 |             28 |        16 |          30 | Fine pointer only |
| Mobile/coarse |     1.0 |             16 |         6 |          20 | Disabled          |

Run `npm run build && npm run measure:crt-display` to enforce the 140 KiB gzip ceiling for the
incremental, tree-shaken Three.js scene payload. It also enforces the 11.5 KiB profile/display and
typing loader, 3.5 KiB canonical enhancement path, 4.5 KiB profile CSS, and 12 KiB responsive
fallback budgets. The scene remains absent from the initial marketing/profile dependency graph. Run
`npm run build:profiles && npm run audit:profiles:performance` for the local browser evidence that
core actions are ready before the lazy scene request, layout shift stays within budget, and the
lifecycle remains idle when it should. See
`docs/contact-profile-crt-performance.md` for the exact thresholds, conditions, and known deferred
initialization tradeoff.

## Future visual exploration

A later visual-only pass may revisit the disabled shooting star, explore a more varied mountain
silhouette, or add sparse ground objects. Those additions should remain absent on mobile and under
reduced motion, avoid the central sightline, and preserve the current loading and fallback contract.
