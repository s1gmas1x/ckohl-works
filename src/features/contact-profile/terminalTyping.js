export const TERMINAL_TYPING_TIMINGS = Object.freeze({
  clause: 150,
  delete: 12,
  gap: 360,
  hold: 2000,
  initial: 420,
  sentence: 260,
  space: 48,
  type: 26,
})

const TYPE_CADENCE_OFFSETS = Object.freeze([-4, 7, 0, 11, -2, 4])

function createInactiveController() {
  let disposed = false
  return Object.freeze({
    dispose() {
      disposed = true
    },
    getState: () => Object.freeze({ active: false, disposed, phase: 'static', started: false }),
    start: () => false,
  })
}

export function createTerminalTypingEffect({ mount, environment = {} }) {
  if (!mount) throw new TypeError('Terminal typing effect requires a mount element.')

  const output = mount.querySelector('[data-terminal-typing-output]')
  const reserve = mount.querySelector('.contact-profile-identity__summary-reserve')
  const typed = mount.querySelector('.contact-profile-identity__summary-typed')
  const phrases = [...mount.querySelectorAll('[data-terminal-typing-phrase]')]
    .map((element) => element.textContent?.trim() || '')
    .filter(Boolean)
    .map((phrase) => Object.freeze([...phrase]))

  if (!output || !reserve || !typed || phrases.length < 2) return createInactiveController()

  const documentTarget = environment.documentTarget ?? globalThis.document
  const IntersectionObserverClass =
    environment.IntersectionObserver ?? globalThis.IntersectionObserver
  const matchMedia = environment.matchMedia ?? globalThis.matchMedia
  const setTimer = environment.setTimeout ?? globalThis.setTimeout
  const clearTimer = environment.clearTimeout ?? globalThis.clearTimeout
  const timings = { ...TERMINAL_TYPING_TIMINGS, ...environment.timings }
  const motionQuery = matchMedia?.('(prefers-reduced-motion: reduce)')
  let active = false
  let characterIndex = 0
  let disposed = false
  let documentVisible = documentTarget?.visibilityState !== 'hidden'
  let intersecting = true
  let phase = 'typing'
  let phraseIndex = 0
  let reducedMotion = motionQuery?.matches ?? false
  let started = false
  let timer

  function clearScheduledTick() {
    if (timer === undefined) return
    clearTimer(timer)
    timer = undefined
  }

  function setState(nextState) {
    mount.dataset.terminalTypingState = nextState
  }

  function deactivate() {
    clearScheduledTick()
    active = false
    characterIndex = 0
    output.textContent = ''
    phase = 'typing'
    phraseIndex = 0
    reserve.hidden = true
    typed.hidden = true
    delete mount.dataset.terminalTypingActive
    setState('static')
  }

  function delayForPhase() {
    if (phase === 'holding') return timings.hold
    if (phase === 'deleting') {
      return timings.delete + TYPE_CADENCE_OFFSETS[characterIndex % TYPE_CADENCE_OFFSETS.length]
    }
    if (phase === 'gap') return timings.gap
    if (characterIndex === 0) return timings.initial

    const typedCharacter = phrases[phraseIndex][characterIndex - 1]
    if (/[.!?]/u.test(typedCharacter)) return timings.sentence
    if (/[,;:]/u.test(typedCharacter)) return timings.clause
    if (/\s/u.test(typedCharacter)) return timings.space

    return (
      timings.type +
      TYPE_CADENCE_OFFSETS[(characterIndex + phraseIndex) % TYPE_CADENCE_OFFSETS.length]
    )
  }

  function scheduleTick(delay = delayForPhase()) {
    if (timer !== undefined || disposed || reducedMotion || !documentVisible || !intersecting) {
      return
    }

    timer = setTimer(tick, delay)
  }

  function tick() {
    timer = undefined
    if (disposed || reducedMotion || !documentVisible || !intersecting) return

    const phrase = phrases[phraseIndex]
    if (phase === 'typing') {
      characterIndex = Math.min(phrase.length, characterIndex + 1)
      output.textContent = phrase.slice(0, characterIndex).join('')
      if (characterIndex === phrase.length) phase = 'holding'
    } else if (phase === 'holding') {
      phase = 'deleting'
    } else if (phase === 'deleting') {
      characterIndex = Math.max(0, characterIndex - 1)
      output.textContent = phrase.slice(0, characterIndex).join('')
      if (characterIndex === 0) {
        phraseIndex = (phraseIndex + 1) % phrases.length
        phase = 'gap'
      }
    } else {
      phase = 'typing'
    }

    setState(phase)
    scheduleTick()
  }

  function sync() {
    if (!started || disposed) return false
    if (reducedMotion) {
      deactivate()
      return false
    }
    if (!documentVisible || !intersecting) {
      clearScheduledTick()
      if (active) setState('paused')
      return false
    }

    if (!active) {
      active = true
      mount.dataset.terminalTypingActive = 'true'
      output.textContent = ''
      reserve.hidden = false
      typed.hidden = false
    }
    setState(phase)
    scheduleTick()
    return true
  }

  function handleVisibilityChange() {
    documentVisible = documentTarget?.visibilityState !== 'hidden'
    sync()
  }

  function handleMotionChange(event) {
    reducedMotion = event.matches
    sync()
  }

  const intersectionObserver = IntersectionObserverClass
    ? new IntersectionObserverClass(
        (entries) => {
          intersecting = entries.at(-1)?.isIntersecting ?? true
          sync()
        },
        { threshold: 0.01 },
      )
    : undefined

  function start() {
    if (started || disposed) return false
    started = true
    intersectionObserver?.observe(mount)
    documentTarget?.addEventListener('visibilitychange', handleVisibilityChange)
    if (motionQuery?.addEventListener) motionQuery.addEventListener('change', handleMotionChange)
    else motionQuery?.addListener?.(handleMotionChange)
    return sync()
  }

  function dispose() {
    if (disposed) return
    disposed = true
    clearScheduledTick()
    intersectionObserver?.disconnect()
    documentTarget?.removeEventListener('visibilitychange', handleVisibilityChange)
    if (motionQuery?.removeEventListener) {
      motionQuery.removeEventListener('change', handleMotionChange)
    } else {
      motionQuery?.removeListener?.(handleMotionChange)
    }
    deactivate()
  }

  function getState() {
    return Object.freeze({
      active,
      characterIndex,
      disposed,
      documentVisible,
      intersecting,
      phase,
      phraseIndex,
      reducedMotion,
      started,
    })
  }

  return Object.freeze({ dispose, getState, start })
}
