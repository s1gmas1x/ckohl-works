const mount = document.querySelector(
  '.contact-profile-display__viewport[data-display-preset="crt-wireframe"]',
)
const displayHostModulePath = mount?.dataset.displayHostModule
const sceneModulePath = mount?.dataset.displaySceneModule

if (mount && displayHostModulePath && sceneModulePath) {
  try {
    const { createCrtDisplayHost } = await import(displayHostModulePath)
    const host = createCrtDisplayHost({
      mount,
      loadScene: () => import(sceneModulePath),
    })

    host.start()
    window.addEventListener('pagehide', (event) => {
      if (!event.persisted) host.dispose()
    })
  } catch {
    // The fallback image remains usable if a generated enhancement asset is unavailable.
    mount.dataset.displayState = 'failed'
  }
}
