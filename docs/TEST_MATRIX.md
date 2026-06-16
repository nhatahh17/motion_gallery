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

## Evidence Rules

- Unit proof covers pure domain and application rules.
- Integration proof covers backend enforcement, data integrity, provider
  behavior, jobs, or service contracts.
- E2E proof covers user-visible browser flows.
- Platform proof covers only shell, deployment, mobile, desktop, or runtime
  behavior that cannot be proven in lower layers.
- A story can be implemented without every proof column if the story packet
  explains why.
