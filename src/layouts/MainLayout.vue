<template>
  <q-layout view="lHh lpR fFf">
    <SiteHeader @toggle-drawer="rightDrawerOpen = !rightDrawerOpen" />

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
const rightDrawerOpen = ref(false)

const drawerItems = [
  { label: 'Solutions', id: 'solutions' },
  { label: 'Process', id: 'process' },
  { label: 'Contact', id: 'contact' },
]

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
