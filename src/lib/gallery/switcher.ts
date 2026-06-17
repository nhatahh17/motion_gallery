import type { GalleryLayoutMode } from "./layout";

export function getLayoutSwitcherPillState({
  activeLayout,
  layoutOrder,
  reducedMotion
}: {
  activeLayout: GalleryLayoutMode;
  layoutOrder: GalleryLayoutMode[];
  reducedMotion: boolean;
}) {
  const safeCount = Math.max(layoutOrder.length, 1);
  const activeIndex = layoutOrder.indexOf(activeLayout);
  const index = activeIndex >= 0 ? activeIndex : 0;

  return {
    durationMs: reducedMotion ? 0 : 260,
    index,
    translatePercent: index * 100,
    widthPercent: 100 / safeCount
  };
}
