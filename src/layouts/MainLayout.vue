<template>
  <q-layout view="lHh lpR fFf">
    <SiteHeader
      v-if="!isMargotsPage"
      :theme="displayTheme"
      :show-theme-toggle="!isMargotsPage"
      :show-navigation="!isContactCardPage"
      :show-contact-cta="!isContactCardPage"
      :show-menu="!isContactCardPage"
      @toggle-drawer="rightDrawerOpen = !rightDrawerOpen"
      @toggle-theme="toggleTheme"
    />

    <q-drawer
      v-if="!isMargotsPage && !isContactCardPage"
      v-model="rightDrawerOpen"
      side="right"
      overlay
      bordered
      :width="280"
      class="site-drawer"
    >
      <q-list padding>
        <q-item-label header> Navigation </q-item-label>
        <q-item
          v-for="item in drawerItems"
          :key="item.label"
          clickable
          :to="{ path: '/', hash: `#${item.id}` }"
          @click="rightDrawerOpen = false"
        >
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
        <q-item clickable href="mailto:chad_kohl@ckohl.com">
          <q-item-section>Schedule Consultation</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '@/components/layout/SiteHeader.vue'

const THEME_STORAGE_KEY = 'ckohl-works-theme'
const rightDrawerOpen = ref(false)
const theme = ref(getInitialTheme())
const route = useRoute()
const isMargotsPage = computed(() => route.path === '/margots-pizza')
const isContactCardPage = computed(() => route.path.startsWith('/card/'))
const displayTheme = computed(() => (isMargotsPage.value ? 'dark' : theme.value))

const drawerItems = [
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Offers', id: 'solutions' },
  { label: 'Demos', id: 'demonstrations' },
  { label: 'Contact', id: 'contact' },
]

function getInitialTheme() {
  if (typeof document === 'undefined') return 'dark'

  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'

  window.localStorage.setItem(THEME_STORAGE_KEY, theme.value)
}

watch(displayTheme, applyTheme, { immediate: true })

function applyTheme(activeTheme) {
  if (typeof document === 'undefined') return

  document.documentElement.dataset.theme = activeTheme
  document.documentElement.style.colorScheme = activeTheme
}
</script>
