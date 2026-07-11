"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/app`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setMessage("ログインリンクの送信に失敗しました。時間をおいて再試行してください。");
    } else {
      setMessage("ログインリンクを送信しました。メールを確認してください。");
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="paper-card animate-rise w-full max-w-md p-5">
      <h1 className="headline-font text-lg font-bold text-foreground">本番ログイン</h1>
      <p className="mt-1 text-xs text-ink-soft">
        メールアドレスにログインリンクを送信します。
      </p>

      <label className="mt-4 flex flex-col gap-1 text-sm text-ink-soft">
        メールアドレス
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="rounded-xl border border-border bg-white/70 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="headline-font mt-4 w-full rounded-full bg-accent py-2.5 text-sm font-bold text-accent-foreground transition-opacity disabled:opacity-60"
      >
        {isLoading ? "送信中..." : "ログインリンクを送る"}
      </button>

      {message ? <p className="mt-3 text-xs text-ink-soft">{message}</p> : null}
    </form>
  );
}
