import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Define redirects as an array of objects
const redirects = [
  { from: "/en/modules", to: "/courses" },
  { from: "/fr/modules", to: "/courses" },
  { from: "/modules", to: "/courses" },
];

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Check for redirects
  const redirectRule = redirects.find((r) => url.pathname === r.from);
  if (redirectRule) {
    url.pathname = redirectRule.to;
    return NextResponse.redirect(url);
  }

  // Fallback to next-intl middleware
  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
