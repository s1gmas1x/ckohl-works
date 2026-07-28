import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import AxeBuilder from '@axe-core/playwright'
import { chromium } from 'playwright'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = join(rootDir, 'dist', 'static-profiles')
const port = Number(process.env.CONTACT_PROFILE_A11Y_PORT || 4174)
const origin = `http://127.0.0.1:${port}`
const axeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
const solidSurfaceStyle = `
  .contact-profile-theme--crt-amber {
    background: var(--crt-color-surface-page) !important;
  }
  .contact-profile-theme--crt-amber .contact-profile-crt-screen {
    background: var(--crt-color-surface-screen) !important;
  }
  .contact-profile-theme--crt-amber .contact-profile-crt-screen::before,
  .contact-profile-theme--crt-amber .contact-profile-crt-screen::after {
    display: none !important;
  }
`

function formatAxeFindings(findings) {
  return findings
    .map(
      (finding) =>
        `${finding.id} (${finding.impact || 'unknown'}): ${finding.nodes
          .map((node) => node.target.join(' '))
          .join(', ')}`,
    )
    .join('\n')
}

async function waitForServer(server) {
  await new Promise((resolveServer, rejectServer) => {
    let output = ''
    const timeout = setTimeout(() => {
      rejectServer(new Error(`Timed out waiting for the profile server.\n${output}`))
    }, 10_000)

    function handleOutput(chunk) {
      output += chunk.toString()
      if (!output.includes('Static profile proof server listening')) return

      clearTimeout(timeout)
      resolveServer()
    }

    server.stdout.on('data', handleOutput)
    server.stderr.on('data', handleOutput)
    server.on('error', (error) => {
      clearTimeout(timeout)
      rejectServer(error)
    })
    server.on('exit', (code) => {
      if (code === null || output.includes('Static profile proof server listening')) return

      clearTimeout(timeout)
      rejectServer(new Error(`Profile server exited with code ${code}.\n${output}`))
    })
  })
}

async function auditAxe(page, label) {
  const structure = await new AxeBuilder({ page })
    .withTags(axeTags)
    .disableRules(['color-contrast'])
    .analyze()

  assert.equal(
    structure.violations.length,
    0,
    `${label} has Axe violations:\n${formatAxeFindings(structure.violations)}`,
  )
  assert.equal(
    structure.incomplete.length,
    0,
    `${label} has incomplete structural Axe checks:\n${formatAxeFindings(structure.incomplete)}`,
  )

  await page.addStyleTag({ content: solidSurfaceStyle })
  const contrast = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()

  assert.equal(
    contrast.violations.length,
    0,
    `${label} has contrast violations:\n${formatAxeFindings(contrast.violations)}`,
  )
  assert.equal(
    contrast.incomplete.length,
    0,
    `${label} has incomplete contrast checks:\n${formatAxeFindings(contrast.incomplete)}`,
  )

  return {
    contrastPasses: contrast.passes[0]?.nodes.length || 0,
    structurePasses: structure.passes.length,
  }
}

async function waitForDisplayReady(page, label) {
  await page.waitForFunction(
    () =>
      document.querySelector('[data-display-preset="crt-wireframe"]')?.dataset.displayState ===
      'ready',
    undefined,
    { timeout: 10_000 },
  )
  assert.equal(
    await page.locator('.contact-profile-display__canvas').count(),
    1,
    `${label} must expose one presentational canvas after the first successful render`,
  )
}

async function auditDocumentContract(page, label) {
  const contract = await page.evaluate(() => {
    const profile = document.querySelector('.contact-profile')
    const titleId = profile?.getAttribute('aria-labelledby')
    const controls = [
      ...document.querySelectorAll(
        '.contact-profile-contact-actions a, .contact-profile-save a, .contact-profile-external-actions a',
      ),
    ]

    return {
      canvasRole: document.querySelector('.contact-profile-display__canvas')?.getAttribute('role'),
      controlNames: controls.map(
        (control) => control.getAttribute('aria-label') || control.textContent.trim(),
      ),
      controlSizes: controls.map((control) => {
        const bounds = control.getBoundingClientRect()
        return { height: bounds.height, width: bounds.width }
      }),
      decorativeDisplayHidden:
        document.querySelector('.contact-profile-display')?.getAttribute('aria-hidden') === 'true',
      decorativeIconsExposed: document.querySelectorAll(
        '.contact-profile-icon:not([aria-hidden="true"])',
      ).length,
      footerHasProhibitedLabel: document.querySelector('footer')?.hasAttribute('aria-label'),
      headerHasProhibitedLabel: document.querySelector('header')?.hasAttribute('aria-label'),
      identityIsNamedRegion: document
        .querySelector('.contact-profile-identity')
        ?.hasAttribute('aria-labelledby'),
      mainCount: document.querySelectorAll('main').length,
      horizontalOverflow:
        document.documentElement.scrollWidth > document.documentElement.clientWidth,
      titleCount: document.querySelectorAll('h1').length,
      titleExists: Boolean(titleId && document.getElementById(titleId)),
      viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
    }
  })

  assert.equal(contract.mainCount, 1, `${label} must expose exactly one main landmark`)
  assert.equal(contract.titleCount, 1, `${label} must expose exactly one h1`)
  assert.equal(contract.titleExists, true, `${label} profile label must resolve to its h1`)
  assert.equal(
    contract.identityIsNamedRegion,
    false,
    `${label} must not duplicate the profile region`,
  )
  assert.equal(contract.headerHasProhibitedLabel, false, `${label} header must not use aria-label`)
  assert.equal(contract.footerHasProhibitedLabel, false, `${label} footer must not use aria-label`)
  assert.equal(contract.decorativeDisplayHidden, true, `${label} display must stay decorative`)
  assert.equal(contract.decorativeIconsExposed, 0, `${label} icons must stay decorative`)
  assert.equal(contract.canvasRole, 'presentation', `${label} canvas must be presentational`)
  assert.equal(contract.horizontalOverflow, false, `${label} must not overflow horizontally`)
  assert.ok(contract.controlNames.length >= 6, `${label} must expose all configured actions`)
  assert.ok(
    contract.controlNames.every(Boolean),
    `${label} must give every contact action an accessible name`,
  )
  assert.ok(
    contract.controlSizes.every(({ height, width }) => height >= 44 && width >= 44),
    `${label} must keep every contact action at least 44 by 44 CSS pixels`,
  )
  assert.doesNotMatch(
    contract.viewport,
    /user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i,
    `${label} must not disable browser zoom`,
  )

  return contract
}

async function auditAccessibilityTree(page, expectedControlNames, label) {
  const session = await page.context().newCDPSession(page)
  const { nodes } = await session.send('Accessibility.getFullAXTree')
  await session.detach()

  const exposedNodes = nodes
    .filter((node) => !node.ignored)
    .map((node) => ({
      name: node.name?.value || '',
      role: node.role?.value || '',
    }))
  const linkNames = exposedNodes.filter(({ role }) => role === 'link').map(({ name }) => name)

  assert.ok(
    exposedNodes.some(({ name, role }) => role === 'heading' && name),
    `${label} accessibility tree must expose the profile heading`,
  )
  assert.deepEqual(
    linkNames,
    expectedControlNames,
    `${label} accessibility tree must expose each action once and in source order`,
  )
  assert.equal(
    exposedNodes.some(({ name }) => name.includes('INITIALIZING DISPLAY')),
    false,
    `${label} accessibility tree must exclude decorative display status`,
  )
}

async function auditKeyboard(page, label) {
  await page.evaluate(() => document.activeElement?.blur())
  const expectedControls = await page.locator('.contact-profile a').count()
  const focusOrder = []

  for (let index = 0; index < expectedControls; index += 1) {
    await page.keyboard.press('Tab')
    focusOrder.push(
      await page.evaluate(() => {
        const activeElement = document.activeElement
        const style = getComputedStyle(activeElement)

        return {
          href: activeElement?.getAttribute('href'),
          name: activeElement?.getAttribute('aria-label') || activeElement?.textContent.trim(),
          outlineStyle: style.outlineStyle,
          outlineWidth: style.outlineWidth,
        }
      }),
    )
  }

  assert.ok(
    focusOrder.every(
      ({ href, name, outlineStyle, outlineWidth }) =>
        href && name && outlineStyle !== 'none' && Number.parseFloat(outlineWidth) >= 3,
    ),
    `${label} must expose each action in document order with a visible focus outline`,
  )

  await page.locator('.contact-profile a').first().focus()
  await page.evaluate(() => {
    window.__contactProfilePreventedKeys = []
    document.addEventListener(
      'keydown',
      (event) => {
        if (['ArrowRight', 'Home', 'End'].includes(event.key)) {
          window.__contactProfilePreventedKeys.push({
            defaultPrevented: event.defaultPrevented,
            key: event.key,
          })
        }
      },
      { once: false },
    )
  })
  for (const key of ['ArrowRight', 'Home', 'End']) await page.keyboard.press(key)

  const keyboardResult = await page.evaluate(() => ({
    activeHref: document.activeElement?.getAttribute('href'),
    firstHref: document.querySelector('.contact-profile a')?.getAttribute('href'),
    preventedKeys: window.__contactProfilePreventedKeys,
  }))
  assert.equal(
    keyboardResult.activeHref,
    keyboardResult.firstHref,
    `${label} arrow/Home/End keys must not create custom anchor focus behavior`,
  )
  assert.ok(
    keyboardResult.preventedKeys.every(({ defaultPrevented }) => !defaultPrevented),
    `${label} arrow/Home/End keys must retain native browser behavior`,
  )

  return focusOrder.map(({ name }) => name)
}

async function auditReflow(page, label) {
  await page.addStyleTag({
    content: `
      .contact-profile {
        line-height: 1.5 !important;
        letter-spacing: 0.12em !important;
        word-spacing: 0.16em !important;
      }
      .contact-profile p {
        margin-block: 2em !important;
      }
    `,
  })
  await page.evaluate(() => {
    document.querySelector('.contact-profile-identity h1').textContent =
      'Alexandria-Cassandra Extremely-Long-Contact-Profile-Name'
    document.querySelector('.contact-profile-identity__role').textContent =
      'Principal multilingual digital contact systems architect'
    document.querySelector('.contact-profile-identity__organization').textContent =
      'A deliberately long organization name for reflow verification'
    document.querySelector('.contact-profile-identity__summary').textContent =
      'Extended text spacing and long content must wrap without clipping, overlap, or two-dimensional scrolling at the narrowest supported layout.'
  })

  const result = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  assert.ok(
    result.scrollWidth <= result.clientWidth,
    `${label} long content and text spacing must reflow without horizontal scrolling`,
  )
}

async function auditReducedMotion(browser, path, label) {
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { height: 720, width: 320 },
  })
  const page = await context.newPage()
  const sceneRequests = []
  page.on('request', (request) => {
    if (request.url().includes('createCrtWireframeScene')) sceneRequests.push(request.url())
  })
  await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' })

  const result = await page.evaluate(() => {
    const viewport = document.querySelector('[data-display-preset="crt-wireframe"]')
    return {
      canvasCount: viewport?.querySelectorAll('canvas').length,
      state: viewport?.dataset.displayState,
      transitionDuration: getComputedStyle(
        document.querySelector('.contact-profile-display__canvas') || viewport,
      ).transitionDuration,
    }
  })

  assert.equal(result.state, 'reduced-motion', `${label} must use static reduced-motion mode`)
  assert.equal(result.canvasCount, 0, `${label} must skip the WebGL canvas under reduced motion`)
  assert.equal(sceneRequests.length, 0, `${label} must not request Three.js under reduced motion`)
  assert.ok(
    result.transitionDuration === '0s' || result.transitionDuration === '',
    `${label} must not crossfade under reduced motion`,
  )
  await context.close()
}

async function auditForcedColors(browser, path, label) {
  const context = await browser.newContext({
    forcedColors: 'active',
    viewport: { height: 720, width: 320 },
  })
  const page = await context.newPage()
  await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' })
  await page.locator('.contact-profile a').first().focus()

  const result = await page.evaluate(() => {
    const screen = document.querySelector('.contact-profile-crt-screen')
    const focusStyle = getComputedStyle(document.activeElement)

    return {
      afterDisplay: getComputedStyle(screen, '::after').display,
      beforeDisplay: getComputedStyle(screen, '::before').display,
      boxShadow: getComputedStyle(screen).boxShadow,
      outlineStyle: focusStyle.outlineStyle,
      outlineWidth: focusStyle.outlineWidth,
    }
  })

  assert.equal(result.beforeDisplay, 'none', `${label} must remove scanlines in forced colors`)
  assert.equal(result.afterDisplay, 'none', `${label} must remove the vignette in forced colors`)
  assert.equal(result.boxShadow, 'none', `${label} must remove CRT shadow in forced colors`)
  assert.notEqual(result.outlineStyle, 'none', `${label} must preserve forced-colors focus`)
  assert.ok(
    Number.parseFloat(result.outlineWidth) >= 3,
    `${label} must preserve a three-pixel forced-colors focus indicator`,
  )
  await context.close()
}

async function auditNoJavaScriptBaseline(browser) {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { height: 720, width: 320 },
  })
  const page = await context.newPage()
  await page.goto(`${origin}/card/ckohl-works/chad/`, { waitUntil: 'networkidle' })
  const result = await page.evaluate(() => ({
    actionCount: document.querySelectorAll('.contact-profile a').length,
    fallbackComplete: document.querySelector('.contact-profile-display__fallback img')?.complete,
    title: document.querySelector('h1')?.textContent.trim(),
  }))

  assert.equal(result.title, 'Chad Kohl', 'canonical no-JavaScript baseline must retain identity')
  assert.ok(result.actionCount >= 7, 'canonical no-JavaScript baseline must retain contact actions')
  assert.equal(
    result.fallbackComplete,
    true,
    'canonical no-JavaScript baseline must retain fallback',
  )
  await context.close()
}

async function auditWithoutCss(browser, path, label) {
  const context = await browser.newContext({
    viewport: { height: 720, width: 320 },
  })
  const page = await context.newPage()
  await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.contact-profile')
  await page.evaluate(() => {
    for (const node of document.querySelectorAll('link[rel="stylesheet"], style')) node.remove()
  })

  const result = await page.evaluate(() => ({
    actions: [...document.querySelectorAll('.contact-profile a')].map((action) => ({
      href: action.getAttribute('href'),
      name: action.getAttribute('aria-label') || action.textContent.trim(),
    })),
    title: document.querySelector('h1')?.textContent.trim(),
  }))

  assert.ok(result.title, `${label} must retain profile identity without CSS`)
  assert.ok(result.actions.length >= 6, `${label} must retain configured actions without CSS`)
  assert.ok(
    result.actions.every(({ href, name }) => href && name),
    `${label} actions must remain understandable and functional without CSS`,
  )
  await context.close()
}

async function auditLandscape(browser, path, label) {
  const context = await browser.newContext({
    viewport: { height: 390, width: 844 },
  })
  const page = await context.newPage()
  await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.contact-profile')
  await waitForDisplayReady(page, label)

  const result = await page.evaluate(() => ({
    controlsMeetTarget: [...document.querySelectorAll('.contact-profile a')].every((control) => {
      const bounds = control.getBoundingClientRect()
      return bounds.height >= 44 && bounds.width >= 44
    }),
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }))

  assert.equal(result.horizontalOverflow, false, `${label} must not overflow horizontally`)
  assert.equal(result.controlsMeetTarget, true, `${label} must retain 44-pixel touch targets`)
  await context.close()
}

if (!existsSync(join(outputDir, 'static-profile-manifest.json'))) {
  throw new Error('Run npm run build:profiles before the accessibility audit.')
}

const server = spawn(process.execPath, ['scripts/serve-static-profiles.mjs'], {
  cwd: rootDir,
  env: {
    ...process.env,
    PORT: String(port),
    STATIC_PROFILE_DIR: outputDir,
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let browser
try {
  await waitForServer(server)
  browser = await chromium.launch({ headless: true })
  const profiles = ['chad', 'pikes-peak-handyman']
  const renderers = [
    {
      key: 'canonical',
      path: (profile) => `/card/ckohl-works/${profile}/`,
    },
    {
      key: 'app',
      path: (profile) => `/#/card/ckohl-works/${profile}`,
    },
  ]
  const report = []

  for (const renderer of renderers) {
    for (const profile of profiles) {
      const label = `${renderer.key}/${profile}/mobile`
      const context = await browser.newContext({
        viewport: { height: 720, width: 320 },
      })
      const page = await context.newPage()
      const pageErrors = []
      page.on('pageerror', (error) => pageErrors.push(error.message))
      await page.goto(`${origin}${renderer.path(profile)}`, { waitUntil: 'networkidle' })
      await page.waitForSelector('.contact-profile')
      await waitForDisplayReady(page, label)

      const axe = await auditAxe(page, label)
      const contract = await auditDocumentContract(page, label)
      await auditAccessibilityTree(page, contract.controlNames, label)
      const focusOrder = await auditKeyboard(page, label)
      if (profile === 'chad') await auditReflow(page, label)
      assert.deepEqual(pageErrors, [], `${label} must not raise browser errors`)
      report.push({
        axe,
        controls: contract.controlNames.length,
        focusOrder,
        label,
      })
      await context.close()
    }

    const desktopLabel = `${renderer.key}/chad/desktop`
    const desktopContext = await browser.newContext({
      viewport: { height: 900, width: 1440 },
    })
    const desktopPage = await desktopContext.newPage()
    await desktopPage.goto(`${origin}${renderer.path('chad')}`, { waitUntil: 'networkidle' })
    await waitForDisplayReady(desktopPage, desktopLabel)
    const desktopAxe = await auditAxe(desktopPage, desktopLabel)
    const desktopContract = await auditDocumentContract(desktopPage, desktopLabel)
    await auditAccessibilityTree(desktopPage, desktopContract.controlNames, desktopLabel)
    report.push({
      axe: desktopAxe,
      contract: desktopContract,
      label: desktopLabel,
    })
    await desktopContext.close()

    await auditReducedMotion(browser, renderer.path('chad'), `${renderer.key}/reduced-motion`)
    await auditForcedColors(browser, renderer.path('chad'), `${renderer.key}/forced-colors`)
    await auditWithoutCss(browser, renderer.path('chad'), `${renderer.key}/no-css`)
    await auditLandscape(browser, renderer.path('chad'), `${renderer.key}/landscape`)
  }

  await auditNoJavaScriptBaseline(browser)
  console.log(JSON.stringify({ passes: true, scenarios: report }, null, 2))
} finally {
  await browser?.close()
  server.kill('SIGTERM')
}
