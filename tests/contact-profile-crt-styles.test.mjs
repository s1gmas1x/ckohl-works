import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { publishedProfiles } from '../src/data/publishedProfiles.js'
import { renderProfileDocument } from '../scripts/static-profile-renderer.mjs'

const themeStyle = await readFile(
  new URL('../src/css/_contact-profile-crt.scss', import.meta.url),
  'utf8',
)
const layoutStyle = await readFile(
  new URL('../src/css/_contact-profile-layout.scss', import.meta.url),
  'utf8',
)
const fontStyle = await readFile(
  new URL('../src/css/_contact-profile-fonts.scss', import.meta.url),
  'utf8',
)
const componentSource = await readFile(
  new URL('../src/components/profile/ContactProfileCard.vue', import.meta.url),
  'utf8',
)

function getToken(tokenName) {
  const match = themeStyle.match(new RegExp(`${tokenName}:\\s*([^;]+);`))

  assert.ok(match, `expected ${tokenName} to be defined`)
  return match[1].trim()
}

function parseHexColor(value) {
  assert.match(value, /^#[\da-f]{6}$/i, `expected a six-digit hex color, received ${value}`)
  return [1, 3, 5].map((index) => Number.parseInt(value.slice(index, index + 2), 16) / 255)
}

function relativeLuminance(value) {
  const [red, green, blue] = parseHexColor(value).map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  )

  return red * 0.2126 + green * 0.7152 + blue * 0.0722
}

function contrastRatio(foreground, background) {
  const luminances = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (left, right) => right - left,
  )

  return (luminances[0] + 0.05) / (luminances[1] + 0.05)
}

test('defines the complete semantic CRT token contract under the approved theme', () => {
  const requiredTokens = [
    '--crt-color-surface-page',
    '--crt-color-surface-screen',
    '--crt-color-surface-panel',
    '--crt-color-surface-raised',
    '--crt-color-text-strong',
    '--crt-color-text-body',
    '--crt-color-text-action',
    '--crt-color-text-muted',
    '--crt-color-accent',
    '--crt-color-status-ready',
    '--crt-color-focus',
    '--crt-color-border-screen',
    '--crt-color-border-panel',
    '--crt-color-border-subtle',
    '--crt-color-border-hover',
    '--crt-color-display-haze',
    '--crt-color-display-orb-glow',
    '--crt-color-display-orb-inset',
    '--crt-border-width',
    '--crt-radius-screen',
    '--crt-radius-panel',
    '--crt-panel-gap',
    '--crt-panel-padding-inline',
    '--crt-type-terminal-family',
    '--crt-type-terminal-settings',
    '--crt-type-accent-family',
    '--crt-type-accent-settings',
    '--crt-type-accent-palette',
    '--crt-type-identity-family',
    '--crt-type-label-family',
    '--crt-type-body-family',
    '--crt-type-action-family',
    '--crt-type-data-family',
    '--crt-depth-screen',
    '--crt-depth-panel',
    '--crt-glow-identity',
    '--crt-scanline-image',
    '--crt-vignette-image',
  ]

  for (const tokenName of requiredTokens) getToken(tokenName)

  assert.doesNotMatch(themeStyle, /^\s*(?::root|html|body)\s*[{,]/m)
  assert.match(themeStyle, /^\.contact-profile-theme--crt-amber \{/m)
})

test('core text and control colors meet their contrast targets without glow', () => {
  const surfaces = [getToken('--crt-color-surface-screen'), getToken('--crt-color-surface-panel')]
  const meaningfulForegrounds = [
    '--crt-color-text-strong',
    '--crt-color-text-body',
    '--crt-color-text-action',
    '--crt-color-text-muted',
    '--crt-color-accent',
    '--crt-color-status-ready',
  ]

  for (const foregroundToken of meaningfulForegrounds) {
    for (const surface of surfaces) {
      const ratio = contrastRatio(getToken(foregroundToken), surface)

      assert.ok(
        ratio >= 4.5,
        `${foregroundToken} contrast ${ratio.toFixed(2)} must be at least 4.5`,
      )
    }
  }

  for (const foregroundToken of ['--crt-color-border-screen', '--crt-color-focus']) {
    for (const surface of surfaces) {
      const ratio = contrastRatio(getToken(foregroundToken), surface)

      assert.ok(ratio >= 3, `${foregroundToken} contrast ${ratio.toFixed(2)} must be at least 3`)
    }
  }
})

test('screen effects are static, non-interactive, and removable in contrast modes', () => {
  assert.match(themeStyle, /contact-profile-crt-screen::before[\s\S]*pointer-events: none;/)
  assert.match(themeStyle, /contact-profile-crt-screen::after[\s\S]*pointer-events: none;/)
  assert.doesNotMatch(themeStyle, /@keyframes|animation(?:-name)?:|filter:|mix-blend-mode:/)
  assert.match(themeStyle, /@media \(prefers-contrast: more\)/)
  assert.match(themeStyle, /@media \(forced-colors: active\)/)
})

test('focus and font fallbacks remain functional without decorative effects', () => {
  assert.match(
    themeStyle,
    /:where\(a, button, select, \[tabindex\]\):focus-visible[\s\S]*outline: 3px solid var\(--crt-color-focus\) !important;[\s\S]*outline-offset: 3px;/,
  )
  assert.notEqual(getToken('--crt-color-focus'), getToken('--crt-color-border-hover'))
  assert.match(
    getToken('--crt-type-terminal-family'),
    /ui-monospace[\s\S]*Cascadia Code[\s\S]*SFMono-Regular[\s\S]*Consolas[\s\S]*monospace/,
  )
})

test('uses the Sixtyfour pairing without allowing the color font to escape the amber theme', () => {
  assert.match(getToken('--crt-type-terminal-family'), /^'Sixtyfour Variable'/)
  assert.match(getToken('--crt-type-terminal-family'), /'64M'/)
  assert.equal(getToken('--crt-type-label-family'), 'var(--crt-type-accent-family)')
  assert.match(
    themeStyle,
    /@supports \(font-palette: --crt-amber-convergence\)[\s\S]*--crt-type-accent-family: 'Sixtyfour Convergence Variable'/,
  )
  assert.match(themeStyle, /0 #ffc96a,[\s\S]*1 #ffe1a5,[\s\S]*2 #c9933d;/)
  assert.match(
    themeStyle,
    /@media \(forced-colors: active\)[\s\S]*--crt-type-accent-family: var\(--crt-type-terminal-family\);/,
  )
  assert.match(
    fontStyle,
    /font-family: 'Sixtyfour Variable';[\s\S]*sixtyfour-latin-full-normal\.woff2/,
  )
  assert.match(
    fontStyle,
    /font-family: 'Sixtyfour Convergence Variable';[\s\S]*sixtyfour-convergence-latin-full-normal\.woff2/,
  )
  assert.match(fontStyle, /font-family: '64M';[\s\S]*size-adjust: 166\.6667%;/)
  assert.equal(fontStyle.match(/font-display: block;/g)?.length, 2)
})

test('Vue and generated profiles consume the same full-viewport theme source', () => {
  const document = renderProfileDocument(publishedProfiles[0], 'style-test')

  assert.ok(document.includes(themeStyle))
  assert.ok(document.includes(layoutStyle))
  assert.match(document, /class="contact-profile__screen contact-profile-crt-screen"/)
  assert.match(componentSource, /class="contact-profile__screen contact-profile-crt-screen"/)
  assert.match(componentSource, /@use '\.\.\/\.\.\/css\/contact-profile-fonts';/)
  assert.match(componentSource, /@use '\.\.\/\.\.\/css\/contact-profile-layout';/)
  assert.match(layoutStyle, /\.contact-profile \{[\s\S]*min-height: 100vh;/)
  assert.match(document, /@font-face \{ font-family:'Sixtyfour Variable'/)
  assert.match(document, /@font-face \{ font-family:'Sixtyfour Convergence Variable'/)
  assert.match(document, /@font-face \{ font-family:'64M'[\s\S]*size-adjust:166\.6667%;/)
  assert.equal(document.match(/font-display:block/g)?.length, 2)
  assert.doesNotMatch(document, /Share Tech Mono/)
  assert.doesNotMatch(componentSource, /--ckw-crt-|#[\da-f]{3,8}|rgba?\(/i)
})
