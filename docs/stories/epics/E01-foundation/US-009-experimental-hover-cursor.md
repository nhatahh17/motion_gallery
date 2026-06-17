# US-009 Experimental Hover Cursor Polish

## Status

implemented

## Lane

normal

## Product Contract

Phase 9 adds a small experimental polish layer after the core gallery is stable:
desktop viewers should get a quiet motion cursor that communicates when an
image can be viewed, while reduced-motion and touch/mobile contexts keep the
standard pointer behavior.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- Desktop pointer hover over a gallery image sets a visible `View` cursor state.
- Dragging the gallery sets a `Drag` cursor state instead of opening hover polish.
- Reduced-motion users do not get animated cursor polish.
- Mobile and tablet viewports keep the native cursor behavior.
- Modal-open state hides the motion cursor.
- The polish does not change click, drag, layout switching, or modal navigation behavior.

## Design Notes

- Commands: pointer hover and drag state update client-only cursor presentation.
- Queries: none.
- API: no route or network contract changes.
- Tables: none.
- Domain rules: cursor visibility is a pure helper driven by viewport, reduced motion, modal, dragging, and hover target state.
- UI surfaces: gallery canvas shell and WebGL image planes.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-009 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Helper tests for motion cursor state across desktop, mobile, dragging, modal, and reduced-motion states. |
| Integration | Not required for this static client-side slice. |
| E2E | Browser smoke verifies the gallery still loads, canvas remains visible, modal open still works, and console stays clean. |
| Platform | Production build passes. |
| Release | Not in scope for Phase 9. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be brought back
in sync with durable rows while closing this story.

## Evidence

- `npm.cmd run test -- src/lib/gallery/cursor.test.ts` failed first because `src/lib/gallery/cursor.ts` did not exist, then passed with 3 tests.
- `npm.cmd run test` passed with 43 tests.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed with Next.js 16.2.9.
- Harness had no registered `browser-verification` provider, so Playwright fallback ran against local production server on Edge channel.
- Playwright fallback desktop smoke verified the motion cursor becomes visible with `View`, modal still opens/closes with Escape, and console errors stayed at 0.
- Playwright fallback mobile smoke verified the motion cursor remains hidden, modal still opens/closes with Escape, and console errors stayed at 0.
- Screenshots:
  - `output/playwright/phase9-desktop-cursor.png`
  - `output/playwright/phase9-desktop-smoke.png`
  - `output/playwright/phase9-mobile-smoke.png`
