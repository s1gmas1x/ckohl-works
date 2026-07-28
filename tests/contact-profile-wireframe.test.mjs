import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  capDevicePixelRatio,
  createDeterministicParticlePositions,
  CRT_WIREFRAME_ASYNC_GZIP_BUDGET_BYTES,
  CRT_WIREFRAME_TIERS,
  normalizePointerPosition,
  selectCrtWireframeTier,
} from '../src/features/contact-profile/crt-wireframe/config.js'
import { createRenderLifecycle } from '../src/features/contact-profile/crt-wireframe/lifecycle.js'

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
const staticRendererSource = await readFile(
  new URL('../scripts/static-profile-renderer.mjs', import.meta.url),
  'utf8',
)

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
  assert.ok(CRT_WIREFRAME_TIERS.mobile.particleCount < CRT_WIREFRAME_TIERS.desktop.particleCount)
  assert.ok(
    CRT_WIREFRAME_TIERS.mobile.maxFramesPerSecond < CRT_WIREFRAME_TIERS.desktop.maxFramesPerSecond,
  )
  assert.equal(CRT_WIREFRAME_ASYNC_GZIP_BUDGET_BYTES, 143_360)
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

test('keeps Three.js lazy, decorative, isolated, and absent from canonical static HTML for now', () => {
  assert.match(componentSource, /aria-hidden="true"/)
  assert.match(componentSource, /await import\([\s\S]*createCrtWireframeScene\.js/)
  assert.match(componentSource, /prefers-reduced-motion: reduce/)
  assert.ok(
    componentSource.indexOf('prefers-reduced-motion: reduce') <
      componentSource.indexOf('await import'),
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
})
