<template>
  <section id="contact" class="content-section cta-section">
    <div class="section-inner">
      <div class="cta-section__panel">
        <div>
          <p class="cta-section__eyebrow">Ready for the next step?</p>
          <h2>Ready to build something amazing <span>together?</span></h2>
        </div>

        <p>Let us discuss your project and explore how CKohl Works can help your business grow.</p>

        <q-btn
          unelevated
          no-caps
          color="primary"
          icon-right="arrow_forward"
          label="Schedule Consultation"
          href="mailto:hello@ckworks.dev"
          class="ckw-btn ckw-btn--primary"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cta-section {
  padding-top: 40px;
}

.cta-section__panel {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(240px, 0.8fr) auto;
  gap: 32px;
  align-items: center;
  padding: 34px 46px;
  background:
    radial-gradient(circle at 78% 82%, rgba(255, 138, 0, 0.36), transparent 28%),
    var(--ckw-surface-panel-gradient), var(--ckw-surface-raised);
  border: 1px solid var(--ckw-border-strong);
  border-radius: 12px;
  box-shadow: var(--ckw-card-shadow);
}

.cta-section__eyebrow,
.cta-section h2,
.cta-section p {
  margin: 0;
}

.cta-section__eyebrow {
  margin-bottom: 8px;
  color: var(--ckw-orange);
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
