# US-024 Mobile Swipe-Down Modal Close

## Status

implemented

## Lane

normal

## Product Contract

The spec allows an optional swipe-down close gesture for the mobile image detail
modal. This story adds a restrained gesture so touch users can dismiss the
modal by dragging downward without changing desktop modal behavior, keyboard
navigation, background click close, or image navigation.

## Relevant Product Docs

- `SPEC.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- Mobile and tablet touch users can close the open image modal with a downward swipe.
- Short taps and small pointer movement do not close the modal.
- Horizontal swipes do not close the modal or conflict with previous/next controls.
- Desktop pointer behavior remains unchanged.
- Reduced-motion users get no extra animated gesture treatment.
- Existing modal close button, backdrop click, Escape, ArrowLeft/ArrowRight, deep links, filters, sorting, and layout switching keep working.
- The visible phase label reflects the new story.

## Design Notes

- Commands: local pointer gesture handling on the modal article.
- Queries: none.
- API: no route or query parameter changes.
- Tables: none.
- Domain rules: a pure helper decides whether a pointer release is a mobile swipe-down close gesture.
- UI surfaces: image detail modal only.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-024 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Modal gesture helper tests cover mobile swipe close, small movement, horizontal movement, desktop suppression, and reduced-motion suppression. |
| Integration | Not required because the gesture is local client state over existing modal behavior. |
| E2E | Browser smoke verifies Phase 24 label, mobile swipe-down closes the modal, desktop modal still closes normally, sorting/layout controls still work, no horizontal overflow, and 0 console errors. |
| Platform | Production build passes. |
| Release | Not required for this modal gesture slice. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-19:

- RED: `npm.cmd run test -- src/lib/gallery/modal-gesture.test.ts` failed because `./modal-gesture` did not exist.
- `npm.cmd run test -- src/lib/gallery/modal-gesture.test.ts`: 3 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run test`: 89 passed.
- `npm.cmd run build`: pass.
- `npx.cmd --yes --package playwright node output/playwright/phase24-mobile-swipe-close-smoke.js`: desktop/mobile smoke verified Phase 24 label, desktop modal close still works, mobile synthetic touch swipe-down closes the modal, sorting/layout controls still work, mobile no horizontal overflow, and 0 console errors.
- Screenshots: `output/playwright/phase24-desktop-modal-close.png`, `output/playwright/phase24-mobile-swipe-close.png`.
