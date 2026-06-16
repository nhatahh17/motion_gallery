# US-007 Image Detail Modal

## Status

implemented

## Lane

normal

## Product Contract

Clicking or tapping a gallery image opens a quiet detail modal with the full image
and metadata from local JSON. Gallery motion pauses while the modal is open and
resumes after it closes.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- Clicking or tapping an image plane opens a detail modal for that image.
- The modal shows the full-size image, title or alt text, location, year, category, and optional camera/lens/date metadata.
- The modal can be closed by close button, backdrop click, or Escape.
- Opening the modal pauses autoplay and drag-driven motion.
- Closing the modal resumes autoplay after the existing idle delay.
- Dragging the gallery does not accidentally open the modal.
- The modal works on desktop and mobile without covering controls incoherently.

## Design Notes

- Commands: image plane click selects a gallery image; close clears selection.
- Queries: none.
- API: no route or network contract changes.
- Tables: none.
- Domain rules: modal selection is pure image lookup by id; drag distance separates click from drag.
- UI surfaces: WebGL image planes and DOM detail modal.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-007 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Detail helper tests for image lookup and click-vs-drag threshold. |
| Integration | Not required for this static client-side slice. |
| E2E | Browser smoke opens the modal from the canvas, verifies metadata, closes with Escape, and checks for console errors. |
| Platform | Production build passes. |
| Release | Not in scope for Phase 7. |

## Harness Delta

No Harness policy changes expected. Browser verification may use the same
Playwright CLI fallback as prior phases if no registered browser provider exists.

## Evidence

- `npm.cmd run test -- src/lib/gallery/detail.test.ts` failed first because `src/lib/gallery/detail.ts` did not exist.
- `npm.cmd run test -- src/lib/gallery/detail.test.ts` passed with 4 tests, then passed with 6 tests after adding focused-image fallback coverage.
- `npm.cmd run test` passed with 36 tests.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed with Next.js 16.2.9.
- Playwright CLI production desktop smoke loaded 30 JSON images, opened a detail modal from the gallery shell, showed `Pale Corner`, `Daily / 2025`, and `Da Lat, Vietnam`, closed with Escape, and had 0 console errors.
- Playwright CLI production mobile smoke at 390x844 opened the modal with `Morning Glass`, `Daily / 2025`, and `Da Lat, Vietnam`, with 0 console errors.
- Browser warning observed: `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` This is the same dependency runtime warning observed in Phase 6 and did not block the story.
- Screenshots:
  - `output/playwright/phase7-desktop-modal.png`
  - `output/playwright/phase7-mobile-modal.png`
