"use client";

import type { GalleryImage } from "@/lib/gallery/types";

type GalleryDebugListProps = {
  error?: string;
  images?: GalleryImage[];
  status: "loading" | "error" | "ready";
};

export function GalleryDebugList({ error, images = [], status }: GalleryDebugListProps) {
  if (status === "loading") {
    return (
      <section className="debug-panel" aria-live="polite">
        <p className="debug-label">Loading gallery data</p>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="debug-panel debug-panel-error" aria-live="polite">
        <p className="debug-label">Gallery data error</p>
        <p className="debug-error">{error}</p>
      </section>
    );
  }

  return (
    <section className="debug-panel" aria-labelledby="debug-gallery-title">
      <div className="debug-panel-header">
        <p className="debug-label">Gallery data proof</p>
        <p className="debug-count">{images.length} images visible</p>
      </div>
      <ul className="debug-list" id="debug-gallery-title">
        {images.map((image, index) => (
          <li className="debug-item" key={image.id}>
            <span
              className="debug-swatch"
              style={{ backgroundColor: image.dominantColor ?? "#e8e8e2" }}
              aria-hidden="true"
            />
            <div>
              <p className="debug-title">
                {String(index + 1).padStart(2, "0")}{" "}
                {image.title ?? image.id}
              </p>
              <p className="debug-meta">
                {image.location} / {image.year} / {image.category}
              </p>
              <p className="debug-path">{image.thumbSrc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
