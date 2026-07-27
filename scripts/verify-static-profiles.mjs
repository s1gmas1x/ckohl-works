import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { contentHash, renderProfileDocument } from './static-profile-renderer.mjs'
import {
  CONTACT_PROFILE_THEME_CONTRACT_VERSION,
  resolveContactProfileTheme,
} from '../src/data/contactProfileThemes.js'
import {
  getActionHref,
  PROFILE_SCHEMA_VERSION,
  publishedProfiles,
} from '../src/data/publishedProfiles.js'
import { parseProfileSlugs, selectProfiles } from './profile-selection.mjs'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = join(rootDir, 'dist', 'static-profiles')
const manifest = JSON.parse(await readFile(join(outputDir, 'static-profile-manifest.json'), 'utf8'))
const expectedSlugs = parseProfileSlugs(process.env.STATIC_PROFILE_SLUGS)
const expectedProfiles = selectProfiles(publishedProfiles, expectedSlugs)

function escapeHtmlAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

assert.equal(
  manifest.profiles.length,
  expectedProfiles.length,
  'unexpected static profile fixture count',
)
assert.equal(
  manifest.themeContractVersion,
  CONTACT_PROFILE_THEME_CONTRACT_VERSION,
  'unexpected contact profile theme contract version',
)

for (const profile of expectedProfiles) {
  const documentPath = join(outputDir, 'card', 'ckohl-works', profile.slug, 'index.html')
  const document = await readFile(documentPath, 'utf8')
  const expectedHash = contentHash(profile)
  const expectedTheme = resolveContactProfileTheme(profile.themeKey)
  const manifestProfile = manifest.profiles.find((entry) => entry.slug === profile.slug)
  assert.ok(manifestProfile, `manifest must include ${profile.slug}`)
  const publicBase = manifestProfile.path.slice(
    0,
    manifestProfile.path.indexOf(`card/ckohl-works/${profile.slug}/`),
  )

  assert.match(document, new RegExp(`profile-schema-version" content="${PROFILE_SCHEMA_VERSION}"`))
  assert.match(document, new RegExp(`profile-content-hash" content="${expectedHash}"`))
  assert.match(document, new RegExp(`profile-theme-key" content="${expectedTheme.key}"`))
  assert.match(document, new RegExp(`data-contact-profile-theme="${expectedTheme.key}"`))
  assert.match(document, /application\/ld\+json/)
  assert.match(document, new RegExp(profile.identity.name))
  assert.ok(renderProfileDocument(profile, manifest.buildRevision).includes(expectedHash))
  assert.equal(manifestProfile.themeKey, expectedTheme.key)

  for (const action of profile.actions) {
    const href = escapeHtmlAttribute(getActionHref(action, publicBase))
    assert.ok(
      document.includes(`href="${href}"`),
      `generated profile ${profile.slug} must include ${action.type} action ${action.key}`,
    )
  }
  for (const item of profile.status) {
    assert.ok(
      document.includes(`<dt>${item.label}</dt><dd>${item.value}</dd>`),
      `generated profile ${profile.slug} must include truthful status ${item.key}`,
    )
  }
  assert.ok(!document.includes('DYNAMIC LINK'))
  assert.ok(!document.includes('>ACTIVE<'))
}

for (const profile of expectedProfiles) {
  const vCard = await readFile(join(outputDir, 'contacts', profile.vCard.filename), 'utf8')
  assert.match(vCard, /^BEGIN:VCARD/m)
  assert.match(vCard, new RegExp(`FN:${profile.identity.name}`))
  assert.equal(vCard.replaceAll('\r\n', '\n'), profile.vCard.content.replaceAll('\r\n', '\n'))
}

if (expectedSlugs) {
  const unselectedProfiles = publishedProfiles.filter(
    (profile) => !expectedSlugs.includes(profile.slug),
  )
  const spaAssets = await Promise.all(
    (await readdir(join(outputDir, 'assets')))
      .filter((fileName) => fileName.endsWith('.js'))
      .map((fileName) => readFile(join(outputDir, 'assets', fileName), 'utf8')),
  )
  const spaSource = spaAssets.join('\n')

  for (const profile of unselectedProfiles) {
    await assert.rejects(
      readFile(join(outputDir, 'card', 'ckohl-works', profile.slug, 'index.html')),
    )
    await assert.rejects(readFile(join(outputDir, 'contacts', profile.vCard.filename)))

    for (const fixtureSentinel of [profile.identity.summary, profile.vCard.filename]) {
      assert.ok(
        !spaSource.includes(fixtureSentinel),
        `unselected profile ${profile.slug} must not be present in the SPA bundle`,
      )
    }
  }
}

console.log('Static profile output and deterministic content hashes verified.')
