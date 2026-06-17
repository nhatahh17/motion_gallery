# US-014 Wheel and Trackpad Navigation

## Status

implemented

## Lane

normal

## Product Contract

Post-MVP gallery viewers can use mouse wheel or trackpad gestures to move the
gallery progress without switching layouts, opening the modal, or using pointer
drag.

## Relevant Product Docs

- `SPEC.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- Wheel or trackpad input changes gallery progress.
- Horizontal trackpad movement is respected when it is the dominant gesture.
- Extreme wheel bursts are clamped so the gallery does not jump chaotically.
- Wheel input pauses autoplay briefly and then lets autoplay resume.
- Reduced motion ignores wheel-driven motion.
- Existing drag, layout switching, category filters, and modal interactions keep working.

## Design Notes

- Commands: `npm.cmd run test -- src/lib/gallery/interaction.test.ts`, full test, typecheck, build, and Playwright smoke.
- Queries: no backend or network query.
- API: no route, query parameter, or public API change.
- Tables: none.
- Domain rules: wheel deltas are normalized through pure interaction helpers before mutating progress refs.
- UI surfaces: `GalleryCanvas`, `useGalleryProgress`, and the page phase label.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-014 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Interaction helper tests cover vertical wheel, horizontal trackpad dominance, mobile sensitivity, and clamp behavior. |
| Integration | Not required for this client-side interaction slice. |
| E2E | Browser smoke verifies wheel input changes the gallery shell rendering without console errors. |
| Platform | Production build passes. |
| Release | Public deployment URL validation remains outside this local post-MVP slice. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-17:

- `npm.cmd run test -- src/lib/gallery/interaction.test.ts`: 13 passed.
- `npm.cmd run test`: 59 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run build`: pass.
- `node output/playwright/phase14-wheel-smoke.js`: desktop/mobile smoke verified wheel input changes the rendered gallery page, horizontal wheel works after switching to `3D Horizon`, modal open/close still works, and 0 console errors.
- Screenshots: `output/playwright/phase14-desktop-wheel.png`, `output/playwright/phase14-mobile-wheel.png`.
