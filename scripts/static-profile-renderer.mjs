import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  getActionHref,
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

const staticProfileStyle = `
@font-face { font-family:'Share Tech Mono'; font-style:normal; font-weight:400; font-display:swap; src:url(${shareTechMonoDataUrl}) format('woff2'); }
:root { color-scheme:dark; }
* { box-sizing: border-box; }
body { min-width:320px; margin:0; background:#000; color:#fff; font-family:ui-monospace,'Cascadia Code','SFMono-Regular',Consolas,monospace; }
main { width: 100%; min-height: 100vh; }
.profile { position:relative; display:grid; width:100%; min-height:100vh; padding:clamp(12px,2.5vw,28px); border:0; border-radius:0; background:var(--crt-color-surface-page,#000); box-shadow:none; color:var(--crt-color-text-body,#fff); font-family:var(--crt-type-body-family,ui-monospace,monospace); text-align:center; }
.screen { position:relative; display:grid; grid-template-rows:auto 1fr; min-height:calc(100vh - clamp(24px,5vw,56px)); overflow:hidden; padding:clamp(22px,4vw,42px); border-width:var(--crt-border-width,1px); border-style:solid; }
.status { display:flex; justify-content:space-between; gap:16px; margin:0 0 28px; padding-bottom:12px; border-bottom:var(--crt-border-width,1px) solid var(--crt-color-border-panel,currentColor); color:var(--crt-color-text-muted,currentColor); font-family:var(--crt-type-label-family,inherit); font-size:var(--crt-type-label-size,.72rem); font-weight:var(--crt-type-label-weight,400); letter-spacing:var(--crt-type-label-tracking,.1em); text-align:left; }
.status-ready { color:var(--crt-color-status-ready,currentColor); }
.profile-content { width:min(620px,100%); margin:auto; text-align:left; }
.eyebrow { margin:0 0 12px; color:var(--crt-color-text-muted,currentColor); font-family:var(--crt-type-label-family,inherit); font-size:var(--crt-type-label-size,.72rem); font-weight:var(--crt-type-label-weight,400); letter-spacing:var(--crt-type-label-tracking,.1em); text-transform:uppercase; }
h1 { margin:0; color:var(--crt-color-text-strong,currentColor); font-family:var(--crt-type-identity-family,inherit); font-size:var(--crt-type-identity-size,3rem); font-weight:var(--crt-type-identity-weight,400); letter-spacing:var(--crt-type-identity-tracking,.02em); line-height:var(--crt-type-identity-leading,1.08); text-shadow:var(--crt-glow-identity,none); }
.role { margin:14px 0 0; color:var(--crt-color-accent,currentColor); font-family:var(--crt-type-label-family,inherit); font-size:var(--crt-type-role-size,.82rem); font-weight:var(--crt-type-label-weight,400); letter-spacing:var(--crt-type-role-tracking,.045em); line-height:1.5; text-transform:uppercase; }
.summary { max-width:48ch; margin:22px 0 0; color:var(--crt-color-text-body,currentColor); font-family:var(--crt-type-body-family,inherit); font-size:var(--crt-type-body-size,1rem); font-weight:var(--crt-type-body-weight,400); line-height:var(--crt-type-body-leading,1.65); }
.actions { display:grid; gap:4px; margin-top:30px; }
.button { display:grid; grid-template-columns:14px 42px minmax(0,1fr) auto; gap:8px; align-items:center; min-height:48px; padding:0 var(--crt-panel-padding-inline,16px); border-width:var(--crt-border-width,1px); border-style:solid; border-radius:0; font-family:var(--crt-type-action-family,inherit); font-size:var(--crt-type-action-size,.88rem); font-weight:var(--crt-type-action-weight,400); letter-spacing:var(--crt-type-action-tracking,.035em); text-align:left; text-decoration:none; }
.button--secondary { border-right-color:transparent; border-left-color:transparent; }
.action-cursor { color:var(--crt-color-accent,currentColor); }.action-index,.action-type { color:var(--crt-color-text-muted,currentColor); font-family:var(--crt-type-data-family,inherit); font-size:var(--crt-type-data-size,.72rem); font-weight:var(--crt-type-data-weight,400); letter-spacing:var(--crt-type-data-tracking,.06em); }.action-type { text-align:right; }
.links { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:var(--crt-panel-gap,9px); margin-top:18px; padding-top:18px; border-top:var(--crt-border-width,1px) solid var(--crt-color-border-panel,currentColor); }
.links a { display:flex; align-items:center; min-height:44px; padding:0 11px; border-width:var(--crt-border-width,1px); border-style:solid; border-radius:var(--crt-radius-panel,4px); font-family:var(--crt-type-action-family,inherit); font-size:var(--crt-type-label-size,.72rem); font-weight:var(--crt-type-action-weight,400); letter-spacing:var(--crt-type-action-tracking,.035em); text-decoration:none; }
.note { margin:20px 0 0; color:var(--crt-color-text-muted,currentColor); font-family:var(--crt-type-label-family,inherit); font-size:var(--crt-type-label-size,.72rem); font-weight:var(--crt-type-label-weight,400); line-height:1.5; text-align:left; }
@media (max-width:560px) { .profile { padding:8px; } .screen { min-height:calc(100vh - 16px); padding:24px 18px; } .status { margin-bottom:24px; } .links { grid-template-columns:1fr; } .button { grid-template-columns:14px 36px minmax(0,1fr) auto; padding-inline:var(--crt-panel-padding-inline,10px); } }
${contactProfileThemeStyle}
`

const staticProfileKeyboardScript = `
  const actionLinks = Array.from(document.querySelectorAll('.actions a'));
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
        const type = link.querySelector('.action-type');
        type.textContent = 'COPIED';
        window.setTimeout(() => { type.textContent = 'MAIL'; }, 2200);
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

function actionMarkup(action, index, publicBase) {
  const actionHref = getActionHref(action)
  const href = escapeHtml(
    action.type === 'vcard' ? `${publicBase}${actionHref.slice(1)}` : actionHref,
  )
  const download = action.download ? ` download="${escapeHtml(action.download)}"` : ''
  const copyEmail = action.type === 'email' ? ` data-copy-email="${escapeHtml(action.value)}"` : ''
  const className = action.isPrimary
    ? 'button button--primary contact-profile-crt-control contact-profile-crt-control--primary'
    : 'button button--secondary contact-profile-crt-control'
  const actionType = { phone: 'CALL', email: 'MAIL', vcard: 'SAVE' }[action.type]

  return `<a class="${className}" href="${href}"${download}${copyEmail}><span class="action-cursor" aria-hidden="true">${action.isPrimary ? '>' : ' '}</span><span class="action-index" aria-hidden="true">[${index + 1}]</span><span>${escapeHtml(action.label)}</span><span class="action-type" aria-hidden="true">${actionType}</span></a>`
}

function linkMarkup(link) {
  return `<a class="contact-profile-crt-control" href="${escapeHtml(link.value)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`
}

export function renderProfileDocument(profile, buildRevision, publicBase = '/') {
  const theme = resolveContactProfileTheme(profile.themeKey)
  const hash = contentHash(profile)
  const title = `${profile.identity.name} | ${profile.identity.organization}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.identity.name,
    jobTitle: profile.identity.role,
    worksFor: { '@type': 'Organization', name: profile.identity.organization },
    description: profile.identity.summary,
    email: profile.actions.find((action) => action.type === 'email')?.value,
    telephone: profile.actions.find((action) => action.type === 'phone')?.value,
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
      <section class="profile ${escapeHtml(theme.className)}" data-contact-profile-theme="${escapeHtml(theme.key)}" data-contact-profile-theme-contract="${theme.contractVersion}" aria-labelledby="profile-title">
        <div class="screen contact-profile-crt-screen">
          <header class="status" aria-label="Contact card status"><span>CKOHL WORKS // CONTACT NODE</span><span class="status-ready">READY</span></header>
          <div class="profile-content">
            <p class="eyebrow">Profile // ${escapeHtml(profile.slug)}</p>
            <h1 id="profile-title">${escapeHtml(profile.identity.name)}</h1>
            <p class="role">${escapeHtml(profile.identity.role)} / ${escapeHtml(profile.identity.organization)}</p>
            <p class="summary">${escapeHtml(profile.identity.summary)}</p>
            <nav class="actions" aria-label="Contact actions">${profile.actions
              .map((action, index) => actionMarkup(action, index, publicBase))
              .join('')}</nav>
            <nav class="links" aria-label="Website links">${profile.links.map(linkMarkup).join('')}</nav>
            <p class="note">Tap a row to connect, or save these details for later.</p>
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
