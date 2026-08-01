import { computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const SECTION_NAVIGATION_SCROLL_OFFSET = 92

export async function navigateToSection(
  sectionId,
  {
    documentTarget = document,
    nextTickFn = nextTick,
    route,
    router,
    scrollOffset = SECTION_NAVIGATION_SCROLL_OFFSET,
    targetPath,
    windowTarget = window,
  },
) {
  if (route.path !== targetPath) await router.push(targetPath)
  await nextTickFn()

  const section = documentTarget.getElementById(sectionId)
  if (!section) return false

  const scrollTop = section.getBoundingClientRect().top + windowTarget.scrollY - scrollOffset
  windowTarget.scrollTo({
    top: Math.max(scrollTop, 0),
    behavior: 'smooth',
  })

  return true
}

export function useSectionNavigation(targetPath = '/') {
  const route = useRoute()
  const router = useRouter()
  const sectionHref = computed(() => router.resolve({ path: targetPath }).href)

  function scrollToSection(sectionId) {
    return navigateToSection(sectionId, { route, router, targetPath })
  }

  return { sectionHref, scrollToSection }
}
