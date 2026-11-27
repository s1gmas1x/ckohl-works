<template>
  <q-card flat bordered class="solution-card">
    <q-card-section>
      <div class="solution-card__visual" aria-hidden="true">
        <q-icon :name="solution.icon" size="34px" />
      </div>
      <h3>{{ solution.title }}</h3>
      <p>{{ solution.description }}</p>
      <RouterLink :to="{ path: '/', hash: solution.href }" class="solution-card__link">
        <span>Learn More</span>
        <q-icon name="arrow_forward" size="17px" />
      </RouterLink>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  solution: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.solution-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--ckw-surface-raised);
  border-color: var(--ckw-border);
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(8, 12, 18, 0.08);
  overflow: hidden;
}

.solution-card__visual {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  margin-bottom: 4px;
  border-radius: 10px;
  background: var(--ckw-surface-subtle);
  color: color-mix(in srgb, var(--ckw-orange) 58%, var(--ckw-text-strong));
}

.solution-card :deep(.q-card__section) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  padding: 22px;
}

.solution-card h3,
.solution-card p {
  margin: 0;
}

.solution-card h3 {
  color: var(--ckw-text-strong);
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.25;
}

.solution-card p {
  color: var(--ckw-text-muted);
  font-size: 0.96rem;
  line-height: 1.6;
}

.solution-card__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  margin-top: auto;
  padding-top: 4px;
  color: var(--ckw-orange);
  font-size: 0.88rem;
  font-weight: 800;
  text-decoration: none;
}
</style>
