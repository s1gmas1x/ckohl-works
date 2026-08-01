import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  CONTACT_PROFILE_SUMMARY_VARIANT_LIMIT,
  CONTACT_PROFILE_SUMMARY_VARIANT_MAX_LENGTH,
  normalizeContactProfile,
} from '../src/data/contactProfileContract.js'
import { chadProfile } from '../src/data/profileFixtures.js'
import { publishedProfiles } from '../src/data/publishedProfiles.js'
import {
  createTerminalTypingEffect,
  TERMINAL_TYPING_TIMINGS,
} from '../src/features/contact-profile/terminalTyping.js'
import { renderProfileDocument } from '../scripts/static-profile-renderer.mjs'

const componentSource = await readFile(
  new URL('../src/components/profile/ContactProfileIdentityPanel.vue', import.meta.url),
  'utf8',
)
const layoutSource = await readFile(
  new URL('../src/css/_contact-profile-layout.scss', import.meta.url),
  'utf8',
)
const staticEnhancementSource = await readFile(
  new URL('../public/contact-profile/crt-wireframe-static-enhancement.js', import.meta.url),
  'utf8',
)
const staticHostSource = await readFile(
  new URL('../src/features/contact-profile/crt-wireframe/staticDisplayHost.js', import.meta.url),
  'utf8',
)

function createEventTarget(initial = {}) {
  const listeners = new Map()
  return {
    ...initial,
    addEventListener(type, listener) {
      const registered = listeners.get(type) ?? new Set()
      registered.add(listener)
      listeners.set(type, registered)
    },
    emit(type, event = {}) {
      for (const listener of listeners.get(type) ?? []) listener(event)
    },
    listenerCount(type) {
      return listeners.get(type)?.size ?? 0
    },
    removeEventListener(type, listener) {
      listeners.get(type)?.delete(listener)
    },
  }
}

function createTypingHarness({
  phrases = ['Hi, there.', 'Next line.'],
  reducedMotion = false,
} = {}) {
  const output = { textContent: '' }
  const reserve = { hidden: true }
  const typed = { hidden: true }
  const phraseElements = phrases.map((textContent) => ({ textContent }))
  const mount = {
    dataset: {},
    querySelector(selector) {
      if (selector === '[data-terminal-typing-output]') return output
      if (selector === '.contact-profile-identity__summary-reserve') return reserve
      if (selector === '.contact-profile-identity__summary-typed') return typed
      return undefined
    },
    querySelectorAll(selector) {
      return selector === '[data-terminal-typing-phrase]' ? phraseElements : []
    },
  }
  const documentTarget = createEventTarget({ visibilityState: 'visible' })
  const motionQuery = createEventTarget({ matches: reducedMotion })
  const scheduled = new Map()
  let nextTimerId = 1
  let observer

  class FakeIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback
      this.options = options
      observer = this
    }

    disconnect() {
      this.disconnected = true
    }

    observe(element) {
      this.observed = element
    }
  }

  const effect = createTerminalTypingEffect({
    mount,
    environment: {
      IntersectionObserver: FakeIntersectionObserver,
      clearTimeout(id) {
        scheduled.delete(id)
      },
      documentTarget,
      matchMedia: () => motionQuery,
      setTimeout(callback, delay) {
        const id = nextTimerId
        nextTimerId += 1
        scheduled.set(id, { callback, delay })
        return id
      },
    },
  })

  return {
    documentTarget,
    effect,
    mount,
    motionQuery,
    observer: () => observer,
    output,
    pendingDelay() {
      return [...scheduled.values()][0]?.delay
    },
    pendingTimers() {
      return scheduled.size
    },
    reserve,
    runNext() {
      const [id, entry] = [...scheduled.entries()][0] ?? []
      assert.ok(entry, 'Expected a scheduled typing step.')
      scheduled.delete(id)
      entry.callback()
    },
    typed,
  }
}

function cloneChadProfile() {
  return structuredClone(chadProfile)
}

test('validates a small reviewed set of console summary variants', () => {
  const chad = publishedProfiles.find((profile) => profile.slug === 'chad')
  assert.equal(chad.identity.summaryVariants.length, 4)
  assert.ok(Object.isFrozen(chad.identity.summaryVariants))
  assert.equal(CONTACT_PROFILE_SUMMARY_VARIANT_LIMIT, 5)
  assert.equal(CONTACT_PROFILE_SUMMARY_VARIANT_MAX_LENGTH, 180)

  for (const invalidVariants of [[], 'not-an-array']) {
    const profile = cloneChadProfile()
    profile.identity.summaryVariants = invalidVariants
    assert.throws(() => normalizeContactProfile(profile), /identity\.summaryVariants/)
  }

  const duplicate = cloneChadProfile()
  duplicate.identity.summaryVariants = [duplicate.identity.summary]
  assert.throws(() => normalizeContactProfile(duplicate), /must not contain duplicate entries/)

  const tooMany = cloneChadProfile()
  tooMany.identity.summaryVariants = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']
  assert.throws(() => normalizeContactProfile(tooMany), /between 1 and 5 entries/)

  const tooLong = cloneChadProfile()
  tooLong.identity.summaryVariants = ['x'.repeat(181)]
  assert.throws(() => normalizeContactProfile(tooLong), /no more than 180 characters/)
})

test('types with terminal cadence, pauses at punctuation, and backspaces', () => {
  const harness = createTypingHarness()

  assert.equal(harness.effect.start(), true)
  assert.equal(harness.mount.dataset.terminalTypingActive, 'true')
  assert.equal(harness.mount.dataset.terminalTypingState, 'typing')
  assert.equal(harness.reserve.hidden, false)
  assert.equal(harness.typed.hidden, false)
  assert.equal(harness.pendingDelay(), TERMINAL_TYPING_TIMINGS.initial)

  harness.runNext()
  assert.equal(harness.output.textContent, 'H')
  assert.notEqual(harness.pendingDelay(), TERMINAL_TYPING_TIMINGS.type)
  harness.runNext()
  harness.runNext()
  assert.equal(harness.output.textContent, 'Hi,')
  assert.equal(harness.pendingDelay(), TERMINAL_TYPING_TIMINGS.clause)
  harness.runNext()
  assert.equal(harness.output.textContent, 'Hi, ')
  assert.equal(harness.pendingDelay(), TERMINAL_TYPING_TIMINGS.space)

  while (harness.output.textContent !== 'Hi, there.') harness.runNext()
  assert.equal(harness.mount.dataset.terminalTypingState, 'holding')
  assert.equal(harness.pendingDelay(), TERMINAL_TYPING_TIMINGS.hold)
  harness.runNext()
  assert.equal(harness.mount.dataset.terminalTypingState, 'deleting')
  harness.runNext()
  assert.equal(harness.output.textContent, 'Hi, there')
})

test('pauses off screen, honors reduced motion, and cleans up lifecycle work', () => {
  const harness = createTypingHarness()
  harness.effect.start()

  harness.documentTarget.visibilityState = 'hidden'
  harness.documentTarget.emit('visibilitychange')
  assert.equal(harness.pendingTimers(), 0)
  assert.equal(harness.mount.dataset.terminalTypingState, 'paused')

  harness.documentTarget.visibilityState = 'visible'
  harness.documentTarget.emit('visibilitychange')
  assert.equal(harness.pendingTimers(), 1)
  harness.observer().callback([{ isIntersecting: false }])
  assert.equal(harness.pendingTimers(), 0)
  assert.equal(harness.mount.dataset.terminalTypingState, 'paused')
  harness.observer().callback([{ isIntersecting: true }])
  assert.equal(harness.pendingTimers(), 1)

  harness.motionQuery.matches = true
  harness.motionQuery.emit('change', { matches: true })
  assert.equal(harness.pendingTimers(), 0)
  assert.equal(harness.mount.dataset.terminalTypingActive, undefined)
  assert.equal(harness.reserve.hidden, true)
  assert.equal(harness.typed.hidden, true)

  harness.motionQuery.matches = false
  harness.motionQuery.emit('change', { matches: false })
  assert.equal(harness.mount.dataset.terminalTypingActive, 'true')
  assert.equal(harness.effect.getState().characterIndex, 0)
  assert.equal(harness.effect.getState().phraseIndex, 0)

  harness.effect.dispose()
  assert.equal(harness.observer().disconnected, true)
  assert.equal(harness.documentTarget.listenerCount('visibilitychange'), 0)
  assert.equal(harness.motionQuery.listenerCount('change'), 0)
  assert.equal(harness.effect.getState().disposed, true)
})

test('does not activate animated copy when reduced motion is already requested', () => {
  const harness = createTypingHarness({ reducedMotion: true })

  assert.equal(harness.effect.start(), false)
  assert.equal(harness.mount.dataset.terminalTypingActive, undefined)
  assert.equal(harness.pendingTimers(), 0)
  assert.equal(harness.reserve.hidden, true)
  assert.equal(harness.typed.hidden, true)
})

test('keeps semantic and generated typing markup aligned across both renderers', () => {
  const chad = publishedProfiles.find((profile) => profile.slug === 'chad')
  const handyman = publishedProfiles.find((profile) => profile.slug === 'pikes-peak-handyman')
  const chadDocument = renderProfileDocument(chad, 'typing-test')
  const handymanDocument = renderProfileDocument(handyman, 'typing-test')

  assert.match(componentSource, /data-terminal-typing/)
  assert.match(componentSource, /contact-profile-identity__summary-semantic/)
  assert.match(componentSource, /aria-hidden="true" hidden/)
  assert.match(chadDocument, /data-terminal-typing/)
  assert.match(chadDocument, /contact-profile-identity__summary-semantic/)
  assert.match(chadDocument, /data-terminal-typing-output/)
  assert.equal(chadDocument.match(/data-terminal-typing-phrase/g)?.length, 5)
  assert.doesNotMatch(
    handymanDocument,
    /<p class="contact-profile-identity__summary" data-terminal-typing>/,
  )
  assert.match(layoutSource, /@keyframes contact-profile-terminal-cursor/)
  assert.match(layoutSource, /data-terminal-typing-state='paused'/)
  assert.match(layoutSource, /grid-area: 1 \/ 1/)
  assert.match(staticHostSource, /createTerminalTypingEffect/)
  assert.match(staticEnhancementSource, /createTerminalTypingEffect/)
})
