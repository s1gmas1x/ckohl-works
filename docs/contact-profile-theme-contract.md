# Contact Profile Theme Contract

## Decision

Contact profiles select presentation through a code-owned, versioned registry in
`src/data/contactProfileThemes.js`. Profile content may contain only an approved `themeKey`; it
cannot provide CSS, scripts, HTML, font URLs, animation values, component names, or layout data.

The first approved key is:

```text
crt-amber
```

The previous placeholder value, `works`, is intentionally not aliased. A missing or unknown key
fails profile validation and publication so a reviewed production fixture cannot silently render
with unintended presentation.

## Contract boundaries

The registry owns:

- stable theme key and CSS class names;
- theme-contract version;
- color-scheme intent;
- the approved decorative-display preset and progressive-enhancement policy;
- the required fallback and reduced-motion modes.

The registry does not own customer-editable style values or claim that an enhancement is currently
available. Visual tokens and component variants remain code-owned implementation details.

`publishedProfiles.js` validates every reviewed fixture when the module loads. Selected-profile
builds are generated only from that validated set, preserving the existing fixture-isolation
contract.

## Renderer integration

The Vue contact card and generated clean-route HTML resolve the same registry entry and expose the
same:

- `contact-profile-theme--crt-amber` class;
- `data-contact-profile-theme="crt-amber"` marker;
- theme-contract version marker.

Generated pages additionally record the theme key and contract version in metadata and
`static-profile-manifest.json`.

The canonical generated route is expected to receive the same lazy progressive enhancement as the
Vue route when the Three.js display and lifecycle issues are implemented. Until then, generated
HTML remains a complete static contact page. The future canvas cannot own identity, layout,
navigation, or contact actions.

## Fallback and motion policy

The `crt-wireframe` display is an approved decorative preset with these requirements:

- a static fallback is mandatory;
- enhancement is progressive and may fail without affecting the card;
- the canonical route is eligible for the same enhancement;
- reduced motion uses the static fallback and does not require WebGL initialization.

These values describe implementation policy. They must not be rendered as customer-facing uptime,
dynamic-link, analytics, or signal status.

## Versioning

The theme contract begins at version 1. `PROFILE_SCHEMA_VERSION` remains at 1 because `themeKey`
already existed and only its approved value/validation changed. The fixture content and deterministic
profile hashes change naturally when the key changes.

Increment the theme-contract version when renderer-visible theme semantics become incompatible.
Increment the profile schema separately when the profile data shape or required content changes.

## Styling strategy

Renderers consume only the registry key, class, and capability policy. The CRT token issue owns
moving current colors/effects into theme-scoped semantic CSS. Do not make the Node renderer parse a
Vue SFC or accept raw styles from profile data. Any shared generated CSS asset must remain a
build-owned artifact selected by the approved registry.

The shared CRT source now lives in `src/css/_contact-profile-crt.scss`. It intentionally contains
only browser-valid CSS: the Vue application includes it through `app.scss`, and the static renderer
reads and inlines the same build-owned source. See `docs/contact-profile-crt-style-system.md` for
token roles, contrast guarantees, and effect limits.

## Verification

Run:

```bash
npm run test:themes
npm run build
npm run build:profiles
npm run verify:profiles
```

Verification covers approved-key resolution, unknown-key failure, renderer markers, manifest theme
metadata, content hashes, and selected-profile isolation.
