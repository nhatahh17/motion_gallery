# US-022 Privacy Safe Gallery Analytics Hooks

## Status

implemented

## Lane

normal

## Product Contract

The spec recommends MVP analytics events for gallery loading, layout changes,
image opening/closing, drag interaction, and reduced-motion detection. This
story adds privacy-safe client hooks that emit local `CustomEvent` records only;
it does not add a third-party provider, network request, cookie, or persistent
identifier.

## Relevant Product Docs

- `SPEC.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- Gallery load emits a `gallery_loaded` event once ready images are available.
- Layout switch emits `layout_changed` with the selected layout.
- Opening and closing a modal emit `image_opened` and `image_closed`.
- Pointer drag emits `drag_started` and `drag_ended`.
- Reduced-motion detection emits `reduced_motion_enabled` only when the media query is active.
- Events are dispatched as browser `CustomEvent`s under one stable event name and do not send network data.
- Existing layout switching, drag, modal, deep-link, reduced-motion, and mobile overflow behavior keep working.
- The visible phase label reflects the new story.

## Design Notes

- Commands: client-only UI events from existing gallery interactions.
- Queries: none.
- API: no HTTP route, query parameter, or external analytics provider.
- Tables: none.
- Domain rules: a pure helper builds sanitized analytics event details before dispatch.
- UI surfaces: gallery experience shell, layout switcher, modal open/close, pointer drag, phase label.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-022 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Analytics helper tests cover event names, sanitized details, and reduced-motion gating. |
| Integration | Not required because this story intentionally avoids provider/network integration. |
| E2E | Browser smoke verifies Phase 22 label, gallery analytics events for load/layout/open/close/drag, reduced-motion event, mobile no horizontal overflow, and 0 console errors. |
| Platform | Production build passes. |
| Release | Not required for this client hook slice. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

Verified on 2026-06-19:

- `npm.cmd run test -- src/lib/gallery/analytics.test.ts`: 4 passed.
- `npm.cmd run test`: 82 passed.
- `npm.cmd run typecheck`: pass.
- `npm.cmd run build`: pass.
- `npx.cmd --yes --package playwright node output/playwright/phase22-analytics-smoke.js`: desktop/mobile/reduced-motion smoke verified Phase 22 label, `gallery_loaded`, `layout_changed`, `drag_started`, `drag_ended`, `image_opened`, `image_closed`, and `reduced_motion_enabled` analytics events, no horizontal overflow, and 0 console errors.
- Screenshots: `output/playwright/phase22-desktop-analytics.png`, `output/playwright/phase22-mobile-analytics.png`, `output/playwright/phase22-desktop-reduced-motion.png`.
