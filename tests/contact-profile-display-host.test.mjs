import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createCrtDisplayHost,
  CRT_DISPLAY_INITIALIZATION_TIMEOUT_MS,
  CRT_DISPLAY_STATES,
  getCrtDisplayStatus,
} from '../src/features/contact-profile/crt-wireframe/displayHost.js'

function createMount() {
  const status = { hidden: true, textContent: '' }

  return {
    dataset: {},
    querySelector(selector) {
      return selector === '.contact-profile-display__placeholder' ? status : null
    },
    status,
  }
}

function createScheduler() {
  const callbacks = new Map()
  let nextId = 1

  return {
    cancel(id) {
      callbacks.delete(id)
    },
    async flush() {
      const pending = [...callbacks.values()]
      callbacks.clear()
      for (const callback of pending) await callback()
    },
    get pendingCount() {
      return callbacks.size
    },
    schedule(callback) {
      const id = nextId
      nextId += 1
      callbacks.set(id, callback)
      return id
    },
  }
}

function createTimers() {
  const callbacks = new Map()
  let nextId = 1

  return {
    clearTimeout(id) {
      callbacks.delete(id)
    },
    runAll() {
      const pending = [...callbacks.values()]
      callbacks.clear()
      for (const callback of pending) callback()
    },
    setTimeout(callback, delay) {
      assert.equal(delay, CRT_DISPLAY_INITIALIZATION_TIMEOUT_MS)
      const id = nextId
      nextId += 1
      callbacks.set(id, callback)
      return id
    },
  }
}

function createEnvironment({ reducedMotion = false } = {}) {
  const scheduler = createScheduler()
  const timers = createTimers()

  return {
    environment: {
      clearTimeout: timers.clearTimeout,
      matchMedia: (query) => ({
        matches: query.includes('prefers-reduced-motion') ? reducedMotion : false,
      }),
      scheduler,
      setTimeout: timers.setTimeout,
      viewportWidth: () => 1200,
    },
    scheduler,
    timers,
  }
}

test('shows fallback immediately and reveals the scene only after a successful first render', async () => {
  const mount = createMount()
  const { environment, scheduler } = createEnvironment()
  const states = []
  let sceneEvent
  let disposed = false
  const host = createCrtDisplayHost({
    mount,
    environment,
    onStateChange: (event) => states.push(event.state),
    loadScene: async () => ({
      initializeCrtWireframeScene: async ({ onEvent }) => {
        sceneEvent = onEvent
        onEvent({ type: 'ready' })
        return {
          dispose: () => {
            disposed = true
          },
        }
      },
    }),
  })

  assert.equal(host.getState().state, CRT_DISPLAY_STATES.fallback)
  assert.equal(host.start(), true)
  assert.equal(mount.dataset.displayState, CRT_DISPLAY_STATES.initializing)
  assert.equal(mount.status.textContent, 'INITIALIZING DISPLAY')
  assert.equal(scheduler.pendingCount, 1)

  await scheduler.flush()
  assert.equal(mount.dataset.displayState, CRT_DISPLAY_STATES.ready)
  assert.equal(mount.status.hidden, true)
  assert.deepEqual(states, [CRT_DISPLAY_STATES.initializing, CRT_DISPLAY_STATES.ready])

  sceneEvent({ type: 'context-lost' })
  assert.equal(mount.dataset.displayState, CRT_DISPLAY_STATES.contextLost)
  assert.equal(mount.status.textContent, 'DISPLAY STANDBY')
  sceneEvent({ type: 'context-restored' })
  assert.equal(mount.dataset.displayState, CRT_DISPLAY_STATES.ready)

  host.dispose()
  assert.equal(disposed, true)
  assert.equal(host.getState().disposed, true)
})

test('skips the scene entirely for reduced motion', () => {
  const mount = createMount()
  const { environment, scheduler } = createEnvironment({ reducedMotion: true })
  let loadCount = 0
  const host = createCrtDisplayHost({
    mount,
    environment,
    loadScene: async () => {
      loadCount += 1
      return {}
    },
  })

  assert.equal(host.start(), false)
  assert.equal(host.getState().state, CRT_DISPLAY_STATES.reducedMotion)
  assert.equal(mount.status.textContent, 'STATIC DISPLAY')
  assert.equal(scheduler.pendingCount, 0)
  assert.equal(loadCount, 0)
})

test('contains import failures and initialization timeouts behind the fallback', async () => {
  const failedMount = createMount()
  const failedHarness = createEnvironment()
  const failedHost = createCrtDisplayHost({
    mount: failedMount,
    environment: failedHarness.environment,
    loadScene: async () => {
      throw new Error('chunk unavailable')
    },
  })

  failedHost.start()
  await failedHarness.scheduler.flush()
  assert.equal(failedHost.getState().state, CRT_DISPLAY_STATES.failed)
  assert.equal(failedMount.status.hidden, true)

  const timeoutMount = createMount()
  const timeoutHarness = createEnvironment()
  const timeoutHost = createCrtDisplayHost({
    mount: timeoutMount,
    environment: timeoutHarness.environment,
    loadScene: async () => new Promise(() => {}),
  })

  timeoutHost.start()
  timeoutHarness.timers.runAll()
  assert.equal(timeoutHost.getState().state, CRT_DISPLAY_STATES.failed)
  assert.equal(timeoutMount.status.hidden, true)
})

test('contains unavailable WebGL or renderer initialization behind the fallback', async () => {
  const mount = createMount()
  const { environment, scheduler } = createEnvironment()
  const host = createCrtDisplayHost({
    mount,
    environment,
    loadScene: async () => ({
      initializeCrtWireframeScene: async () => {
        throw new Error('WebGL is unavailable')
      },
    }),
  })

  host.start()
  await scheduler.flush()

  assert.equal(host.getState().state, CRT_DISPLAY_STATES.failed)
  assert.equal(mount.dataset.displayState, CRT_DISPLAY_STATES.failed)
  assert.equal(mount.status.hidden, true)
})

test('cancels scheduled work and disposes a late controller after teardown', async () => {
  const mount = createMount()
  const { environment, scheduler } = createEnvironment()
  let resolveScene
  let initializeCount = 0
  const scenePromise = new Promise((resolve) => {
    resolveScene = resolve
  })
  const host = createCrtDisplayHost({
    mount,
    environment,
    loadScene: () => scenePromise,
  })

  host.start()
  const flushing = scheduler.flush()
  await Promise.resolve()
  host.dispose()
  resolveScene({
    initializeCrtWireframeScene: async () => {
      initializeCount += 1
      return { dispose() {} }
    },
  })
  await flushing

  assert.equal(initializeCount, 0)
  assert.equal(host.getState().disposed, true)
})

test('maps only non-empty decorative status copy', () => {
  assert.equal(getCrtDisplayStatus(CRT_DISPLAY_STATES.initializing), 'INITIALIZING DISPLAY')
  assert.equal(getCrtDisplayStatus(CRT_DISPLAY_STATES.contextLost), 'DISPLAY STANDBY')
  assert.equal(getCrtDisplayStatus(CRT_DISPLAY_STATES.reducedMotion), 'STATIC DISPLAY')
  assert.equal(getCrtDisplayStatus(CRT_DISPLAY_STATES.failed), '')
  assert.equal(getCrtDisplayStatus(CRT_DISPLAY_STATES.ready), '')
})
