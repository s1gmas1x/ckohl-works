<template>
  <div class="contact-profile-detail-regions">
    <dl
      v-if="profile.status.length"
      class="contact-profile-details contact-profile-panel"
      aria-label="Profile details"
    >
      <div v-for="item in profile.status" :key="item.key">
        <dt>{{ item.label }}</dt>
        <dd>{{ item.value }}</dd>
      </div>
    </dl>

    <footer
      v-if="profile.footer.length"
      class="contact-profile-footer contact-profile-panel"
      aria-label="Profile status"
    >
      <span v-for="item in profile.footer" :key="item.key">
        <span class="contact-profile-footer__label">{{ item.label }}</span>
        <span class="contact-profile-footer__value">{{ item.value }}</span>
      </span>
    </footer>
  </div>
</template>

<script setup>
defineProps({
  profile: {
    type: Object,
    required: true,
  },
})
</script>
