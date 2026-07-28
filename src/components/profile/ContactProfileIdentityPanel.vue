<template>
  <section class="contact-profile-identity contact-profile-panel">
    <p class="contact-profile-identity__eyebrow">Profile // {{ slug }}</p>
    <h1 :id="titleId">{{ identity.name }}</h1>
    <p class="contact-profile-identity__role">{{ identity.role }}</p>
    <p class="contact-profile-identity__organization">{{ identity.organization }}</p>
    <span class="contact-profile-identity__divider" aria-hidden="true"></span>
    <p class="contact-profile-identity__summary">{{ identity.summary }}</p>
  </section>
</template>

<script setup>
defineProps({
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
</script>
