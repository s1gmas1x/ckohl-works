<template>
  <div class="crt-contact-preview">
    <img
      :src="contactCardScreen"
      class="crt-contact-preview__screen"
      alt="Chad Kohl’s amber CRT contact card with Call, Text, Email, and Save Contact"
      width="691"
      height="1258"
      :loading="loading"
    />
  </div>
</template>

<script setup>
import contactCardScreen from '@/assets/images/hero/chad-contact-screen.webp'

defineProps({
  loading: {
    type: String,
    default: 'eager',
  },
})
</script>

<style lang="scss" scoped>
.crt-contact-preview {
  position: relative;
  padding-top: 14px;
  overflow: hidden;
  border: var(--crt-preview-frame-width, 6px) solid #151a20;
  border-radius: var(--crt-preview-frame-radius, 24px);
  background: #090704;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 18px 34px rgba(0, 0, 0, 0.3);
}
.crt-contact-preview::before {
  position: absolute;
  top: 4px;
  left: 50%;
  width: 30%;
  height: 4px;
  border-radius: 999px;
  background: #272b30;
  content: '';
  transform: translateX(-50%);
}
.crt-contact-preview__screen {
  display: block;
  width: 100%;
  height: auto;
}
</style>
