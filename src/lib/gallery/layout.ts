export type GalleryViewportMode = "desktop" | "tablet" | "mobile";
export type GalleryLayoutMode = "circle2d" | "circle3d" | "horizon3d";

type GalleryLayoutInput = {
  index: number;
  total: number;
  progress: number;
  viewport: GalleryViewportMode;
};

export type Circle2DLayoutInput = GalleryLayoutInput;
export type Circle3DLayoutInput = GalleryLayoutInput;
export type Horizon3DLayoutInput = GalleryLayoutInput;

export type GalleryPlacement = {
  x: number;
  y: number;
  z: number;
  rotationY: number;
  rotationZ: number;
  opacity: number;
  scale: number;
  layoutMode: GalleryLayoutMode;
};

export type Circle2DPlacement = GalleryPlacement & {
  ringIndex: number;
};

export type Circle3DPlacement = GalleryPlacement & {
  depth: number;
};

export type Horizon3DPlacement = GalleryPlacement & {
  laneOffset: number;
};

type Circle2DRingConfig = {
  radiusX: number;
  radiusY: number;
  speed: number;
  opacity: number;
  scale: number;
};

const desktopRings: Circle2DRingConfig[] = [
  { radiusX: 4.8, radiusY: 2.1, speed: 1, opacity: 0.96, scale: 1 },
  { radiusX: 3.7, radiusY: 1.55, speed: -0.72, opacity: 0.62, scale: 0.82 },
  { radiusX: 5.8, radiusY: 2.55, speed: 0.48, opacity: 0.38, scale: 0.68 }
];

const viewportScale: Record<GalleryViewportMode, number> = {
  desktop: 1,
  tablet: 0.82,
  mobile: 0.58
};

const imageScale: Record<GalleryViewportMode, number> = {
  desktop: 1,
  tablet: 0.9,
  mobile: 0.72
};

const opacityBoost: Record<GalleryViewportMode, number> = {
  desktop: 1,
  tablet: 0.96,
  mobile: 0.9
};

const circle3DRadius: Record<GalleryViewportMode, number> = {
  desktop: 4.15,
  tablet: 3.35,
  mobile: 2.55
};

const circle3DVerticalWave: Record<GalleryViewportMode, number> = {
  desktop: 0.42,
  tablet: 0.34,
  mobile: 0.24
};

const horizonSpacing: Record<GalleryViewportMode, number> = {
  desktop: 1.18,
  tablet: 0.98,
  mobile: 0.7
};

const horizonDepth: Record<GalleryViewportMode, number> = {
  desktop: 0.42,
  tablet: 0.34,
  mobile: 0.24
};

const horizonVisibleRange: Record<GalleryViewportMode, number> = {
  desktop: 7,
  tablet: 6,
  mobile: 5
};

const autoplayUnitsPerSecond: Record<GalleryLayoutMode, number> = {
  circle2d: 0.096,
  circle3d: 0.069,
  horizon3d: 0.048
};

export function getCircle2DLayout({
  index,
  total,
  progress,
  viewport
}: Circle2DLayoutInput): Circle2DPlacement {
  const safeTotal = Math.max(total, 1);
  const ringIndex = index % desktopRings.length;
  const ring = desktopRings[ringIndex];
  const scale = viewportScale[viewport];
  const angle = (index / safeTotal) * Math.PI * 2 + progress * ring.speed;
  const x = Math.cos(angle) * ring.radiusX * scale;
  const y = Math.sin(angle) * ring.radiusY * scale;
  const z = ringIndex * -0.16;

  return {
    x,
    y,
    z,
    rotationY: 0,
    rotationZ: Math.sin(angle) * 0.045,
    layoutMode: "circle2d",
    opacity: ring.opacity * opacityBoost[viewport],
    scale: ring.scale * imageScale[viewport],
    ringIndex
  };
}

export function getCircle3DLayout({
  index,
  total,
  progress,
  viewport
}: Circle3DLayoutInput): Circle3DPlacement {
  const safeTotal = Math.max(total, 1);
  const radius = circle3DRadius[viewport];
  const angle = (index / safeTotal) * Math.PI * 2 + progress;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius * 0.72;
  const y = Math.sin(angle * 1.7 + index) * circle3DVerticalWave[viewport];
  const depth = (Math.cos(angle) + 1) / 2;
  const baseScale = 0.56 + depth * 0.5;

  return {
    x,
    y,
    z,
    rotationY: angle * -0.36,
    rotationZ: Math.sin(angle * 0.7) * 0.025,
    layoutMode: "circle3d",
    opacity: (0.24 + depth * 0.72) * opacityBoost[viewport],
    scale: baseScale * imageScale[viewport],
    depth
  };
}

export function getHorizon3DLayout({
  index,
  total,
  progress,
  viewport
}: Horizon3DLayoutInput): Horizon3DPlacement {
  const safeTotal = Math.max(total, 1);
  const wrapped = ((index - progress) % safeTotal + safeTotal) % safeTotal;
  const laneOffset = wrapped > safeTotal / 2 ? wrapped - safeTotal : wrapped;
  const absoluteOffset = Math.abs(laneOffset);
  const visibleRange = horizonVisibleRange[viewport];
  const emphasis = Math.max(0, 1 - absoluteOffset / visibleRange);
  const direction = Math.sign(laneOffset);
  const x = laneOffset * horizonSpacing[viewport];
  const y = Math.sin((index / safeTotal) * Math.PI * 2) * 0.1 * viewportScale[viewport];
  const z = 1.25 - absoluteOffset * horizonDepth[viewport];

  return {
    x,
    y,
    z,
    rotationY: direction * -0.34,
    rotationZ: direction * -0.025,
    layoutMode: "horizon3d",
    opacity: (0.18 + emphasis * 0.78) * opacityBoost[viewport],
    scale: (0.54 + emphasis * 0.52) * imageScale[viewport],
    laneOffset
  };
}

export function getGalleryLayout({
  layoutMode,
  ...input
}: GalleryLayoutInput & { layoutMode: GalleryLayoutMode }): GalleryPlacement {
  if (layoutMode === "circle3d") {
    return getCircle3DLayout(input);
  }

  if (layoutMode === "horizon3d") {
    return getHorizon3DLayout(input);
  }

  return getCircle2DLayout(input);
}

export function getCircle2DAutoplayStep({
  deltaSeconds,
  reducedMotion
}: {
  deltaSeconds: number;
  reducedMotion: boolean;
}) {
  if (reducedMotion) {
    return 0;
  }

  return deltaSeconds * autoplayUnitsPerSecond.circle2d;
}

export function getGalleryAutoplayStep({
  deltaSeconds,
  layoutMode,
  reducedMotion
}: {
  deltaSeconds: number;
  layoutMode: GalleryLayoutMode;
  reducedMotion: boolean;
}) {
  if (reducedMotion) {
    return 0;
  }

  return deltaSeconds * autoplayUnitsPerSecond[layoutMode];
}

export function getViewportMode(width: number): GalleryViewportMode {
  if (width <= 640) {
    return "mobile";
  }

  if (width <= 960) {
    return "tablet";
  }

  return "desktop";
}
