"use client";

import { GalleryDebugList } from "@/components/GalleryDebugList";
import { useGalleryData } from "@/lib/gallery/useGalleryData";
import { GalleryCanvas } from "./GalleryCanvas";

export function GalleryExperience() {
  const gallery = useGalleryData();

  if (gallery.status === "loading") {
    return (
      <section className="gallery-state" aria-live="polite">
        <p>Loading gallery data</p>
      </section>
    );
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
