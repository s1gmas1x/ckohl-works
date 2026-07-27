<template>
  <section
    class="contact-card"
    :class="theme.className"
    :data-contact-profile-theme="theme.key"
    :data-contact-profile-theme-contract="theme.contractVersion"
    :aria-labelledby="`${profile.slug}-profile-title`"
  >
    <div class="contact-card__screen">
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
            class="contact-card__action"
            :class="
              action.isPrimary ? 'contact-card__action--primary' : 'contact-card__action--secondary'
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
  border: 1px solid #4c381d;
  border-radius: 0;
  background: linear-gradient(145deg, #2b210f, #100d07 52%, #352712);
  box-shadow:
    0 2px 0 rgba(255, 226, 166, 0.1) inset,
    0 26px 70px rgba(0, 0, 0, 0.52);
  text-align: center;
}
.contact-card__screen {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: calc(100vh - clamp(24px, 5vw, 56px));
  padding: clamp(22px, 4vw, 42px);
  border: 1px solid var(--ckw-crt-border);
  border-radius: 12px;
  background:
    radial-gradient(ellipse at 50% 12%, rgba(255, 199, 92, 0.1), transparent 48%),
    linear-gradient(180deg, rgba(255, 214, 132, 0.035), transparent 26%), var(--ckw-crt-screen);
  box-shadow:
    0 0 0 5px rgba(0, 0, 0, 0.3) inset,
    0 0 36px rgba(255, 171, 38, 0.08) inset;
}
.contact-card__screen::before {
  position: absolute;
  z-index: 0;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 226, 166, 0.035) 0,
    rgba(255, 226, 166, 0.035) 1px,
    transparent 1px,
    transparent 4px
  );
  content: '';
  pointer-events: none;
}
.contact-card__screen > * {
  position: relative;
  z-index: 1;
}
.contact-card__status {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin: 0 0 28px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 201, 106, 0.32);
  color: var(--ckw-crt-amber-muted);
  font-family: var(--ckw-font-terminal);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-align: left;
}
.contact-card__status-ready {
  color: var(--ckw-crt-amber);
}
.contact-card__content {
  width: min(620px, 100%);
  margin: auto;
  text-align: left;
}
.contact-card__eyebrow {
  margin: 0 0 12px;
  color: var(--ckw-crt-amber-muted);
  font-family: var(--ckw-font-terminal);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.contact-card h1 {
  margin: 0;
  color: var(--ckw-crt-amber-bright);
  font-family: var(--ckw-font-terminal);
  font-size: clamp(2.3rem, 5vw, 3.85rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.08;
  text-shadow: 0 0 14px rgba(255, 198, 84, 0.24);
}
.contact-card__role {
  margin: 14px 0 0;
  color: var(--ckw-crt-amber);
  font-family: var(--ckw-font-terminal);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.045em;
  line-height: 1.5;
  text-transform: uppercase;
}
.contact-card__summary {
  max-width: 48ch;
  margin: 22px 0 0;
  color: #f2d4a0;
  font-size: 1rem;
  line-height: 1.65;
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
  border: 1px solid transparent;
  border-radius: 0;
  font-family: var(--ckw-font-terminal);
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.035em;
  text-align: left;
  text-decoration: none;
}
.contact-card__action--primary {
  border-color: var(--ckw-crt-amber);
  background: rgba(255, 201, 106, 0.1);
  color: var(--ckw-crt-amber-bright);
}
.contact-card__action--secondary {
  border-bottom-color: rgba(255, 201, 106, 0.22);
  color: #e6c486;
}
.contact-card__action-cursor {
  color: var(--ckw-crt-amber);
}
.contact-card__action-index,
.contact-card__action-type {
  color: var(--ckw-crt-amber-muted);
  font-size: 0.72rem;
}
.contact-card__action-type {
  text-align: right;
}
.contact-card__action:hover,
.contact-card__action:focus-visible {
  border-color: var(--ckw-crt-amber);
  background: rgba(255, 201, 106, 0.1);
  color: var(--ckw-crt-amber-bright);
  outline: none;
}
.contact-card-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 201, 106, 0.26);
}
.contact-card-links a {
  display: flex;
  min-height: 44px;
  gap: 8px;
  align-items: center;
  padding: 0 11px;
  border: 1px solid rgba(255, 201, 106, 0.26);
  border-radius: 4px;
  color: var(--ckw-crt-amber-bright);
  font-family: var(--ckw-font-terminal);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-decoration: none;
}
.contact-card-links a :first-child {
  color: var(--ckw-crt-amber);
}
.contact-card-links a :last-child {
  margin-left: auto;
  color: var(--ckw-crt-amber-muted);
}
.contact-card-links a:hover {
  border-color: var(--ckw-crt-amber);
  background: rgba(255, 201, 106, 0.08);
}
.contact-card__note {
  margin: 20px 0 0;
  color: var(--ckw-crt-amber-muted);
  font-family: var(--ckw-font-terminal);
  font-size: 0.72rem;
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
  .contact-card h1 {
    font-size: clamp(2.15rem, 12vw, 3rem);
  }
  .contact-card__summary {
    font-size: 0.95rem;
  }
  .contact-card__status {
    margin-bottom: 24px;
    font-size: 0.61rem;
  }
  .contact-card-links {
    grid-template-columns: 1fr;
  }
  .contact-card__action {
    grid-template-columns: 14px 36px minmax(0, 1fr) auto;
    padding: 0 10px;
    font-size: 0.82rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .contact-card,
  .contact-card * {
    scroll-behavior: auto !important;
  }
}
</style>
