import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CONTACT_PROFILE_THEME_CONTRACT_VERSION,
  CRT_AMBER_THEME_KEY,
  getContactProfileTheme,
  resolveContactProfileTheme,
  validateContactProfileThemes,
} from '../src/data/contactProfileThemes.js'
import { publishedProfiles } from '../src/data/publishedProfiles.js'
import { renderProfileDocument } from '../scripts/static-profile-renderer.mjs'

test('resolves the approved CRT amber theme contract', () => {
  const theme = resolveContactProfileTheme(CRT_AMBER_THEME_KEY)

  assert.equal(theme.contractVersion, CONTACT_PROFILE_THEME_CONTRACT_VERSION)
  assert.equal(theme.className, 'contact-profile-theme--crt-amber')
  assert.equal(theme.decorativeDisplay.canonicalRoute, 'enhanced')
  assert.equal(theme.decorativeDisplay.fallback, 'required')
  assert.equal(theme.decorativeDisplay.reducedMotion, 'static-fallback')
  assert.ok(Object.isFrozen(theme))
  assert.ok(Object.isFrozen(theme.decorativeDisplay))
})

test('returns undefined for unapproved keys and rejects them at the resolver boundary', () => {
  assert.equal(getContactProfileTheme('works'), undefined)
  assert.equal(getContactProfileTheme('__proto__'), undefined)
  assert.throws(
    () => resolveContactProfileTheme('works'),
    /Unknown contact profile theme key: "works"/,
  )
  assert.throws(
    () => resolveContactProfileTheme(undefined),
    /Unknown contact profile theme key: undefined/,
  )
})

test('validates published profile theme keys with profile context', () => {
  assert.equal(validateContactProfileThemes(publishedProfiles), publishedProfiles)
  assert.throws(
    () => validateContactProfileThemes([{ slug: 'invalid-profile', themeKey: 'customer-css' }]),
    /Profile "invalid-profile" uses unknown contact profile theme key: "customer-css"/,
  )
})

test('renders matching theme markers in generated profile HTML', () => {
  const [profile] = publishedProfiles
  const document = renderProfileDocument(profile, 'test-revision')

  assert.match(document, /meta name="profile-theme-key" content="crt-amber"/)
  assert.match(document, /data-contact-profile-theme="crt-amber"/)
  assert.match(
    document,
    new RegExp(`data-contact-profile-theme-contract="${CONTACT_PROFILE_THEME_CONTRACT_VERSION}"`),
  )
})
