"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GalleryDebugList } from "@/components/GalleryDebugList";
import {
  filterGalleryImagesByCategory,
  getGalleryCategories,
  type GalleryCategoryFilter
} from "@/lib/gallery/category";
import {
  buildGalleryPhotoHref,
  clearGalleryPhotoHref,
  getGalleryPhotoIdFromSearchParams
} from "@/lib/gallery/detail";
import { useGalleryData } from "@/lib/gallery/useGalleryData";
import { GalleryCanvas } from "./GalleryCanvas";
import { LoadingIntro } from "./LoadingIntro";

export function GalleryExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gallery = useGalleryData();
  const [categoryFilter, setCategoryFilter] = useState<GalleryCategoryFilter>("all");
  const selectedPhotoId = useMemo(
    () => getGalleryPhotoIdFromSearchParams(searchParams),
    [searchParams]
  );
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
  const updateSelectedPhotoId = useCallback((imageId: string | null) => {
    const href = imageId
      ? buildGalleryPhotoHref(searchParams, imageId)
      : clearGalleryPhotoHref(searchParams);

    router.replace(href, { scroll: false });
  }, [router, searchParams]);

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
        onSelectedPhotoIdChange={updateSelectedPhotoId}
        selectedPhotoId={selectedPhotoId}
      />
      <GalleryDebugList images={visibleImages} status="ready" />
    </>
  );
}
