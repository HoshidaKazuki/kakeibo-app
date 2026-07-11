type Props = {
  error?: string;
};

const ERROR_TEXT: Record<string, string> = {
  invalid: "IDまたはパスワードが違います。",
  not_configured: "サーバー側のID/パスワード設定が未完了です。",
};

export default function LoginForm({ error }: Props) {
  const message = error ? ERROR_TEXT[error] ?? "ログインに失敗しました。" : "";

  return (
    <form action="/auth/login" method="post" className="paper-card animate-rise w-full max-w-md p-5">
      <h1 className="headline-font text-lg font-bold text-foreground">本番ログイン</h1>
      <p className="mt-1 text-xs text-ink-soft">
        管理IDとパスワードでログインします。
      </p>

      <label className="mt-4 flex flex-col gap-1 text-sm text-ink-soft">
        ログインID
        <input
          type="text"
          name="loginId"
          required
          placeholder="admin"
          className="rounded-xl border border-border bg-white/70 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </label>

      <label className="mt-3 flex flex-col gap-1 text-sm text-ink-soft">
        パスワード
        <input
          type="password"
          name="password"
          required
          className="rounded-xl border border-border bg-white/70 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </label>

      <button
        type="submit"
        className="headline-font mt-4 w-full rounded-full bg-accent py-2.5 text-sm font-bold text-accent-foreground transition-opacity"
      >
        ログイン
      </button>

      {message ? <p className="mt-3 text-xs text-ink-soft">{message}</p> : null}
    </form>
  );
}
