"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { DoubleSide, LinearFilter, Shape, SRGBColorSpace, TextureLoader } from "three";
import type { Mesh, MeshBasicMaterial, Texture } from "three";
import type { MutableRefObject } from "react";
import type { GalleryImage } from "@/lib/gallery/types";
import type { GalleryLayoutMode, GalleryViewportMode } from "@/lib/gallery/layout";
import { isGalleryClick } from "@/lib/gallery/detail";
import { getGalleryLayout } from "@/lib/gallery/layout";
import { getGalleryPlaneSize } from "@/lib/gallery/plane";
import { getRoundedPlaneShapePoints } from "@/lib/gallery/rounded-plane";

type GalleryImagePlaneProps = {
  dragExpansion: number;
  image: GalleryImage;
  index: number;
  layoutMode: GalleryLayoutMode;
  onHover: (imageId: string | null) => void;
  onSelect: (imageId: string) => void;
  total: number;
  progressRef: MutableRefObject<number>;
  viewport: GalleryViewportMode;
};

export function GalleryImagePlane({
  dragExpansion,
  image,
  index,
  layoutMode,
  onHover,
  onSelect,
  progressRef,
  total,
  viewport
}: GalleryImagePlaneProps) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const size = useMemo(() => getGalleryPlaneSize(image), [image]);
  const roundedShape = useMemo(() => {
    const points = getRoundedPlaneShapePoints({
      width: size.width,
      height: size.height,
      radius: 0.12
    });
    const shape = new Shape();
    const [firstPoint, ...remainingPoints] = points;

    shape.moveTo(firstPoint.x, firstPoint.y);
    remainingPoints.forEach((point) => shape.lineTo(point.x, point.y));
    shape.closePath();

    return shape;
  }, [size.height, size.width]);
  const invalidate = useThree((state) => state.invalidate);
  const meshRef = useRef<Mesh | null>(null);
  const materialRef = useRef<MeshBasicMaterial | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  useFrame(() => {
    const placement = getGalleryLayout({
      index,
      dragExpansion,
      layoutMode,
      total,
      progress: progressRef.current,
      viewport
    });

    if (meshRef.current) {
      meshRef.current.position.set(placement.x, placement.y, placement.z);
      meshRef.current.rotation.set(0, placement.rotationY, placement.rotationZ);
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
      onPointerEnter={() => onHover(image.id)}
      onPointerLeave={() => onHover(null)}
      onPointerDown={(event) => {
        pointerStartRef.current = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY };
      }}
      onPointerUp={(event) => {
        const pointerStart = pointerStartRef.current;
        pointerStartRef.current = null;

        if (
          pointerStart &&
          isGalleryClick({
            startX: pointerStart.x,
            startY: pointerStart.y,
            endX: event.nativeEvent.clientX,
            endY: event.nativeEvent.clientY
          })
        ) {
          event.stopPropagation();
          onSelect(image.id);
        }
      }}
      ref={meshRef}
      userData={{
        galleryImageId: image.id,
        roundedTreatment: "subtle",
        textureSource: image.thumbSrc
      }}
    >
      <shapeGeometry args={[roundedShape, 8]} />
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
