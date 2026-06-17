import { describe, expect, it } from "vitest";
import {
  buildGalleryPhotoHref,
  clearGalleryPhotoHref,
  getAdjacentGalleryImageId,
  getGalleryModalPreloadTargets,
  getFocusedGalleryImage,
  getGalleryImageById,
  getGalleryPhotoIdFromSearchParams,
  isGalleryClick
} from "./detail";
import type { GalleryImage } from "./types";

const images: GalleryImage[] = [
  {
    id: "photo-001",
    src: "/images/gallery/photo-001.png",
    thumbSrc: "/images/gallery/thumbs/photo-001.png",
    alt: "A quiet street in Tokyo after rain",
    title: "After Rain",
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
    alt: "Soft morning light across a cafe window",
    location: "Da Lat, Vietnam",
    year: "2025",
    category: "Daily",
    width: 1200,
    height: 1600
  }
];

const threeImages: GalleryImage[] = [
  ...images,
  {
    id: "photo-003",
    src: "/images/gallery/photo-003.png",
    thumbSrc: "/images/gallery/thumbs/photo-003.png",
    alt: "A pale corner wall with afternoon light",
    location: "Da Lat, Vietnam",
    year: "2025",
    category: "Architecture",
    width: 1400,
    height: 1400
  }
];

describe("getGalleryImageById", () => {
  it("returns the selected gallery image by id", () => {
    expect(getGalleryImageById(images, "photo-002")).toEqual(images[1]);
  });

  it("returns null when the selected id is missing", () => {
    expect(getGalleryImageById(images, "missing")).toBeNull();
    expect(getGalleryImageById(images, null)).toBeNull();
  });
});

describe("getFocusedGalleryImage", () => {
  it("returns the image nearest the current progress", () => {
    expect(getFocusedGalleryImage(images, 0)?.id).toBe("photo-001");
    expect(getFocusedGalleryImage(images, 1.1)?.id).toBe("photo-002");
  });

  it("wraps progress through the available images", () => {
    expect(getFocusedGalleryImage(images, 2.2)?.id).toBe("photo-001");
    expect(getFocusedGalleryImage(images, -0.9)?.id).toBe("photo-002");
  });
});

describe("isGalleryClick", () => {
  it("allows small pointer movement to count as an image click", () => {
    expect(isGalleryClick({ startX: 100, startY: 200, endX: 103, endY: 204 })).toBe(true);
  });

  it("rejects larger movement so drags do not open the modal", () => {
    expect(isGalleryClick({ startX: 100, startY: 200, endX: 120, endY: 204 })).toBe(false);
  });
});

describe("getAdjacentGalleryImageId", () => {
  it("returns the next or previous image id from the current modal image", () => {
    expect(getAdjacentGalleryImageId(images, "photo-001", "next")).toBe("photo-002");
    expect(getAdjacentGalleryImageId(images, "photo-002", "previous")).toBe("photo-001");
  });

  it("wraps around the gallery and ignores missing selections", () => {
    expect(getAdjacentGalleryImageId(images, "photo-002", "next")).toBe("photo-001");
    expect(getAdjacentGalleryImageId(images, "photo-001", "previous")).toBe("photo-002");
    expect(getAdjacentGalleryImageId(images, "missing", "next")).toBeNull();
  });
});

describe("gallery detail URL helpers", () => {
  it("reads a selected photo id from query params", () => {
    expect(getGalleryPhotoIdFromSearchParams(new URLSearchParams("photo=photo-002"))).toBe(
      "photo-002"
    );
    expect(getGalleryPhotoIdFromSearchParams(new URLSearchParams("category=Street"))).toBeNull();
  });

  it("builds and clears shareable photo hrefs while preserving other params", () => {
    const params = new URLSearchParams("category=Street&page=1");

    expect(buildGalleryPhotoHref(params, "photo-001")).toBe(
      "/?category=Street&page=1&photo=photo-001"
    );
    expect(clearGalleryPhotoHref(new URLSearchParams("category=Street&photo=photo-001"))).toBe(
      "/?category=Street"
    );
  });
});

describe("getGalleryModalPreloadTargets", () => {
  it("returns previous and next full-size image sources for the selected modal image", () => {
    expect(getGalleryModalPreloadTargets(threeImages, "photo-002")).toEqual([
      "/images/gallery/photo-001.png",
      "/images/gallery/photo-003.png"
    ]);
  });

  it("wraps preload targets and ignores missing or single-image selections", () => {
    expect(getGalleryModalPreloadTargets(threeImages, "photo-001")).toEqual([
      "/images/gallery/photo-003.png",
      "/images/gallery/photo-002.png"
    ]);
    expect(getGalleryModalPreloadTargets(threeImages, "missing")).toEqual([]);
    expect(getGalleryModalPreloadTargets([threeImages[0]], "photo-001")).toEqual([]);
  });
});
