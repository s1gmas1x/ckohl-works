<template>
  <section
    class="contact-card"
    :class="theme.className"
    :data-contact-profile-theme="theme.key"
    :data-contact-profile-theme-contract="theme.contractVersion"
    :aria-labelledby="`${profile.slug}-profile-title`"
  >
    <div class="contact-card__screen contact-profile-crt-screen">
      <header class="contact-card__status" aria-label="Contact card status">
        <span>CKOHL WORKS // CONTACT NODE</span>
        <span class="contact-card__status-ready">READY</span>
      </header>

      <div class="contact-card__content">
        <p class="contact-card__eyebrow">Profile // {{ profile.slug }}</p>
        <h1 :id="`${profile.slug}-profile-title`">{{ profile.identity.name }}</h1>
        <p class="contact-card__role">
          {{ profile.identity.role
          }}<span v-if="profile.identity.organization"> / {{ profile.identity.organization }}</span>
        </p>
        <p class="contact-card__summary">{{ profile.identity.summary }}</p>

        <nav class="contact-card-actions" aria-label="Contact actions">
          <a
            v-for="(action, index) in profile.actions"
            :key="action.key"
            :href="getActionHref(action)"
            :download="action.download || undefined"
            :ref="(element) => setActionLink(element, index)"
            @click="handleActionClick(action)"
            @keydown.up.prevent="focusAction(index - 1)"
            @keydown.down.prevent="focusAction(index + 1)"
            @keydown.home.prevent="focusAction(0)"
            @keydown.end.prevent="focusAction(profile.actions.length - 1)"
            class="contact-card__action contact-profile-crt-control"
            :class="
              action.isPrimary
                ? 'contact-card__action--primary contact-profile-crt-control--primary'
                : 'contact-card__action--secondary'
            "
          >
            <span class="contact-card__action-cursor" aria-hidden="true">{{
              action.isPrimary ? '>' : ' '
            }}</span>
            <span class="contact-card__action-index" aria-hidden="true">[{{ index + 1 }}]</span>
            <span>{{ action.label }}</span>
            <span class="contact-card__action-type" aria-hidden="true">{{
              actionTypeLabel(action)
            }}</span>
          </a>
        </nav>

        <div class="contact-card-links" aria-label="Website links">
          <a
            v-for="link in profile.links"
            :key="link.key"
            :href="link.value"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-profile-crt-control"
          >
            <q-icon :name="link.icon" size="18px" />
            <span>{{ link.label }}</span>
            <q-icon name="open_in_new" size="16px" />
          </a>
        </div>

        <p class="contact-card__note">
          Tap a row, or use Tab and the arrow keys to select an action.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { resolveContactProfileTheme } from '@/data/contactProfileThemes.js'
import { getActionHref } from '@/data/publishedProfiles.js'

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
})

const actionLinks = ref([])
const copiedActionKey = ref(null)
const theme = computed(() => resolveContactProfileTheme(props.profile.themeKey))
let copiedActionTimeout

function actionTypeLabel(action) {
  if (copiedActionKey.value === action.key) return 'COPIED'

  return {
    phone: 'CALL',
    email: 'MAIL',
    vcard: 'SAVE',
  }[action.type]
}

function setActionLink(element, index) {
  actionLinks.value[index] = element
}

function focusAction(index) {
  const actionCount = props.profile.actions.length
  const wrappedIndex = (index + actionCount) % actionCount
  actionLinks.value[wrappedIndex]?.focus()
}

async function handleActionClick(action) {
  if (action.type !== 'email' || !navigator.clipboard?.writeText) return

  try {
    await navigator.clipboard.writeText(action.value)
    copiedActionKey.value = action.key
    window.clearTimeout(copiedActionTimeout)
    copiedActionTimeout = window.setTimeout(() => {
      copiedActionKey.value = null
    }, 2200)
  } catch {
    // The mailto link remains usable when clipboard access is unavailable.
  }
}
</script>

<style lang="scss" scoped>
.contact-card {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 100vh;
  padding: clamp(12px, 2.5vw, 28px);
  border: 0;
  border-radius: 0;
  background: var(--crt-color-surface-page);
  box-shadow: none;
  text-align: center;
}
.contact-card__screen {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: calc(100vh - clamp(24px, 5vw, 56px));
  padding: clamp(22px, 4vw, 42px);
  border-width: var(--crt-border-width);
  border-style: solid;
}
.contact-card__status {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin: 0 0 28px;
  padding-bottom: 12px;
  border-bottom: var(--crt-border-width) solid var(--crt-color-border-panel);
  color: var(--crt-color-text-muted);
  font-family: var(--crt-type-label-family);
  font-size: var(--crt-type-label-size);
  font-weight: var(--crt-type-label-weight);
  letter-spacing: var(--crt-type-label-tracking);
  text-align: left;
}
.contact-card__status-ready {
  color: var(--crt-color-status-ready);
}
.contact-card__content {
  width: min(620px, 100%);
  margin: auto;
  text-align: left;
}
.contact-card__eyebrow {
  margin: 0 0 12px;
  color: var(--crt-color-text-muted);
  font-family: var(--crt-type-label-family);
  font-size: var(--crt-type-label-size);
  font-weight: var(--crt-type-label-weight);
  letter-spacing: var(--crt-type-label-tracking);
  text-transform: uppercase;
}
.contact-card h1 {
  margin: 0;
  color: var(--crt-color-text-strong);
  font-family: var(--crt-type-identity-family);
  font-size: var(--crt-type-identity-size);
  font-weight: var(--crt-type-identity-weight);
  letter-spacing: var(--crt-type-identity-tracking);
  line-height: var(--crt-type-identity-leading);
  text-shadow: var(--crt-glow-identity);
}
.contact-card__role {
  margin: 14px 0 0;
  color: var(--crt-color-accent);
  font-family: var(--crt-type-label-family);
  font-size: var(--crt-type-role-size);
  font-weight: var(--crt-type-label-weight);
  letter-spacing: var(--crt-type-role-tracking);
  line-height: 1.5;
  text-transform: uppercase;
}
.contact-card__summary {
  max-width: 48ch;
  margin: 22px 0 0;
  color: var(--crt-color-text-body);
  font-family: var(--crt-type-body-family);
  font-size: var(--crt-type-body-size);
  font-weight: var(--crt-type-body-weight);
  line-height: var(--crt-type-body-leading);
}
.contact-card-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  margin-top: 30px;
}
.contact-card__action {
  display: grid;
  grid-template-columns: 14px 42px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  min-height: 48px;
  padding: 0 16px;
  border-width: var(--crt-border-width);
  border-style: solid;
  border-radius: 0;
  font-family: var(--crt-type-action-family);
  font-size: var(--crt-type-action-size);
  font-weight: var(--crt-type-action-weight);
  letter-spacing: var(--crt-type-action-tracking);
  text-align: left;
  text-decoration: none;
}
.contact-card__action--secondary {
  border-right-color: transparent;
  border-left-color: transparent;
}
.contact-card__action-cursor {
  color: var(--crt-color-accent);
}
.contact-card__action-index,
.contact-card__action-type {
  color: var(--crt-color-text-muted);
  font-family: var(--crt-type-data-family);
  font-size: var(--crt-type-data-size);
  font-weight: var(--crt-type-data-weight);
  letter-spacing: var(--crt-type-data-tracking);
}
.contact-card__action-type {
  text-align: right;
}
.contact-card-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--crt-panel-gap);
  margin-top: 18px;
  padding-top: 18px;
  border-top: var(--crt-border-width) solid var(--crt-color-border-panel);
}
.contact-card-links a {
  display: flex;
  min-height: 44px;
  gap: 8px;
  align-items: center;
  padding: 0 11px;
  border-width: var(--crt-border-width);
  border-style: solid;
  border-radius: var(--crt-radius-panel);
  font-family: var(--crt-type-action-family);
  font-size: var(--crt-type-label-size);
  font-weight: var(--crt-type-action-weight);
  letter-spacing: var(--crt-type-action-tracking);
  text-decoration: none;
}
.contact-card-links a :first-child {
  color: var(--crt-color-accent);
}
.contact-card-links a :last-child {
  margin-left: auto;
  color: var(--crt-color-text-muted);
}
.contact-card__note {
  margin: 20px 0 0;
  color: var(--crt-color-text-muted);
  font-family: var(--crt-type-label-family);
  font-size: var(--crt-type-label-size);
  font-weight: var(--crt-type-label-weight);
  line-height: 1.5;
  text-align: left;
}
@media (max-width: 560px) {
  .contact-card {
    padding: 8px;
  }
  .contact-card__screen {
    min-height: calc(100vh - 16px);
    padding: 24px 18px;
  }
  .contact-card__status {
    margin-bottom: 24px;
  }
  .contact-card-links {
    grid-template-columns: 1fr;
  }
  .contact-card__action {
    grid-template-columns: 14px 36px minmax(0, 1fr) auto;
    padding-inline: var(--crt-panel-padding-inline);
  }
}
@media (prefers-reduced-motion: reduce) {
  .contact-card,
  .contact-card * {
    scroll-behavior: auto !important;
  }
}
</style>
