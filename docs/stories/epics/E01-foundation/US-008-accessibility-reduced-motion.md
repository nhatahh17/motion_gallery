# US-008 Accessibility And Reduced Motion Pass

## Status

implemented

## Lane

normal

## Product Contract

Phase 8 tightens MVP accessibility and motion-safety behavior. Reduced-motion
users should not get autoplay or drag-release inertia, and keyboard users should
be able to navigate the image detail modal without a pointer.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- `prefers-reduced-motion: reduce` disables autoplay progress.
- Reduced motion removes drag-release inertia while keeping direct drag control usable.
- The image detail modal supports Previous and Next buttons.
- ArrowLeft and ArrowRight navigate the open modal image.
- Escape still closes the modal.
- Layout switcher buttons remain native keyboard-accessible controls.

## Design Notes

- Commands: modal navigation changes the selected image id; close clears it.
- Queries: adjacent image lookup is a pure wraparound helper.
- API: no route or network contract changes.
- Tables: none.
- Domain rules: missing selected ids do not navigate.
- UI surfaces: gallery drag progress, WebGL scene autoplay, and modal controls.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-008 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Helper tests for reduced-motion inertia and adjacent image navigation. |
| Integration | Not required for this static client-side slice. |
| E2E | Browser smoke opens the modal, uses keyboard/navigation controls, and checks for console errors. |
| Platform | Production build passes. |
| Release | Not in scope for Phase 8. |

## Harness Delta

No Harness policy changes expected. Browser verification may use the Playwright
CLI fallback if no registered browser provider exists.

## Evidence

- `npm.cmd run test -- src/lib/gallery/interaction.test.ts` failed first because `getInertiaVelocityAfterDrag` did not exist, then passed with 10 tests.
- `npm.cmd run test -- src/lib/gallery/detail.test.ts` failed first because `getAdjacentGalleryImageId` did not exist, then passed with 8 tests.
- `npm.cmd run test` passed with 40 tests.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed with Next.js 16.2.9.
- Playwright CLI production desktop smoke loaded Phase 8, opened the modal, verified the Next button changed `Morning Glass` to `Concrete Quiet`, verified ArrowLeft/ArrowRight navigation, closed with Escape, and had 0 console errors.
- Browser warning observed: `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` This is the same dependency runtime warning observed in prior phases and did not block the story.
- Screenshot: `output/playwright/phase8-desktop-modal-nav.png`.
