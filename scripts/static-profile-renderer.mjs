import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  getActionHref,
  getProfileActionsByGroup,
  PROFILE_SCHEMA_VERSION,
  publishedProfiles,
} from '../src/data/publishedProfiles.js'
import {
  CONTACT_PROFILE_THEME_CONTRACT_VERSION,
  resolveContactProfileTheme,
} from '../src/data/contactProfileThemes.js'
import { selectProfiles } from './profile-selection.mjs'

const shareTechMonoWoff2 = await readFile(
  new URL(
    '../node_modules/@fontsource/share-tech-mono/files/share-tech-mono-latin-400-normal.woff2',
    import.meta.url,
  ),
)
const shareTechMonoDataUrl = `data:font/woff2;base64,${shareTechMonoWoff2.toString('base64')}`
const contactProfileThemeStyle = await readFile(
  new URL('../src/css/_contact-profile-crt.scss', import.meta.url),
  'utf8',
)
const contactProfileLayoutStyle = await readFile(
  new URL('../src/css/_contact-profile-layout.scss', import.meta.url),
  'utf8',
)

const staticProfileStyle = `
@font-face { font-family:'Share Tech Mono'; font-style:normal; font-weight:400; font-display:swap; src:url(${shareTechMonoDataUrl}) format('woff2'); }
:root { color-scheme:dark; }
* { box-sizing: border-box; }
body { min-width:320px; margin:0; background:#000; color:#fff; font-family:ui-monospace,'Cascadia Code','SFMono-Regular',Consolas,monospace; }
main { width: 100%; min-height: 100vh; }
${contactProfileThemeStyle}
${contactProfileLayoutStyle}
`

const staticProfileKeyboardScript = `
  const actionLinks = Array.from(document.querySelectorAll('.contact-profile-contact-actions a, .contact-profile-save a'));
  async function copyEmail(value) {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(value);
    return true;
  }
  function focusAction(index) {
    const wrappedIndex = (index + actionLinks.length) % actionLinks.length;
    actionLinks[wrappedIndex]?.focus();
  }
  actionLinks.forEach((link, index) => {
    link.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp' || event.key === 'Up') {
        event.preventDefault();
        focusAction(index - 1);
      }
      if (event.key === 'ArrowDown' || event.key === 'Down') {
        event.preventDefault();
        focusAction(index + 1);
      }
      if (event.key === 'ArrowLeft' || event.key === 'Left') {
        event.preventDefault();
        focusAction(index - 1);
      }
      if (event.key === 'ArrowRight' || event.key === 'Right') {
        event.preventDefault();
        focusAction(index + 1);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        focusAction(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        focusAction(actionLinks.length - 1);
      }
    });
  });
  document.querySelectorAll('[data-copy-email]').forEach((link) => {
    link.addEventListener('click', async () => {
      try {
        if (!await copyEmail(link.dataset.copyEmail)) return;
        const type = link.querySelector('.contact-profile-action-tile__type');
        const originalType = type.textContent;
        type.textContent = 'COPIED';
        window.setTimeout(() => { type.textContent = originalType; }, 2200);
      } catch {
        // The mailto link remains usable when clipboard access is unavailable.
      }
    });
  });
`

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(',')}}`
  }

  return JSON.stringify(value)
}

export function contentHash(value) {
  return createHash('sha256').update(canonicalJson(value)).digest('hex')
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function actionGlyph(action) {
  if (action.type === 'call') return '☎'
  if (action.type === 'sms') return '▣'
  if (action.type === 'email') return '✉'
  if (action.type === 'location') return '⌖'
  if (action.type === 'social') return action.platform === 'GitHub' ? '&lt;/&gt;' : '◇'

  return '◎'
}

function contactActionMarkup(action, index, publicBase) {
  const href = escapeHtml(getActionHref(action, publicBase))
  const copyEmail = action.type === 'email' ? ` data-copy-email="${escapeHtml(action.value)}"` : ''
  const className = `contact-profile-action-tile contact-profile-crt-control${action.isPrimary ? ' contact-profile-crt-control--primary' : ''}`

  const typeLabel = action.type === 'email' ? 'EMAIL' : action.typeLabel

  return `<a class="${className}" href="${href}" aria-label="${escapeHtml(action.label)}"${copyEmail}><span class="contact-profile-action-tile__index" aria-hidden="true">[${String(index + 1).padStart(2, '0')}]</span><span class="contact-profile-action-tile__icon" aria-hidden="true">${actionGlyph(action)}</span><span class="contact-profile-action-tile__type" aria-hidden="true">${typeLabel}</span><span class="contact-profile-action-tile__label">${escapeHtml(action.label)}</span></a>`
}

function saveActionMarkup(action, publicBase) {
  const href = escapeHtml(getActionHref(action, publicBase))
  const download = action.download ? ` download="${escapeHtml(action.download)}"` : ''

  return `<a class="contact-profile-save__link contact-profile-crt-control contact-profile-crt-control--primary" href="${href}"${download} aria-label="${escapeHtml(action.label)}"><span class="contact-profile-save__icon" aria-hidden="true">⇩</span><span class="contact-profile-save__copy"><span class="contact-profile-save__title">${escapeHtml(action.label)}</span><span class="contact-profile-save__subtitle">Add to your address book</span></span><span class="contact-profile-save__arrow" aria-hidden="true">›</span></a>`
}

function externalActionMarkup(action, publicBase) {
  const accessibleName =
    action.type === 'location'
      ? `${action.label}: ${action.displayValue} (opens in new tab)`
      : `${action.label} (opens in new tab)`

  return `<a class="contact-profile-external-action contact-profile-crt-control" href="${escapeHtml(getActionHref(action, publicBase))}" aria-label="${escapeHtml(accessibleName)}" target="_blank" rel="noopener noreferrer"><span class="contact-profile-external-action__icon" aria-hidden="true">${actionGlyph(action)}</span><span>${escapeHtml(action.label)}</span><span class="contact-profile-external-action__arrow" aria-hidden="true">›</span></a>`
}

function statusMarkup(item) {
  return `<div><dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.value)}</dd></div>`
}

function footerMarkup(item) {
  return `<span><span class="contact-profile-footer__label">${escapeHtml(item.label)}</span><span class="contact-profile-footer__value">${escapeHtml(item.value)}</span></span>`
}

export function renderProfileDocument(profile, buildRevision, publicBase = '/') {
  const theme = resolveContactProfileTheme(profile.themeKey)
  const hash = contentHash(profile)
  const title = `${profile.identity.name} | ${profile.identity.organization}`
  const contactActions = getProfileActionsByGroup(profile, 'contact')
  const saveActions = getProfileActionsByGroup(profile, 'save')
  const saveAction = saveActions[0]
  const externalActions = getProfileActionsByGroup(profile, 'external')
  const emailAction = profile.actions.find((action) => action.type === 'email')
  const callAction = profile.actions.find((action) => action.type === 'call')
  const websiteAction = profile.actions.find((action) => action.type === 'website')
  const socialActions = profile.actions.filter((action) => action.type === 'social')
  const locationAction = profile.actions.find((action) => action.type === 'location')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.identity.name,
    jobTitle: profile.identity.role,
    worksFor: { '@type': 'Organization', name: profile.identity.organization },
    description: profile.identity.summary,
    email: emailAction?.value,
    telephone: callAction?.value,
    url: websiteAction?.value,
    sameAs: socialActions.length > 0 ? socialActions.map((action) => action.value) : undefined,
    address: locationAction?.displayValue,
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(profile.identity.summary)}">
    <meta name="profile-schema-version" content="${PROFILE_SCHEMA_VERSION}">
    <meta name="profile-theme-key" content="${escapeHtml(theme.key)}">
    <meta name="profile-theme-contract-version" content="${theme.contractVersion}">
    <meta name="profile-content-hash" content="${hash}">
    <meta name="build-revision" content="${escapeHtml(buildRevision)}">
    <title>${escapeHtml(title)}</title>
    <style>${staticProfileStyle}</style>
    <script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>
  </head>
  <body>
    <main>
      <section class="contact-profile ${escapeHtml(theme.className)}" data-contact-profile-theme="${escapeHtml(theme.key)}" data-contact-profile-theme-contract="${theme.contractVersion}" aria-labelledby="profile-title">
        <div class="contact-profile__screen contact-profile-crt-screen">
          <header class="contact-profile-header contact-profile-panel" aria-label="Contact profile header">
            <span class="contact-profile-header__brand">
              <span class="contact-profile-header__mark" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></span>
              <span>CK-CONTACT // TERMINAL 01</span>
            </span>
            <span class="contact-profile-header__state"><span class="contact-profile-header__state-dot" aria-hidden="true"></span>PROFILE READY</span>
          </header>
          <div class="contact-profile-layout">
            <section class="contact-profile-identity contact-profile-panel" aria-labelledby="profile-title">
              <p class="contact-profile-identity__eyebrow">Profile // ${escapeHtml(profile.slug)}</p>
              <h1 id="profile-title">${escapeHtml(profile.identity.name)}</h1>
              <p class="contact-profile-identity__role">${escapeHtml(profile.identity.role)}</p>
              <p class="contact-profile-identity__organization">${escapeHtml(profile.identity.organization)}</p>
              <span class="contact-profile-identity__divider" aria-hidden="true"></span>
              <p class="contact-profile-identity__summary">${escapeHtml(profile.identity.summary)}</p>
            </section>
            <div class="contact-profile-action-regions">
              <nav class="contact-profile-contact-actions" aria-label="Primary contact actions">${contactActions
                .map((action, index) => contactActionMarkup(action, index, publicBase))
                .join('')}</nav>
              ${
                saveAction
                  ? `<nav class="contact-profile-save" aria-label="Save contact">${saveActionMarkup(saveAction, publicBase)}</nav>`
                  : ''
              }
            ${
              externalActions.length > 0
                ? `<nav class="contact-profile-external-actions" aria-label="Web, social, and location links">${externalActions
                    .map((action) => externalActionMarkup(action, publicBase))
                    .join('')}</nav>`
                : ''
            }
            </div>
            <section class="contact-profile-display contact-profile-panel" aria-hidden="true">
              <p class="contact-profile-display__label">DISPLAY // WIREFRAME</p>
              <div class="contact-profile-display__viewport">
                <span class="contact-profile-display__corner contact-profile-display__corner--tl"></span>
                <span class="contact-profile-display__corner contact-profile-display__corner--tr"></span>
                <span class="contact-profile-display__corner contact-profile-display__corner--bl"></span>
                <span class="contact-profile-display__corner contact-profile-display__corner--br"></span>
                <span class="contact-profile-display__horizon"></span>
                <span class="contact-profile-display__orb"></span>
                <span class="contact-profile-display__particle contact-profile-display__particle--one"></span>
                <span class="contact-profile-display__particle contact-profile-display__particle--two"></span>
                <span class="contact-profile-display__particle contact-profile-display__particle--three"></span>
                <p class="contact-profile-display__placeholder">DISPLAY MODULE RESERVED</p>
              </div>
            </section>
            <div class="contact-profile-detail-regions">
            ${
              profile.status.length > 0
                ? `<dl class="contact-profile-details contact-profile-panel" aria-label="Profile details">${profile.status
                    .map(statusMarkup)
                    .join('')}</dl>`
                : ''
            }
            ${
              profile.footer.length > 0
                ? `<footer class="contact-profile-footer contact-profile-panel" aria-label="Profile status">${profile.footer
                    .map(footerMarkup)
                    .join('')}</footer>`
                : ''
            }
            </div>
          </div>
        </div>
      </section>
    </main>
    <script>${staticProfileKeyboardScript}</script>
  </body>
</html>
`
}

export async function generateStaticProfiles({
  outputDir,
  buildRevision,
  profileSlugs,
  publicBase = '/',
}) {
  const selectedProfiles = selectProfiles(publishedProfiles, profileSlugs)

  const profiles = selectedProfiles.map((profile) => ({
    slug: profile.slug,
    themeKey: resolveContactProfileTheme(profile.themeKey).key,
    contentHash: contentHash(profile),
    path: `${publicBase}card/ckohl-works/${profile.slug}/`,
  }))

  for (const profile of selectedProfiles) {
    const profileDir = join(outputDir, 'card', 'ckohl-works', profile.slug)
    await mkdir(profileDir, { recursive: true })
    await writeFile(
      join(profileDir, 'index.html'),
      renderProfileDocument(profile, buildRevision, publicBase),
    )
  }

  const manifest = {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    themeContractVersion: CONTACT_PROFILE_THEME_CONTRACT_VERSION,
    buildRevision,
    profileSetHash: contentHash(selectedProfiles),
    profiles,
  }
  await writeFile(
    join(outputDir, 'static-profile-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  )

  return manifest
}
