# US-002 WebGL Gallery Foundation

## Status

implemented

## Lane

normal

## Product Contract

Render validated gallery JSON images as WebGL planes through React Three Fiber.
The WebGL layer must use thumbnail paths, preserve each image aspect ratio, and
remain stable when a thumbnail fails to load.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/data.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- WebGL Canvas fills the primary viewport.
- Images render as planes using `thumbSrc`.
- Landscape, portrait, and square sample images are not distorted.
- DPR is clamped for desktop and mobile.
- Full-size image paths are not used for WebGL planes.
- Frame-critical values do not update React state every frame.
- Empty or failed texture loading does not crash the whole page.
- The scene remains ready to scale beyond the current sample data.

## Design Notes

- Commands: `npm.cmd run test`, `npm.cmd run typecheck`, `npm.cmd run build`.
- Queries: `public/data/gallery.json` through `useGalleryData`.
- API: no backend API in this story.
- Tables: none.
- Domain rules: plane aspect ratio derives from `width / height` and clamps to
  maximum WebGL plane dimensions.
- UI surfaces: root page, `GalleryCanvas`, `GalleryScene`, `GalleryImagePlane`.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-002 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Plane sizing helper covers landscape, portrait, and square image metadata. |
| Integration | Not required; data remains static public JSON. |
| E2E | Browser smoke verifies Canvas exists, texture-backed planes render, and no console errors occur. |
| Platform | `npm.cmd run build` completes. |
| Release | Not in scope for Phase 2. |

## Harness Delta

No Harness policy change is expected. Missing registered browser and codegraph
providers should remain visible as trace friction until those backlog items are
accepted.

## Evidence

Add commands, reports, screenshots, or links after validation exists.

- `npm.cmd run test` passed with 7 tests.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed with Next.js 16.2.9.
- Playwright CLI fallback loaded `http://127.0.0.1:3107/` on desktop and
  mobile, found title `Personal Motion Gallery`, found visible Canvas, and
  found `3 images loaded`.
- Browser resource entries confirmed WebGL texture requests used:
  - `/images/gallery/thumbs/photo-001.png`
  - `/images/gallery/thumbs/photo-002.png`
  - `/images/gallery/thumbs/photo-003.png`
- Screenshots:
  - `output/playwright/phase2-desktop-textures.png`
  - `output/playwright/phase2-mobile-textures.png`
- Console: no app errors; Playwright reported the upstream
  `THREE.Clock` deprecation warning from the current Three/R3F dev bundle.
