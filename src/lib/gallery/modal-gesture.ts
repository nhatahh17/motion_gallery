import type { GalleryViewportMode } from "./layout";

const minSwipeDownDistance = 82;
const maxHorizontalDrift = 44;

export function shouldCloseModalFromSwipe({
  endX,
  endY,
  pointerType,
  reducedMotion,
  startX,
  startY,
  viewport
}: {
  endX: number;
  endY: number;
  pointerType: string;
  reducedMotion: boolean;
  startX: number;
  startY: number;
  viewport: GalleryViewportMode;
}) {
  if (reducedMotion || pointerType !== "touch" || viewport === "desktop") {
    return false;
  }

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  return deltaY >= minSwipeDownDistance && Math.abs(deltaX) <= maxHorizontalDrift;
}
