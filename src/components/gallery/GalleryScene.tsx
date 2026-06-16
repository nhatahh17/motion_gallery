"use client";

import { useMemo } from "react";
import type { GalleryImage } from "@/lib/gallery/types";
import { GalleryImagePlane } from "./GalleryImagePlane";

type GallerySceneProps = {
  images: GalleryImage[];
};

export function GalleryScene({ images }: GallerySceneProps) {
  const placements = useMemo(() => {
    const spacing = 2.25;
    const offset = ((images.length - 1) * spacing) / 2;

    return images.map((image, index) => ({
      image,
      position: [
        index * spacing - offset,
        Math.sin(index * 0.9) * 0.32,
        index * -0.08
      ] as [number, number, number],
      rotation: [0, (index - (images.length - 1) / 2) * -0.08, 0] as [
        number,
        number,
        number
      ]
    }));
  }, [images]);

  return (
    <>
      <color attach="background" args={["#f8f8f4"]} />
      <ambientLight intensity={1} />
      <group>
        {placements.map((placement) => (
          <GalleryImagePlane
            image={placement.image}
            key={placement.image.id}
            position={placement.position}
            rotation={placement.rotation}
          />
        ))}
      </group>
    </>
  );
}
