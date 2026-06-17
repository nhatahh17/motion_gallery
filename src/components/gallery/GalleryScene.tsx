"use client";

import type { MutableRefObject } from "react";
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
  modalOpenRef: MutableRefObject<boolean>;
  onSelectImage: (imageId: string) => void;
  progressRef: MutableRefObject<number>;
  reducedMotion: boolean;
  resumeAutoplayAtRef: MutableRefObject<number>;
  velocityRef: MutableRefObject<number>;
};

export function GalleryScene({
  draggingRef,
  images,
  layoutMode,
  modalOpenRef,
  onSelectImage,
  progressRef,
  reducedMotion,
  resumeAutoplayAtRef,
  velocityRef
}: GallerySceneProps) {
  const viewport = useThree((state) => getViewportMode(state.size.width));

  useFrame((_, delta) => {
    if (modalOpenRef.current) {
      return;
    }

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
            onSelect={onSelectImage}
            progressRef={progressRef}
            total={images.length}
            viewport={viewport}
          />
        ))}
      </group>
    </>
  );
}
