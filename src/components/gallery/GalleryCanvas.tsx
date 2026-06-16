"use client";

import { Canvas } from "@react-three/fiber";
import type { GalleryImage } from "@/lib/gallery/types";
import { GalleryScene } from "./GalleryScene";
import { useViewportDpr } from "./useViewportDpr";

type GalleryCanvasProps = {
  images: GalleryImage[];
};

export function GalleryCanvas({ images }: GalleryCanvasProps) {
  const dpr = useViewportDpr();

  return (
    <section className="gallery-canvas-shell" aria-label="WebGL image gallery">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 42, near: 0.1, far: 100 }}
        dpr={[1, dpr]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
      >
        <GalleryScene images={images} />
      </Canvas>
    </section>
  );
}
