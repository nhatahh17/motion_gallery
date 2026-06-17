import { describe, expect, it } from "vitest";
import { getLoadingIntroState } from "./intro";

describe("getLoadingIntroState", () => {
  it("shows the intro while gallery data is loading", () => {
    expect(
      getLoadingIntroState({
        imageCount: 30,
        reducedMotion: false,
        status: "loading"
      })
    ).toEqual({
      countLabel: "30 local frames",
      motionLabel: "Preparing motion",
      tone: "animated",
      visible: true
    });
  });

  it("uses singular image copy for one local frame", () => {
    expect(
      getLoadingIntroState({
        imageCount: 1,
        reducedMotion: false,
        status: "loading"
      }).countLabel
    ).toBe("1 local frame");
  });

  it("uses generic local JSON copy before the image count is known", () => {
    expect(
      getLoadingIntroState({
        imageCount: 0,
        reducedMotion: false,
        status: "loading"
      }).countLabel
    ).toBe("Local JSON frames");
  });

  it("uses calm copy for reduced motion users", () => {
    expect(
      getLoadingIntroState({
        imageCount: 12,
        reducedMotion: true,
        status: "loading"
      })
    ).toEqual({
      countLabel: "12 local frames",
      motionLabel: "Preparing gallery",
      tone: "reduced",
      visible: true
    });
  });

  it("hides the intro after ready or error states", () => {
    expect(
      getLoadingIntroState({
        imageCount: 30,
        reducedMotion: false,
        status: "ready"
      }).visible
    ).toBe(false);
    expect(
      getLoadingIntroState({
        imageCount: 0,
        reducedMotion: false,
        status: "error"
      }).visible
    ).toBe(false);
  });
});
