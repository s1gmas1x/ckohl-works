<template>
  <section id="home" class="hero-section">
    <div class="section-inner hero-section__grid">
      <div class="hero-section__copy">
        <p class="hero-section__eyebrow">
          <q-icon name="bolt" size="16px" />
          <span>Business solutions built for momentum</span>
        </p>

        <h1>
          Digital <span>experiences.</span><br />
          Built with <span>purpose.</span>
        </h1>

        <p class="hero-section__summary">
          We help businesses connect with customers through smart cards, websites, applications, and
          modern digital solutions.
        </p>

        <div class="hero-section__actions">
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="calendar_month"
            label="Schedule Consultation"
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
        <div class="hero-showcase__card hero-showcase__card--nfc">
          <BrandMark aria-label="CKohl Works preview" />
          <q-icon name="contactless" size="24px" />
        </div>

        <div class="hero-showcase__phone">
          <div class="hero-showcase__phone-top"></div>
          <BrandMark aria-label="CKohl Works mobile preview" />
          <div class="hero-showcase__avatar" aria-hidden="true"></div>
          <strong>Your Name</strong>
          <span>Business Owner</span>
          <p>Helping businesses connect and grow.</p>
          <div class="hero-showcase__phone-actions">
            <span>Call</span>
            <span>Email</span>
            <span>Save</span>
          </div>
          <div class="hero-showcase__phone-row">Visit Website</div>
          <div class="hero-showcase__phone-row">View Our Services</div>
        </div>

        <div class="hero-showcase__dashboard">
          <span>Analytics Overview</span>
          <div class="hero-showcase__metrics">
            <strong>1,248</strong>
            <strong>842</strong>
            <strong>128</strong>
          </div>
          <div class="hero-showcase__chart" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import BrandMark from '@/components/ui/BrandMark.vue'
</script>

<style lang="scss" scoped>
.hero-section {
  position: relative;
  min-height: 690px;
  padding: 86px 0 44px;
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
  align-items: center;
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
  font-size: clamp(3.2rem, 6vw, 5.65rem);
  font-weight: 850;
  letter-spacing: 0;
  line-height: 1.03;
}

.hero-section h1 span {
  color: var(--ckw-orange);
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
  min-height: 520px;
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

.hero-showcase__card,
.hero-showcase__phone,
.hero-showcase__dashboard {
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

.hero-showcase__card :deep(.brand-mark) {
  transform: scale(0.86);
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
  color: var(--ckw-text-strong);
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

.hero-showcase__phone :deep(.brand-mark) {
  transform: scale(0.48);
  transform-origin: top center;
  margin-bottom: -14px;
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
  font-size: 1rem;
}

.hero-showcase__phone span,
.hero-showcase__phone p {
  color: var(--ckw-text-muted);
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
  color: var(--ckw-text-strong);
}

.hero-showcase__phone-actions span {
  padding: 8px 0;
}

.hero-showcase__phone-row {
  width: 100%;
  margin-top: 7px;
  padding: 10px 12px;
  color: var(--ckw-text-muted);
  font-size: 0.72rem;
  text-align: left;
}

.hero-showcase__dashboard {
  right: -8px;
  bottom: 40px;
  width: 340px;
  min-height: 245px;
  padding: 24px;
  border-radius: 16px;
  transform: perspective(800px) rotateY(-11deg) rotateZ(-4deg);
}

.hero-showcase__dashboard span {
  color: var(--ckw-text-primary);
  font-weight: 800;
}

.hero-showcase__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin: 18px 0;
}

.hero-showcase__metrics strong {
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  color: var(--ckw-text-strong);
  font-size: 1.1rem;
}

.hero-showcase__chart {
  height: 96px;
  background:
    linear-gradient(
      135deg,
      transparent 8%,
      rgba(255, 138, 0, 0.85) 8% 10%,
      transparent 10% 22%,
      rgba(255, 138, 0, 0.85) 22% 24%,
      transparent 24% 40%,
      rgba(255, 138, 0, 0.85) 40% 42%,
      transparent 42% 58%,
      rgba(255, 138, 0, 0.85) 58% 60%,
      transparent 60% 76%,
      rgba(255, 138, 0, 0.85) 76% 78%,
      transparent 78%
    ),
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size:
    100% 100%,
    100% 24px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
}

@media (max-width: 1080px) {
  .hero-section__grid {
    grid-template-columns: 1fr;
  }

  .hero-section__copy {
    max-width: 740px;
  }

  .hero-showcase {
    min-height: 500px;
  }
}

@media (max-width: 680px) {
  .hero-section {
    min-height: 0;
    padding-top: 54px;
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
    min-height: 430px;
    margin-top: 12px;
  }

  .hero-showcase__card {
    left: 4px;
    width: 198px;
    height: 116px;
  }

  .hero-showcase__phone {
    left: 84px;
    width: 198px;
    min-height: 370px;
  }

  .hero-showcase__dashboard {
    right: -60px;
    bottom: 26px;
    width: 260px;
  }
}
</style>
