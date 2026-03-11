import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { flags } from "@/lib/env";
import { legacyMarketingOrderReviewHref, marketingOrderReviewHref } from "@/lib/marketing-routes";
import { isProxyProtectedRoute, shouldRedirectLegacyMarketingOrderReview } from "@/lib/public-route-core";

function handleLegacyMarketingRedirect(pathname: string, request: NextRequest, isAuthenticated: boolean) {
  if (!shouldRedirectLegacyMarketingOrderReview(pathname, isAuthenticated)) {
    return null;
  }

  return NextResponse.redirect(new URL(marketingOrderReviewHref, request.url));
}

const proxy = flags.hasClerk
  ? clerkMiddleware(async (auth, request) => {
      const pathname = request.nextUrl.pathname;

      if (pathname === legacyMarketingOrderReviewHref) {
        const { userId } = await auth();
        const redirectResponse = handleLegacyMarketingRedirect(pathname, request, Boolean(userId));

        if (redirectResponse) {
          return redirectResponse;
        }
      }

      if (isProxyProtectedRoute(pathname)) {
        await auth.protect();
      }
    })
  : (request: NextRequest) => {
      const pathname = request.nextUrl.pathname;
      return handleLegacyMarketingRedirect(pathname, request, false) ?? NextResponse.next();
    };

export default proxy;

export const config = {
  matcher: [
    "/((?!_next|api/stripe/webhook|api/inbox/providers/gmail/webhook|api/inbox/subscriptions/renew|api/inbox/connections/[^/]+/webhook|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};