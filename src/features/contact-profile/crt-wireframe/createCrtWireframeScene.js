import {
  BufferGeometry,
  CircleGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three'
import {
  capDevicePixelRatio,
  createDeterministicParticlePositions,
  CRT_WIREFRAME_SCENE_VERSION,
  normalizePointerPosition,
} from './config.js'
import { createRenderLifecycle, createRenderVisibilityController } from './lifecycle.js'

const DEFAULT_COLORS = Object.freeze({
  accent: '#ffc96a',
  grid: '#c9933d',
  surface: '#050402',
})
const GRID_SIZE = 34
const HORIZON_Z = -9.5
const HORIZON_Y = -1.38
const TERRAIN_DEPTH = 16
const TERRAIN_NEAR_Z = HORIZON_Z + TERRAIN_DEPTH
const TERRAIN_HALF_WIDTH = GRID_SIZE / 2
const GROUND_OBJECT_HORIZON_CLEARANCE = 1.35
const GROUND_OBJECT_FADE_DISTANCE = 1.6
const SHOOTING_STAR_CYCLE_SECONDS = 18
const SHOOTING_STAR_DURATION_SECONDS = 0.8
const SHOOTING_STAR_START_SECONDS = 12
const SUN_RADIUS = 4.25
const SUN_BASE_Y = HORIZON_Y + 1.55
const GROUND_OBJECT_LAYOUT = Object.freeze([
  Object.freeze({ depth: 5.7, height: 1.7, size: 1.3, x: -7.4 }),
  Object.freeze({ depth: 9.8, height: 1.15, size: 0.86, x: 7.8 }),
  Object.freeze({ depth: 13.2, height: 0.72, size: 0.56, x: -12 }),
])
const MOUNTAIN_RIDGE = Object.freeze([
  Object.freeze({ x: -17, y: 0.12 }),
  Object.freeze({ x: -13.2, y: 0.34 }),
  Object.freeze({ x: -9.6, y: 0.92 }),
  Object.freeze({ x: -6.8, y: 0.3 }),
  Object.freeze({ x: -3.4, y: 0.7 }),
  Object.freeze({ x: 0, y: 0.22 }),
  Object.freeze({ x: 3.7, y: 0.58 }),
  Object.freeze({ x: 7.2, y: 0.25 }),
  Object.freeze({ x: 10.8, y: 0.98 }),
  Object.freeze({ x: 14.1, y: 0.36 }),
  Object.freeze({ x: 17, y: 0.18 }),
])
const THREE = Object.freeze({
  BufferGeometry,
  CircleGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
})

function readThemeColor(mount, tokenName, fallback, readStyle) {
  const value = readStyle?.(mount)?.getPropertyValue(tokenName)?.trim()

  return value || fallback
}

function disposeScene(scene) {
  scene.traverse((object) => {
    object.geometry?.dispose?.()

    const materials = Array.isArray(object.material) ? object.material : [object.material]
    for (const material of materials) material?.dispose?.()
  })
}

function createHorizon(three, accentColor) {
  const { BufferGeometry, Line, LineBasicMaterial, Vector3 } = three
  const geometry = new BufferGeometry().setFromPoints([
    new Vector3(-TERRAIN_HALF_WIDTH, HORIZON_Y, HORIZON_Z),
    new Vector3(TERRAIN_HALF_WIDTH, HORIZON_Y, HORIZON_Z),
  ])
  const material = new LineBasicMaterial({
    color: accentColor,
    opacity: 0.82,
    transparent: true,
  })

  const horizon = new Line(geometry, material)
  horizon.position.z = 0.14
  return horizon
}

function createSun(three, accentColor, mobile) {
  const {
    CircleGeometry,
    Color,
    DoubleSide,
    Group,
    Mesh,
    MeshBasicMaterial,
    RingGeometry,
    ShaderMaterial,
  } = three
  const group = new Group()
  const segments = mobile ? 48 : 72
  const disc = new Mesh(
    new CircleGeometry(SUN_RADIUS, segments),
    new ShaderMaterial({
      uniforms: {
        sunColor: { value: new Color(accentColor) },
      },
      vertexShader: `
        varying vec2 sunUv;

        void main() {
          sunUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 sunColor;
        varying vec2 sunUv;

        void main() {
          float y = sunUv.y * 2.0 - 1.0;
          float gap = 0.0;

          gap = max(gap, 1.0 - smoothstep(0.025, 0.045, abs(y - 0.26)));
          gap = max(gap, 1.0 - smoothstep(0.035, 0.06, abs(y + 0.01)));
          gap = max(gap, 1.0 - smoothstep(0.05, 0.085, abs(y + 0.32)));
          gap = max(gap, 1.0 - smoothstep(0.07, 0.115, abs(y + 0.67)));

          if (gap > 0.5) discard;

          float intensity = mix(0.5, 0.78, smoothstep(-1.0, 1.0, y));
          gl_FragColor = vec4(sunColor, intensity);
        }
      `,
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
    }),
  )
  const rim = new Mesh(
    new RingGeometry(SUN_RADIUS, SUN_RADIUS + 0.07, segments),
    new MeshBasicMaterial({
      color: accentColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.62,
    }),
  )
  const glow = new Mesh(
    new RingGeometry(SUN_RADIUS + 0.13, SUN_RADIUS + 0.32, segments),
    new MeshBasicMaterial({
      color: accentColor,
      side: DoubleSide,
      transparent: true,
      opacity: 0.12,
    }),
  )

  group.add(disc, rim, glow)
  group.position.set(0, SUN_BASE_Y, HORIZON_Z + 0.05)
  return group
}

function createHorizonMask(three, surfaceColor) {
  const { Mesh, MeshBasicMaterial, PlaneGeometry } = three
  const maskHeight = 12
  const mask = new Mesh(
    new PlaneGeometry(GRID_SIZE, maskHeight),
    new MeshBasicMaterial({ color: surfaceColor }),
  )

  mask.position.set(0, HORIZON_Y - maskHeight / 2 - 0.01, HORIZON_Z + 0.1)
  return mask
}

function createMountainSilhouette(three, { gridColor, mobile, surfaceColor }) {
  const {
    BufferGeometry,
    Float32BufferAttribute,
    Group,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
  } = three
  const group = new Group()
  const scale = mobile ? 0.72 : 1
  const ridge = MOUNTAIN_RIDGE.map(({ x, y }) => ({ x, y: y * scale }))
  const fillPositions = []

  for (let index = 0; index < ridge.length - 1; index += 1) {
    const current = ridge[index]
    const next = ridge[index + 1]

    fillPositions.push(
      current.x,
      0,
      0,
      current.x,
      current.y,
      0,
      next.x,
      next.y,
      0,
      current.x,
      0,
      0,
      next.x,
      next.y,
      0,
      next.x,
      0,
      0,
    )
  }

  const fillGeometry = new BufferGeometry()
  fillGeometry.setAttribute('position', new Float32BufferAttribute(fillPositions, 3))
  const ridgeGeometry = new BufferGeometry().setFromPoints(
    ridge.map(({ x, y }) => new Vector3(x, y, 0)),
  )
  const fill = new Mesh(
    fillGeometry,
    new MeshBasicMaterial({ color: surfaceColor, side: DoubleSide }),
  )
  const outline = new Line(
    ridgeGeometry,
    new LineBasicMaterial({ color: gridColor, opacity: 0.4, transparent: true }),
  )

  group.add(fill, outline)
  group.position.set(0, HORIZON_Y, HORIZON_Z + 0.07)
  return group
}

function createTerrainGrid(three, { accentColor, divisions, gridColor }) {
  const { BufferGeometry, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments } = three
  const group = new Group()
  const longitudinalPositions = []

  for (let index = 0; index <= divisions; index += 1) {
    const x = -TERRAIN_HALF_WIDTH + (GRID_SIZE * index) / divisions
    longitudinalPositions.push(x, 0, HORIZON_Z, x, 0, TERRAIN_NEAR_Z)
  }

  const longitudinalGeometry = new BufferGeometry()
  longitudinalGeometry.setAttribute(
    'position',
    new Float32BufferAttribute(longitudinalPositions, 3),
  )
  const longitudinalLines = new LineSegments(
    longitudinalGeometry,
    new LineBasicMaterial({
      color: gridColor,
      opacity: 0.42,
      transparent: true,
    }),
  )
  const transversePositions = new Float32Array(divisions * 6)
  const transverseGeometry = new BufferGeometry()
  const transverseAttribute = new Float32BufferAttribute(transversePositions, 3)
  const spacing = TERRAIN_DEPTH / divisions
  transverseGeometry.setAttribute('position', transverseAttribute)
  const transverseLines = new LineSegments(
    transverseGeometry,
    new LineBasicMaterial({
      color: accentColor,
      opacity: 0.34,
      transparent: true,
    }),
  )

  function update(offset) {
    const positions = transverseAttribute.array

    for (let index = 0; index < divisions; index += 1) {
      const positionOffset = index * 6
      const z = HORIZON_Z + ((index * spacing + offset) % TERRAIN_DEPTH)
      positions[positionOffset] = -TERRAIN_HALF_WIDTH
      positions[positionOffset + 1] = 0
      positions[positionOffset + 2] = z
      positions[positionOffset + 3] = TERRAIN_HALF_WIDTH
      positions[positionOffset + 4] = 0
      positions[positionOffset + 5] = z
    }

    transverseAttribute.needsUpdate = true
  }

  update(0)
  group.add(longitudinalLines, transverseLines)
  group.position.y = HORIZON_Y

  return Object.freeze({ object: group, spacing, update })
}

function createParticles(three, { accentColor, count, mobile }) {
  const { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial } = three
  const geometry = new BufferGeometry()
  const positions = createDeterministicParticlePositions(count)
  const sunTop = SUN_BASE_Y + SUN_RADIUS

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3
    const x = positions[offset] * 2.2
    const y = positions[offset + 1]

    positions[offset] = x

    if (Math.abs(x) < SUN_RADIUS + 1 && y > HORIZON_Y && y < sunTop + 0.3) {
      const direction = x === 0 ? (index % 2 === 0 ? -1 : 1) : Math.sign(x)
      positions[offset] = direction * (SUN_RADIUS + 1.15 + (index % 3) * 0.85)
    }
  }

  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  const material = new PointsMaterial({
    color: accentColor,
    opacity: 0.54,
    size: mobile ? 0.045 : 0.038,
    sizeAttenuation: true,
    transparent: true,
  })

  return new Points(geometry, material)
}

function createShootingStar(three, { accentColor, enabled }) {
  const { BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial } = three
  const geometry = new BufferGeometry()
  const positions = new Float32Array(6)
  const positionAttribute = new Float32BufferAttribute(positions, 3)
  geometry.setAttribute('position', positionAttribute)
  const material = new LineBasicMaterial({
    color: accentColor,
    opacity: 0,
    transparent: true,
  })
  const object = new Line(geometry, material)
  object.visible = false

  function update(elapsedSeconds) {
    const cycleOffset = elapsedSeconds % SHOOTING_STAR_CYCLE_SECONDS
    const visible =
      enabled &&
      cycleOffset >= SHOOTING_STAR_START_SECONDS &&
      cycleOffset < SHOOTING_STAR_START_SECONDS + SHOOTING_STAR_DURATION_SECONDS

    object.visible = visible
    if (!visible) return

    const progress = (cycleOffset - SHOOTING_STAR_START_SECONDS) / SHOOTING_STAR_DURATION_SECONDS
    const headX = 9.2 - progress * 4.4
    const headY = 4.9 - progress * 1.25
    const tailLength = 0.72
    const fade = Math.sin(progress * Math.PI)

    positions.set([headX + tailLength, headY + tailLength * 0.22, -4, headX, headY, -4])
    positionAttribute.needsUpdate = true
    material.opacity = 0.68 * fade
  }

  return Object.freeze({ object, update })
}

function createWireframePyramid(three, { accentColor, height, size }) {
  const { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments } = three
  const halfSize = size / 2
  const apex = [0, height, 0]
  const corners = [
    [-halfSize, 0, -halfSize],
    [halfSize, 0, -halfSize],
    [halfSize, 0, halfSize],
    [-halfSize, 0, halfSize],
  ]
  const positions = []

  for (let index = 0; index < corners.length; index += 1) {
    const current = corners[index]
    const next = corners[(index + 1) % corners.length]
    positions.push(...current, ...next, ...current, ...apex)
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  const material = new LineBasicMaterial({ color: accentColor, opacity: 0.36, transparent: true })
  return new LineSegments(geometry, material)
}

function createGroundObjects(three, { accentColor, count }) {
  const { Group } = three
  const group = new Group()
  const entries = GROUND_OBJECT_LAYOUT.slice(0, count).map((layout) => {
    const object = createWireframePyramid(three, { accentColor, ...layout })
    group.add(object)
    return { ...layout, object }
  })

  function update(offset) {
    for (const entry of entries) {
      const visibleTerrainDepth = TERRAIN_DEPTH - GROUND_OBJECT_HORIZON_CLEARANCE
      const depth = GROUND_OBJECT_HORIZON_CLEARANCE + ((entry.depth + offset) % visibleTerrainDepth)
      const horizonFade = Math.min(
        1,
        (depth - GROUND_OBJECT_HORIZON_CLEARANCE) / GROUND_OBJECT_FADE_DISTANCE,
      )
      const nearFade = Math.min(1, (TERRAIN_DEPTH - depth) / GROUND_OBJECT_FADE_DISTANCE)
      const opacity = 0.36 * Math.min(horizonFade, nearFade)

      entry.object.position.set(entry.x, HORIZON_Y, HORIZON_Z + depth)
      entry.object.material.opacity = opacity
      entry.object.visible = opacity > 0.01
    }
  }

  update(0)
  return Object.freeze({ object: group, update })
}

export async function initializeCrtWireframeScene({
  mount,
  tier,
  pointerEnabled = tier.pointerEnabled,
  onEvent = () => {},
  environment = {},
}) {
  if (!mount) throw new TypeError('CRT wireframe scene requires a mount element.')

  const three = THREE
  const { PerspectiveCamera, Scene, Vector3, WebGLRenderer } = three
  const documentTarget = environment.documentTarget ?? globalThis.document
  const readStyle = environment.getComputedStyle ?? globalThis.getComputedStyle
  const requestFrame = environment.requestAnimationFrame ?? globalThis.requestAnimationFrame
  const cancelFrame = environment.cancelAnimationFrame ?? globalThis.cancelAnimationFrame
  const ResizeObserverClass = environment.ResizeObserver ?? globalThis.ResizeObserver
  const IntersectionObserverClass =
    environment.IntersectionObserver ?? globalThis.IntersectionObserver
  const accentColor = readThemeColor(mount, '--crt-color-accent', DEFAULT_COLORS.accent, readStyle)
  const gridColor = readThemeColor(mount, '--crt-color-text-muted', DEFAULT_COLORS.grid, readStyle)
  const surfaceColor = readThemeColor(
    mount,
    '--crt-color-surface-screen',
    DEFAULT_COLORS.surface,
    readStyle,
  )
  const mobile = tier.key === 'mobile'
  const scene = new Scene()
  const camera = new PerspectiveCamera(48, 1, 0.1, 80)
  const renderer = new WebGLRenderer({
    alpha: false,
    antialias: false,
    depth: true,
    powerPreference: 'low-power',
    stencil: false,
  })
  const cameraTarget = new Vector3(0, -0.28, -5.4)
  const pointer = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 }
  let sceneStartedAt
  const terrain = createTerrainGrid(three, {
    accentColor,
    divisions: tier.gridDivisions,
    gridColor,
  })
  const sun = createSun(three, accentColor, mobile)
  const horizonMask = createHorizonMask(three, surfaceColor)
  const particles = createParticles(three, {
    accentColor,
    count: tier.particleCount,
    mobile,
  })
  const mountains = createMountainSilhouette(three, {
    gridColor,
    mobile,
    surfaceColor,
  })
  const groundObjects = createGroundObjects(three, {
    accentColor,
    count: tier.groundObjectCount,
  })
  const shootingStar = createShootingStar(three, { accentColor, enabled: !mobile })
  const horizon = createHorizon(three, accentColor)

  camera.position.set(0, 2.75, 6.8)
  camera.lookAt(cameraTarget)
  scene.add(
    terrain.object,
    horizon,
    sun,
    mountains,
    horizonMask,
    particles,
    shootingStar.object,
    groundObjects.object,
  )

  renderer.setClearColor(surfaceColor, 1)
  const pixelRatio = capDevicePixelRatio(globalThis.devicePixelRatio, tier.devicePixelRatioCap)
  renderer.setPixelRatio(pixelRatio)
  renderer.domElement.className = 'contact-profile-display__canvas'
  renderer.domElement.dataset.devicePixelRatio = String(pixelRatio)
  renderer.domElement.dataset.sceneTier = tier.key
  renderer.domElement.dataset.sceneVersion = CRT_WIREFRAME_SCENE_VERSION
  renderer.domElement.setAttribute('aria-hidden', 'true')
  renderer.domElement.setAttribute('role', 'presentation')
  mount.append(renderer.domElement)

  function resize() {
    const width = Math.max(1, mount.clientWidth)
    const height = Math.max(1, mount.clientHeight)

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  function renderFrame(timestamp) {
    sceneStartedAt ??= timestamp
    const elapsedSeconds = (timestamp - sceneStartedAt) / 1000

    pointer.currentX += (pointer.targetX - pointer.currentX) * 0.025
    pointer.currentY += (pointer.targetY - pointer.currentY) * 0.025
    camera.position.x = Math.sin(elapsedSeconds * 0.11) * 0.055 + pointer.currentX * 0.18
    camera.position.y = 2.75 - pointer.currentY * 0.1
    camera.lookAt(cameraTarget)

    terrain.update((elapsedSeconds * 0.22) % terrain.spacing)
    groundObjects.update((elapsedSeconds * 0.22) % TERRAIN_DEPTH)
    sun.position.y = SUN_BASE_Y + Math.sin(elapsedSeconds * 0.5) * 0.02
    particles.rotation.y = Math.sin(elapsedSeconds * 0.08) * 0.025
    particles.position.y = Math.sin(elapsedSeconds * 0.17) * 0.025
    shootingStar.update(elapsedSeconds)
    renderer.render(scene, camera)
  }

  const lifecycle = createRenderLifecycle({
    renderFrame,
    maxFramesPerSecond: tier.maxFramesPerSecond,
    requestFrame: requestFrame.bind(globalThis),
    cancelFrame: cancelFrame.bind(globalThis),
    onEvent,
  })
  let disposed = false
  const visibilityController = createRenderVisibilityController({
    lifecycle,
    mount,
    documentTarget,
    IntersectionObserverClass,
  })

  function handlePointerMove(event) {
    const normalized = normalizePointerPosition(
      event.clientX,
      event.clientY,
      mount.getBoundingClientRect(),
    )
    pointer.targetX = normalized.x
    pointer.targetY = normalized.y
  }

  function resetPointer() {
    pointer.targetX = 0
    pointer.targetY = 0
  }

  function handleContextLost(event) {
    event.preventDefault()
    lifecycle.handleContextLost()
  }

  function handleContextRestored() {
    resize()
    lifecycle.handleContextRestored()
    visibilityController.sync()
  }

  const resizeObserver = ResizeObserverClass
    ? new ResizeObserverClass(() => {
        resize()
        lifecycle.renderOnce()
      })
    : undefined
  resizeObserver?.observe(mount)
  renderer.domElement.addEventListener('webglcontextlost', handleContextLost)
  renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored)

  if (pointerEnabled) {
    mount.addEventListener('pointermove', handlePointerMove, { passive: true })
    mount.addEventListener('pointerleave', resetPointer, { passive: true })
  }

  resize()
  lifecycle.renderOnce()
  visibilityController.sync()

  function dispose() {
    if (disposed) return
    disposed = true

    resizeObserver?.disconnect()
    visibilityController.dispose()
    renderer.domElement.removeEventListener('webglcontextlost', handleContextLost)
    renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored)
    mount.removeEventListener('pointermove', handlePointerMove)
    mount.removeEventListener('pointerleave', resetPointer)
    lifecycle.dispose()
    disposeScene(scene)
    renderer.renderLists.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
  }

  return Object.freeze({
    canvas: renderer.domElement,
    dispose,
    getState: lifecycle.getState,
    pause: lifecycle.pause,
    renderOnce: lifecycle.renderOnce,
    resize,
    start: lifecycle.start,
  })
}
