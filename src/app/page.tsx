import { GalleryExperience } from "@/components/gallery/GalleryExperience";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <p className="site-kicker">Personal Motion Gallery</p>
        <p className="site-phase">Phase 5 / 3D Circle mode</p>
      </header>

      <section className="intro-section" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Motion gallery</h1>
          <p>
            Thirty local JSON images now drift through layered 2D rings and a
            spatial 3D circle, with drag momentum carrying across layout modes.
          </p>
        </div>
      </section>

      <GalleryExperience />
    </main>
  );
}
