import { describe, expect, it } from "vitest";
import { getGalleryModalTransition } from "./modal-transition";
import type { GalleryImage } from "./types";

const images: GalleryImage[] = [
  {
    id: "photo-001",
    src: "/images/gallery/photo-001.webp",
    thumbSrc: "/images/gallery/thumbs/photo-001.webp",
    alt: "A quiet street",
    title: "After Rain",
    location: "Tokyo",
    year: "2026",
    category: "Street",
    width: 1600,
    height: 1067
  },
  {
    id: "photo-002",
    src: "/images/gallery/photo-002.webp",
    thumbSrc: "/images/gallery/thumbs/photo-002.webp",
    alt: "A concrete building",
    title: "Concrete Quiet",
    location: "Da Nang",
    year: "2025",
    category: "Architecture",
    width: 1200,
    height: 1600
  }
];

describe("getGalleryModalTransition", () => {
  it("returns a connected opening state when the selected image matches the focused image", () => {
    const transition = getGalleryModalTransition({
      focusedImageId: "photo-001",
      images,
      reducedMotion: false,
      selectedImageId: "photo-001",
      viewport: "desktop"
    });

    expect(transition.enabled).toBe(true);
    expect(transition.variant).toBe("connected");
    expect(transition.imageId).toBe("photo-001");
    expect(transition.style["--modal-origin-scale"]).toBe("0.72");
    expect(transition.style["--modal-origin-y"]).toBe("26px");
  });

  it("uses a calmer mobile origin when the selected image is not the current focused preview", () => {
    const transition = getGalleryModalTransition({
      focusedImageId: "photo-001",
      images,
      reducedMotion: false,
      selectedImageId: "photo-002",
      viewport: "mobile"
    });

    expect(transition.enabled).toBe(true);
    expect(transition.variant).toBe("fallback");
    expect(transition.imageId).toBe("photo-002");
    expect(transition.style["--modal-origin-scale"]).toBe("0.86");
    expect(transition.style["--modal-origin-y"]).toBe("14px");
  });

  it("disables connected motion for reduced motion or missing selections", () => {
    expect(
      getGalleryModalTransition({
        focusedImageId: "photo-001",
        images,
        reducedMotion: true,
        selectedImageId: "photo-001",
        viewport: "desktop"
      }).enabled
    ).toBe(false);

    expect(
      getGalleryModalTransition({
        focusedImageId: "photo-001",
        images,
        reducedMotion: false,
        selectedImageId: "missing",
        viewport: "desktop"
      }).enabled
    ).toBe(false);
  });
});
