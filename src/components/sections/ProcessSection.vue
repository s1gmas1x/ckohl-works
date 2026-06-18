<template>
  <section id="process" class="content-section process-section">
    <div class="section-inner">
      <SectionHeading eyebrow="Our Process" title="A simple process for exceptional results." />

      <div class="process-section__steps">
        <article v-for="(step, index) in processSteps" :key="step.title" class="process-step">
          <div class="process-step__icon">
            <q-icon :name="step.icon" size="34px" />
          </div>
          <div class="process-step__copy">
            <h3>
              <span>{{ index + 1 }}</span>
              {{ step.title }}
            </h3>
            <p>{{ step.description }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { processSteps } from '@/data/home.js'
import SectionHeading from '@/components/ui/SectionHeading.vue'
</script>

<style lang="scss" scoped>
.process-section__steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 26px;
}

.process-section__steps::before {
  content: '';
  position: absolute;
  top: 43px;
  right: 9%;
  left: 9%;
  border-top: 2px dotted rgba(255, 138, 0, 0.78);
}

.process-step {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 16px;
  text-align: center;
}

.process-step__icon {
  display: grid;
  place-items: center;
  width: 88px;
  height: 88px;
  background: rgba(11, 16, 22, 0.96);
  border: 1px solid var(--ckw-border-strong);
  border-radius: 50%;
  color: var(--ckw-orange);
  box-shadow: 0 0 30px rgba(255, 138, 0, 0.12);
}

.process-step h3,
.process-step p {
  margin: 0;
}

.process-step h3 {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  color: var(--ckw-text-strong);
  font-size: 1.08rem;
  font-weight: 800;
}

.process-step h3 span {
  color: var(--ckw-orange);
  font-size: 1.35rem;
}

.process-step p {
  color: var(--ckw-text-muted);
  font-size: 0.9rem;
  line-height: 1.45;
}

@media (max-width: 900px) {
  .process-section__steps {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .process-section__steps::before {
    display: none;
  }

  .process-step {
    grid-template-columns: 72px 1fr;
    justify-items: start;
    text-align: left;
  }

  .process-step__icon {
    width: 64px;
    height: 64px;
  }
}
</style>
