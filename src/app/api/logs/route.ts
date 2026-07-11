import { NextResponse } from "next/server";
import { logServerEvent } from "@/lib/server/logging";

const AUTH_COOKIE = "kakeibo_auth";

function ensureAuthorized(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  return cookie.includes(`${AUTH_COOKIE}=1`);
}

export async function POST(request: Request) {
  if (!ensureAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      eventType?: string;
      level?: "info" | "warn" | "error";
      message?: string;
      meta?: Record<string, unknown>;
    };

    await logServerEvent({
      eventType: body.eventType ?? "client_log",
      level: body.level ?? "info",
      message: body.message ?? "no_message",
      meta: body.meta,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
