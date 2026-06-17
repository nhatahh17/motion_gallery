# US-019 Drag Orbit Expansion

## Status

implemented

## Lane

normal

## Product Contract

Phase 9 polish should make drag exploration feel tactile by opening the active
gallery layout slightly while the pointer is dragging. The effect must preserve
progress, image order, click handling, reduced-motion behavior, and mobile
stability.

## Relevant Product Docs

- `SPEC.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- Dragging expands the current layout subtly instead of leaving the gallery at the exact idle radius/spacing.
- `circle2d`, `circle3d`, and `horizon3d` keep their existing image order and progress semantics while expanded.
- The expansion is weaker on mobile than desktop.
- Reduced motion disables the expansion.
- The effect stops when dragging ends and does not persist during modal open.
- Modal open/close, layout switching, and no-horizontal-overflow behavior still pass browser smoke.

## Design Notes

- Commands: focused layout tests, full test, typecheck, build, and Playwright smoke.
- Queries: no backend or network query.
- API: no route, query parameter, or public API change.
- Tables: none.
- Domain rules: a pure helper maps dragging/reduced-motion/viewport to a layout expansion factor.
- UI surfaces: WebGL gallery planes only.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-019 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Layout helper tests cover expansion factor, reduced motion, mobile strength, and all three layout modes. |
| Integration | Not required for this client-only UI polish slice. |
| E2E | Browser smoke verifies drag changes gallery rendering, modal open/close still works, layout switching still works, and no console errors occur. |
| Platform | Production build passes. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-17:

- `npm.cmd run test -- src/lib/gallery/layout.test.ts`: 19 passed.
- `npm.cmd run test`: 72 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run build`: pass.
- `npx.cmd --yes --package playwright node output/playwright/phase19-drag-orbit-expansion-smoke.js`: desktop/mobile smoke verified Phase 18 label, drag changes gallery rendering without opening the modal, `3D Horizon` layout switching still works, modal open/close still works, no horizontal overflow, and 0 console errors.
- Screenshots: `output/playwright/phase19-desktop-drag-expansion.png`, `output/playwright/phase19-mobile-drag-expansion.png`.
