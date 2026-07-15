<template>
  <section id="how-it-works" class="content-section process-section">
    <div class="section-inner">
      <SectionHeading
        eyebrow="How it works"
        title="The card and QR are the beginning, not the whole product."
        description="We build and manage what a customer sees after the tap or scan, around the action that matters to your business."
      />

      <div class="process-section__steps">
        <article v-for="(step, index) in processSteps" :key="step.title" class="process-step">
          <span class="process-step__number">{{ index + 1 }}</span>
          <q-icon :name="step.icon" size="27px" />
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </article>
      </div>

      <div class="destination-compare">
        <div>
          <p class="destination-compare__label">Static QR code</p>
          <h3>Printed once, tied to one URL.</h3>
          <p>
            Useful for a fixed link, but changing the destination can mean replacing what you
            printed.
          </p>
        </div>
        <div class="destination-compare__managed">
          <p class="destination-compare__label">Managed Ckohl Works destination</p>
          <h3>Keep the card. Update what it leads to.</h3>
          <p>
            When your menu, promotion, booking page, or business needs change, we can update the
            destination without replacing the card or code.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { processSteps } from '@/data/home.js'
import SectionHeading from '@/components/ui/SectionHeading.vue'
</script>

<style lang="scss" scoped>
.process-section {
  position: relative;
  background: var(--ckw-surface);
  border-top: 1px solid var(--ckw-border);
  border-bottom: 1px solid var(--ckw-border);
}
.process-section__steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}
.process-step {
  position: relative;
  padding: 20px 16px 22px;
  border-top: 2px solid var(--ckw-orange);
}
.process-step__number {
  color: var(--ckw-orange);
  font-size: 0.78rem;
  font-weight: 800;
}
.process-step :deep(.q-icon) {
  display: block;
  margin: 14px 0;
  color: var(--ckw-text-strong);
}
.process-step h3,
.process-step p {
  margin: 0;
}
.process-step h3 {
  color: var(--ckw-text-strong);
  font-size: 1.15rem;
}
.process-step p {
  margin-top: 8px;
  color: var(--ckw-text-muted);
  line-height: 1.55;
}
.destination-compare {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin-top: 48px;
  overflow: hidden;
  background: var(--ckw-border-strong);
  border: 1px solid var(--ckw-border-strong);
  border-radius: 8px;
}
.destination-compare > div {
  padding: 28px;
  background: var(--ckw-surface-raised);
}
.destination-compare__managed {
  background:
    linear-gradient(145deg, rgba(249, 156, 30, 0.09), transparent 60%), var(--ckw-surface-raised) !important;
}
.destination-compare__label,
.destination-compare h3,
.destination-compare p {
  margin: 0;
}
.destination-compare__label {
  margin-bottom: 10px;
  color: var(--ckw-orange);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
.destination-compare h3 {
  color: var(--ckw-text-strong);
  font-size: 1.25rem;
}
.destination-compare p:not(.destination-compare__label) {
  margin-top: 10px;
  color: var(--ckw-text-primary);
  line-height: 1.6;
}
@media (max-width: 760px) {
  .process-section {
    padding-top: 18px;
  }
  .process-section__steps,
  .destination-compare {
    grid-template-columns: 1fr;
  }
  .process-section__steps {
    gap: 8px;
  }
}
</style>
