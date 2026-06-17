export type GalleryDataStatus = "loading" | "ready" | "error";

export type LoadingIntroTone = "animated" | "reduced";

export type LoadingIntroState = {
  countLabel: string;
  motionLabel: string;
  tone: LoadingIntroTone;
  visible: boolean;
};

type LoadingIntroInput = {
  imageCount: number;
  reducedMotion: boolean;
  status: GalleryDataStatus;
};

export function getLoadingIntroState({
  imageCount,
  reducedMotion,
  status
}: LoadingIntroInput): LoadingIntroState {
  const frameLabel = imageCount === 1 ? "local frame" : "local frames";
  const countLabel =
    imageCount > 0 ? `${imageCount} ${frameLabel}` : "Local JSON frames";

  return {
    countLabel,
    motionLabel: reducedMotion ? "Preparing gallery" : "Preparing motion",
    tone: reducedMotion ? "reduced" : "animated",
    visible: status === "loading"
  };
}
