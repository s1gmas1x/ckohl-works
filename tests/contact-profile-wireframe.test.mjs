import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { PerspectiveCamera, Vector3 } from 'three'
import {
  capDevicePixelRatio,
  createDeterministicParticlePositions,
  CRT_WIREFRAME_ASYNC_GZIP_BUDGET_BYTES,
  CRT_WIREFRAME_CANONICAL_LOADER_GZIP_BUDGET_BYTES,
  CRT_WIREFRAME_FALLBACK_BUDGET_BYTES,
  CRT_WIREFRAME_PROFILE_CSS_GZIP_BUDGET_BYTES,
  CRT_WIREFRAME_PROFILE_INITIAL_GZIP_BUDGET_BYTES,
  CRT_WIREFRAME_RUNTIME_BUDGETS,
  CRT_WIREFRAME_TIERS,
  normalizePointerPosition,
  selectCrtWireframeTier,
} from '../src/features/contact-profile/crt-wireframe/config.js'
import {
  createRenderLifecycle,
  createRenderVisibilityController,
} from '../src/features/contact-profile/crt-wireframe/lifecycle.js'
import { applyCameraParallax } from '../src/features/contact-profile/crt-wireframe/createCrtWireframeScene.js'

const componentSource = await readFile(
  new URL('../src/components/profile/ContactProfileDisplayPanel.vue', import.meta.url),
  'utf8',
)
const sceneSource = await readFile(
  new URL(
    '../src/features/contact-profile/crt-wireframe/createCrtWireframeScene.js',
    import.meta.url,
  ),
  'utf8',
)
const displayHostSource = await readFile(
  new URL('../src/features/contact-profile/crt-wireframe/displayHost.js', import.meta.url),
  'utf8',
)
const staticEnhancementSource = await readFile(
  new URL('../public/contact-profile/crt-wireframe-static-enhancement.js', import.meta.url),
  'utf8',
)
const staticRendererSource = await readFile(
  new URL('../scripts/static-profile-renderer.mjs', import.meta.url),
  'utf8',
)

function readSceneNumericConstant(name) {
  const match = sceneSource.match(new RegExp(`const ${name} = (-?\\d+(?:\\.\\d+)?)`))
  assert.ok(match, `Expected ${name} in the CRT wireframe scene.`)
  return Number(match[1])
}

function createFrameHarness() {
  const callbacks = new Map()
  let nextId = 1

  return {
    cancelFrame(id) {
      callbacks.delete(id)
    },
    flush(timestamp) {
      const pending = [...callbacks.values()]
      callbacks.clear()
      for (const callback of pending) callback(timestamp)
    },
    get pendingCount() {
      return callbacks.size
    },
    requestFrame(callback) {
      const id = nextId
      nextId += 1
      callbacks.set(id, callback)
      return id
    },
  }
}

test('selects restrained desktop and mobile scene budgets', () => {
  assert.equal(selectCrtWireframeTier({ viewportWidth: 1440 }), CRT_WIREFRAME_TIERS.desktop)
  assert.equal(selectCrtWireframeTier({ viewportWidth: 899 }), CRT_WIREFRAME_TIERS.mobile)
  assert.equal(
    selectCrtWireframeTier({ coarsePointer: true, viewportWidth: 1440 }),
    CRT_WIREFRAME_TIERS.mobile,
  )
  assert.equal(CRT_WIREFRAME_TIERS.desktop.devicePixelRatioCap, 1.5)
  assert.equal(CRT_WIREFRAME_TIERS.mobile.devicePixelRatioCap, 1)
  assert.equal(CRT_WIREFRAME_TIERS.desktop.groundObjectCount, 3)
  assert.equal(CRT_WIREFRAME_TIERS.mobile.groundObjectCount, 0)
  assert.ok(CRT_WIREFRAME_TIERS.mobile.particleCount < CRT_WIREFRAME_TIERS.desktop.particleCount)
  assert.ok(
    CRT_WIREFRAME_TIERS.mobile.maxFramesPerSecond < CRT_WIREFRAME_TIERS.desktop.maxFramesPerSecond,
  )
  assert.equal(CRT_WIREFRAME_ASYNC_GZIP_BUDGET_BYTES, 143_360)
  assert.equal(CRT_WIREFRAME_PROFILE_INITIAL_GZIP_BUDGET_BYTES, 10_240)
  assert.equal(CRT_WIREFRAME_CANONICAL_LOADER_GZIP_BUDGET_BYTES, 3072)
  assert.equal(CRT_WIREFRAME_PROFILE_CSS_GZIP_BUDGET_BYTES, 4096)
  assert.equal(CRT_WIREFRAME_FALLBACK_BUDGET_BYTES, 12_288)
  assert.deepEqual(CRT_WIREFRAME_RUNTIME_BUDGETS, {
    firstUsableContactActionsMs: 1500,
    maxCumulativeLayoutShift: 0.05,
    maxCoreLongTaskMs: 150,
    maxDeferredDisplayLongTaskMs: 600,
    sceneReadyAfterRequestMs: 4000,
  })
})

test('caps rendering scale, pointer influence, and particle placement deterministically', () => {
  assert.equal(capDevicePixelRatio(3, 1.5), 1.5)
  assert.equal(capDevicePixelRatio(0.5, 1.5), 1)
  assert.equal(capDevicePixelRatio(Number.NaN, 1.5), 1)

  const bounds = { left: 100, top: 50, width: 200, height: 100 }
  assert.deepEqual(normalizePointerPosition(200, 100, bounds), { x: 0, y: 0 })
  assert.deepEqual(normalizePointerPosition(-500, 500, bounds), { x: -1, y: 1 })
  assert.deepEqual(normalizePointerPosition(200, 100, { ...bounds, width: 0 }), { x: 0, y: 0 })

  const first = createDeterministicParticlePositions(10)
  const second = createDeterministicParticlePositions(10)
  assert.deepEqual(first, second)
  assert.equal(first.length, 30)
})

test('keeps ground-object motion on its faded visible-terrain period', () => {
  assert.match(sceneSource, /const terrainOffset = elapsedSeconds \* 0\.22/)
  assert.match(sceneSource, /groundObjects\.update\(terrainOffset\)/)
  assert.doesNotMatch(
    sceneSource,
    /groundObjects\.update\(\(elapsedSeconds \* 0\.22\) % TERRAIN_DEPTH\)/,
  )
})

test('keeps camera pan, tilt, and roll subtle while creating depth parallax', () => {
  const pointer = { currentX: 0, currentY: 0 }
  const initialCamera = new PerspectiveCamera(48, 1.05, 0.1, 80)
  const initialTarget = new Vector3()
  applyCameraParallax(initialCamera, initialTarget, 0, pointer)
  initialCamera.updateMatrixWorld()

  assert.deepEqual(initialCamera.position.toArray(), [0, 2.75, 6.8])
  assert.deepEqual(initialTarget.toArray(), [0, -0.28, -5.4])

  const movedCamera = new PerspectiveCamera(48, 1.05, 0.1, 80)
  const movedTarget = new Vector3()
  applyCameraParallax(movedCamera, movedTarget, 7, pointer)
  movedCamera.updateMatrixWorld()

  const foreground = new Vector3(0, 0, 0)
  const sunset = new Vector3(0, 0, -9)
  const foregroundShift = Math.abs(
    foreground.clone().project(movedCamera).x - foreground.clone().project(initialCamera).x,
  )
  const sunsetShift = Math.abs(
    sunset.clone().project(movedCamera).x - sunset.clone().project(initialCamera).x,
  )

  assert.ok(foregroundShift > sunsetShift)
  assert.ok(Math.abs(movedCamera.position.x) <= 0.2)
  assert.ok(Math.abs(movedCamera.position.y - 2.75) <= 0.065)

  const rolledCamera = new PerspectiveCamera(48, 1.05, 0.1, 80)
  const rolledTarget = new Vector3()
  applyCameraParallax(rolledCamera, rolledTarget, 10.5, pointer)
  const unrolledCamera = rolledCamera.clone()
  unrolledCamera.lookAt(rolledTarget)

  assert.ok(Math.abs(rolledCamera.quaternion.angleTo(unrolledCamera.quaternion) - 0.0061) < 1e-6)
})

test('keeps the deferred shooting-star pass disabled and inside the desktop frame', () => {
  assert.match(sceneSource, /const SHOOTING_STAR_ENABLED = false/)

  const cycleSeconds = readSceneNumericConstant('SHOOTING_STAR_CYCLE_SECONDS')
  const durationSeconds = readSceneNumericConstant('SHOOTING_STAR_DURATION_SECONDS')
  const headStartX = readSceneNumericConstant('SHOOTING_STAR_HEAD_START_X')
  const headStartY = readSceneNumericConstant('SHOOTING_STAR_HEAD_START_Y')
  const headTravelX = readSceneNumericConstant('SHOOTING_STAR_HEAD_TRAVEL_X')
  const headTravelY = readSceneNumericConstant('SHOOTING_STAR_HEAD_TRAVEL_Y')
  const headMinSize = readSceneNumericConstant('SHOOTING_STAR_HEAD_MIN_SIZE')
  const headSizeGrowth = readSceneNumericConstant('SHOOTING_STAR_HEAD_SIZE_GROWTH')
  const startSeconds = readSceneNumericConstant('SHOOTING_STAR_START_SECONDS')
  const streakLineCount = readSceneNumericConstant('SHOOTING_STAR_STREAK_LINE_COUNT')
  const tailLength = readSceneNumericConstant('SHOOTING_STAR_TAIL_LENGTH')
  const tailRiseRatio = readSceneNumericConstant('SHOOTING_STAR_TAIL_RISE_RATIO')
  const z = readSceneNumericConstant('SHOOTING_STAR_Z')
  const camera = new PerspectiveCamera(48, 1.05, 0.1, 80)
  camera.position.set(0, 2.75, 6.8)
  camera.lookAt(new Vector3(0, -0.28, -5.4))
  camera.updateMatrixWorld()

  assert.equal(cycleSeconds, 12)
  assert.equal(durationSeconds, 1.6)
  assert.equal(headMinSize, 0.11)
  assert.equal(headSizeGrowth, 0.13)
  assert.equal(startSeconds, 4)
  assert.equal(streakLineCount, 5)

  const endpoints = [
    new Vector3(headStartX + tailLength, headStartY + tailLength * tailRiseRatio, z),
    new Vector3(headStartX, headStartY, z),
    new Vector3(
      headStartX - headTravelX + tailLength,
      headStartY - headTravelY + tailLength * tailRiseRatio,
      z,
    ),
    new Vector3(headStartX - headTravelX, headStartY - headTravelY, z),
  ]

  for (const endpoint of endpoints) {
    const projected = endpoint.project(camera)
    assert.ok(Math.abs(projected.x) < 1)
    assert.ok(Math.abs(projected.y) < 1)
  }

  const shootingStarSource = sceneSource.slice(
    sceneSource.indexOf('function createShootingStar'),
    sceneSource.indexOf('function createWireframePyramid'),
  )
  assert.match(shootingStarSource, /new LineSegments\(trailGeometry, trailMaterial\)/)
  assert.match(shootingStarSource, /new Points\(headGeometry, glowMaterial\)/)
  assert.match(shootingStarSource, /new Points\(headGeometry, headMaterial\)/)
  assert.match(shootingStarSource, /object\.frustumCulled = false/)
  assert.match(shootingStarSource, /currentLineSpacing = SHOOTING_STAR_STREAK_LINE_SPACING/)
  assert.match(shootingStarSource, /groundApproachBrightness = 0\.55 \+ progress \* 0\.45/)
  assert.match(shootingStarSource, /const positions = positionAttribute\.array/)
  assert.match(shootingStarSource, /headPositionAttribute\.setXYZ\(0, headX, headY/)
  assert.match(shootingStarSource, /headSize =\s+SHOOTING_STAR_HEAD_MIN_SIZE \+ progress/)
  assert.match(shootingStarSource, /headMaterial\.opacity = visibility \* \(0\.82 \+ progress/)
})

test('reports first render, throttles animation, and fully pauses and disposes', () => {
  const frames = createFrameHarness()
  const events = []
  const renderedAt = []
  const lifecycle = createRenderLifecycle({
    renderFrame: (timestamp) => renderedAt.push(timestamp),
    maxFramesPerSecond: 30,
    requestFrame: frames.requestFrame,
    cancelFrame: frames.cancelFrame,
    now: () => 100,
    onEvent: (event) => events.push(event.type),
  })

  assert.equal(lifecycle.renderOnce(0), true)
  assert.deepEqual(events, ['ready'])
  assert.equal(lifecycle.start(), true)
  assert.equal(frames.pendingCount, 1)

  frames.flush(20)
  assert.deepEqual(renderedAt, [0])
  assert.equal(frames.pendingCount, 1)

  frames.flush(40)
  assert.deepEqual(renderedAt, [0, 40])
  assert.equal(lifecycle.pause(), true)
  assert.equal(frames.pendingCount, 0)

  lifecycle.dispose()
  lifecycle.dispose()
  assert.deepEqual(events, ['ready', 'disposed'])
  assert.deepEqual(lifecycle.getState(), {
    contextLost: false,
    disposed: true,
    firstRenderReported: true,
    running: false,
  })
  assert.equal(lifecycle.start(), false)
})

test('pauses on context loss, resumes after restoration, and contains render errors', () => {
  const frames = createFrameHarness()
  const events = []
  let shouldThrow = false
  const lifecycle = createRenderLifecycle({
    renderFrame: () => {
      if (shouldThrow) throw new Error('renderer failed')
    },
    maxFramesPerSecond: 20,
    requestFrame: frames.requestFrame,
    cancelFrame: frames.cancelFrame,
    now: () => 200,
    onEvent: (event) => events.push(event.type),
  })

  lifecycle.renderOnce(0)
  lifecycle.start()
  lifecycle.handleContextLost()
  assert.equal(frames.pendingCount, 0)
  assert.equal(lifecycle.getState().contextLost, true)

  lifecycle.handleContextRestored()
  assert.equal(lifecycle.getState().contextLost, false)
  assert.equal(lifecycle.getState().running, true)
  assert.equal(frames.pendingCount, 1)

  shouldThrow = true
  frames.flush(300)
  assert.equal(lifecycle.getState().running, false)
  assert.deepEqual(events, ['ready', 'context-lost', 'context-restored', 'error'])
})

test('pauses for off-screen and hidden states and removes visibility observers on dispose', () => {
  const listeners = new Map()
  const documentTarget = {
    visibilityState: 'visible',
    addEventListener(type, callback) {
      listeners.set(type, callback)
    },
    removeEventListener(type, callback) {
      if (listeners.get(type) === callback) listeners.delete(type)
    },
  }
  let observerCallback
  let observedMount
  let observerOptions
  let disconnected = false
  class IntersectionObserverHarness {
    constructor(callback, options) {
      observerCallback = callback
      observerOptions = options
    }

    disconnect() {
      disconnected = true
    }

    observe(mount) {
      observedMount = mount
    }
  }
  const activity = []
  let running = false
  const lifecycle = {
    pause() {
      if (!running) return false
      running = false
      activity.push('pause')
      return true
    },
    start() {
      if (running) return false
      running = true
      activity.push('start')
      return true
    },
  }
  const mount = {}
  const visibility = createRenderVisibilityController({
    lifecycle,
    mount,
    documentTarget,
    IntersectionObserverClass: IntersectionObserverHarness,
  })

  assert.equal(observedMount, mount)
  assert.deepEqual(observerOptions, { threshold: 0.01 })
  assert.equal(listeners.has('visibilitychange'), true)
  assert.equal(visibility.sync(), true)

  observerCallback([{ isIntersecting: false }])
  assert.deepEqual(activity, ['start', 'pause'])
  assert.equal(visibility.getState().intersecting, false)

  documentTarget.visibilityState = 'hidden'
  listeners.get('visibilitychange')()
  observerCallback([{ isIntersecting: true }])
  assert.deepEqual(activity, ['start', 'pause'])

  documentTarget.visibilityState = 'visible'
  listeners.get('visibilitychange')()
  assert.deepEqual(activity, ['start', 'pause', 'start'])

  visibility.dispose()
  assert.deepEqual(activity, ['start', 'pause', 'start', 'pause'])
  assert.equal(disconnected, true)
  assert.equal(listeners.has('visibilitychange'), false)
  assert.equal(visibility.getState().disposed, true)

  observerCallback([{ isIntersecting: true }])
  assert.deepEqual(activity, ['start', 'pause', 'start', 'pause'])
})

test('keeps Three.js lazy, decorative, isolated, and progressively enhances static HTML', () => {
  assert.match(componentSource, /aria-hidden="true"/)
  assert.match(componentSource, /loadScene:[\s\S]*import\([\s\S]*createCrtWireframeScene\.js/)
  assert.match(displayHostSource, /prefers-reduced-motion: reduce/)
  assert.ok(
    displayHostSource.indexOf('prefers-reduced-motion: reduce') <
      displayHostSource.indexOf('scheduler.schedule(initialize)'),
  )
  assert.doesNotMatch(componentSource, /from ['"]three['"]/)
  assert.match(sceneSource, /WebGLRenderer,[\s\S]*from 'three'/)
  assert.doesNotMatch(sceneSource, /three-module-url|@vite-ignore/)
  assert.match(sceneSource, /antialias: false/)
  assert.match(sceneSource, /powerPreference: 'low-power'/)
  assert.match(sceneSource, /IntersectionObserver/)
  assert.match(sceneSource, /webglcontextlost/)
  assert.match(sceneSource, /forceContextLoss\(\)/)
  assert.doesNotMatch(sceneSource, /DeviceOrientation|devicemotion|postprocessing|Audio/)
  assert.doesNotMatch(staticRendererSource, /createCrtWireframeScene|from 'three'/)
  assert.match(staticRendererSource, /data-display-state="fallback"/)
  assert.match(staticRendererSource, /<picture class="contact-profile-display__fallback"/)
  assert.match(staticRendererSource, /type="module" src=".*enhancementModulePath/)
  assert.match(staticRendererSource, /data-display-host-module/)
  assert.match(staticRendererSource, /data-display-scene-module/)
  assert.match(staticEnhancementSource, /createCrtDisplayHost/)
  assert.match(staticEnhancementSource, /import\(displayHostModulePath\)/)
  assert.match(staticEnhancementSource, /import\(sceneModulePath\)/)
})
