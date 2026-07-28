<template>
  <router-view />
</template>

<script setup>
if (document.documentElement.dataset.contactProfileRenderer === 'canonical') {
  void import('@/features/contact-profile/crt-wireframe/staticDisplayHost.js')
}
</script>
