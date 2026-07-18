# GitHub Pages Static Profile Candidate

## Candidate

GitHub Pages is the first hosting candidate because this repository already has a successful,
HTTPS-enforced `actions/deploy-pages` workflow at `https://s1gmas1x.github.io/ckohl-works/`.

The workflow now runs the staged `npm run build:profiles` command and uploads the complete
`dist/static-profiles` artifact. It builds only the fictional `pikes-peak-handyman` profile via
`STATIC_PROFILE_SLUGS=pikes-peak-handyman`; Chad's contact fixture is intentionally excluded from
this public-host proof, including its vCard artifact.

## Expected Smoke URL

After this branch merges and the Pages workflow succeeds, verify:

```text
https://s1gmas1x.github.io/ckohl-works/card/ckohl-works/pikes-peak-handyman/
```

The matching vCard URL is:

```text
https://s1gmas1x.github.io/ckohl-works/contacts/pikes-peak-handyman.vcf
```

Local production-path proof:

```bash
DEPLOY_TARGET=github-pages STATIC_PROFILE_SLUGS=pikes-peak-handyman npm run build:profiles
STATIC_PROFILE_BASE_PATH=/ckohl-works/ PORT=4174 npm run serve:profiles
```

## Deployment Safety

The build creates the complete artifact in `dist/.static-profiles-next` and promotes it only after
Quasar and static-profile generation succeed. A local forced failure proved that the prior valid
static output remains unchanged. GitHub Pages receives an artifact only from a successful build job;
the existing Pages deployment remains the currently served revision until the deployment job
completes.

This is an initial provider proof, not a final customer-host decision. Before a paid profile is
published, verify Pages rollback operations, cache behavior, headers, custom-domain requirements,
and the business policy for using a GitHub-owned public URL. Do not issue a customer QR/NFC URL from
this candidate deployment.

## Owner Validation After Merge

1. Wait for the `Deploy GitHub Pages` workflow on `main` to complete.
2. Open the smoke profile and vCard URLs on desktop and phone.
3. Reload the profile URL directly, including a private/incognito browser window.
4. Confirm page source includes the profile content hash, build revision, JSON-LD, and no customer
   information beyond the fictional fixture.
5. Record the deployment URL and revision in the issue before considering a real profile host.
