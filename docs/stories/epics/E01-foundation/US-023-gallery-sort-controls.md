# US-023 Gallery Sort Controls

## Status

implemented

## Lane

normal

## Product Contract

The spec leaves image ordering as an open post-prototype decision. This story
adds quiet client-side sort controls so viewers can keep the manual gallery
sequence or reorder the current filtered set by newest year, location, or
category without changing JSON data or adding backend state.

## Relevant Product Docs

- `SPEC.md`
- `docs/product/overview.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- The gallery defaults to the manual JSON order.
- Viewers can switch sort mode between manual, newest, location, and category.
- Sorting applies after the active category filter and does not mutate source image data.
- Sort controls use real buttons with `aria-pressed`.
- Changing sort mode closes any open modal whose image is no longer selected by the current ordered set.
- Existing layout switching, category filtering, deep links, modal navigation, reduced-motion behavior, and mobile overflow behavior keep working.
- A privacy-safe local analytics event records sort changes without network calls or persistent identifiers.
- The visible phase label reflects the new story.

## Design Notes

- Commands: client-only sort selection from existing gallery controls.
- Queries: none.
- API: no HTTP route or query parameter; sort mode is session-local UI state.
- Tables: none.
- Domain rules: pure helper sorts images by mode while preserving source array identity for manual order.
- UI surfaces: gallery control bar, gallery image ordering, modal adjacent navigation, phase label.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-023 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Sort helper tests cover manual order, newest year, location, category, and source immutability. |
| Integration | Not required because sorting is client-only state over static JSON. |
| E2E | Browser smoke verifies Phase 23 label, sort mode controls, filter + sort composition, modal open/close, mobile no horizontal overflow, and 0 console errors. |
| Platform | Production build passes. |
| Release | Not required for this client sorting slice. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-19:

- RED: `npm.cmd run test -- src/lib/gallery/category.test.ts` failed because `sortGalleryImages` did not exist.
- `npm.cmd run test -- src/lib/gallery/category.test.ts`: 7 passed.
- `npm.cmd run test -- src/lib/gallery/analytics.test.ts`: 5 passed.
- `npm.cmd run test`: 86 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run build`: pass.
- `npx.cmd --yes --package playwright node output/playwright/phase23-sort-controls-smoke.js`: desktop/mobile smoke verified Phase 23 label, sort controls, filter + sort composition, modal open/close, `sort_changed` local analytics event, no horizontal overflow, and 0 console errors.
- Screenshots: `output/playwright/phase23-desktop-sort-controls.png`, `output/playwright/phase23-mobile-sort-controls.png`.
