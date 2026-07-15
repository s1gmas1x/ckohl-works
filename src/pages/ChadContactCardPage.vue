<template>
  <q-page class="contact-card-page">
    <main class="contact-card-page__content">
      <section class="contact-card" aria-labelledby="contact-card-title">
        <p class="contact-card__eyebrow">
          <q-icon name="contactless" size="17px" />
          <span>Digital contact card</span>
        </p>

        <div class="contact-card__identity" aria-hidden="true">CK</div>
        <h1 id="contact-card-title">Chad Kohl</h1>
        <p class="contact-card__role">Full-Stack Developer at Ckohl Works</p>
        <p class="contact-card__summary">
          Practical digital tools for local businesses: websites, smart QR and NFC experiences, and
          ongoing technical support.
        </p>

        <div class="contact-card-actions" aria-label="Contact actions">
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="phone"
            label="Call Chad"
            href="tel:+17194285039"
            class="ckw-btn ckw-btn--primary"
          />
          <q-btn
            outline
            no-caps
            icon="email"
            label="Email"
            href="mailto:chad_kohl@ckohl.com"
            class="ckw-btn ckw-btn--outline"
          />
          <q-btn
            outline
            no-caps
            icon="person_add"
            label="Save Contact"
            href="/contacts/chad-kohl.vcf"
            download="chad-kohl.vcf"
            class="ckw-btn ckw-btn--outline"
          />
        </div>

        <div class="contact-card-links" aria-label="Website links">
          <a href="https://ckohl.com" target="_blank" rel="noopener noreferrer">
            <q-icon name="account_circle" size="20px" />
            <span>Portfolio</span>
            <q-icon name="open_in_new" size="18px" />
          </a>
          <a href="https://works.ckohl.com" target="_blank" rel="noopener noreferrer">
            <q-icon name="language" size="20px" />
            <span>Ckohl Works</span>
            <q-icon name="open_in_new" size="18px" />
          </a>
        </div>

        <p class="contact-card__note">Save the contact now, then return whenever you need to connect.</p>
      </section>
    </main>
  </q-page>
</template>

<style lang="scss" scoped>
.contact-card-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 78% 16%, rgba(249, 156, 30, 0.14), transparent 25%),
    var(--ckw-page-overlay),
    var(--ckw-page-bg);
  color: var(--ckw-text-primary);
}

.contact-card-page__content {
  width: min(620px, calc(100% - 32px));
  margin: 0 auto;
  padding: 58px 0 72px;
}

.contact-card {
  padding: clamp(28px, 6vw, 50px);
  border: 1px solid var(--ckw-border-strong);
  border-radius: 8px;
  background: var(--ckw-surface-panel-gradient);
  box-shadow: var(--ckw-card-shadow);
  text-align: center;
}

.contact-card__eyebrow {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  margin: 0 0 18px;
  color: var(--ckw-orange);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.contact-card__identity {
  display: grid;
  width: 78px;
  aspect-ratio: 1;
  margin: 2px auto 20px;
  border: 1px solid var(--ckw-border-strong);
  border-radius: 50%;
  background: var(--ckw-surface-raised);
  color: var(--ckw-orange);
  font-family: 'Orbitron', var(--ckw-font-body);
  font-size: 1.45rem;
  font-weight: 600;
  place-items: center;
}

.contact-card h1 {
  margin: 0;
  color: var(--ckw-text-strong);
  font-size: clamp(2.65rem, 5vw, 4.4rem);
  line-height: 1;
}

.contact-card__role {
  margin: 12px 0 0;
  color: var(--ckw-orange);
  font-size: 1.12rem;
  font-weight: 800;
}

.contact-card__summary {
  margin: 20px 0 0;
  color: var(--ckw-text-primary);
  font-size: 1.08rem;
  line-height: 1.65;
}

.contact-card-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 30px;
}

.contact-card-actions :deep(.q-btn) {
  min-width: 0;
}

.contact-card-links {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid var(--ckw-border);
}

.contact-card-links a {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  color: var(--ckw-text-strong);
  font-weight: 700;
  text-decoration: none;
}

.contact-card-links a :first-child {
  color: var(--ckw-orange);
}

.contact-card-links a:hover {
  color: var(--ckw-orange);
}

.contact-card__note {
  margin: 24px 0 0;
  color: var(--ckw-text-muted);
  font-size: 0.92rem;
  line-height: 1.5;
}

@media (max-width: 560px) {
  .contact-card-page__content {
    width: min(100% - 28px, 520px);
    padding: 34px 0 48px;
  }

  .contact-card {
    padding: 28px 20px;
  }

  .contact-card h1 {
    font-size: clamp(2.55rem, 14vw, 3.45rem);
  }

  .contact-card__summary {
    font-size: 1rem;
  }

  .contact-card-links {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
