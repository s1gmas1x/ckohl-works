import { createCrtDisplayHost } from './displayHost.js'

const mount = document.querySelector(
  '.contact-profile-display__viewport[data-display-preset="crt-wireframe"]',
)

if (mount) {
  const host = createCrtDisplayHost({
    mount,
    loadScene: () => import('./createCrtWireframeScene.js'),
  })

  host.start()
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted) host.dispose()
  })
}
