import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { chrisProfile } from '../src/data/profileFixtures.js'
import { normalizeContactProfile, getActionHref } from '../src/data/contactProfileContract.js'
import { renderProfileDocument } from '../scripts/static-profile-renderer.mjs'
import { renderKohlGroupMarkup } from '../src/features/contact-profile/kohlGroupMarkup.js'

test('Chris has usable native actions and matching vCard without application JavaScript', async () => {
  const profile = normalizeContactProfile(chrisProfile)
  const html = renderProfileDocument(profile, 'chris-test', '/', {
    enhancementModulePath: '/must-not-load.js',
    sceneModulePath: '/must-not-load-scene.js',
  })
  assert.match(html, /data-contact-profile-theme="kohl-group"/)
  assert.ok(html.includes(renderKohlGroupMarkup(profile)))
  assert.doesNotMatch(html, /must-not-load|data-display-preset|CK-CONTACT|<canvas/)
  assert.equal(html.match(/<h1\b/g).length, 1)
  assert.match(html, /Strong Roots\. Better Moves\./)
  for (const action of profile.actions) {
    assert.ok(html.includes(`href="${getActionHref(action).replaceAll('&', '&amp;')}"`))
  }
  assert.match(html, /download="chris-kohl.vcf"/)
  const vcard = await readFile(
    new URL('../public/contacts/chris-kohl.vcf', import.meta.url),
    'utf8',
  )
  assert.equal(vcard, profile.vCard.content)
  const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])
  assert.equal(jsonLd.telephone, '+17199634398')
  assert.equal(jsonLd.email, 'chris@kohlrealtygroup.com')
})

test('branded rendering escapes text and honors a deployment subpath', () => {
  const profile = structuredClone(normalizeContactProfile(chrisProfile))
  profile.identity.name = '<img src=x onerror=alert(1)>'
  profile.identity.summary = '<script>alert(1)</script>'
  const html = renderKohlGroupMarkup(profile, '/ckohl-works/')
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'))
  assert.doesNotMatch(html, /<script>|<img src=x/)
  assert.match(html, /src="\/ckohl-works\/profile-media\/chris\/portrait.webp"/)
  assert.match(html, /href="\/ckohl-works\/contacts\/chris-kohl.vcf"/)
})

test('profile media accepts reviewed keys and rejects arbitrary or inherited keys', () => {
  for (const mediaKey of [
    'https://example.com/image.png',
    '../private',
    '__proto__',
    ['chris-kohl'],
    null,
  ]) {
    assert.throws(
      () =>
        normalizeContactProfile({
          ...chrisProfile,
          identity: { ...chrisProfile.identity, mediaKey },
        }),
      /must select reviewed local artwork/,
    )
  }
  assert.equal(normalizeContactProfile(chrisProfile).identity.mediaKey, 'chris-kohl')
})
