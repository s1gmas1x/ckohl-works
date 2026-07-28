# CRT Contact Profile Accessibility Audit

## Scope

This audit covers the two supported delivery paths and both published profile fixtures:

- generated canonical pages at `/card/ckohl-works/<profile>/`;
- the Vue application at `/#/card/ckohl-works/<profile>`;
- Chad Kohl and Pikes Peak Handyman content;
- the 320 px mobile minimum, 844 × 390 landscape, and 1440 × 900 desktop.

The Three.js display is decorative in every scenario. Identity, contact actions, external links,
vCard download, statuses, and footer content remain semantic HTML outside the display.

## Decisions and corrections

- Quasar's page container owns the Vue route's single `main`; the profile page no longer nests a
  second `main`.
- The profile root is the single region named by the page `h1`. The nested identity panel is not a
  second region with the same name.
- Native `header` and `footer` elements do not carry prohibited `aria-label` attributes.
- The viewport permits browser and assistive zoom.
- Actions use native links and standard Tab/Shift+Tab navigation. Arrow, Home, and End keys are not
  intercepted.
- Every configured control has an accessible name, a real destination, visible keyboard focus, and
  a minimum 44 × 44 CSS-pixel target.
- `INITIALIZING DISPLAY`, the canvas, fallback artwork, and SVG icons are deliberately excluded from
  the accessibility tree. The loading message does not use a live region because display readiness
  does not affect any task or content.
- Reduced motion keeps the fallback image, skips the WebGL canvas, and does not request the
  Three.js scene module.
- Forced-colors mode removes scanlines, vignette, and CRT shadows while preserving a three-pixel
  focus indicator.

## Automated evidence

Run the production builds before the browser audit:

```bash
npm run test:themes
npm run build
npm run build:profiles
npm run verify:profiles
npm run audit:profiles:a11y
```

`audit:profiles:a11y` starts the generated-profile proof server and uses headless Chromium with Axe.
It fails on any of the following:

- WCAG A/AA, WCAG 2.1, WCAG 2.2 AA, or Axe best-practice structural violation;
- unresolved automated checks;
- a contrast failure against the approved solid theme surfaces;
- incorrect landmark, heading, accessible-name, source-order, target-size, or focus contracts;
- a decorative display node leaking into Chromium's accessibility tree;
- horizontal overflow at 320 px, long-content/text-spacing reflow, or landscape;
- custom arrow/Home/End behavior on ordinary links;
- loss of meaningful identity or actions when CSS is removed;
- a Three.js request or canvas under reduced motion;
- loss of focus visibility under forced colors;
- loss of identity, actions, or fallback artwork on the canonical page without JavaScript;
- browser runtime errors during the primary mobile scenarios.

The solid-surface contrast pass is intentional. Axe cannot resolve text contrast through the
decorative CRT background gradients, so the audit temporarily removes only those gradients while
retaining the production foreground and approved solid surface tokens. Unit tests independently
calculate the token ratios; glow and shadow never count toward compliance.

The 320 px scenario also represents the layout width available when a 1280 px viewport is zoomed to
400 percent. The long-content pass applies the WCAG text-spacing overrides before checking for
two-dimensional scrolling.

## Browser matrix

| Scenario                 | Canonical | Vue app        | Automated contract                                                         |
| ------------------------ | --------- | -------------- | -------------------------------------------------------------------------- |
| 320 × 720 mobile         | Covered   | Covered        | Axe, contrast, landmarks, accessibility tree, focus, touch targets, reflow |
| 1440 × 900 desktop       | Covered   | Covered        | Axe, contrast, landmarks, accessibility tree, full-width layout            |
| 844 × 390 landscape      | Covered   | Covered        | Reflow and touch targets                                                   |
| `prefers-reduced-motion` | Covered   | Covered        | Static fallback; no canvas or Three.js request                             |
| Forced colors            | Covered   | Covered        | Effects removed; focus retained                                            |
| CSS unavailable          | Covered   | Covered        | Identity and functional named links retained                               |
| JavaScript unavailable   | Covered   | Not applicable | Canonical identity, links, vCard, and fallback retained                    |

The hash-based Vue application inherently requires JavaScript. The canonical page is the
production no-JavaScript delivery path.

## Manual release checks

Automation cannot replace a short assistive-technology and device pass. Before a production
release, verify:

- VoiceOver with Safari on an iPhone and, when available, TalkBack with Chrome on Android;
- heading/landmark navigation reads one profile region and one page heading;
- swipe or Tab order matches the visible action order and every action announces its purpose;
- Call, Text, Email, Save Contact, and external links hand off to the expected native application;
- the vCard downloads/imports successfully on the target device;
- portrait/landscape rotation, 200 percent browser zoom, and 400 percent reflow retain readable
  content and visible focus;
- forced colors or a high-contrast system theme retains boundaries and focus;
- reduced motion shows the complete static synthwave fallback without initializing WebGL.

Record device, operating-system, browser, and assistive-technology versions with the release
evidence. Any failure in an important action blocks release; decorative display failure does not.
