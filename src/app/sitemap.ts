import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://orderpilot.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/platform",
    "/workflow",
    "/controls",
    "/security",
    "/pricing",
    "/customers",
    "/faq",
    "/privacy",
    "/terms",
    "/legal",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/pricing" ? 0.9 : 0.7,
  }));
}
