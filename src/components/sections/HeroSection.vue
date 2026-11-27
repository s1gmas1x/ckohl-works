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
            :to="{ path: '/', hash: '#how-it-works' }"
            class="ckw-btn ckw-btn--primary"
          />
          <q-btn
            outline
            no-caps
            icon-right="arrow_forward"
            label="View a Demo"
            :to="{ path: '/', hash: '#demonstrations' }"
            class="ckw-btn ckw-btn--outline"
          />
        </div>
      </div>

      <div class="hero-showcase" aria-label="Ckohl Works physical-to-mobile destination preview">
        <p class="hero-showcase__direction" aria-hidden="true">Tap or scan</p>
        <picture class="hero-showcase__card">
          <source :srcset="contactCardFront" type="image/svg+xml" />
          <img :src="contactCardFrontFallback" alt="Ckohl Works NFC and QR contact card" />
        </picture>
        <div class="hero-showcase__phone">
          <img
            :src="contactCardScreen"
            class="hero-showcase__phone-screen"
            alt="Chad Kohl’s amber CRT contact card with Call, Text, Email, and Save Contact"
            width="691"
            height="1258"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import contactCardFront from '@/assets/images/hero/ckohl-works-contact-card-front-nfc-paths.svg'
import contactCardFrontFallback from '@/assets/images/hero/ckohl-works-contact-card-front-nfc-paths.png'
import contactCardScreen from '@/assets/images/hero/chad-contact-screen.webp'
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
  position: relative;
  width: min(39%, 244px);
  padding-top: 14px;
  overflow: hidden;
  border: 6px solid #151a20;
  border-radius: 24px;
  background: #090704;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 18px 34px rgba(0, 0, 0, 0.3);
}
.hero-showcase__phone::before {
  position: absolute;
  top: 4px;
  left: 50%;
  width: 30%;
  height: 4px;
  border-radius: 999px;
  background: #272b30;
  content: '';
  transform: translateX(-50%);
}
.hero-showcase__phone-screen {
  display: block;
  width: 100%;
  height: auto;
}
@media (min-width: 1101px) {
  .hero-section__title-line--desktop {
    white-space: nowrap;
  }
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
    border-width: 4px;
    border-radius: 18px;
  }
}
</style>
