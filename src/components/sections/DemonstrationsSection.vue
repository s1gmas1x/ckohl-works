<template>
  <section id="demonstrations" class="content-section demonstrations-section">
    <div class="section-inner">
      <SectionHeading
        eyebrow="Demonstrations"
        title="See the customer experience before you commit to it."
        description="These are Ckohl Works demonstrations, built to show how a practical website and a smart customer destination can work together."
      />

      <article class="demo-card demo-card--margots">
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

      <article class="demo-card demo-card--contact">
        <div class="contact-preview" aria-label="Preview of Chad Kohl's digital contact card">
          <p class="contact-preview__eyebrow">Digital contact card</p>
          <div class="contact-preview__mark" aria-hidden="true">CK</div>
          <h3>Chad Kohl</h3>
          <p>Full-Stack Developer at Ckohl Works</p>
          <div class="contact-preview__actions" aria-hidden="true">
            <span><q-icon name="phone" /> Call</span>
            <span><q-icon name="email" /> Email</span>
            <span><q-icon name="person_add" /> Save Contact</span>
          </div>
        </div>
        <div class="demo-card__content">
          <p class="demo-card__eyebrow">Digital contact-card demonstration</p>
          <h3>One useful way to connect</h3>
          <p>
            A focused mobile page can let someone call, email, open a website, or save contact
            details directly to their phone without typing anything in manually.
          </p>
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon-right="arrow_forward"
            label="Open the contact card"
            to="/card/ckohl-works/chad"
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
  font-size: clamp(2rem, 4vw, 3rem);
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
  align-content: center;
  justify-items: center;
  min-height: 340px;
  padding: 34px;
  background: var(--ckw-surface-subtle);
  color: var(--ckw-text-primary);
  text-align: center;
}

.contact-preview__eyebrow,
.contact-preview h3,
.contact-preview p {
  margin: 0;
}

.contact-preview__eyebrow {
  color: var(--ckw-text-muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.contact-preview__mark {
  display: grid;
  width: 64px;
  aspect-ratio: 1;
  margin: 18px 0 14px;
  border: 1px solid var(--ckw-border-strong);
  border-radius: 50%;
  background: var(--ckw-surface-raised);
  color: var(--ckw-orange);
  font-family: 'Orbitron', var(--ckw-font-body);
  font-size: 1.2rem;
  font-weight: 600;
  place-items: center;
}

.contact-preview h3 {
  color: var(--ckw-text-strong);
  font-size: 2rem;
  line-height: 1;
}

.contact-preview > p:not(.contact-preview__eyebrow) {
  margin-top: 9px;
  color: var(--ckw-text-primary);
}

.contact-preview__actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  width: min(100%, 330px);
  margin-top: 24px;
}

.contact-preview__actions span {
  display: grid;
  gap: 5px;
  place-items: center;
  min-height: 62px;
  padding: 7px 4px;
  border: 1px solid var(--ckw-border);
  border-radius: 6px;
  color: var(--ckw-text-strong);
  font-size: 0.73rem;
  font-weight: 800;
}

.contact-preview__actions :deep(.q-icon) {
  color: var(--ckw-orange);
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

  .contact-preview {
    min-height: 300px;
  }
}
</style>
