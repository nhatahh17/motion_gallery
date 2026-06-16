export type GalleryViewportMode = "desktop" | "tablet" | "mobile";

export type Circle2DLayoutInput = {
  index: number;
  total: number;
  progress: number;
  viewport: GalleryViewportMode;
};

export type Circle2DPlacement = {
  x: number;
  y: number;
  z: number;
  rotationZ: number;
  opacity: number;
  scale: number;
  ringIndex: number;
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

const autoplayUnitsPerSecond = 0.096;

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
    rotationZ: Math.sin(angle) * 0.045,
    opacity: ring.opacity * opacityBoost[viewport],
    scale: ring.scale * imageScale[viewport],
    ringIndex
  };
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

  return deltaSeconds * autoplayUnitsPerSecond;
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
