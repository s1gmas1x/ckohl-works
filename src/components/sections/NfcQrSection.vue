<template>
  <section id="smart-experiences" class="content-section nfc-qr-section">
    <div class="section-inner nfc-qr-section__grid">
      <div>
        <SectionHeading
          align="left"
          eyebrow="Smart QR & NFC"
          title="The card gets the tap. The destination does the work."
          description="Give customers one simple way to reach the menu, review link, booking page, contact details, or offer that matters right now."
        />
        <div class="nfc-qr-section__actions">
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon-right="arrow_forward"
            label="Start a Conversation"
            href="#contact"
            class="ckw-btn ckw-btn--primary"
          />
          <q-btn
            outline
            no-caps
            icon-right="open_in_new"
            label="View the restaurant demo"
            to="/margots-pizza"
            class="ckw-btn ckw-btn--outline"
          />
        </div>
      </div>

      <div class="nfc-qr-section__details">
        <article>
          <q-icon name="contactless" size="30px" />
          <h3>One managed destination</h3>
          <p>
            A tap, scan, link, table tent, or counter sign can point customers to the same useful
            place.
          </p>
        </article>
        <article>
          <q-icon name="qr_code_2" size="30px" />
          <h3>QR fallback included</h3>
          <p>Every experience can include a printed QR code for phones that do not use NFC.</p>
        </article>
        <article>
          <q-icon name="edit_note" size="30px" />
          <h3>Manual beta, real use cases</h3>
          <p>
            Early experiences are managed by hand for menus, reviews, booking, vendor details, and
            digital contact cards.
          </p>
        </article>
        <p class="nfc-qr-section__note">
          Dynamic destinations and basic analytics are validation goals, not live self-service
          platform features.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHeading from '@/components/ui/SectionHeading.vue'
</script>

<style lang="scss" scoped>
.nfc-qr-section__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
  gap: 54px;
  align-items: center;
}
.nfc-qr-section__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.nfc-qr-section__details {
  display: grid;
  gap: 14px;
}
.nfc-qr-section__details article {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 16px;
  padding: 20px;
  background: var(--ckw-surface-raised);
  border: 1px solid var(--ckw-border);
  border-radius: 8px;
  box-shadow: var(--ckw-card-shadow);
}
.nfc-qr-section__details :deep(.q-icon) {
  grid-row: span 2;
  color: var(--ckw-orange);
}
.nfc-qr-section__details h3,
.nfc-qr-section__details p {
  margin: 0;
}
.nfc-qr-section__details h3 {
  color: var(--ckw-text-strong);
  font-size: 1.05rem;
}
.nfc-qr-section__details article p,
.nfc-qr-section__note {
  color: var(--ckw-text-muted);
  line-height: 1.55;
}
.nfc-qr-section__note {
  margin: 4px 0 0;
  font-size: 0.9rem;
}
@media (max-width: 860px) {
  .nfc-qr-section__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
</style>
