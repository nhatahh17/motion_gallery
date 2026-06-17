# US-016 Smooth Modal Image Preloading

## Status

implemented

## Lane

normal

## Product Contract

Post-MVP modal navigation should feel smoother by preloading the adjacent
full-size images while a detail modal is open, without loading every full-size
asset at startup or changing the existing gallery interaction contract.

## Relevant Product Docs

- `SPEC.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- Opening an image detail modal exposes preload hints for the previous and next full-size images.
- Preload targets use `src`, not `thumbSrc`.
- Preload targets wrap around the filtered gallery image list.
- A one-image gallery does not preload the currently open image twice.
- Closing the modal removes modal-specific preload hints.
- Existing modal next/previous navigation, deep links, layout switching, drag, wheel navigation, and rounded image treatment keep working.

## Design Notes

- Commands: `npm.cmd run test -- src/lib/gallery/detail.test.ts`, full test, typecheck, build, and Playwright smoke.
- Queries: no backend or network query.
- API: no route, query parameter, or public API change.
- Tables: none.
- Domain rules: adjacent modal preload targets are chosen by a pure helper.
- UI surfaces: `GalleryCanvas` modal render branch and page phase label.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-016 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Detail helper tests cover adjacent full-size preload targets, wrapping, missing selections, and one-image galleries. |
| Integration | Not required for this client-only performance polish slice. |
| E2E | Browser smoke verifies modal preload links appear while open, disappear after close, existing modal navigation still works, and console errors stay at 0. |
| Platform | Production build passes. |
| Release | Public deployment URL validation remains outside this local post-MVP slice. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-17:

- `npm.cmd run test -- src/lib/gallery/detail.test.ts`: 12 passed.
- `npm.cmd run test`: 63 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run build`: pass.
- `npx.cmd --yes --package playwright node output/playwright/phase16-modal-preload-smoke.js`: desktop/mobile smoke verified Phase 15 label, modal preload links while open, full-size image targets instead of thumbnails, Next image navigation, preload link removal after Escape close, and 0 console errors.
- Screenshots: `output/playwright/phase16-desktop-modal-preload.png`, `output/playwright/phase16-mobile-modal-preload.png`.
