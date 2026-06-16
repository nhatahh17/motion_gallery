import type { GalleryImage } from "./types";

const clickMovementThreshold = 6;

export function getGalleryImageById(images: GalleryImage[], imageId: string | null) {
  if (!imageId) {
    return null;
  }

  return images.find((image) => image.id === imageId) ?? null;
}

export function getFocusedGalleryImage(images: GalleryImage[], progress: number) {
  if (images.length === 0) {
    return null;
  }

  const index = ((Math.round(progress) % images.length) + images.length) % images.length;
  return images[index];
}

export function isGalleryClick({
  startX,
  startY,
  endX,
  endY
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}) {
  return Math.hypot(endX - startX, endY - startY) <= clickMovementThreshold;
}
