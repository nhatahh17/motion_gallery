import { describe, expect, it } from "vitest";
import {
  getCircle2DLayout,
  getCircle2DAutoplayStep,
  getCircle3DLayout,
  getGalleryAutoplayStep,
  getGalleryLayout,
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

describe("getCircle3DLayout", () => {
  it("places images around the Y axis with clear depth", () => {
    const front = getCircle3DLayout({
      index: 0,
      total: 30,
      progress: 0,
      viewport: "desktop"
    });
    const side = getCircle3DLayout({
      index: 7,
      total: 30,
      progress: 0,
      viewport: "desktop"
    });

    expect(front.z).toBeGreaterThan(2.6);
    expect(Math.abs(front.x)).toBeLessThan(0.01);
    expect(Math.abs(side.x)).toBeGreaterThan(3.6);
    expect(side.z).toBeLessThan(front.z);
  });

  it("makes front images larger and clearer than back images", () => {
    const front = getCircle3DLayout({
      index: 0,
      total: 30,
      progress: 0,
      viewport: "desktop"
    });
    const back = getCircle3DLayout({
      index: 15,
      total: 30,
      progress: 0,
      viewport: "desktop"
    });

    expect(front.scale).toBeGreaterThan(back.scale);
    expect(front.opacity).toBeGreaterThan(back.opacity);
    expect(back.z).toBeLessThan(-2.6);
  });

  it("uses a calmer mobile cylinder than desktop", () => {
    const desktop = getCircle3DLayout({
      index: 7,
      total: 30,
      progress: 0,
      viewport: "desktop"
    });
    const mobile = getCircle3DLayout({
      index: 7,
      total: 30,
      progress: 0,
      viewport: "mobile"
    });

    expect(Math.abs(mobile.x)).toBeLessThan(Math.abs(desktop.x));
    expect(Math.abs(mobile.z)).toBeLessThan(Math.abs(desktop.z));
    expect(mobile.scale).toBeLessThan(desktop.scale);
  });
});

describe("getGalleryLayout", () => {
  it("dispatches by layout mode without changing progress semantics", () => {
    const circle2d = getGalleryLayout({
      index: 3,
      layoutMode: "circle2d",
      total: 30,
      progress: 1.25,
      viewport: "desktop"
    });
    const circle3d = getGalleryLayout({
      index: 3,
      layoutMode: "circle3d",
      total: 30,
      progress: 1.25,
      viewport: "desktop"
    });

    expect(circle2d.layoutMode).toBe("circle2d");
    expect(circle3d.layoutMode).toBe("circle3d");
    expect(circle3d.x).not.toBeCloseTo(circle2d.x, 3);
    expect(circle3d.rotationY).not.toBe(0);
  });
});

describe("getGalleryAutoplayStep", () => {
  it("uses slower autoplay for 3D Circle than the default 2D Circle", () => {
    const circle2d = getGalleryAutoplayStep({
      deltaSeconds: 1,
      layoutMode: "circle2d",
      reducedMotion: false
    });
    const circle3d = getGalleryAutoplayStep({
      deltaSeconds: 1,
      layoutMode: "circle3d",
      reducedMotion: false
    });

    expect(circle3d).toBeGreaterThan(0);
    expect(circle3d).toBeLessThan(circle2d);
  });
});
