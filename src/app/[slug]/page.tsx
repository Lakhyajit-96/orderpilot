import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingDetailPage } from "@/components/marketing/marketing-detail-page";
import {
  marketingDetailContent,
  marketingDetailSlugs,
  type MarketingDetailSlug,
} from "@/components/marketing/marketing-detail-content";
import {
  marketingLegalContent,
  marketingLegalSlugs,
  type MarketingLegalSlug,
} from "@/components/marketing/marketing-legal-content";

type MarketingPageSlug = MarketingDetailSlug | MarketingLegalSlug;

const allMarketingSlugs = [...marketingDetailSlugs, ...marketingLegalSlugs] as const;

function isMarketingPageSlug(slug: string): slug is MarketingPageSlug {
  return allMarketingSlugs.includes(slug as MarketingPageSlug);
}

function getMarketingPageContent(slug: MarketingPageSlug) {
  if (slug in marketingDetailContent) {
    return marketingDetailContent[slug as MarketingDetailSlug];
  }

  return marketingLegalContent[slug as MarketingLegalSlug];
}

export function generateStaticParams() {
  return allMarketingSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!isMarketingPageSlug(slug)) {
    return {};
  }

  const page = getMarketingPageContent(slug);

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function MarketingDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isMarketingPageSlug(slug)) {
    notFound();
  }

  const page = getMarketingPageContent(slug);

  return <MarketingDetailPage {...page} />;
}