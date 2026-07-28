import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getActionHref,
  normalizeContactProfile,
  PROFILE_SCHEMA_VERSION,
} from '../src/data/contactProfileContract.js'
import { chadProfile } from '../src/data/profileFixtures.js'
import { publishedProfiles } from '../src/data/publishedProfiles.js'
import {
  getContactProfileActionIcon,
  getContactProfileIconPaths,
} from '../src/features/contact-profile/actionIcons.js'
import { renderProfileDocument } from '../scripts/static-profile-renderer.mjs'

function cloneChadProfile() {
  return structuredClone(chadProfile)
}

test('normalizes reviewed fixtures into ordered typed actions and truthful derived status', () => {
  const chad = publishedProfiles.find((profile) => profile.slug === 'chad')

  assert.equal(PROFILE_SCHEMA_VERSION, 2)
  assert.deepEqual(
    chad.actions.map((action) => action.type),
    ['call', 'sms', 'email', 'vcard', 'website', 'website', 'social'],
  )
  assert.deepEqual(
    chad.status.map(({ key, value }) => [key, value]),
    [
      ['vcard', 'READY'],
      ['link-mode', 'DIRECT'],
    ],
  )
  assert.deepEqual(
    chad.footer.map(({ key, value }) => [key, value]),
    [
      ['profile', 'chad'],
      ['schema', 'V2'],
    ],
  )
  assert.ok(chad.actions.every(Object.isFrozen))
  assert.ok(Object.isFrozen(chad.actions))
  assert.ok(Object.isFrozen(chad))
})

test('generates safe normalized hrefs for every approved action type', () => {
  assert.equal(getActionHref({ type: 'call', value: '+1 (719) 428-5039' }), 'tel:+17194285039')
  assert.equal(getActionHref({ type: 'sms', value: '719-428-5039' }), 'sms:7194285039')
  assert.equal(
    getActionHref({ type: 'email', value: 'name+card@example.com' }),
    'mailto:name%2Bcard@example.com',
  )
  assert.equal(
    getActionHref({ type: 'vcard', value: '/contacts/chad-kohl.vcf' }, '/ckohl-works/'),
    '/ckohl-works/contacts/chad-kohl.vcf',
  )
  assert.equal(
    getActionHref({ type: 'website', value: 'https://example.com' }),
    'https://example.com/',
  )
  assert.equal(
    getActionHref({ type: 'social', value: 'https://github.com/example' }),
    'https://github.com/example',
  )
  assert.equal(
    getActionHref({
      type: 'location',
      value: 'https://www.google.com/maps/search/?api=1&query=Colorado+Springs',
    }),
    'https://www.google.com/maps/search/?api=1&query=Colorado+Springs',
  )
})

test('maps action types to framework-neutral SVG icons', () => {
  assert.equal(getContactProfileActionIcon({ type: 'call' }), 'phone')
  assert.equal(getContactProfileActionIcon({ type: 'sms' }), 'message')
  assert.equal(getContactProfileActionIcon({ type: 'email' }), 'email')
  assert.equal(getContactProfileActionIcon({ type: 'website' }), 'globe')
  assert.equal(getContactProfileActionIcon({ type: 'social', platform: 'GitHub' }), 'code')
  assert.equal(getContactProfileActionIcon({ type: 'social', platform: 'LinkedIn' }), 'people')
  assert.ok(getContactProfileIconPaths('phone').length > 0)
  assert.throws(() => getContactProfileIconPaths('unsupported'), /Unsupported contact profile icon/)
})

test('rejects unsupported schemes, malformed destinations, and unsafe vCard paths', () => {
  assert.throws(() => getActionHref({ type: 'website', value: 'javascript:alert(1)' }), /HTTPS URL/)
  assert.throws(() => getActionHref({ type: 'social', value: 'http://example.com' }), /HTTPS URL/)
  assert.throws(
    () => getActionHref({ type: 'location', value: 'https://user:pass@example.com' }),
    /without embedded credentials/,
  )
  assert.throws(
    () => getActionHref({ type: 'vcard', value: '/contacts/../secret.vcf' }),
    /root-relative/,
  )
  assert.throws(() => getActionHref({ type: 'phone', value: '+17194285039' }), /unsupported value/)
  assert.throws(() => getActionHref({ type: 'email', value: 'not-an-email' }), /email address/)
  assert.throws(() => getActionHref({ type: 'call', value: '555' }), /between 7 and 15 digits/)
  assert.throws(
    () =>
      getActionHref({ type: 'vcard', value: '/contacts/chad-kohl.vcf' }, 'https://example.com/'),
    /root-relative path/,
  )
})

test('omits optional external, status, and footer regions without weakening required actions', () => {
  const profile = cloneChadProfile()
  profile.slug = 'minimal-profile'
  profile.actions = profile.actions.filter((action) =>
    ['call', 'sms', 'email', 'vcard'].includes(action.type),
  )
  delete profile.footer

  const normalized = normalizeContactProfile(profile)

  assert.deepEqual(
    normalized.actions.map((action) => action.type),
    ['call', 'sms', 'email', 'vcard'],
  )
  assert.deepEqual(
    normalized.status.map((item) => item.key),
    ['vcard'],
  )
  assert.deepEqual(normalized.footer, [])

  const document = renderProfileDocument(normalized, 'minimal-test')
  assert.doesNotMatch(document, /class="contact-profile-external-actions"/)
  assert.doesNotMatch(document, /Link mode/)
  assert.doesNotMatch(document, /class="contact-profile-footer/)
  assert.doesNotMatch(document, /"sameAs"|"address"|"url"/)
})

test('fails deterministically for missing required actions, duplicate keys, and mismatched vCards', () => {
  const missingText = cloneChadProfile()
  missingText.actions = missingText.actions.filter((action) => action.type !== 'sms')
  assert.throws(() => normalizeContactProfile(missingText), /must contain exactly one sms action/)

  const duplicateKey = cloneChadProfile()
  duplicateKey.actions[1].key = duplicateKey.actions[0].key
  assert.throws(() => normalizeContactProfile(duplicateKey), /contains duplicate key "call"/)

  const mismatchedVcard = cloneChadProfile()
  mismatchedVcard.actions.find((action) => action.type === 'vcard').download = 'other.vcf'
  assert.throws(
    () => normalizeContactProfile(mismatchedVcard),
    /must match the configured vCard action/,
  )

  const staleVcard = cloneChadProfile()
  staleVcard.actions.find((action) => action.type === 'email').value = 'new-address@example.com'
  assert.throws(
    () => normalizeContactProfile(staleVcard),
    /must contain the configured email address/,
  )
})

test('generated HTML exposes working actions, honest statuses, and available structured data', () => {
  const chad = publishedProfiles.find((profile) => profile.slug === 'chad')
  const document = renderProfileDocument(chad, 'action-test', '/ckohl-works/')

  assert.match(document, /href="tel:\+17194285039"/)
  assert.match(document, /href="sms:\+17194285039"/)
  assert.match(document, /href="mailto:chad_kohl@ckohl\.com"/)
  assert.match(document, /href="\/ckohl-works\/contacts\/chad-kohl\.vcf" download="chad-kohl\.vcf"/)
  assert.match(document, /href="https:\/\/github\.com\/s1gmas1x"/)
  assert.match(document, /target="_blank" rel="noopener noreferrer"/)
  assert.match(document, /<dt>VCF<\/dt><dd>READY<\/dd>/)
  assert.match(document, /<dt>Link mode<\/dt><dd>DIRECT<\/dd>/)
  assert.match(document, /<dt>View mode<\/dt><dd>CANONICAL<\/dd>/)
  assert.match(document, /<svg class="contact-profile-action-tile__icon contact-profile-icon"/)
  assert.doesNotMatch(document, /<q-icon|☎|✉|💬/)
  assert.doesNotMatch(document, /DYNAMIC LINK|>ACTIVE<|analytics/i)
  assert.match(document, /"url":"https:\/\/ckohl\.com\/"/)
  assert.match(document, /"sameAs":\["https:\/\/github\.com\/s1gmas1x"\]/)
  assert.doesNotMatch(document, /"address"/)
})
