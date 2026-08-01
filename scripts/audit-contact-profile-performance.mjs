import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { CRT_WIREFRAME_RUNTIME_BUDGETS } from '../src/features/contact-profile/crt-wireframe/config.js'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = join(rootDir, 'dist', 'static-profiles')
const port = Number(process.env.CONTACT_PROFILE_PERFORMANCE_PORT || 4175)
const origin = `http://127.0.0.1:${port}`
const sceneRequestPattern = /createCrtWireframeScene-[\w-]+\.js/
const unrelatedProfileResourcePattern = /IndexPage-|MargotsPizzaPage-|margots-pizza/i

function createDeferred() {
  let resolveDeferred

  return {
    promise: new Promise((resolvePromise) => {
      resolveDeferred = resolvePromise
    }),
    resolve: () => resolveDeferred(),
  }
}

function formatPerformanceFailure(label, metric, actual, expected) {
  return `${label} ${metric} was ${actual}; expected no more than ${expected}.`
}

async function waitForServer(server) {
  await new Promise((resolveServer, rejectServer) => {
    let output = ''
    const timeout = setTimeout(() => {
      rejectServer(new Error(`Timed out waiting for the profile server.\n${output}`))
    }, 10_000)

    function handleOutput(chunk) {
      output += chunk.toString()
      if (!output.includes('Static profile proof server listening')) return

      clearTimeout(timeout)
      resolveServer()
    }

    server.stdout.on('data', handleOutput)
    server.stderr.on('data', handleOutput)
    server.on('error', (error) => {
      clearTimeout(timeout)
      rejectServer(error)
    })
    server.on('exit', (code) => {
      if (code === null || output.includes('Static profile proof server listening')) return

      clearTimeout(timeout)
      rejectServer(new Error(`Profile server exited with code ${code}.\n${output}`))
    })
  })
}

async function installPerformanceObservers(page) {
  await page.addInitScript(() => {
    const state = {
      animationFrameRequests: 0,
      displayStates: [],
      layoutShift: 0,
      longTasks: [],
      pendingAnimationFrames: 0,
      supportsLayoutShift: false,
      supportsLongTask: false,
    }
    const pendingAnimationFrames = new Set()
    const nativeCancelAnimationFrame = window.cancelAnimationFrame.bind(window)
    const nativeRequestAnimationFrame = window.requestAnimationFrame.bind(window)

    window.__crtPerformance = state
    window.requestAnimationFrame = (callback) => {
      let frameId
      frameId = nativeRequestAnimationFrame((timestamp) => {
        pendingAnimationFrames.delete(frameId)
        state.pendingAnimationFrames = pendingAnimationFrames.size
        callback(timestamp)
      })
      pendingAnimationFrames.add(frameId)
      state.animationFrameRequests += 1
      state.pendingAnimationFrames = pendingAnimationFrames.size
      return frameId
    }
    window.cancelAnimationFrame = (frameId) => {
      pendingAnimationFrames.delete(frameId)
      state.pendingAnimationFrames = pendingAnimationFrames.size
      nativeCancelAnimationFrame(frameId)
    }

    try {
      new PerformanceObserver((entries) => {
        for (const entry of entries.getEntries()) {
          if (!entry.hadRecentInput) state.layoutShift += entry.value
        }
      }).observe({ type: 'layout-shift', buffered: true })
      state.supportsLayoutShift = true
    } catch {
      // The Chromium lab browser supports this. Unsupported browsers still retain the fallback.
    }

    try {
      new PerformanceObserver((entries) => {
        for (const entry of entries.getEntries()) {
          state.longTasks.push({ duration: entry.duration, startTime: entry.startTime })
        }
      }).observe({ type: 'longtask', buffered: true })
      state.supportsLongTask = true
    } catch {
      // Long Task reporting is supplementary to the semantic and lifecycle checks.
    }

    new MutationObserver((records) => {
      for (const record of records) {
        const target = record.target
        if (
          record.type === 'attributes' &&
          target instanceof HTMLElement &&
          target.matches('[data-display-preset="crt-wireframe"]')
        ) {
          state.displayStates.push({ at: performance.now(), state: target.dataset.displayState })
        }
      }
    }).observe(document, {
      attributes: true,
      attributeFilter: ['data-display-state'],
      childList: true,
      subtree: true,
    })
  })
}

async function getCoreReadiness(page) {
  return page.evaluate(() => {
    const actions = document.querySelectorAll('.contact-profile a')
    const fallbackImage = document.querySelector('.contact-profile-display__fallback img')
    const title = document.querySelector('.contact-profile h1')

    return {
      actionCount: actions.length,
      canvasCount: document.querySelectorAll('.contact-profile-display__canvas').length,
      fallbackImageReady: Boolean(fallbackImage?.complete && fallbackImage.naturalWidth > 0),
      readyAt: performance.now(),
      title: title?.textContent?.trim() || '',
    }
  })
}

async function auditReadyDisplayPresentation(page, label) {
  await page.waitForFunction(
    () => {
      const canvas = document.querySelector('.contact-profile-display__canvas')
      return Boolean(canvas) && getComputedStyle(canvas).opacity === '1'
    },
    { timeout: 1000 },
  )
  const presentation = await page.evaluate(() => {
    const canvas = document.querySelector('.contact-profile-display__canvas')
    const fallback = document.querySelector('.contact-profile-display__fallback')
    const viewport = document.querySelector('[data-display-preset="crt-wireframe"]')
    const bounds = (element) => {
      const { height, left, top, width } = element.getBoundingClientRect()
      return { height, left, top, width }
    }
    return {
      canvas: canvas ? bounds(canvas) : undefined,
      canvasOpacity: canvas ? Number.parseFloat(getComputedStyle(canvas).opacity) : 0,
      canvasTransition: canvas ? getComputedStyle(canvas).transition : '',
      fallback: fallback ? bounds(fallback) : undefined,
      fallbackOpacity: fallback ? Number.parseFloat(getComputedStyle(fallback).opacity) : 0,
      state: viewport?.dataset.displayState,
      viewport: viewport
        ? {
            ...bounds(viewport),
            clientHeight: viewport.clientHeight,
            clientLeft: viewport.clientLeft,
            clientTop: viewport.clientTop,
            clientWidth: viewport.clientWidth,
          }
        : undefined,
    }
  })

  assert.ok(
    presentation.viewport,
    `${label} must retain the display viewport after the first render`,
  )
  assert.equal(presentation.state, 'ready', `${label} display must stay ready after its reveal`)
  assert.ok(presentation.canvas, `${label} must retain a display canvas after the first render`)
  assert.ok(presentation.fallback, `${label} must retain the fallback below the canvas`)
  assert.equal(
    presentation.canvasOpacity,
    1,
    `${label} canvas must complete its reveal: ${JSON.stringify(presentation)}`,
  )
  assert.equal(
    presentation.fallbackOpacity,
    1,
    `${label} fallback must remain available below canvas`,
  )
  assert.match(
    presentation.canvasTransition,
    /opacity/,
    `${label} canvas must preserve the fallback-to-canvas crossfade`,
  )

  for (const boundary of ['height', 'left', 'top', 'width']) {
    assert.ok(
      Math.abs(presentation.canvas[boundary] - presentation.fallback[boundary]) <= 1,
      `${label} canvas and fallback must stay aligned at ${boundary}`,
    )
  }

  assert.ok(
    Math.abs(presentation.canvas.height - presentation.viewport.clientHeight) <= 1,
    `${label} canvas must fill the viewport content height`,
  )
  assert.ok(
    Math.abs(presentation.canvas.width - presentation.viewport.clientWidth) <= 1,
    `${label} canvas must fill the viewport content width`,
  )
  assert.ok(
    Math.abs(
      presentation.canvas.left - presentation.viewport.left - presentation.viewport.clientLeft,
    ) <= 1,
    `${label} canvas must start inside the viewport border`,
  )
  assert.ok(
    Math.abs(
      presentation.canvas.top - presentation.viewport.top - presentation.viewport.clientTop,
    ) <= 1,
    `${label} canvas must start inside the viewport border`,
  )
}

async function getRecordedMetrics(page) {
  return page.evaluate(() => {
    const state = window.__crtPerformance
    const sceneResources = performance
      .getEntriesByType('resource')
      .filter((entry) => entry.name.includes('createCrtWireframeScene'))
      .map((entry) => ({
        decodedBodySize: entry.decodedBodySize,
        duration: entry.duration,
        name: entry.name,
        transferSize: entry.transferSize,
      }))
    const resourceNames = performance.getEntriesByType('resource').map((entry) => entry.name)
    const readyState = [...state.displayStates]
      .reverse()
      .find(({ state: value }) => value === 'ready')

    return {
      ...state,
      maxLongTaskMs: Math.max(0, ...state.longTasks.map(({ duration }) => duration)),
      readyAt: readyState?.at,
      resourceNames,
      sceneResources,
    }
  })
}

async function waitForSceneRequest(deferred, label) {
  let timeout

  try {
    await Promise.race([
      deferred.promise,
      new Promise((_, rejectPromise) => {
        timeout = setTimeout(
          () =>
            rejectPromise(new Error(`${label} did not request the lazy scene within 2 seconds.`)),
          2000,
        )
      }),
    ])
  } finally {
    clearTimeout(timeout)
  }
}

async function setDocumentVisibility(page, visibilityState) {
  await page.evaluate((nextVisibilityState) => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: nextVisibilityState,
    })
    document.dispatchEvent(new Event('visibilitychange'))
  }, visibilityState)
}

async function collectHeapBytes(page) {
  const session = await page.context().newCDPSession(page)
  await session.send('HeapProfiler.collectGarbage')
  const { metrics } = await session.send('Performance.getMetrics')
  await session.detach()

  const heapMetric = metrics.find((metric) => metric.name === 'JSHeapUsedSize')?.value
  if (Number.isFinite(heapMetric)) return heapMetric

  return page.evaluate(() => performance.memory?.usedJSHeapSize ?? null)
}

async function auditRepeatedAppNavigation(page, label) {
  const heapBefore = await collectHeapBytes(page)
  const canvas = page.locator('.contact-profile-display__canvas')

  await canvas.evaluate((element) => {
    element.dispatchEvent(new Event('webglcontextlost', { cancelable: true }))
  })
  await page.waitForFunction(
    () =>
      document.querySelector('[data-display-preset="crt-wireframe"]')?.dataset.displayState ===
      'context-lost',
  )
  assert.equal(
    await page.evaluate(() => window.__crtPerformance.pendingAnimationFrames),
    0,
    `${label} must not leave a frame queued after context loss`,
  )
  await canvas.evaluate((element) => {
    element.dispatchEvent(new Event('webglcontextrestored'))
  })
  await page.waitForFunction(
    () =>
      document.querySelector('[data-display-preset="crt-wireframe"]')?.dataset.displayState ===
      'ready',
  )

  for (let index = 0; index < 3; index += 1) {
    await page.evaluate(() => {
      window.location.hash = '#/card/ckohl-works/not-a-profile'
    })
    await page.getByRole('heading', { name: 'Profile not found' }).waitFor()
    await page.waitForFunction(
      () =>
        document.querySelectorAll('.contact-profile-display__canvas').length === 0 &&
        window.__crtPerformance.pendingAnimationFrames === 0,
    )

    await page.evaluate(() => {
      window.location.hash = '#/card/ckohl-works/chad'
    })
    await page.waitForSelector('.contact-profile')
    await page.waitForFunction(
      () =>
        document.querySelector('[data-display-preset="crt-wireframe"]')?.dataset.displayState ===
        'ready',
    )
    assert.equal(await canvas.count(), 1, `${label} must restore exactly one canvas per navigation`)
  }

  const heapAfter = await collectHeapBytes(page)
  return { heapAfter, heapBefore }
}

async function auditNormalDisplay(browser, { key, path }) {
  const label = `${key}/chad/mobile`
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { height: 844, width: 390 },
  })
  const page = await context.newPage()
  const pageErrors = []
  const releaseScene = createDeferred()
  const sceneRequested = createDeferred()
  let sceneCoreReady = false
  let sceneRequestAt
  let sceneRequestCount = 0

  page.on('pageerror', (error) => pageErrors.push(error.message))
  await installPerformanceObservers(page)
  await page.route('**/createCrtWireframeScene-*.js', async (route) => {
    sceneRequestCount += 1
    if (sceneRequestCount === 1) {
      sceneCoreReady = await page.evaluate(() => {
        const title = document.querySelector('.contact-profile h1')
        const actions = document.querySelectorAll('.contact-profile a')
        return Boolean(title?.textContent?.trim()) && actions.length >= 6
      })
      sceneRequestAt = await page.evaluate(() => performance.now())
      sceneRequested.resolve()
      await releaseScene.promise
    }

    await route.continue()
  })

  try {
    await page.goto(`${origin}${path}`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.contact-profile')
    const core = await getCoreReadiness(page)
    await waitForSceneRequest(sceneRequested, label)

    assert.ok(core.title, `${label} must expose identity before the lazy scene loads`)
    assert.ok(
      core.actionCount >= 6,
      `${label} must expose contact actions before the lazy scene loads`,
    )
    assert.equal(
      core.canvasCount,
      0,
      `${label} must keep the fallback visible while the scene is delayed`,
    )
    assert.equal(
      core.fallbackImageReady,
      true,
      `${label} must render the fallback before the scene`,
    )
    assert.equal(
      sceneCoreReady,
      true,
      `${label} must not request the scene before core actions exist`,
    )
    assert.ok(
      core.readyAt <= CRT_WIREFRAME_RUNTIME_BUDGETS.firstUsableContactActionsMs,
      formatPerformanceFailure(
        label,
        'first usable contact actions (ms)',
        Math.round(core.readyAt),
        CRT_WIREFRAME_RUNTIME_BUDGETS.firstUsableContactActionsMs,
      ),
    )
    const coreMetrics = await getRecordedMetrics(page)
    assert.ok(
      coreMetrics.maxLongTaskMs <= CRT_WIREFRAME_RUNTIME_BUDGETS.maxCoreLongTaskMs,
      formatPerformanceFailure(
        label,
        'pre-scene long task (ms)',
        Math.round(coreMetrics.maxLongTaskMs),
        CRT_WIREFRAME_RUNTIME_BUDGETS.maxCoreLongTaskMs,
      ),
    )

    const releasedAt = await page.evaluate(() => performance.now())
    releaseScene.resolve()
    await page.waitForFunction(
      () =>
        document.querySelector('[data-display-preset="crt-wireframe"]')?.dataset.displayState ===
        'ready',
    )
    await auditReadyDisplayPresentation(page, label)
    const metrics = await getRecordedMetrics(page)
    const sceneReadyAfterRequestMs = (metrics.readyAt || releasedAt) - releasedAt
    const maxDeferredDisplayLongTaskMs = Math.max(
      0,
      ...metrics.longTasks
        .filter(({ startTime }) => startTime >= releasedAt)
        .map(({ duration }) => duration),
    )

    assert.equal(sceneRequestCount, 1, `${label} must request the async scene once per mount`)
    assert.equal(metrics.sceneResources.length, 1, `${label} must fetch one async scene resource`)
    const unrelatedResources = metrics.resourceNames.filter((name) =>
      unrelatedProfileResourcePattern.test(name),
    )
    assert.deepEqual(
      unrelatedResources,
      [],
      `${label} must not request unrelated marketing/profile assets: ${unrelatedResources.join(', ')}`,
    )
    assert.ok(
      sceneReadyAfterRequestMs <= CRT_WIREFRAME_RUNTIME_BUDGETS.sceneReadyAfterRequestMs,
      formatPerformanceFailure(
        label,
        'scene first-render delay (ms)',
        Math.round(sceneReadyAfterRequestMs),
        CRT_WIREFRAME_RUNTIME_BUDGETS.sceneReadyAfterRequestMs,
      ),
    )
    assert.ok(
      metrics.layoutShift <= CRT_WIREFRAME_RUNTIME_BUDGETS.maxCumulativeLayoutShift,
      formatPerformanceFailure(
        label,
        'cumulative layout shift',
        metrics.layoutShift.toFixed(3),
        CRT_WIREFRAME_RUNTIME_BUDGETS.maxCumulativeLayoutShift,
      ),
    )
    assert.ok(
      maxDeferredDisplayLongTaskMs <= CRT_WIREFRAME_RUNTIME_BUDGETS.maxDeferredDisplayLongTaskMs,
      formatPerformanceFailure(
        label,
        'deferred display long task (ms)',
        Math.round(maxDeferredDisplayLongTaskMs),
        CRT_WIREFRAME_RUNTIME_BUDGETS.maxDeferredDisplayLongTaskMs,
      ),
    )

    await page.locator('[data-display-preset="crt-wireframe"]').scrollIntoViewIfNeeded()
    await page.waitForFunction(() => window.__crtPerformance.pendingAnimationFrames >= 1)
    await setDocumentVisibility(page, 'hidden')
    await page.waitForTimeout(160)
    assert.equal(
      await page.evaluate(() => window.__crtPerformance.pendingAnimationFrames),
      0,
      `${label} must not render while the document is hidden`,
    )
    const frameRequestsBeforeResume = await page.evaluate(
      () => window.__crtPerformance.animationFrameRequests,
    )
    await setDocumentVisibility(page, 'visible')
    await page.waitForFunction(
      (previousFrameRequests) =>
        window.__crtPerformance.animationFrameRequests > previousFrameRequests,
      frameRequestsBeforeResume,
      { timeout: 1000 },
    )

    const repeatedNavigation =
      key === 'app' ? await auditRepeatedAppNavigation(page, label) : undefined
    assert.deepEqual(pageErrors, [], `${label} must not raise browser errors`)

    return {
      core,
      label,
      metrics: {
        coreLongTaskMs: coreMetrics.maxLongTaskMs,
        layoutShift: metrics.layoutShift,
        maxDeferredDisplayLongTaskMs,
        sceneReadyAfterRequestMs,
        sceneResources: metrics.sceneResources,
      },
      repeatedNavigation,
      sceneRequestAt,
    }
  } finally {
    releaseScene.resolve()
    await context.close()
  }
}

async function auditReducedMotion(browser, { key, path }) {
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { height: 844, width: 390 },
  })
  const page = await context.newPage()
  let sceneRequestCount = 0
  page.on('request', (request) => {
    if (sceneRequestPattern.test(request.url())) sceneRequestCount += 1
  })

  try {
    await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' })
    const result = await page.evaluate(() => {
      const viewport = document.querySelector('[data-display-preset="crt-wireframe"]')
      return {
        canvasCount: viewport?.querySelectorAll('canvas').length,
        state: viewport?.dataset.displayState,
      }
    })

    assert.equal(result.state, 'reduced-motion', `${key} reduced motion must retain the fallback`)
    assert.equal(result.canvasCount, 0, `${key} reduced motion must not allocate a canvas`)
    assert.equal(sceneRequestCount, 0, `${key} reduced motion must not request the scene`)
    return { key, ...result }
  } finally {
    await context.close()
  }
}

if (!existsSync(join(outputDir, 'static-profile-manifest.json'))) {
  throw new Error('Run npm run build:profiles before the performance audit.')
}

const server = spawn(process.execPath, ['scripts/serve-static-profiles.mjs'], {
  cwd: rootDir,
  env: {
    ...process.env,
    PORT: String(port),
    STATIC_PROFILE_DIR: outputDir,
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let browser
try {
  await waitForServer(server)
  browser = await chromium.launch({ headless: true })
  const renderers = [
    { key: 'canonical', path: '/card/ckohl-works/chad/' },
    { key: 'app', path: '/#/card/ckohl-works/chad' },
  ]
  const normal = []
  const reducedMotion = []

  for (const renderer of renderers) {
    normal.push(await auditNormalDisplay(browser, renderer))
    reducedMotion.push(await auditReducedMotion(browser, renderer))
  }

  console.log(JSON.stringify({ passes: true, normal, reducedMotion }, null, 2))
} finally {
  await browser?.close()
  server.kill('SIGTERM')
}
