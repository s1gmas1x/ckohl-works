<template>
  <section id="contact" class="content-section contact-form-section">
    <div class="section-inner contact-form-section__grid">
      <SectionHeading
        align="left"
        eyebrow="Request a Quote"
        title="Tell us what you need customers to do next."
        description="Share the basics and prepare an email request we can follow up on."
      />

      <q-form class="contact-form" aria-describedby="contact-form-note" @submit="submitRequest">
        <p id="contact-form-note" class="contact-form__note">
          This form prepares an email in your mail app. No information is sent until you send that
          email.
        </p>
        <div class="contact-form__fields">
          <q-input
            v-model.trim="form.name"
            outlined
            stack-label
            label="Your name"
            :rules="[requiredRule]"
          />
          <q-input
            v-model.trim="form.business"
            outlined
            stack-label
            label="Business name"
            :rules="[requiredRule]"
          />
          <q-select
            v-model="form.contactMethod"
            outlined
            stack-label
            label="Best way to reach you"
            :options="contactMethods"
            popup-content-class="ckw-select-menu"
            :rules="[requiredRule]"
          />
          <q-select
            v-model="form.service"
            outlined
            stack-label
            label="What can we help with?"
            :options="services"
            popup-content-class="ckw-select-menu"
            :rules="[requiredRule]"
          />
          <q-input
            v-model.trim="form.details"
            class="contact-form__details"
            outlined
            stack-label
            type="textarea"
            label="A little about your project"
            :rules="[requiredRule]"
          />
        </div>

        <q-banner
          v-if="submitted"
          class="contact-form__confirmation"
          rounded
          role="status"
          aria-live="polite"
        >
          Your email app should open with your request ready to send. If it does not, email us at
          chad_kohl@ckohl.com.
        </q-banner>

        <q-btn
          unelevated
          no-caps
          color="primary"
          icon-right="mail_outline"
          label="Prepare Email Request"
          type="submit"
          class="ckw-btn ckw-btn--primary"
        />
      </q-form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const contactMethods = ['Email', 'Phone', 'Text']
const services = [
  'Business website',
  'Smart QR or NFC experience',
  'Hosting or care',
  'Custom work',
  'Not sure yet',
]
const submitted = ref(false)
const form = reactive({ name: '', business: '', contactMethod: '', service: '', details: '' })
const requiredRule = (value) => Boolean(value) || 'Please complete this field.'

function submitRequest() {
  const subject = `Ckohl Works request from ${form.business}`
  const body = [
    `Name: ${form.name}`,
    `Business: ${form.business}`,
    `Best contact method: ${form.contactMethod}`,
    `Service interest: ${form.service}`,
    '',
    'Project details:',
    form.details,
  ].join('\n')

  submitted.value = true
  window.location.href = `mailto:chad_kohl@ckohl.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
</script>

<style lang="scss" scoped>
.contact-form-section__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.75fr) minmax(0, 1fr);
  gap: 54px;
  align-items: start;
}
.contact-form {
  display: grid;
  gap: 18px;
  padding: 28px;
  background: var(--ckw-surface-raised);
  border: 1px solid var(--ckw-border);
  border-radius: 8px;
  box-shadow: var(--ckw-card-shadow);
}
.contact-form__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.contact-form__note {
  margin: 0;
  color: var(--ckw-text-muted);
  font-size: 0.95rem;
  line-height: 1.55;
}
.contact-form__details {
  grid-column: 1 / -1;
}
.contact-form__confirmation {
  color: var(--ckw-text-primary);
  background: var(--ckw-surface-subtle);
  border: 1px solid var(--ckw-border);
  line-height: 1.5;
}
:deep(.q-field__control) {
  min-height: 54px;
}
:deep(.q-field__label),
:deep(.q-field__native),
:deep(.q-field__input) {
  color: var(--ckw-text-primary);
}
:deep(.q-field--outlined .q-field__control::before) {
  border-color: var(--ckw-border-strong);
}
@media (max-width: 860px) {
  .contact-form-section__grid,
  .contact-form__fields {
    grid-template-columns: 1fr;
  }
  .contact-form {
    padding: 22px;
  }
}
</style>
