"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { DoubleSide, LinearFilter, SRGBColorSpace, TextureLoader } from "three";
import type { Mesh, MeshBasicMaterial, Texture } from "three";
import type { MutableRefObject } from "react";
import type { GalleryImage } from "@/lib/gallery/types";
import type { GalleryViewportMode } from "@/lib/gallery/layout";
import { getCircle2DLayout } from "@/lib/gallery/layout";
import { getGalleryPlaneSize } from "@/lib/gallery/plane";

type GalleryImagePlaneProps = {
  image: GalleryImage;
  index: number;
  total: number;
  progressRef: MutableRefObject<number>;
  viewport: GalleryViewportMode;
};

export function GalleryImagePlane({
  image,
  index,
  progressRef,
  total,
  viewport
}: GalleryImagePlaneProps) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const size = useMemo(() => getGalleryPlaneSize(image), [image]);
  const invalidate = useThree((state) => state.invalidate);
  const meshRef = useRef<Mesh | null>(null);
  const materialRef = useRef<MeshBasicMaterial | null>(null);

  useFrame(() => {
    const placement = getCircle2DLayout({
      index,
      total,
      progress: progressRef.current,
      viewport
    });

    if (meshRef.current) {
      meshRef.current.position.set(placement.x, placement.y, placement.z);
      meshRef.current.rotation.set(0, 0, placement.rotationZ);
      meshRef.current.scale.set(placement.scale, placement.scale, 1);
    }

    if (materialRef.current) {
      materialRef.current.opacity = placement.opacity;
    }
  });

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
      ref={meshRef}
      userData={{ galleryImageId: image.id, textureSource: image.thumbSrc }}
    >
      <planeGeometry args={[size.width, size.height]} />
      <meshBasicMaterial
        color={loadFailed ? image.dominantColor ?? "#d8d5c8" : "#ffffff"}
        ref={materialRef}
        side={DoubleSide}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}
