import { describe, expect, it } from "vitest";
import { getGalleryCameraMotion } from "./camera";

describe("getGalleryCameraMotion", () => {
  it("adds subtle desktop breathing and pointer parallax", () => {
    const camera = getGalleryCameraMotion({
      elapsedSeconds: 1.4,
      modalOpen: false,
      pointerX: 0.8,
      pointerY: -0.5,
      reducedMotion: false,
      viewport: "desktop"
    });

    expect(camera.x).toBeGreaterThan(0.05);
    expect(camera.y).toBeLessThan(0);
    expect(camera.z).not.toBeCloseTo(7.2, 4);
  });

  it("uses calmer movement on mobile than desktop", () => {
    const input = {
      elapsedSeconds: 1.4,
      modalOpen: false,
      pointerX: 1,
      pointerY: 1,
      reducedMotion: false
    };
    const desktop = getGalleryCameraMotion({ ...input, viewport: "desktop" });
    const mobile = getGalleryCameraMotion({ ...input, viewport: "mobile" });

    expect(Math.abs(mobile.x)).toBeLessThan(Math.abs(desktop.x));
    expect(Math.abs(mobile.y)).toBeLessThan(Math.abs(desktop.y));
    expect(Math.abs(mobile.z - 7.2)).toBeLessThan(Math.abs(desktop.z - 7.2));
  });

  it("returns the base camera for reduced motion or modal open state", () => {
    expect(
      getGalleryCameraMotion({
        elapsedSeconds: 2,
        modalOpen: false,
        pointerX: 1,
        pointerY: 1,
        reducedMotion: true,
        viewport: "desktop"
      })
    ).toEqual({ x: 0, y: 0, z: 7.2 });
    expect(
      getGalleryCameraMotion({
        elapsedSeconds: 2,
        modalOpen: true,
        pointerX: 1,
        pointerY: 1,
        reducedMotion: false,
        viewport: "desktop"
      })
    ).toEqual({ x: 0, y: 0, z: 7.2 });
  });
});
