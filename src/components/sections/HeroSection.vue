<template>
  <section id="home" class="hero-section">
    <div class="section-inner hero-section__grid">
      <div class="hero-section__copy">
        <p class="hero-section__eyebrow">
          <q-icon name="contactless" size="17px" />
          <span>Managed tap-and-scan pages for local businesses</span>
        </p>

        <h1>
          <span class="hero-section__title-line hero-section__title-line--desktop"
            >Give customers one</span
          >
          <span
            class="hero-section__title-line hero-section__title-line--desktop hero-section__title-accent"
            >useful place to go.</span
          >
          <span class="hero-section__title-line hero-section__title-line--mobile"
            >Give customers</span
          >
          <span
            class="hero-section__title-line hero-section__title-line--mobile hero-section__title-accent"
            >one useful</span
          >
          <span
            class="hero-section__title-line hero-section__title-line--mobile hero-section__title-accent"
            >place to go.</span
          >
        </h1>

        <p class="hero-section__summary">
          Ckohl Works creates mobile business pages connected to QR codes, NFC cards, and links.
          Customers can call, book, get directions, view a menu, save your contact, or take the next
          useful action.
        </p>

        <p class="hero-section__benefit">
          Change where the card or printed QR leads later without replacing it.
        </p>

        <div class="hero-section__actions">
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon-right="arrow_downward"
            label="See How It Works"
            href="#how-it-works"
            class="ckw-btn ckw-btn--primary"
          />
          <q-btn
            outline
            no-caps
            icon-right="arrow_forward"
            label="View a Demo"
            href="#demonstrations"
            class="ckw-btn ckw-btn--outline"
          />
        </div>
      </div>

      <div class="hero-showcase" aria-label="Ckohl Works physical-to-mobile destination preview">
        <img
          :src="heroProductPreview"
          alt="A Margot's Pizza NFC and QR card beside the mobile menu destination it opens"
          class="hero-showcase__image"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import heroProductPreview from '@/assets/images/hero/margots-tap-scan-preview-refined.png'
</script>

<style lang="scss" scoped>
.hero-section {
  position: relative;
  padding: 34px 0 40px;
  overflow: hidden;
}
.hero-section::before {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 78% 24%, rgba(249, 156, 30, 0.1), transparent 29%),
    radial-gradient(circle at 24% 94%, rgba(249, 156, 30, 0.04), transparent 32%);
  content: '';
}
.hero-section__grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(540px, 1.18fr);
  gap: 38px;
  align-items: center;
}
.hero-section__copy {
  display: grid;
  gap: 22px;
  max-width: 570px;
}
.hero-section__eyebrow,
.hero-section__benefit {
  margin: 0;
}
.hero-section__eyebrow {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  width: fit-content;
  color: var(--ckw-orange);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}
.hero-section h1 {
  margin: 0;
  color: var(--ckw-text-strong);
  font-size: clamp(2.55rem, 3.1vw, 3.55rem);
  font-weight: 800;
  line-height: 1.03;
}
.hero-section__title-line {
  display: block;
}
.hero-section__title-line--mobile {
  display: none;
}
.hero-section__title-accent {
  color: var(--ckw-orange);
}
.hero-section__summary {
  max-width: 540px;
  margin: 0;
  color: var(--ckw-text-primary);
  font-size: 1.13rem;
  line-height: 1.65;
}
.hero-section__benefit {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: var(--ckw-text-strong);
  font-size: 0.98rem;
  font-weight: 600;
  line-height: 1.5;
}
.hero-section__benefit::before {
  width: 9px;
  height: 9px;
  margin-top: 0.38rem;
  background: var(--ckw-orange);
  border-radius: 50%;
  content: '';
  flex: 0 0 auto;
}
.hero-section__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}
.hero-section .ckw-btn--primary {
  box-shadow:
    0 6px 16px rgba(255, 138, 0, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
.hero-showcase {
  position: relative;
  display: grid;
  overflow: hidden;
  padding: 1px;
  border: 1px solid color-mix(in srgb, var(--ckw-border-strong) 72%, transparent);
  border-radius: 10px;
  background: var(--ckw-surface);
  box-shadow: 0 18px 38px rgba(8, 12, 18, 0.16);
  place-items: center;
}
.hero-showcase__image {
  display: block;
  width: 100%;
  max-height: 570px;
  object-fit: contain;
}
@media (max-width: 880px) {
  .hero-section__grid {
    grid-template-columns: 1fr;
  }
  .hero-section__copy {
    max-width: 680px;
  }
  .hero-showcase {
    max-width: 620px;
  }
}
@media (max-width: 560px) {
  .hero-section {
    padding: 30px 0 38px;
  }
  .hero-section__copy {
    gap: 18px;
  }
  .hero-section h1 {
    font-size: clamp(2.4rem, 11.5vw, 3.15rem);
  }
  .hero-section__title-line--desktop {
    display: none;
  }
  .hero-section__title-line--mobile {
    display: block;
  }
  .hero-section__eyebrow {
    font-size: 0.7rem;
    line-height: 1.45;
  }
  .hero-section__summary {
    font-size: 1rem;
  }
  .hero-section__actions {
    display: grid;
  }
  .hero-showcase__image {
    max-height: none;
  }
}
</style>
