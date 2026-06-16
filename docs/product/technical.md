# Technical Contract

## Stack

- Next.js App Router.
- TypeScript.
- React Three Fiber and Drei for WebGL.
- Three.js for scene primitives and texture work.
- GSAP for DOM and transition choreography.
- Zustand for shared UI/gallery state.
- Local JSON data for the MVP.

## Architecture Notes

- Keep data validation separate from UI rendering.
- Keep frame-critical animation values in refs or render-loop state, not React
  state updates on every frame.
- Use thumbnails for WebGL textures and full-size images only in the modal.
- Clamp DPR in the WebGL layer once Phase 2 begins.

## Validation Ladder

- Unit: JSON schema and pure layout/data helpers.
- Build/typecheck: Next.js and TypeScript foundation.
- E2E/browser: visible gallery flows once the rendered app exists.
- Platform: production build and Vercel checks near release.
