export const PROFILE_SCHEMA_VERSION = 2

export const CONTACT_PROFILE_ACTION_TYPES = Object.freeze([
  'call',
  'sms',
  'email',
  'vcard',
  'website',
  'social',
  'location',
])

const actionTypeConfiguration = Object.freeze({
  call: Object.freeze({ group: 'contact', order: 10, typeLabel: 'CALL' }),
  sms: Object.freeze({ group: 'contact', order: 20, typeLabel: 'TEXT' }),
  email: Object.freeze({ group: 'contact', order: 30, typeLabel: 'MAIL' }),
  vcard: Object.freeze({ group: 'save', order: 40, typeLabel: 'SAVE' }),
  website: Object.freeze({ group: 'external', order: 50, typeLabel: 'WEB' }),
  social: Object.freeze({ group: 'external', order: 60, typeLabel: 'SOCIAL' }),
  location: Object.freeze({ group: 'external', order: 70, typeLabel: 'MAP' }),
})

const requiredActionTypes = Object.freeze(['call', 'sms', 'email', 'vcard'])
const allowedFooterSources = Object.freeze(['profile', 'schema'])

function describePath(profileSlug, path) {
  return `Profile ${JSON.stringify(profileSlug ?? 'unknown')} ${path}`
}

function fail(profileSlug, path, message) {
  throw new Error(`${describePath(profileSlug, path)} ${message}.`)
}

function requireObject(value, profileSlug, path) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(profileSlug, path, 'must be an object')
  }

  return value
}

function requireString(value, profileSlug, path) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(profileSlug, path, 'must be a non-empty string')
  }

  return value.trim()
}

function normalizePhoneNumber(value, profileSlug, path) {
  const input = requireString(value, profileSlug, path)
  const plusCount = [...input].filter((character) => character === '+').length

  if (
    !/^[+\d][\d\s().-]*$/.test(input) ||
    plusCount > 1 ||
    (plusCount === 1 && !input.startsWith('+'))
  ) {
    fail(profileSlug, path, 'must be a valid phone number')
  }

  const digits = input.replace(/\D/g, '')
  if (digits.length < 7 || digits.length > 15) {
    fail(profileSlug, path, 'must contain between 7 and 15 digits')
  }

  return `${input.startsWith('+') ? '+' : ''}${digits}`
}

function normalizeEmailAddress(value, profileSlug, path) {
  const email = requireString(value, profileSlug, path)

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail(profileSlug, path, 'must be a valid email address')
  }

  return email
}

function normalizeHttpsUrl(value, profileSlug, path) {
  const input = requireString(value, profileSlug, path)
  let url

  try {
    url = new URL(input)
  } catch {
    fail(profileSlug, path, 'must be a valid HTTPS URL')
  }

  if (url.protocol !== 'https:' || url.username || url.password) {
    fail(profileSlug, path, 'must be an HTTPS URL without embedded credentials')
  }

  return url.href
}

function normalizeVcardPath(value, profileSlug, path) {
  const vcardPath = requireString(value, profileSlug, path)

  if (!/^\/contacts\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.vcf$/.test(vcardPath)) {
    fail(profileSlug, path, 'must be a root-relative /contacts/*.vcf path')
  }

  return vcardPath
}

function normalizePublicBase(publicBase) {
  if (typeof publicBase !== 'string' || !publicBase.startsWith('/')) {
    throw new Error('Contact profile public base must be a root-relative path.')
  }

  return publicBase.endsWith('/') ? publicBase : `${publicBase}/`
}

function getNormalizedActionValue(action, profileSlug, path) {
  if (action.type === 'call' || action.type === 'sms') {
    return normalizePhoneNumber(action.value, profileSlug, `${path}.value`)
  }
  if (action.type === 'email') {
    return normalizeEmailAddress(action.value, profileSlug, `${path}.value`)
  }
  if (action.type === 'vcard') {
    return normalizeVcardPath(action.value, profileSlug, `${path}.value`)
  }

  return normalizeHttpsUrl(action.value, profileSlug, `${path}.value`)
}

export function getActionHref(action, publicBase = '/') {
  const profileSlug = action?.profileSlug
  const type = action?.type

  if (!Object.hasOwn(actionTypeConfiguration, type)) {
    fail(profileSlug, 'action.type', `uses unsupported value ${JSON.stringify(type)}`)
  }

  const value = getNormalizedActionValue(action, profileSlug, 'action')
  if (type === 'call') return `tel:${value}`
  if (type === 'sms') return `sms:${value}`
  if (type === 'email') {
    return `mailto:${encodeURIComponent(value).replaceAll('%40', '@')}`
  }
  if (type === 'vcard') return `${normalizePublicBase(publicBase)}${value.slice(1)}`

  return value
}

function normalizeAction(action, index, profileSlug) {
  requireObject(action, profileSlug, `actions[${index}]`)
  const path = `actions[${index}]`
  const key = requireString(action.key, profileSlug, `${path}.key`)
  const type = requireString(action.type, profileSlug, `${path}.type`)
  const configuration = actionTypeConfiguration[type]

  if (!configuration) {
    fail(profileSlug, `${path}.type`, `uses unsupported value ${JSON.stringify(type)}`)
  }

  const label = requireString(action.label, profileSlug, `${path}.label`)
  const value = getNormalizedActionValue({ ...action, type }, profileSlug, path)
  const normalizedAction = {
    key,
    type,
    label,
    value,
    href: getActionHref({ type, value, profileSlug }),
    group: configuration.group,
    typeLabel: configuration.typeLabel,
    isPrimary: action.isPrimary === true,
    opensInNewTab: configuration.group === 'external',
    order: configuration.order,
  }

  if (type === 'vcard') {
    normalizedAction.download = requireString(action.download, profileSlug, `${path}.download`)
  }
  if (type === 'social') {
    normalizedAction.platform = requireString(action.platform, profileSlug, `${path}.platform`)
  }
  if (type === 'location') {
    normalizedAction.displayValue = requireString(
      action.displayValue,
      profileSlug,
      `${path}.displayValue`,
    )
  }

  return normalizedAction
}

function validateActionCollection(actions, profileSlug) {
  if (!Array.isArray(actions) || actions.length === 0) {
    fail(profileSlug, 'actions', 'must be a non-empty array')
  }

  const normalizedActions = actions
    .map((action, index) => normalizeAction(action, index, profileSlug))
    .sort((left, right) => left.order - right.order)
  const keys = new Set()

  for (const action of normalizedActions) {
    if (keys.has(action.key)) {
      fail(profileSlug, 'actions', `contains duplicate key ${JSON.stringify(action.key)}`)
    }
    keys.add(action.key)
  }

  for (const requiredType of requiredActionTypes) {
    const matches = normalizedActions.filter((action) => action.type === requiredType)
    if (matches.length !== 1) {
      fail(profileSlug, 'actions', `must contain exactly one ${requiredType} action`)
    }
  }

  const primaryActions = normalizedActions.filter((action) => action.isPrimary)
  if (primaryActions.length !== 1 || primaryActions[0].group !== 'contact') {
    fail(profileSlug, 'actions', 'must contain exactly one primary call, text, or email action')
  }

  return Object.freeze(normalizedActions.map((action) => Object.freeze(action)))
}

function validateVcard(vCard, actions, identity, profileSlug) {
  requireObject(vCard, profileSlug, 'vCard')
  const filename = requireString(vCard.filename, profileSlug, 'vCard.filename')
  if (typeof vCard.content !== 'string' || vCard.content.trim() === '') {
    fail(profileSlug, 'vCard.content', 'must be a non-empty string')
  }
  const content = vCard.content
  const action = actions.find((entry) => entry.type === 'vcard')
  const callAction = actions.find((entry) => entry.type === 'call')
  const emailAction = actions.find((entry) => entry.type === 'email')

  if (action.download !== filename || action.value !== `/contacts/${filename}`) {
    fail(profileSlug, 'vCard', 'must match the configured vCard action path and download filename')
  }
  if (!content.startsWith('BEGIN:VCARD') || !content.trimEnd().endsWith('END:VCARD')) {
    fail(profileSlug, 'vCard.content', 'must contain a complete vCard document')
  }
  if (!content.includes(`FN:${identity.name}`)) {
    fail(profileSlug, 'vCard.content', 'must contain the profile full name')
  }
  if (!content.includes(`ORG:${identity.organization}`)) {
    fail(profileSlug, 'vCard.content', 'must contain the profile organization')
  }
  if (!content.includes(`:${callAction.value}`)) {
    fail(profileSlug, 'vCard.content', 'must contain the configured call number')
  }
  if (!content.includes(`:${emailAction.value}`)) {
    fail(profileSlug, 'vCard.content', 'must contain the configured email address')
  }

  return Object.freeze({ filename, content })
}

function createStatusItems(actions) {
  const items = []
  const location = actions.find((action) => action.type === 'location')
  const vcard = actions.find((action) => action.type === 'vcard')
  const directLinks = actions.filter((action) => action.group === 'external')

  if (location) {
    items.push(
      Object.freeze({
        key: 'location',
        label: 'Location',
        value: location.displayValue,
        actionKey: location.key,
      }),
    )
  }
  if (vcard) {
    items.push(Object.freeze({ key: 'vcard', label: 'VCF', value: 'READY', actionKey: vcard.key }))
  }
  if (directLinks.length > 0) {
    items.push(Object.freeze({ key: 'link-mode', label: 'Link mode', value: 'DIRECT' }))
  }

  return Object.freeze(items)
}

function createFooterFields(sources, profileSlug, schemaVersion) {
  if (sources === undefined) return Object.freeze([])
  if (!Array.isArray(sources)) fail(profileSlug, 'footer', 'must be an array')

  const uniqueSources = new Set()
  const fields = sources.map((source, index) => {
    if (!allowedFooterSources.includes(source)) {
      fail(profileSlug, `footer[${index}]`, `uses unsupported source ${JSON.stringify(source)}`)
    }
    if (uniqueSources.has(source)) {
      fail(profileSlug, 'footer', `contains duplicate source ${JSON.stringify(source)}`)
    }
    uniqueSources.add(source)

    if (source === 'profile') {
      return Object.freeze({ key: 'profile', label: 'Profile', value: profileSlug })
    }

    return Object.freeze({ key: 'schema', label: 'Schema', value: `V${schemaVersion}` })
  })

  return Object.freeze(fields)
}

export function normalizeContactProfile(profile) {
  requireObject(profile, profile?.slug, 'profile')
  const profileSlug = requireString(profile.slug, profile.slug, 'slug')

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(profileSlug)) {
    fail(profileSlug, 'slug', 'must use lowercase URL-safe segments')
  }
  if (profile.schemaVersion !== PROFILE_SCHEMA_VERSION) {
    fail(
      profileSlug,
      'schemaVersion',
      `must equal the current version ${PROFILE_SCHEMA_VERSION}, received ${JSON.stringify(profile.schemaVersion)}`,
    )
  }
  if (profile.kind !== 'contact_profile') {
    fail(profileSlug, 'kind', 'must equal "contact_profile"')
  }

  const rawIdentity = requireObject(profile.identity, profileSlug, 'identity')
  const identity = Object.freeze({
    name: requireString(rawIdentity.name, profileSlug, 'identity.name'),
    organization: requireString(rawIdentity.organization, profileSlug, 'identity.organization'),
    role: requireString(rawIdentity.role, profileSlug, 'identity.role'),
    summary: requireString(rawIdentity.summary, profileSlug, 'identity.summary'),
  })
  const actions = validateActionCollection(profile.actions, profileSlug)
  const vCard = validateVcard(profile.vCard, actions, identity, profileSlug)

  return Object.freeze({
    schemaVersion: PROFILE_SCHEMA_VERSION,
    kind: 'contact_profile',
    slug: profileSlug,
    themeKey: requireString(profile.themeKey, profileSlug, 'themeKey'),
    identity,
    actions,
    status: createStatusItems(actions),
    footer: createFooterFields(profile.footer, profileSlug, PROFILE_SCHEMA_VERSION),
    vCard,
  })
}

export function normalizeContactProfiles(profiles) {
  if (!Array.isArray(profiles) || profiles.length === 0) {
    throw new Error('Published contact profiles must be a non-empty array.')
  }

  const normalizedProfiles = profiles.map(normalizeContactProfile)
  const slugs = new Set()

  for (const profile of normalizedProfiles) {
    if (slugs.has(profile.slug)) {
      throw new Error(
        `Published contact profiles contain duplicate slug ${JSON.stringify(profile.slug)}.`,
      )
    }
    slugs.add(profile.slug)
  }

  return Object.freeze(normalizedProfiles)
}

export function getProfileAction(profile, actionKey) {
  return profile.actions.find((action) => action.key === actionKey)
}

export function getProfileActionsByGroup(profile, group) {
  return profile.actions.filter((action) => action.group === group)
}
