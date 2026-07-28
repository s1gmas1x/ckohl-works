import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { publishedProfiles } from '../src/data/publishedProfiles.js'
import { renderProfileDocument } from '../scripts/static-profile-renderer.mjs'

const layoutStyle = await readFile(
  new URL('../src/css/_contact-profile-layout.scss', import.meta.url),
  'utf8',
)
const cardSource = await readFile(
  new URL('../src/components/profile/ContactProfileCard.vue', import.meta.url),
  'utf8',
)
const actionSource = await readFile(
  new URL('../src/components/profile/ContactProfileActions.vue', import.meta.url),
  'utf8',
)
const displaySource = await readFile(
  new URL('../src/components/profile/ContactProfileDisplayPanel.vue', import.meta.url),
  'utf8',
)
const detailsSource = await readFile(
  new URL('../src/components/profile/ContactProfileDetails.vue', import.meta.url),
  'utf8',
)

test('composes the Vue profile from focused semantic regions', () => {
  for (const component of [
    'ContactProfileHeader',
    'ContactProfileIdentityPanel',
    'ContactProfileActions',
    'ContactProfileDisplayPanel',
    'ContactProfileDetails',
  ]) {
    assert.match(cardSource, new RegExp(`<${component}`))
  }

  assert.match(actionSource, /<nav[\s\S]*aria-label="Primary contact actions"/)
  assert.match(actionSource, /<nav v-if="saveAction"[\s\S]*aria-label="Save contact"/)
  assert.match(actionSource, /<a[\s\S]*:href="getActionHref\(action, publicBase\)"/)
  assert.match(displaySource, /<section class="contact-profile-display[^"]*" aria-hidden="true">/)
  assert.match(displaySource, /<picture class="contact-profile-display__fallback"/)
  assert.match(displaySource, /crt-wireframe-fallback-mobile\.png/)
  assert.match(displaySource, /crt-wireframe-fallback-wide\.png/)
  assert.doesNotMatch(displaySource, /<a|<button|<canvas|@click|router/)
  assert.match(cardSource, /data-contact-profile-renderer="app"/)
  assert.match(detailsSource, /<dt>View mode<\/dt>[\s\S]*<dd>APP<\/dd>/)
})

test('uses mobile-first source order and a larger wide-screen display host', () => {
  assert.match(
    layoutStyle,
    /grid-template-areas:\s*'identity'\s*'contacts'\s*'save'\s*'display'\s*'external'\s*'details'\s*'footer';/,
  )
  assert.match(layoutStyle, /@media \(min-width: 900px\)/)
  assert.match(
    layoutStyle,
    /'identity display'\s*'contacts display'\s*'save save'\s*'external external'\s*'details details'\s*'footer footer';/,
  )
  assert.match(
    layoutStyle,
    /\.contact-profile-display \{[\s\S]*min-height: clamp\(460px, 61vh, 760px\);/,
  )
  assert.match(layoutStyle, /\.contact-profile \{[\s\S]*width: 100%;[\s\S]*min-height: 100vh;/)
  assert.doesNotMatch(
    layoutStyle,
    /\.contact-profile(?:-layout)? \{[^}]*max-width:/,
    'the full terminal surface must not gain a desktop card width cap',
  )
  assert.doesNotMatch(cardSource, /innerWidth|matchMedia|ResizeObserver/)
})

test('keeps controls large enough and long content able to reflow at 320px', () => {
  assert.match(
    layoutStyle,
    /\.contact-profile-action-tile \{[\s\S]*min-height: 116px;[\s\S]*min-width: 0;/,
  )
  assert.match(layoutStyle, /\.contact-profile-save__link \{[\s\S]*min-height: 92px;/)
  assert.match(layoutStyle, /\.contact-profile-external-action \{[\s\S]*min-height: 64px;/)
  assert.match(layoutStyle, /@media \(max-width: 560px\)/)
  assert.match(layoutStyle, /overflow-wrap: anywhere;/)
  assert.match(layoutStyle, /repeat\(3, minmax\(0, 1fr\)\)/)

  const longProfile = structuredClone(publishedProfiles[0])
  longProfile.identity.name = 'Alexandria-Cassandra Extremely-Long-Contact-Profile-Name'
  longProfile.identity.role =
    'Principal multilingual digital contact systems architect and accessibility specialist'
  longProfile.identity.organization =
    'A deliberately long organization name used to verify terminal panel reflow'
  longProfile.identity.summary =
    'A deliberately extended description verifies that meaningful identity content wraps without being clipped or forcing the full-screen terminal wider than its viewport.'
  longProfile.actions[0].label = 'Call about a detailed accessibility and systems consultation'

  const document = renderProfileDocument(longProfile, 'long-layout-test')
  assert.match(document, /Alexandria-Cassandra Extremely-Long-Contact-Profile-Name/)
  assert.match(document, /Call about a detailed accessibility and systems consultation/)
  assert.ok(document.includes(layoutStyle))
})

test('generated profiles use the same panel contract as the Vue route', () => {
  const document = renderProfileDocument(publishedProfiles[0], 'layout-test')

  assert.ok(document.includes(layoutStyle))
  for (const region of [
    'contact-profile-header',
    'contact-profile-identity',
    'contact-profile-contact-actions',
    'contact-profile-save',
    'contact-profile-display',
    'contact-profile-external-actions',
    'contact-profile-details',
    'contact-profile-footer',
  ]) {
    assert.match(document, new RegExp(`class="[^"]*${region}`))
  }

  assert.match(document, /class="contact-profile-display contact-profile-panel" aria-hidden="true"/)
  assert.match(document, /data-contact-profile-renderer="canonical"/)
  assert.match(document, /<picture class="contact-profile-display__fallback"/)
  assert.doesNotMatch(document, /<canvas/)
})
