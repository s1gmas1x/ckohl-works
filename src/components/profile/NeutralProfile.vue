<template>
  <div class="neutral-profile-card">
    <ContactProfileIdentityPanel
      :identity="profile.identity"
      :slug="profile.slug"
      :title-id="titleId"
    />
    <ContactProfileActions :profile="profile" />
  </div>
</template>

<script setup>
import ContactProfileActions from '@/components/profile/ContactProfileActions.vue'
import ContactProfileIdentityPanel from '@/components/profile/ContactProfileIdentityPanel.vue'

defineProps({
  profile: { type: Object, required: true },
  titleId: { type: String, required: true },
})
</script>

<style lang="scss">
@use '../../css/contact-profile-neutral';
</style>
