import type { CSSProperties } from "react";
import type { GalleryViewportMode } from "./layout";
import type { GalleryImage } from "./types";

type ModalTransitionInput = {
  focusedImageId: string | null;
  images: GalleryImage[];
  reducedMotion: boolean;
  selectedImageId: string | null;
  viewport: GalleryViewportMode;
};

type ModalTransitionStyle = CSSProperties & {
  "--modal-origin-scale"?: string;
  "--modal-origin-y"?: string;
};

export type GalleryModalTransition = {
  enabled: boolean;
  imageId: string | null;
  style: ModalTransitionStyle;
  variant: "connected" | "fallback" | "reduced";
};

const originByViewport: Record<GalleryViewportMode, { scale: string; y: string }> = {
  desktop: { scale: "0.72", y: "26px" },
  tablet: { scale: "0.78", y: "22px" },
  mobile: { scale: "0.86", y: "14px" }
};

export function getGalleryModalTransition({
  focusedImageId,
  images,
  reducedMotion,
  selectedImageId,
  viewport
}: ModalTransitionInput): GalleryModalTransition {
  const selectedImage = images.find((image) => image.id === selectedImageId);

  if (!selectedImage || reducedMotion) {
    return {
      enabled: false,
      imageId: selectedImage?.id ?? null,
      style: {},
      variant: "reduced"
    };
  }

  const origin = originByViewport[viewport];
  const variant = selectedImage.id === focusedImageId ? "connected" : "fallback";

  return {
    enabled: true,
    imageId: selectedImage.id,
    style: {
      "--modal-origin-scale": origin.scale,
      "--modal-origin-y": origin.y
    },
    variant
  };
}
