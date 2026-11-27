<template>
  <section id="demonstrations" class="content-section demonstrations-section">
    <div class="section-inner">
      <SectionHeading
        eyebrow="Demonstrations"
        title="See the customer experience before you commit to it."
        description="These are Ckohl Works demonstrations, built to show how a practical website and a smart customer destination can work together."
      />

      <article id="restaurant-demo" class="demo-card demo-card--margots">
        <img
          :src="margotsHeroImage"
          alt="Illustrated Margot's Pizza restaurant demonstration"
          class="demo-card__image"
        />
        <div class="demo-card__content">
          <p class="demo-card__eyebrow">Restaurant destination after a tap or scan</p>
          <h3>Margot's Pizza</h3>
          <p>
            This restaurant demonstration shows the page a customer reaches after scanning a QR code
            or tapping an NFC card: menu, directions, and the next useful action in one place.
          </p>
          <q-btn
            flat
            no-caps
            icon-right="arrow_forward"
            label="Explore the demonstration"
            to="/margots-pizza"
            class="ckw-btn ckw-btn--text"
          />
        </div>
      </article>

      <article id="contact-card-demo" class="demo-card demo-card--contact">
        <div class="contact-preview">
          <CrtContactPreview class="contact-preview__phone" loading="lazy" />
        </div>
        <div class="demo-card__content">
          <p class="demo-card__eyebrow">Digital contact-card demonstration</p>
          <h3>One useful way to connect</h3>
          <p>
            A focused mobile page can let someone call, email, open a website, or save contact
            details directly to their phone without typing anything in manually.
          </p>
          <q-btn
            outline
            no-caps
            icon-right="arrow_forward"
            label="Open the contact card"
            to="/card/ckohl-works/chad"
            class="ckw-btn ckw-btn--outline"
          />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import margotsHeroImage from '@/assets/images/mockup/margots-pizza-hero-v2.webp'
import CrtContactPreview from '@/components/ui/CrtContactPreview.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
</script>

<style lang="scss" scoped>
.demo-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.9fr);
  overflow: hidden;
  background: var(--ckw-surface-raised);
  border: 1px solid var(--ckw-border-strong);
  border-radius: 8px;
  box-shadow: 0 18px 42px rgba(8, 12, 18, 0.14);
}
.demo-card + .demo-card {
  margin-top: 24px;
}

.demo-card__image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 340px;
  object-fit: cover;
  object-position: 84% center;
}

.demo-card__content {
  display: grid;
  align-content: center;
  justify-items: start;
  gap: 16px;
  padding: 44px;
}

.demo-card__content p,
.demo-card__content h3 {
  margin: 0;
}

.demo-card__eyebrow {
  color: var(--ckw-text-muted);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.demo-card__content h3 {
  color: var(--ckw-text-strong);
  font-size: clamp(1.65rem, 3vw, 2.35rem);
  line-height: 1.08;
}

.demo-card__content > p:not(.demo-card__eyebrow) {
  color: var(--ckw-text-primary);
  line-height: 1.65;
}

.demo-card--contact {
  grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1fr);
}

.contact-preview {
  display: grid;
  place-items: center;
  padding: clamp(20px, 4vw, 36px);
  background:
    radial-gradient(ellipse at 50% 35%, rgba(249, 156, 30, 0.16), transparent 65%),
    var(--ckw-surface-subtle);
}

.contact-preview__phone {
  width: min(100%, 236px);
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
