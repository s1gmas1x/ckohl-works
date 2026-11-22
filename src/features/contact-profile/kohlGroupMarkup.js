import { getActionHref, getProfileActionsByGroup } from '../../data/contactProfileContract.js'
import { getContactProfileMedia } from '../../data/contactProfileMedia.js'
import { getContactProfileActionIcon, getContactProfileIconPaths } from './actionIcons.js'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function icon(action) {
  return `<svg class="contact-profile-kohl__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${getContactProfileIconPaths(
    getContactProfileActionIcon(action),
  )
    .map((path) => `<path d="${escapeHtml(path)}"></path>`)
    .join('')}</svg>`
}

function actionLink(action, publicBase) {
  const external = action.group === 'external'
  const detail = action.type === 'location' ? action.displayValue : action.destinationLabel
  return `<a class="contact-profile-kohl__action${action.isPrimary || action.type === 'vcard' ? ' contact-profile-kohl__action--primary' : ''}" href="${escapeHtml(getActionHref(action, publicBase))}"${action.download ? ` download="${escapeHtml(action.download)}"` : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>
    ${icon(action)}<span><span class="contact-profile-kohl__action-label">${escapeHtml(action.label)}</span>${external ? `<span class="contact-profile-kohl__action-detail">${escapeHtml(detail)}</span><span class="contact-profile-kohl__sr-only"> (opens in new tab)</span>` : ''}</span></a>`
}

// Both renderers consume this code-owned template. Every content value is escaped;
// URLs have already passed the reviewed profile contract. No supplied HTML is rendered.
export function renderKohlGroupMarkup(profile, publicBase = '/') {
  const identity = profile.identity
  const media = getContactProfileMedia(identity.mediaKey)
  const titleId = `${profile.slug}-profile-title`
  const contact = getProfileActionsByGroup(profile, 'contact')
  const save = getProfileActionsByGroup(profile, 'save')
  const external = getProfileActionsByGroup(profile, 'external')
  return `<div class="contact-profile-kohl__inner">
    <header class="contact-profile-kohl__header">
      <div class="contact-profile-kohl__brand">
        <svg class="contact-profile-kohl__mark" viewBox="0 0 164 150" fill="none" aria-hidden="true"><path d="M12 4 H152 V138 M12 4 V96 M12 96 L62 40 L108 104 L134 74 L152 96" stroke="currentColor" stroke-width="3.2"></path><path d="M62 40 L86 70 L74 78 Z" fill="#BE5C39"></path></svg>
        <span>${escapeHtml(identity.organization)}</span>
      </div>
      <p class="contact-profile-kohl__tagline">${escapeHtml(identity.summary)}</p>
    </header>
    <div class="contact-profile-kohl__layout">
      <section class="contact-profile-kohl__identity">
        ${media ? `<img class="contact-profile-kohl__portrait" src="${escapeHtml(publicBase + media.portrait)}" alt="${escapeHtml(identity.name)}" width="400" height="400" fetchpriority="high">` : ''}
        <div class="contact-profile-kohl__intro"><p class="contact-profile-kohl__role">${escapeHtml(identity.role)}</p><h1 id="${escapeHtml(titleId)}">${escapeHtml(identity.name)}</h1>${identity.brokerage ? `<p class="contact-profile-kohl__brokerage">${escapeHtml(identity.brokerage)}</p>` : ''}</div>
      </section>
      <div class="contact-profile-kohl__links">
        <h2>Let’s connect</h2>
        <nav class="contact-profile-kohl__contact" aria-label="Contact">${contact.map((action) => actionLink(action, publicBase)).join('')}</nav>
        <nav class="contact-profile-kohl__save" aria-label="Save contact">${save.map((action) => actionLink(action, publicBase)).join('')}</nav>
        <nav class="contact-profile-kohl__external" aria-label="Website, social, and directions">${external.map((action) => actionLink(action, publicBase)).join('')}</nav>
      </div>
    </div>
    <footer class="contact-profile-kohl__footer">${media ? `<img src="${escapeHtml(publicBase + media.brokerageLogo)}" alt="${escapeHtml(media.brokerageAlt)}" width="140" height="35" loading="lazy">` : ''}<span>${escapeHtml(identity.organization)}${identity.brokerage ? ` · ${escapeHtml(identity.brokerage)}` : ''}</span></footer>
  </div>`
}
