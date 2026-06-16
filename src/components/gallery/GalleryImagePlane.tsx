"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { DoubleSide, LinearFilter, SRGBColorSpace, TextureLoader } from "three";
import type { MeshBasicMaterial, Texture } from "three";
import type { GalleryImage } from "@/lib/gallery/types";
import { getGalleryPlaneSize } from "@/lib/gallery/plane";

type GalleryImagePlaneProps = {
  image: GalleryImage;
  position: [number, number, number];
  rotation?: [number, number, number];
};

export function GalleryImagePlane({
  image,
  position,
  rotation = [0, 0, 0]
}: GalleryImagePlaneProps) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const size = useMemo(() => getGalleryPlaneSize(image), [image]);
  const invalidate = useThree((state) => state.invalidate);
  const materialRef = useRef<MeshBasicMaterial | null>(null);

  useEffect(() => {
    let active = true;
    const loader = new TextureLoader();

    loader.load(
      image.thumbSrc,
      (loadedTexture) => {
        if (!active) {
          loadedTexture.dispose();
          return;
        }

        loadedTexture.colorSpace = SRGBColorSpace;
        loadedTexture.minFilter = LinearFilter;
        loadedTexture.magFilter = LinearFilter;
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
        setLoadFailed(false);
        invalidate();
      },
      undefined,
      () => {
        if (active) {
          setLoadFailed(true);
          invalidate();
        }
      }
    );

    return () => {
      active = false;
      setTexture((currentTexture) => {
        currentTexture?.dispose();
        return null;
      });
    };
  }, [image.thumbSrc]);

  useEffect(() => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.map = texture;
    materialRef.current.needsUpdate = true;
    invalidate();
  }, [invalidate, materialRef, texture]);

  return (
    <mesh
      position={position}
      rotation={rotation}
      userData={{ galleryImageId: image.id, textureSource: image.thumbSrc }}
    >
      <planeGeometry args={[size.width, size.height]} />
      <meshBasicMaterial
        color={loadFailed ? image.dominantColor ?? "#d8d5c8" : "#ffffff"}
        ref={materialRef}
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
