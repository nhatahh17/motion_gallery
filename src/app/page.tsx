import { GalleryExperience } from "@/components/gallery/GalleryExperience";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <p className="site-kicker">Personal Motion Gallery</p>
        <p className="site-phase">Phase 2 / WebGL foundation</p>
      </header>

      <section className="intro-section" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Motion gallery</h1>
          <p>
            Thumbnail textures now render as WebGL planes from local JSON,
            preserving each image ratio before motion layouts arrive.
          </p>
        </div>
      </section>

      <GalleryExperience />
    </main>
  );
}
