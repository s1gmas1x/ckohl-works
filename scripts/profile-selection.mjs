export function parseProfileSlugs(value) {
  if (value === undefined) return undefined

  const slugs = value
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean)

  if (slugs.length === 0) throw new Error('STATIC_PROFILE_SLUGS must contain at least one profile slug.')
  if (new Set(slugs).size !== slugs.length) {
    throw new Error('STATIC_PROFILE_SLUGS must not contain duplicate profile slugs.')
  }

  return slugs
}

export function selectProfiles(profiles, slugs) {
  if (!slugs) return profiles

  const selectedProfiles = profiles.filter((profile) => slugs.includes(profile.slug))
  const selectedSlugs = new Set(selectedProfiles.map((profile) => profile.slug))
  const unknownSlugs = slugs.filter((slug) => !selectedSlugs.has(slug))

  if (unknownSlugs.length > 0) {
    throw new Error(`STATIC_PROFILE_SLUGS includes unknown profile slugs: ${unknownSlugs.join(', ')}.`)
  }

  return selectedProfiles
}
