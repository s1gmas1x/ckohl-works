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

`ContactProfileDisplayPanel.vue` checks reduced-motion preferences before importing the scene
controller. The controller then loads the exact Three.js module asynchronously and reports these
events through its `onEvent` callback:

- `ready` after the first successful render
- `error` when rendering fails
- `context-lost` and `context-restored` for WebGL recovery
- `disposed` after animation and resource cleanup

The returned controller exposes `start()`, `pause()`, `renderOnce()`, `resize()`, `getState()`, and
`dispose()`. Disposal cancels animation, disconnects observers, removes listeners and the canvas,
disposes scene resources, and releases the WebGL context.

The generated static profile deliberately keeps the CSS fallback only. The final fallback image,
loading copy, and canvas crossfade are owned by issue #59.

## Accessibility and motion

The canvas is decorative, unfocusable, and hidden from assistive technology. Reduced-motion mode
skips Three.js and leaves the static fallback visible. No scene input changes content, navigation,
or focus order.

Rendering pauses while the display is off-screen or the document is hidden. Pointer response is
subtle, clamped, and limited to fine-pointer desktop devices.

## Performance budgets

| Tier | DPR cap | Grid divisions | Particles | Maximum FPS | Pointer |
| --- | ---: | ---: | ---: | ---: | --- |
| Desktop | 1.5 | 28 | 22 | 30 | Fine pointer only |
| Mobile/coarse | 1.0 | 16 | 10 | 20 | Disabled |

Run `npm run build && npm run measure:crt-display` to enforce the 100 KiB gzip ceiling for the
incremental Three.js scene payload. Three.js is emitted as a separate lazy asset and is absent from
the initial marketing/profile dependency graph.
