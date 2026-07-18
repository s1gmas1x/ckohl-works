import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { contentHash, renderProfileDocument } from './static-profile-renderer.mjs'
import { publishedProfiles } from '../src/data/publishedProfiles.js'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = join(rootDir, 'dist', 'static-profiles')
const manifest = JSON.parse(await readFile(join(outputDir, 'static-profile-manifest.json'), 'utf8'))
const expectedSlugs = process.env.STATIC_PROFILE_SLUGS?.split(',').filter(Boolean)
const expectedProfiles = expectedSlugs
  ? publishedProfiles.filter((profile) => expectedSlugs.includes(profile.slug))
  : publishedProfiles

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

console.log('Static profile output and deterministic content hashes verified.')
