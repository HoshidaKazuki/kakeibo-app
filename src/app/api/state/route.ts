import { NextResponse } from "next/server";
import { DEFAULT_MEMBERS, type Member, type Transaction } from "@/types";
import { todayString } from "@/lib/format";
import { getAdminClient } from "@/lib/supabase/admin";
import { logServerEvent } from "@/lib/server/logging";

const AUTH_COOKIE = "kakeibo_auth";
const SINGLETON_ID = 1;

type SharedState = {
  transactions: Transaction[];
  members: Member[];
  yearMonth: string;
};

function defaultState(): SharedState {
  return {
    transactions: [],
    members: DEFAULT_MEMBERS,
    yearMonth: todayString().slice(0, 7),
  };
}

function ensureAuthorized(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  return cookie.includes(`${AUTH_COOKIE}=1`);
}

export async function GET(request: Request) {
  if (!ensureAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("shared_app_state")
      .select("state")
      .eq("id", SINGLETON_ID)
      .maybeSingle();

    if (error) {
      await logServerEvent({
        eventType: "state_read_failed",
        level: "error",
        message: error.message,
      });
      return NextResponse.json({ error: "state_read_failed" }, { status: 500 });
    }

    if (!data?.state) {
      const state = defaultState();
      const { error: upsertError } = await supabase.from("shared_app_state").upsert({
        id: SINGLETON_ID,
        state,
      });
      if (upsertError) {
        await logServerEvent({
          eventType: "state_bootstrap_failed",
          level: "error",
          message: upsertError.message,
        });
        return NextResponse.json({ error: "state_bootstrap_failed" }, { status: 500 });
      }
      return NextResponse.json(state);
    }

    return NextResponse.json(data.state as SharedState);
  } catch (error) {
    await logServerEvent({
      eventType: "state_read_exception",
      level: "error",
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: "state_read_exception" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!ensureAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SharedState;
    const payload: SharedState = {
      transactions: Array.isArray(body.transactions) ? body.transactions : [],
      members: Array.isArray(body.members) && body.members.length > 0 ? body.members : DEFAULT_MEMBERS,
      yearMonth:
        typeof body.yearMonth === "string" && /^\d{4}-\d{2}$/.test(body.yearMonth)
          ? body.yearMonth
          : todayString().slice(0, 7),
    };

    const supabase = getAdminClient();
    const { error } = await supabase.from("shared_app_state").upsert({
      id: SINGLETON_ID,
      state: payload,
    });

    if (error) {
      await logServerEvent({
        eventType: "state_write_failed",
        level: "error",
        message: error.message,
      });
      return NextResponse.json({ error: "state_write_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    await logServerEvent({
      eventType: "state_write_exception",
      level: "error",
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: "state_write_exception" }, { status: 500 });
  }
}
