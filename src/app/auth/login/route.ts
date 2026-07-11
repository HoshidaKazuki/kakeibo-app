import { NextResponse } from "next/server";
import { logLoginAttempt, logServerEvent } from "@/lib/server/logging";

const AUTH_COOKIE = "kakeibo_auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const loginId = String(formData.get("loginId") ?? "");
  const password = String(formData.get("password") ?? "");
  const ip = request.headers.get("x-forwarded-for") ?? undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;

  const expectedId = process.env.APP_LOGIN_ID;
  const expectedPassword = process.env.APP_LOGIN_PASSWORD;

  if (!expectedId || !expectedPassword) {
    await logServerEvent({
      eventType: "login_config_missing",
      level: "error",
      message: "APP_LOGIN_ID or APP_LOGIN_PASSWORD is missing",
      loginId,
      meta: { ip, userAgent },
    });
    const failUrl = new URL("/login?error=not_configured", request.url);
    return NextResponse.redirect(failUrl);
  }

  if (loginId !== expectedId || password !== expectedPassword) {
    await logLoginAttempt({
      loginId,
      success: false,
      ip,
      userAgent,
    });
    const failUrl = new URL("/login?error=invalid", request.url);
    return NextResponse.redirect(failUrl);
  }

  await logLoginAttempt({
    loginId,
    success: true,
    ip,
    userAgent,
  });

  const response = NextResponse.redirect(new URL("/app", request.url));
  response.cookies.set(AUTH_COOKIE, "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  return response;
}
