import { mkdirSync, existsSync } from "node:fs";
import { chromium } from "playwright";

async function resolveBaseUrl() {
  const envUrl = process.env.LIVE_BASE_URL;
  const candidates = [envUrl, "https://orderpilot.ai", "https://orderpilot.vercel.app"].filter(Boolean) as string[];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) return url;
    } catch {}
  }
  throw new Error("Could not resolve LIVE_BASE_URL");
}

async function main() {
  const baseUrl = await resolveBaseUrl();
  const outDir = "public/assets/generated";
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  const targets = [
    { path: "/dashboard", file: "hero-dashboard.png" },
    { path: "/platform", file: "platform.png" },
    { path: "/workflow", file: "workflow.png" },
    { path: "/controls", file: "controls.png" },
    { path: "/pricing", file: "pricing.png" },
    { path: "/security", file: "security.png" },
    { path: "/customers", file: "customers.png" },
    { path: "/faq", file: "faq.png" },
    { path: "/privacy", file: "privacy.png" },
    { path: "/terms", file: "terms.png" },
    { path: "/legal", file: "legal.png" },
  ];

  for (const t of targets) {
    const url = `${baseUrl}${t.path}`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${outDir}/${t.file}`, fullPage: true });
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
