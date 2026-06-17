import type { GalleryViewportMode } from "./layout";

type GalleryCameraMotionInput = {
  elapsedSeconds: number;
  modalOpen: boolean;
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
  viewport: GalleryViewportMode;
};

type GalleryCameraMotion = {
  x: number;
  y: number;
  z: number;
};

const baseCamera: GalleryCameraMotion = { x: 0, y: 0, z: 7.2 };

const movementByViewport: Record<GalleryViewportMode, { breath: number; parallax: number }> = {
  desktop: { breath: 0.12, parallax: 0.16 },
  tablet: { breath: 0.075, parallax: 0.09 },
  mobile: { breath: 0.035, parallax: 0.035 }
};

export function getGalleryCameraMotion({
  elapsedSeconds,
  modalOpen,
  pointerX,
  pointerY,
  reducedMotion,
  viewport
}: GalleryCameraMotionInput): GalleryCameraMotion {
  if (reducedMotion || modalOpen) {
    return baseCamera;
  }

  const movement = movementByViewport[viewport];
  const breathing = Math.sin(elapsedSeconds * 0.55) * movement.breath;
  const drift = Math.cos(elapsedSeconds * 0.36) * movement.breath * 0.35;

  return {
    x: pointerX * movement.parallax + drift,
    y: pointerY * movement.parallax * 0.62,
    z: baseCamera.z + breathing
  };
}
