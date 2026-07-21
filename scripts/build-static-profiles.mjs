import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { generateStaticProfiles } from './static-profile-renderer.mjs'
import { publishedProfiles } from '../src/data/publishedProfiles.js'
import { profileModuleExportNames } from '../src/data/profileFixtures.js'
import { parseProfileSlugs, selectProfiles } from './profile-selection.mjs'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(rootDir, 'dist')
const stagingDir = join(distDir, '.static-profiles-next')
const previousDir = join(distDir, '.static-profiles-previous')
const publishedDir = join(distDir, 'static-profiles')
const buildSupportDir = join(rootDir, '.ckohl-build')
const selectedProfileModule = join(buildSupportDir, 'selected-profiles.mjs')
const quasarBin = join(rootDir, 'node_modules', '@quasar', 'app-vite', 'bin', 'quasar.js')
const profileSlugs = parseProfileSlugs(process.env.STATIC_PROFILE_SLUGS)
const publicBase = process.env.DEPLOY_TARGET === 'github-pages' ? '/ckohl-works/' : '/'

function getBuildRevision() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA

  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim()
  } catch {
    return 'local-uncommitted'
  }
}

async function writeSelectedProfileModule() {
  if (!profileSlugs) return undefined

  const selectedProfiles = selectProfiles(publishedProfiles, profileSlugs)
  const fixtureModuleUrl = pathToFileURL(join(rootDir, 'src', 'data', 'profileFixtures.js')).href
  const importedProfiles = selectedProfiles.map((profile, index) => {
    const exportName = profileModuleExportNames[profile.slug]

    if (!exportName) throw new Error(`No client module export is configured for ${profile.slug}.`)
    return { exportName, localName: `profile${index}` }
  })
  const imports = importedProfiles.map(({ exportName, localName }) => `${exportName} as ${localName}`)
  const localNames = importedProfiles.map(({ localName }) => localName)
  const moduleSource = `import { PROFILE_SCHEMA_VERSION, getActionHref, ${imports.join(', ')} } from ${JSON.stringify(
    fixtureModuleUrl,
  )}\n\nexport { PROFILE_SCHEMA_VERSION, getActionHref }\n\nexport const publishedProfiles = Object.freeze([${localNames.join(', ')}])\n\nexport function getPublishedProfile(slug) {\n  return publishedProfiles.find((profile) => profile.slug === slug)\n}\n`

  await mkdir(buildSupportDir, { recursive: true })
  await writeFile(selectedProfileModule, moduleSource)

  return selectedProfileModule
}

function runQuasarBuild(profileModule) {
  return new Promise((resolveBuild, rejectBuild) => {
    const child = spawn(process.execPath, [quasarBin, 'build'], {
      cwd: rootDir,
      env: {
        ...process.env,
        CKOH_STATIC_PROFILE_DIST_DIR: stagingDir,
        ...(profileModule ? { CKOH_SELECTED_PROFILE_MODULE: profileModule } : {}),
      },
      stdio: 'inherit',
    })

    child.on('error', rejectBuild)
    child.on('exit', (code) => {
      if (code === 0) resolveBuild()
      else rejectBuild(new Error(`Quasar build failed with exit code ${code}.`))
    })
  })
}

async function promoteBuild() {
  await rm(previousDir, { recursive: true, force: true })

  if (existsSync(publishedDir)) await rename(publishedDir, previousDir)

  try {
    await rename(stagingDir, publishedDir)
  } catch (error) {
    if (existsSync(previousDir) && !existsSync(publishedDir)) await rename(previousDir, publishedDir)
    throw error
  }

  await rm(previousDir, { recursive: true, force: true })
}

async function removeUnselectedVcards() {
  if (!profileSlugs) return

  const selectedSlugs = new Set(profileSlugs)
  const unselectedProfiles = publishedProfiles.filter((profile) => !selectedSlugs.has(profile.slug))

  for (const profile of unselectedProfiles) {
    await rm(join(stagingDir, 'contacts', profile.vCard.filename), { force: true })
  }
}

async function main() {
  await mkdir(distDir, { recursive: true })
  await rm(stagingDir, { recursive: true, force: true })

  try {
    const profileModule = await writeSelectedProfileModule()
    await runQuasarBuild(profileModule)
    if (process.env.STATIC_PROFILE_FORCE_FAILURE === '1') {
      throw new Error('Static profile failure injection requested.')
    }
    const manifest = await generateStaticProfiles({
      outputDir: stagingDir,
      buildRevision: getBuildRevision(),
      profileSlugs,
      publicBase,
    })
    await removeUnselectedVcards()
    await promoteBuild()
    console.log(`Published ${manifest.profiles.length} static profiles to ${publishedDir}.`)
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true })
    throw error
  } finally {
    await rm(buildSupportDir, { recursive: true, force: true })
  }
}

await main()
