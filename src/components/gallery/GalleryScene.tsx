"use client";

import type { MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { GalleryImage } from "@/lib/gallery/types";
import { getGalleryCameraMotion } from "@/lib/gallery/camera";
import { decayInertiaVelocity, shouldAutoplayAdvance } from "@/lib/gallery/interaction";
import {
  getGalleryAutoplayStep,
  getDragExpansionFactor,
  getViewportMode,
  type GalleryLayoutMode
} from "@/lib/gallery/layout";
import { GalleryImagePlane } from "./GalleryImagePlane";

type GallerySceneProps = {
  cameraPointerRef: MutableRefObject<{ x: number; y: number }>;
  draggingRef: MutableRefObject<boolean>;
  images: GalleryImage[];
  layoutMode: GalleryLayoutMode;
  modalOpenRef: MutableRefObject<boolean>;
  onHoverImage: (imageId: string | null) => void;
  onSelectImage: (imageId: string) => void;
  progressRef: MutableRefObject<number>;
  reducedMotion: boolean;
  resumeAutoplayAtRef: MutableRefObject<number>;
  velocityRef: MutableRefObject<number>;
};

export function GalleryScene({
  cameraPointerRef,
  draggingRef,
  images,
  layoutMode,
  modalOpenRef,
  onHoverImage,
  onSelectImage,
  progressRef,
  reducedMotion,
  resumeAutoplayAtRef,
  velocityRef
}: GallerySceneProps) {
  const viewport = useThree((state) => getViewportMode(state.size.width));
  const camera = useThree((state) => state.camera);
  const dragExpansion = getDragExpansionFactor({
    dragging: draggingRef.current && !modalOpenRef.current,
    reducedMotion,
    viewport
  });

  useFrame((state, delta) => {
    const targetCamera = getGalleryCameraMotion({
      elapsedSeconds: state.clock.elapsedTime,
      modalOpen: modalOpenRef.current,
      pointerX: cameraPointerRef.current.x,
      pointerY: cameraPointerRef.current.y,
      reducedMotion,
      viewport
    });
    camera.position.x += (targetCamera.x - camera.position.x) * 0.055;
    camera.position.y += (targetCamera.y - camera.position.y) * 0.055;
    camera.position.z += (targetCamera.z - camera.position.z) * 0.055;
    camera.lookAt(0, 0, 0);

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
            dragExpansion={dragExpansion}
            key={image.id}
            layoutMode={layoutMode}
            onHover={onHoverImage}
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
