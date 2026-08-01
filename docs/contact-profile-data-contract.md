# Contact Profile Data and Action Contract

## Decision

Contact profiles use schema version 2 and one validated, ordered `actions` collection. Action types
are code-owned and limited to:

```text
call, sms, email, vcard, website, social, location
```

The contract is normalized in `src/data/contactProfileContract.js` before either renderer receives a
published profile. Vue and generated clean-route HTML therefore use the same action ordering, URL
rules, grouping, VCF readiness, direct-link status, and derived footer values.

## Required and optional data

Every published profile requires:

- a URL-safe slug and approved theme key;
- name, organization, role, and summary;
- exactly one call, SMS, email, and vCard action;
- exactly one primary action among call, SMS, and email;
- a vCard definition matching the vCard action path and download filename.

Website, social, and location actions are optional. Optional actions and their status rows disappear
when not configured. Social actions require a named platform. Location actions require a
human-readable display value in addition to an approved map URL.

External controls pair their reviewed action label with a code-derived destination label. Website
roots display their normalized hostname, social links display the hostname and account path, and
locations reuse the reviewed human-readable location. Query strings and fragments are not exposed
as button copy. Both renderers include the visible destination in the link's accessible name.
Website actions may optionally select the approved semantic purposes `portfolio` or `services`.
Those purposes map to code-owned visual treatments; profile data cannot supply icon names or paths.

Identity may also contain one to five reviewed `summaryVariants`. Each variant is a unique,
non-empty string of at most 180 characters and must differ from the canonical summary. Profiles
without variants render the canonical summary normally. Profiles with variants retain that summary
as their semantic and no-JavaScript copy, then may progressively rotate it with the reviewed
variants. Timing, cursor, markup, and animation values remain code-owned and are not profile data.

The current SMS contract contains only the configured phone number. It does not prefill message
content.

## URL and navigation policy

- Call and SMS phone values are reduced to a valid 7–15 digit destination, retaining one leading
  `+` when supplied.
- Email destinations are validated and safely encoded into `mailto:` links.
- vCard destinations must use a root-relative `/contacts/*.vcf` path and are adjusted for the
  deployment base path by each renderer.
- Website, social, and location destinations must use HTTPS and cannot contain embedded
  credentials.
- External destinations open under the existing new-tab policy with `noopener noreferrer` and an
  accessible name that announces that behavior.
- All important actions remain ordinary anchors. Clipboard failure cannot cancel email navigation,
  and no action depends on JavaScript, analytics, or WebGL.

## Derived, truthful status

Status text is computed from validated configuration:

- `VCF: READY` exists only when the vCard action, filename, and reviewed vCard content agree.
- `LINK MODE: DIRECT` exists only when an approved external action is configured.
- Location displays the reviewed human-readable location when a location action exists.

The UI does not display `DYNAMIC LINK: ACTIVE`. There is no redirect service or action analytics
handler in this contract, and action analytics remain explicitly deferred.

Optional footer fields use approved derived sources only:

- `PROFILE` comes from the published slug.
- `SCHEMA` comes from `PROFILE_SCHEMA_VERSION`.

Do not add fictional uptime, signal, availability, or live-service telemetry.

## Structured data and static publication

Generated JSON-LD includes only values available in the normalized profile: name, role,
organization, description, email, telephone, first website, configured social destinations, and
location display text.

The canonical `summary` remains the metadata and JSON-LD description. Animated variants are
presentation copy only and are never announced as changing live content.

Static verification checks every generated action href, status value, schema marker, deterministic
content hash, and exact reviewed vCard content. Selected builds continue to remove unselected
profile pages, fixture content, and vCard artifacts.

## Verification

Run:

```bash
npm run test:themes
npm run build
npm run build:profiles
npm run verify:profiles
```

Real-device release checks should still cover call, SMS, email, map, external-link, and contact-save
behavior on representative iOS, Android, and desktop browsers.
