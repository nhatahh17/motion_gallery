import { describe, expect, it } from "vitest";
import {
  filterGalleryImagesByCategory,
  getGalleryCategories,
  type GalleryCategoryFilter
} from "./category";
import type { GalleryImage } from "./types";

const images: GalleryImage[] = [
  {
    id: "photo-001",
    src: "/images/gallery/photo-001.png",
    thumbSrc: "/images/gallery/thumbs/photo-001.png",
    alt: "A quiet street",
    location: "Tokyo, Japan",
    year: "2026",
    category: "Street",
    width: 1600,
    height: 1067
  },
  {
    id: "photo-002",
    src: "/images/gallery/photo-002.png",
    thumbSrc: "/images/gallery/thumbs/photo-002.png",
    alt: "A daily cafe frame",
    location: "Da Lat, Vietnam",
    year: "2025",
    category: "Daily",
    width: 1200,
    height: 1600
  },
  {
    id: "photo-003",
    src: "/images/gallery/photo-003.png",
    thumbSrc: "/images/gallery/thumbs/photo-003.png",
    alt: "Another street frame",
    location: "Tokyo, Japan",
    year: "2026",
    category: "Street",
    width: 1600,
    height: 1067
  }
];

describe("getGalleryCategories", () => {
  it("returns stable unique categories in first-seen order", () => {
    expect(getGalleryCategories(images)).toEqual(["Street", "Daily"]);
  });
});

describe("filterGalleryImagesByCategory", () => {
  it("returns every image for the all filter", () => {
    const filter: GalleryCategoryFilter = "all";

    expect(filterGalleryImagesByCategory(images, filter)).toEqual(images);
  });

  it("returns only images matching the selected category", () => {
    expect(filterGalleryImagesByCategory(images, "Street").map((image) => image.id)).toEqual([
      "photo-001",
      "photo-003"
    ]);
  });

  it("returns an empty list for a category absent from the data", () => {
    expect(filterGalleryImagesByCategory(images, "Architecture")).toEqual([]);
  });
});
