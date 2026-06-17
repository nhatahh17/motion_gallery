import type { GalleryViewportMode } from "./layout";

export const galleryDragConfig = {
  sensitivityDesktop: 0.0038,
  sensitivityMobile: 0.0055,
  friction: 0.925,
  maxVelocity: 0.08,
  minVelocity: 0.0008,
  resumeDelay: 2200
} as const;

export const galleryWheelConfig = {
  sensitivityDesktop: 0.0028,
  sensitivityMobile: 0.0016,
  maxDelta: 0.42,
  velocityFactor: 0.18,
  resumeDelay: 1400
} as const;

export function getDragProgressDelta({
  deltaX,
  viewport
}: {
  deltaX: number;
  viewport: GalleryViewportMode;
}) {
  const sensitivity =
    viewport === "mobile"
      ? galleryDragConfig.sensitivityMobile
      : galleryDragConfig.sensitivityDesktop;

  return -deltaX * sensitivity;
}

export function getWheelProgressDelta({
  deltaX,
  deltaY,
  viewport
}: {
  deltaX: number;
  deltaY: number;
  viewport: GalleryViewportMode;
}) {
  const dominantDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
  const sensitivity =
    viewport === "mobile"
      ? galleryWheelConfig.sensitivityMobile
      : galleryWheelConfig.sensitivityDesktop;
  const progressDelta = dominantDelta * sensitivity;

  return Math.max(-galleryWheelConfig.maxDelta, Math.min(galleryWheelConfig.maxDelta, progressDelta));
}

export function calculateDragVelocity({
  progressDelta,
  elapsedMs
}: {
  progressDelta: number;
  elapsedMs: number;
}) {
  if (elapsedMs <= 0) {
    return 0;
  }

  const frameVelocity = progressDelta / (elapsedMs / 16);
  return Math.max(
    -galleryDragConfig.maxVelocity,
    Math.min(galleryDragConfig.maxVelocity, frameVelocity)
  );
}

export function decayInertiaVelocity(velocity: number) {
  const nextVelocity = velocity * galleryDragConfig.friction;

  if (Math.abs(nextVelocity) < galleryDragConfig.minVelocity) {
    return 0;
  }

  return nextVelocity;
}

export function getInertiaVelocityAfterDrag({
  reducedMotion,
  velocity
}: {
  reducedMotion: boolean;
  velocity: number;
}) {
  return reducedMotion ? 0 : velocity;
}

export function shouldAutoplayAdvance({
  dragging,
  nowMs,
  reducedMotion,
  resumeAtMs
}: {
  dragging: boolean;
  nowMs: number;
  reducedMotion: boolean;
  resumeAtMs: number;
}) {
  return !dragging && !reducedMotion && nowMs >= resumeAtMs;
}
