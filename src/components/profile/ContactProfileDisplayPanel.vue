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
      <picture class="contact-profile-display__fallback" aria-hidden="true">
        <source media="(max-width: 560px)" :srcset="mobileFallbackSource" />
        <img :src="wideFallbackSource" alt="" width="804" height="571" decoding="async" />
      </picture>
      <p v-if="displayStatus" class="contact-profile-display__placeholder">
        {{ displayStatus }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  createCrtDisplayHost,
  getCrtDisplayStatus,
} from '@/features/contact-profile/crt-wireframe/displayHost.js'

const emit = defineEmits([
  'display-ready',
  'display-error',
  'display-context-lost',
  'display-context-restored',
  'display-disposed',
])
const viewportElement = ref(null)
const displayState = ref('fallback')
const displayStatus = computed(() => getCrtDisplayStatus(displayState.value))
const publicBase = import.meta.env.BASE_URL
const mobileFallbackSource = `${publicBase}images/contact-profile/crt-wireframe-fallback-mobile.webp`
const wideFallbackSource = `${publicBase}images/contact-profile/crt-wireframe-fallback-wide.webp`
let displayHost

function handleStateChange(event) {
  const previousState = displayState.value
  displayState.value = event.state

  if (event.state === 'ready') {
    if (previousState === 'context-lost') emit('display-context-restored')
    else emit('display-ready')
  } else if (event.state === 'failed') {
    emit('display-error', event.detail)
  } else if (event.state === 'context-lost') {
    emit('display-context-lost')
  }
}

onMounted(() => {
  if (!viewportElement.value) return

  displayHost = createCrtDisplayHost({
    mount: viewportElement.value,
    loadScene: () => import('@/features/contact-profile/crt-wireframe/createCrtWireframeScene.js'),
    onStateChange: handleStateChange,
  })
  displayHost.start()
})

onBeforeUnmount(() => {
  displayHost?.dispose()
  displayHost = undefined
  emit('display-disposed')
})

defineExpose({
  pause: () => displayHost?.pause(),
  renderOnce: () => displayHost?.renderOnce(),
  resize: () => displayHost?.resize(),
  start: () => displayHost?.startRendering(),
})
</script>
