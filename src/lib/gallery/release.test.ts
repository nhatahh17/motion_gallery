import { describe, expect, it } from "vitest";
import { releaseMetadata } from "./release";

describe("releaseMetadata", () => {
  it("defines production-ready page metadata", () => {
    expect(releaseMetadata.title).toBe("Personal Motion Gallery");
    expect(releaseMetadata.description).toMatch(/experimental WebGL photo gallery/i);
    expect(releaseMetadata.url).toBe("https://motion-gallery.local");
  });

  it("declares favicon and Open Graph assets", () => {
    expect(releaseMetadata.icons.icon).toBe("/icon.svg");
    expect(releaseMetadata.openGraph.images).toContain("/og-image.svg");
    expect(releaseMetadata.twitter.card).toBe("summary_large_image");
  });
});
