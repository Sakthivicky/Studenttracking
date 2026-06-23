import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session");

  const isProtected =
    request.nextUrl.pathname.startsWith("/students") ||
    request.nextUrl.pathname.startsWith("/tracker");

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/students/:path*", "/tracker/:path*"],
};