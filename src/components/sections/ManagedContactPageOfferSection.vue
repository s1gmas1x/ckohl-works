<template>
  <section id="managed-contact-page" class="content-section managed-contact-page-offer">
    <div class="section-inner">
      <SectionHeading
        eyebrow="Managed Contact Page"
        title="One clear place for customers to act."
        description="A proven mobile layout, configured and tested around the action that matters most to your business."
      />

      <div class="managed-contact-page-offer__grid">
        <article class="managed-contact-page-offer__summary">
          <p class="managed-contact-page-offer__eyebrow">The offer</p>
          <h3>Built for the moment someone scans, taps, or asks how to reach you.</h3>
          <p>
            We organize the details, configure the page, create the QR files, and test the customer
            actions before it goes live. You get a managed destination instead of another login to
            figure out.
          </p>
          <ul>
            <li>One mobile contact page using the approved Ckohl Works layout</li>
            <li>Up to six approved actions, with one clear primary action</li>
            <li>QR files and downloadable contact details when the information supports them</li>
            <li>Hosting, defined support, and a stable page address</li>
          </ul>
        </article>

        <article class="managed-contact-page-offer__price" aria-label="Managed Contact Page price">
          <p class="managed-contact-page-offer__eyebrow">Managed Contact Page</p>
          <p class="managed-contact-page-offer__setup"><span>$349</span> setup</p>
          <p class="managed-contact-page-offer__monthly"><span>$29</span> per month</p>
          <p class="managed-contact-page-offer__total">$697 for the first year</p>
          <p class="managed-contact-page-offer__timing">
            Typical delivery target: five business days after complete intake, usable assets, and
            payment.
          </p>
          <a
            :href="sectionHref"
            class="managed-contact-page-offer__cta"
            @click.prevent="scrollToSection('contact')"
          >
            <span>Talk through your page</span>
            <q-icon name="arrow_forward" size="18px" aria-hidden="true" />
          </a>
        </article>
      </div>

      <p class="managed-contact-page-offer__boundary">
        New pages, redesigns, integrations, custom domains, lead storage, and major content work are
        separately scoped. This is a managed page service, not self-service template access.
      </p>
    </div>
  </section>
</template>

<script setup>
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useSectionNavigation } from '@/composables/useSectionNavigation.js'

const { sectionHref, scrollToSection } = useSectionNavigation()
</script>

<style lang="scss" scoped>
.managed-contact-page-offer {
  background: var(--ckw-surface);
  border-top: 1px solid var(--ckw-border);
  border-bottom: 1px solid var(--ckw-border);
}

.managed-contact-page-offer__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.7fr);
  gap: 1px;
  overflow: hidden;
  background: var(--ckw-border-strong);
  border: 1px solid var(--ckw-border-strong);
  border-radius: 10px;
}

.managed-contact-page-offer__summary,
.managed-contact-page-offer__price {
  padding: clamp(26px, 4vw, 42px);
  background: var(--ckw-surface-raised);
}

.managed-contact-page-offer__price {
  display: grid;
  align-content: start;
  gap: 12px;
  background:
    linear-gradient(145deg, rgba(249, 156, 30, 0.12), transparent 64%), var(--ckw-surface-raised);
}

.managed-contact-page-offer__eyebrow,
.managed-contact-page-offer h3,
.managed-contact-page-offer p,
.managed-contact-page-offer ul {
  margin: 0;
}

.managed-contact-page-offer__eyebrow {
  color: var(--ckw-orange);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.managed-contact-page-offer h3 {
  max-width: 620px;
  margin-top: 12px;
  color: var(--ckw-text-strong);
  font-size: clamp(1.45rem, 2.3vw, 2rem);
  line-height: 1.2;
}

.managed-contact-page-offer__summary > p:not(.managed-contact-page-offer__eyebrow),
.managed-contact-page-offer__timing,
.managed-contact-page-offer__boundary {
  color: var(--ckw-text-primary);
  line-height: 1.65;
}

.managed-contact-page-offer__summary > p:not(.managed-contact-page-offer__eyebrow) {
  max-width: 660px;
  margin-top: 16px;
}

.managed-contact-page-offer ul {
  display: grid;
  gap: 10px;
  margin-top: 22px;
  padding: 0;
  list-style: none;
}

.managed-contact-page-offer li {
  position: relative;
  padding-left: 23px;
  color: var(--ckw-text-muted);
  line-height: 1.5;
}

.managed-contact-page-offer li::before {
  position: absolute;
  top: 0.45rem;
  left: 0;
  width: 8px;
  height: 8px;
  border: 2px solid var(--ckw-orange);
  border-radius: 50%;
  content: '';
}

.managed-contact-page-offer__setup,
.managed-contact-page-offer__monthly {
  color: var(--ckw-text-muted);
  font-size: 0.94rem;
  font-weight: 700;
}

.managed-contact-page-offer__setup span,
.managed-contact-page-offer__monthly span {
  margin-right: 7px;
  color: var(--ckw-text-strong);
  font-size: clamp(2rem, 4vw, 2.7rem);
  line-height: 1;
}

.managed-contact-page-offer__monthly {
  padding-top: 12px;
  border-top: 1px solid var(--ckw-border);
}

.managed-contact-page-offer__total {
  color: var(--ckw-orange);
  font-weight: 800;
}

.managed-contact-page-offer__timing {
  color: var(--ckw-text-muted);
  font-size: 0.93rem;
}

.managed-contact-page-offer__cta {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  margin-top: 10px;
  padding: 0 18px;
  background: var(--ckw-orange);
  border-radius: 6px;
  color: #17120a;
  font-weight: 800;
  text-decoration: none;
}

.managed-contact-page-offer__cta:hover {
  background: var(--ckw-orange-light);
}

.managed-contact-page-offer__boundary {
  max-width: 850px;
  margin: 22px auto 0;
  color: var(--ckw-text-muted);
  font-size: 0.94rem;
  text-align: center;
}

@media (max-width: 760px) {
  .managed-contact-page-offer__grid {
    grid-template-columns: 1fr;
  }

  .managed-contact-page-offer__summary,
  .managed-contact-page-offer__price {
    padding: 26px 22px;
  }
}
</style>
