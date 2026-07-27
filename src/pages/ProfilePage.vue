<template>
  <q-page class="contact-card-page">
    <main v-if="profile" class="contact-card-page__content">
      <ContactProfileCard :profile="profile" />
    </main>
    <main v-else class="contact-card-page__content">
      <section class="contact-card">
        <h1>Profile not found</h1>
        <p class="contact-card__summary">This profile is not available at this address.</p>
      </section>
    </main>
  </q-page>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ContactProfileCard from '@/components/profile/ContactProfileCard.vue'
import { getPublishedProfile } from '@/data/publishedProfiles.js'

const route = useRoute()
const profile = computed(() => getPublishedProfile(route.params.profileSlug))

watch(
  profile,
  (activeProfile) => {
    const title = activeProfile
      ? `${activeProfile.identity.name} | ${activeProfile.identity.organization}`
      : 'Profile not found | Ckohl Works'
    const description =
      activeProfile?.identity.summary || 'This Ckohl Works profile is not available.'

    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.contact-card-page {
  width: 100vw;
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 50% -12%, rgba(255, 177, 43, 0.11), transparent 42%),
    var(--ckw-crt-screen-deep);
  color: var(--ckw-crt-amber-bright);
}
.contact-card-page__content {
  width: 100%;
  min-height: 100vh;
}
@media (max-width: 560px) {
  .contact-card-page__content {
    min-height: 100vh;
  }
}
</style>
