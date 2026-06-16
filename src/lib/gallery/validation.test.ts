import { describe, expect, it } from "vitest";
import { validateGalleryImages } from "./validation";

const validImage = {
  id: "photo-001",
  src: "/images/gallery/photo-001.webp",
  thumbSrc: "/images/gallery/thumbs/photo-001.webp",
  alt: "A quiet street after rain",
  title: "After Rain",
  location: "Tokyo, Japan",
  year: "2026",
  category: "Street",
  width: 1600,
  height: 1067,
  ratio: "landscape",
  dominantColor: "#e8e8e2"
};

describe("validateGalleryImages", () => {
  it("returns typed gallery images when required fields are valid", () => {
    const images = validateGalleryImages([validImage]);

    expect(images).toHaveLength(1);
    expect(images[0]).toMatchObject({
      id: "photo-001",
      location: "Tokyo, Japan",
      width: 1600,
      height: 1067
    });
  });

  it("rejects duplicate ids and invalid dimensions", () => {
    expect(() =>
      validateGalleryImages([
        validImage,
        {
          ...validImage,
          src: "",
          width: 0,
          height: -1
        }
      ])
    ).toThrow(/photo-001.*duplicate id.*src.*width.*height/s);
  });

  it("rejects non-array payloads with a developer-friendly message", () => {
    expect(() => validateGalleryImages({ images: [validImage] })).toThrow(
      /gallery payload must be an array/i
    );
  });
});
