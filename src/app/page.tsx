import { GalleryExperience } from "@/components/gallery/GalleryExperience";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <p className="site-kicker">Personal Motion Gallery</p>
        <p className="site-phase">Phase 6 / 3D Horizon mode</p>
      </header>

      <section className="intro-section" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Motion gallery</h1>
          <p>
            Thirty local JSON images now move through layered rings, a spatial
            3D circle, and a cinematic horizon strip with drag momentum intact.
          </p>
        </div>
      </section>

      <GalleryExperience />
    </main>
  );
}
