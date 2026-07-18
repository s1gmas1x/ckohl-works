import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, rename, rm } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateStaticProfiles } from './static-profile-renderer.mjs'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(rootDir, 'dist')
const stagingDir = join(distDir, '.static-profiles-next')
const previousDir = join(distDir, '.static-profiles-previous')
const publishedDir = join(distDir, 'static-profiles')
const quasarBin = join(rootDir, 'node_modules', '@quasar', 'app-vite', 'bin', 'quasar.js')

function getBuildRevision() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA

  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim()
  } catch {
    return 'local-uncommitted'
  }
}

function runQuasarBuild() {
  return new Promise((resolveBuild, rejectBuild) => {
    const child = spawn(process.execPath, [quasarBin, 'build'], {
      cwd: rootDir,
      env: { ...process.env, CKOH_STATIC_PROFILE_DIST_DIR: stagingDir },
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

async function main() {
  await mkdir(distDir, { recursive: true })
  await rm(stagingDir, { recursive: true, force: true })

  try {
    await runQuasarBuild()
    if (process.env.STATIC_PROFILE_FORCE_FAILURE === '1') {
      throw new Error('Static profile failure injection requested.')
    }
    const manifest = await generateStaticProfiles({
      outputDir: stagingDir,
      buildRevision: getBuildRevision(),
    })
    await promoteBuild()
    console.log(`Published ${manifest.profiles.length} static profiles to ${publishedDir}.`)
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true })
    throw error
  }
}

await main()
