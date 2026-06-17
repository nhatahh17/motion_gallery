# Test Matrix

This file maps product behavior to proof.

The durable matrix in `harness.db` is the operational source of truth. This
markdown file mirrors the current implemented story rows for quick review.

## Status Values

| Status | Meaning |
| --- | --- |
| planned | Accepted as intended behavior, not implemented |
| in_progress | Actively being built |
| implemented | Implemented and proof exists |
| changed | Contract changed after earlier implementation |
| retired | No longer part of the product contract |

## Matrix

| Story | Contract | Unit | Integration | E2E | Platform | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| US-001 | App setup and JSON data loading | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright desktop/mobile smoke loaded JSON images. |
| US-002 | WebGL gallery foundation | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright desktop/mobile smoke showed Canvas with PNG thumbnail textures. |
| US-003 | Default 2D Circle multi-ring layout | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright desktop/mobile smoke showed 30 JSON images and non-blank circle canvas. |
| US-004 | Drag touch and inertia | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright drag smoke changed shell screenshot hash and mobile shell had `touch-action: none`. |
| US-005 | 3D Circle layout and switcher | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright desktop/mobile smoke switched to `3D Circle`, showed active state, rendered canvas, and 0 console errors. |
| US-006 | 3D Horizon layout and three-mode switcher | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright desktop/mobile smoke switched to `3D Horizon`, showed active state, rendered canvas, and 0 console errors. |
| US-007 | Image detail modal | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright production desktop/mobile smoke opened image detail modal with metadata, Escape close worked, and 0 console errors. |
| US-008 | Accessibility and reduced motion pass | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright desktop smoke verified modal Next button, ArrowLeft/ArrowRight, Escape close, and 0 console errors. |
| US-009 | Experimental hover cursor polish | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright fallback desktop/mobile smoke verified desktop `View` cursor, mobile hidden cursor, modal open/close, and 0 console errors. |
| US-010 | Loading intro polish | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright fallback desktop/mobile smoke verified Phase 9 label, canvas load, hidden intro after ready, modal open/close, no horizontal overflow on mobile, and 0 console errors. |
| US-011 | Release metadata and final QA readiness | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright fallback desktop/mobile smoke verified Phase 10 label, metadata/OG/Twitter tags, layout switch, modal open/close, mobile no horizontal overflow, and 0 console errors. |
| US-012 | Category filter controls | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright fallback desktop/mobile smoke filtered `Street`, restored `All`, switched to `3D Horizon`, opened/closed modal, found 0 console errors, and found no horizontal overflow. |
| US-013 | Shareable image deep links | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright fallback desktop/mobile smoke opened `?photo=photo-002`, advanced modal URL to `photo-003`, removed `photo` on close, ignored an unknown image id, and found 0 console errors. |
| US-014 | Wheel and trackpad navigation | yes | no | yes | yes | implemented | `npm.cmd run test`; `npm.cmd run typecheck`; `npm.cmd run build`; Playwright fallback desktop/mobile smoke verified wheel input changes the rendered gallery page, horizontal wheel works after switching to `3D Horizon`, modal open/close still works, and 0 console errors. |

## Evidence Rules

- Unit proof covers pure domain and application rules.
- Integration proof covers backend enforcement, data integrity, provider
  behavior, jobs, or service contracts.
- E2E proof covers user-visible browser flows.
- Platform proof covers only shell, deployment, mobile, desktop, or runtime
  behavior that cannot be proven in lower layers.
- A story can be implemented without every proof column if the story packet
  explains why.
