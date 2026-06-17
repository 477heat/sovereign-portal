import type { MetadataRoute } from "next";

const baseUrl = "https://www.sovengine.xyz";
const lastModified = new Date("2026-06-03T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/coinbase`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${baseUrl}/coinbase-assets/cover-1200x630.jpg`],
    },
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portal`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/engine`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/developer`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/access`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
