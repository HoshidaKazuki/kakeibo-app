import { getAdminClient } from "@/lib/supabase/admin";

type Level = "info" | "warn" | "error";

export async function logServerEvent(args: {
  eventType: string;
  level: Level;
  message: string;
  meta?: Record<string, unknown>;
  loginId?: string;
}) {
  try {
    const supabase = getAdminClient();
    await supabase.from("app_event_logs").insert({
      event_type: args.eventType,
      level: args.level,
      message: args.message,
      meta: args.meta ?? {},
      login_id: args.loginId ?? null,
    });
  } catch {
    // Keep app flow stable even if logging fails.
  }
}

export async function logLoginAttempt(args: {
  loginId: string;
  success: boolean;
  ip?: string;
  userAgent?: string;
}) {
  try {
    const supabase = getAdminClient();
    await supabase.from("login_audit_logs").insert({
      login_id: args.loginId,
      success: args.success,
      ip: args.ip ?? null,
      user_agent: args.userAgent ?? null,
    });
  } catch {
    // Keep app flow stable even if logging fails.
  }
}
