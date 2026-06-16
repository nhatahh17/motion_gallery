"use client";

import { useEffect, useState } from "react";
import type { GalleryImage } from "./types";
import { validateGalleryImages } from "./validation";

type GalleryDataState =
  | { status: "loading"; images: GalleryImage[]; error: null }
  | { status: "ready"; images: GalleryImage[]; error: null }
  | { status: "error"; images: GalleryImage[]; error: string };

export function useGalleryData(): GalleryDataState {
  const [state, setState] = useState<GalleryDataState>({
    status: "loading",
    images: [],
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadGalleryData() {
      try {
        const response = await fetch("/data/gallery.json", {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load /data/gallery.json (${response.status})`
          );
        }

        const payload: unknown = await response.json();
        const images = validateGalleryImages(payload);
        setState({ status: "ready", images, error: null });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          status: "error",
          images: [],
          error:
            error instanceof Error
              ? error.message
              : "Unable to load gallery data."
        });
      }
    }

    void loadGalleryData();

    return () => controller.abort();
  }, []);

  return state;
}
