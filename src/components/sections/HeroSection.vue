<template>
  <section id="home" class="hero-section">
    <div class="section-inner hero-section__grid">
      <div class="hero-section__copy">
        <p class="hero-section__eyebrow">
          <q-icon name="bolt" size="16px" />
          <span>Practical digital tools for local businesses</span>
        </p>

        <h1>
          <span class="hero-section__title-line">Give customers a</span
          ><span>clear next step.</span>
        </h1>

        <p class="hero-section__summary">
          Ckohl Works builds websites, smart QR and NFC experiences, and ongoing technical support
          for local businesses that want customer touchpoints to work harder.
        </p>

        <div class="hero-section__actions">
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="calendar_month"
            label="Start a Conversation"
            href="#contact"
            class="ckw-btn ckw-btn--primary"
          />
          <q-btn
            outline
            no-caps
            icon-right="arrow_forward"
            label="Explore Solutions"
            href="#solutions"
            class="ckw-btn ckw-btn--outline"
          />
        </div>
      </div>

      <div class="hero-showcase" aria-label="CKohl Works solution preview">
        <img
          :src="heroProductPreview"
          alt="NFC card, business destination phone, and tablet interface"
          class="hero-showcase__image"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import heroProductPreview from '@/assets/images/hero/ckohl-works-product-preview.png'
</script>

<style lang="scss" scoped>
.hero-section {
  position: relative;
  padding: 18px 0 30px;
  background:
    radial-gradient(circle at 78% 16%, rgba(255, 138, 0, 0.18), transparent 30%),
    radial-gradient(circle at 28% 94%, rgba(255, 138, 0, 0.08), transparent 32%);
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 138, 0, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 138, 0, 0.06) 1px, transparent 1px);
  background-size: 76px 76px;
  mask-image: radial-gradient(circle at 62% 44%, #000, transparent 56%);
  opacity: 0.45;
}

.hero-section__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(420px, 1.2fr);
  gap: 44px;
  align-items: start;
}

.hero-section__copy {
  display: grid;
  gap: 24px;
  max-width: 540px;
}

.hero-section__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  margin: 0;
  color: var(--ckw-orange);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-section h1 {
  margin: 0;
  color: var(--ckw-text-strong);
  font-size: clamp(2.55rem, 3.5vw, 3.75rem);
  font-weight: 850;
  letter-spacing: 0;
  line-height: 1.03;
}

.hero-section h1 span {
  display: block;
  color: var(--ckw-orange);
}

.hero-section h1 .hero-section__title-line {
  color: var(--ckw-text-strong);
}

.hero-section__summary {
  max-width: 480px;
  margin: 0;
  color: var(--ckw-text-primary);
  font-size: 1.18rem;
  line-height: 1.62;
}

.hero-section__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.hero-showcase {
  position: relative;
  display: grid;
  place-items: start center;
}

.hero-showcase::after {
  content: '';
  position: absolute;
  right: -8%;
  bottom: -2%;
  left: 6%;
  height: 34px;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 50%;
  filter: blur(14px);
}

.hero-showcase__image {
  position: relative;
  z-index: 1;
  display: block;
  width: min(100%, 720px);
  max-height: 520px;
  object-fit: contain;
}

.hero-showcase__card,
.hero-showcase__phone,
.hero-showcase__destination {
  position: absolute;
  background: linear-gradient(145deg, rgba(21, 25, 30, 0.98), rgba(6, 9, 12, 0.98));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 28px 90px rgba(0, 0, 0, 0.45),
    0 0 54px rgba(255, 138, 0, 0.11);
}

.hero-showcase__card {
  top: 42px;
  left: 0;
  display: grid;
  place-items: center;
  width: 270px;
  height: 150px;
  border-radius: 20px;
  transform: rotate(-9deg);
}

.hero-showcase__card :deep(.q-icon) {
  position: absolute;
  top: 23px;
  right: 23px;
  color: rgba(255, 255, 255, 0.64);
}

.hero-showcase__phone {
  z-index: 2;
  top: 46px;
  left: 178px;
  display: grid;
  justify-items: center;
  width: 230px;
  min-height: 430px;
  padding: 34px 20px 20px;
  border: 7px solid #06080b;
  border-radius: 36px;
  color: #ffffff;
  text-align: center;
  transform: rotate(8deg);
}

.hero-showcase__phone-top {
  position: absolute;
  top: 12px;
  width: 76px;
  height: 18px;
  background: #05070a;
  border-radius: 0 0 12px 12px;
}

.hero-showcase__monogram {
  color: var(--ckw-orange);
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  line-height: 1;
  white-space: nowrap;
}

.hero-showcase__card-mark {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.hero-showcase__card-sigil {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1;
}

.hero-showcase__card-sigil span {
  color: var(--ckw-orange);
}

.hero-showcase__card-sigil strong {
  font-size: 1.55rem;
  font-weight: 750;
}

.hero-showcase__card-wordmark {
  display: inline-flex;
  gap: 10px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.46rem;
  font-weight: 800;
  letter-spacing: 0.34em;
  line-height: 1;
}

.hero-showcase__card-wordmark span:last-child {
  color: var(--ckw-orange);
}

.hero-showcase__phone .hero-showcase__monogram {
  margin-bottom: 2px;
  font-size: 0.62rem;
}

.hero-showcase__avatar {
  width: 68px;
  height: 68px;
  margin-bottom: 9px;
  background:
    radial-gradient(circle at 50% 34%, #f2d3be 0 18%, transparent 19%),
    radial-gradient(circle at 50% 62%, #f2d3be 0 28%, transparent 29%),
    linear-gradient(145deg, rgba(255, 138, 0, 0.85), #202833);
  border: 2px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
}

.hero-showcase__phone strong {
  color: #ffffff;
  font-size: 1rem;
}

.hero-showcase__phone span,
.hero-showcase__phone p {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.72rem;
}

.hero-showcase__phone p {
  max-width: 142px;
  margin: 8px 0 12px;
  line-height: 1.35;
}

.hero-showcase__phone-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  width: 100%;
  margin-bottom: 10px;
}

.hero-showcase__phone-actions span,
.hero-showcase__phone-row {
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.88);
}

.hero-showcase__phone-actions span {
  padding: 8px 0;
}

.hero-showcase__phone-row {
  width: 100%;
  margin-top: 7px;
  padding: 10px 12px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.72rem;
  text-align: left;
}

.hero-showcase__destination {
  display: grid;
  align-content: start;
  gap: 18px;
  right: -8px;
  bottom: 40px;
  width: 340px;
  min-height: 245px;
  padding: 24px;
  border-radius: 16px;
  transform: perspective(800px) rotateY(-11deg) rotateZ(-4deg);
}

.hero-showcase__destination p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 800;
}

.hero-showcase__destination-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
}

.hero-showcase__destination-actions span {
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.7rem;
  font-weight: 700;
  text-align: center;
}

.hero-showcase__destination-route {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  padding: 14px;
  background: rgba(255, 138, 0, 0.08);
  border: 1px solid rgba(255, 138, 0, 0.2);
  border-radius: 10px;
}

.hero-showcase__destination-route :deep(.q-icon) {
  color: var(--ckw-orange);
}

.hero-showcase__destination-route span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.76rem;
  line-height: 1.4;
}

@media (max-width: 860px) {
  .hero-section__grid {
    grid-template-columns: 1fr;
  }

  .hero-section__copy {
    max-width: 740px;
  }
}

@media (max-width: 680px) {
  .hero-section {
    min-height: 0;
    padding-top: 26px;
  }

  .hero-section__copy {
    gap: 18px;
  }

  .hero-section h1 {
    font-size: 3rem;
  }

  .hero-section__summary {
    font-size: 1rem;
  }

  .hero-section__actions {
    display: grid;
  }

  .hero-showcase {
    min-height: 0;
    margin-top: 0;
    place-items: start center;
  }

  .hero-showcase__image {
    width: 100%;
    max-height: 290px;
  }
}
</style>
