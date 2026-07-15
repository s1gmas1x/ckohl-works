<template>
  <section id="services" class="content-section services-care">
    <div class="section-inner">
      <SectionHeading
        eyebrow="Websites & Care"
        title="A useful website is more than a launch day."
        description="Start with the customer actions your business needs, then choose the right level of ongoing care."
      />

      <div class="services-care__grid">
        <article class="services-care__panel">
          <div class="services-care__panel-heading">
            <q-icon name="language" size="30px" />
            <div>
              <p>Website Services</p>
              <h3>Give customers a clear way to act.</h3>
            </div>
          </div>

          <p class="services-care__summary">
            Build a practical, mobile-friendly home for the information and next steps your
            customers need most.
          </p>

          <ul class="services-care__list">
            <li>Landing pages and multi-page small-business sites</li>
            <li>Contact and lead forms, service details, menus, and galleries</li>
            <li>Maps, directions, social links, booking links, and review links</li>
            <li>Basic SEO, domain/DNS assistance, deployment, and launch support</li>
          </ul>
        </article>

        <article class="services-care__panel">
          <div class="services-care__panel-heading">
            <q-icon name="support_agent" size="30px" />
            <div>
              <p>Hosting, Maintenance & Support</p>
              <h3>Keep the important details current.</h3>
            </div>
          </div>

          <p class="services-care__summary">
            Choose defined care for the work that keeps your site available, current, and useful.
          </p>

          <ul class="services-care__list">
            <li>Hosting, deployment, SSL, monitoring, and applicable backups</li>
            <li>Routine updates, testing, and small SEO or accessibility fixes</li>
            <li>Defined minor changes for hours, menus, photos, and services</li>
            <li>Email support with a clear response and change allowance</li>
          </ul>

          <p class="services-care__boundary">
            New pages, redesigns, integrations, and major content work are quoted separately. Care
            plans are defined support, not unlimited work.
          </p>
        </article>
      </div>

      <p class="services-care__custom-work">
        Need something beyond these focused offers? Custom integrations and application features are
        available when separately scoped around a real business need.
      </p>
    </div>
  </section>
</template>

<script setup>
import SectionHeading from '@/components/ui/SectionHeading.vue'
</script>

<style lang="scss" scoped>
.services-care__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.services-care__panel {
  display: grid;
  align-content: start;
  gap: 20px;
  padding: 30px;
  background: var(--ckw-surface-raised);
  border: 1px solid var(--ckw-border);
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(8, 12, 18, 0.08);
}

.services-care__panel-heading {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: start;
}

.services-care__panel-heading :deep(.q-icon) {
  color: var(--ckw-orange);
  filter: none;
}

.services-care__panel-heading p,
.services-care__panel-heading h3,
.services-care__summary,
.services-care__boundary {
  margin: 0;
}
.services-care__custom-work {
  max-width: 760px;
  margin: 24px auto 0;
  color: var(--ckw-text-muted);
  line-height: 1.6;
  text-align: center;
}

.services-care__panel-heading p {
  margin-bottom: 5px;
  color: var(--ckw-text-muted);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.services-care__panel-heading h3 {
  color: var(--ckw-text-strong);
  font-size: 1.35rem;
  line-height: 1.22;
}

.services-care__summary {
  color: var(--ckw-text-primary);
  line-height: 1.65;
}

.services-care__list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.services-care__list li {
  position: relative;
  padding-left: 24px;
  color: var(--ckw-text-muted);
  line-height: 1.5;
}

.services-care__list li::before {
  content: '';
  position: absolute;
  top: 0.48rem;
  left: 0;
  width: 9px;
  height: 9px;
  border: 2px solid var(--ckw-orange);
  border-radius: 50%;
}

.services-care__boundary {
  padding-top: 18px;
  border-top: 1px solid var(--ckw-border);
  color: var(--ckw-text-primary);
  font-size: 0.94rem;
  line-height: 1.6;
}

@media (max-width: 760px) {
  .services-care__grid {
    grid-template-columns: 1fr;
  }

  .services-care__panel {
    padding: 24px;
  }
}
</style>
