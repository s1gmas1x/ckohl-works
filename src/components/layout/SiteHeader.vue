<template>
  <q-header class="site-header">
    <q-toolbar class="site-header__toolbar">
      <q-toolbar-title class="site-header__title">
        <BrandMark />
      </q-toolbar-title>

      <nav class="site-header__nav" aria-label="Primary navigation">
        <q-btn
          v-for="item in navigationItems"
          :key="item.label"
          flat
          no-caps
          :label="item.label"
          :icon-right="item.hasMenu ? 'expand_more' : undefined"
          class="site-header__link"
          @click="handleNavigation(item)"
        />
      </nav>

      <q-btn
        unelevated
        no-caps
        color="primary"
        icon-right="arrow_forward"
        label="Schedule Consultation"
        href="#contact"
        class="ckw-btn ckw-btn--primary site-header__cta"
      />

      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Open navigation"
        class="site-header__menu"
        @click="$emit('toggle-drawer')"
      />
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandMark from '@/components/ui/BrandMark.vue'

defineEmits(['toggle-drawer'])

const HEADER_SCROLL_OFFSET = 92

const route = useRoute()
const router = useRouter()

const navigationItems = [
  { label: 'Solutions', id: 'solutions', hasMenu: true },
  { label: 'Process', id: 'process' },
  { label: 'About', id: 'solutions' },
  { label: 'Contact', id: 'contact' },
]

async function handleNavigation(item) {
  await scrollToSection(item.id)
}

async function scrollToSection(sectionId) {
  if (route.path !== '/') {
    await router.push('/')
    await nextTick()
  }

  const section = document.getElementById(sectionId)

  if (!section) return

  const scrollTop = section.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET

  window.scrollTo({
    top: Math.max(scrollTop, 0),
    behavior: 'smooth',
  })
}
</script>

<style lang="scss" scoped>
.site-header {
  background: rgba(5, 7, 9, 0.82);
  border-bottom: 1px solid var(--ckw-border);
  color: var(--ckw-text-strong);
  backdrop-filter: blur(18px);
}

.site-header__toolbar {
  min-height: 82px;
  width: min(var(--ckw-container), calc(100% - 32px));
  margin: 0 auto;
  padding: 0;
}

.site-header__title {
  display: flex;
  align-items: center;
}

.site-header__nav {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 26px;
}

.site-header__link {
  min-height: 38px;
  padding: 0 10px;
  color: var(--ckw-text-strong);
  font-size: 0.9rem;
  font-weight: 700;
}

.site-header__link:hover {
  color: var(--ckw-orange);
}

.site-header__cta {
  min-height: 44px;
}

.site-header__menu {
  display: none;
  color: var(--ckw-text-strong);
}

@media (max-width: 980px) {
  .site-header__nav,
  .site-header__cta {
    display: none;
  }

  .site-header__menu {
    display: inline-flex;
  }
}

@media (max-width: 600px) {
  .site-header__toolbar {
    min-height: 70px;
  }
}
</style>
