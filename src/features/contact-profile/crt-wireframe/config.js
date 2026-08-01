export const CRT_WIREFRAME_SCENE_VERSION = 'crt-wireframe-scene-v1'
export const CRT_WIREFRAME_ASYNC_GZIP_BUDGET_BYTES = 140 * 1024
export const CRT_WIREFRAME_PROFILE_INITIAL_GZIP_BUDGET_BYTES = 11 * 1024
export const CRT_WIREFRAME_CANONICAL_LOADER_GZIP_BUDGET_BYTES = 3.5 * 1024
export const CRT_WIREFRAME_PROFILE_CSS_GZIP_BUDGET_BYTES = 4.5 * 1024
export const CRT_WIREFRAME_FALLBACK_BUDGET_BYTES = 12 * 1024

export const CRT_WIREFRAME_RUNTIME_BUDGETS = Object.freeze({
  firstUsableContactActionsMs: 1500,
  maxCumulativeLayoutShift: 0.05,
  maxCoreLongTaskMs: 150,
  maxDeferredDisplayLongTaskMs: 600,
  sceneReadyAfterRequestMs: 4000,
})

export const CRT_WIREFRAME_TIERS = Object.freeze({
  desktop: Object.freeze({
    key: 'desktop',
    devicePixelRatioCap: 1.5,
    groundObjectCount: 3,
    gridDivisions: 28,
    particleCount: 16,
    maxFramesPerSecond: 30,
    pointerEnabled: true,
  }),
  mobile: Object.freeze({
    key: 'mobile',
    devicePixelRatioCap: 1,
    groundObjectCount: 0,
    gridDivisions: 16,
    particleCount: 6,
    maxFramesPerSecond: 20,
    pointerEnabled: false,
  }),
})

export function selectCrtWireframeTier({ coarsePointer = false, viewportWidth = 0 } = {}) {
  if (coarsePointer || viewportWidth < 900) return CRT_WIREFRAME_TIERS.mobile

  return CRT_WIREFRAME_TIERS.desktop
}

export function capDevicePixelRatio(devicePixelRatio, cap) {
  const normalizedRatio = Number.isFinite(devicePixelRatio) ? Math.max(devicePixelRatio, 1) : 1
  const normalizedCap = Number.isFinite(cap) ? Math.max(cap, 1) : 1

  return Math.min(normalizedRatio, normalizedCap)
}

export function normalizePointerPosition(clientX, clientY, bounds) {
  if (!bounds || bounds.width <= 0 || bounds.height <= 0) return Object.freeze({ x: 0, y: 0 })

  const normalizedX = ((clientX - bounds.left) / bounds.width) * 2 - 1
  const normalizedY = ((clientY - bounds.top) / bounds.height) * 2 - 1

  return Object.freeze({
    x: Math.max(-1, Math.min(1, normalizedX)),
    y: Math.max(-1, Math.min(1, normalizedY)),
  })
}

export function createDeterministicParticlePositions(count, seed = 0x435254) {
  let state = seed >>> 0
  const positions = new Float32Array(count * 3)

  function random() {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0x100000000
  }

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3
    positions[offset] = (random() - 0.5) * 10
    positions[offset + 1] = random() * 4.4 - 0.2
    positions[offset + 2] = -2.5 - random() * 8
  }

  return positions
}
