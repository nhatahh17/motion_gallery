# US-005 3D Circle Layout And Switcher

## Status

implemented

## Lane

normal

## Product Contract

Add the `circle3d` layout mode and a quiet layout switcher so viewers can move
from the default 2D Circle orbit into a spatial 3D ring without resetting
gallery progress.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- The app still opens in `2D Circle`.
- A top-right layout switcher exposes `2D Circle` and `3D Circle` buttons with a clear active state.
- Switching layout preserves the current progress value rather than resetting the gallery.
- `3D Circle` places images around the Y-axis with obvious depth.
- Front images render larger and clearer than back images.
- Mobile `3D Circle` is more compact and calmer than desktop.
- Drag, touch, inertia, and autoplay continue to drive the active layout.

## Design Notes

- Commands: layout switch changes client gallery mode only.
- Queries: none.
- API: no route or network contract changes.
- Tables: none.
- Domain rules: layout placement remains pure and driven by image index, total count, progress, viewport, and layout mode.
- UI surfaces: gallery canvas, header layout switcher.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-005 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Layout helper tests for `circle3d` depth, front/back emphasis, mobile compactness, autoplay speed, and mode dispatch. |
| Integration | Not required for this static client-side slice. |
| E2E | Browser smoke verifies layout switcher is visible, switching to `3D Circle` updates UI, canvas stays non-blank, and no console errors occur. |
| Platform | Production build passes. |
| Release | Not in scope for Phase 5. |

## Harness Delta

No Harness policy changes expected. Browser verification provider remains absent,
so browser proof may use the same Playwright CLI fallback as prior phases.

## Evidence

- `npm.cmd run test -- src/lib/gallery/layout.test.ts` failed first with missing `getCircle3DLayout`, `getGalleryLayout`, and `getGalleryAutoplayStep`.
- `npm.cmd run test -- src/lib/gallery/layout.test.ts` passed with 11 tests.
- `npm.cmd run test` passed with 26 tests.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed with Next.js 16.2.9.
- Playwright CLI desktop smoke confirmed `3D Circle` button reaches `aria-pressed`, canvas renders the 3D ring, and there were 0 console errors.
- Playwright CLI mobile smoke at 390x844 confirmed the active `3D Circle` state, responsive switcher, rendered canvas, and 0 console errors.
- Browser warning observed: `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` This comes from dependency runtime in dev mode and did not block the story.
- Screenshots:
  - `output/playwright/phase5-desktop-circle2d.png`
  - `output/playwright/phase5-desktop-circle3d.png`
  - `output/playwright/phase5-mobile-circle3d.png`
