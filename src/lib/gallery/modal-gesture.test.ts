import { describe, expect, it } from "vitest";
import { shouldCloseModalFromSwipe } from "./modal-gesture";

describe("shouldCloseModalFromSwipe", () => {
  it("closes from a deliberate downward mobile swipe", () => {
    expect(
      shouldCloseModalFromSwipe({
        endX: 132,
        endY: 216,
        pointerType: "touch",
        reducedMotion: false,
        startX: 128,
        startY: 112,
        viewport: "mobile"
      })
    ).toBe(true);
  });

  it("keeps the modal open for small movement and horizontal swipes", () => {
    expect(
      shouldCloseModalFromSwipe({
        endX: 128,
        endY: 142,
        pointerType: "touch",
        reducedMotion: false,
        startX: 128,
        startY: 112,
        viewport: "mobile"
      })
    ).toBe(false);

    expect(
      shouldCloseModalFromSwipe({
        endX: 224,
        endY: 134,
        pointerType: "touch",
        reducedMotion: false,
        startX: 128,
        startY: 112,
        viewport: "mobile"
      })
    ).toBe(false);
  });

  it("does not add swipe close on desktop or in reduced motion", () => {
    expect(
      shouldCloseModalFromSwipe({
        endX: 132,
        endY: 216,
        pointerType: "touch",
        reducedMotion: false,
        startX: 128,
        startY: 112,
        viewport: "desktop"
      })
    ).toBe(false);

    expect(
      shouldCloseModalFromSwipe({
        endX: 132,
        endY: 216,
        pointerType: "touch",
        reducedMotion: true,
        startX: 128,
        startY: 112,
        viewport: "mobile"
      })
    ).toBe(false);
  });
});
