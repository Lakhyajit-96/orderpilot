export function resolveMarketingHref(href: string, pathname: string | null) {
  if (!href.startsWith("#")) {
    return href;
  }

  return pathname === "/" ? href : `/${href}`;
}