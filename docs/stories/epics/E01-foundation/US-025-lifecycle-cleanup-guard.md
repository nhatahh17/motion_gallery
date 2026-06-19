# US-025 Lifecycle Cleanup Guard

## Status

implemented

## Lane

normal

## Product Contract

The spec requires no obvious memory leaks after repeated modal open/close and
layout interactions. This story adds a small cleanup guard so modal, drag,
cursor, camera, and analytics refs return to a neutral state when the gallery
unmounts or modal state is force-cleared by filters, sorting, or deep-link
changes.

## Relevant Product Docs

- `SPEC.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- A shared cleanup helper resets modal, drag, cursor, camera, velocity, swipe, click, and drag analytics state.
- Gallery unmount runs the cleanup helper so repeated visits do not leave stale refs.
- Forced modal clears from filter, sort, or deep-link changes use the same cleanup helper.
- Normal modal close behavior keeps existing analytics, URL, and autoplay resume behavior.
- Existing drag, sorting, layout switching, swipe-down close, keyboard modal controls, and reduced-motion behavior keep working.
- The visible phase label reflects the new story.

## Design Notes

- Commands: local client lifecycle cleanup only.
- Queries: none.
- API: no route, query parameter, or data shape changes.
- Tables: none.
- Domain rules: a pure helper resets mutable gallery lifecycle refs without touching React state directly.
- UI surfaces: gallery canvas lifecycle and phase label.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-025 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Lifecycle helper tests cover full reset, preserved selected image by default, and selected image clearing when requested. |
| Integration | Not required because cleanup is local client state over existing gallery behavior. |
| E2E | Browser smoke verifies Phase 25 label, modal open/close, sort/filter forced modal clear, layout switching, mobile no horizontal overflow, and 0 console errors. |
| Platform | Production build passes. |
| Release | Not required for this lifecycle hardening slice. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-19:

- RED: `npm.cmd run test -- src/lib/gallery/lifecycle.test.ts` failed because `./lifecycle` did not exist.
- `npm.cmd run test -- src/lib/gallery/lifecycle.test.ts`: 2 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run test`: 91 passed.
- `npm.cmd run build`: pass.
- `npx.cmd --yes --package playwright node output/playwright/phase25-lifecycle-cleanup-smoke.js`: desktop/mobile smoke verified Phase 25 label, invalid deep-link cleanup, filter/sort/layout controls, modal open/close, mobile no horizontal overflow, and 0 console errors.
- Screenshots: `output/playwright/phase25-desktop-lifecycle-cleanup.png`, `output/playwright/phase25-mobile-lifecycle-cleanup.png`.
