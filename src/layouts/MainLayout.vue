<template>
  <q-layout view="lHh lpR fFf">
    <SiteHeader
      :theme="theme"
      @toggle-drawer="rightDrawerOpen = !rightDrawerOpen"
      @toggle-theme="toggleTheme"
    />

    <q-drawer
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
          :href="`#${item.id}`"
          @click="handleDrawerNavigation(item.id)"
        >
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
        <q-item clickable href="mailto:hello@ckworks.dev">
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
import { nextTick, ref } from 'vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'

const HEADER_SCROLL_OFFSET = 92
const THEME_STORAGE_KEY = 'ckohl-works-theme'
const rightDrawerOpen = ref(false)
const theme = ref(getInitialTheme())

const drawerItems = [
  { label: 'Solutions', id: 'solutions' },
  { label: 'How It Works', id: 'process' },
  { label: 'Contact', id: 'contact' },
]

function getInitialTheme() {
  if (typeof document === 'undefined') return 'dark'

  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'

  document.documentElement.dataset.theme = theme.value
  document.documentElement.style.colorScheme = theme.value
  window.localStorage.setItem(THEME_STORAGE_KEY, theme.value)
}

async function handleDrawerNavigation(sectionId) {
  rightDrawerOpen.value = false
  await nextTick()

  window.setTimeout(() => {
    const section = document.getElementById(sectionId)

    if (!section) return

    const scrollTop = section.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET

    window.scrollTo({
      top: Math.max(scrollTop, 0),
      behavior: 'smooth',
    })
  }, 220)
}
</script>
