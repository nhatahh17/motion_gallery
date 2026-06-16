# US-006 3D Horizon Layout And Three-Mode Switcher

## Status

implemented

## Lane

normal

## Product Contract

Add the `horizon3d` layout mode so viewers can switch from the existing circle
layouts into a cinematic horizontal runway without resetting gallery progress.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- The app still opens in `2D Circle`.
- The layout switcher exposes `2D Circle`, `3D Circle`, and `3D Horizon` buttons.
- Switching to `3D Horizon` preserves the current progress value.
- `3D Horizon` arranges images in a readable horizontal strip with center images emphasized.
- Side images recede in depth and opacity instead of forming a flat row.
- Mobile `3D Horizon` is compact enough to remain usable.
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
`scripts/bin/harness-cli story update --id US-006 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Layout helper tests for `horizon3d` horizontal spacing, center emphasis, mobile compactness, autoplay speed, and mode dispatch. |
| Integration | Not required for this static client-side slice. |
| E2E | Browser smoke verifies layout switcher includes `3D Horizon`, switching updates UI, canvas stays non-blank, and no console errors occur. |
| Platform | Production build passes. |
| Release | Not in scope for Phase 6. |

## Harness Delta

No Harness policy changes expected. Browser verification provider remains absent,
so browser proof may use the same Playwright CLI fallback as prior phases.

## Evidence

- `npm.cmd run test -- src/lib/gallery/layout.test.ts` failed first with missing `horizon3d` dispatch, missing `getHorizon3DLayout`, and missing `horizon3d` autoplay speed.
- `npm.cmd run test -- src/lib/gallery/layout.test.ts` passed with 15 tests.
- `npm.cmd run test` passed with 30 tests.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed with Next.js 16.2.9.
- Playwright CLI desktop smoke confirmed the switcher exposes `3D Horizon`, the active button reaches `aria-pressed`, the canvas renders, and there were 0 console errors.
- Playwright CLI mobile smoke at 390x844 confirmed the active `3D Horizon` state, responsive switcher, rendered canvas, and 0 console errors.
- Browser warning observed: `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` This comes from dependency runtime in dev mode and did not block the story.
- Screenshots:
  - `output/playwright/phase6-desktop-horizon3d.png`
  - `output/playwright/phase6-mobile-horizon3d.png`
