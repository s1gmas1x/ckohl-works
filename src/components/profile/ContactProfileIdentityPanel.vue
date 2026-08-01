<template>
  <section class="contact-profile-identity contact-profile-panel">
    <p class="contact-profile-identity__eyebrow">Profile // {{ slug }}</p>
    <h1 :id="titleId">{{ identity.name }}</h1>
    <p class="contact-profile-identity__role">{{ identity.role }}</p>
    <p class="contact-profile-identity__organization">{{ identity.organization }}</p>
    <span class="contact-profile-identity__divider" aria-hidden="true"></span>
    <p
      v-if="typingPhrases.length > 1"
      ref="summaryMount"
      class="contact-profile-identity__summary"
      data-terminal-typing
    >
      <span class="contact-profile-identity__summary-semantic">{{ identity.summary }}</span>
      <span class="contact-profile-identity__summary-reserve" aria-hidden="true" hidden>
        <span v-for="phrase in typingPhrases" :key="phrase" data-terminal-typing-phrase>{{
          phrase
        }}</span>
      </span>
      <span class="contact-profile-identity__summary-typed" aria-hidden="true" hidden>
        <span data-terminal-typing-output></span
        ><span class="contact-profile-identity__summary-cursor"></span>
      </span>
    </p>
    <p v-else class="contact-profile-identity__summary">{{ identity.summary }}</p>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createTerminalTypingEffect } from '@/features/contact-profile/terminalTyping.js'

const props = defineProps({
  identity: {
    type: Object,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  titleId: {
    type: String,
    required: true,
  },
})

const summaryMount = ref()
const typingPhrases = computed(() => [
  props.identity.summary,
  ...(props.identity.summaryVariants ?? []),
])
let typingEffect

function startTyping() {
  typingEffect?.dispose()
  typingEffect = undefined
  if (!summaryMount.value || typingPhrases.value.length < 2) return

  typingEffect = createTerminalTypingEffect({ mount: summaryMount.value })
  typingEffect.start()
}

onMounted(startTyping)
watch(typingPhrases, async () => {
  await nextTick()
  startTyping()
})
onBeforeUnmount(() => typingEffect?.dispose())
</script>
