import type { GalleryImage, GalleryImageRatio } from "./types";

const requiredStringFields = [
  "id",
  "src",
  "thumbSrc",
  "alt",
  "location",
  "year",
  "category"
] as const;

const optionalStringFields = [
  "title",
  "date",
  "camera",
  "lens",
  "dominantColor"
] as const;

const allowedRatios = new Set<GalleryImageRatio>([
  "landscape",
  "portrait",
  "square"
]);

export class GalleryDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GalleryDataError";
  }
}

export function validateGalleryImages(payload: unknown): GalleryImage[] {
  if (!Array.isArray(payload)) {
    throw new GalleryDataError("Gallery payload must be an array of images.");
  }

  const issues: string[] = [];
  const ids = new Set<string>();

  const images = payload.map((item, index) => {
    if (!isRecord(item)) {
      issues.push(`item ${index}: must be an object`);
      return null;
    }

    const id = typeof item.id === "string" ? item.id.trim() : "";
    const label = id || `item ${index}`;

    if (typeof item.id !== "string" || item.id.trim().length === 0) {
      issues.push(`${label}: id must be a non-empty string`);
    }

    if (id) {
      if (ids.has(id)) {
        issues.push(`${label}: duplicate id`);
      }
      ids.add(id);
    }

    for (const field of requiredStringFields) {
      if (field === "id") {
        continue;
      }

      if (typeof item[field] !== "string" || item[field].trim().length === 0) {
        issues.push(`${label}: ${field} must be a non-empty string`);
      }
    }

    for (const field of optionalStringFields) {
      if (
        item[field] !== undefined &&
        (typeof item[field] !== "string" || item[field].trim().length === 0)
      ) {
        issues.push(`${label}: ${field} must be a non-empty string when set`);
      }
    }

    if (!isPositiveNumber(item.width)) {
      issues.push(`${label}: width must be greater than 0`);
    }

    if (!isPositiveNumber(item.height)) {
      issues.push(`${label}: height must be greater than 0`);
    }

    if (
      item.ratio !== undefined &&
      (typeof item.ratio !== "string" ||
        !allowedRatios.has(item.ratio as GalleryImageRatio))
    ) {
      issues.push(`${label}: ratio must be landscape, portrait, or square`);
    }

    return item;
  });

  if (issues.length > 0) {
    throw new GalleryDataError(`Invalid gallery data: ${issues.join("; ")}`);
  }

  return images.filter(isRecord).map((item) => ({
    id: readRequiredString(item, "id"),
    src: readRequiredString(item, "src"),
    thumbSrc: readRequiredString(item, "thumbSrc"),
    alt: readRequiredString(item, "alt"),
    title: trimOptional(item.title),
    location: readRequiredString(item, "location"),
    year: readRequiredString(item, "year"),
    category: readRequiredString(item, "category"),
    date: trimOptional(item.date),
    camera: trimOptional(item.camera),
    lens: trimOptional(item.lens),
    ratio: item.ratio as GalleryImageRatio | undefined,
    width: readRequiredNumber(item, "width"),
    height: readRequiredNumber(item, "height"),
    dominantColor: trimOptional(item.dominantColor)
  }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function trimOptional(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim() : undefined;
}

function readRequiredString(
  item: Record<string, unknown>,
  field: string
): string {
  return (item[field] as string).trim();
}

function readRequiredNumber(
  item: Record<string, unknown>,
  field: string
): number {
  return item[field] as number;
}
