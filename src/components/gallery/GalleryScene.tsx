"use client";

import { useEffect, useState, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { GalleryImage } from "@/lib/gallery/types";
import { decayInertiaVelocity, shouldAutoplayAdvance } from "@/lib/gallery/interaction";
import {
  getGalleryAutoplayStep,
  getViewportMode,
  type GalleryLayoutMode
} from "@/lib/gallery/layout";
import { GalleryImagePlane } from "./GalleryImagePlane";

type GallerySceneProps = {
  draggingRef: MutableRefObject<boolean>;
  images: GalleryImage[];
  layoutMode: GalleryLayoutMode;
  progressRef: MutableRefObject<number>;
  resumeAutoplayAtRef: MutableRefObject<number>;
  velocityRef: MutableRefObject<number>;
};

export function GalleryScene({
  draggingRef,
  images,
  layoutMode,
  progressRef,
  resumeAutoplayAtRef,
  velocityRef
}: GallerySceneProps) {
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
    if (!draggingRef.current && velocityRef.current !== 0) {
      progressRef.current += velocityRef.current;
      velocityRef.current = decayInertiaVelocity(velocityRef.current);
    }

    if (
      shouldAutoplayAdvance({
        dragging: draggingRef.current,
        nowMs: window.performance.now(),
        reducedMotion,
        resumeAtMs: resumeAutoplayAtRef.current
      })
    ) {
      progressRef.current += getGalleryAutoplayStep({
        deltaSeconds: delta,
        layoutMode,
        reducedMotion
      });
    }
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
            layoutMode={layoutMode}
            progressRef={progressRef}
            total={images.length}
            viewport={viewport}
          />
        ))}
      </group>
    </>
  );
}
