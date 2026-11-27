<template>
  <PhonePreview>
    <img
      :src="contactCardScreen"
      alt="Chad Kohl’s amber CRT contact card with Call, Text, Email, and Save Contact"
      width="691"
      height="1258"
      :loading="loading"
    />
  </PhonePreview>
</template>

<script setup>
import PhonePreview from '@/components/ui/PhonePreview.vue'
import contactCardScreen from '@/assets/images/hero/chad-contact-screen.webp'

defineProps({
  loading: {
    type: String,
    default: 'eager',
  },
})
</script>
