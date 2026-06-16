import { describe, expect, it } from "vitest";
import {
  getCircle2DLayout,
  getCircle2DAutoplayStep,
  type GalleryViewportMode
} from "./layout";

describe("getCircle2DLayout", () => {
  it("distributes 30 images across three visual rings with a breathable center", () => {
    const placements = Array.from({ length: 30 }, (_, index) =>
      getCircle2DLayout({ index, total: 30, progress: 0, viewport: "desktop" })
    );

    expect(new Set(placements.map((placement) => placement.ringIndex))).toEqual(
      new Set([0, 1, 2])
    );
    expect(placements.every((placement) => Math.hypot(placement.x, placement.y) > 1.45)).toBe(
      true
    );
  });

  it("moves ring positions when progress changes without resetting image order", () => {
    const initial = getCircle2DLayout({
      index: 4,
      total: 30,
      progress: 0,
      viewport: "desktop"
    });
    const advanced = getCircle2DLayout({
      index: 4,
      total: 30,
      progress: 0.8,
      viewport: "desktop"
    });

    expect(advanced.ringIndex).toBe(initial.ringIndex);
    expect(advanced.x).not.toBeCloseTo(initial.x, 5);
    expect(advanced.y).not.toBeCloseTo(initial.y, 5);
  });

  it("makes primary ring images clearer than background ring images", () => {
    const primary = getCircle2DLayout({
      index: 0,
      total: 30,
      progress: 0,
      viewport: "desktop"
    });
    const background = getCircle2DLayout({
      index: 2,
      total: 30,
      progress: 0,
      viewport: "desktop"
    });

    expect(primary.opacity).toBeGreaterThan(background.opacity);
    expect(primary.scale).toBeGreaterThan(background.scale);
    expect(primary.z).toBeGreaterThan(background.z);
  });

  it("uses a more compact mobile orbit than desktop", () => {
    const viewports: GalleryViewportMode[] = ["desktop", "mobile"];
    const [desktop, mobile] = viewports.map((viewport) =>
      getCircle2DLayout({ index: 0, total: 30, progress: 0, viewport })
    );

    expect(Math.abs(mobile.x)).toBeLessThan(Math.abs(desktop.x));
    expect(mobile.scale).toBeLessThan(desktop.scale);
  });
});

describe("getCircle2DAutoplayStep", () => {
  it("returns no autoplay movement when reduced motion is active", () => {
    expect(getCircle2DAutoplayStep({ deltaSeconds: 1, reducedMotion: true })).toBe(0);
  });

  it("returns gentle forward movement for the default layout", () => {
    expect(getCircle2DAutoplayStep({ deltaSeconds: 1, reducedMotion: false })).toBeCloseTo(
      0.096,
      3
    );
  });
});
