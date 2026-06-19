import { Suspense } from "react";
import { GalleryExperience } from "@/components/gallery/GalleryExperience";

export default function Home() {
  return (
    <main className="page-shell">
      <Suspense fallback={null}>
        <GalleryExperience />
      </Suspense>
    </main>
  );
}
