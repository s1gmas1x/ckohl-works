import { selectCrtWireframeTier } from './config.js'

export const CRT_DISPLAY_INITIALIZATION_TIMEOUT_MS = 8000
export const CRT_DISPLAY_IDLE_TIMEOUT_MS = 600

export const CRT_DISPLAY_STATES = Object.freeze({
  fallback: 'fallback',
  initializing: 'initializing',
  ready: 'ready',
  reducedMotion: 'reduced-motion',
  failed: 'failed',
  contextLost: 'context-lost',
})

export function getCrtDisplayStatus(state) {
  if (state === CRT_DISPLAY_STATES.initializing) return 'INITIALIZING DISPLAY'
  if (state === CRT_DISPLAY_STATES.contextLost) return 'DISPLAY STANDBY'
  if (state === CRT_DISPLAY_STATES.reducedMotion) return 'STATIC DISPLAY'

  return ''
}

function createDefaultScheduler(environment) {
  const requestIdleCallback = environment.requestIdleCallback ?? globalThis.requestIdleCallback
  const cancelIdleCallback = environment.cancelIdleCallback ?? globalThis.cancelIdleCallback
  const setTimer = environment.setTimeout ?? globalThis.setTimeout
  const clearTimer = environment.clearTimeout ?? globalThis.clearTimeout

  if (typeof requestIdleCallback === 'function') {
    return Object.freeze({
      cancel: (id) => cancelIdleCallback?.(id),
      schedule: (callback) =>
        requestIdleCallback(callback, { timeout: CRT_DISPLAY_IDLE_TIMEOUT_MS }),
    })
  }

  return Object.freeze({
    cancel: (id) => clearTimer(id),
    schedule: (callback) => setTimer(callback, 0),
  })
}

export function createCrtDisplayHost({
  mount,
  loadScene,
  onStateChange = () => {},
  environment = {},
}) {
  if (!mount) throw new TypeError('CRT display host requires a mount element.')
  if (typeof loadScene !== 'function') {
    throw new TypeError('CRT display host requires a scene loader.')
  }

  const matchMedia = environment.matchMedia ?? globalThis.matchMedia
  const viewportWidth = environment.viewportWidth ?? (() => globalThis.innerWidth || 0)
  const setTimer = environment.setTimeout ?? globalThis.setTimeout
  const clearTimer = environment.clearTimeout ?? globalThis.clearTimeout
  const scheduler = environment.scheduler ?? createDefaultScheduler(environment)
  let controller
  let initializationTimer
  let scheduledInitialization
  let disposed = false
  let failed = false
  let started = false
  let state = CRT_DISPLAY_STATES.fallback

  function setState(nextState, detail) {
    state = nextState
    mount.dataset.displayState = nextState
    const statusElement = mount.querySelector('.contact-profile-display__placeholder')
    const status = getCrtDisplayStatus(nextState)
    if (statusElement) {
      statusElement.textContent = status
      statusElement.hidden = !status
    }
    onStateChange(Object.freeze({ state: nextState, detail }))
  }

  function clearInitializationTimer() {
    if (initializationTimer === undefined) return

    clearTimer(initializationTimer)
    initializationTimer = undefined
  }

  function fail(detail) {
    if (disposed || failed) return

    failed = true
    clearInitializationTimer()
    controller?.dispose()
    controller = undefined
    setState(CRT_DISPLAY_STATES.failed, detail)
  }

  function handleSceneEvent(event) {
    if (disposed || failed) return

    if (event.type === 'ready') {
      clearInitializationTimer()
      setState(CRT_DISPLAY_STATES.ready)
    } else if (event.type === 'error') {
      fail(event.detail)
    } else if (event.type === 'context-lost') {
      setState(CRT_DISPLAY_STATES.contextLost)
    } else if (event.type === 'context-restored') {
      setState(CRT_DISPLAY_STATES.ready)
    }
  }

  async function initialize() {
    scheduledInitialization = undefined
    if (disposed || failed) return

    try {
      const { initializeCrtWireframeScene } = await loadScene()
      if (disposed || failed) return

      const coarsePointer = matchMedia?.('(pointer: coarse)').matches ?? false
      const tier = selectCrtWireframeTier({
        coarsePointer,
        viewportWidth: viewportWidth(),
      })
      const initializedController = await initializeCrtWireframeScene({
        mount,
        tier,
        pointerEnabled: tier.pointerEnabled && !coarsePointer,
        onEvent: handleSceneEvent,
      })

      if (disposed || failed) {
        initializedController.dispose()
        return
      }

      controller = initializedController
    } catch (error) {
      fail(error)
    }
  }

  function start() {
    if (disposed || started) return false
    started = true

    if (matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setState(CRT_DISPLAY_STATES.reducedMotion)
      return false
    }

    setState(CRT_DISPLAY_STATES.initializing)
    initializationTimer = setTimer(
      () => fail(new Error('CRT display initialization timed out.')),
      CRT_DISPLAY_INITIALIZATION_TIMEOUT_MS,
    )
    scheduledInitialization = scheduler.schedule(initialize)
    return true
  }

  function dispose() {
    if (disposed) return
    disposed = true

    if (scheduledInitialization !== undefined) {
      scheduler.cancel(scheduledInitialization)
      scheduledInitialization = undefined
    }
    clearInitializationTimer()
    controller?.dispose()
    controller = undefined
  }

  function getState() {
    return Object.freeze({
      disposed,
      failed,
      started,
      state,
    })
  }

  return Object.freeze({
    dispose,
    getState,
    pause: () => controller?.pause(),
    renderOnce: () => controller?.renderOnce(),
    resize: () => controller?.resize(),
    start,
    startRendering: () => controller?.start(),
  })
}
