import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { contentHash, renderProfileDocument } from './static-profile-renderer.mjs'
import { publishedProfiles } from '../src/data/publishedProfiles.js'
import { parseProfileSlugs, selectProfiles } from './profile-selection.mjs'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = join(rootDir, 'dist', 'static-profiles')
const manifest = JSON.parse(await readFile(join(outputDir, 'static-profile-manifest.json'), 'utf8'))
const expectedSlugs = parseProfileSlugs(process.env.STATIC_PROFILE_SLUGS)
const expectedProfiles = selectProfiles(publishedProfiles, expectedSlugs)

assert.equal(manifest.profiles.length, expectedProfiles.length, 'unexpected static profile fixture count')

for (const profile of expectedProfiles) {
  const documentPath = join(outputDir, 'card', 'ckohl-works', profile.slug, 'index.html')
  const document = await readFile(documentPath, 'utf8')
  const expectedHash = contentHash(profile)

  assert.match(document, new RegExp(`profile-content-hash" content="${expectedHash}"`))
  assert.match(document, /application\/ld\+json/)
  assert.match(document, new RegExp(profile.identity.name))
  assert.ok(renderProfileDocument(profile, manifest.buildRevision).includes(expectedHash))
}

for (const profile of expectedProfiles) {
  const vCard = await readFile(join(outputDir, 'contacts', profile.vCard.filename), 'utf8')
  assert.match(vCard, /^BEGIN:VCARD/m)
  assert.match(vCard, new RegExp(`FN:${profile.identity.name}`))
}

if (expectedSlugs) {
  const unselectedProfiles = publishedProfiles.filter((profile) => !expectedSlugs.includes(profile.slug))
  const spaAssets = await Promise.all(
    (await readdir(join(outputDir, 'assets')))
      .filter((fileName) => fileName.endsWith('.js'))
      .map((fileName) => readFile(join(outputDir, 'assets', fileName), 'utf8')),
  )
  const spaSource = spaAssets.join('\n')

  for (const profile of unselectedProfiles) {
    await assert.rejects(readFile(join(outputDir, 'card', 'ckohl-works', profile.slug, 'index.html')))
    await assert.rejects(readFile(join(outputDir, 'contacts', profile.vCard.filename)))
    assert.ok(
      !spaSource.includes(profile.identity.name),
      `unselected profile ${profile.slug} must not be present in the SPA bundle`,
    )
  }
}

console.log('Static profile output and deterministic content hashes verified.')
