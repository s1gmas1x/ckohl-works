<template>
  <!-- Only our escaped, code-owned template is rendered here; never customer HTML. -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="markup"></div>
</template>

<script setup>
import { computed } from 'vue'
import { renderKohlGroupMarkup } from '@/features/contact-profile/kohlGroupMarkup.js'

const props = defineProps({ profile: { type: Object, required: true } })
const markup = computed(() => renderKohlGroupMarkup(props.profile, import.meta.env.BASE_URL))
</script>

<style lang="scss">
@use '../../css/contact-profile-kohl';
</style>
