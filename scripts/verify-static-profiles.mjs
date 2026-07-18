import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { contentHash, renderProfileDocument } from './static-profile-renderer.mjs'
import { publishedProfiles } from '../src/data/publishedProfiles.js'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = join(rootDir, 'dist', 'static-profiles')
const manifest = JSON.parse(await readFile(join(outputDir, 'static-profile-manifest.json'), 'utf8'))

assert.equal(manifest.profiles.length, 2, 'expected exactly two static profile fixtures')

for (const profile of publishedProfiles) {
  const documentPath = join(outputDir, 'card', 'ckohl-works', profile.slug, 'index.html')
  const document = await readFile(documentPath, 'utf8')
  const expectedHash = contentHash(profile)

  assert.match(document, new RegExp(`profile-content-hash" content="${expectedHash}"`))
  assert.match(document, /application\/ld\+json/)
  assert.match(document, new RegExp(profile.identity.name))
  assert.ok(renderProfileDocument(profile, manifest.buildRevision).includes(expectedHash))
}

const chadVCard = await readFile(join(outputDir, 'contacts', 'chad-kohl.vcf'), 'utf8')
assert.match(chadVCard, /^BEGIN:VCARD/m)
assert.match(chadVCard, /FN:Chad Kohl/)

console.log('Static profile output and deterministic content hashes verified.')
