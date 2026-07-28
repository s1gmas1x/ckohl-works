# CRT Contact Profile Layout

## Layout decision

The CRT profile is a full-viewport terminal surface with thin internal amber modules. It is not a
centered or floating modern card. The structural layout is shared by the Vue route and generated
clean-route HTML through `src/css/_contact-profile-layout.scss`.

The profile is composed from these independently reviewable regions:

1. terminal header;
2. identity;
3. Call, Text, and Email actions;
4. Save Contact;
5. decorative display host;
6. website and configured social actions;
7. capability details;
8. truthful footer fields.

`ContactProfileCard.vue` only composes the regions. The components under
`src/components/profile/` own the Vue markup, while `scripts/static-profile-renderer.mjs` emits the
same semantic regions for the canonical static profile.

## Responsive order

At narrow widths the source and visual order is identity, primary actions, Save Contact, decorative
display, external links, details, and footer. Identity and important native links therefore load
and appear before decoration. The three primary action tiles remain a single compact row down to
the supported 320 px viewport.

At 900 px and wider, identity and primary actions occupy the left column while the display spans
the larger right column. Save Contact and the remaining modules continue at full internal width
below that pair. Neither the profile root nor the internal layout has a maximum width, so the
desktop route retains the approved full-screen presentation and gives the fallback/canvas
substantially more room.

Long names, roles, organizations, summaries, action labels, status values, and footer values use
wrapping and zero-minimum grid tracks. Layout selection is CSS-only; there are no viewport reads or
JavaScript breakpoints.

## Interaction and semantics

- Identity has the page's single `h1`.
- Contact, Save Contact, website, social, and optional location controls are ordinary links.
- All actions use the browser's standard Tab and Shift+Tab navigation in document order. Ordinary
  links do not override arrow, Home, or End keys.
- Contact tiles are at least 112 px tall on mobile. Save, external, and detail rows exceed the
  44 px target minimum.
- Optional external, status, and footer regions are omitted when their normalized data is absent.
- The display host is `aria-hidden` and contains no controls, navigation, or important content.

## Display boundary

`ContactProfileDisplayPanel.vue` establishes the stable display slot with a responsive fallback
image. A shared display host lazy-loads the isolated Three.js scene for both Vue and canonical
routes. The fallback stays underneath the canvas, the canvas appears only after its first
successful render, and any enhancement failure leaves the layout and actions untouched.

The viewport internals remain decorative, preserve the host dimensions, and follow the motion and
lifecycle constraints in `AGENTS.md`.

## Profile-specific content

Chad's reviewed profile omits the location action. A city-only map link did not represent a
customer-facing storefront or useful visit destination. The shared contract and layout still
support optional location actions for profiles with a real service area or physical location.

## Verification

Automated layout contracts cover:

- semantic component boundaries;
- Vue/static structural parity;
- mobile source order and the 900 px wide layout;
- full-viewport sizing without a desktop width cap;
- minimum control sizes;
- optional-region omission;
- long-content wrapping;
- decorative display isolation.

Run `npm run test:themes`, `npm run build`, `npm run build:profiles`, and
`npm run verify:profiles` after profile layout changes. Run `npm run audit:profiles:a11y` after
building the profiles for the shared browser accessibility matrix. Browser checks should include
320, 375, 430, 768, 1024, and 1440 px widths, keyboard focus, long content, and zoom/reflow. See
`docs/contact-profile-accessibility-audit.md` for the complete audit contract and manual release
checks.
