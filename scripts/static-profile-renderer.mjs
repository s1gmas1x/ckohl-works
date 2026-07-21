import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { getActionHref, PROFILE_SCHEMA_VERSION, publishedProfiles } from '../src/data/publishedProfiles.js'
import { selectProfiles } from './profile-selection.mjs'

const staticProfileStyle = `
:root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
* { box-sizing: border-box; }
body { min-width: 320px; margin: 0; background: #020406; color: #d7dde5; }
main { width: min(620px, calc(100% - 32px)); margin: 0 auto; padding: 58px 0 72px; }
.profile { padding: clamp(28px, 6vw, 50px); border: 1px solid rgba(255,255,255,.16); border-radius: 8px; background: linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.015)); box-shadow: 0 28px 80px rgba(0,0,0,.42); text-align: center; }
.eyebrow { margin: 0 0 18px; color: #f99c1e; font-size: .78rem; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; }
.identity { display: grid; width: 78px; aspect-ratio: 1; margin: 2px auto 20px; border: 1px solid rgba(255,255,255,.16); border-radius: 50%; background: #0f151c; color: #f99c1e; font-family: Orbitron, ui-sans-serif, sans-serif; font-size: 1.45rem; font-weight: 600; place-items: center; }
h1 { margin: 0; color: #fff; font-family: Ubuntu, Inter, sans-serif; font-size: clamp(2.65rem, 5vw, 4.4rem); line-height: 1; }
.role { margin: 12px 0 0; color: #f99c1e; font-size: 1.12rem; font-weight: 800; }
.summary { margin: 20px 0 0; font-size: 1.08rem; line-height: 1.65; }
.actions { display: grid; gap: 10px; margin-top: 30px; }
.button { display: flex; justify-content: center; align-items: center; min-height: 48px; padding: 0 20px; border: 1px solid rgba(255,255,255,.16); border-radius: 6px; background: rgba(255,255,255,.055); color: #fff; font-family: Ubuntu, Inter, sans-serif; font-weight: 800; text-decoration: none; }
.button--primary { border-color: transparent; background: linear-gradient(180deg,#ff9b22,#a85b00); }
.links { display: flex; justify-content: center; gap: 18px; margin-top: 26px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.1); }
.links a { color: #fff; font-weight: 700; text-decoration: none; }
.note { margin: 24px 0 0; color: #a2acb8; font-size: .92rem; line-height: 1.5; }
a:focus-visible { outline: 3px solid #ffb84d; outline-offset: 3px; }
@media (max-width: 560px) { main { width: min(100% - 28px, 520px); padding: 34px 0 48px; } .profile { padding: 28px 20px; } h1 { font-size: clamp(2.55rem, 14vw, 3.45rem); } .summary { font-size: 1rem; } .links { flex-direction: column; gap: 12px; } }
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

function actionMarkup(action, publicBase) {
  const actionHref = getActionHref(action)
  const href = escapeHtml(action.type === 'vcard' ? `${publicBase}${actionHref.slice(1)}` : actionHref)
  const download = action.download ? ` download="${escapeHtml(action.download)}"` : ''
  const className = action.isPrimary ? 'button button--primary' : 'button'

  return `<a class="${className}" href="${href}"${download}>${escapeHtml(action.label)}</a>`
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
        <p class="eyebrow">Digital contact card</p>
        <div class="identity" aria-hidden="true">${escapeHtml(profile.identity.name.slice(0, 1))}K</div>
        <h1 id="profile-title">${escapeHtml(profile.identity.name)}</h1>
        <p class="role">${escapeHtml(profile.identity.role)} at ${escapeHtml(profile.identity.organization)}</p>
        <p class="summary">${escapeHtml(profile.identity.summary)}</p>
        <nav class="actions" aria-label="Contact actions">${profile.actions
          .map((action) => actionMarkup(action, publicBase))
          .join('')}</nav>
        <nav class="links" aria-label="Website links">${profile.links.map(linkMarkup).join('')}</nav>
        <p class="note">Save the contact now, then return whenever you need to connect.</p>
      </section>
    </main>
  </body>
</html>
`
}

export async function generateStaticProfiles({ outputDir, buildRevision, profileSlugs, publicBase = '/' }) {
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
  await writeFile(join(outputDir, 'static-profile-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

  return manifest
}
