"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { GalleryImage } from "@/lib/gallery/types";
import {
  getAdjacentGalleryImageId,
  getFocusedGalleryImage,
  getGalleryImageById
} from "@/lib/gallery/detail";
import {
  getViewportMode,
  type GalleryLayoutMode,
  type GalleryViewportMode
} from "@/lib/gallery/layout";
import { getMotionCursorState } from "@/lib/gallery/cursor";
import { GalleryScene } from "./GalleryScene";
import { useGalleryProgress } from "./useGalleryProgress";
import { useViewportDpr } from "./useViewportDpr";

type GalleryCanvasProps = {
  images: GalleryImage[];
};

export function GalleryCanvas({ images }: GalleryCanvasProps) {
  const dpr = useViewportDpr();
  const [layoutMode, setLayoutMode] = useState<GalleryLayoutMode>("circle2d");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);
  const [cursorDragging, setCursorDragging] = useState(false);
  const [cursorPoint, setCursorPoint] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState<GalleryViewportMode>("desktop");
  const modalOpenRef = useRef(false);
  const galleryProgress = useGalleryProgress(viewport, reducedMotion);
  const selectedImage = getGalleryImageById(images, selectedImageId);
  const motionCursor = getMotionCursorState({
    dragging: cursorDragging,
    hoveredImageId,
    modalOpen: Boolean(selectedImage),
    reducedMotion,
    viewport
  });

  const closeModal = useCallback(() => {
    setSelectedImageId(null);
    modalOpenRef.current = false;
    galleryProgress.velocityRef.current = 0;
    galleryProgress.resumeAutoplayAtRef.current =
      window.performance.now() + 2200;
  }, [galleryProgress.resumeAutoplayAtRef, galleryProgress.velocityRef]);

  const selectImage = useCallback((imageId: string) => {
    setSelectedImageId(imageId);
    modalOpenRef.current = true;
    galleryProgress.draggingRef.current = false;
    galleryProgress.velocityRef.current = 0;
    galleryProgress.resumeAutoplayAtRef.current = Number.POSITIVE_INFINITY;
  }, [galleryProgress.draggingRef, galleryProgress.resumeAutoplayAtRef, galleryProgress.velocityRef]);

  const selectFocusedImage = useCallback(() => {
    const focusedImage = getFocusedGalleryImage(images, galleryProgress.progressRef.current);

    if (focusedImage) {
      selectImage(focusedImage.id);
    }
  }, [galleryProgress.progressRef, images, selectImage]);

  const selectAdjacentImage = useCallback(
    (direction: "next" | "previous") => {
      if (!selectedImageId) {
        return;
      }

      const nextImageId = getAdjacentGalleryImageId(images, selectedImageId, direction);

      if (nextImageId) {
        setSelectedImageId(nextImageId);
      }
    },
    [images, selectedImageId]
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateReducedMotion() {
      setReducedMotion(media.matches);
    }

    updateReducedMotion();
    media.addEventListener("change", updateReducedMotion);

    return () => media.removeEventListener("change", updateReducedMotion);
  }, []);

  useEffect(() => {
    function updateViewport() {
      setViewport(getViewportMode(window.innerWidth));
    }

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (!modalOpenRef.current) {
        return;
      }

      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (event.key === "ArrowRight") {
        selectAdjacentImage("next");
        return;
      }

      if (event.key === "ArrowLeft") {
        selectAdjacentImage("previous");
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeModal, selectAdjacentImage]);

  return (
    <section
      className="gallery-canvas-shell"
      aria-label="WebGL image gallery"
      onClick={(event) => {
        if (
          selectedImage ||
          (event.target instanceof Element &&
            event.target.closest(".layout-switcher, .gallery-detail-backdrop"))
        ) {
          return;
        }

        selectFocusedImage();
      }}
      {...galleryProgress.bind}
      onPointerCancel={(event) => {
        galleryProgress.bind.onPointerCancel(event);
        setCursorDragging(false);
      }}
      onPointerDown={(event) => {
        setCursorPoint({ x: event.clientX, y: event.clientY });
        galleryProgress.bind.onPointerDown(event);
        setCursorDragging(galleryProgress.draggingRef.current);
      }}
      onPointerLeave={(event) => {
        galleryProgress.bind.onPointerLeave(event);
        setCursorDragging(false);
        setHoveredImageId(null);
      }}
      onPointerMove={(event) => {
        galleryProgress.bind.onPointerMove(event);
        setCursorPoint({ x: event.clientX, y: event.clientY });
        setCursorDragging(galleryProgress.draggingRef.current);
        if (
          !selectedImage &&
          event.target instanceof Element &&
          !event.target.closest(".layout-switcher, .gallery-detail-backdrop")
        ) {
          setHoveredImageId(
            getFocusedGalleryImage(images, galleryProgress.progressRef.current)?.id ?? null
          );
        }
      }}
      onPointerUp={(event) => {
        galleryProgress.bind.onPointerUp(event);
        setCursorDragging(false);
      }}
    >
      <div
        className="layout-switcher"
        aria-label="Gallery layout"
        onPointerDown={(event) => event.stopPropagation()}
      >
        {layoutOptions.map((option) => (
          <button
            aria-pressed={layoutMode === option.value}
            className="layout-switcher-button"
            key={option.value}
            onClick={() => setLayoutMode(option.value)}
            onPointerUp={(event) => event.stopPropagation()}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 42, near: 0.1, far: 100 }}
        dpr={[1, dpr]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
      >
        <GalleryScene
          draggingRef={galleryProgress.draggingRef}
          images={images}
          layoutMode={layoutMode}
          modalOpenRef={modalOpenRef}
          onHoverImage={setHoveredImageId}
          onSelectImage={selectImage}
          progressRef={galleryProgress.progressRef}
          reducedMotion={reducedMotion}
          resumeAutoplayAtRef={galleryProgress.resumeAutoplayAtRef}
          velocityRef={galleryProgress.velocityRef}
        />
      </Canvas>
      <div
        aria-hidden="true"
        className={`motion-cursor motion-cursor-${motionCursor.variant}`}
        data-visible={motionCursor.visible ? "true" : "false"}
        style={{
          transform: `translate3d(${cursorPoint.x}px, ${cursorPoint.y}px, 0)`
        }}
      >
        {motionCursor.label}
      </div>
      {selectedImage ? (
        <div
          aria-modal="true"
          className="gallery-detail-backdrop"
          onClick={closeModal}
          onPointerDown={(event) => event.stopPropagation()}
          role="dialog"
        >
          <article
            aria-label={selectedImage.title ?? selectedImage.alt}
            className="gallery-detail-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close image detail"
              className="gallery-detail-close"
              onClick={closeModal}
              type="button"
            >
              Close
            </button>
            <div className="gallery-detail-nav" aria-label="Image navigation">
              <button
                aria-label="Previous image"
                className="gallery-detail-nav-button"
                onClick={() => selectAdjacentImage("previous")}
                type="button"
              >
                Previous
              </button>
              <button
                aria-label="Next image"
                className="gallery-detail-nav-button"
                onClick={() => selectAdjacentImage("next")}
                type="button"
              >
                Next
              </button>
            </div>
            <img
              alt={selectedImage.alt}
              className="gallery-detail-image"
              draggable={false}
              src={selectedImage.src}
            />
            <div className="gallery-detail-copy">
              <p className="gallery-detail-kicker">
                {selectedImage.category} / {selectedImage.year}
              </p>
              <h2>{selectedImage.title ?? selectedImage.alt}</h2>
              <p>{selectedImage.location}</p>
              <dl>
                {selectedImage.date ? (
                  <>
                    <dt>Date</dt>
                    <dd>{selectedImage.date}</dd>
                  </>
                ) : null}
                {selectedImage.camera ? (
                  <>
                    <dt>Camera</dt>
                    <dd>{selectedImage.camera}</dd>
                  </>
                ) : null}
                {selectedImage.lens ? (
                  <>
                    <dt>Lens</dt>
                    <dd>{selectedImage.lens}</dd>
                  </>
                ) : null}
              </dl>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}

const layoutOptions: Array<{ label: string; value: GalleryLayoutMode }> = [
  { label: "2D Circle", value: "circle2d" },
  { label: "3D Circle", value: "circle3d" },
  { label: "3D Horizon", value: "horizon3d" }
];
