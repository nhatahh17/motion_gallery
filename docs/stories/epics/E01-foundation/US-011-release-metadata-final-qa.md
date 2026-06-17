# US-011 Release Metadata And Final QA Readiness

## Status

implemented

## Lane

normal

## Product Contract

Phase 10 prepares the gallery for release from inside the repository: production
metadata is complete, favicon and Open Graph preview assets exist, production
build remains clean, and desktop/mobile smoke QA confirms the core gallery flow
still works.

Public deployment URL validation remains out of scope until a host URL is
available.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- The app exports title and description metadata for the personal motion gallery.
- The app declares favicon metadata.
- The app declares Open Graph and Twitter preview metadata.
- A static OG preview asset exists under `public/`.
- The visible shell labels this as the release QA phase.
- Production build completes successfully.
- Browser smoke verifies desktop and mobile load, layout switching, modal open/close, and no critical console errors.
- Any missing public deployment URL is documented as deferred scope rather than marked complete.

## Design Notes

- Commands: local production build and Next start.
- Queries: none.
- API: no API contract changes.
- Tables: none.
- Domain rules: release metadata is a pure local contract shared by tests and Next metadata.
- UI surfaces: root layout metadata and page phase label only.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-011 --unit 1 --integration 0 --e2e 1 --platform 1`.

| Layer | Expected proof |
| --- | --- |
| Unit | Metadata helper tests cover title, description, favicon, OG, and Twitter preview contract. |
| Integration | Not required for this static client-side slice. |
| E2E | Browser smoke verifies the production app still loads and modal/layout flows work. |
| Platform | Production build passes. |
| Release | Public deployment URL validation deferred until a host URL is available. |

## Harness Delta

No Harness policy changes expected. `docs/TEST_MATRIX.md` should be synced with
the durable row when proof exists.

## Evidence

- `npm.cmd run test -- src/lib/gallery/release.test.ts` passed with 2 tests.
- `npm.cmd run test` passed with 50 tests across 8 files.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed with Next.js 16.2.9.
- Harness had no registered `browser-verification` provider, so Playwright CLI fallback ran against local production server on port 3111.
- Playwright CLI desktop smoke verified Phase 10 label, visible canvas, `3D Horizon` layout switch, modal open/close through the gallery shell click fallback, title/description/OG/Twitter metadata, and 0 console errors.
- Playwright CLI mobile smoke verified Phase 10 label, visible canvas, `3D Horizon` layout switch, modal open/close through tap, OG metadata, no horizontal overflow, and 0 console errors.
- The only console warning was `THREE.Clock` deprecation from the Three.js/R3F stack, not introduced by this story.
- Screenshots:
  - `output/playwright/phase11-desktop-release.png`
  - `output/playwright/phase11-mobile-release.png`
- Reusable smoke snippets:
  - `output/playwright/phase11-desktop-smoke.js`
  - `output/playwright/phase11-mobile-smoke.js`
- Public deployment URL validation is deferred because no host URL was provided in this local phase.
