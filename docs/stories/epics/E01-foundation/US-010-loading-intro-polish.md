# US-010 Loading Intro Polish

## Status

implemented

## Lane

normal

## Product Contract

Phase 9 adds a small loading intro polish layer after the core gallery is
stable. The first loading state should feel intentional and motion-gallery
specific, while never delaying access once gallery JSON is ready.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- Loading gallery data shows a branded intro surface instead of the raw loading copy.
- The intro communicates that local JSON images are being prepared.
- The intro is hidden when gallery data is ready or when the data loader reports an error.
- Reduced-motion users get a calmer/static intro state.
- The intro does not add a timer gate after data is ready.
- The intro does not change layout switching, drag, modal, or cursor behavior.
- The intro fits desktop and mobile without horizontal overflow.

## Design Notes

- Commands: none.
- Queries: local JSON data loading state only.
- API: no route or network contract changes.
- Tables: none.
- Domain rules: intro visibility is a pure helper driven by gallery data status, reduced motion, and image count.
- UI surfaces: loading branch of `GalleryExperience`.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-010 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Helper tests cover loading visibility, ready/error hidden states, reduced-motion copy, and count labels. |
| Integration | Not required for this static client-side slice. |
| E2E | Browser smoke verifies the gallery still loads, canvas remains visible, modal open still works, and console stays clean. |
| Platform | Production build passes. |
| Release | Not in scope for Phase 9. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be brought back
in sync with durable rows while closing this story.

## Evidence

- `npm.cmd run test -- src/lib/gallery/intro.test.ts` failed first because `src/lib/gallery/intro.ts` did not exist, then passed with 5 tests.
- `npm.cmd run test` passed with 48 tests across 7 files.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed with Next.js 16.2.9.
- Harness had no registered `browser-verification` provider, so Playwright fallback ran against local production server on port 3000.
- Playwright fallback desktop smoke verified the app title, Phase 9 label, one canvas, hidden loading intro after ready state, modal open/close, and 0 console errors.
- Playwright fallback mobile smoke verified one canvas, no horizontal overflow, hidden loading intro after ready state, modal open/close, and 0 console errors.
- The only console warning was `THREE.Clock` deprecation from the Three.js/R3F stack, not introduced by this story.
- Screenshots:
  - `output/playwright/phase10-loading-desktop.png`
  - `output/playwright/phase10-loading-desktop-modal.png`
  - `output/playwright/phase10-loading-mobile.png`
  - `output/playwright/phase10-loading-mobile-modal.png`
