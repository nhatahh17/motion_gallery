"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { GalleryImage } from "@/lib/gallery/types";
import { getViewportMode, type GalleryViewportMode } from "@/lib/gallery/layout";
import { GalleryScene } from "./GalleryScene";
import { useGalleryProgress } from "./useGalleryProgress";
import { useViewportDpr } from "./useViewportDpr";

type GalleryCanvasProps = {
  images: GalleryImage[];
};

export function GalleryCanvas({ images }: GalleryCanvasProps) {
  const dpr = useViewportDpr();
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
          progressRef={galleryProgress.progressRef}
          resumeAutoplayAtRef={galleryProgress.resumeAutoplayAtRef}
          velocityRef={galleryProgress.velocityRef}
        />
      </Canvas>
    </section>
  );
}
