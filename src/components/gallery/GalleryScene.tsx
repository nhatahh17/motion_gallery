"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { GalleryImage } from "@/lib/gallery/types";
import { getCircle2DAutoplayStep, getViewportMode } from "@/lib/gallery/layout";
import { GalleryImagePlane } from "./GalleryImagePlane";

type GallerySceneProps = {
  images: GalleryImage[];
};

export function GalleryScene({ images }: GallerySceneProps) {
  const progressRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const viewport = useThree((state) => getViewportMode(state.size.width));

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateReducedMotion() {
      setReducedMotion(media.matches);
    }

    updateReducedMotion();
    media.addEventListener("change", updateReducedMotion);

    return () => media.removeEventListener("change", updateReducedMotion);
  }, []);

  useFrame((_, delta) => {
    progressRef.current += getCircle2DAutoplayStep({
      deltaSeconds: delta,
      reducedMotion
    });
  });

  return (
    <>
      <color attach="background" args={["#f8f8f4"]} />
      <ambientLight intensity={1} />
      <group>
        {images.map((image, index) => (
          <GalleryImagePlane
            image={image}
            index={index}
            key={image.id}
            progressRef={progressRef}
            total={images.length}
            viewport={viewport}
          />
        ))}
      </group>
    </>
  );
}
