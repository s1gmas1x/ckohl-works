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
    const description = activeProfile?.identity.summary || 'This Ckohl Works profile is not available.'

    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.contact-card-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 78% 16%, rgba(249, 156, 30, 0.14), transparent 25%),
    var(--ckw-page-overlay),
    var(--ckw-page-bg);
  color: var(--ckw-text-primary);
}
.contact-card-page__content {
  width: min(620px, calc(100% - 32px));
  margin: 0 auto;
  padding: 58px 0 72px;
}
@media (max-width: 560px) {
  .contact-card-page__content {
    width: min(100% - 28px, 520px);
    padding: 34px 0 48px;
  }
}
</style>
