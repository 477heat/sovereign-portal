import type { MetadataRoute } from "next";
import { absoluteUrl, publicSeoPages } from "@/lib/seo";

const lastModified = new Date("2026-06-22T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return publicSeoPages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified,
    changeFrequency: page.changeFrequency ?? "monthly",
    priority: page.priority ?? 0.5,
    images: page.image ? [absoluteUrl(page.image.url)] : undefined,
  }));
}
