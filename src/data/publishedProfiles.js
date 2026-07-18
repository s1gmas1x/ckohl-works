export const PROFILE_SCHEMA_VERSION = 1

export const publishedProfiles = Object.freeze([
  {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    kind: 'contact_profile',
    slug: 'chad',
    themeKey: 'works',
    identity: {
      name: 'Chad Kohl',
      organization: 'Ckohl Works',
      role: 'Full-Stack Developer',
      summary:
        'Practical digital tools for local businesses: websites, smart QR and NFC experiences, and ongoing technical support.',
    },
    actions: [
      { key: 'call', type: 'phone', label: 'Call Chad', value: '+17194285039', isPrimary: true },
      { key: 'email', type: 'email', label: 'Email', value: 'chad_kohl@ckohl.com' },
      {
        key: 'vcard',
        type: 'vcard',
        label: 'Save Contact',
        value: '/contacts/chad-kohl.vcf',
        download: 'chad-kohl.vcf',
      },
    ],
    links: [
      { key: 'portfolio', label: 'Portfolio', value: 'https://ckohl.com', icon: 'account_circle' },
      { key: 'works', label: 'Ckohl Works', value: 'https://works.ckohl.com', icon: 'language' },
    ],
    vCard: {
      filename: 'chad-kohl.vcf',
      content: [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Kohl;Chad;;;',
        'FN:Chad Kohl',
        'ORG:Ckohl Works',
        'TITLE:Full-Stack Developer',
        'TEL;TYPE=CELL,VOICE:+17194285039',
        'EMAIL;TYPE=INTERNET:chad_kohl@ckohl.com',
        'URL:https://ckohl.com',
        'URL:https://works.ckohl.com',
        'END:VCARD',
        '',
      ].join('\r\n'),
    },
  },
  {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    kind: 'contact_profile',
    slug: 'pikes-peak-handyman',
    themeKey: 'works',
    identity: {
      name: 'Pat Example',
      organization: 'Pikes Peak Handyman',
      role: 'Owner',
      summary:
        'A focused contact page for reliable home-repair requests, service details, and directions in Colorado Springs.',
    },
    actions: [
      {
        key: 'call',
        type: 'phone',
        label: 'Call for an estimate',
        value: '+17195550182',
        isPrimary: true,
      },
      { key: 'email', type: 'email', label: 'Email Pat', value: 'hello@pikespeakhandyman.example' },
      {
        key: 'vcard',
        type: 'vcard',
        label: 'Save Contact',
        value: '/contacts/pikes-peak-handyman.vcf',
        download: 'pikes-peak-handyman.vcf',
      },
    ],
    links: [
      {
        key: 'directions',
        label: 'Service area',
        value: 'https://www.google.com/maps/search/?api=1&query=Colorado+Springs%2C+CO',
        icon: 'location_on',
      },
      {
        key: 'website',
        label: 'Website',
        value: 'https://pikespeakhandyman.example',
        icon: 'language',
      },
    ],
    vCard: {
      filename: 'pikes-peak-handyman.vcf',
      content: [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Example;Pat;;;',
        'FN:Pat Example',
        'ORG:Pikes Peak Handyman',
        'TITLE:Owner',
        'TEL;TYPE=CELL,VOICE:+17195550182',
        'EMAIL;TYPE=INTERNET:hello@pikespeakhandyman.example',
        'URL:https://pikespeakhandyman.example',
        'END:VCARD',
        '',
      ].join('\r\n'),
    },
  },
])

export function getPublishedProfile(slug) {
  return publishedProfiles.find((profile) => profile.slug === slug)
}

export function getActionHref(action) {
  if (action.type === 'phone') return `tel:${action.value.replace(/[^+\d]/g, '')}`
  if (action.type === 'email') return `mailto:${action.value}`

  return action.value
}
