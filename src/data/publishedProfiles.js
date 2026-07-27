import { chadProfile, pikesPeakHandymanProfile } from './profileFixtures.js'
import { validateContactProfileThemes } from './contactProfileThemes.js'
import {
  getActionHref,
  getProfileAction,
  getProfileActionsByGroup,
  normalizeContactProfiles,
  PROFILE_SCHEMA_VERSION,
} from './contactProfileContract.js'

export { getActionHref, getProfileAction, getProfileActionsByGroup, PROFILE_SCHEMA_VERSION }

export const publishedProfiles = Object.freeze(
  validateContactProfileThemes(normalizeContactProfiles([chadProfile, pikesPeakHandymanProfile])),
)

export function getPublishedProfile(slug) {
  return publishedProfiles.find((profile) => profile.slug === slug)
}
