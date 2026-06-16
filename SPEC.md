# Personal Experimental Motion Gallery — Complete Product & Technical Spec

## 0. Document control

### Document name
`spec.md`

### Project
**Personal Experimental Motion Gallery**

### Version
`v1.0`

### Last updated
2026-06-16

### Owner
Personal photography gallery project.

### Primary goal
Build a minimal, white/off-white, motion-first personal photo gallery using WebGL and GSAP. The site should feel like an experimental award-style gallery: calm, clean, highly interactive, and visually memorable.

---

## 1. Executive summary

This project is a personal photo gallery website where images are displayed in a central animated gallery. The design is minimal and mostly white, with visual focus placed on image motion, layout morphing, smooth drag interaction, and polished image opening transitions.

The gallery supports three layout modes:

1. **2D Circle** — default layout. Images orbit in layered 2D circular/elliptical rings.
2. **3D Circle** — images form a rotating 3D ring/cylinder with depth fade.
3. **3D Horizon** — images move horizontally in a cinematic 3D strip.

The site supports 30+ mixed-ratio images: landscape, portrait, and square. Image data is managed through a JSON file, not a CMS. Clicking an image opens a smooth detail view showing the image and metadata such as location, year, and category.

The intended experience is more experimental than purely utilitarian. The motion may prioritize “wow” and visual impression, while still keeping basic usability, accessibility, and performance under control.

---

## 2. Confirmed product decisions

```txt
Website type: personal photography gallery
Image count: 30+ images
Image ratios: mixed landscape / portrait / square
Default layout: 2D Circle
Available layouts: 2D Circle, 3D Circle, 3D Horizon
Image data source: JSON file
Detail view content: image + metadata
Metadata: location / year / category, optional title/date/camera/lens
Motion direction: very experimental, wow-first
Visual style: minimal, white/off-white, photo-first
Recommended stack: Next.js + TypeScript + React Three Fiber + Drei + GSAP + Zustand
Mobile strategy: keep all 3 layouts, but use simplified mobile configs
Deployment target: Vercel or any static-capable hosting
```

---

## 3. Product goals

### 3.1 Primary goals

- Create an impressive personal image gallery that feels more like an interactive visual experience than a standard portfolio.
- Make motion the main design language.
- Allow users to explore images by drag/touch.
- Allow users to switch between three distinct gallery layouts.
- Allow users to open images smoothly and view metadata.
- Support 30+ mixed-ratio images without visual distortion.
- Keep the interface minimal and unobtrusive.
- Make the experience feel polished enough for award-site inspiration.

### 3.2 Secondary goals

- Keep the data easy to edit through a JSON file.
- Keep the project maintainable.
- Keep performance acceptable on desktop and modern mobile.
- Provide a foundation for future features like category filters, deep links, custom cursor, and shader effects.

### 3.3 Non-goals for MVP

The following are not required for the first production-ready MVP:

- CMS integration.
- User upload.
- Login/account.
- E-commerce.
- Comments/likes/social features.
- Complex category filtering.
- Audio effects.
- Heavy post-processing.
- Multi-page editorial site.
- Blog or written portfolio pages.

---

## 4. Target users and personas

### 4.1 Primary user: Gallery viewer

A person visiting the site to explore personal photography.

Needs:
- Instantly understand that the site is an image gallery.
- Feel invited to drag, explore, and click images.
- Switch layouts without confusion.
- Open an image and read basic metadata.
- Use the site on both desktop and mobile.

### 4.2 Secondary user: Gallery owner

The person maintaining the gallery.

Needs:
- Add, remove, or reorder images without changing code too much.
- Update location/year/category metadata easily.
- Replace thumbnails or full-size images.
- Deploy the site without complex backend setup.

### 4.3 Developer/maintainer

The person implementing and maintaining the code.

Needs:
- Clear component structure.
- Clear data schema.
- Clear animation responsibilities.
- Clear acceptance criteria.
- Clear performance boundaries.
- Clear phase-by-phase delivery plan.

---

## 5. User experience overview

### 5.1 First load

When the user opens the website:

1. A white/off-white page appears.
2. A minimal header is visible.
3. The gallery appears in the center.
4. The default layout is **2D Circle**.
5. Images move slowly in layered circular orbits.
6. A small hint tells the user they can drag or click.
7. A layout switcher appears in the top-right.

Expected feeling:
```txt
Quiet, clean, premium, motion-focused, slightly surprising.
```

### 5.2 Exploration

The user can:
- Drag with mouse on desktop.
- Swipe/drag with touch on mobile.
- Let the gallery autoplay.
- Switch layout modes.
- Hover an image on desktop.
- Click/tap an image to open it.

### 5.3 Image detail

When the user clicks an image:

1. Gallery movement pauses.
2. Background gallery dims or softens.
3. Image opens in a centered detail modal.
4. Metadata appears.
5. User can close with close button, Esc, background click, or optional swipe-down on mobile.
6. User can navigate previous/next image using keyboard or UI controls.

---

## 6. Information architecture

### 6.1 Single-page structure

```txt
/
└── Motion gallery experience
    ├── Header
    │   ├── Project title
    │   └── Layout switcher
    ├── WebGL gallery canvas
    │   ├── 2D Circle layout
    │   ├── 3D Circle layout
    │   └── 3D Horizon layout
    ├── Gallery HUD
    │   ├── Drag hint
    │   ├── Current image counter
    │   └── Optional current metadata preview
    └── Image detail modal
        ├── Full image
        ├── Metadata
        ├── Close button
        └── Previous/next controls
```

### 6.2 Possible future routes

Not required for MVP, but the architecture should not block:

```txt
/
├── main gallery
/photo/[id]
├── direct image detail route
/about
└── optional personal/about page
```

---

## 7. Visual design direction

### 7.1 Overall style

```txt
Minimal
White/off-white
Editorial
Gallery-like
Experimental
Soft but precise
Photo-first
Low UI noise
```

### 7.2 Color palette

```css
:root {
  --bg: #f8f8f4;
  --text: #101010;
  --muted: rgba(16, 16, 16, 0.46);
  --line: rgba(16, 16, 16, 0.11);
  --panel: rgba(255, 255, 255, 0.68);
  --panel-strong: rgba(255, 255, 255, 0.88);
}
```

### 7.3 Typography

Recommended fonts:
- Satoshi
- Inter
- Geist
- Neue Haas Grotesk style
- Suisse-style grotesk if licensed

Fallback:
```css
font-family: Inter, Geist, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### 7.4 UI style

- Header text small.
- Metadata text like museum labels.
- Buttons should feel quiet.
- Avoid thick borders.
- Avoid heavy shadow.
- Avoid loud colors.
- Avoid large text blocks.
- Avoid decorative UI that competes with photos.

---

## 8. Technical stack

### 8.1 Recommended stack

```txt
Framework: Next.js
Language: TypeScript
WebGL: Three.js through React Three Fiber
Helpers: Drei
Animation: GSAP + @gsap/react
State: Zustand + refs for frame-critical values
Styling: CSS Modules or Tailwind CSS
Data: local JSON file
Deployment: Vercel
```

### 8.2 Why this stack

Next.js:
- Good production structure.
- Easy deploy.
- Metadata/SEO support.
- Good image handling for DOM detail view.

React Three Fiber:
- Makes Three.js scene manageable through React components.
- Easier to split image planes, camera, layouts, controls.

Drei:
- Useful helpers for texture loading and scene utilities.

GSAP:
- Strong choice for polished UI transitions.
- Good for modal animation, layout switcher, intro, and advanced FLIP transitions.

Zustand:
- Simple shared state between UI and Canvas.
- Avoids prop drilling.

---

## 9. Data model

### 9.1 JSON location

```txt
/public/data/gallery.json
```

### 9.2 Image folders

```txt
/public/images/gallery/
/public/images/gallery/thumbs/
```

### 9.3 TypeScript type

```ts
export type GalleryImage = {
  id: string
  src: string
  thumbSrc: string
  alt: string

  title?: string
  location: string
  year: string
  category: string

  date?: string
  camera?: string
  lens?: string

  ratio?: "landscape" | "portrait" | "square"
  width: number
  height: number
  dominantColor?: string
}
```

### 9.4 Example JSON item

```json
{
  "id": "photo-001",
  "src": "/images/gallery/photo-001.webp",
  "thumbSrc": "/images/gallery/thumbs/photo-001.webp",
  "alt": "A quiet street in Tokyo after rain",
  "title": "After Rain",
  "location": "Tokyo, Japan",
  "year": "2026",
  "category": "Street",
  "date": "2026-04-12",
  "camera": "Sony A6400",
  "lens": "Sigma 18-50mm",
  "ratio": "landscape",
  "width": 1600,
  "height": 1067,
  "dominantColor": "#e8e8e2"
}
```

### 9.5 Required fields

```txt
id
src
thumbSrc
alt
location
year
category
width
height
```

### 9.6 Optional fields

```txt
title
date
camera
lens
ratio
dominantColor
```

### 9.7 Data validation rules

- `id` must be unique.
- `src` must point to an existing full-size image.
- `thumbSrc` must point to an existing thumbnail image.
- `width` and `height` must be greater than 0.
- `alt` must not be empty.
- `location`, `year`, and `category` must not be empty.
- `category` should use consistent naming, e.g. `Street`, `Travel`, `Portrait`, `Architecture`, `Nature`, `Daily`.

---

## 10. Image handling rules

### 10.1 Supported image count

MVP should support:

```txt
Minimum: 12 images
Target: 30–48 images
Upper soft limit: 60 images
```

If gallery grows beyond 60 images, consider virtualization or category filtering.

### 10.2 Recommended file formats

```txt
Thumbnail: WebP or AVIF, long edge 700–1000px
Full image: WebP or AVIF, long edge 1800–2400px
```

### 10.3 Aspect ratio handling

Images must not be distorted.

Base logic:

```ts
const aspect = width / height
const baseHeight = 1.25
let planeWidth = baseHeight * aspect
let planeHeight = baseHeight
```

Clamp logic:

```ts
const maxWidth = 1.95
const maxHeight = 1.55

if (planeWidth > maxWidth) {
  const scale = maxWidth / planeWidth
  planeWidth *= scale
  planeHeight *= scale
}

if (planeHeight > maxHeight) {
  const scale = maxHeight / planeHeight
  planeWidth *= scale
  planeHeight *= scale
}
```

---

## 11. Core layout modes

### 11.1 Layout type

```ts
export type LayoutMode = "circle2d" | "circle3d" | "horizon3d"
```

### 11.2 Shared layout behavior

All layouts share:

```txt
progress
velocity
autoplay
drag input
inertia
layout transition
opacity by distance/depth
scale by importance
```

Important rule:
```txt
progress must not reset when changing layouts.
```

---

## 12. Layout 1 — 2D Circle

### 12.1 Role

This is the default layout when the site loads.

### 12.2 Design intent

The 2D Circle layout should feel like a personal memory orbit. Images move in layered elliptical rings around the center. Because the gallery has 30+ images, a single ring would become too dense, so this layout uses multiple rings.

### 12.3 Multi-ring approach

```txt
Ring A: primary ring, larger images, higher opacity
Ring B: secondary ring, smaller images, medium opacity, opposite/slower movement
Ring C: background ring, smaller images, low opacity, subtle movement
```

### 12.4 Example formula

```ts
const ringIndex = index % 3

const rings = [
  { radiusX: 4.8, radiusY: 2.1, speed: 1.0, opacity: 0.95, scale: 1.0 },
  { radiusX: 3.7, radiusY: 1.55, speed: -0.72, opacity: 0.62, scale: 0.82 },
  { radiusX: 5.8, radiusY: 2.55, speed: 0.48, opacity: 0.38, scale: 0.68 }
]

const ring = rings[ringIndex]
const angle = ((index / total) * Math.PI * 2) + progress * ring.speed

const x = Math.cos(angle) * ring.radiusX
const y = Math.sin(angle) * ring.radiusY
const z = ringIndex * -0.08
```

### 12.5 Acceptance expectations

- Images form clear circular/elliptical movement.
- The layout does not look like a random scatter.
- 30+ images do not feel like one dense clump.
- The center area remains breathable.
- Dragging feels direct and responsive.

---

## 13. Layout 2 — 3D Circle

### 13.1 Design intent

The 3D Circle layout is the “wow” mode. Images form a 3D ring/cylinder around an invisible center. It should feel spatial, dimensional, and more dramatic than the default layout.

### 13.2 Behavior

- Images are positioned around the Y-axis.
- Images near the front are larger and more opaque.
- Images in the back fade out and scale down.
- Drag rotates the ring.
- Autoplay rotates the ring slowly.
- Camera remains stable with optional subtle parallax.

### 13.3 Example formula

```ts
const angle = ((index / total) * Math.PI * 2) + progress

const x = Math.sin(angle) * radius
const z = Math.cos(angle) * radius
const y = Math.sin(angle * 1.7 + index) * 0.35
```

### 13.4 Acceptance expectations

- Depth is obvious.
- Front images feel closer.
- Back images do not dominate.
- Layout switch from 2D Circle to 3D Circle feels like depth unfolding.
- Mobile version does not become dizzy or chaotic.

---

## 14. Layout 3 — 3D Horizon

### 14.1 Design intent

The 3D Horizon layout is the most usable layout. It should feel like a cinematic horizontal runway of images, with the center image emphasized and side images receding into depth.

### 14.2 Behavior

- Images move along the X-axis.
- Center image is largest and most visible.
- Side images rotate slightly and move backward in Z.
- Drag/swipe left-right feels natural.
- Autoplay drifts gently.
- Infinite looping should feel seamless.

### 14.3 Example formula

```ts
const spacing = 2.05
const virtualIndex = index - progress

const x = virtualIndex * spacing
const z = -Math.abs(virtualIndex) * 0.5
const y = Math.sin(virtualIndex * 0.65) * 0.18
const rotationY = virtualIndex * -0.085
```

### 14.4 Acceptance expectations

- The layout reads clearly as horizontal.
- Center image is easy to identify.
- Swipe/drag is intuitive.
- Side images create depth without blocking the center image.
- This layout feels best on mobile.

---

## 15. Interaction requirements

### 15.1 Autoplay

Autoplay should:
- Start automatically after load.
- Move slowly.
- Pause during drag.
- Pause during modal open.
- Pause during layout transition or reduce intensity.
- Resume after idle delay.

Default values:

```ts
const autoplaySpeed = {
  circle2d: 0.0016,
  circle3d: 0.00115,
  horizon3d: 0.003
}
```

### 15.2 Drag and inertia

Supported:
- Mouse drag.
- Touch drag.
- Optional wheel/trackpad support after MVP.

Expected behavior:
```txt
Pointer down: pause autoplay
Pointer move: update progress
Pointer up: apply inertia
Idle delay: resume autoplay
```

Example values:

```ts
const dragConfig = {
  sensitivityDesktop: 0.0038,
  sensitivityMobile: 0.0055,
  friction: 0.925,
  maxVelocity: 0.08,
  minVelocity: 0.0008,
  resumeDelay: 2200
}
```

### 15.3 Hover

Desktop only:
- Hovered image scales up slightly.
- Cursor can change to `View`.
- Image opacity becomes fully visible.
- Other images may dim very slightly.

Mobile:
- No hover behavior.
- Tap opens image.

### 15.4 Layout switching

The user can switch layout using top-right buttons.

Requirements:
- Buttons are always visible except during optional full modal state.
- Active state is clear.
- Switching layout does not reset gallery progress.
- Transition should feel like morphing, not hard cutting.
- Avoid allowing rapid spam-clicks that break animation.

### 15.5 Image open/close

Clicking/tapping an image:
- Opens detail modal.
- Pauses gallery.
- Displays metadata.
- Supports close by button and keyboard.
- Restores gallery state after close.

---

## 16. Detail modal

### 16.1 Content

The modal must show:

```txt
Large image
Title if available
Location
Year
Category
Optional date
Optional camera/lens
Image counter
Close button
```

### 16.2 Desktop layout recommendation

```txt
Large image centered or slightly left
Metadata below or right side
Close top-right
Previous/next controls subtle
```

### 16.3 Mobile layout recommendation

```txt
Image near full width
Metadata below image
Close fixed top-right
Previous/next optional or swipe-based
```

### 16.4 Modal behavior

- Body scroll locked.
- Gallery paused.
- Focus trapped inside modal.
- Esc closes modal.
- ArrowLeft and ArrowRight navigate.
- Background click closes modal only if it does not conflict with image click.

### 16.5 Modal animation

MVP animation:
```txt
Overlay fade in
Image scale 0.82 → 1
Image y 24px → 0
Metadata fade/slide in with slight delay
Background gallery opacity reduced
```

Advanced animation:
```txt
WebGL-to-DOM FLIP
Image opens from actual WebGL screen position
Preview plane fades out while DOM image expands
```

---

## 17. Accessibility requirements

### 17.1 Required accessibility features

- Layout buttons use real `<button>`.
- Active layout button uses `aria-pressed`.
- Modal uses `role="dialog"` and `aria-modal="true"`.
- Close button has accessible label.
- All images have alt text in JSON.
- Keyboard users can:
  - tab through layout controls,
  - open image if focusable image list is implemented,
  - close modal with Esc,
  - navigate modal with arrow keys.
- Reduced motion is supported.

### 17.2 Reduced motion behavior

When `prefers-reduced-motion: reduce` is active:

- Autoplay is disabled or reduced heavily.
- Layout transitions are shorter and less dramatic.
- Inertia is reduced.
- Camera parallax is disabled.
- Breathing/magnetic effects are disabled.
- Modal uses simple fade/scale.

---

## 18. Performance requirements

### 18.1 Performance goals

```txt
Desktop target: near 60fps
Mobile target: smooth enough for interaction
Initial load: avoid loading all full-size images
Memory: no obvious texture leaks
```

### 18.2 Required optimizations

- Use thumbnails as WebGL textures.
- Use full-size image only in modal.
- Clamp DPR:
  - desktop: `[1, 1.6]`
  - mobile: `[1, 1.35]`
- Avoid shadows in MVP.
- Avoid heavy post-processing in MVP.
- Avoid React state updates every frame.
- Dispose textures/materials when needed.
- Use opacity/distance logic so not all 30+ images visually compete at once.

### 18.3 Rendering rule

For 30–48 images:
```txt
Render all image planes, but visually emphasize only a subset through opacity/scale/depth.
```

For 49–100 images:
```txt
Consider virtualizing or limiting visible strong images.
```

---

## 19. SEO and metadata

### 19.1 Required

- Page title.
- Page description.
- Open Graph image.
- Favicon.
- Basic DOM text content describing the gallery.
- Image alt text in data.

### 19.2 Example metadata

```ts
export const metadata = {
  title: "Personal Motion Gallery",
  description: "An experimental WebGL photo gallery of personal images, places, and visual memories."
}
```

---

## 20. Analytics and monitoring

### 20.1 MVP analytics

Optional but recommended:
- Page view.
- Layout switch event.
- Image open event.
- Drag interaction event.

### 20.2 Useful events

```txt
gallery_loaded
layout_changed
image_opened
image_closed
drag_started
drag_ended
reduced_motion_enabled
```

---

## 21. Component architecture

### 21.1 Folder structure

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css

  components/
    gallery/
      GalleryExperience.tsx
      GalleryCanvas.tsx
      GalleryScene.tsx
      GalleryImagePlane.tsx
      CameraRig.tsx
      LayoutSwitcher.tsx
      GalleryHUD.tsx
      ImageDetailModal.tsx
      MotionCursor.tsx
      LoadingIntro.tsx

  hooks/
    useGalleryData.ts
    useGalleryDrag.ts
    useGalleryProgress.ts
    useReducedMotion.ts
    useViewportMode.ts
    useImagePreload.ts

  lib/
    gallery-layouts.ts
    gallery-config.ts
    gallery-store.ts
    image-utils.ts
    animation.ts
    validate-gallery-data.ts

  types/
    gallery.ts

public/
  data/
    gallery.json
  images/
    gallery/
      thumbs/
```

### 21.2 Component responsibilities

#### `GalleryExperience`
Root of the gallery experience.

Responsibilities:
- Load data.
- Initialize store.
- Render Canvas and UI overlay.
- Handle modal state.

#### `GalleryCanvas`
Canvas wrapper.

Responsibilities:
- Setup R3F Canvas.
- Set camera defaults.
- Clamp DPR.
- Configure WebGL options.

#### `GalleryScene`
WebGL scene.

Responsibilities:
- Render all image planes.
- Update gallery progress.
- Apply layout positions.
- Handle autoplay and inertia.

#### `GalleryImagePlane`
Single WebGL image plane.

Responsibilities:
- Load thumbnail texture.
- Preserve image aspect ratio.
- Apply position/rotation/scale/opacity.
- Handle pointer events.

#### `CameraRig`
Camera behavior.

Responsibilities:
- Tween camera by layout.
- Apply subtle pointer parallax on desktop.
- Disable heavy motion for reduced motion/mobile.

#### `LayoutSwitcher`
Top-right mode selector.

Responsibilities:
- Render three layout buttons.
- Manage active state.
- Trigger layout transition.
- Provide accessibility attributes.

#### `GalleryHUD`
Minimal overlay.

Responsibilities:
- Show drag hint.
- Show image counter.
- Show optional current metadata.

#### `ImageDetailModal`
DOM detail view.

Responsibilities:
- Render full image.
- Render metadata.
- Lock scroll.
- Trap focus.
- Handle close and keyboard navigation.

---

## 22. State architecture

### 22.1 Zustand store

```ts
type LayoutMode = "circle2d" | "circle3d" | "horizon3d"

type GalleryStore = {
  layoutMode: LayoutMode
  activeImageId: string | null
  isModalOpen: boolean
  isDragging: boolean
  isLayoutTransitioning: boolean

  setLayoutMode: (mode: LayoutMode) => void
  openImage: (id: string) => void
  closeImage: () => void
  nextImage: () => void
  prevImage: () => void
}
```

### 22.2 Frame-critical refs

Do not store these in React state per frame:

```ts
const progressRef = useRef(0)
const velocityRef = useRef(0)
const pointerRef = useRef({ x: 0, y: 0 })
const isDraggingRef = useRef(false)
```

---

## 23. User stories by epic

## Epic A — First impression and page shell

### US-A1 — View the gallery landing page
As a gallery viewer, I want to open the website and immediately see a clean animated gallery, so that I understand this is a visual photography experience.

Acceptance criteria:
- Given I open the homepage, when the page loads, then I see a white/off-white full-screen page.
- Given the page loads, when the gallery is ready, then the default layout is 2D Circle.
- Given the page loads, when I look at the UI, then I see a minimal project title and layout switcher.
- Given the gallery is loaded, when I do nothing, then the images move gently.
- Given images are still loading, when loading is not complete, then the page does not show broken image planes.

### US-A2 — Understand basic interaction
As a gallery viewer, I want to see a small hint, so that I know I can drag or click images.

Acceptance criteria:
- Given the page loads, then a subtle hint such as `Drag to explore` is visible.
- Given I interact with the gallery, then the hint may fade or reduce emphasis.
- Given the hint is visible, then it does not cover important images.
- Given the user is on mobile, then the hint remains readable but compact.

---

## Epic B — JSON-powered image data

### US-B1 — Load gallery data from JSON
As a gallery owner, I want image information to come from a JSON file, so that I can update the gallery without a CMS.

Acceptance criteria:
- Given `/public/data/gallery.json` exists, when the app starts, then it loads image data from that file.
- Given the JSON has 30+ valid image items, then the gallery renders them.
- Given an image item has required metadata, then that metadata is available to the modal.
- Given the JSON has invalid data, then the app fails gracefully or logs a clear developer error.

### US-B2 — Add a new photo by editing JSON
As a gallery owner, I want to add a new photo by adding one JSON object and image files, so that gallery maintenance is simple.

Acceptance criteria:
- Given I add a new image file and thumbnail, when I add a valid JSON item, then the image appears in the gallery.
- Given I reorder items in the JSON, then the gallery order changes accordingly.
- Given I remove an item from JSON, then it no longer appears.
- Given a JSON item points to a missing image, then the app handles it without crashing the whole page.

### US-B3 — Preserve mixed image ratios
As a gallery viewer, I want landscape, portrait, and square images to display correctly, so that photos are not distorted.

Acceptance criteria:
- Given a landscape image, then it keeps its aspect ratio.
- Given a portrait image, then it keeps its aspect ratio.
- Given a square image, then it keeps its aspect ratio.
- Given mixed-ratio images are shown together, then no image appears stretched.
- Given an image is too wide or tall, then it is clamped to the configured max display size.

---

## Epic C — 2D Circle layout

### US-C1 — View the default 2D Circle layout
As a gallery viewer, I want the gallery to open in a 2D Circle layout, so that the first impression feels unique and experimental.

Acceptance criteria:
- Given I open the site, then the active layout is `2D Circle`.
- Given 30+ images exist, then they are distributed into layered circular/elliptical rings.
- Given the gallery is idle, then rings move slowly.
- Given multiple rings exist, then the gallery does not look like a single cluttered pile.
- Given I resize the viewport, then the 2D Circle layout remains centered and usable.

### US-C2 — Experience layered orbit motion
As a gallery viewer, I want images to move in layered orbits, so that the gallery feels alive and dimensional even in 2D mode.

Acceptance criteria:
- Given the gallery is in 2D Circle mode, then at least two visual layers/rings are noticeable.
- Given the rings move, then they can use slightly different speeds or directions.
- Given images are in background layers, then they use lower opacity or smaller scale.
- Given images are in the primary layer, then they remain visually clear.
- Given the center area exists, then it has enough whitespace and does not feel blocked.

---

## Epic D — 3D Circle layout

### US-D1 — Switch to 3D Circle
As a gallery viewer, I want to switch to a 3D Circle layout, so that I can explore the images in a spatial ring.

Acceptance criteria:
- Given I click `3D Circle`, then the active layout changes to 3D Circle.
- Given the layout changes, then images animate smoothly from their previous positions.
- Given the 3D Circle is active, then images are arranged around a 3D circular/ring structure.
- Given images move behind the ring, then they fade or scale down.
- Given images are near the front, then they appear clearer and larger.

### US-D2 — Drag the 3D ring
As a gallery viewer, I want to drag the 3D Circle, so that I can rotate through the photos.

Acceptance criteria:
- Given I drag left or right, then the 3D ring rotates accordingly.
- Given I release after dragging, then inertia continues briefly.
- Given inertia slows down, then movement settles naturally.
- Given I drag on mobile, then touch interaction works without page scrolling conflict.
- Given the ring rotates, then it does not create excessive dizziness.

---

## Epic E — 3D Horizon layout

### US-E1 — Switch to 3D Horizon
As a gallery viewer, I want to switch to a horizontal 3D layout, so that I can browse images in a more readable way.

Acceptance criteria:
- Given I click `3D Horizon`, then the active layout changes to 3D Horizon.
- Given the layout is active, then images appear in a horizontal 3D strip.
- Given an image is near the center, then it appears larger and clearer.
- Given images are on the sides, then they recede in depth and opacity.
- Given I switch from another layout, then progress is preserved.

### US-E2 — Browse horizontally
As a gallery viewer, I want to drag the horizontal gallery, so that I can move through photos naturally.

Acceptance criteria:
- Given I drag left, then images move horizontally in the expected direction.
- Given I drag right, then images move in the opposite direction.
- Given I release after dragging, then inertia continues.
- Given the image list loops, then the loop feels continuous without obvious jumps.
- Given I use mobile, then this layout feels smooth and easy to control.

---

## Epic F — Layout switcher

### US-F1 — Change gallery layouts
As a gallery viewer, I want buttons to switch between the three layouts, so that I can choose the browsing style.

Acceptance criteria:
- Given the page is loaded, then three layout buttons are visible.
- Given I click a layout button, then the gallery changes to that layout.
- Given a layout is active, then its button has a clear active state.
- Given I click the currently active layout button, then the gallery does not unnecessarily restart.
- Given layout transition is running, then repeated clicks are ignored or handled safely.

### US-F2 — Use accessible layout controls
As a keyboard user, I want the layout buttons to be accessible, so that I can use the gallery without a mouse.

Acceptance criteria:
- Given I press Tab, then I can focus each layout button.
- Given a layout button is focused, then focus state is visible.
- Given I press Enter or Space, then the focused layout is activated.
- Given a layout is active, then the button exposes `aria-pressed="true"`.
- Given I use a screen reader, then button labels are meaningful.

---

## Epic G — Autoplay, drag, and inertia

### US-G1 — Autoplay the gallery
As a gallery viewer, I want the gallery to move automatically, so that the page feels alive even before I interact.

Acceptance criteria:
- Given the page is idle, then gallery progress changes slowly over time.
- Given autoplay is active, then motion is subtle and not too fast.
- Given I open a modal, then autoplay pauses.
- Given I start dragging, then autoplay pauses.
- Given I stop interacting for the configured delay, then autoplay resumes.

### US-G2 — Drag the gallery
As a gallery viewer, I want to drag the gallery, so that I can control the motion.

Acceptance criteria:
- Given I press and drag on desktop, then gallery progress follows my movement.
- Given I swipe/drag on mobile, then gallery progress follows my touch.
- Given I release after a drag, then inertia continues briefly.
- Given velocity becomes small, then inertia stops naturally.
- Given I drag aggressively, then velocity is clamped to avoid chaos.

### US-G3 — Avoid frame-state performance issues
As a developer, I want progress and velocity to update outside React state, so that animation remains smooth.

Acceptance criteria:
- Given the gallery is animating, then `progress` is not updated through React state every frame.
- Given drag is active, then `velocity` is stored in refs or an equivalent mutable store.
- Given React DevTools are used, then frame animation does not cause excessive re-renders.
- Given 30+ images are loaded, then drag remains responsive on desktop.

---

## Epic H — Image detail modal

### US-H1 — Open image detail
As a gallery viewer, I want to click an image to open it larger, so that I can view it clearly.

Acceptance criteria:
- Given I click an image, then a modal opens.
- Given the modal opens, then the selected image is shown larger.
- Given the modal opens, then gallery autoplay pauses.
- Given the modal opens, then the background gallery dims or softens.
- Given the selected image has metadata, then metadata is displayed.

### US-H2 — View photo metadata
As a gallery viewer, I want to see location, year, and category, so that I understand the context of the photo.

Acceptance criteria:
- Given an image has `location`, then location is displayed.
- Given an image has `year`, then year is displayed.
- Given an image has `category`, then category is displayed.
- Given optional `title` exists, then title is displayed.
- Given optional `camera` and `lens` exist, then they can be displayed in a secondary metadata line.

### US-H3 — Close image detail
As a gallery viewer, I want to close the detail view easily, so that I can return to browsing.

Acceptance criteria:
- Given the modal is open, when I click close, then it closes.
- Given the modal is open, when I press Esc, then it closes.
- Given the modal closes, then the gallery becomes interactive again.
- Given the modal closes, then autoplay resumes after a short delay.
- Given the modal closes, then the previously active layout is preserved.

### US-H4 — Navigate images in modal
As a gallery viewer, I want to move to the previous or next image while in detail view, so that I can browse without closing each time.

Acceptance criteria:
- Given modal is open, when I press ArrowRight, then the next image appears.
- Given modal is open, when I press ArrowLeft, then the previous image appears.
- Given I am on the last image and navigate next, then it loops to the first image.
- Given I am on the first image and navigate previous, then it loops to the last image.
- Given metadata changes, then it matches the newly displayed image.

---

## Epic I — Responsive behavior

### US-I1 — Use gallery on desktop
As a desktop user, I want the full visual experience, so that I can enjoy all motion effects.

Acceptance criteria:
- Given viewport width is at least 1024px, then all three layouts are fully available.
- Given desktop is used, then hover effects are enabled.
- Given desktop is used, then camera parallax can be enabled.
- Given desktop is used, then the layout switcher shows full labels.
- Given desktop is used, then modal image does not exceed viewport.

### US-I2 — Use gallery on tablet
As a tablet user, I want the gallery to remain usable and visually interesting, so that the site works on medium screens.

Acceptance criteria:
- Given tablet viewport, then all three layouts remain available.
- Given tablet viewport, then image scale/radius/spacing are reduced.
- Given tablet viewport, then layout buttons remain usable.
- Given tablet touch input, then drag works smoothly.
- Given modal opens, then metadata remains readable.

### US-I3 — Use gallery on mobile
As a mobile user, I want the gallery to be touch-friendly, so that I can explore images without fighting the UI.

Acceptance criteria:
- Given mobile viewport, then all three layout modes remain available.
- Given mobile viewport, then default layout remains 2D Circle.
- Given mobile viewport, then 2D Circle uses simplified config.
- Given mobile viewport, then 3D Circle depth is reduced.
- Given mobile viewport, then 3D Horizon is smooth and easy to swipe.
- Given mobile viewport, then layout buttons are compact.
- Given mobile viewport, then modal image and metadata fit without horizontal overflow.

---

## Epic J — Performance

### US-J1 — Use thumbnails in WebGL
As a developer, I want WebGL planes to use thumbnails, so that the gallery remains performant.

Acceptance criteria:
- Given image planes are rendered in WebGL, then they use `thumbSrc`.
- Given a modal opens, then the full `src` image is used for detail view.
- Given the gallery loads, then it does not load all full-size images immediately.
- Given thumbnails are missing, then fallback behavior is defined.
- Given network is slow, then loading state prevents broken visual output.

### US-J2 — Maintain smooth animation
As a gallery viewer, I want interactions to feel smooth, so that the experience feels premium.

Acceptance criteria:
- Given desktop usage, then animation feels close to 60fps in normal conditions.
- Given mobile usage, then interaction remains usable.
- Given 30+ images are present, then drag does not visibly stutter on a typical laptop.
- Given DPR is high, then it is clamped.
- Given reduced motion is off, then experimental effects are enabled within performance limits.

### US-J3 — Avoid memory leaks
As a developer, I want textures and materials to be cleaned up, so that the app remains stable.

Acceptance criteria:
- Given image planes unmount, then textures/materials are disposed if manually created.
- Given the page is visited repeatedly, then memory usage does not grow without bound.
- Given layout switches occur repeatedly, then no duplicate animation timelines accumulate.
- Given modal opens/closes repeatedly, then event listeners are cleaned up.

---

## Epic K — Accessibility and reduced motion

### US-K1 — Respect reduced motion
As a motion-sensitive user, I want reduced animation, so that the site is comfortable to use.

Acceptance criteria:
- Given `prefers-reduced-motion: reduce` is enabled, then autoplay is disabled or heavily reduced.
- Given reduced motion is enabled, then camera parallax is disabled.
- Given reduced motion is enabled, then layout transitions are simplified.
- Given reduced motion is enabled, then modal animations are shorter and simpler.
- Given reduced motion is enabled, then the site remains usable.

### US-K2 — Use keyboard modal controls
As a keyboard user, I want to close and navigate the modal, so that I can use the detail view without a mouse.

Acceptance criteria:
- Given modal is open, then focus moves into the modal.
- Given modal is open, then Tab stays within the modal.
- Given modal is open, then Esc closes the modal.
- Given modal is open, then ArrowLeft/ArrowRight navigate images.
- Given modal closes, then focus returns to a logical place.

---

## Epic L — Deployment and production readiness

### US-L1 — Deploy the gallery
As a gallery owner, I want the site to be deployable, so that I can share it publicly.

Acceptance criteria:
- Given the code is pushed to the deployment platform, then the site builds successfully.
- Given the site is deployed, then images and JSON load correctly.
- Given the site is visited on a public URL, then no local-only paths break.
- Given the deployment is complete, then metadata and OG image are available.
- Given a build error happens, then it is traceable through TypeScript or lint output.

### US-L2 — Validate production quality
As a developer, I want a QA checklist, so that the site is not shipped with obvious issues.

Acceptance criteria:
- Given desktop QA is performed, then all layouts and modal interactions pass.
- Given mobile QA is performed, then touch drag and modal pass.
- Given accessibility QA is performed, then critical keyboard/reduced-motion checks pass.
- Given performance QA is performed, then no obvious frame drops or memory leaks remain.
- Given data QA is performed, then all image paths and metadata are valid.

---

# 24. Delivery phases

## Phase 0 — Product and design foundation

### Goal
Finalize the core product direction and establish the project foundation before implementation.

### Scope
- Confirm stack.
- Confirm layout names.
- Confirm JSON data model.
- Confirm initial visual style.
- Define image folder structure.
- Define required metadata fields.

### User stories included
- US-A1
- US-A2
- US-B1
- US-B2
- US-B3

### Deliverables
- Finalized `spec.md`.
- Initial `gallery.json` schema.
- Sample JSON with 3–5 images.
- Visual direction notes.
- Project folder plan.

### Acceptance criteria
- The stack is documented as Next.js + TypeScript + R3F + Drei + GSAP + Zustand.
- The default layout is documented as 2D Circle.
- The three layout names are documented as 2D Circle, 3D Circle, and 3D Horizon.
- The JSON schema includes `id`, `src`, `thumbSrc`, `alt`, `location`, `year`, `category`, `width`, and `height`.
- The project supports 30+ mixed-ratio images by design.
- MVP scope and non-goals are documented.
- Mobile strategy is documented.

### Definition of done
- Product decisions are clear enough for development to start.
- No major open question blocks implementation.
- Sample data can be used by Phase 1.

---

## Phase 1 — App setup and JSON data loading

### Goal
Create the base application and load image data from JSON.

### Scope
- Setup Next.js + TypeScript.
- Add global styles.
- Create gallery data type.
- Create `/public/data/gallery.json`.
- Implement `useGalleryData`.
- Render a temporary DOM debug list of images.
- Add basic page shell.

### User stories included
- US-A1
- US-B1
- US-B2
- US-B3

### Deliverables
- Running Next.js app.
- Valid gallery JSON file.
- TypeScript data type.
- Data loading hook.
- Temporary debug rendering.
- Basic header/footer shell.

### Acceptance criteria
- The app runs locally without TypeScript errors.
- The app loads `/public/data/gallery.json`.
- At least 3 sample images render in a temporary DOM list.
- Missing or malformed JSON is handled with a developer-friendly error state.
- Image objects are typed.
- Required fields are validated manually or through a validation helper.
- Page shell uses the intended white/off-white background.
- No WebGL implementation is required yet.

### Definition of done
- A developer can add a new image object to JSON and see it appear in the temporary output.
- The app has a clean foundation for adding Canvas in Phase 2.

---

## Phase 2 — WebGL gallery foundation

### Goal
Render JSON images as WebGL planes using React Three Fiber.

### Scope
- Add R3F Canvas.
- Add `GalleryCanvas`.
- Add `GalleryScene`.
- Add `GalleryImagePlane`.
- Load thumbnails as textures.
- Preserve image aspect ratio.
- Add basic camera.
- Render all sample images in a simple temporary layout.

### User stories included
- US-B3
- US-G3
- US-J1
- US-J2

### Deliverables
- WebGL Canvas.
- Image planes rendered from JSON.
- Thumbnail texture loading.
- Aspect ratio calculation.
- Basic camera setup.
- DPR clamp.

### Acceptance criteria
- WebGL Canvas fills the viewport.
- Images render as planes using `thumbSrc`.
- Landscape, portrait, and square images are not distorted.
- DPR is clamped.
- No full-size images are used for WebGL planes.
- The app does not update React state every frame for animation values.
- The scene remains stable with at least 12 images.
- Empty or failed texture loading does not crash the whole page.

### Definition of done
- The WebGL layer can display image planes from JSON and is ready for layout logic.

---

## Phase 3 — Default 2D Circle multi-ring layout

### Goal
Implement the default 2D Circle layout with multi-ring orbit behavior.

### Scope
- Implement `circle2d` layout calculation.
- Distribute 30+ images into multiple rings.
- Add slow autoplay progress.
- Add ring-specific speed/opacity/scale.
- Add responsive configs for desktop/tablet/mobile.
- Set 2D Circle as default layout.

### User stories included
- US-C1
- US-C2
- US-G1
- US-I1
- US-I2
- US-I3

### Deliverables
- `getCircle2DLayout` function.
- Multi-ring orbit config.
- Default layout state.
- Responsive 2D Circle config.
- Basic autoplay.

### Acceptance criteria
- On page load, the gallery uses 2D Circle layout.
- Images are distributed across at least two visual rings.
- 30+ images do not appear as a single dense cluster.
- Rings move gently when idle.
- Primary ring images are clearer than background ring images.
- The center remains visually breathable.
- Mobile uses smaller radius, scale, and opacity emphasis.
- The layout remains centered after viewport resize.
- Autoplay is paused when reduced motion is active or configured so.

### Definition of done
- The first impression of the site matches the intended experimental circular gallery concept.

---

## Phase 4 — Drag, touch, and inertia

### Goal
Make the gallery interactive through mouse and touch dragging.

### Scope
- Implement pointer down/move/up.
- Support desktop mouse drag.
- Support mobile touch drag.
- Add velocity calculation.
- Add inertia after release.
- Pause autoplay while dragging.
- Resume autoplay after idle delay.
- Clamp velocity.

### User stories included
- US-G1
- US-G2
- US-G3
- US-I3

### Deliverables
- `useGalleryDrag`.
- `useGalleryProgress`.
- Velocity/inertia logic.
- Autoplay pause/resume behavior.
- Mobile touch support.

### Acceptance criteria
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

### Definition of done
- The gallery feels interactive and tactile, not just automatically animated.

---

## Phase 5 — 3D Circle, 3D Horizon, and layout switcher

### Goal
Add all layout modes and smooth switching between them.

### Scope
- Implement `circle3d` layout.
- Implement `horizon3d` layout.
- Add top-right layout switcher.
- Add active state.
- Add smooth layout transition.
- Preserve `progress` during layout switching.
- Add responsive settings per layout.

### User stories included
- US-D1
- US-D2
- US-E1
- US-E2
- US-F1
- US-F2

### Deliverables
- `getCircle3DLayout`.
- `getHorizon3DLayout`.
- `LayoutSwitcher`.
- Layout state in Zustand.
- Transition logic.
- Responsive config for all layouts.

### Acceptance criteria
- Three layout buttons are visible.
- The active layout button is clearly indicated.
- Clicking `2D Circle` activates 2D Circle.
- Clicking `3D Circle` activates 3D Circle.
- Clicking `3D Horizon` activates 3D Horizon.
- Layout transition is smooth and does not hard-cut.
- Gallery progress is preserved between layouts.
- Rapid repeated layout clicks do not break the scene.
- 3D Circle shows clear depth.
- 3D Horizon shows clear horizontal structure.
- Drag works in all three layouts.
- Mobile shows compact layout labels.
- Keyboard focus and activation work on layout buttons.

### Definition of done
- Users can switch between the three core experiences and each feels distinct.

---

## Phase 6 — Image detail modal and metadata

### Goal
Allow users to open images and view full-size photo details with metadata.

### Scope
- Add clickable image planes.
- Add `ImageDetailModal`.
- Show full-size image from `src`.
- Show metadata from JSON.
- Add open/close animation.
- Pause gallery when modal opens.
- Resume gallery after close.
- Add keyboard controls.
- Add previous/next navigation.

### User stories included
- US-H1
- US-H2
- US-H3
- US-H4
- US-K2

### Deliverables
- Modal component.
- Metadata display.
- Close button.
- Keyboard handling.
- Previous/next logic.
- Modal animation using GSAP.
- Body scroll lock.
- Focus management.

### Acceptance criteria
- Clicking an image opens the modal.
- The modal shows the full-size image using `src`.
- The modal shows location, year, and category.
- Optional title/date/camera/lens display when available.
- Gallery autoplay pauses while modal is open.
- Background gallery is dimmed or softened.
- Close button closes the modal.
- Esc closes the modal.
- ArrowRight shows next image.
- ArrowLeft shows previous image.
- Previous/next navigation loops at list boundaries.
- Closing modal restores the previous layout and gallery state.
- Focus is handled correctly enough for keyboard users.
- Body scroll is locked while modal is open.

### Definition of done
- The gallery supports the full browse → open → inspect → close loop.

---

## Phase 7 — Responsive behavior and mobile tuning

### Goal
Tune the full experience for desktop, tablet, and mobile.

### Scope
- Create viewport mode hook.
- Tune plane sizes.
- Tune radius/spacing/depth.
- Simplify mobile 2D Circle.
- Reduce mobile 3D Circle depth.
- Optimize 3D Horizon for mobile.
- Compact layout switcher labels.
- Tune modal layout for mobile.

### User stories included
- US-I1
- US-I2
- US-I3

### Deliverables
- `useViewportMode`.
- Responsive layout config.
- Mobile modal styles.
- Compact layout switcher.
- Mobile-specific motion settings.

### Acceptance criteria
- Desktop shows full labels and full motion effects.
- Tablet layout remains usable.
- Mobile keeps all three layout modes.
- Mobile default remains 2D Circle.
- Mobile 2D Circle does not feel overly dense.
- Mobile 3D Circle has reduced depth.
- Mobile 3D Horizon is smooth and easy to swipe.
- Layout buttons do not overflow.
- Modal image fits mobile viewport.
- Metadata is readable on mobile.
- No horizontal page overflow occurs.
- Touch interactions remain reliable.

### Definition of done
- The site feels intentionally designed across screen sizes, not merely shrunk.

---

## Phase 8 — Performance, accessibility, and stability pass

### Goal
Make the experience production-safe.

### Scope
- Optimize texture loading.
- Clamp DPR by viewport.
- Avoid unnecessary re-renders.
- Add reduced motion support.
- Add keyboard accessibility.
- Clean event listeners.
- Dispose resources.
- Test repeated interactions.
- Validate JSON paths and metadata.

### User stories included
- US-J1
- US-J2
- US-J3
- US-K1
- US-K2
- US-L2

### Deliverables
- Performance tuning.
- Reduced motion mode.
- Accessibility improvements.
- Cleanup logic.
- QA checklist results.
- JSON validation helper.

### Acceptance criteria
- WebGL planes use thumbnails.
- Full-size images are not loaded for every plane at startup.
- DPR is clamped on desktop and mobile.
- No obvious frame stutter on desktop with 30+ images.
- Mobile remains usable.
- Reduced motion disables or reduces autoplay.
- Reduced motion disables camera parallax and heavy effects.
- Layout buttons are keyboard accessible.
- Modal is keyboard accessible.
- Event listeners are cleaned up on unmount.
- GSAP timelines do not accumulate after repeated interactions.
- Texture/material cleanup is implemented where necessary.
- JSON missing fields or missing files are surfaced clearly during development.

### Definition of done
- The gallery is stable enough for public deployment.

---

## Phase 9 — Experimental polish

### Goal
Add award-style details after the core experience is stable.

### Scope
Optional enhancements:
- Magnetic hover.
- Custom cursor.
- Loading intro.
- Rounded corner shader.
- WebGL-to-DOM FLIP transition.
- Camera breathing.
- Orbit expansion on drag.
- Subtle metadata reveal.
- Layout switcher pill animation.
- Smooth image preloading.

### User stories included
- US-A1
- US-C2
- US-D1
- US-E1
- US-H1

### Deliverables
At least 2–4 selected polish items from the list above.

### Acceptance criteria
- Added effects improve the experience without harming usability.
- Effects are disabled or simplified in reduced motion.
- Effects do not introduce obvious performance drops.
- Custom cursor, if added, does not block normal pointer interactions.
- Rounded image treatment does not distort photos.
- Loading intro does not delay the site unnecessarily.
- WebGL-to-DOM FLIP, if added, feels smooth and does not flash.

### Definition of done
- The site feels more distinctive than a standard WebGL gallery demo.

---

## Phase 10 — Deployment and final QA

### Goal
Prepare the gallery for public release.

### Scope
- Production build.
- Deploy to Vercel or chosen host.
- Validate public paths.
- Add metadata and OG image.
- Run desktop QA.
- Run mobile QA.
- Run reduced motion QA.
- Run performance sanity check.
- Final content/image review.

### User stories included
- US-L1
- US-L2

### Deliverables
- Production deployment.
- Public URL.
- Final image set.
- Final JSON.
- QA checklist.
- Known issues list if any.

### Acceptance criteria
- Production build completes successfully.
- Public site loads without broken assets.
- JSON loads correctly in production.
- All three layouts work in production.
- Modal works in production.
- Mobile touch works in production.
- Metadata and favicon are present.
- OG image is present.
- No console errors that affect core functionality.
- Known limitations are documented.

### Definition of done
- The site is ready to share publicly.

---

# 25. Global acceptance criteria

The project is considered complete when:

- The site opens to a minimal white/off-white full-screen gallery.
- The default layout is 2D Circle.
- 30+ mixed-ratio images load from JSON.
- Images are not distorted.
- Users can drag/swipe the gallery.
- The gallery has autoplay and inertia.
- Users can switch between 2D Circle, 3D Circle, and 3D Horizon.
- Layout transitions are smooth.
- Users can click/tap an image to open detail view.
- Detail view shows image + location/year/category metadata.
- Modal can be closed reliably.
- Desktop and mobile are both usable.
- Reduced motion is respected.
- Performance is acceptable for public release.
- The site can be deployed publicly without broken paths.

---

# 26. QA checklist

## 26.1 Data QA

- [ ] `gallery.json` exists.
- [ ] All image IDs are unique.
- [ ] All `src` paths are valid.
- [ ] All `thumbSrc` paths are valid.
- [ ] All images have alt text.
- [ ] All images have location.
- [ ] All images have year.
- [ ] All images have category.
- [ ] Width and height are provided.
- [ ] Mixed aspect ratios render correctly.

## 26.2 Layout QA

- [ ] Default layout is 2D Circle.
- [ ] 2D Circle uses multiple visual rings.
- [ ] 3D Circle has depth.
- [ ] 3D Horizon scrolls horizontally.
- [ ] Layout switcher works.
- [ ] Active state is clear.
- [ ] Progress does not reset on layout switch.
- [ ] Layout transitions are smooth.

## 26.3 Interaction QA

- [ ] Autoplay starts after load.
- [ ] Drag works on desktop.
- [ ] Touch drag works on mobile.
- [ ] Inertia works after release.
- [ ] Autoplay pauses during drag.
- [ ] Autoplay resumes after idle.
- [ ] Hover works on desktop.
- [ ] Hover does not apply on mobile.

## 26.4 Modal QA

- [ ] Click image opens modal.
- [ ] Modal shows full image.
- [ ] Modal shows metadata.
- [ ] Close button works.
- [ ] Esc works.
- [ ] Arrow navigation works.
- [ ] Background gallery pauses.
- [ ] Gallery resumes after close.
- [ ] Mobile modal fits viewport.

## 26.5 Responsive QA

- [ ] Desktop layout works.
- [ ] Tablet layout works.
- [ ] Mobile layout works.
- [ ] Layout switcher does not overflow.
- [ ] Footer/HUD does not overlap important content.
- [ ] No horizontal overflow.
- [ ] Touch interaction is smooth.

## 26.6 Accessibility QA

- [ ] Layout buttons are real buttons.
- [ ] Layout buttons have visible focus.
- [ ] Active layout uses `aria-pressed`.
- [ ] Modal has dialog semantics.
- [ ] Close button has accessible label.
- [ ] Esc closes modal.
- [ ] Focus handling is acceptable.
- [ ] Reduced motion mode works.
- [ ] Alt text is present.

## 26.7 Performance QA

- [ ] Thumbnails are used in WebGL.
- [ ] Full images are used only in modal.
- [ ] DPR is clamped.
- [ ] No obvious desktop stutter.
- [ ] Mobile remains usable.
- [ ] No excessive React re-renders.
- [ ] No obvious memory leaks after repeated modal open/close.
- [ ] No obvious memory leaks after repeated layout switches.

## 26.8 Production QA

- [ ] Production build passes.
- [ ] Public URL loads.
- [ ] No broken image paths.
- [ ] Metadata works.
- [ ] Favicon works.
- [ ] OG image works.
- [ ] No critical console errors.
- [ ] Works in Chrome.
- [ ] Works in Safari.
- [ ] Works in mobile browser.

---

# 27. MVP scope summary

The MVP should include:

```txt
Next.js + TypeScript setup
R3F Canvas
JSON data loading
30+ image support
Mixed-ratio image handling
2D Circle default layout
3D Circle layout
3D Horizon layout
Layout switcher
Autoplay
Mouse/touch drag
Inertia
Image detail modal
Metadata display
Responsive layout
Reduced motion support
Basic performance optimization
Production deployment
```

The MVP should not include unless time allows:

```txt
CMS
Audio
Category filters
Deep links
Advanced shader effects
Complex post-processing
Custom route per image
User upload
```

---

# 28. Recommended implementation order

```txt
1. App setup
2. JSON loading
3. WebGL image planes
4. 2D Circle default
5. Autoplay
6. Drag/inertia
7. 3D Circle
8. 3D Horizon
9. Layout switcher
10. Modal
11. Metadata
12. Responsive
13. Accessibility
14. Performance
15. Polish
16. Deploy
```

---

# 29. Open decisions for later

These can be decided after the first working prototype:

1. Should the modal use centered layout or editorial side-metadata layout?
2. Should the project use custom cursor?
3. Should WebGL-to-DOM FLIP be included before first release?
4. Should image categories become filterable later?
5. Should each image have a shareable URL?
6. Should metadata include camera and lens publicly?
7. Should images be sorted manually, by date, or by location?
8. Should the gallery have an intro/loading screen?
9. Should mobile eventually default to 3D Horizon if 2D Circle feels too dense?

---

# 30. Final implementation recommendation

Build the MVP with this baseline:

```txt
Stack:
Next.js + TypeScript + R3F + Drei + GSAP + Zustand

Default mode:
2D Circle multi-ring

Data:
JSON file in public/data/gallery.json

Image strategy:
WebGL uses thumbnails
Modal uses full images

Motion:
Experimental but controlled
Autoplay + drag + inertia
Smooth layout morphing

Mobile:
Keep all 3 layouts
Default remains 2D Circle
Simplify 2D Circle and 3D Circle configs
Make 3D Horizon the most comfortable mobile mode

Polish after MVP:
Magnetic hover
Custom cursor
Rounded corner shader
WebGL-to-DOM FLIP
Loading intro
