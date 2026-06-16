import type { GalleryImage } from "./types";

export type GalleryPlaneSize = {
  width: number;
  height: number;
};

const baseHeight = 1.25;
const maxWidth = 1.95;
const maxHeight = 1.55;

export function getGalleryPlaneSize(image: GalleryImage): GalleryPlaneSize {
  const aspect = image.width / image.height;
  let width = baseHeight * aspect;
  let height = baseHeight;

  if (width > maxWidth) {
    const scale = maxWidth / width;
    width *= scale;
    height *= scale;
  }

  if (height > maxHeight) {
    const scale = maxHeight / height;
    width *= scale;
    height *= scale;
  }

  return { width, height };
}
