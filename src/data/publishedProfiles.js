import {
  chadProfile,
  getActionHref,
  pikesPeakHandymanProfile,
  PROFILE_SCHEMA_VERSION,
} from './profileFixtures.js'

export { getActionHref, PROFILE_SCHEMA_VERSION }

export const publishedProfiles = Object.freeze([chadProfile, pikesPeakHandymanProfile])

export function getPublishedProfile(slug) {
  return publishedProfiles.find((profile) => profile.slug === slug)
}
