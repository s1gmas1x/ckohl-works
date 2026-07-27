export const CONTACT_PROFILE_THEME_CONTRACT_VERSION = 1
export const CRT_AMBER_THEME_KEY = 'crt-amber'

const crtAmberTheme = Object.freeze({
  contractVersion: CONTACT_PROFILE_THEME_CONTRACT_VERSION,
  key: CRT_AMBER_THEME_KEY,
  className: 'contact-profile-theme--crt-amber',
  colorScheme: 'dark',
  decorativeDisplay: Object.freeze({
    presetKey: 'crt-wireframe',
    enhancement: 'progressive',
    canonicalRoute: 'enhanced',
    fallback: 'required',
    reducedMotion: 'static-fallback',
  }),
})

export const contactProfileThemes = Object.freeze({
  [CRT_AMBER_THEME_KEY]: crtAmberTheme,
})

function formatThemeKey(themeKey) {
  return themeKey === undefined ? 'undefined' : JSON.stringify(themeKey)
}

export function getContactProfileTheme(themeKey) {
  if (typeof themeKey !== 'string' || !Object.hasOwn(contactProfileThemes, themeKey)) {
    return undefined
  }

  return contactProfileThemes[themeKey]
}

export function resolveContactProfileTheme(themeKey) {
  const theme = getContactProfileTheme(themeKey)

  if (!theme) {
    throw new Error(`Unknown contact profile theme key: ${formatThemeKey(themeKey)}.`)
  }

  return theme
}

export function validateContactProfileThemes(profiles) {
  for (const profile of profiles) {
    if (!getContactProfileTheme(profile?.themeKey)) {
      throw new Error(
        `Profile ${JSON.stringify(profile?.slug ?? 'unknown')} uses unknown contact profile theme key: ${formatThemeKey(profile?.themeKey)}.`,
      )
    }
  }

  return profiles
}
