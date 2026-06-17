export type RoundedPlaneInput = {
  width: number;
  height: number;
  radius: number;
};

export type RoundedPlanePoint = {
  x: number;
  y: number;
};

export function getRoundedPlaneCornerRadius({ width, height, radius }: RoundedPlaneInput): number {
  const shortestSide = Math.min(Math.abs(width), Math.abs(height));
  return Math.max(0, Math.min(radius, shortestSide / 2 - 0.001));
}

export function getRoundedPlaneShapePoints(input: RoundedPlaneInput): RoundedPlanePoint[] {
  const halfWidth = Math.abs(input.width) / 2;
  const halfHeight = Math.abs(input.height) / 2;
  const radius = getRoundedPlaneCornerRadius(input);
  const segmentsPerCorner = 5;
  const corners = [
    { cx: halfWidth - radius, cy: halfHeight - radius, start: 0, end: Math.PI / 2 },
    { cx: -halfWidth + radius, cy: halfHeight - radius, start: Math.PI / 2, end: Math.PI },
    { cx: -halfWidth + radius, cy: -halfHeight + radius, start: Math.PI, end: Math.PI * 1.5 },
    { cx: halfWidth - radius, cy: -halfHeight + radius, start: Math.PI * 1.5, end: Math.PI * 2 }
  ];

  return corners.flatMap((corner) =>
    Array.from({ length: segmentsPerCorner + 1 }, (_, segmentIndex) => {
      const progress = segmentIndex / segmentsPerCorner;
      const angle = corner.start + (corner.end - corner.start) * progress;

      return {
        x: corner.cx + Math.cos(angle) * radius,
        y: corner.cy + Math.sin(angle) * radius
      };
    })
  );
}
