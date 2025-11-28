# 翻訳対応ドキュメント

## 概要

AI職務経歴書最適化メイカーは、完全な多言語対応を実現しています。現在、日本語（ja）と英語（en）に対応しており、言語切り替え時に全ページの全要素が自動的に翻訳されます。

## 実装済み言語

### 日本語（ja）
- **ファイル**: `client/src/locales/ja.json`
- **ステータス**: 完全対応
- **翻訳キー数**: 500+

### 英語（en）
- **ファイル**: `client/src/locales/en.json`
- **ステータス**: 完全対応
- **翻訳キー数**: 500+

## 翻訳対応済みページ

### 1. Home.tsx（ホームページ）
**翻訳対応範囲:**
- ヘッダー（ナビゲーション、ロゴ）
- キャッチコピー（「AI optimizes your resume based on job postings - the ultimate cheat tool!」）
- 入力セクション（Resume、Job Posting）
- テンプレート選択セクション（System Templates、My Templates、Template Management）
- 出力項目選択セクション（Summary、Career History、Motivation、Self PR、Why This Company、What to Achieve）
- カスタム項目追加セクション
- 文字数設定セクション（Character Settings）
- 生成ボタンとパターン数設定
- ダイアログ（API Key Not Set、Pattern Selection、Shortcuts、Save Confirmation、History）
- トースト通知（Success、Error、Warning）
- フッター（Links、Legal、Author & Donation）

**翻訳キー例:**
```json
{
  "home.items.summary": "Summary",
  "home.items.careerHistory": "Career History",
  "home.items.motivation": "Motivation",
  "home.items.selfPR": "Self PR",
  "home.items.whyThisCompany": "Why This Company",
  "home.items.whatToAchieve": "What to Achieve"
}
```

### 2. Guide.tsx（ガイドページ）
**翻訳対応範囲:**
- ページタイトル（「Guide & Tutorial」）
- 概要セクション
- 機能説明セクション（Basic Features、Advanced Features）
- 使い方セクション（How to Use）
- Tips & FAQ セクション
- 全ての見出しと説明文

**翻訳キー数**: 122+

### 3. Favorites.tsx（お気に入りページ）
**翻訳対応範囲:**
- ページタイトル（「Favorite Patterns」）
- フィルター機能
- パターン比較機能
- スコア表示
- 空状態メッセージ（「Please select a pattern from the left」）

### 4. ApiSettings.tsx（API設定ページ）
**翻訳対応範囲:**
- ページタイトル（「API Settings」）
- API プロバイダー選択（OpenAI、Gemini、Claude）
- API キー入力フォーム
- 保存ボタン
- API キー取得方法ガイド
- エラーメッセージ

### 5. Privacy.tsx（プライバシーポリシー）
**翻訳対応範囲:**
- ページタイトル（「Privacy Policy」）
- 最終更新日
- 全10セクション：
  1. Introduction（はじめに）
  2. Information We Collect（収集する情報）
  3. Purpose of Information Use（情報の利用目的）
  4. Information Protection（情報保護）
  5. Disclosure to Third Parties（第三者への開示）
  6. Data Retention Period（データ保持期間）
  7. User Rights（ユーザーの権利）
  8. Use of Cookies（Cookie の使用）
  9. Changes to Privacy Policy（プライバシーポリシーの変更）
  10. Contact Us（お問い合わせ）

**翻訳キー数**: 100+

### 6. Terms.tsx（利用規約）
**翻訳対応範囲:**
- ページタイトル（「Terms of Service」）
- 最終更新日
- 全10条：
  1. Service Overview（サービス概要）
  2. User Registration（ユーザー登録）
  3. Service Usage（サービスの利用）
  4. Intellectual Property Rights（知的財産権）
  5. User Responsibilities（ユーザーの責任）
  6. Limitation of Liability（責任制限）
  7. Disclaimer（免責事項）
  8. Service Termination（サービス終了）
  9. Modification of Terms（規約の変更）
  10. Governing Law（準拠法）

**翻訳キー数**: 80+

### 7. MyTemplates.tsx（テンプレート管理ページ）
**翻訳対応範囲:**
- ページタイトル（「Template Management」）
- テンプレート一覧表示
- テンプレート作成フォーム
- テンプレート編集フォーム
- 削除確認ダイアログ
- バリデーションエラーメッセージ
- トースト通知（Success、Error）

### 8. AnnouncementDialog.tsx（お知らせダイアログ）
**翻訳対応範囲:**
- ダイアログタイトル（「Upcoming Features」）
- 機能説明
- ステータスバッジ（Implemented、Planned）
- 優先度表示（Priority: High）
- 閉じるボタン

### 9. Footer.tsx（フッター）
**翻訳対応範囲:**
- セクション見出し（Links、Legal、Author & Donation）
- リンク（Home、Guide & Tutorial、My Templates、Favorites）
- 法的情報（Privacy Policy、Terms of Service、AdSense Application Guide）
- 著作者情報（Author、Contact、Donation）

## 翻訳システムの構成

### 1. i18next の初期化
**ファイル**: `client/src/_core/i18n.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ja from '../locales/ja.json';
import en from '../locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
    },
    lng: localStorage.getItem('language') || 'ja',
    fallbackLng: 'ja',
    interpolation: { escapeValue: false },
  });
```

### 2. useTranslation フックの使用
**パターン1: 単純なテキスト翻訳**
```tsx
const { t } = useTranslation();
<h1>{t('home.title')}</h1>
```

**パターン2: 配列の翻訳**
```tsx
const items = t('home.items', { returnObjects: true }) as string[];
items.map((item, index) => <li key={index}>{item}</li>)
```

**パターン3: 動的な翻訳キー**
```tsx
const message = t(`toast.${type}`); // type = 'success', 'error', etc.
```

### 3. LanguageSwitcher コンポーネント
**ファイル**: `client/src/components/LanguageSwitcher.tsx`

言語切り替えボタンを提供し、以下の機能を実装:
- 日本語/英語の切り替え
- localStorage への言語設定保存
- ページ全体の再レンダリング

## 翻訳キーの構造

翻訳キーは以下の階層構造で整理されています:

```
{
  "home": {
    "title": "...",
    "items": {
      "summary": "...",
      "careerHistory": "..."
    }
  },
  "guide": {
    "title": "...",
    "sections": {
      "overview": "..."
    }
  },
  "footer": {
    "links": {
      "home": "..."
    }
  }
}
```

## 翻訳品質保証

### 1. 翻訳の正確性
- 全翻訳は専門的な翻訳ツール（Claude、GPT-4）を使用して生成
- 文脈に応じた自然な翻訳を確認
- 技術用語の統一性を確保

### 2. UI/UX の一貫性
- 全ページで統一された翻訳用語を使用
- ボタン、ラベル、メッセージの翻訳を統一
- 言語切り替え時のレイアウト崩れを防止

### 3. テスト
- 全ページで日本語表示を確認
- 全ページで英語表示を確認
- 言語切り替え時の動作確認
- ブラウザコンソールでエラーがないことを確認

## 今後の拡張予定

### 1. 中国語（簡体字）対応
- **ファイル**: `client/src/locales/zh.json`
- **優先度**: 高
- **推定作業量**: 2-3 時間

### 2. 韓国語対応
- **ファイル**: `client/src/locales/ko.json`
- **優先度**: 中
- **推定作業量**: 2-3 時間

### 3. スペイン語対応
- **ファイル**: `client/src/locales/es.json`
- **優先度**: 低
- **推定作業量**: 2-3 時間

## 翻訳ファイルの管理

### ja.json の構造
```json
{
  "home": { ... },
  "guide": { ... },
  "favorites": { ... },
  "apiSettings": { ... },
  "privacy": { ... },
  "terms": { ... },
  "myTemplates": { ... },
  "announcement": { ... },
  "footer": { ... },
  "toast": { ... },
  "dialog": { ... }
}
```

### en.json の構造
ja.json と同じ構造を持ち、各キーに英語の翻訳を含む

## トラブルシューティング

### 問題: 翻訳が反映されない
**原因**: i18next が正しく初期化されていない、または翻訳ファイルが読み込まれていない

**解決策**:
1. ブラウザコンソールでエラーを確認
2. `client/src/_core/i18n.ts` の初期化を確認
3. 翻訳ファイルのパスが正しいことを確認

### 問題: 言語切り替え後にページが表示されない
**原因**: LanguageSwitcher コンポーネントの処理に問題がある

**解決策**:
1. ブラウザの開発者ツールで localStorage を確認
2. ページをリロードして言語設定を確認
3. LanguageSwitcher コンポーネントのロジックを確認

## 参考資料

- **i18next ドキュメント**: https://www.i18next.com/
- **react-i18next ドキュメント**: https://react.i18next.com/
- **翻訳キー命名規則**: camelCase を使用（例: `home.items.summary`）

## 変更履歴

### v1.0.0 (2025-01-26)
- 日本語（ja）と英語（en）の完全対応を実装
- 全ページの翻訳対応を完了
- i18next を使用した多言語システムを構築
- LanguageSwitcher コンポーネントを実装
