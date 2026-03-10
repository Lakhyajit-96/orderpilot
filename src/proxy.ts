import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/api/stripe/webhook") ||
    pathname === "/api/inbox/providers/gmail/webhook" ||
    pathname === "/api/inbox/subscriptions/renew" ||
    /^\/api\/inbox\/connections\/[^/]+\/webhook$/.test(pathname);

  if (!isPublicRoute) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|api/stripe/webhook|api/inbox/providers/gmail/webhook|api/inbox/subscriptions/renew|api/inbox/connections/[^/]+/webhook|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};