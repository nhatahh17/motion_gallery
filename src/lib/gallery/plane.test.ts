import { describe, expect, it } from "vitest";
import type { GalleryImage } from "./types";
import { getGalleryPlaneSize } from "./plane";

const baseImage: GalleryImage = {
  id: "photo-001",
  src: "/images/gallery/photo-001.png",
  thumbSrc: "/images/gallery/thumbs/photo-001.png",
  alt: "Sample image",
  location: "Tokyo, Japan",
  year: "2026",
  category: "Street",
  width: 1600,
  height: 1067
};

describe("getGalleryPlaneSize", () => {
  it("preserves landscape aspect ratio within max width", () => {
    const size = getGalleryPlaneSize(baseImage);

    expect(size.width).toBeCloseTo(1.87, 2);
    expect(size.height).toBe(1.25);
  });

  it("preserves portrait aspect ratio without stretching", () => {
    const size = getGalleryPlaneSize({
      ...baseImage,
      width: 1200,
      height: 1600
    });

    expect(size.width).toBeCloseTo(0.94, 2);
    expect(size.height).toBe(1.25);
  });

  it("preserves square images as square planes", () => {
    const size = getGalleryPlaneSize({
      ...baseImage,
      width: 1400,
      height: 1400
    });

    expect(size.width).toBe(1.25);
    expect(size.height).toBe(1.25);
  });

  it("clamps very wide images", () => {
    const size = getGalleryPlaneSize({
      ...baseImage,
      width: 3000,
      height: 1000
    });

    expect(size.width).toBeCloseTo(1.95, 2);
    expect(size.height).toBeCloseTo(0.65, 2);
  });
});
