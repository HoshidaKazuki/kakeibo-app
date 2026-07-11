"use client";

import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-full border border-border/70 bg-white/70 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
    >
      ログアウト
    </button>
  );
}
