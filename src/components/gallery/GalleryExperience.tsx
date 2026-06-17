"use client";

import { useMemo, useState } from "react";
import { GalleryDebugList } from "@/components/GalleryDebugList";
import {
  filterGalleryImagesByCategory,
  getGalleryCategories,
  type GalleryCategoryFilter
} from "@/lib/gallery/category";
import { useGalleryData } from "@/lib/gallery/useGalleryData";
import { GalleryCanvas } from "./GalleryCanvas";
import { LoadingIntro } from "./LoadingIntro";

export function GalleryExperience() {
  const gallery = useGalleryData();
  const [categoryFilter, setCategoryFilter] = useState<GalleryCategoryFilter>("all");
  const categories = useMemo(
    () => (gallery.status === "ready" ? getGalleryCategories(gallery.images) : []),
    [gallery]
  );
  const visibleImages = useMemo(
    () =>
      gallery.status === "ready"
        ? filterGalleryImagesByCategory(gallery.images, categoryFilter)
        : [],
    [categoryFilter, gallery]
  );

  if (gallery.status === "loading") {
    return <LoadingIntro imageCount={gallery.images.length} />;
  }

  if (gallery.status === "error") {
    return <GalleryDebugList error={gallery.error} status="error" />;
  }

  return (
    <>
      <GalleryCanvas
        categoryFilter={categoryFilter}
        categoryOptions={categories}
        images={visibleImages}
        onCategoryFilterChange={setCategoryFilter}
      />
      <GalleryDebugList images={visibleImages} status="ready" />
    </>
  );
}
