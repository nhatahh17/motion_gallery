import { describe, expect, it } from "vitest";
import {
  calculateDragVelocity,
  decayInertiaVelocity,
  getInertiaVelocityAfterDrag,
  getDragProgressDelta,
  getWheelProgressDelta,
  shouldAutoplayAdvance
} from "./interaction";

describe("getDragProgressDelta", () => {
  it("moves progress opposite to pointer travel so dragging left advances the orbit", () => {
    expect(getDragProgressDelta({ deltaX: -40, viewport: "desktop" })).toBeCloseTo(0.152);
    expect(getDragProgressDelta({ deltaX: 40, viewport: "desktop" })).toBeCloseTo(-0.152);
  });

  it("uses stronger mobile sensitivity for shorter touch travel", () => {
    const desktop = Math.abs(getDragProgressDelta({ deltaX: 24, viewport: "desktop" }));
    const mobile = Math.abs(getDragProgressDelta({ deltaX: 24, viewport: "mobile" }));

    expect(mobile).toBeGreaterThan(desktop);
  });
});

describe("getWheelProgressDelta", () => {
  it("maps vertical wheel and trackpad movement into gallery progress", () => {
    expect(getWheelProgressDelta({ deltaX: 0, deltaY: 50, viewport: "desktop" })).toBeCloseTo(
      0.14
    );
    expect(getWheelProgressDelta({ deltaX: 0, deltaY: -50, viewport: "desktop" })).toBeCloseTo(
      -0.14
    );
  });

  it("prefers horizontal trackpad intent over vertical page scroll intent", () => {
    expect(getWheelProgressDelta({ deltaX: 30, deltaY: 4, viewport: "desktop" })).toBeCloseTo(
      0.084
    );
  });

  it("uses gentler mobile sensitivity and clamps extreme wheel bursts", () => {
    const desktop = Math.abs(getWheelProgressDelta({ deltaX: 0, deltaY: 40, viewport: "desktop" }));
    const mobile = Math.abs(getWheelProgressDelta({ deltaX: 0, deltaY: 40, viewport: "mobile" }));

    expect(mobile).toBeLessThan(desktop);
    expect(getWheelProgressDelta({ deltaX: 0, deltaY: 10_000, viewport: "desktop" })).toBe(0.42);
  });
});

describe("calculateDragVelocity", () => {
  it("clamps velocity so fast drags cannot create chaotic motion", () => {
    expect(calculateDragVelocity({ progressDelta: 5, elapsedMs: 16 })).toBe(0.08);
    expect(calculateDragVelocity({ progressDelta: -5, elapsedMs: 16 })).toBe(-0.08);
  });

  it("returns no velocity for invalid elapsed time", () => {
    expect(calculateDragVelocity({ progressDelta: 0.3, elapsedMs: 0 })).toBe(0);
  });
});

describe("decayInertiaVelocity", () => {
  it("decays active inertia naturally", () => {
    expect(decayInertiaVelocity(0.08)).toBeCloseTo(0.074);
  });

  it("stops tiny residual velocity", () => {
    expect(decayInertiaVelocity(0.0003)).toBe(0);
  });
});

describe("getInertiaVelocityAfterDrag", () => {
  it("removes release inertia when reduced motion is active", () => {
    expect(getInertiaVelocityAfterDrag({ reducedMotion: true, velocity: 0.06 })).toBe(0);
  });

  it("keeps clamped release inertia when motion is allowed", () => {
    expect(getInertiaVelocityAfterDrag({ reducedMotion: false, velocity: 0.06 })).toBe(0.06);
  });
});

describe("shouldAutoplayAdvance", () => {
  it("pauses autoplay while dragging or before the resume deadline", () => {
    expect(
      shouldAutoplayAdvance({ dragging: true, nowMs: 2_000, resumeAtMs: 0, reducedMotion: false })
    ).toBe(false);
    expect(
      shouldAutoplayAdvance({
        dragging: false,
        nowMs: 2_000,
        resumeAtMs: 2_500,
        reducedMotion: false
      })
    ).toBe(false);
  });

  it("allows autoplay after idle delay when motion is allowed", () => {
    expect(
      shouldAutoplayAdvance({
        dragging: false,
        nowMs: 3_000,
        resumeAtMs: 2_500,
        reducedMotion: false
      })
    ).toBe(true);
  });
});
