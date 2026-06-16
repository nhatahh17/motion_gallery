"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { GalleryImage } from "@/lib/gallery/types";
import { getFocusedGalleryImage, getGalleryImageById } from "@/lib/gallery/detail";
import {
  getViewportMode,
  type GalleryLayoutMode,
  type GalleryViewportMode
} from "@/lib/gallery/layout";
import { GalleryScene } from "./GalleryScene";
import { useGalleryProgress } from "./useGalleryProgress";
import { useViewportDpr } from "./useViewportDpr";

type GalleryCanvasProps = {
  images: GalleryImage[];
};

export function GalleryCanvas({ images }: GalleryCanvasProps) {
  const dpr = useViewportDpr();
  const [layoutMode, setLayoutMode] = useState<GalleryLayoutMode>("circle2d");
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<GalleryViewportMode>("desktop");
  const modalOpenRef = useRef(false);
  const galleryProgress = useGalleryProgress(viewport);
  const selectedImage = getGalleryImageById(images, selectedImageId);

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
      if (event.key === "Escape" && modalOpenRef.current) {
        closeModal();
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeModal]);

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
          onSelectImage={selectImage}
          progressRef={galleryProgress.progressRef}
          resumeAutoplayAtRef={galleryProgress.resumeAutoplayAtRef}
          velocityRef={galleryProgress.velocityRef}
        />
      </Canvas>
      {selectedImage ? (
        <div
          aria-modal="true"
          className="gallery-detail-backdrop"
          onClick={closeModal}
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
