"use client";

import { useEffect, useState } from "react";
import { getLoadingIntroState } from "@/lib/gallery/intro";

type LoadingIntroProps = {
  imageCount: number;
};

export function LoadingIntro({ imageCount }: LoadingIntroProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const intro = getLoadingIntroState({
    imageCount,
    reducedMotion,
    status: "loading"
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateReducedMotion() {
      setReducedMotion(media.matches);
    }

    updateReducedMotion();
    media.addEventListener("change", updateReducedMotion);

    return () => media.removeEventListener("change", updateReducedMotion);
  }, []);

  if (!intro.visible) {
    return null;
  }

  return (
    <section
      aria-label="Gallery loading intro"
      aria-live="polite"
      className="loading-intro"
      data-tone={intro.tone}
    >
      <div className="loading-intro-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="loading-intro-kicker">{intro.motionLabel}</p>
      <h2>Motion gallery</h2>
      <p className="loading-intro-copy">
        Local JSON images are being prepared for the first orbit.
      </p>
      <p className="loading-intro-count">{intro.countLabel}</p>
    </section>
  );
}
