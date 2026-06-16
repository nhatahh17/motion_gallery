"use client";

import { useEffect, useState } from "react";

export function useViewportDpr() {
  const [dpr, setDpr] = useState(1.6);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");

    function updateDpr() {
      setDpr(media.matches ? 1.35 : 1.6);
    }

    updateDpr();
    media.addEventListener("change", updateDpr);

    return () => media.removeEventListener("change", updateDpr);
  }, []);

  return dpr;
}
