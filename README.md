# かけぼっちゃん

シンプルな家計簿Webアプリ。

## 技術スタック

- フレームワーク: Next.js 16 (App Router) + TypeScript
- スタイリング: Tailwind CSS
- データ保存: Supabase (PostgreSQL + 認証)

> Next.jsのバージョンが新しいため、実装時は `node_modules/next/dist/docs/` 内の同梱ドキュメントを参照してください（`AGENTS.md`参照）。

## セットアップ

1. 依存関係のインストール

   ```bash
   npm install
   ```

2. 環境変数の設定

   `.env.local.example` を `.env.local` にコピーし、SupabaseプロジェクトのURLとANON KEYを設定する。

   ```bash
   cp .env.local.example .env.local
   ```

3. 開発サーバーの起動

   ```bash
   npm run dev
   ```

   [http://localhost:3000](http://localhost:3000) で確認できます。

## ディレクトリ構成

```
src/
  app/            # ルーティング・ページ (App Router)
  components/     # UIコンポーネント
  lib/supabase/   # Supabaseクライアント (client.ts / server.ts)
  types/          # 型定義
```

## 複数ターミナルでの並行作業の例

開発中、以下のように役割ごとにターミナルを分けると並行作業の練習になります。

| ターミナル | 用途 | コマンド |
| --- | --- | --- |
| 1 | 開発サーバー（常時起動） | `npm run dev` |
| 2 | Lint / 型チェック | `npm run lint` / `npx tsc --noEmit` |
| 3 | Git操作（status確認・コミット） | `git status` / `git add` / `git commit` |
| 4 | パッケージ追加・調査用 | `npm install <パッケージ名>` |

ターミナル1は開発サーバーが起動しっぱなしになるため専用にし、他の作業は別ターミナルで行うと干渉しません。
