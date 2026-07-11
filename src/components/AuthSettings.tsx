"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  currentEmail: string;
};

export default function AuthSettings({ currentEmail }: Props) {
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  async function handleEmailUpdate(e: React.FormEvent) {
    e.preventDefault();
    setEmailMessage("");
    setIsUpdatingEmail(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      setEmailMessage("メールアドレスの変更に失敗しました。しばらくして再試行してください。");
    } else {
      setEmailMessage("確認メールを送信しました。新しいメールで承認すると反映されます。");
    }

    setIsUpdatingEmail(false);
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage("");

    if (password.length < 8) {
      setPasswordMessage("パスワードは8文字以上で入力してください。");
      return;
    }

    setIsUpdatingPassword(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setPasswordMessage("パスワード変更に失敗しました。しばらくして再試行してください。");
    } else {
      setPasswordMessage("パスワードを更新しました。");
      setPassword("");
    }

    setIsUpdatingPassword(false);
  }

  return (
    <section className="paper-card animate-rise w-full max-w-lg p-4">
      <h2 className="headline-font text-sm font-semibold text-foreground">ログイン情報の変更</h2>
      <p className="mt-1 text-xs text-ink-soft">
        IDはメールアドレスです。ここからメールとパスワードを変更できます。
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <form onSubmit={handleEmailUpdate} className="rounded-xl border border-border/70 bg-white/60 p-3">
          <p className="text-xs font-semibold text-foreground">ID（メール）変更</p>
          <label className="mt-2 flex flex-col gap-1 text-xs text-ink-soft">
            新しいメール
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-border/70 bg-white/80 px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <button
            type="submit"
            disabled={isUpdatingEmail}
            className="mt-3 w-full rounded-full border border-border/70 bg-white/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent-soft disabled:opacity-60"
          >
            {isUpdatingEmail ? "更新中..." : "メールを更新"}
          </button>
          {emailMessage ? <p className="mt-2 text-[11px] text-ink-soft">{emailMessage}</p> : null}
        </form>

        <form onSubmit={handlePasswordUpdate} className="rounded-xl border border-border/70 bg-white/60 p-3">
          <p className="text-xs font-semibold text-foreground">パスワード変更</p>
          <label className="mt-2 flex flex-col gap-1 text-xs text-ink-soft">
            新しいパスワード
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-border/70 bg-white/80 px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="mt-3 w-full rounded-full border border-border/70 bg-white/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent-soft disabled:opacity-60"
          >
            {isUpdatingPassword ? "更新中..." : "パスワードを更新"}
          </button>
          {passwordMessage ? <p className="mt-2 text-[11px] text-ink-soft">{passwordMessage}</p> : null}
        </form>
      </div>
    </section>
  );
}
