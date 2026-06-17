import type { GalleryViewportMode } from "./layout";

export type MotionCursorVariant = "hidden" | "view" | "drag";

export type MotionCursorState = {
  label: string;
  visible: boolean;
  variant: MotionCursorVariant;
};

type MotionCursorInput = {
  dragging: boolean;
  hoveredImageId: string | null;
  modalOpen: boolean;
  reducedMotion: boolean;
  viewport: GalleryViewportMode;
};

export function getMotionCursorState({
  dragging,
  hoveredImageId,
  modalOpen,
  reducedMotion,
  viewport
}: MotionCursorInput): MotionCursorState {
  if (reducedMotion || modalOpen || viewport !== "desktop") {
    return { label: "", visible: false, variant: "hidden" };
  }

  if (dragging) {
    return { label: "Drag", visible: true, variant: "drag" };
  }

  if (hoveredImageId) {
    return { label: "View", visible: true, variant: "view" };
  }

  return { label: "", visible: false, variant: "hidden" };
}
