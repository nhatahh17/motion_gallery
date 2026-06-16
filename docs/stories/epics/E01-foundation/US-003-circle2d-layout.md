# US-003 Default 2D Circle Multi-Ring Layout

## Status

implemented

## Lane

normal

## Product Contract

Implement the default `circle2d` gallery layout so images orbit in multiple
elliptical rings with gentle autoplay, responsive sizing, and reduced-motion
respect.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- On page load, the gallery uses the `2D Circle` layout.
- Images are distributed across at least two visual rings.
- 30+ images do not appear as a single dense cluster.
- Rings move gently when idle.
- Primary ring images are clearer than background ring images.
- The center remains visually breathable.
- Mobile uses smaller radius, scale, and opacity emphasis.
- The layout remains centered after viewport resize.
- Autoplay is paused when reduced motion is active.

## Design Notes

- Commands: `npm.cmd run test`, `npm.cmd run typecheck`, `npm.cmd run build`.
- Queries: local JSON through `useGalleryData`.
- API: no backend API in this story.
- Tables: none.
- Domain rules: layout placement is a pure helper driven by image index, total count, progress, and viewport mode.
- UI surfaces: `GalleryCanvas`, `GalleryScene`, `GalleryImagePlane`.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-003 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | `circle2d` layout helper covers ring distribution, progress movement, visual emphasis, and mobile config. |
| Integration | Not required; data remains static public JSON. |
| E2E | Browser smoke verifies Canvas renders the default circle layout without app console errors. |
| Platform | `npm.cmd run build` completes. |
| Release | Not in scope for Phase 3. |

## Harness Delta

Missing codegraph/browser-verification providers remain operational friction.

## Evidence

- RED: `npm.cmd run test -- src/lib/gallery/layout.test.ts` failed because `src/lib/gallery/layout.ts` did not exist.
- GREEN: `npm.cmd run test -- src/lib/gallery/layout.test.ts` passed with 6 layout/autoplay tests.
- `npm.cmd run test` passed with 13 tests.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed with Next.js 16.2.9.
- Playwright CLI fallback loaded `http://127.0.0.1:3108/` on desktop and mobile with 0 console errors.
- Browser snapshot confirmed Phase 3 copy and `30 images loaded`.
- Canvas pixel/data signals were non-zero:
  - desktop canvas box `1178x418`, data URL length `15126`
  - mobile canvas box `352x488`, data URL length `7150`
- Screenshots:
  - `output/playwright/phase3-desktop-circle2d.png`
  - `output/playwright/phase3-mobile-circle2d.png`
