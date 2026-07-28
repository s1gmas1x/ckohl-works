<template>
  <svg class="contact-profile-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path v-for="path in paths" :key="path" :d="path" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { getContactProfileIconPaths } from '@/features/contact-profile/actionIcons.js'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const paths = computed(() => getContactProfileIconPaths(props.name))
</script>
