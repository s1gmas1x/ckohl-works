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
  max-width: 700px;
  margin: 0 auto 38px;
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
  color: var(--ckw-text-muted);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.section-heading__title {
  margin: 0;
  color: var(--ckw-text-strong);
  font-size: clamp(1.9rem, 3.25vw, 2.6rem);
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.12;
}

.section-heading__description {
  max-width: 620px;
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
    margin-bottom: 28px;
  }

  .section-heading__title {
    font-size: 1.78rem;
  }
}
</style>
