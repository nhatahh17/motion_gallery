import { GalleryExperience } from "@/components/gallery/GalleryExperience";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <p className="site-kicker">Personal Motion Gallery</p>
        <p className="site-phase">Phase 3 / 2D Circle orbit</p>
      </header>

      <section className="intro-section" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Motion gallery</h1>
          <p>
            Thirty local JSON images now drift through layered 2D rings, with
            thumbnail WebGL textures preserving each original image ratio.
          </p>
        </div>
      </section>

      <GalleryExperience />
    </main>
  );
}
