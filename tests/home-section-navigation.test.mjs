import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  navigateToSection,
  SECTION_NAVIGATION_SCROLL_OFFSET,
} from '../src/composables/useSectionNavigation.js'

const indexPageSource = await readFile(
  new URL('../src/pages/IndexPage.vue', import.meta.url),
  'utf8',
)
const offerSource = await readFile(
  new URL('../src/components/sections/ManagedContactPageOfferSection.vue', import.meta.url),
  'utf8',
)
const sectionNavigationSources = await Promise.all(
  [
    '../src/components/layout/SiteFooter.vue',
    '../src/components/layout/SiteHeader.vue',
    '../src/components/sections/HeroSection.vue',
    '../src/components/sections/NfcQrSection.vue',
    '../src/components/ui/SolutionCard.vue',
    '../src/layouts/MainLayout.vue',
    '../src/pages/MargotsPizzaPage.vue',
  ].map((path) => readFile(new URL(path, import.meta.url), 'utf8')),
)

function createNavigationHarness({ currentPath = '/', sectionTop = 300, targetPath = '/' } = {}) {
  const calls = []
  const route = { path: currentPath }
  const router = {
    async push(path) {
      calls.push(['push', path])
      route.path = path
    },
  }
  const documentTarget = {
    getElementById(id) {
      calls.push(['getElementById', id])
      return id === 'contact' ? { getBoundingClientRect: () => ({ top: sectionTop }) } : undefined
    },
  }
  const windowTarget = {
    scrollY: 80,
    scrollTo(options) {
      calls.push(['scrollTo', options])
    },
  }

  return {
    calls,
    documentTarget,
    nextTickFn: async () => calls.push(['nextTick']),
    route,
    router,
    targetPath,
    windowTarget,
  }
}

test('scrolls to a home section without creating a hash-router route', async () => {
  const harness = createNavigationHarness()

  const navigated = await navigateToSection('contact', harness)

  assert.equal(navigated, true)
  assert.deepEqual(harness.calls, [
    ['nextTick'],
    ['getElementById', 'contact'],
    [
      'scrollTo',
      {
        behavior: 'smooth',
        top: 300 + 80 - SECTION_NAVIGATION_SCROLL_OFFSET,
      },
    ],
  ])
})

test('returns to the target route before scrolling to its section', async () => {
  const harness = createNavigationHarness({ currentPath: '/margots-pizza' })

  const navigated = await navigateToSection('contact', harness)

  assert.equal(navigated, true)
  assert.deepEqual(harness.calls.slice(0, 3), [
    ['push', '/'],
    ['nextTick'],
    ['getElementById', 'contact'],
  ])
})

test('retains an ordinary root-page fallback while removing broken raw hash anchors', () => {
  for (const source of sectionNavigationSources) {
    assert.match(source, /useSectionNavigation/)
    assert.doesNotMatch(source, /href="#/)
  }
})

test('places the managed offer before broader solutions and states the reviewed price', () => {
  assert.ok(
    indexPageSource.indexOf('<ManagedContactPageOfferSection') <
      indexPageSource.indexOf('<FeaturedSolutions'),
  )
  assert.match(offerSource, /\$349/)
  assert.match(offerSource, /\$29/)
  assert.match(offerSource, /\$697 for the first year/)
  assert.match(offerSource, /five business days/)
})
