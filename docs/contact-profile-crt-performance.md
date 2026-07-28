# CRT Contact Profile Performance Budget

## Scope and decision

The CRT display is a progressively enhanced decoration. The profile's identity, contact actions,
vCard link, and fallback artwork are useful before the scene module is requested. This document
defines the reproducible build and local-browser budgets for that boundary.

The current Three.js implementation is intentionally retained. Its tree-shaken scene payload is
larger than the original 100 KiB proposal, but it is completely outside the initial profile route.
The approved 140 KiB gzip ceiling reflects the measured implementation rather than treating an
unrealistic target as a release gate.

## Enforced build budgets

`npm run build && npm run measure:crt-display` fails when any deterministic asset budget is
exceeded.

| Asset boundary                                      |       Budget | Current measured value |
| --------------------------------------------------- | -----------: | ---------------------: |
| Async Three.js scene and scene dependencies         | 140 KiB gzip |         130.8 KiB gzip |
| Initial profile route plus lightweight display host |  10 KiB gzip |          9.04 KiB gzip |
| Canonical enhancement plus display-host import path |   3 KiB gzip |               2.07 KiB |
| Profile route CSS                                   |   4 KiB gzip |          3.59 KiB gzip |
| Responsive fallback images combined                 |   12 KiB raw |          11.39 KiB raw |

The initial-profile figure deliberately contains the `ProfilePage` route and `displayHost` module.
It excludes shared application chunks that existed before the display feature and excludes the
dynamic scene import. The measurement script proves that the scene is not in the profile route's
static import graph.

The only runtime fallback images are:

- `crt-wireframe-fallback-mobile.png` — 2,704 bytes;
- `crt-wireframe-fallback-wide.png` — 8,958 bytes.

The 1.6 MB source mockup remains a development reference only and is never emitted as a profile
fallback.

## Runtime lab budgets

Run the browser evidence after `npm run build:profiles`:

```bash
npm run audit:profiles:performance
```

The local Chromium lab uses a 390 × 844 touch viewport and deliberately holds the async scene
request open. It verifies the full semantic card exists before the request is released, then checks
both the canonical page and the Vue hash route for:

- usable identity and at least six contact actions within 1,500 ms;
- no core-path long task above 150 ms before the scene is released;
- first successful scene frame within 4,000 ms after the request is released;
- profile CLS at or below 0.05;
- no unrelated marketing/profile resource request;
- exactly one scene request per mounted display;
- no queued display frame while hidden or after a context loss;
- exactly one canvas after three app-route unmount/remount cycles;
- no canvas or scene request under `prefers-reduced-motion`.

The scene is requested only after the complete card exists. In the representative 2026-07-28 local
run, canonical core readiness was 283 ms and app core readiness was 323 ms; CLS was 0.014 and 0.012
respectively, and first scene frames followed release in 292 ms and 177 ms. The observed deferred
initialization long tasks were 273 ms and 307 ms, respectively.

The first Three.js parse and WebGL initialization is allowed one deferred task of up to 600 ms. This
is separate from the 150 ms core-path budget and occurs only after the card is complete and the idle
loading policy releases the display. Replacing that remaining deferred initialization cost would
require an explicitly scoped OffscreenCanvas/worker follow-up; reducing grid divisions or particles
does not materially reduce module parse cost.

## Rendering tiers

| Tier                  | DPR cap | Grid divisions | Particles | Maximum FPS | Pointer response |
| --------------------- | ------: | -------------: | --------: | ----------: | ---------------- |
| Desktop fine pointer  |     1.5 |             28 |        22 |          30 | Enabled, clamped |
| Mobile/coarse pointer |     1.0 |             16 |        10 |          20 | Disabled         |

There is no antialiasing, shadow map, texture, model, postprocessing, audio, sensor access, or
continuous rendering when the display is hidden, off-screen, context-lost, reduced-motion, failed,
or unmounted. The browser audit exercises hidden, synthetic context-loss/recovery, and repeated app
navigation; unit tests cover the corresponding lifecycle controller states.

## Selected-profile isolation

Selected static-profile builds retain the normal generated HTML, fallback, vCard, deterministic
content hash, and standalone enhancement contract. The canonical enhancement is a small public ESM
entry that imports only the generated display-host and scene asset paths, avoiding the SPA entry
and its marketing router. `npm run verify:profiles` confirms that unselected fixture content and
vCards are excluded. The runtime audit additionally proves that a direct contact profile visit does
not request unrelated marketing or profile-route assets.

The broader SPA asset directory is preserved because the deployed hash route remains a supported
delivery path. Removing its marketing chunks from the generated static artifact would break that
route rather than improve a direct profile visit.

## Release evidence and limits

The bundle measurement is a hard gate. The browser audit is a repeatable local release check; it is
not yet attached to a hosted CI workflow because it requires an available Chromium binary and a
local profile proof server. Record a real mid-range phone/browser/network pass before a public
release, especially after Three.js, font, fallback, or full-site CSS changes.

Use the latest report values rather than treating the representative timings above as field data.
The contact actions and fallback remain the release-critical experience if WebGL is slow or absent.
