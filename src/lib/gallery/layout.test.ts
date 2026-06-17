import { describe, expect, it } from "vitest";
import {
  getCircle2DLayout,
  getCircle2DAutoplayStep,
  getCircle3DLayout,
  getDragExpansionFactor,
  getGalleryAutoplayStep,
  getGalleryLayout,
  getHorizon3DLayout,
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

describe("getDragExpansionFactor", () => {
  it("keeps layouts at their idle size when the gallery is not being dragged", () => {
    expect(
      getDragExpansionFactor({ dragging: false, reducedMotion: false, viewport: "desktop" })
    ).toBe(1);
  });

  it("returns a subtle desktop expansion while dragging", () => {
    expect(
      getDragExpansionFactor({ dragging: true, reducedMotion: false, viewport: "desktop" })
    ).toBeCloseTo(1.08, 3);
  });

  it("uses a calmer mobile expansion and disables the effect for reduced motion", () => {
    expect(
      getDragExpansionFactor({ dragging: true, reducedMotion: false, viewport: "mobile" })
    ).toBeCloseTo(1.035, 3);
    expect(
      getDragExpansionFactor({ dragging: true, reducedMotion: true, viewport: "desktop" })
    ).toBe(1);
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
      dragExpansion: 1,
      layoutMode: "circle2d",
      total: 30,
      progress: 1.25,
      viewport: "desktop"
    });
    const circle3d = getGalleryLayout({
      index: 3,
      dragExpansion: 1,
      layoutMode: "circle3d",
      total: 30,
      progress: 1.25,
      viewport: "desktop"
    });
    const horizon3d = getGalleryLayout({
      index: 3,
      dragExpansion: 1,
      layoutMode: "horizon3d",
      total: 30,
      progress: 1.25,
      viewport: "desktop"
    });

    expect(circle2d.layoutMode).toBe("circle2d");
    expect(circle3d.layoutMode).toBe("circle3d");
    expect(horizon3d.layoutMode).toBe("horizon3d");
    expect(circle3d.x).not.toBeCloseTo(circle2d.x, 3);
    expect(circle3d.rotationY).not.toBe(0);
    expect(horizon3d.x).not.toBeCloseTo(circle2d.x, 3);
  });

  it("expands every layout without changing progress or image order semantics", () => {
    const circle2dIdle = getGalleryLayout({
      index: 4,
      dragExpansion: 1,
      layoutMode: "circle2d",
      total: 30,
      progress: 0.6,
      viewport: "desktop"
    });
    const circle2dExpanded = getGalleryLayout({
      index: 4,
      dragExpansion: 1.08,
      layoutMode: "circle2d",
      total: 30,
      progress: 0.6,
      viewport: "desktop"
    });
    const circle3dIdle = getGalleryLayout({
      index: 7,
      dragExpansion: 1,
      layoutMode: "circle3d",
      total: 30,
      progress: 0.6,
      viewport: "desktop"
    });
    const circle3dExpanded = getGalleryLayout({
      index: 7,
      dragExpansion: 1.08,
      layoutMode: "circle3d",
      total: 30,
      progress: 0.6,
      viewport: "desktop"
    });
    const horizonIdle = getGalleryLayout({
      index: 4,
      dragExpansion: 1,
      layoutMode: "horizon3d",
      total: 30,
      progress: 0.6,
      viewport: "desktop"
    });
    const horizonExpanded = getGalleryLayout({
      index: 4,
      dragExpansion: 1.08,
      layoutMode: "horizon3d",
      total: 30,
      progress: 0.6,
      viewport: "desktop"
    });

    expect(Math.hypot(circle2dExpanded.x, circle2dExpanded.y)).toBeGreaterThan(
      Math.hypot(circle2dIdle.x, circle2dIdle.y)
    );
    expect(Math.abs(circle3dExpanded.x)).toBeGreaterThan(Math.abs(circle3dIdle.x));
    expect(Math.abs(horizonExpanded.x)).toBeGreaterThan(Math.abs(horizonIdle.x));
    expect(horizonExpanded.layoutMode).toBe(horizonIdle.layoutMode);
  });
});

describe("getHorizon3DLayout", () => {
  it("places the active image near center with side images spread horizontally", () => {
    const center = getHorizon3DLayout({
      index: 0,
      total: 30,
      progress: 0,
      viewport: "desktop"
    });
    const side = getHorizon3DLayout({
      index: 4,
      total: 30,
      progress: 0,
      viewport: "desktop"
    });

    expect(Math.abs(center.x)).toBeLessThan(0.01);
    expect(center.z).toBeGreaterThan(side.z);
    expect(Math.abs(side.x)).toBeGreaterThan(3.2);
    expect(side.opacity).toBeLessThan(center.opacity);
  });

  it("wraps progress through image positions without changing image order", () => {
    const initial = getHorizon3DLayout({
      index: 2,
      total: 30,
      progress: 0,
      viewport: "desktop"
    });
    const advanced = getHorizon3DLayout({
      index: 2,
      total: 30,
      progress: 1,
      viewport: "desktop"
    });

    expect(advanced.x).not.toBeCloseTo(initial.x, 5);
    expect(advanced.layoutMode).toBe(initial.layoutMode);
  });

  it("uses a compact mobile runway", () => {
    const desktop = getHorizon3DLayout({
      index: 4,
      total: 30,
      progress: 0,
      viewport: "desktop"
    });
    const mobile = getHorizon3DLayout({
      index: 4,
      total: 30,
      progress: 0,
      viewport: "mobile"
    });

    expect(Math.abs(mobile.x)).toBeLessThan(Math.abs(desktop.x));
    expect(Math.abs(mobile.z)).toBeLessThan(Math.abs(desktop.z));
    expect(mobile.scale).toBeLessThan(desktop.scale);
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

  it("uses the calmest autoplay for 3D Horizon", () => {
    const circle3d = getGalleryAutoplayStep({
      deltaSeconds: 1,
      layoutMode: "circle3d",
      reducedMotion: false
    });
    const horizon3d = getGalleryAutoplayStep({
      deltaSeconds: 1,
      layoutMode: "horizon3d",
      reducedMotion: false
    });

    expect(horizon3d).toBeGreaterThan(0);
    expect(horizon3d).toBeLessThan(circle3d);
  });
});
