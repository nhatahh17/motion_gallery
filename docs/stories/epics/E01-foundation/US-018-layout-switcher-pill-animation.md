# US-018 Layout Switcher Pill Animation

## Status

implemented

## Lane

normal

## Product Contract

Phase 9 polish should make layout switching feel more deliberate by moving a
single quiet active pill behind the selected layout button instead of changing
the active button as a hard visual cut.

## Relevant Product Docs

- `SPEC.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- The layout switcher renders one active pill element behind the selected layout.
- The pill moves when users switch between `2D Circle`, `3D Circle`, and `3D Horizon`.
- The active button still uses `aria-pressed` and remains keyboard accessible.
- Reduced motion removes the animated travel while preserving the active state.
- Mobile labels remain within the gallery shell without horizontal page overflow.
- The pill does not intercept pointer events or break canvas drag/modal behavior.

## Design Notes

- Commands: `npm.cmd run test -- src/lib/gallery/switcher.test.ts`, full test, typecheck, build, and Playwright smoke.
- Queries: no backend or network query.
- API: no route, query parameter, or public API change.
- Tables: none.
- Domain rules: active pill position is calculated by a pure helper.
- UI surfaces: layout switcher and page phase label.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-018 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Switcher helper tests cover active index, translate, and reduced-motion duration. |
| Integration | Not required for this client-only UI polish slice. |
| E2E | Browser smoke verifies pill presence, movement across layout buttons, modal open/close, and no console errors. |
| Platform | Production build passes. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-17:

- `npm.cmd run test -- src/lib/gallery/switcher.test.ts`: 2 passed.
- `npm.cmd run test`: 68 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run build`: pass.
- `npx.cmd --yes --package playwright node output/playwright/phase18-layout-switcher-pill-smoke.js`: desktop/mobile smoke verified Phase 17 label, active layout pill presence, pill transform movement after switching to 3D Horizon, modal open/close, no horizontal overflow, and 0 console errors.
- Screenshots: `output/playwright/phase18-desktop-layout-pill.png`, `output/playwright/phase18-mobile-layout-pill.png`.
