"use client";

import { useCallback, useMemo, useRef } from "react";
import type { PointerEvent, WheelEvent } from "react";
import {
  calculateDragVelocity,
  galleryDragConfig,
  galleryWheelConfig,
  getDragProgressDelta,
  getInertiaVelocityAfterDrag,
  getWheelProgressDelta
} from "@/lib/gallery/interaction";
import type { GalleryViewportMode } from "@/lib/gallery/layout";

export function useGalleryProgress(viewport: GalleryViewportMode, reducedMotion: boolean) {
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
          velocityRef.current = getInertiaVelocityAfterDrag({
            reducedMotion,
            velocity: calculateDragVelocity({
              elapsedMs: now - lastPointerRef.current.time,
              progressDelta
            })
          });
          lastPointerRef.current = { x: event.clientX, time: now };
        },
        onPointerUp: endDrag,
        onWheel(event: WheelEvent<HTMLElement>) {
          if (reducedMotion) {
            return;
          }

          const progressDelta = getWheelProgressDelta({
            deltaX: event.deltaX,
            deltaY: event.deltaY,
            viewport
          });

          if (progressDelta === 0) {
            return;
          }

          progressRef.current += progressDelta;
          velocityRef.current = getInertiaVelocityAfterDrag({
            reducedMotion,
            velocity: Math.max(
              -galleryDragConfig.maxVelocity,
              Math.min(galleryDragConfig.maxVelocity, progressDelta * galleryWheelConfig.velocityFactor)
            )
          });
          resumeAutoplayAtRef.current = window.performance.now() + galleryWheelConfig.resumeDelay;
        }
      }
    }),
    [endDrag, reducedMotion, viewport]
  );
}
