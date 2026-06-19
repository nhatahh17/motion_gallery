import type { MutableRefObject } from "react";

type Point = { x: number; y: number };
type SwipeStart = { pointerType: string; x: number; y: number };

type GalleryLifecycleRefs = {
  cameraPointerRef: MutableRefObject<Point>;
  cursorDraggingRef: MutableRefObject<boolean>;
  dragAnalyticsActiveRef: MutableRefObject<boolean>;
  draggingRef: MutableRefObject<boolean>;
  modalOpenRef: MutableRefObject<boolean>;
  modalSwipeStartRef: MutableRefObject<SwipeStart | null>;
  resumeAutoplayAtRef: MutableRefObject<number>;
  selectedImageIdRef: MutableRefObject<string | null>;
  shellPointerStartRef: MutableRefObject<Point | null>;
  velocityRef: MutableRefObject<number>;
};

type ResetGalleryLifecycleOptions = {
  clearSelectedImage?: boolean;
  nowMs: number;
  resumeDelayMs: number;
};

export function resetGalleryLifecycleRefs(
  refs: GalleryLifecycleRefs,
  options: ResetGalleryLifecycleOptions
) {
  refs.cameraPointerRef.current = { x: 0, y: 0 };
  refs.cursorDraggingRef.current = false;
  refs.dragAnalyticsActiveRef.current = false;
  refs.draggingRef.current = false;
  refs.modalOpenRef.current = false;
  refs.modalSwipeStartRef.current = null;
  refs.resumeAutoplayAtRef.current = options.nowMs + options.resumeDelayMs;
  refs.shellPointerStartRef.current = null;
  refs.velocityRef.current = 0;

  if (options.clearSelectedImage) {
    refs.selectedImageIdRef.current = null;
  }
}
