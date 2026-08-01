const displayMount = document.querySelector(
  '.contact-profile-display__viewport[data-display-preset="crt-wireframe"]',
)
const typingMount = document.querySelector('[data-terminal-typing]')
const displayHostModulePath = displayMount?.dataset.displayHostModule
const sceneModulePath = displayMount?.dataset.displaySceneModule

if (displayHostModulePath && (typingMount || (displayMount && sceneModulePath))) {
  try {
    const { createCrtDisplayHost, createTerminalTypingEffect } = await import(displayHostModulePath)
    const enhancements = []

    if (typingMount && createTerminalTypingEffect) {
      try {
        const typingEffect = createTerminalTypingEffect({ mount: typingMount })
        typingEffect.start()
        enhancements.push(typingEffect)
      } catch {
        // The semantic summary remains visible if typing cannot start.
      }
    }

    if (displayMount && sceneModulePath && createCrtDisplayHost) {
      try {
        const displayHost = createCrtDisplayHost({
          mount: displayMount,
          loadScene: () => import(sceneModulePath),
        })
        displayHost.start()
        enhancements.push(displayHost)
      } catch {
        displayMount.dataset.displayState = 'failed'
      }
    }

    window.addEventListener('pagehide', (event) => {
      if (!event.persisted) enhancements.forEach((enhancement) => enhancement.dispose())
    })
  } catch {
    // Semantic copy and the fallback image remain usable when enhancement assets are unavailable.
    if (displayMount) displayMount.dataset.displayState = 'failed'
  }
}
