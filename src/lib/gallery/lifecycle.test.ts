import { describe, expect, it } from "vitest";
import { resetGalleryLifecycleRefs } from "./lifecycle";

function ref<T>(current: T) {
  return { current };
}

describe("resetGalleryLifecycleRefs", () => {
  it("resets transient modal, drag, cursor, camera, and analytics refs", () => {
    const refs = {
      cameraPointerRef: ref({ x: 0.7, y: -0.4 }),
      cursorDraggingRef: ref(true),
      dragAnalyticsActiveRef: ref(true),
      draggingRef: ref(true),
      modalOpenRef: ref(true),
      modalSwipeStartRef: ref({ pointerType: "touch", x: 20, y: 40 }),
      resumeAutoplayAtRef: ref(Number.POSITIVE_INFINITY),
      selectedImageIdRef: ref("photo-001"),
      shellPointerStartRef: ref({ x: 10, y: 12 }),
      velocityRef: ref(0.04)
    };

    resetGalleryLifecycleRefs(refs, { nowMs: 1000, resumeDelayMs: 2200 });

    expect(refs.cameraPointerRef.current).toEqual({ x: 0, y: 0 });
    expect(refs.cursorDraggingRef.current).toBe(false);
    expect(refs.dragAnalyticsActiveRef.current).toBe(false);
    expect(refs.draggingRef.current).toBe(false);
    expect(refs.modalOpenRef.current).toBe(false);
    expect(refs.modalSwipeStartRef.current).toBeNull();
    expect(refs.resumeAutoplayAtRef.current).toBe(3200);
    expect(refs.selectedImageIdRef.current).toBe("photo-001");
    expect(refs.shellPointerStartRef.current).toBeNull();
    expect(refs.velocityRef.current).toBe(0);
  });

  it("can clear selected image state when a forced modal clear invalidates the selection", () => {
    const selectedImageIdRef = ref<string | null>("photo-002");

    resetGalleryLifecycleRefs(
      {
        cameraPointerRef: ref({ x: 0.2, y: 0.3 }),
        cursorDraggingRef: ref(false),
        dragAnalyticsActiveRef: ref(false),
        draggingRef: ref(false),
        modalOpenRef: ref(true),
        modalSwipeStartRef: ref(null),
        resumeAutoplayAtRef: ref(0),
        selectedImageIdRef,
        shellPointerStartRef: ref(null),
        velocityRef: ref(0.01)
      },
      { clearSelectedImage: true, nowMs: 50, resumeDelayMs: 0 }
    );

    expect(selectedImageIdRef.current).toBeNull();
  });
});
