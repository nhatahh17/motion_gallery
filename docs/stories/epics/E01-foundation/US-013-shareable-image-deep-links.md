# US-013 Shareable Image Deep Links

## Status

implemented

## Lane

normal

## Product Contract

Post-MVP gallery viewers can open a shareable URL for a specific image detail
modal from the single-page gallery. The route remains the gallery page and uses
a URL query state instead of adding a separate photo page.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/experience.md`
- `docs/product/data.md`
- `docs/product/technical.md`

## Acceptance Criteria

- Opening `/?photo=<image-id>` opens the matching image detail modal after JSON data loads.
- Opening an unknown `photo` id leaves the gallery usable without a broken modal.
- Opening a modal updates the URL with the selected image id.
- Closing the modal removes the `photo` query parameter without resetting layout or category state.
- Previous/next modal navigation updates the URL to the new selected image id.
- Category filtering keeps the URL consistent if the linked image is no longer visible.

## Design Notes

- Commands: `npm.cmd run test -- src/lib/gallery/detail.test.ts`, full test, typecheck, build, and Playwright smoke.
- Queries: `photo` query state is parsed client-side after gallery data is ready.
- API: no backend API or separate detail route is introduced.
- Tables: none.
- Domain rules: only ids present in the currently visible image set can keep a modal open.
- UI surfaces: `GalleryExperience`, `GalleryCanvas`, modal navigation, and the page phase label.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-013 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Detail URL helpers parse, apply, and clear selected image ids. |
| Integration | Not required for this client-side URL state slice. |
| E2E | Browser smoke verifies direct modal URL, next navigation URL update, close URL cleanup, and unknown id fallback. |
| Platform | Production build passes. |
| Release | Public deployment URL validation remains outside this local post-MVP slice. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-17:

- `npm.cmd run test -- src/lib/gallery/detail.test.ts`: 10 passed.
- `npm.cmd run test`: 56 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run build`: pass.
- `node output/playwright/phase13-deep-link-smoke.js`: desktop/mobile smoke opened `?photo=photo-002`, advanced modal URL to `photo-003`, removed `photo` on close, ignored an unknown image id, and found 0 console errors.
- Screenshots: `output/playwright/phase13-desktop-deep-link.png`, `output/playwright/phase13-mobile-deep-link.png`.
