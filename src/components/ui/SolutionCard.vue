<template>
  <q-card flat bordered class="solution-card">
    <div class="solution-card__visual" :class="`solution-card__visual--${solution.variant}`">
      <q-icon :name="solution.icon" size="38px" />
      <span
        v-if="solution.variant === 'nfc'"
        class="solution-card__signal"
        aria-hidden="true"
      ></span>
      <span v-if="solution.variant === 'qr'" class="solution-card__qr" aria-hidden="true"></span>
      <span
        v-if="solution.variant === 'web'"
        class="solution-card__browser"
        aria-hidden="true"
      ></span>
      <span v-if="solution.variant === 'app'" class="solution-card__grid" aria-hidden="true"></span>
      <span
        v-if="solution.variant === 'analytics'"
        class="solution-card__bars"
        aria-hidden="true"
      ></span>
    </div>

    <q-card-section>
      <h3>{{ solution.title }}</h3>
      <p>{{ solution.description }}</p>
      <a :href="solution.href" class="solution-card__link">
        <span>Learn More</span>
        <q-icon name="arrow_forward" size="17px" />
      </a>
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
  padding: 12px;
  background:
    linear-gradient(145deg, rgba(255, 138, 0, 0.11), rgba(255, 138, 0, 0) 36%),
    var(--ckw-surface-raised);
  border-color: var(--ckw-border);
  border-radius: 8px;
  box-shadow: var(--ckw-card-shadow);
  overflow: hidden;
}

.solution-card__visual {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 148px;
  background:
    radial-gradient(circle at 50% 20%, rgba(255, 138, 0, 0.28), transparent 32%),
    var(--ckw-surface-visual-gradient);
  border: 1px solid var(--ckw-visual-border);
  border-radius: 7px;
  color: var(--ckw-orange);
  overflow: hidden;
}

.solution-card__visual::before {
  content: '';
  position: absolute;
  inset: 16px;
  background-image:
    linear-gradient(var(--ckw-grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--ckw-grid-line) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(circle, #000 0 48%, transparent 74%);
}

.solution-card__visual :deep(.q-icon) {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 18px var(--ckw-icon-shadow));
}

.solution-card :deep(.q-card__section) {
  display: grid;
  gap: 10px;
  flex: 1;
  padding: 18px 4px 4px;
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
  font-size: 0.92rem;
  line-height: 1.55;
}

.solution-card__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  margin-top: auto;
  color: var(--ckw-orange);
  font-size: 0.88rem;
  font-weight: 800;
  text-decoration: none;
}

.solution-card__signal,
.solution-card__qr,
.solution-card__browser,
.solution-card__grid,
.solution-card__bars {
  position: absolute;
  inset: auto;
  border-color: rgba(255, 138, 0, 0.55);
}

.solution-card__signal {
  top: 25px;
  right: 38px;
  width: 26px;
  height: 26px;
  border-top: 3px solid;
  border-right: 3px solid;
  border-radius: 0 18px 0 0;
}

.solution-card__qr {
  width: 72px;
  height: 72px;
  border: 8px solid rgba(255, 255, 255, 0.82);
  box-shadow:
    inset 18px 0 0 rgba(255, 255, 255, 0.82),
    inset 0 18px 0 rgba(255, 255, 255, 0.82),
    0 0 0 1px rgba(255, 138, 0, 0.5);
  opacity: 0.22;
}

.solution-card__browser {
  width: 112px;
  height: 68px;
  border: 1px solid;
  border-radius: 6px;
  opacity: 0.35;
}

.solution-card__browser::before {
  content: '';
  position: absolute;
  top: 16px;
  right: 10px;
  left: 10px;
  height: 1px;
  background: currentColor;
}

.solution-card__grid {
  width: 110px;
  height: 76px;
  background:
    linear-gradient(rgba(255, 138, 0, 0.28), rgba(255, 138, 0, 0.28)) 12px 12px / 35px 20px,
    linear-gradient(rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.18)) 58px 12px / 38px 20px,
    linear-gradient(rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.18)) 12px 44px / 84px 20px;
  background-repeat: no-repeat;
  border: 1px solid;
  border-radius: 8px;
  opacity: 0.38;
}

.solution-card__bars {
  width: 112px;
  height: 72px;
  background:
    linear-gradient(to top, rgba(255, 138, 0, 0.72) 72%, transparent 72%) 8px 0 / 14px 100%,
    linear-gradient(to top, rgba(255, 255, 255, 0.22) 44%, transparent 44%) 36px 0 / 14px 100%,
    linear-gradient(to top, rgba(255, 138, 0, 0.72) 88%, transparent 88%) 64px 0 / 14px 100%,
    linear-gradient(to top, rgba(255, 255, 255, 0.22) 58%, transparent 58%) 92px 0 / 14px 100%;
  background-repeat: no-repeat;
  opacity: 0.45;
}
</style>
