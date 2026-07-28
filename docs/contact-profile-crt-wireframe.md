# CRT wireframe display

The CRT contact profile progressively enhances its decorative display panel with an isolated
Three.js scene. Identity content, contact actions, routing, and layout remain normal HTML and do
not depend on WebGL.

## Composition

The scene uses a near-black background, an amber perspective terrain grid, a fixed horizon, sparse
particles, and a striped synthwave sun partially hidden behind the horizon. Transverse grid bands
move slowly toward the viewer while the camera, particles, and sun use restrained ambient motion.

The scene is deterministic and contains no models, textures, lights, shadows, physics,
postprocessing, audio, or sensor input.

## Loading and lifecycle

The Vue route and canonical generated route use the same framework-neutral display host. A
responsive PNG fallback is present in the initial HTML and stays underneath the canvas for the
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
canonical HTML and imports the display host and scene by their generated asset paths. It is kept
outside the SPA bundle so a direct card never initializes the marketing router.
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

Rendering pauses while the display is off-screen or the document is hidden. Pointer response is
subtle, clamped, and limited to fine-pointer desktop devices.

With JavaScript disabled, WebGL unavailable, the scene chunk unavailable, or the context lost, the
fallback remains visible and all important controls remain ordinary HTML links.

## Performance budgets

| Tier          | DPR cap | Grid divisions | Particles | Maximum FPS | Pointer           |
| ------------- | ------: | -------------: | --------: | ----------: | ----------------- |
| Desktop       |     1.5 |             28 |        22 |          30 | Fine pointer only |
| Mobile/coarse |     1.0 |             16 |        10 |          20 | Disabled          |

Run `npm run build && npm run measure:crt-display` to enforce the 140 KiB gzip ceiling for the
incremental, tree-shaken Three.js scene payload. It also enforces the 10 KiB profile/display-loader,
3 KiB canonical enhancement path, 4 KiB profile CSS, and 12 KiB responsive fallback budgets. The
scene remains absent from the initial marketing/profile dependency graph. Run
`npm run build:profiles && npm run audit:profiles:performance` for the local browser evidence that
core actions are ready before the lazy scene request, layout shift stays within budget, and the
lifecycle remains idle when it should. See
`docs/contact-profile-crt-performance.md` for the exact thresholds, conditions, and known deferred
initialization tradeoff.

## Future visual exploration

A later visual-only pass may test a larger partially-set sun and a restrained skyline silhouette.
Mountains are the leading option because they suit the synthwave landscape without adding detailed
geometry or distracting from contact actions. Sparse pooled wireframe pyramids or cubes could also
move with the terrain and pass the viewer to reinforce depth; that layer should avoid the central
sightline, use a lower mobile count, and remain absent under reduced motion. This is intentionally
separate from the loading and fallback contract.
