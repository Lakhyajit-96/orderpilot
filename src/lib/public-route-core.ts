import { legacyMarketingOrderReviewHref, marketingOrderReviewHref } from "./marketing-routes.ts";

export function isPublicAppRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname === marketingOrderReviewHref ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/api/stripe/webhook") ||
    pathname === "/api/inbox/providers/gmail/webhook" ||
    pathname === "/api/inbox/subscriptions/renew" ||
    /^\/api\/inbox\/connections\/[^/]+\/webhook$/.test(pathname)
  );
}

export function isProxyProtectedRoute(pathname: string) {
  return pathname.startsWith("/api/") && !isPublicAppRoute(pathname);
}

export function shouldRedirectLegacyMarketingOrderReview(pathname: string, isAuthenticated: boolean) {
  return pathname === legacyMarketingOrderReviewHref && !isAuthenticated;
}