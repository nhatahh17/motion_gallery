"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { GalleryImage } from "@/lib/gallery/types";
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
  const [viewport, setViewport] = useState<GalleryViewportMode>("desktop");
  const galleryProgress = useGalleryProgress(viewport);

  useEffect(() => {
    function updateViewport() {
      setViewport(getViewportMode(window.innerWidth));
    }

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return (
    <section
      className="gallery-canvas-shell"
      aria-label="WebGL image gallery"
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
          progressRef={galleryProgress.progressRef}
          resumeAutoplayAtRef={galleryProgress.resumeAutoplayAtRef}
          velocityRef={galleryProgress.velocityRef}
        />
      </Canvas>
    </section>
  );
}

const layoutOptions: Array<{ label: string; value: GalleryLayoutMode }> = [
  { label: "2D Circle", value: "circle2d" },
  { label: "3D Circle", value: "circle3d" }
];
