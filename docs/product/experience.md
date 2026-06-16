# Experience Contract

## Layouts

- `circle2d`: default multi-ring 2D orbit.
- `circle3d`: spatial ring/cylinder with depth fade.
- `horizon3d`: cinematic horizontal 3D runway.

`progress` must not reset when users change layouts.

## Phase 1 Surface

Before WebGL exists, the app should prove the data foundation with:

- Minimal white/off-white page shell.
- Small header.
- Temporary DOM debug list sourced from `public/data/gallery.json`.
- Developer-friendly error state for malformed data.

## Future Interaction Contract

- Autoplay starts after load and pauses during drag/modal.
- Drag and touch update gallery progress with inertia.
- Clicking/tapping opens a detail modal with image metadata.
- Reduced motion disables or heavily reduces autoplay and transitions.
