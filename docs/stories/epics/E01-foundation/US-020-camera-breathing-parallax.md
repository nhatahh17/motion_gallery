# US-020 Camera Breathing And Pointer Parallax

## Status

implemented

## Lane

normal

## Product Contract

Phase 9 polish can add subtle camera breathing and desktop pointer parallax so
the gallery feels spatial while remaining calm, photo-first, and accessible.
The effect must not change gallery progress, image order, modal behavior, or
reduced-motion stability.

## Relevant Product Docs

- `SPEC.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- Desktop camera position breathes subtly over time while the gallery is idle.
- Desktop pointer movement adds a small parallax offset.
- Tablet and mobile use calmer camera movement than desktop.
- Reduced motion disables breathing and parallax.
- Modal open state disables camera movement and returns toward the base camera.
- Dragging, layout switching, modal open/close, and no-horizontal-overflow behavior continue to pass browser smoke.

## Design Notes

- Commands: focused camera helper tests, full test, typecheck, build, and Playwright smoke.
- Queries: no backend or network query.
- API: no route, query parameter, or public API change.
- Tables: none.
- Domain rules: a pure helper maps elapsed time, pointer offset, viewport, reduced motion, and modal state to camera position.
- UI surfaces: WebGL camera only.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-020 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Camera helper tests cover desktop breathing, pointer parallax, mobile strength, reduced motion, and modal-open behavior. |
| Integration | Not required for this client-only UI polish slice. |
| E2E | Browser smoke verifies camera debug position changes on desktop pointer movement, modal open/close still works, layout switching still works, no horizontal overflow, and 0 console errors. |
| Platform | Production build passes. |
| Release | Not required for this polish slice. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-17:

- `npm.cmd run test -- src/lib/gallery/camera.test.ts`: 3 passed.
- `npm.cmd run test`: 75 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run build`: pass.
- `npx.cmd --yes --package playwright node output/playwright/phase20-camera-parallax-smoke.js`: desktop/mobile smoke verified desktop canvas changes after pointer movement, `3D Horizon` switching, modal open/close, mobile no horizontal overflow, and 0 console errors.
- Screenshots: `output/playwright/phase20-desktop-camera-parallax.png`, `output/playwright/phase20-mobile-camera-parallax.png`.
