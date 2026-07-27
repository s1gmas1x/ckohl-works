import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  getActionHref,
  PROFILE_SCHEMA_VERSION,
  publishedProfiles,
} from '../src/data/publishedProfiles.js'
import { selectProfiles } from './profile-selection.mjs'

const shareTechMonoWoff2 = await readFile(
  new URL(
    '../node_modules/@fontsource/share-tech-mono/files/share-tech-mono-latin-400-normal.woff2',
    import.meta.url,
  ),
)
const shareTechMonoDataUrl = `data:font/woff2;base64,${shareTechMonoWoff2.toString('base64')}`

const staticProfileStyle = `
@font-face { font-family:'Share Tech Mono'; font-style:normal; font-weight:400; font-display:swap; src:url(${shareTechMonoDataUrl}) format('woff2'); }
:root { color-scheme: dark; font-family:'Share Tech Mono',ui-monospace,'Cascadia Code','SFMono-Regular',Consolas,monospace; }
* { box-sizing: border-box; }
body { min-width: 320px; margin: 0; background: radial-gradient(ellipse at 50% -10%, rgba(255,177,43,.1), transparent 42%), #050402; color: #f2d4a0; }
main { width: 100%; min-height: 100vh; }
.profile { position: relative; display: grid; width: 100%; min-height: 100vh; padding: clamp(12px,2.5vw,28px); border: 1px solid #4c381d; border-radius: 0; background: linear-gradient(145deg,#2b210f,#100d07 52%,#352712); box-shadow: 0 2px 0 rgba(255,226,166,.1) inset, 0 26px 70px rgba(0,0,0,.52); text-align: center; }
.screen { position: relative; display: grid; grid-template-rows: auto 1fr; min-height: calc(100vh - clamp(24px,5vw,56px)); overflow: hidden; padding: clamp(22px,4vw,42px); border: 1px solid rgba(255,201,106,.44); border-radius: 12px; background: radial-gradient(ellipse at 50% 12%,rgba(255,199,92,.1),transparent 48%), linear-gradient(180deg,rgba(255,214,132,.035),transparent 26%), #100d07; box-shadow: 0 0 0 5px rgba(0,0,0,.3) inset, 0 0 36px rgba(255,171,38,.08) inset; }
.screen::before { position:absolute; z-index:0; inset:0; background:repeating-linear-gradient(to bottom,rgba(255,226,166,.035) 0,rgba(255,226,166,.035) 1px,transparent 1px,transparent 4px); content:''; pointer-events:none; }
.screen > * { position:relative; z-index:1; }
.status { display:flex; justify-content:space-between; gap:16px; margin:0 0 28px; padding-bottom:12px; border-bottom:1px solid rgba(255,201,106,.32); color:#c9933d; font-size:.68rem; font-weight:700; letter-spacing:.08em; text-align:left; }
.status-ready { color:#ffc96a; }
.profile-content { width:min(620px,100%); margin:auto; text-align:left; }
.eyebrow { margin:0 0 12px; color:#c9933d; font-size:.72rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; }
h1 { margin:0; color:#ffe1a5; font-size:clamp(2.3rem,5vw,3.85rem); font-weight:700; letter-spacing:.02em; line-height:1.08; text-shadow:0 0 14px rgba(255,198,84,.24); }
.role { margin:14px 0 0; color:#ffc96a; font-size:.82rem; font-weight:700; letter-spacing:.045em; line-height:1.5; text-transform:uppercase; }
.summary { max-width:48ch; margin:22px 0 0; color:#f2d4a0; font-family:Inter,ui-sans-serif,system-ui,sans-serif; font-size:1rem; line-height:1.65; }
.actions { display:grid; gap:4px; margin-top:30px; }
.button { display:grid; grid-template-columns:14px 42px minmax(0,1fr) auto; gap:8px; align-items:center; min-height:48px; padding:0 16px; border:1px solid transparent; border-radius:0; color:#e6c486; font-size:.88rem; font-weight:700; letter-spacing:.035em; text-align:left; text-decoration:none; }
.button--primary { border-color:#ffc96a; background:rgba(255,201,106,.1); color:#ffe1a5; }
.button--secondary { border-bottom-color:rgba(255,201,106,.22); }
.action-cursor { color:#ffc96a; }.action-index,.action-type { color:#c9933d; font-size:.72rem; }.action-type { text-align:right; }
.links { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; margin-top:18px; padding-top:18px; border-top:1px solid rgba(255,201,106,.26); }
.links a { display:flex; align-items:center; min-height:44px; padding:0 11px; border:1px solid rgba(255,201,106,.26); border-radius:4px; color:#ffe1a5; font-size:.76rem; font-weight:700; letter-spacing:.03em; text-decoration:none; }
.note { margin:20px 0 0; color:#c9933d; font-size:.72rem; line-height:1.5; text-align:left; }
a:hover { border-color:#ffc96a; background:rgba(255,201,106,.1); } a:focus-visible { outline:3px solid #ffe1a5; outline-offset:3px; }
@media (max-width:560px) { .profile { padding:8px; } .screen { min-height:calc(100vh - 16px); padding:24px 18px; } h1 { font-size:clamp(2.15rem,12vw,3rem); } .summary { font-size:.95rem; } .status { margin-bottom:24px; font-size:.61rem; } .links { grid-template-columns:1fr; } .button { grid-template-columns:14px 36px minmax(0,1fr) auto; padding:0 10px; font-size:.82rem; } }
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
  const className = action.isPrimary ? 'button button--primary' : 'button button--secondary'
  const actionType = { phone: 'CALL', email: 'MAIL', vcard: 'SAVE' }[action.type]

  return `<a class="${className}" href="${href}"${download}${copyEmail}><span class="action-cursor" aria-hidden="true">${action.isPrimary ? '>' : ' '}</span><span class="action-index" aria-hidden="true">[${index + 1}]</span><span>${escapeHtml(action.label)}</span><span class="action-type" aria-hidden="true">${actionType}</span></a>`
}

function linkMarkup(link) {
  return `<a href="${escapeHtml(link.value)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`
}

export function renderProfileDocument(profile, buildRevision, publicBase = '/') {
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
    <meta name="profile-content-hash" content="${hash}">
    <meta name="build-revision" content="${escapeHtml(buildRevision)}">
    <title>${escapeHtml(title)}</title>
    <style>${staticProfileStyle}</style>
    <script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>
  </head>
  <body>
    <main>
      <section class="profile" aria-labelledby="profile-title">
        <div class="screen">
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
