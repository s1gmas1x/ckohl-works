<template>
  <section class="trust-bar" aria-label="CKohl Works operating principles">
    <div class="section-inner">
      <div class="trust-bar__panel">
        <article v-for="item in items" :key="item.title" class="trust-bar__item">
          <q-icon :name="item.icon" size="42px" />
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { trustItems as items } from '@/data/home.js'
</script>

<style lang="scss" scoped>
.trust-bar {
  margin-top: -32px;
  padding-bottom: 54px;
}

.trust-bar__panel {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.015)),
    rgba(8, 11, 15, 0.92);
  border: 1px solid var(--ckw-border-strong);
  border-radius: 12px;
  box-shadow: var(--ckw-card-shadow);
  overflow: hidden;
}

.trust-bar__item {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 30px 24px;
  text-align: center;
}

.trust-bar__item + .trust-bar__item {
  border-left: 1px solid var(--ckw-border-strong);
}

.trust-bar__item :deep(.q-icon) {
  color: var(--ckw-orange);
  filter: drop-shadow(0 0 18px rgba(255, 138, 0, 0.42));
}

.trust-bar__item h2,
.trust-bar__item p {
  margin: 0;
}

.trust-bar__item h2 {
  color: var(--ckw-text-strong);
  font-size: 1.04rem;
  font-weight: 800;
  line-height: 1.22;
}

.trust-bar__item p {
  color: var(--ckw-text-muted);
  font-size: 0.88rem;
  line-height: 1.45;
}

@media (max-width: 980px) {
  .trust-bar__panel {
    grid-template-columns: repeat(2, 1fr);
  }

  .trust-bar__item + .trust-bar__item {
    border-left: 0;
  }

  .trust-bar__item {
    border-top: 1px solid var(--ckw-border-strong);
  }

  .trust-bar__item:nth-child(-n + 2) {
    border-top: 0;
  }

  .trust-bar__item:nth-child(odd) {
    border-right: 1px solid var(--ckw-border-strong);
  }
}

@media (max-width: 560px) {
  .trust-bar {
    margin-top: 0;
    padding-bottom: 42px;
  }

  .trust-bar__panel {
    grid-template-columns: 1fr;
  }

  .trust-bar__item,
  .trust-bar__item:nth-child(odd) {
    border-right: 0;
  }

  .trust-bar__item:nth-child(2) {
    border-top: 1px solid var(--ckw-border-strong);
  }
}
</style>
