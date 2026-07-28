<template>
  <div class="contact-profile-action-regions">
    <nav class="contact-profile-contact-actions" aria-label="Primary contact actions">
      <a
        v-for="(action, index) in contactActions"
        :key="action.key"
        :href="getActionHref(action, publicBase)"
        :aria-label="action.label"
        @click="handleActionClick(action)"
        class="contact-profile-action-tile contact-profile-crt-control"
        :class="action.isPrimary ? 'contact-profile-crt-control--primary' : undefined"
      >
        <span class="contact-profile-action-tile__index" aria-hidden="true"
          >[{{ formatActionIndex(index) }}]</span
        >
        <ContactProfileIcon class="contact-profile-action-tile__icon" :name="actionIcon(action)" />
        <span class="contact-profile-action-tile__type" aria-hidden="true">{{
          actionTypeLabel(action)
        }}</span>
        <span class="contact-profile-action-tile__label">{{ action.label }}</span>
      </a>
    </nav>

    <nav v-if="saveAction" class="contact-profile-save" aria-label="Save contact">
      <a
        :href="getActionHref(saveAction, publicBase)"
        :download="saveAction.download"
        :aria-label="saveAction.label"
        class="contact-profile-save__link contact-profile-crt-control contact-profile-crt-control--primary"
      >
        <ContactProfileIcon class="contact-profile-save__icon" name="person-add" />
        <span class="contact-profile-save__copy">
          <span class="contact-profile-save__title">{{ saveAction.label }}</span>
          <span class="contact-profile-save__subtitle">Add to your address book</span>
        </span>
        <ContactProfileIcon class="contact-profile-save__arrow" name="chevron-right" />
      </a>
    </nav>

    <nav
      v-if="externalActions.length"
      class="contact-profile-external-actions"
      aria-label="Web, social, and location links"
    >
      <a
        v-for="action in externalActions"
        :key="action.key"
        :href="getActionHref(action, publicBase)"
        :aria-label="externalActionAccessibleName(action)"
        target="_blank"
        rel="noopener noreferrer"
        class="contact-profile-external-action contact-profile-crt-control"
      >
        <ContactProfileIcon
          class="contact-profile-external-action__icon"
          :name="actionIcon(action)"
        />
        <span>{{ action.label }}</span>
        <ContactProfileIcon class="contact-profile-external-action__arrow" name="chevron-right" />
      </a>
    </nav>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import ContactProfileIcon from '@/components/profile/ContactProfileIcon.vue'
import { getContactProfileActionIcon } from '@/features/contact-profile/actionIcons.js'
import { getActionHref, getProfileActionsByGroup } from '@/data/publishedProfiles.js'

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
})

const copiedActionKey = ref(null)
const contactActions = computed(() => getProfileActionsByGroup(props.profile, 'contact'))
const saveActions = computed(() => getProfileActionsByGroup(props.profile, 'save'))
const saveAction = computed(() => saveActions.value[0])
const externalActions = computed(() => getProfileActionsByGroup(props.profile, 'external'))
const publicBase = import.meta.env.BASE_URL
let copiedActionTimeout

function actionTypeLabel(action) {
  if (copiedActionKey.value === action.key) return 'COPIED'
  if (action.type === 'email') return 'EMAIL'

  return action.typeLabel
}

function formatActionIndex(index) {
  return String(index + 1).padStart(2, '0')
}

function actionIcon(action) {
  return getContactProfileActionIcon(action)
}

function externalActionAccessibleName(action) {
  if (action.type === 'location')
    return `${action.label}: ${action.displayValue} (opens in new tab)`

  return `${action.label} (opens in new tab)`
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

onBeforeUnmount(() => {
  window.clearTimeout(copiedActionTimeout)
})
</script>
