export default function SignOutButton() {
  return (
    <form action="/auth/logout" method="post">
      <button
        type="submit"
        className="rounded-full border border-border/70 bg-white/70 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
      >
        ログアウト
      </button>
    </form>
  );
}
