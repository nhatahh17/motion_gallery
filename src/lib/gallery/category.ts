import type { GalleryImage } from "./types";

export type GalleryCategoryFilter = "all" | string;

export function getGalleryCategories(images: GalleryImage[]) {
  const categories: string[] = [];

  for (const image of images) {
    if (!categories.includes(image.category)) {
      categories.push(image.category);
    }
  }

  return categories;
}

export function filterGalleryImagesByCategory(
  images: GalleryImage[],
  category: GalleryCategoryFilter
) {
  if (category === "all") {
    return images;
  }

  return images.filter((image) => image.category === category);
}
