# AI職務経歴書最適化メイカー

**求人情報に合わせて、あなたの職務経歴書をAIが最適化するチート便利ツールです！**

[![Made with Manus](https://img.shields.io/badge/Made%20with-Manus-blue)](https://manus.im)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 概要

AI職務経歴書最適化メイカーは、求人情報に合わせて職務経歴書を自動で最適化するWebアプリケーションです。AIが求人票の要件を分析し、あなたの経歴を最も効果的にアピールする表現に変換します。転職活動を効率化し、書類選考の通過率を向上させることを目的としています。

### 主な機能

- **職務経歴書の自動最適化** - 求人情報に合わせてAIが職務経歴書を最適化
- **複数パターン生成** - 異なるスタイルで複数パターンを生成し、比較可能
- **AI自動評価機能** - 生成された職務経歴書を自動評価してスコアリング（0-100点）
- **多言語対応** - 日本語・英語に対応
- **PDF/Word出力** - 生成結果をPDF、Word、テキスト、Markdown形式で出力
- **OCR機能** - 画像やPDFから職務経歴書のテキストを自動抽出
- **テンプレート機能** - よく使う設定を保存して再利用
- **お気に入り機能** - 生成結果をお気に入りに保存
- **履歴管理** - 過去の生成結果を保存・管理
- **キーボードショートカット** - 効率的な操作をサポート

## デモ

[デモサイト](https://3000-ip838mw0rluxjsbidrnpd-8863219e.manus-asia.computer)

## スクリーンショット

![メインビジュアル](pr_images/01_main_visual.png)

![機能紹介](pr_images/02_features.png)

![AI評価機能](pr_images/04_ai_scoring.png)

## 技術スタック

### フロントエンド
- **React 19** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Tailwind CSS 4** - ユーティリティファーストCSSフレームワーク
- **shadcn/ui** - 再利用可能なUIコンポーネント
- **tRPC 11** - エンドツーエンドの型安全なAPI
- **Vite** - 高速ビルドツール
- **i18next** - 多言語対応

### バックエンド
- **Express 4** - Webフレームワーク
- **tRPC 11** - エンドツーエンドの型安全なAPI
- **Drizzle ORM** - TypeScript-firstのORM
- **MySQL/TiDB** - データベース
- **Manus OAuth** - 認証システム

### AI・外部サービス
- **Manus LLM API** - AI生成エンジン
- **Manus Storage API** - ファイルストレージ
- **Tesseract.js** - OCRエンジン

### 開発ツール
- **Vitest** - テストフレームワーク
- **tsx** - TypeScript実行環境
- **pnpm** - パッケージマネージャー

## セットアップ

### 前提条件

- Node.js 22.x以上
- pnpm 9.x以上
- MySQL/TiDBデータベース

### インストール

1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/disappearphotograph.git
cd disappearphotograph
```

2. 依存関係をインストール

```bash
pnpm install
```

3. 環境変数を設定

`.env`ファイルを作成し、以下の環境変数を設定します：

```env
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-jwt-secret
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

4. データベースマイグレーション

```bash
pnpm db:push
```

5. 開発サーバーを起動

```bash
pnpm dev
```

アプリケーションは`http://localhost:3000`で起動します。

## 使い方

### 基本的な使い方

1. **職務経歴書を入力** - テキストエリアに職務経歴書を貼り付けるか、ファイルをアップロード
2. **求人情報を入力** - 応募したい求人の情報を貼り付け
3. **出力項目を選択** - 生成したい項目（職務要約、志望動機など）を選択
4. **文字数を設定** - 各項目の文字数制限を設定（オプション）
5. **生成ボタンをクリック** - AIが最適化された職務経歴書を生成

### 複数パターン生成

1. **パターン数を選択** - 生成したいパターン数（2-5個）を選択
2. **生成ボタンをクリック** - 異なるスタイルで複数パターンを生成
3. **AI評価を確認** - 各パターンのスコア（0-100点）を比較
4. **最適なパターンを選択** - スコアや内容を比較して最適なパターンを選択

### テンプレート機能

1. **設定を保存** - よく使う設定（出力項目、文字数など）をテンプレートとして保存
2. **テンプレートを選択** - 保存したテンプレートを選択して設定を復元
3. **効率的に生成** - 毎回設定を入力する手間を省略

### キーボードショートカット

- **Ctrl+Enter** - 生成開始
- **Ctrl+K** - クリア
- **Ctrl+H** - 履歴を開く
- **Ctrl+/** - ショートカットヘルプを表示

## プロジェクト構造

```
resume_optimizer/
├── client/                 # フロントエンドコード
│   ├── public/            # 静的ファイル
│   └── src/
│       ├── components/    # Reactコンポーネント
│       ├── pages/         # ページコンポーネント
│       ├── lib/           # ユーティリティ
│       ├── locales/       # 翻訳ファイル
│       └── hooks/         # カスタムフック
├── server/                # バックエンドコード
│   ├── routers.ts         # tRPCルーター
│   ├── db.ts              # データベースクエリ
│   ├── evaluation.ts      # AI評価ロジック
│   └── _core/             # コアシステム
├── drizzle/               # データベーススキーマ
├── shared/                # 共有型定義
├── storage/               # ストレージヘルパー
└── pr_images/             # PR画像
```

## 将来の計画

### 近日実装予定

- **AI面接対策機能（無料！）** - 求人情報と職務経歴書からAIが想定質問と回答例を自動生成
- **LinkedIn人材検索機能** - LinkedIn APIを使用して企業情報や人材情報を取得し、関連企業を提案
- **バッチ一括応募機能** - 複数企業への応募を一括で行える機能

### iOS化の検討

React Nativeを使用したiOSアプリ化を検討中です。モバイルファーストの設計により、スマートフォンでも快適に利用できるアプリケーションを目指します。

## 製作者情報

**製作者:** [@kojima920](https://github.com/kojima920)

**問い合わせ:** mk19830920@gmail.com

### 寄付先

このプロジェクトを気に入っていただけた場合は、以下の方法でサポートいただけると嬉しいです：

- **PayPal:** kojima1459
- **GitHub Sponsors:** [@kojima920](https://github.com/sponsors/kojima920)

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## 謝辞

このプロジェクトは[Manus](https://manus.im)のLLM API、Storage API、OAuth認証システムを使用して開発されました。Manusチームに感謝します。

---

Made with ❤️ by [@kojima920](https://github.com/kojima920)
