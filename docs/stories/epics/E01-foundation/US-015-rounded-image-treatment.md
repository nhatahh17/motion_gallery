# US-015 Rounded Image Treatment

## Status

implemented

## Lane

normal

## Product Contract

Post-MVP gallery images should have a subtle rounded treatment in both WebGL
planes and the detail modal so the experimental polish feels intentional without
distorting photos or weakening the existing interaction contract.

## Relevant Product Docs

- `SPEC.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- WebGL image planes render with a subtle rounded rectangle silhouette.
- Rounded geometry keeps each image's configured width and height bounds.
- The corner radius is clamped so very small planes do not collapse.
- Modal full-size images use matching rounded treatment.
- Reduced motion, drag, wheel navigation, layout switching, filters, and modal interactions keep working.

## Design Notes

- Commands: `npm.cmd run test -- src/lib/gallery/rounded-plane.test.ts`, full test, typecheck, build, and Playwright smoke.
- Queries: no backend or network query.
- API: no route, query parameter, or public API change.
- Tables: none.
- Domain rules: rounded plane geometry is calculated by a pure helper and consumed by `GalleryImagePlane`.
- UI surfaces: `GalleryImagePlane`, `ImageDetailModal` styles, and the page phase label.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-015 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Rounded plane helper tests cover clamping, bounds, and segment generation. |
| Integration | Not required for this client-side polish slice. |
| E2E | Browser smoke verifies rounded geometry metadata, modal rounded image style, existing wheel/layout/modal flow, and 0 console errors. |
| Platform | Production build passes. |
| Release | Public deployment URL validation remains outside this local post-MVP slice. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-17:

- `npm.cmd run test -- src/lib/gallery/rounded-plane.test.ts`: 2 passed.
- `npm.cmd run test`: 61 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run build`: pass.
- `npx.cmd --yes --package playwright node output/playwright/phase15-rounded-smoke.js`: desktop/mobile smoke verified Phase 14 label, canvas load, `3D Horizon` switch, modal open/close, modal image `10px` rounded treatment, and 0 console errors.
- Screenshots: `output/playwright/phase15-desktop-rounded.png`, `output/playwright/phase15-mobile-rounded.png`.
