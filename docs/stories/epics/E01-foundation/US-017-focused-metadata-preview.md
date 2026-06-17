# US-017 Focused Metadata Preview

## Status

implemented

## Lane

normal

## Product Contract

Post-MVP exploration should reveal quiet metadata for the currently focused
gallery image without opening the modal, matching the spec's optional current
metadata preview while keeping the photo-first canvas uncluttered.

## Relevant Product Docs

- `SPEC.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- The gallery shell shows a subtle HUD preview for the image nearest the current progress.
- The preview uses the image title when present and falls back to alt text.
- The preview shows location, year, and category.
- The preview updates as drag, wheel, autoplay, filters, and layout switching change focus.
- The preview hides while a detail modal is open.
- An empty filtered gallery does not show stale preview metadata.
- The preview does not update React state on every animation frame.

## Design Notes

- Commands: `npm.cmd run test -- src/lib/gallery/detail.test.ts`, full test,
  typecheck, build, and Playwright smoke.
- Queries: no backend or network query.
- API: no route, query parameter, or public API change.
- Tables: none.
- Domain rules: focused preview text is chosen by a pure helper.
- UI surfaces: `GalleryCanvas` HUD and page phase label.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-017 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Detail helper tests cover title fallback, metadata text, wrapping progress, and empty image lists. |
| Integration | Not required for this client-only HUD polish slice. |
| E2E | Browser smoke verifies the focused metadata HUD appears, changes after wheel input, hides while modal is open, and console errors stay at 0. |
| Platform | Production build passes. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-17:

- `npm.cmd run test -- src/lib/gallery/detail.test.ts`: 15 passed.
- `npm.cmd run test`: 66 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run build`: pass.
- `npx.cmd --yes --package playwright node output/playwright/phase17-focused-preview-smoke.js`: desktop/mobile smoke verified Phase 16 label, focused metadata preview appears, wheel-driven focus changes preview copy, preview hides while modal is open, preview returns after close, and 0 console errors.
- Screenshots: `output/playwright/phase17-desktop-focused-preview.png`, `output/playwright/phase17-mobile-focused-preview.png`.
