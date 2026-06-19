import type { GalleryImage } from "./types";

export type GalleryCategoryFilter = "all" | string;
export type GallerySortMode = "manual" | "newest" | "location" | "category";

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

export function sortGalleryImages(images: GalleryImage[], mode: GallerySortMode) {
  if (mode === "manual") {
    return images;
  }

  return [...images].sort((first, second) => {
    if (mode === "newest") {
      const yearDelta = Number.parseInt(second.year, 10) - Number.parseInt(first.year, 10);

      if (yearDelta !== 0) {
        return yearDelta;
      }
    }

    const firstValue = getSortValue(first, mode).toLowerCase();
    const secondValue = getSortValue(second, mode).toLowerCase();
    const valueDelta = compareStableText(firstValue, secondValue);

    if (valueDelta !== 0) {
      return valueDelta;
    }

    return compareStableText(first.id, second.id);
  });
}

function compareStableText(first: string, second: string) {
  if (first < second) {
    return -1;
  }

  if (first > second) {
    return 1;
  }

  return 0;
}

function getSortValue(image: GalleryImage, mode: GallerySortMode) {
  if (mode === "location") {
    return image.location;
  }

  if (mode === "category") {
    return image.category;
  }

  return image.title ?? image.alt;
}
