# Chad Static Profile Production Host

## Decision

Use the existing Netlify deployment behind `https://works.ckohl.com` as the first customer-safe
static-profile host. The final Chad destination is:

```text
https://works.ckohl.com/card/ckohl-works/chad/
```

This keeps the managed destination on the established Ckohl Works domain and avoids making a
GitHub-owned Pages URL the customer-facing product surface. GitHub Pages remains a fictional smoke
profile proof only.

## Deployment Contract

`netlify.toml` builds `dist/static-profiles` through the existing staged static-profile command with
`STATIC_PROFILE_SLUGS=chad`. The artifact contains:

- the existing marketing SPA at the site root;
- Chad's static HTML profile, metadata, JSON-LD, and public assets;
- `contacts/chad-kohl.vcf`;
- no Pikes Peak Handyman fixture or vCard.

The build generates a complete artifact in a temporary directory and promotes it only after Quasar
and profile generation succeed. Netlify publishes complete deploys and retains deploy history, so a
failed build leaves the existing deploy online and a previous successful deploy can be restored from
the Netlify dashboard.

## Verification After Merge

1. Confirm the Netlify production deploy for the merged revision succeeds.
2. Direct-load and reload `https://works.ckohl.com/card/ckohl-works/chad/` on desktop and phone.
3. Verify page source includes Chad metadata, JSON-LD, content hash, and build revision.
4. Download `https://works.ckohl.com/contacts/chad-kohl.vcf` and verify the contact data.
5. Give this exact destination URL to NewAPI issue #5 before changing `go.ckohl.com/chad`.

No DNS change is required for this issue because `works.ckohl.com` is already HTTPS-enabled on the
existing Netlify site. Any future dedicated profile hostname requires a separate domain decision and
platform configuration.
