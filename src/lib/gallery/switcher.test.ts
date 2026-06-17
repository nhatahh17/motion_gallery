import { describe, expect, it } from "vitest";
import { getLayoutSwitcherPillState } from "./switcher";

describe("getLayoutSwitcherPillState", () => {
  it("maps the active layout to a stable pill index and translate value", () => {
    expect(
      getLayoutSwitcherPillState({
        activeLayout: "circle2d",
        layoutOrder: ["circle2d", "circle3d", "horizon3d"],
        reducedMotion: false
      })
    ).toEqual({
      durationMs: 260,
      index: 0,
      translatePercent: 0,
      widthPercent: 100 / 3
    });

    expect(
      getLayoutSwitcherPillState({
        activeLayout: "horizon3d",
        layoutOrder: ["circle2d", "circle3d", "horizon3d"],
        reducedMotion: false
      }).translatePercent
    ).toBeCloseTo(200);
  });

  it("removes animated travel when reduced motion is active", () => {
    expect(
      getLayoutSwitcherPillState({
        activeLayout: "circle3d",
        layoutOrder: ["circle2d", "circle3d", "horizon3d"],
        reducedMotion: true
      })
    ).toMatchObject({
      durationMs: 0,
      index: 1,
      translatePercent: 100
    });
  });
});
