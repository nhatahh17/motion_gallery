# US-012 Category Filter Controls

## Status

implemented

## Lane

normal

## Product Contract

Post-MVP gallery viewers can narrow the visible motion gallery by image
category while preserving the same layout, drag, modal, and metadata contracts.
The control is intentionally quiet and local-only; it does not add deep links,
CMS behavior, analytics, or a separate route.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/experience.md`
- `docs/product/data.md`
- `docs/product/technical.md`

## Acceptance Criteria

- The gallery derives category options from `gallery.json` data.
- The category control includes an `All` option.
- Selecting a category filters the WebGL planes and the debug list to matching
  images.
- Selecting `All` restores the full image set.
- Filtering does not reset the current layout mode.
- If the active selected image is no longer in the filtered set, modal state is
  cleared.
- The control remains compact on mobile and does not overlap the layout
  switcher.

## Design Notes

- Commands: `npm.cmd run test -- src/lib/gallery/category.test.ts`, full test,
  typecheck, build, and Playwright smoke.
- Queries: category options are derived client-side from loaded images.
- API: no route or public API changes.
- Tables: none.
- Domain rules: category matching is exact and case-sensitive to the data
  contract; `all` is a UI sentinel, not a JSON category.
- UI surfaces: gallery shell control row and gallery debug list props.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-012 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Category helper tests cover option derivation and filtering. |
| Integration | Not required for this local JSON/client-only slice. |
| E2E | Browser smoke verifies category buttons filter visible debug/image count and modal still opens. |
| Platform | Production build passes. |
| Release | Public deployment URL validation remains outside this local post-MVP slice. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-17:

- `npm.cmd run test -- src/lib/gallery/category.test.ts`: 4 passed.
- `npm.cmd run test`: 54 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run build`: pass.
- `node output/playwright/phase12-category-filter-smoke.js`: desktop/mobile smoke filtered `Street`, restored `All`, switched to `3D Horizon`, opened/closed modal, found 0 console errors, and found no horizontal overflow.
- Screenshots: `output/playwright/phase12-desktop-category-filter.png`, `output/playwright/phase12-mobile-category-filter.png`.
