import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "kakeibo_auth";

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get(AUTH_COOKIE)?.value === "1";
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/app") && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();

  if (isAuthenticated && pathname.startsWith("/app")) {
    response.cookies.set(AUTH_COOKIE, "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    });
  }

  return response;
}

export const config = {
  matcher: ["/app/:path*", "/login"],
};
