<template>
  <section class="content-section cta-section">
    <div class="section-inner">
      <div class="cta-section__panel">
        <h2>Have a project in mind?</h2>

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

.cta-section h2,
.cta-section p {
  margin: 0;
}

.cta-section h2 {
  color: var(--ckw-text-strong);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 800;
  line-height: 1.12;
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
