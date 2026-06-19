# US-021 WebGL To DOM Transition Hint

## Status

implemented

## Lane

normal

## Product Contract

Phase 9 polish can make modal opening feel more connected to the WebGL gallery
by adding a lightweight transition hint. The modal should enter as if it comes
from the currently focused frame, without requiring fragile WebGL screen-space
measurement or changing image selection, deep links, keyboard navigation, or
reduced-motion behavior.

## Relevant Product Docs

- `SPEC.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- Opening a focused image applies a modal transition state tied to that image.
- Reduced motion disables the connected opening treatment and keeps the simple modal presentation.
- The transition uses deterministic CSS variables/classes rather than reading WebGL internals.
- Existing modal close, previous/next navigation, deep links, layout switching, and mobile overflow behavior keep working.
- The visible phase label reflects the new polish story.

## Design Notes

- Commands: focused transition helper tests, full test, typecheck, build, and Playwright smoke.
- Queries: no backend or network query.
- API: no route, query parameter, or public API change.
- Tables: none.
- Domain rules: a pure helper maps selected image, focused image, viewport, and reduced motion to modal transition metadata.
- UI surfaces: image detail modal and page phase label.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-021 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Transition helper tests cover focused selection, fallback selection, and reduced-motion disablement. |
| Integration | Not required for this client-only UI polish slice. |
| E2E | Browser smoke verifies Phase 21 label, modal transition attribute, reduced-motion disablement, modal navigation, layout switching, mobile no horizontal overflow, and 0 console errors. |
| Platform | Production build passes. |
| Release | Not required for this polish slice. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-17:

- `npm.cmd run test -- src/lib/gallery/modal-transition.test.ts`: 3 passed.
- `npm.cmd run test`: 78 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run build`: pass.
- `npx.cmd --yes --package playwright node output/playwright/phase21-modal-transition-smoke.js`: desktop/mobile smoke verified Phase 21 label, modal transition metadata, reduced-motion transition disablement, modal next/close, `3D Horizon` switching, no horizontal overflow, and 0 console errors.
- Screenshots: `output/playwright/phase21-desktop-modal-transition.png`, `output/playwright/phase21-desktop-reduced-motion.png`, `output/playwright/phase21-mobile-modal-transition.png`.
