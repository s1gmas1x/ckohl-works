<template>
  <div class="section-heading" :class="[`section-heading--${align}`]">
    <p v-if="eyebrow" class="section-heading__eyebrow">{{ eyebrow }}</p>
    <component :is="titleTag" class="section-heading__title">
      {{ title }}
    </component>
    <p v-if="description" class="section-heading__description">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  titleTag: {
    type: String,
    default: 'h2',
  },
  description: {
    type: String,
    default: '',
  },
  align: {
    type: String,
    default: 'center',
    validator: (value) => ['left', 'center'].includes(value),
  },
})
</script>

<style lang="scss" scoped>
.section-heading {
  display: grid;
  gap: 10px;
  max-width: 760px;
  margin: 0 auto 32px;
}

.section-heading--left {
  margin-right: 0;
  margin-left: 0;
  text-align: left;
}

.section-heading--center {
  text-align: center;
}

.section-heading__eyebrow {
  margin: 0;
  color: var(--ckw-orange);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.section-heading__title {
  margin: 0;
  color: var(--ckw-text-strong);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.08;
}

.section-heading__description {
  max-width: 660px;
  margin: 0 auto;
  color: var(--ckw-text-muted);
  font-size: 1rem;
  line-height: 1.7;
}

.section-heading--left .section-heading__description {
  margin-left: 0;
}

@media (max-width: 640px) {
  .section-heading {
    margin-bottom: 24px;
  }

  .section-heading__title {
    font-size: 1.9rem;
  }
}
</style>
