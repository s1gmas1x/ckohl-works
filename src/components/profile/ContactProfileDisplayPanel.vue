<template>
  <section class="contact-profile-display contact-profile-panel" aria-hidden="true">
    <p class="contact-profile-display__label">DISPLAY // WIREFRAME</p>
    <div
      ref="viewportElement"
      class="contact-profile-display__viewport"
      data-display-preset="crt-wireframe"
      :data-display-state="displayState"
    >
      <span class="contact-profile-display__corner contact-profile-display__corner--tl"></span>
      <span class="contact-profile-display__corner contact-profile-display__corner--tr"></span>
      <span class="contact-profile-display__corner contact-profile-display__corner--bl"></span>
      <span class="contact-profile-display__corner contact-profile-display__corner--br"></span>
      <span class="contact-profile-display__horizon"></span>
      <span class="contact-profile-display__orb"></span>
      <span class="contact-profile-display__particle contact-profile-display__particle--one"></span>
      <span class="contact-profile-display__particle contact-profile-display__particle--two"></span>
      <span
        class="contact-profile-display__particle contact-profile-display__particle--three"
      ></span>
      <p class="contact-profile-display__placeholder">{{ displayStatus }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { selectCrtWireframeTier } from '@/features/contact-profile/crt-wireframe/config.js'

const emit = defineEmits([
  'display-ready',
  'display-error',
  'display-context-lost',
  'display-context-restored',
  'display-disposed',
])
const viewportElement = ref(null)
const displayState = ref('fallback')
const displayStatus = computed(() => {
  if (displayState.value === 'initializing') return 'INITIALIZING DISPLAY'
  if (displayState.value === 'context-lost') return 'DISPLAY STANDBY'
  if (displayState.value === 'reduced-motion') return 'STATIC DISPLAY'
  if (displayState.value === 'error') return 'STATIC DISPLAY'

  return 'DISPLAY MODULE READY'
})
let sceneController
let disposed = false

function handleSceneEvent(event) {
  if (event.type === 'disposed') {
    emit('display-disposed')
    return
  }

  if (disposed) return

  if (event.type === 'ready') {
    displayState.value = 'ready'
    emit('display-ready')
  } else if (event.type === 'error') {
    displayState.value = 'error'
    emit('display-error', event.detail)
  } else if (event.type === 'context-lost') {
    displayState.value = 'context-lost'
    emit('display-context-lost')
  } else if (event.type === 'context-restored') {
    displayState.value = 'ready'
    emit('display-context-restored')
  }
}

onMounted(async () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) {
    displayState.value = 'reduced-motion'
    return
  }

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const tier = selectCrtWireframeTier({
    coarsePointer,
    viewportWidth: window.innerWidth,
  })
  displayState.value = 'initializing'

  try {
    const { initializeCrtWireframeScene } =
      await import('@/features/contact-profile/crt-wireframe/createCrtWireframeScene.js')
    if (disposed || !viewportElement.value) return

    const initializedController = await initializeCrtWireframeScene({
      mount: viewportElement.value,
      tier,
      pointerEnabled: tier.pointerEnabled && !coarsePointer,
      onEvent: handleSceneEvent,
    })
    if (disposed) {
      initializedController.dispose()
      return
    }

    sceneController = initializedController
  } catch (error) {
    if (disposed) return

    displayState.value = 'error'
    emit('display-error', error)
  }
})

onBeforeUnmount(() => {
  disposed = true
  sceneController?.dispose()
  sceneController = undefined
})

defineExpose({
  pause: () => sceneController?.pause(),
  renderOnce: () => sceneController?.renderOnce(),
  resize: () => sceneController?.resize(),
  start: () => sceneController?.start(),
})
</script>
