# Static Profile Spike

## Result

The installed Quasar CLI/Vite application supports SPA and SSR modes, but it does not provide an
approved, route-aware static-generation mode for this project. This spike therefore keeps the
existing Quasar application and profile components, while adding a narrow build-owned static
renderer for controlled profile fixtures.

This is a safe fallback, not a second frontend application:

- `src/data/publishedProfiles.js` is the versioned, reviewed fixture contract.
- `ProfilePage.vue` and `ContactProfileCard.vue` render the same contract in the existing Quasar app.
- `scripts/static-profile-renderer.mjs` renders the same contract into no-JavaScript static HTML,
  metadata, JSON-LD, and vCard artifacts.
- The renderer reads only fixture content in this repository. It does not read Markdown, the Obsidian
  vault, Laravel, or an API.

## Commands

```bash
npm run build:profiles
npm run verify:profiles
npm run serve:profiles
```

`build:profiles` builds Quasar into `dist/.static-profiles-next`, generates profile pages, and only
then promotes that complete directory to `dist/static-profiles`. A Quasar or profile-generation
failure removes the staging directory and leaves the last `dist/static-profiles` directory intact.
`STATIC_PROFILE_FORCE_FAILURE=1 node scripts/build-static-profiles.mjs` is a local-only failure
injection check for this promotion guarantee.

`STATIC_PROFILE_SLUGS` optionally limits a build to reviewed smoke fixtures. The GitHub Pages
workflow uses `STATIC_PROFILE_SLUGS=pikes-peak-handyman` so the public hosting proof does not publish
Chad's real contact profile or vCard through that candidate host.

The output includes:

- `/card/ckohl-works/chad/`
- `/card/ckohl-works/pikes-peak-handyman/`
- `/contacts/chad-kohl.vcf`
- `/contacts/pikes-peak-handyman.vcf`
- `/static-profile-manifest.json`, including schema version, build revision, profile paths, and
  deterministic content hashes

## Hosting Constraints

The candidate static host must serve directory index files for clean URLs and deploy the complete
`dist/static-profiles` directory atomically or through immutable/versioned releases. The local proof
server provides the required direct-load behavior at `http://127.0.0.1:4173`.

GitHub Pages is the first production candidate because this repository already deploys there through
the `actions/deploy-pages` workflow and enforces HTTPS. The workflow builds and deploys the complete
staged profile artifact, including the marketing SPA and fictional smoke profile. After the candidate
PR merges, validate its exact public clean route and vCard using the GitHub Pages deployment URL.

Before publishing a customer profile, verify provider rollback behavior, cache policy, custom-domain
support, and restrictive security headers. If a future Quasar SSG mode becomes supported and stable
for this project, evaluate it against this fixture and output contract before replacing the renderer.
Quasar SSR remains the presentation-system fallback if a static-host requirement cannot be met.
