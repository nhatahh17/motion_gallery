"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Canvas } from "@react-three/fiber";
import type { GalleryCategoryFilter, GallerySortMode } from "@/lib/gallery/category";
import type { GalleryImage } from "@/lib/gallery/types";
import {
  getAdjacentGalleryImageId,
  getFocusedGalleryImagePreview,
  getFocusedGalleryImage,
  getGalleryImageById,
  getGalleryModalPreloadTargets,
  isGalleryClick
} from "@/lib/gallery/detail";
import {
  getViewportMode,
  type GalleryLayoutMode,
  type GalleryViewportMode
} from "@/lib/gallery/layout";
import { getMotionCursorState } from "@/lib/gallery/cursor";
import { getLayoutSwitcherPillState } from "@/lib/gallery/switcher";
import { getGalleryModalTransition } from "@/lib/gallery/modal-transition";
import {
  dispatchGalleryAnalyticsEvent,
  shouldEmitReducedMotionAnalytics
} from "@/lib/gallery/analytics";
import { GalleryScene } from "./GalleryScene";
import { useGalleryProgress } from "./useGalleryProgress";
import { useViewportDpr } from "./useViewportDpr";

type GalleryCanvasProps = {
  categoryFilter: GalleryCategoryFilter;
  categoryOptions: string[];
  images: GalleryImage[];
  onCategoryFilterChange: (category: GalleryCategoryFilter) => void;
  onSelectedPhotoIdChange: (imageId: string | null) => void;
  onSortModeChange: (sortMode: GallerySortMode) => void;
  selectedPhotoId: string | null;
  sortMode: GallerySortMode;
};

export function GalleryCanvas({
  categoryFilter,
  categoryOptions,
  images,
  onCategoryFilterChange,
  onSelectedPhotoIdChange,
  onSortModeChange,
  selectedPhotoId,
  sortMode
}: GalleryCanvasProps) {
  const dpr = useViewportDpr();
  const [layoutMode, setLayoutMode] = useState<GalleryLayoutMode>("circle2d");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);
  const [cursorDragging, setCursorDragging] = useState(false);
  const [cursorPoint, setCursorPoint] = useState({ x: 0, y: 0 });
  const [focusedPreview, setFocusedPreview] = useState<{
    id: string;
    title: string;
    metadata: string;
  } | null>(null);
  const [viewport, setViewport] = useState<GalleryViewportMode>("desktop");
  const modalOpenRef = useRef(false);
  const cameraPointerRef = useRef({ x: 0, y: 0 });
  const dragAnalyticsActiveRef = useRef(false);
  const reducedMotionAnalyticsEmittedRef = useRef(false);
  const shellPointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const galleryProgress = useGalleryProgress(viewport, reducedMotion);
  const selectedImage = getGalleryImageById(images, selectedImageId);
  const modalPreloadTargets = selectedImage
    ? getGalleryModalPreloadTargets(images, selectedImage.id)
    : [];
  const layoutPill = getLayoutSwitcherPillState({
    activeLayout: layoutMode,
    layoutOrder: layoutOptions.map((option) => option.value),
    reducedMotion
  });
  const motionCursor = getMotionCursorState({
    dragging: cursorDragging,
    hoveredImageId,
    modalOpen: Boolean(selectedImage),
    reducedMotion,
    viewport
  });
  const modalTransition = getGalleryModalTransition({
    focusedImageId: focusedPreview?.id ?? null,
    images,
    reducedMotion,
    selectedImageId,
    viewport
  });

  const closeModal = useCallback(() => {
    if (selectedImage) {
      dispatchGalleryAnalyticsEvent(window, "image_closed", {
        category: selectedImage.category,
        imageId: selectedImage.id,
        title: selectedImage.title ?? selectedImage.alt
      });
    }

    setSelectedImageId(null);
    onSelectedPhotoIdChange(null);
    modalOpenRef.current = false;
    cameraPointerRef.current = { x: 0, y: 0 };
    galleryProgress.velocityRef.current = 0;
    galleryProgress.resumeAutoplayAtRef.current =
      window.performance.now() + 2200;
  }, [
    galleryProgress.resumeAutoplayAtRef,
    galleryProgress.velocityRef,
    onSelectedPhotoIdChange,
    selectedImage
  ]);

  const selectImage = useCallback((imageId: string) => {
    const nextImage = getGalleryImageById(images, imageId);

    if (nextImage) {
      dispatchGalleryAnalyticsEvent(window, "image_opened", {
        category: nextImage.category,
        imageId: nextImage.id,
        title: nextImage.title ?? nextImage.alt
      });
    }

    setSelectedImageId(imageId);
    onSelectedPhotoIdChange(imageId);
    modalOpenRef.current = true;
    cameraPointerRef.current = { x: 0, y: 0 };
    galleryProgress.draggingRef.current = false;
    galleryProgress.velocityRef.current = 0;
    galleryProgress.resumeAutoplayAtRef.current = Number.POSITIVE_INFINITY;
  }, [
    galleryProgress.draggingRef,
    galleryProgress.resumeAutoplayAtRef,
    galleryProgress.velocityRef,
    images,
    onSelectedPhotoIdChange
  ]);

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
        onSelectedPhotoIdChange(nextImageId);
      }
    },
    [images, onSelectedPhotoIdChange, selectedImageId]
  );

  const endDragAnalytics = useCallback(() => {
    if (dragAnalyticsActiveRef.current) {
      dragAnalyticsActiveRef.current = false;
      dispatchGalleryAnalyticsEvent(window, "drag_ended", {
        layout: layoutMode
      });
    }
  }, [layoutMode]);

  useEffect(() => {
    if (selectedImageId && !selectedImage) {
      setSelectedImageId(null);
      modalOpenRef.current = false;
      onSelectedPhotoIdChange(null);
    }
  }, [onSelectedPhotoIdChange, selectedImage, selectedImageId]);

  useEffect(() => {
    if (!selectedPhotoId) {
      if (selectedImageId) {
        setSelectedImageId(null);
        modalOpenRef.current = false;
      }
      return;
    }

    const linkedImage = getGalleryImageById(images, selectedPhotoId);

    if (!linkedImage) {
      onSelectedPhotoIdChange(null);
      return;
    }

    if (selectedPhotoId !== selectedImageId) {
      setSelectedImageId(selectedPhotoId);
      modalOpenRef.current = true;
      galleryProgress.draggingRef.current = false;
      galleryProgress.velocityRef.current = 0;
      galleryProgress.resumeAutoplayAtRef.current = Number.POSITIVE_INFINITY;
    }
  }, [
    galleryProgress.draggingRef,
    galleryProgress.resumeAutoplayAtRef,
    galleryProgress.velocityRef,
    images,
    onSelectedPhotoIdChange,
    selectedImageId,
    selectedPhotoId
  ]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateReducedMotion() {
      setReducedMotion(media.matches);

      if (
        shouldEmitReducedMotionAnalytics({
          alreadyEmitted: reducedMotionAnalyticsEmittedRef.current,
          reducedMotion: media.matches
        })
      ) {
        reducedMotionAnalyticsEmittedRef.current = true;
        dispatchGalleryAnalyticsEvent(window, "reduced_motion_enabled");
      }
    }

    updateReducedMotion();
    media.addEventListener("change", updateReducedMotion);

    return () => media.removeEventListener("change", updateReducedMotion);
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      dispatchGalleryAnalyticsEvent(window, "gallery_loaded", {
        imageCount: images.length
      });
    }
  }, [images.length]);

  useEffect(() => {
    function updateViewport() {
      setViewport(getViewportMode(window.innerWidth));
    }

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    let lastPreviewId: string | null | undefined;
    let lastSampleAt = 0;

    function updateFocusedPreview(now: number) {
      if (now - lastSampleAt >= 180) {
        lastSampleAt = now;
        const nextPreview = modalOpenRef.current
          ? null
          : getFocusedGalleryImagePreview(images, galleryProgress.progressRef.current);
        const nextPreviewId = nextPreview?.id ?? null;

        if (nextPreviewId !== lastPreviewId) {
          lastPreviewId = nextPreviewId;
          setFocusedPreview((currentPreview) =>
            currentPreview?.id === nextPreviewId ? currentPreview : nextPreview
          );
        }
      }

      animationFrame = window.requestAnimationFrame(updateFocusedPreview);
    }

    animationFrame = window.requestAnimationFrame(updateFocusedPreview);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [galleryProgress.progressRef, images]);

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
            event.target.closest(
              ".layout-switcher, .category-switcher, .sort-switcher, .gallery-detail-backdrop"
            ))
        ) {
          return;
        }

        const pointerStart = shellPointerStartRef.current;
        shellPointerStartRef.current = null;

        if (
          pointerStart &&
          !isGalleryClick({
            startX: pointerStart.x,
            startY: pointerStart.y,
            endX: event.clientX,
            endY: event.clientY
          })
        ) {
          return;
        }

        selectFocusedImage();
      }}
      {...galleryProgress.bind}
      onPointerCancel={(event) => {
        galleryProgress.bind.onPointerCancel(event);
        setCursorDragging(false);
        endDragAnalytics();
      }}
      onPointerDown={(event) => {
        shellPointerStartRef.current = { x: event.clientX, y: event.clientY };
        setCursorPoint({ x: event.clientX, y: event.clientY });
        galleryProgress.bind.onPointerDown(event);
        setCursorDragging(galleryProgress.draggingRef.current);
        if (galleryProgress.draggingRef.current && !dragAnalyticsActiveRef.current) {
          dragAnalyticsActiveRef.current = true;
          dispatchGalleryAnalyticsEvent(window, "drag_started", {
            layout: layoutMode
          });
        }
      }}
      onPointerLeave={(event) => {
        galleryProgress.bind.onPointerLeave(event);
        cameraPointerRef.current = { x: 0, y: 0 };
        setCursorDragging(false);
        setHoveredImageId(null);
        endDragAnalytics();
      }}
      onPointerMove={(event) => {
        galleryProgress.bind.onPointerMove(event);
        const bounds = event.currentTarget.getBoundingClientRect();
        cameraPointerRef.current = {
          x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
          y: ((event.clientY - bounds.top) / bounds.height - 0.5) * -2
        };
        setCursorPoint({ x: event.clientX, y: event.clientY });
        setCursorDragging(galleryProgress.draggingRef.current);
        if (
          !selectedImage &&
          event.target instanceof Element &&
          !event.target.closest(
            ".layout-switcher, .category-switcher, .sort-switcher, .gallery-detail-backdrop"
          )
        ) {
          setHoveredImageId(
            getFocusedGalleryImage(images, galleryProgress.progressRef.current)?.id ?? null
          );
        }
      }}
      onPointerUp={(event) => {
        galleryProgress.bind.onPointerUp(event);
        setCursorDragging(false);
        endDragAnalytics();
      }}
    >
      <div className="gallery-controls" onPointerDown={(event) => event.stopPropagation()}>
        <div className="category-switcher" aria-label="Gallery category">
          <button
            aria-pressed={categoryFilter === "all"}
            className="category-switcher-button"
            onClick={() => onCategoryFilterChange("all")}
            onPointerUp={(event) => event.stopPropagation()}
            type="button"
          >
            All
          </button>
          {categoryOptions.map((category) => (
            <button
              aria-pressed={categoryFilter === category}
              className="category-switcher-button"
              key={category}
              onClick={() => onCategoryFilterChange(category)}
              onPointerUp={(event) => event.stopPropagation()}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
        <div className="sort-switcher" aria-label="Gallery sort">
          {sortOptions.map((option) => (
            <button
              aria-pressed={sortMode === option.value}
              className="sort-switcher-button"
              key={option.value}
              onClick={() => {
                onSortModeChange(option.value);
                dispatchGalleryAnalyticsEvent(window, "sort_changed", {
                  sort: option.value
                });
              }}
              onPointerUp={(event) => event.stopPropagation()}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <div
          className="layout-switcher"
          aria-label="Gallery layout"
          style={{
            "--layout-pill-duration": `${layoutPill.durationMs}ms`,
            "--layout-pill-translate": `${layoutPill.translatePercent}%`,
            "--layout-pill-width": `${layoutPill.widthPercent}%`
          } as CSSProperties}
        >
          <span aria-hidden="true" className="layout-switcher-pill" />
          {layoutOptions.map((option) => (
            <button
              aria-pressed={layoutMode === option.value}
              className="layout-switcher-button"
              key={option.value}
              onClick={() => {
                setLayoutMode(option.value);
                dispatchGalleryAnalyticsEvent(window, "layout_changed", {
                  layout: option.value
                });
              }}
              onPointerUp={(event) => event.stopPropagation()}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
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
          cameraPointerRef={cameraPointerRef}
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
      {focusedPreview && !selectedImage ? (
        <aside className="gallery-focus-preview" aria-live="polite">
          <p className="gallery-focus-title">{focusedPreview.title}</p>
          <p className="gallery-focus-meta">{focusedPreview.metadata}</p>
        </aside>
      ) : null}
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
          {modalPreloadTargets.map((src) => (
            <link as="image" data-gallery-modal-preload="" href={src} key={src} rel="preload" />
          ))}
          <article
            aria-label={selectedImage.title ?? selectedImage.alt}
            className="gallery-detail-modal"
            data-transition={modalTransition.variant}
            data-transition-enabled={modalTransition.enabled ? "true" : "false"}
            style={modalTransition.style}
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

const sortOptions: Array<{ label: string; value: GallerySortMode }> = [
  { label: "Manual", value: "manual" },
  { label: "Newest", value: "newest" },
  { label: "Location", value: "location" },
  { label: "Category", value: "category" }
];
