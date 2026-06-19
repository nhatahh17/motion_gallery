import { describe, expect, it } from "vitest";
import {
  buildGalleryAnalyticsEvent,
  shouldEmitReducedMotionAnalytics,
  type GalleryAnalyticsEventName
} from "./analytics";

describe("buildGalleryAnalyticsEvent", () => {
  it("uses one stable CustomEvent name and keeps known event details", () => {
    const event = buildGalleryAnalyticsEvent("layout_changed", {
      layout: "horizon3d",
      ignored: "value"
    });

    expect(event).toEqual({
      detail: {
        event: "layout_changed",
        layout: "horizon3d"
      },
      name: "motion-gallery:analytics"
    });
  });

  it("sanitizes image and category details without persistent identifiers", () => {
    const event = buildGalleryAnalyticsEvent("image_opened", {
      category: "Street",
      imageId: "photo-002",
      src: "/images/gallery/photo-002.png",
      title: "Concrete Quiet"
    });

    expect(event.detail).toEqual({
      category: "Street",
      event: "image_opened",
      imageId: "photo-002",
      title: "Concrete Quiet"
    });
  });

  it("keeps sort change details local and explicit", () => {
    expect(buildGalleryAnalyticsEvent("sort_changed", { sort: "newest" }).detail).toEqual({
      event: "sort_changed",
      sort: "newest"
    });
  });

  it("supports the recommended MVP event vocabulary", () => {
    const events: GalleryAnalyticsEventName[] = [
      "gallery_loaded",
      "layout_changed",
      "image_opened",
      "image_closed",
      "drag_started",
      "drag_ended",
      "sort_changed",
      "reduced_motion_enabled"
    ];

    expect(events.map((event) => buildGalleryAnalyticsEvent(event).detail.event)).toEqual(events);
  });
});

describe("shouldEmitReducedMotionAnalytics", () => {
  it("emits reduced-motion analytics only once when reduce is active", () => {
    expect(shouldEmitReducedMotionAnalytics({ alreadyEmitted: false, reducedMotion: true })).toBe(
      true
    );
    expect(shouldEmitReducedMotionAnalytics({ alreadyEmitted: true, reducedMotion: true })).toBe(
      false
    );
    expect(shouldEmitReducedMotionAnalytics({ alreadyEmitted: false, reducedMotion: false })).toBe(
      false
    );
  });
});
