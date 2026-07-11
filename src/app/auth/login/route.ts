import { NextResponse } from "next/server";

const AUTH_COOKIE = "kakeibo_auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const loginId = String(formData.get("loginId") ?? "");
  const password = String(formData.get("password") ?? "");

  const expectedId = process.env.APP_LOGIN_ID;
  const expectedPassword = process.env.APP_LOGIN_PASSWORD;

  if (!expectedId || !expectedPassword) {
    const failUrl = new URL("/login?error=not_configured", request.url);
    return NextResponse.redirect(failUrl);
  }

  if (loginId !== expectedId || password !== expectedPassword) {
    const failUrl = new URL("/login?error=invalid", request.url);
    return NextResponse.redirect(failUrl);
  }

  const response = NextResponse.redirect(new URL("/app", request.url));
  response.cookies.set(AUTH_COOKIE, "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
