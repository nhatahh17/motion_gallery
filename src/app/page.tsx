import { GalleryDebugList } from "@/components/GalleryDebugList";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <p className="site-kicker">Personal Motion Gallery</p>
        <p className="site-phase">Phase 1 / JSON data foundation</p>
      </header>

      <section className="intro-section" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Motion gallery foundation</h1>
          <p>
            Local image metadata is loaded from JSON first. The WebGL gallery
            will replace this debug surface in the next phase.
          </p>
        </div>
      </section>

      <GalleryDebugList />
    </main>
  );
}
