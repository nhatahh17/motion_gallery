"use client";

import { GalleryDebugList } from "@/components/GalleryDebugList";
import { useGalleryData } from "@/lib/gallery/useGalleryData";
import { GalleryCanvas } from "./GalleryCanvas";
import { LoadingIntro } from "./LoadingIntro";

export function GalleryExperience() {
  const gallery = useGalleryData();

  if (gallery.status === "loading") {
    return <LoadingIntro imageCount={gallery.images.length} />;
  }

  if (gallery.status === "error") {
    return <GalleryDebugList />;
  }

  return (
    <>
      <GalleryCanvas images={gallery.images} />
      <GalleryDebugList />
    </>
  );
}
