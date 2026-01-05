import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { logger } from "better-auth";

// Define public pages that don't require authentication
const publicPages = ["/admin/login", "/admin/register", "/"];

// Define public API prefixes/paths that don't require authentication
// /api/auth/* is handled by better-auth and should be public (sign in, sign up, etc)
const publicApiPrefixes = ["/api/auth"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  logger.info(`Middleware checking: ${pathname}`);

  // 1. Determine if it's an API request or a Page request
  const isApi = pathname.startsWith("/api");

  // 2. Check if the path is public (no auth required)
  const isPublicPage = publicPages.includes(pathname);
  const isPublicApi = publicApiPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isPublicPage || isPublicApi) {
    return NextResponse.next();
  }

  // 3. If not public, check for authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    console.log("Unauthorized access attempt");
    if (isApi) {
      // For API requests, return 401 JSON
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      // For Page requests, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      // Optional: Add redirect param to return after login
      // url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 4. Authorized, allow request to proceed
  return NextResponse.next();
}

export const config = {
  // Matcher ignoring static files and next internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
