import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import {
  CRT_WIREFRAME_ASYNC_GZIP_BUDGET_BYTES,
  CRT_WIREFRAME_CANONICAL_LOADER_GZIP_BUDGET_BYTES,
  CRT_WIREFRAME_FALLBACK_BUDGET_BYTES,
  CRT_WIREFRAME_PROFILE_CSS_GZIP_BUDGET_BYTES,
  CRT_WIREFRAME_PROFILE_INITIAL_GZIP_BUDGET_BYTES,
} from '../src/features/contact-profile/crt-wireframe/config.js'

const assetsDir = resolve(process.env.CKOH_SPA_ASSETS_DIR || 'dist/spa/assets')
const spaOutputDir = resolve(process.env.CKOH_SPA_OUTPUT_DIR || join(assetsDir, '..'))
const canonicalEnhancementPath = resolve(
  process.env.CKOH_CANONICAL_ENHANCEMENT_PATH ||
    join(spaOutputDir, 'contact-profile', 'crt-wireframe-static-enhancement.js'),
)
const fallbackDir = resolve(process.env.CKOH_CRT_FALLBACK_DIR || 'public/images/contact-profile')
const assetNames = await readdir(assetsDir)
const measuredAssets = new Map()
const staticImportPattern = /(?:from\s*|import\s*)['"]\.\/([^'"]+\.js)['"]/g

function findSingleAsset(prefix, extension) {
  const matches = assetNames.filter((name) => name.startsWith(prefix) && name.endsWith(extension))

  if (matches.length !== 1) {
    throw new Error(`Expected exactly one ${prefix}*${extension} asset; found ${matches.length}.`)
  }

  return matches[0]
}

function serializeAssets(entries) {
  return Object.fromEntries([...entries].sort(([left], [right]) => left.localeCompare(right)))
}

function totalAssets(entries) {
  return entries.reduce(
    (result, [, asset]) => ({
      gzipBytes: result.gzipBytes + asset.gzipBytes,
      rawBytes: result.rawBytes + asset.rawBytes,
    }),
    { gzipBytes: 0, rawBytes: 0 },
  )
}

async function measureAsset(assetName) {
  if (measuredAssets.has(assetName)) return

  const source = await readFile(join(assetsDir, assetName))
  measuredAssets.set(assetName, {
    gzipBytes: gzipSync(source).byteLength,
    rawBytes: source.byteLength,
  })

  for (const match of source.toString('utf8').matchAll(staticImportPattern)) {
    if (!assetNames.includes(match[1])) {
      throw new Error(`${assetName} imports missing runtime asset ${match[1]}.`)
    }

    await measureAsset(match[1])
  }
}

const sceneEntryName = findSingleAsset('createCrtWireframeScene-', '.js')
const staticDisplayHostName = findSingleAsset('staticDisplayHost-', '.js')
const profileEntryName = findSingleAsset('ProfilePage-', '.js')
const profileCssName = findSingleAsset('ProfilePage-', '.css')

const staticDisplayHostSource = await readFile(join(assetsDir, staticDisplayHostName), 'utf8')
const sharedHostAssetNames = [...staticDisplayHostSource.matchAll(staticImportPattern)].map(
  (match) => match[1],
)
if (sharedHostAssetNames.length !== 1) {
  throw new Error(
    `Expected the static display bridge to import one shared host asset; found ${sharedHostAssetNames.length}.`,
  )
}
const displayHostName = sharedHostAssetNames[0]

async function collectStaticAssetGraph(assetName, destination) {
  if (destination.has(assetName)) return
  destination.add(assetName)
  await measureAsset(assetName)

  const source = await readFile(join(assetsDir, assetName), 'utf8')
  for (const match of source.matchAll(staticImportPattern)) {
    if (!assetNames.includes(match[1])) {
      throw new Error(`${assetName} imports missing runtime asset ${match[1]}.`)
    }

    await collectStaticAssetGraph(match[1], destination)
  }
}

const initialAssetNames = new Set()
const sceneAssetNames = new Set()
const canonicalLoaderAssetNames = new Set()
await collectStaticAssetGraph(profileEntryName, initialAssetNames)
await collectStaticAssetGraph(sceneEntryName, sceneAssetNames)
await collectStaticAssetGraph(staticDisplayHostName, canonicalLoaderAssetNames)

if (!initialAssetNames.has(displayHostName)) {
  throw new Error('The profile route must load the lightweight CRT display host before the scene.')
}
if (initialAssetNames.has(sceneEntryName)) {
  throw new Error('The async CRT scene must not be part of the profile route static import graph.')
}

const sceneAssets = [...sceneAssetNames].map((assetName) => [
  assetName,
  measuredAssets.get(assetName),
])
const sceneTotals = totalAssets(sceneAssets)
const criticalProfileAssets = [profileEntryName, displayHostName].map((assetName) => [
  assetName,
  measuredAssets.get(assetName),
])
const criticalProfileTotals = totalAssets(criticalProfileAssets)
const canonicalEnhancementSource = await readFile(canonicalEnhancementPath)
const canonicalEnhancement = {
  gzipBytes: gzipSync(canonicalEnhancementSource).byteLength,
  rawBytes: canonicalEnhancementSource.byteLength,
}
const canonicalLoaderAssets = [
  ['crt-wireframe-static-enhancement.js', canonicalEnhancement],
  ...[...canonicalLoaderAssetNames].map((assetName) => [assetName, measuredAssets.get(assetName)]),
]
const canonicalLoaderTotals = totalAssets(canonicalLoaderAssets)
const profileCssSource = await readFile(join(assetsDir, profileCssName))
const profileCss = {
  gzipBytes: gzipSync(profileCssSource).byteLength,
  rawBytes: profileCssSource.byteLength,
}
const fallbackNames = ['crt-wireframe-fallback-mobile.webp', 'crt-wireframe-fallback-wide.webp']
const fallbackAssets = Object.fromEntries(
  await Promise.all(
    fallbackNames.map(async (assetName) => {
      const source = await readFile(join(fallbackDir, assetName))

      return [assetName, { rawBytes: source.byteLength }]
    }),
  ),
)
const fallbackTotalBytes = Object.values(fallbackAssets).reduce(
  (total, asset) => total + asset.rawBytes,
  0,
)
const budgetChecks = {
  asyncScene: sceneTotals.gzipBytes <= CRT_WIREFRAME_ASYNC_GZIP_BUDGET_BYTES,
  fallbackImages: fallbackTotalBytes <= CRT_WIREFRAME_FALLBACK_BUDGET_BYTES,
  initialProfileCode:
    criticalProfileTotals.gzipBytes <= CRT_WIREFRAME_PROFILE_INITIAL_GZIP_BUDGET_BYTES,
  canonicalLoader:
    canonicalLoaderTotals.gzipBytes <= CRT_WIREFRAME_CANONICAL_LOADER_GZIP_BUDGET_BYTES,
  profileCss: profileCss.gzipBytes <= CRT_WIREFRAME_PROFILE_CSS_GZIP_BUDGET_BYTES,
}
const report = {
  asyncScene: {
    assets: serializeAssets(sceneAssets),
    budgetBytesGzip: CRT_WIREFRAME_ASYNC_GZIP_BUDGET_BYTES,
    entry: sceneEntryName,
    totals: sceneTotals,
  },
  budgetChecks,
  criticalProfile: {
    assets: serializeAssets(criticalProfileAssets),
    budgetBytesGzip: CRT_WIREFRAME_PROFILE_INITIAL_GZIP_BUDGET_BYTES,
    entry: profileEntryName,
    loader: displayHostName,
    totals: criticalProfileTotals,
  },
  canonicalLoader: {
    assets: serializeAssets(canonicalLoaderAssets),
    budgetBytesGzip: CRT_WIREFRAME_CANONICAL_LOADER_GZIP_BUDGET_BYTES,
    totals: canonicalLoaderTotals,
  },
  fallbackAssets,
  fallbackBudgetBytes: CRT_WIREFRAME_FALLBACK_BUDGET_BYTES,
  fallbackTotalBytes,
  initialProfileStaticGraph: [...initialAssetNames].sort(),
  passes: Object.values(budgetChecks).every(Boolean),
  profileCss: {
    ...profileCss,
    asset: profileCssName,
    budgetBytesGzip: CRT_WIREFRAME_PROFILE_CSS_GZIP_BUDGET_BYTES,
  },
}

console.log(JSON.stringify(report, null, 2))

if (!report.passes) {
  const failedBudgets = Object.entries(budgetChecks)
    .filter(([, passes]) => !passes)
    .map(([name]) => name)
    .join(', ')

  throw new Error(`CRT contact profile performance budgets exceeded: ${failedBudgets}.`)
}
