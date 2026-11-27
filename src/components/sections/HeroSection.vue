<template>
  <section id="home" class="hero-section">
    <div class="section-inner hero-section__grid">
      <div class="hero-section__copy">
        <p class="hero-section__eyebrow">
          <q-icon name="contactless" size="17px" />
          <span>Managed tap-and-scan pages for local businesses</span>
        </p>

        <h1>
          Tap a card.
          <span class="hero-section__title-accent">Open a page built for your business.</span>
        </h1>

        <p class="hero-section__summary">
          With a tap or QR scan, customers can view your menu, get directions, book an appointment,
          or save your contact details.
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
            :to="{ path: '/', hash: '#how-it-works' }"
            class="ckw-btn ckw-btn--primary"
          />
          <q-btn
            flat
            no-caps
            icon-right="arrow_forward"
            label="View a Demo"
            :to="{ path: '/', hash: '#demonstrations' }"
            class="ckw-btn ckw-btn--text"
          />
        </div>
      </div>

      <div class="hero-showcase" aria-label="Ckohl Works physical-to-mobile destination preview">
        <p class="hero-showcase__direction" aria-hidden="true">Tap or scan</p>
        <picture class="hero-showcase__card">
          <source :srcset="contactCardFront" type="image/svg+xml" />
          <img :src="contactCardFrontFallback" alt="Ckohl Works NFC and QR contact card" />
        </picture>
        <CrtContactPreview class="hero-showcase__phone" />
      </div>
    </div>
  </section>
</template>

<script setup>
import contactCardFront from '@/assets/images/hero/ckohl-works-contact-card-front-nfc-paths.svg'
import contactCardFrontFallback from '@/assets/images/hero/ckohl-works-contact-card-front-nfc-paths.png'
import CrtContactPreview from '@/components/ui/CrtContactPreview.vue'
</script>

<style lang="scss" scoped>
.hero-section {
  position: relative;
  padding: 34px 0 0;
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
  grid-template-columns: minmax(500px, 0.86fr) minmax(540px, 1.14fr);
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
  color: var(--ckw-text-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.hero-section h1 {
  margin: 0;
  color: var(--ckw-text-strong);
  font-size: clamp(2.55rem, 3.1vw, 3.55rem);
  font-weight: 800;
  line-height: 1.03;
}
.hero-section__title-accent {
  display: block;
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
  justify-items: end;
  width: 100%;
  padding: 28px 1% 32px 0;
}
.hero-showcase__direction {
  position: absolute;
  z-index: 2;
  top: 68px;
  left: 4%;
  margin: 0;
  color: var(--ckw-text-muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.hero-showcase__card {
  position: absolute;
  z-index: 2;
  top: 100px;
  left: 2%;
  width: min(57%, 420px);
  border-radius: 8px;
  box-shadow: 0 22px 38px rgba(0, 0, 0, 0.42);
  transform: rotate(-3deg);
}
.hero-showcase__card img {
  display: block;
  width: 100%;
  border-radius: inherit;
}
.hero-showcase__phone {
  width: min(39%, 244px);
}
@media (max-width: 1100px) {
  .hero-section__grid {
    grid-template-columns: 1fr;
  }
  .hero-section__copy {
    max-width: 680px;
  }
  .hero-showcase {
    justify-self: center;
    max-width: 620px;
  }
}
@media (max-width: 560px) {
  .hero-section {
    padding: 30px 0 0;
  }
  .hero-section__copy {
    gap: 18px;
  }
  .hero-section h1 {
    font-size: clamp(2.1rem, 8.8vw, 3rem);
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
    gap: 4px;
  }
  .hero-showcase {
    padding: clamp(125px, 39vw, 192px) 3% 28px 0;
  }
  .hero-showcase__direction {
    top: 8px;
    left: 5%;
    font-size: 0.65rem;
  }
  .hero-showcase__card {
    top: 30px;
    left: 4%;
    width: min(73%, 330px);
  }
  .hero-showcase__phone {
    width: min(49%, 218px);
    --crt-preview-frame-width: 4px;
    --crt-preview-frame-radius: 18px;
  }
}
</style>
