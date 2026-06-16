# US-004 Drag Touch Inertia

## Status

implemented

## Lane

normal

## Product Contract

Make the default `circle2d` gallery interactive through mouse and touch drag,
with clamped velocity, short inertia after release, and autoplay pause/resume
behavior.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- Dragging left/right changes gallery progress.
- Touch dragging works on mobile.
- Autoplay pauses while dragging.
- After pointer release, inertia continues briefly.
- Inertia decays naturally.
- Velocity is clamped to avoid chaotic motion.
- Autoplay resumes after the configured delay.
- Dragging does not cause excessive React re-renders.
- Mobile touch drag does not accidentally scroll the page horizontally.
- Drag interaction works in the default 2D Circle layout.

## Design Notes

- Commands: `npm.cmd run test`, `npm.cmd run typecheck`, `npm.cmd run build`.
- Queries: local JSON through `useGalleryData`.
- API: no backend API in this story.
- Tables: none.
- Domain rules: drag converts pointer delta to progress delta with viewport-specific sensitivity; frame loop owns inertia decay and autoplay resume timing.
- UI surfaces: `GalleryCanvas`, `GalleryScene`, `GalleryImagePlane`.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-004 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Drag/inertia helper covers progress delta, mobile sensitivity, velocity clamp, decay, and autoplay gating. |
| Integration | Not required; data remains static public JSON. |
| E2E | Browser smoke verifies pointer/touch interaction changes canvas pixels without app console errors. |
| Platform | `npm.cmd run build` completes. |
| Release | Not in scope for Phase 4. |

## Harness Delta

Missing codegraph/browser-verification providers remain operational friction.

## Evidence

- RED: `npm.cmd run test -- src/lib/gallery/interaction.test.ts` failed because `src/lib/gallery/interaction.ts` did not exist.
- GREEN: `npm.cmd run test -- src/lib/gallery/interaction.test.ts` passed with 8 drag/inertia tests.
- `npm.cmd run test -- src/lib/gallery/interaction.test.ts src/lib/gallery/layout.test.ts` passed with 14 tests.
- `npm.cmd run test` passed with 21 tests.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed with Next.js 16.2.9.
- Playwright CLI fallback loaded `http://127.0.0.1:3108/` with 0 console errors after drag smoke.
- Desktop drag smoke changed the gallery shell screenshot hash:
  - before `517281616`
  - after `-1754494065`
  - canvas shell box `1180x420`
- Mobile viewport smoke confirmed `touch-action: none` and shell box `354x452.390625`.
- Screenshots:
  - `output/playwright/phase4-before-drag.png`
  - `output/playwright/phase4-after-drag.png`
  - `output/playwright/phase4-mobile-shell.png`
