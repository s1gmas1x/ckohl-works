<template>
  <section
    class="contact-profile"
    :class="theme.className"
    :data-contact-profile-theme="theme.key"
    :data-contact-profile-theme-contract="theme.contractVersion"
    data-contact-profile-renderer="app"
    :aria-labelledby="titleId"
  >
    <div class="contact-profile__screen contact-profile-crt-screen">
      <ContactProfileHeader />

      <div class="contact-profile-layout">
        <ContactProfileIdentityPanel
          :identity="profile.identity"
          :slug="profile.slug"
          :title-id="titleId"
        />
        <ContactProfileActions :profile="profile" />
        <ContactProfileDisplayPanel />
        <ContactProfileDetails :profile="profile" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import ContactProfileActions from '@/components/profile/ContactProfileActions.vue'
import ContactProfileDetails from '@/components/profile/ContactProfileDetails.vue'
import ContactProfileDisplayPanel from '@/components/profile/ContactProfileDisplayPanel.vue'
import ContactProfileHeader from '@/components/profile/ContactProfileHeader.vue'
import ContactProfileIdentityPanel from '@/components/profile/ContactProfileIdentityPanel.vue'
import { resolveContactProfileTheme } from '@/data/contactProfileThemes.js'

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
})

const theme = computed(() => resolveContactProfileTheme(props.profile.themeKey))
const titleId = computed(() => `${props.profile.slug}-profile-title`)
</script>

<style lang="scss">
@use '../../css/contact-profile-fonts';
@use '../../css/contact-profile-crt';
@use '../../css/contact-profile-layout';
</style>
