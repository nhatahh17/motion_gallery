import type { GalleryLayoutMode } from "./layout";

export const galleryAnalyticsEventName = "motion-gallery:analytics";

export type GalleryAnalyticsEventName =
  | "gallery_loaded"
  | "layout_changed"
  | "image_opened"
  | "image_closed"
  | "drag_started"
  | "drag_ended"
  | "reduced_motion_enabled";

type GalleryAnalyticsInput = Record<string, unknown> & {
  category?: unknown;
  imageCount?: unknown;
  imageId?: unknown;
  layout?: unknown;
  title?: unknown;
};

export type GalleryAnalyticsDetail = {
  event: GalleryAnalyticsEventName;
  category?: string;
  imageCount?: number;
  imageId?: string;
  layout?: GalleryLayoutMode;
  title?: string;
};

export function buildGalleryAnalyticsEvent(
  event: GalleryAnalyticsEventName,
  input: GalleryAnalyticsInput = {}
): { detail: GalleryAnalyticsDetail; name: typeof galleryAnalyticsEventName } {
  const detail: GalleryAnalyticsDetail = { event };

  if (typeof input.category === "string" && input.category.trim()) {
    detail.category = input.category;
  }

  if (typeof input.imageCount === "number" && Number.isFinite(input.imageCount)) {
    detail.imageCount = Math.max(0, Math.floor(input.imageCount));
  }

  if (typeof input.imageId === "string" && input.imageId.trim()) {
    detail.imageId = input.imageId;
  }

  if (isGalleryLayoutMode(input.layout)) {
    detail.layout = input.layout;
  }

  if (typeof input.title === "string" && input.title.trim()) {
    detail.title = input.title;
  }

  return {
    detail,
    name: galleryAnalyticsEventName
  };
}

export function shouldEmitReducedMotionAnalytics({
  alreadyEmitted,
  reducedMotion
}: {
  alreadyEmitted: boolean;
  reducedMotion: boolean;
}) {
  return reducedMotion && !alreadyEmitted;
}

export function dispatchGalleryAnalyticsEvent(
  target: Window,
  event: GalleryAnalyticsEventName,
  input: GalleryAnalyticsInput = {}
) {
  const analyticsEvent = buildGalleryAnalyticsEvent(event, input);

  target.dispatchEvent(new CustomEvent(analyticsEvent.name, { detail: analyticsEvent.detail }));
}

function isGalleryLayoutMode(value: unknown): value is GalleryLayoutMode {
  return value === "circle2d" || value === "circle3d" || value === "horizon3d";
}
