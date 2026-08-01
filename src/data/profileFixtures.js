import { CRT_AMBER_THEME_KEY } from './contactProfileThemes.js'
import { PROFILE_SCHEMA_VERSION } from './contactProfileContract.js'

export { PROFILE_SCHEMA_VERSION }

export const chadProfile = {
  schemaVersion: PROFILE_SCHEMA_VERSION,
  kind: 'contact_profile',
  slug: 'chad',
  themeKey: CRT_AMBER_THEME_KEY,
  identity: {
    name: 'Chad Kohl',
    organization: 'Ckohl Works',
    role: 'Full-Stack Developer',
    summary:
      'I build websites, digital contact tools, and practical systems that make the next step clear.',
    summaryVariants: [
      'Good ideas deserve clean execution, useful details, and fewer moving parts.',
      'When the technical side gets weird, I trace the signal instead of guessing.',
      'From business pages to NFC and QR workflows, I build for the moment people act.',
      'Clear interface. Solid handoff. No mystery between the problem and the fix.',
    ],
  },
  actions: [
    { key: 'call', type: 'call', label: 'Call Chad', value: '+17194285039', isPrimary: true },
    { key: 'text', type: 'sms', label: 'Text Chad', value: '+17194285039' },
    { key: 'email', type: 'email', label: 'Email', value: 'chad_kohl@ckohl.com' },
    {
      key: 'vcard',
      type: 'vcard',
      label: 'Save Contact',
      value: '/contacts/chad-kohl.vcf',
      download: 'chad-kohl.vcf',
    },
    {
      key: 'website',
      type: 'website',
      purpose: 'portfolio',
      label: 'Portfolio',
      value: 'https://ckohl.com',
    },
    {
      key: 'works',
      type: 'website',
      purpose: 'services',
      label: 'Services',
      value: 'https://works.ckohl.com',
    },
    {
      key: 'linkedin',
      type: 'social',
      platform: 'LinkedIn',
      label: 'LinkedIn',
      value: 'https://www.linkedin.com/in/chad-kohl401',
    },
  ],
  footer: ['profile', 'schema'],
  vCard: {
    filename: 'chad-kohl.vcf',
    content:
      'BEGIN:VCARD\r\nVERSION:3.0\r\nN:Kohl;Chad;;;\r\nFN:Chad Kohl\r\nORG:Ckohl Works\r\nTITLE:Full-Stack Developer\r\nTEL;TYPE=CELL,VOICE:+17194285039\r\nEMAIL;TYPE=INTERNET:chad_kohl@ckohl.com\r\nURL:https://ckohl.com\r\nURL:https://works.ckohl.com\r\nEND:VCARD\r\n',
  },
}

export const pikesPeakHandymanProfile = {
  schemaVersion: PROFILE_SCHEMA_VERSION,
  kind: 'contact_profile',
  slug: 'pikes-peak-handyman',
  themeKey: CRT_AMBER_THEME_KEY,
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
      type: 'call',
      label: 'Call for an estimate',
      value: '+17195550182',
      isPrimary: true,
    },
    { key: 'text', type: 'sms', label: 'Text for an estimate', value: '+17195550182' },
    { key: 'email', type: 'email', label: 'Email Pat', value: 'hello@pikespeakhandyman.example' },
    {
      key: 'vcard',
      type: 'vcard',
      label: 'Save Contact',
      value: '/contacts/pikes-peak-handyman.vcf',
      download: 'pikes-peak-handyman.vcf',
    },
    {
      key: 'website',
      type: 'website',
      label: 'Website',
      value: 'https://pikespeakhandyman.example',
    },
    {
      key: 'location',
      type: 'location',
      label: 'Open service area',
      displayValue: 'Colorado Springs, CO',
      value: 'https://www.google.com/maps/search/?api=1&query=Colorado+Springs%2C+CO',
    },
  ],
  footer: ['profile', 'schema'],
  vCard: {
    filename: 'pikes-peak-handyman.vcf',
    content:
      'BEGIN:VCARD\r\nVERSION:3.0\r\nN:Example;Pat;;;\r\nFN:Pat Example\r\nORG:Pikes Peak Handyman\r\nTITLE:Owner\r\nTEL;TYPE=CELL,VOICE:+17195550182\r\nEMAIL;TYPE=INTERNET:hello@pikespeakhandyman.example\r\nURL:https://pikespeakhandyman.example\r\nEND:VCARD\r\n',
  },
}

export const profileModuleExportNames = {
  chad: 'chadProfile',
  'pikes-peak-handyman': 'pikesPeakHandymanProfile',
}
