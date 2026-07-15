<template>
  <section class="content-section cta-section">
    <div class="section-inner">
      <div class="cta-section__panel">
        <div>
          <p class="cta-section__eyebrow">Start with the next useful step</p>
          <h2>Tell us what customers need to <span>do next.</span></h2>
        </div>

        <p>
          We will talk through the customer experience you need and choose a practical first
          version.
        </p>

        <q-btn
          unelevated
          no-caps
          color="primary"
          icon-right="arrow_forward"
          label="Start a Conversation"
          href="mailto:chad_kohl@ckohl.com"
          class="ckw-btn ckw-btn--primary"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cta-section {
  padding-top: 54px;
}

.cta-section__panel {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(240px, 0.8fr) auto;
  gap: 32px;
  align-items: center;
  padding: 34px 46px;
  background: var(--ckw-surface-raised);
  border: 1px solid var(--ckw-border-strong);
  border-radius: 12px;
  box-shadow: 0 16px 36px rgba(8, 12, 18, 0.1);
}

.cta-section__eyebrow,
.cta-section h2,
.cta-section p {
  margin: 0;
}

.cta-section__eyebrow {
  margin-bottom: 8px;
  color: var(--ckw-text-muted);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.cta-section h2 {
  color: var(--ckw-text-strong);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 800;
  line-height: 1.12;
}

.cta-section h2 span {
  color: var(--ckw-orange);
}

.cta-section p {
  color: var(--ckw-text-primary);
  line-height: 1.65;
}

@media (max-width: 920px) {
  .cta-section__panel {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 28px;
  }
}
</style>
