import { describe, expect, it } from "vitest";
import { getMotionCursorState } from "./cursor";

describe("getMotionCursorState", () => {
  it("shows a view cursor only for desktop image hover", () => {
    expect(
      getMotionCursorState({
        dragging: false,
        hoveredImageId: "photo-001",
        modalOpen: false,
        reducedMotion: false,
        viewport: "desktop"
      })
    ).toEqual({ label: "View", visible: true, variant: "view" });
  });

  it("shows drag state while dragging on desktop", () => {
    expect(
      getMotionCursorState({
        dragging: true,
        hoveredImageId: "photo-001",
        modalOpen: false,
        reducedMotion: false,
        viewport: "desktop"
      })
    ).toEqual({ label: "Drag", visible: true, variant: "drag" });
  });

  it("hides polish outside desktop, during modal, or in reduced motion", () => {
    expect(
      getMotionCursorState({
        dragging: false,
        hoveredImageId: "photo-001",
        modalOpen: false,
        reducedMotion: false,
        viewport: "mobile"
      }).visible
    ).toBe(false);
    expect(
      getMotionCursorState({
        dragging: false,
        hoveredImageId: "photo-001",
        modalOpen: true,
        reducedMotion: false,
        viewport: "desktop"
      }).visible
    ).toBe(false);
    expect(
      getMotionCursorState({
        dragging: false,
        hoveredImageId: "photo-001",
        modalOpen: false,
        reducedMotion: true,
        viewport: "desktop"
      }).visible
    ).toBe(false);
  });
});
