export type GalleryImageRatio = "landscape" | "portrait" | "square";

export type GalleryImage = {
  id: string;
  src: string;
  thumbSrc: string;
  alt: string;
  title?: string;
  location: string;
  year: string;
  category: string;
  date?: string;
  camera?: string;
  lens?: string;
  ratio?: GalleryImageRatio;
  width: number;
  height: number;
  dominantColor?: string;
};
