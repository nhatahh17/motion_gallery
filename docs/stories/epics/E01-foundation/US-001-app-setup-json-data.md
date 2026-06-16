# US-001 App Setup And JSON Data Loading

## Status

implemented

## Lane

normal

## Product Contract

Create the base Next.js application and prove that gallery image data can be
loaded from `public/data/gallery.json`, validated, and rendered in a temporary
DOM debug list before WebGL work begins.

## Relevant Product Docs

- `docs/product/overview.md`
- `docs/product/data.md`
- `docs/product/experience.md`
- `docs/product/technical.md`

## Acceptance Criteria

- The app runs locally without TypeScript errors.
- The app loads `/public/data/gallery.json`.
- At least 3 sample images render in a temporary DOM list.
- Missing or malformed JSON is handled with a developer-friendly error state.
- Image objects are typed.
- Required fields are validated through a helper.
- Page shell uses the intended white/off-white background.
- No WebGL implementation is required yet.

## Design Notes

- Commands: `npm.cmd run test`, `npm.cmd run typecheck`, `npm.cmd run build`.
- Queries: local JSON fetch from `/data/gallery.json`.
- API: no backend API in this story.
- Tables: none.
- Domain rules: gallery image ids are unique; required metadata is non-empty.
- UI surfaces: root page, debug data list, data loading/error states.

## Validation

When updating durable proof status, use numeric booleans:
`scripts/bin/harness-cli story update --id US-001 --unit 1 --integration 0 --e2e 0 --platform 0`.

| Layer | Expected proof |
| --- | --- |
| Unit | Validation helper tests for valid data, duplicate ids, invalid dimensions, and non-array payloads. |
| Integration | Not required for Phase 1 because data is static public JSON. |
| E2E | Optional after dev server exists; browser smoke can verify the debug list renders. |
| Platform | Production build before handoff. |
| Release | Not in scope for Phase 1. |

## Harness Delta

Product docs are seeded from `SPEC.md` so future work can target smaller living
contracts instead of extending the monolithic spec.

## Evidence

- RED: `npm.cmd run test` failed because `src/lib/gallery/validation.ts` did not exist.
- GREEN: `npm.cmd run test` passed with 3 validation tests.
- `npm.cmd run typecheck` passed.
- `npm.cmd run build` passed with Next.js 16.2.9.
- `.\scripts\bin\harness-cli.exe story verify US-001` passed.
- Playwright CLI desktop and mobile smoke checks loaded `/data/gallery.json`
  with 3 images and 0 console errors.
- Screenshots:
  - `output/playwright/phase1-desktop-after-icon.png`
  - `output/playwright/phase1-mobile.png`

Known follow-up:

- `npm.cmd audit --audit-level=moderate` reports a moderate `postcss`
  advisory through `next@16.2.9`; `npm audit fix --force` would downgrade Next
  to 9.3.3, so it was not applied.
