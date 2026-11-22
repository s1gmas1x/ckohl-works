// Reviewed local artwork only. Profiles select a key, never a customer-supplied URL.
export const contactProfileMedia = Object.freeze({
  'chris-kohl': Object.freeze({
    portrait: 'profile-media/chris/portrait.webp',
    brokerageLogo: 'profile-media/chris/metro-brokers.png',
    brokerageAlt: 'MetroBrokers',
  }),
})

export function getContactProfileMedia(key) {
  return typeof key === 'string' && Object.hasOwn(contactProfileMedia, key)
    ? contactProfileMedia[key]
    : undefined
}
