"use client";

import { useCallback, useMemo, useRef } from "react";
import type { PointerEvent } from "react";
import {
  calculateDragVelocity,
  galleryDragConfig,
  getDragProgressDelta
} from "@/lib/gallery/interaction";
import type { GalleryViewportMode } from "@/lib/gallery/layout";

export function useGalleryProgress(viewport: GalleryViewportMode) {
  const progressRef = useRef(0);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const resumeAutoplayAtRef = useRef(0);
  const lastPointerRef = useRef<{ x: number; time: number } | null>(null);

  const endDrag = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!draggingRef.current) {
      return;
    }

    draggingRef.current = false;
    resumeAutoplayAtRef.current = window.performance.now() + galleryDragConfig.resumeDelay;
    lastPointerRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  return useMemo(
    () => ({
      draggingRef,
      progressRef,
      resumeAutoplayAtRef,
      velocityRef,
      bind: {
        onPointerCancel: endDrag,
        onPointerDown(event: PointerEvent<HTMLElement>) {
          if (event.button !== 0 && event.pointerType === "mouse") {
            return;
          }

          draggingRef.current = true;
          velocityRef.current = 0;
          resumeAutoplayAtRef.current = Number.POSITIVE_INFINITY;
          lastPointerRef.current = {
            x: event.clientX,
            time: window.performance.now()
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        },
        onPointerLeave: endDrag,
        onPointerMove(event: PointerEvent<HTMLElement>) {
          if (!draggingRef.current || !lastPointerRef.current) {
            return;
          }

          event.preventDefault();

          const now = window.performance.now();
          const deltaX = event.clientX - lastPointerRef.current.x;
          const progressDelta = getDragProgressDelta({ deltaX, viewport });

          progressRef.current += progressDelta;
          velocityRef.current = calculateDragVelocity({
            elapsedMs: now - lastPointerRef.current.time,
            progressDelta
          });
          lastPointerRef.current = { x: event.clientX, time: now };
        },
        onPointerUp: endDrag
      }
    }),
    [endDrag, viewport]
  );
}
