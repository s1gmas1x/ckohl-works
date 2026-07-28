import { gzipSync } from 'node:zlib'
import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { CRT_WIREFRAME_ASYNC_GZIP_BUDGET_BYTES } from '../src/features/contact-profile/crt-wireframe/config.js'

const assetsDir = resolve(process.env.CKOH_SPA_ASSETS_DIR || 'dist/spa/assets')
const assetNames = await readdir(assetsDir)
const entryNames = assetNames.filter(
  (name) => name.startsWith('createCrtWireframeScene-') && name.endsWith('.js'),
)

if (entryNames.length !== 1) {
  throw new Error(
    `Expected exactly one CRT wireframe async entry in ${assetsDir}; found ${entryNames.length}.`,
  )
}

const measuredAssets = new Map()
const staticImportPattern = /(?:from\s*|import\s*)['"]\.\/([^'"]+\.js)['"]/g

async function measureAsset(assetName) {
  if (measuredAssets.has(assetName)) return

  const source = await readFile(join(assetsDir, assetName))
  measuredAssets.set(assetName, {
    gzipBytes: gzipSync(source).byteLength,
    rawBytes: source.byteLength,
  })

  const text = source.toString('utf8')
  for (const match of text.matchAll(staticImportPattern)) {
    if (!assetNames.includes(match[1])) {
      throw new Error(`${assetName} imports missing runtime asset ${match[1]}.`)
    }

    await measureAsset(match[1])
  }
}

await measureAsset(entryNames[0])

const profileEntryNames = assetNames.filter(
  (name) => name.startsWith('ProfilePage-') && name.endsWith('.js'),
)
if (profileEntryNames.length !== 1) {
  throw new Error(
    `Expected exactly one profile entry in ${assetsDir}; found ${profileEntryNames.length}.`,
  )
}

const initialAssetNames = new Set()
async function collectInitialAssets(assetName) {
  if (initialAssetNames.has(assetName)) return
  initialAssetNames.add(assetName)

  const source = await readFile(join(assetsDir, assetName), 'utf8')
  for (const match of source.matchAll(staticImportPattern)) {
    if (!assetNames.includes(match[1])) {
      throw new Error(`${assetName} imports missing runtime asset ${match[1]}.`)
    }

    await collectInitialAssets(match[1])
  }
}
await collectInitialAssets(profileEntryNames[0])

const incrementalAssets = [...measuredAssets].filter(
  ([assetName]) => !initialAssetNames.has(assetName),
)
const totals = incrementalAssets.reduce(
  (result, [, asset]) => ({
    gzipBytes: result.gzipBytes + asset.gzipBytes,
    rawBytes: result.rawBytes + asset.rawBytes,
  }),
  { gzipBytes: 0, rawBytes: 0 },
)
const report = {
  assets: Object.fromEntries(incrementalAssets),
  budgetBytesGzip: CRT_WIREFRAME_ASYNC_GZIP_BUDGET_BYTES,
  entry: entryNames[0],
  excludedInitialAssets: [...measuredAssets.keys()].filter((assetName) =>
    initialAssetNames.has(assetName),
  ),
  passes: totals.gzipBytes <= CRT_WIREFRAME_ASYNC_GZIP_BUDGET_BYTES,
  totals,
}

console.log(JSON.stringify(report, null, 2))

if (!report.passes) {
  throw new Error(
    `CRT wireframe async payload is ${totals.gzipBytes} bytes gzip, exceeding the ${CRT_WIREFRAME_ASYNC_GZIP_BUDGET_BYTES}-byte budget.`,
  )
}
