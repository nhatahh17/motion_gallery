import { describe, expect, it } from "vitest";
import { getRoundedPlaneShapePoints } from "./rounded-plane";

describe("rounded plane geometry", () => {
  it("keeps points inside the configured plane bounds", () => {
    const points = getRoundedPlaneShapePoints({ width: 1.8, height: 1.2, radius: 0.14 });

    expect(points.length).toBeGreaterThan(12);
    expect(Math.min(...points.map((point) => point.x))).toBeGreaterThanOrEqual(-0.9);
    expect(Math.max(...points.map((point) => point.x))).toBeLessThanOrEqual(0.9);
    expect(Math.min(...points.map((point) => point.y))).toBeGreaterThanOrEqual(-0.6);
    expect(Math.max(...points.map((point) => point.y))).toBeLessThanOrEqual(0.6);
  });

  it("clamps the corner radius to less than half the shortest side", () => {
    const points = getRoundedPlaneShapePoints({ width: 0.4, height: 0.2, radius: 1 });
    const topRightArcPoint = points.find((point) => point.x > 0 && point.y > 0);

    expect(topRightArcPoint).toBeDefined();
    expect(Math.max(...points.map((point) => point.x))).toBeCloseTo(0.2);
    expect(Math.max(...points.map((point) => point.y))).toBeCloseTo(0.1);
  });
});
