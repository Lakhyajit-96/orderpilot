import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { marketingOrderReviewHref } from "@/lib/marketing-routes";
import { isPublicAppRoute, shouldRedirectLegacyMarketingOrderReview } from "@/lib/public-route-core";

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  const { userId } = await auth();

  if (shouldRedirectLegacyMarketingOrderReview(pathname, Boolean(userId))) {
    return NextResponse.redirect(new URL(marketingOrderReviewHref, request.url));
  }

  if (!isPublicAppRoute(pathname)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|api/stripe/webhook|api/inbox/providers/gmail/webhook|api/inbox/subscriptions/renew|api/inbox/connections/[^/]+/webhook|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};