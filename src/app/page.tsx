import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center bg-background px-4 font-sans">
      <main className="paper-card animate-rise w-full max-w-xl p-6 sm:p-8">
        <h1 className="headline-font text-center text-2xl font-bold text-accent sm:text-3xl">
          かけぼっちゃん
        </h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          デモ版（誰でも利用OK）と、ログイン付き本番導線を分けました。
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/demo"
            className="rounded-2xl border border-border/70 bg-white/70 px-4 py-4 text-left transition-colors hover:bg-accent-soft"
          >
            <p className="headline-font text-sm font-semibold text-foreground">公開デモ</p>
            <p className="mt-1 text-xs text-ink-soft">
              ログイン不要。リロードすると記録は残りません。
            </p>
          </Link>
          <Link
            href="/app"
            className="rounded-2xl border border-border/70 bg-white/70 px-4 py-4 text-left transition-colors hover:bg-accent-soft"
          >
            <p className="headline-font text-sm font-semibold text-foreground">本番導線</p>
            <p className="mt-1 text-xs text-ink-soft">
              Supabaseログイン必須。認証後に家計簿を利用します。
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
