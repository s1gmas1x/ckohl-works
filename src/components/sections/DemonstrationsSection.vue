<template>
  <section id="demonstrations" class="content-section demonstrations-section">
    <div class="section-inner">
      <SectionHeading
        eyebrow="Demonstrations"
        title="See the customer experience before you commit to it."
        description="These are Ckohl Works demonstrations, built to show how a practical website and a smart customer destination can work together."
      />

      <article class="demo-card">
        <img
          :src="margotsHeroImage"
          alt="Illustrated Margot's Pizza restaurant demonstration"
          class="demo-card__image"
        />
        <div class="demo-card__content">
          <p class="demo-card__eyebrow">Restaurant NFC/QR demonstration</p>
          <h3>Margot's Pizza</h3>
          <p>
            A mobile-first restaurant destination that gives customers a clear route to the menu,
            directions, reviews, and catering contact.
          </p>
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon-right="arrow_forward"
            label="Explore the demonstration"
            to="/margots-pizza"
            class="ckw-btn ckw-btn--primary"
          />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import margotsHeroImage from '@/assets/images/mockup/margots-pizza-hero.png'
import SectionHeading from '@/components/ui/SectionHeading.vue'
</script>

<style lang="scss" scoped>
.demo-card {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
  overflow: hidden;
  background: var(--ckw-surface-raised);
  border: 1px solid var(--ckw-border);
  border-radius: 8px;
  box-shadow: var(--ckw-card-shadow);
}

.demo-card__image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 340px;
  object-fit: cover;
  object-position: 68% center;
}

.demo-card__content {
  display: grid;
  align-content: center;
  justify-items: start;
  gap: 18px;
  padding: 42px;
}

.demo-card__content p,
.demo-card__content h3 {
  margin: 0;
}

.demo-card__eyebrow {
  color: var(--ckw-orange);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.demo-card__content h3 {
  color: var(--ckw-text-strong);
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.08;
}

.demo-card__content > p:not(.demo-card__eyebrow) {
  color: var(--ckw-text-primary);
  line-height: 1.65;
}

@media (max-width: 820px) {
  .demo-card {
    grid-template-columns: 1fr;
  }

  .demo-card__image {
    min-height: 260px;
    max-height: 360px;
  }

  .demo-card__content {
    padding: 28px;
  }
}
</style>
