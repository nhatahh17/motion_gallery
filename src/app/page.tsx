import { Suspense } from "react";
import { GalleryExperience } from "@/components/gallery/GalleryExperience";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <p className="site-kicker">Personal Motion Gallery</p>
        <p className="site-phase">Phase 16 / focused metadata preview</p>
      </header>

      <section className="intro-section" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Motion gallery</h1>
          <p>
            Thirty local JSON images move through layered rings, spatial 3D,
            and a cinematic horizon strip. Tap a frame to inspect the quiet
            metadata behind it.
          </p>
        </div>
      </section>

      <Suspense fallback={null}>
        <GalleryExperience />
      </Suspense>
    </main>
  );
}
