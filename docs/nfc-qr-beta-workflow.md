# Manual NFC/QR Beta Workflow

This is the repeatable, manual process for early Ckohl Works NFC/QR experiences. It is not a
self-service platform or redirect-management system.

## Beta test destination

After the GitHub Pages deployment is active, use this exact HTTPS URL for the first Margot's
Pizza test card and its QR fallback:

`https://s1gmas1x.github.io/ckohl-works/#/margots-pizza`

This route is a static Ckohl Works demonstration. It is appropriate for verifying the physical
tap/scan experience, but it does not provide dynamic redirects or analytics.

## Before writing a card

1. Confirm the Pages deployment has completed and open the URL on cellular data, not only the
   local network.
2. Keep the exact HTTPS URL in a plain-text note. The NFC NDEF URL record and the QR code must
   use the same value.
3. Select one blank card as the test card. Do not lock it before the full test succeeds.
4. Record the tag model/type and NFC-writing application in the test record below.

## Write and verify

1. Use an NFC-writing application to create one URL/NDEF URI record with the exact test URL.
2. Read the card back in the same application and confirm it contains no unexpected records.
3. Tap the card with an NFC-capable phone. Confirm the browser opens the expected Margot's Pizza
   page from a fresh browser session.
4. Create a QR code from the exact same URL. Scan it with the phone camera and confirm it opens
   the same page.
5. Repeat both checks with a second phone when available.
6. Photograph or label the card only after the result is recorded.

## Locking and delivery

- Leave the first test card unlocked until the tap and QR checks are both recorded as passing.
- Lock a delivery card only when the customer approves the destination and the content is final.
- Before delivery, test the locked card and its printed QR fallback one final time.
- Give the customer one clear contact method for destination-change requests.

## Failed card or incorrect destination

1. Do not deliver or lock a card with a failed test or incorrect URL.
2. If the tag is writable, overwrite it with the corrected URL and repeat all checks.
3. If the tag cannot be rewritten or remains unreliable, mark it failed, retain it for diagnosis,
   and replace it with a new blank card.
4. Document the replacement and preserve the working QR fallback while the card is replaced.

## Destination updates

The current beta is manual. A requested update means Ckohl Works updates the published page or
provides a replacement card/QR code when the exact URL must change. Dynamic redirects, customer
self-service, analytics dashboards, loyalty workflows, payments, and automated provisioning are
explicitly deferred.

## First test record

Complete this when the physical test is performed. Do not mark any item as verified beforehand.

| Field                               | Result                  |
| ----------------------------------- | ----------------------- |
| Test date                           | Pending                 |
| Operator                            | Pending                 |
| Tag model/type                      | Pending                 |
| NFC-writing application and version | Pending                 |
| Test card identifier                | Pending                 |
| NFC tap on primary phone            | Pending                 |
| QR fallback on primary phone        | Pending                 |
| Second-phone test                   | Pending / not available |
| Card locked after verification      | Pending                 |
| Notes or replacement decision       | Pending                 |
