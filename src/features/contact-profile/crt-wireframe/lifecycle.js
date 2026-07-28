function defaultNow() {
  return globalThis.performance?.now?.() ?? Date.now()
}

export function createRenderLifecycle({
  renderFrame,
  maxFramesPerSecond,
  requestFrame = globalThis.requestAnimationFrame?.bind(globalThis),
  cancelFrame = globalThis.cancelAnimationFrame?.bind(globalThis),
  now = defaultNow,
  onEvent = () => {},
}) {
  if (typeof renderFrame !== 'function') {
    throw new TypeError('CRT wireframe lifecycle requires a renderFrame function.')
  }
  if (typeof requestFrame !== 'function' || typeof cancelFrame !== 'function') {
    throw new TypeError('CRT wireframe lifecycle requires animation-frame adapters.')
  }

  const minimumFrameInterval = 1000 / Math.max(1, maxFramesPerSecond || 30)
  let animationFrameId
  let contextLost = false
  let disposed = false
  let firstRenderReported = false
  let lastRenderAt
  let resumeAfterContextRestore = false
  let running = false

  function report(type, detail) {
    onEvent(Object.freeze({ type, detail }))
  }

  function renderOnce(timestamp = now()) {
    if (disposed || contextLost) return false

    try {
      const deltaSeconds =
        lastRenderAt === undefined
          ? 0
          : Math.max(0, Math.min((timestamp - lastRenderAt) / 1000, 0.1))
      renderFrame(timestamp, deltaSeconds)
      lastRenderAt = timestamp

      if (!firstRenderReported) {
        firstRenderReported = true
        report('ready')
      }

      return true
    } catch (error) {
      pause()
      report('error', error)
      return false
    }
  }

  function scheduleFrame() {
    if (!running || disposed || contextLost || animationFrameId !== undefined) return

    animationFrameId = requestFrame(handleAnimationFrame)
  }

  function handleAnimationFrame(timestamp) {
    animationFrameId = undefined
    if (!running || disposed || contextLost) return

    if (lastRenderAt === undefined || timestamp - lastRenderAt >= minimumFrameInterval) {
      renderOnce(timestamp)
    }

    scheduleFrame()
  }

  function start() {
    if (disposed || contextLost || running) return false

    running = true
    scheduleFrame()
    return true
  }

  function pause() {
    const wasRunning = running
    running = false

    if (animationFrameId !== undefined) {
      cancelFrame(animationFrameId)
      animationFrameId = undefined
    }

    return wasRunning
  }

  function handleContextLost() {
    if (disposed || contextLost) return

    resumeAfterContextRestore = running
    pause()
    contextLost = true
    report('context-lost')
  }

  function handleContextRestored() {
    if (disposed || !contextLost) return

    contextLost = false
    lastRenderAt = undefined
    report('context-restored')
    renderOnce()

    if (resumeAfterContextRestore) start()
    resumeAfterContextRestore = false
  }

  function dispose() {
    if (disposed) return

    pause()
    disposed = true
    report('disposed')
  }

  function getState() {
    return Object.freeze({
      contextLost,
      disposed,
      firstRenderReported,
      running,
    })
  }

  return Object.freeze({
    dispose,
    getState,
    handleContextLost,
    handleContextRestored,
    pause,
    renderOnce,
    start,
  })
}
